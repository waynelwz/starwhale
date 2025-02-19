/*
 * Copyright 2022 Starwhale, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.starwhale.mlops.schedule.impl.contianer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import ai.starwhale.mlops.common.Constants;
import ai.starwhale.mlops.common.proxy.WebServerInTask;
import ai.starwhale.mlops.configuration.RunTimeProperties;
import ai.starwhale.mlops.configuration.RunTimeProperties.Pypi;
import ai.starwhale.mlops.configuration.RunTimeProperties.RunConfig;
import ai.starwhale.mlops.configuration.security.TaskTokenValidator;
import ai.starwhale.mlops.domain.dataset.bo.DataSet;
import ai.starwhale.mlops.domain.job.JobType;
import ai.starwhale.mlops.domain.job.bo.Job;
import ai.starwhale.mlops.domain.job.bo.JobRuntime;
import ai.starwhale.mlops.domain.job.spec.Env;
import ai.starwhale.mlops.domain.job.spec.StepSpec;
import ai.starwhale.mlops.domain.job.step.bo.Step;
import ai.starwhale.mlops.domain.model.Model;
import ai.starwhale.mlops.domain.project.bo.Project;
import ai.starwhale.mlops.domain.runtime.RuntimeResource;
import ai.starwhale.mlops.domain.runtime.RuntimeService;
import ai.starwhale.mlops.domain.system.resourcepool.bo.ResourcePool;
import ai.starwhale.mlops.domain.task.bo.ResultPath;
import ai.starwhale.mlops.domain.task.bo.Task;
import ai.starwhale.mlops.domain.task.bo.TaskRequest;
import ai.starwhale.mlops.domain.task.status.TaskStatus;
import ai.starwhale.mlops.schedule.impl.container.impl.SwCliModelHandlerContainerSpecification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SwCliModelHandlerContainerSpecificationTest {

    static final String CONDA_RC = "channels:\n"
            + "  - defaults\n"
            + "show_channel_urls: true\n"
            + "default_channels:\n"
            + "  - http://nexus.starwhale.ai/repository/anaconda/main\n"
            + "  - http://nexus.starwhale.ai/repository/anaconda/r\n"
            + "  - http://nexus.starwhale.ai/repository/anaconda/msys2\n"
            + "custom_channels:\n"
            + "  conda-forge: http://nexus.starwhale.ai/repository/conda-cloud\n"
            + "  nvidia: http://nexus.starwhale.ai/repository/conda-cloud\n"
            + "ssl_verify: false\n"
            + "default_threads: 10";
    Map<String, String> expectedEnvsDev = new HashMap<>() {
        {
            put("SW_RUNTIME_PYTHON_VERSION", "3.10");
            put("SW_VERSION", "0.5.1");
            put("SW_ENV", "test");
            put("SW_POD_NAME", "1");
            put("SW_PROJECT", "project");
            put("SW_PROJECT_URI", "http://instanceUri/project/100");
            put("DATASET_CONSUMPTION_BATCH_SIZE", "50");
            put("SW_DATASET_URI", "http://instanceUri/project/103/dataset/swdsN/version/swdsV");
            put("SW_MODEL_URI", "http://instanceUri/project/101/model/swmpN/version/swmpV");
            put("SW_RUNTIME_URI", "http://instanceUri/project/102/runtime/swrtN/version/swrtV");
            put("SW_MODEL_VERSION", "swmpN/version/swmpV");
            put("SW_RUNTIME_VERSION", "swrtN/version/swrtV");
            put("SW_TASK_INDEX", "1");
            put("SW_TASK_NUM", "1");
            put("SW_PYPI_INDEX_URL", "indexU");
            put("SW_PYPI_EXTRA_INDEX_URL", "extraU");
            put("SW_PYPI_TRUSTED_HOST", "trustedH");
            put("SW_JOB_VERSION", "juuid");
            put("SW_TOKEN", "tt");
            put("SW_INSTANCE_URI", "http://instanceUri");
            put("SW_TASK_STEP", "cmp");
            put("NVIDIA_VISIBLE_DEVICES", "");
            put("SW_PYPI_RETRIES", "1");
            put("SW_PYPI_TIMEOUT", "2");
            put("SW_RUN_HANDLER", null);
            put("SW_DEV_TOKEN", null);
            put("SW_DEV_PORT", "8000");
            put("SW_TASK_EXTRA_CMD_ARGS", "--a 11");
            put("SW_CONDA_CONFIG", "channels:\n"
                    + "  - defaults\n"
                    + "show_channel_urls: true\n"
                    + "default_channels:\n"
                    + "  - http://nexus.starwhale.ai/repository/anaconda/main\n"
                    + "  - http://nexus.starwhale.ai/repository/anaconda/r\n"
                    + "  - http://nexus.starwhale.ai/repository/anaconda/msys2\n"
                    + "custom_channels:\n"
                    + "  conda-forge: http://nexus.starwhale.ai/repository/conda-cloud\n"
                    + "  nvidia: http://nexus.starwhale.ai/repository/conda-cloud\n"
                    + "ssl_verify: false\n"
                    + "default_threads: 10");
        }
    };

    Map<String, String> expectedEnvsRun = new HashMap<>() {
        {
            put("SW_RUNTIME_PYTHON_VERSION", "3.10");
            put("SW_VERSION", "0.5.1");
            put("SW_ENV", "test");
            put("SW_POD_NAME", "1");
            put("SW_PROJECT", "project");
            put("SW_PROJECT_URI", "http://instanceUri/project/100");
            put("DATASET_CONSUMPTION_BATCH_SIZE", "50");
            put("SW_DATASET_URI", "http://instanceUri/project/103/dataset/swdsN/version/swdsV");
            put("SW_MODEL_URI", "http://instanceUri/project/101/model/swmpN/version/swmpV");
            put("SW_RUNTIME_URI", "http://instanceUri/project/102/runtime/swrtN/version/swrtV");
            put("SW_MODEL_VERSION", "swmpN/version/swmpV");
            put("SW_RUNTIME_VERSION", "swrtN/version/swrtV");
            put("SW_TASK_INDEX", "1");
            put("SW_TASK_NUM", "1");
            put("SW_PYPI_INDEX_URL", "indexU");
            put("SW_PYPI_EXTRA_INDEX_URL", "extraU");
            put("SW_PYPI_TRUSTED_HOST", "trustedH");
            put("SW_JOB_VERSION", "juuid");
            put("SW_TOKEN", "tt");
            put("SW_INSTANCE_URI", "http://instanceUri");
            put("SW_TASK_STEP", "cmp");
            put("NVIDIA_VISIBLE_DEVICES", "");
            put("SW_PYPI_RETRIES", "1");
            put("SW_PYPI_TIMEOUT", "2");
            put("SW_RUN_HANDLER", null);
            put("SW_TASK_EXTRA_CMD_ARGS", "--a 11");
            put("SW_CONDA_CONFIG", "channels:\n"
                    + "  - defaults\n"
                    + "show_channel_urls: true\n"
                    + "default_channels:\n"
                    + "  - http://nexus.starwhale.ai/repository/anaconda/main\n"
                    + "  - http://nexus.starwhale.ai/repository/anaconda/r\n"
                    + "  - http://nexus.starwhale.ai/repository/anaconda/msys2\n"
                    + "custom_channels:\n"
                    + "  conda-forge: http://nexus.starwhale.ai/repository/conda-cloud\n"
                    + "  nvidia: http://nexus.starwhale.ai/repository/conda-cloud\n"
                    + "ssl_verify: false\n"
                    + "default_threads: 10");
        }
    };


    @Test
    public void testEnvs() throws JsonProcessingException {
        RunTimeProperties runTimeProperties = new RunTimeProperties(
                "", new RunConfig(), new RunConfig(), new Pypi("indexU", "extraU", "trustedH", 1, 2), CONDA_RC);
        TaskTokenValidator taskTokenValidator = mock(TaskTokenValidator.class);
        when(taskTokenValidator.getTaskToken(any(), any())).thenReturn("tt");
        var webServerInTask = mock(WebServerInTask.class);
        when(webServerInTask.generateServiceRoot(1L, 1234)).thenReturn("/gateway/1/1234");
        SwCliModelHandlerContainerSpecification containerSpecification = new SwCliModelHandlerContainerSpecification(
                "http://instanceUri",
                8000,
                50,
                runTimeProperties,
                taskTokenValidator,
                webServerInTask,
                mockTask(false)
        );
        assertMapEquals(expectedEnvsRun, containerSpecification.getContainerEnvs());
        Assertions.assertIterableEquals(List.of("run"), Arrays.asList(containerSpecification.getCmd().getCmd()));

        var task = mockTask(false);
        // make the expose port non-zero
        task.getStep().getSpec().setExpose(1234);
        var csWithExposed = new SwCliModelHandlerContainerSpecification(
                "http://instanceUri",
                8000,
                50,
                runTimeProperties,
                taskTokenValidator,
                webServerInTask,
                task
        );

        var envWithSourceRoot = new HashMap<>(expectedEnvsRun);
        envWithSourceRoot.put("SW_ONLINE_SERVING_ROOT_PATH", "/gateway/1/1234");
        envWithSourceRoot.put("GRADIO_ROOT_PATH", "/gateway/1/1234");
        assertMapEquals(envWithSourceRoot, csWithExposed.getContainerEnvs());
    }

    @Test
    public void testDevMode() throws IOException {
        RunTimeProperties runTimeProperties = new RunTimeProperties(
                "", new RunConfig(), new RunConfig(), new Pypi("indexU", "extraU", "trustedH", 1, 2), CONDA_RC);
        TaskTokenValidator taskTokenValidator = mock(TaskTokenValidator.class);
        when(taskTokenValidator.getTaskToken(any(), any())).thenReturn("tt");
        var webServerInTask = mock(WebServerInTask.class);
        SwCliModelHandlerContainerSpecification containerSpecification = new SwCliModelHandlerContainerSpecification(
                "http://instanceUri",
                8000,
                50,
                runTimeProperties,
                taskTokenValidator,
                webServerInTask,
                mockTask(true)
        );
        assertMapEquals(expectedEnvsDev, containerSpecification.getContainerEnvs());
        Assertions.assertIterableEquals(List.of("dev"), Arrays.asList(containerSpecification.getCmd().getCmd()));
    }

    private void assertMapEquals(Map<String, String> expectedEnvs, Map<String, String> actualEnv) {
        Assertions.assertEquals(expectedEnvs.size(), actualEnv.size());
        expectedEnvs.forEach((k, v) -> Assertions.assertEquals(v, actualEnv.get(k)));
    }

    private Task mockTask(boolean devMode) throws JsonProcessingException {
        List<StepSpec> stepSpecs = Constants.yamlMapper.readValue(
                "- concurrency: 1\n"
                        + "  needs: []\n"
                        + "  resources: []\n"
                        + "  env: null\n"
                        + "  replicas: 1\n"
                        + "  expose: 0\n"
                        + "  virtual: false\n"
                        + "  job_name: th:f\n"
                        + "  name: cmp\n"
                        + "  show_name: cmp\n"
                        + "  require_dataset: false\n"
                        + "  parameters_sig:\n"
                        + "    - name: a\n"
                        + "      required: true\n"
                        + "    - name: b\n"
                        + "      required: false\n"
                        + "    - name: c\n"
                        + "      required: false\n"
                        + "  ext_cmd_args: '--a 11'",
                new TypeReference<>() {
                }
        );
        Job job = Job.builder()
                .id(1L)
                .model(Model.builder().name("swmpN").version("swmpV").projectId(101L).build())
                .jobRuntime(JobRuntime.builder()
                        .name("swrtN")
                        .version("swrtV")
                        .image("imageRT")
                        .projectId(102L)
                        .manifest(new RuntimeService.RuntimeManifest(
                                "",
                                new RuntimeService.RuntimeManifest.Environment(
                                        "3.10",
                                        new RuntimeService.RuntimeManifest.Lock("0.5.1")
                                ), null
                        ))
                        .build())
                .type(JobType.EVALUATION)
                .devMode(devMode)
                .uuid("juuid")
                .dataSets(
                        List.of(DataSet.builder()
                                .indexTable("it").path("swds_path").name("swdsN").version("swdsV")
                                .size(300L).projectId(103L).build()))
                .stepSpecs(stepSpecs)
                .resourcePool(ResourcePool.builder().name("bj01").build())
                .project(Project.builder().name("project").id(100L).build())
                .build();
        Step step = new Step();
        step.setId(1L);
        step.setName("cmp");
        step.setJob(job);
        step.setResourcePool(job.getResourcePool());
        step.setSpec(stepSpecs.get(0));
        return Task.builder()
                .id(1L)
                .taskRequest(TaskRequest.builder().index(1).total(2).build())
                .step(step)
                .resultRootPath(new ResultPath("task"))
                .uuid("uuid")
                .status(TaskStatus.READY)
                .taskRequest(TaskRequest.builder()
                        .index(1)
                        .total(1)
                        .runtimeResources(List.of(new RuntimeResource("cpu", 1f, 1f)))
                        .env(List.of(Env.builder().name("SW_ENV").value("test").build()))
                        .build())
                .build();
    }

}
