from __future__ import annotations

import os
import typing as t
from typing import Any
from dataclasses import dataclass

import torch
from transformers import (
    Trainer,
    AutoModel,
    AutoConfig,
    AutoTokenizer,
    PreTrainedTokenizer,
    DataCollatorForSeq2Seq,
    Seq2SeqTrainingArguments,
)
from transformers.modeling_utils import unwrap_model, PreTrainedModel

from starwhale import Dataset, finetune

try:
    from .consts import PT_DIR, BASE_MODEL_DIR
except ImportError:
    from consts import PT_DIR, BASE_MODEL_DIR

# fork from https://github.com/THUDM/ChatGLM3/tree/main/finetune_chatmodel_demo


@finetune(
    resources={"nvidia.com/gpu": 1},
    require_train_datasets=True,
    model_modules=["evaluation", "finetune"],
)
def p_tuning_v2_finetune(train_datasets: t.List[Dataset]) -> None:
    # TODO: support multi train datasets
    train_dataset = train_datasets[0]

    config = AutoConfig.from_pretrained(
        BASE_MODEL_DIR,
        trust_remote_code=True,
        pre_seq_len=int(os.environ.get("PT_PRE_SEQ_LEN", "128")),
        prefix_projection=False,
    )
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_DIR, trust_remote_code=True)
    model = AutoModel.from_pretrained(
        BASE_MODEL_DIR, config=config, trust_remote_code=True
    )

    # support finetuning from p-tuned model
    pt_bin_path = PT_DIR / PrefixTrainer.WEIGHTS_NAME
    if pt_bin_path.exists():
        print(f"load p-tuning model: {pt_bin_path}")
        prefix_state_dict = torch.load(pt_bin_path)
        new_prefix_state_dict = {}
        for k, v in prefix_state_dict.items():
            if k.startswith("transformer.prefix_encoder."):
                new_prefix_state_dict[k[len("transformer.prefix_encoder.") :]] = v
        model.transformer.prefix_encoder.load_state_dict(new_prefix_state_dict)
        model.transformer.prefix_encoder.load_state_dict(new_prefix_state_dict)

    print("Quantized to 4bit...")
    model = model.quantize(4).half()
    model.transformer.prefix_encoder.float()
    model.gradient_checkpointing_enable()
    model.enable_input_require_grads()

    trainer = PrefixTrainer(
        model=model,
        tokenizer=tokenizer,
        args=Seq2SeqTrainingArguments(
            output_dir=str(PT_DIR),
            report_to="none",
            logging_steps=10,
            per_device_train_batch_size=1,  # more batch size will cause OOM
            gradient_accumulation_steps=16,
            save_strategy="no",  # no need to save checkpoint for finetune
            learning_rate=2e-2,
            max_steps=int(os.environ.get("MAX_STEPS", 18)),
            num_train_epochs=int(os.environ.get("NUM_TRAIN_EPOCHS", 2)),
            gradient_checkpointing=False,
            remove_unused_columns=False,
        ),
        train_dataset=train_dataset.to_pytorch(
            transform=MultiTurnDataTransform(
                tokenizer=tokenizer,
                max_seq_len=int(os.environ.get("MAX_SEQ_LEN", 2048)),
            )
        ),
        data_collator=DataCollatorForSeq2Seq(
            tokenizer=tokenizer,
            model=model,
            label_pad_token_id=-100,
            pad_to_multiple_of=None,
            padding=False,
        ),
        save_changed=True,
    )

    print("start model training...")
    train_result = trainer.train(resume_from_checkpoint=None)
    print(train_result.metrics)
    trainer.save_state()
    trainer.save_model()


class PrefixTrainer(Trainer):
    WEIGHTS_NAME = "pytorch_model.bin"
    TRAINING_ARGS_NAME = "training_args.bin"

    def __init__(self, *args, save_changed=False, **kwargs):
        self.save_changed = save_changed
        super().__init__(*args, **kwargs)

    def _save(self, output_dir: t.Optional[str] = None, state_dict=None):
        # If we are executing this function, we are the process zero, so we don't check for that.
        output_dir = output_dir if output_dir is not None else self.args.output_dir
        os.makedirs(output_dir, exist_ok=True)
        print(f"Saving model checkpoint to {output_dir}")
        # Save a trained model and configuration using `save_pretrained()`.
        # They can then be reloaded using `from_pretrained()`
        if not isinstance(self.model, PreTrainedModel):
            if isinstance(unwrap_model(self.model), PreTrainedModel):
                if state_dict is None:
                    state_dict = self.model.state_dict()
                unwrap_model(self.model).save_pretrained(
                    output_dir, state_dict=state_dict
                )
            else:
                print(
                    "Trainer.model is not a `PreTrainedModel`, only saving its state dict."
                )
                if state_dict is None:
                    state_dict = self.model.state_dict()
                torch.save(state_dict, os.path.join(output_dir, self.WEIGHTS_NAME))
        else:
            if self.save_changed:
                print("Saving PrefixEncoder")
                state_dict = self.model.state_dict()
                filtered_state_dict = {}
                for k, v in self.model.named_parameters():
                    if v.requires_grad:
                        filtered_state_dict[k] = state_dict[k]
                self.model.save_pretrained(output_dir, state_dict=filtered_state_dict)
            else:
                print("Saving the whole model")
                self.model.save_pretrained(output_dir, state_dict=state_dict)
        if self.tokenizer is not None:
            self.tokenizer.save_pretrained(output_dir)

        # Good practice: save your training arguments together with the trained model
        torch.save(self.args, os.path.join(output_dir, self.TRAINING_ARGS_NAME))


@dataclass
class MultiTurnDataTransform:
    tokenizer: PreTrainedTokenizer
    max_seq_len: int

    ignore_index = -100

    def __call__(self, example: t.Dict) -> Any:
        # belle_chat_random_10k dataset: https://cloud.starwhale.cn/projects/401/datasets/164/versions/226/files
        tokens = [
            self.tokenizer.get_command("[gMASK]"),
            self.tokenizer.get_command("sop"),
        ]
        loss_masks = [0, 0]

        for message in example["conversations"]:
            # belle roles: human and gpt
            # ChatGLM3 roles: user and assistant
            _role = "user" if message["from"] == "human" else "assistant"
            _message_tokens = self.tokenizer.build_single_message(
                _role, "", message["value"]
            )
            tokens.extend(_message_tokens)
            loss_masks.extend([0] * len(_message_tokens))

        tokens.extend([self.tokenizer.eos_token_id])
        loss_masks.extend([0])

        # labels are used inside the model
        target_based_loss_mask = [False] + loss_masks[:-1]
        labels = [
            (t if m else self.ignore_index)
            for t, m in zip(tokens, target_based_loss_mask)
        ]

        tokens = tokens[: self.max_seq_len]
        labels = labels[: self.max_seq_len]
        tokens += [self.tokenizer.pad_token_id] * (self.max_seq_len - len(tokens))
        labels += [self.ignore_index] * (self.max_seq_len - len(labels))

        return {"input_ids": tokens, "labels": labels}
