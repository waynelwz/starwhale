import os
import time
import queue
import random
import shutil
import typing as t
import tempfile
import threading
from itertools import chain
from collections import defaultdict
from unittest.mock import patch, MagicMock

from requests_mock import Mocker
from pyfakefs.fake_filesystem_unittest import TestCase

from tests import ROOT_DIR
from starwhale.utils import config
from starwhale.consts import HTTPMethod, SWDSBackendType
from starwhale.utils.fs import ensure_dir
from starwhale.consts.env import SWEnv
from starwhale.utils.error import NotFoundError, ParameterError
from starwhale.base.data_type import Link, Image, GrayscaleImage
from starwhale.base.blob.store import LocalFileStore
from starwhale.base.uri.resource import Resource, ResourceType
from starwhale.core.dataset.model import DatasetSummary
from starwhale.core.dataset.store import (
    ObjectStore,
    S3Connection,
    DatasetStorage,
    SignedUrlBackend,
    LocalFSStorageBackend,
)
from starwhale.api._impl.data_store import RemoteDataStore
from starwhale.core.dataset.tabular import (
    StandaloneTDSC,
    TabularDatasetRow,
    get_dataset_consumption,
)
from starwhale.api._impl.dataset.loader import DataRow, DataLoader, get_data_loader


class TestDataLoader(TestCase):
    def setUp(self) -> None:
        self.setUpPyfakefs()
        self.dataset_uri = Resource(
            "mnist/version/1122334455667788",
            typ=ResourceType.dataset,
        )
        self.swds_dir = os.path.join(ROOT_DIR, "data", "dataset", "swds")
        self.fs.add_real_directory(self.swds_dir)

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    def test_range_match(self, m_scan_id: MagicMock, m_summary: MagicMock) -> None:
        m_summary.return_value = DatasetSummary(rows=1)
        m_scan_id.return_value = [{"id": "path/0"}]
        consumption = get_dataset_consumption(
            self.dataset_uri,
            session_id="10",
            session_start="path/0",
            session_end=None,
        )
        with self.assertRaises(ParameterError):
            get_data_loader(self.dataset_uri, session_consumption=consumption)

        with self.assertRaises(ParameterError):
            get_data_loader(
                self.dataset_uri, session_consumption=consumption, start="path/1"
            )

        with self.assertRaises(ParameterError):
            get_data_loader(
                self.dataset_uri, session_consumption=consumption, end="path/1"
            )

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_user_raw_local_store(
        self, m_scan: MagicMock, m_scan_id: MagicMock, m_summary: MagicMock
    ) -> None:
        m_summary.return_value = DatasetSummary(rows=1)
        m_scan_id.return_value = [{"id": "path/0"}]

        consumption = get_dataset_consumption(self.dataset_uri, session_id="1")
        loader = get_data_loader(self.dataset_uri, session_consumption=consumption)
        assert isinstance(loader, DataLoader)
        assert isinstance(loader.session_consumption, StandaloneTDSC)

        raw_data_fpath = os.path.join(ROOT_DIR, "data", "dataset", "mnist", "data")
        self.fs.add_real_file(raw_data_fpath)
        m_scan.return_value = [
            TabularDatasetRow(
                features={
                    "image": GrayscaleImage(
                        link=Link(
                            raw_data_fpath,
                            offset=32,
                            size=784,
                            _swds_bin_offset=0,
                            _swds_bin_size=8160,
                        )
                    ),
                    "label": 0,
                },
                id="path/0",
            )
        ]

        ObjectStore._stores = {}

        rows = list(loader)
        assert len(rows) == 1

        _idx, _data = rows[0]
        assert _idx == "path/0"
        assert _data["label"] == 0

        assert len(_data["image"].to_bytes()) == 28 * 28
        assert isinstance(_data["image"], Image)

        key = "local."

        assert list(ObjectStore._stores.keys()) == [key]
        assert ObjectStore._stores[key].backend.kind == SWDSBackendType.LocalFS
        assert not ObjectStore._stores[key].key_prefix

        loader = get_data_loader("mnist/version/1122334455667788")
        assert isinstance(loader, DataLoader)
        assert loader.session_consumption is None
        rows = list(loader)
        assert len(rows) == 1

        _idx, _data = rows[0]
        assert _idx == "path/0"
        assert _data["label"] == 0

    @patch.dict(os.environ, {})
    @patch("starwhale.core.dataset.store.boto3.resource")
    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_user_raw_remote_store(
        self,
        m_scan: MagicMock,
        m_scan_id: MagicMock,
        m_summary: MagicMock,
        m_boto3: MagicMock,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmpdirname:
            config._config = {}
            os.environ["SW_CLI_CONFIG"] = tmpdirname + "/config.yaml"
            m_summary.return_value = DatasetSummary(rows=4)
            m_scan_id.return_value = [{"id": i} for i in range(0, 4)]

            snapshot_workdir = DatasetStorage(self.dataset_uri).snapshot_workdir
            ensure_dir(snapshot_workdir)
            config.update_swcli_config(
                **{
                    "link_auths": [
                        {
                            "type": "s3",
                            "ak": "11",
                            "sk": "11",
                            "bucket": "starwhale",
                            "endpoint": "http://127.0.0.1:9000",
                        },
                        {
                            "type": "s3",
                            "ak": "11",
                            "sk": "11",
                            "endpoint": "http://127.0.0.1:19000",
                            "bucket": "starwhale",
                        },
                        {
                            "type": "s3",
                            "ak": "11",
                            "sk": "11",
                            "endpoint": "http://127.0.0.1",
                            "bucket": "starwhale",
                        },
                    ]
                }
            )
            S3Connection.connections_config = []

            consumption = get_dataset_consumption(self.dataset_uri, session_id="2")
            loader = get_data_loader(self.dataset_uri, session_consumption=consumption)
            assert isinstance(loader, DataLoader)
            assert isinstance(loader.session_consumption, StandaloneTDSC)
            assert loader.session_consumption._todo_queue.qsize() == 1

            version = "1122334455667788"

            m_scan.return_value = [
                TabularDatasetRow(
                    features={
                        "image": GrayscaleImage(
                            link=Link(
                                f"s3://127.0.0.1:9000/starwhale/project/2/dataset/11/{version}",
                                offset=16,
                                size=784,
                            )
                        ),
                        "label": 0,
                    },
                    id=0,
                ),
                TabularDatasetRow(
                    features={
                        "image": GrayscaleImage(
                            link=Link(
                                f"s3://127.0.0.1:19000/starwhale/project/2/dataset/11/{version}",
                                offset=16,
                                size=784,
                            )
                        ),
                        "label": 1,
                    },
                    id=1,
                ),
                TabularDatasetRow(
                    features={
                        "image": GrayscaleImage(
                            link=Link(
                                f"s3://127.0.0.1/starwhale/project/2/dataset/11/{version}",
                                offset=16,
                                size=784,
                            )
                        ),
                        "label": 1,
                    },
                    id=2,
                ),
                TabularDatasetRow(
                    features={
                        "image": GrayscaleImage(
                            link=Link(
                                f"s3://username:password@127.0.0.1:29000/starwhale/project/2/dataset/11/{version}",
                                offset=16,
                                size=784,
                            )
                        ),
                        "label": 1,
                    },
                    id=3,
                ),
            ]

            raw_data_fpath = os.path.join(ROOT_DIR, "data", "dataset", "mnist", "data")
            self.fs.add_real_file(raw_data_fpath)
            with open(raw_data_fpath, "rb") as f:
                raw_content = f.read(-1)

            m_boto3.return_value = MagicMock(
                **{
                    "Object.return_value": MagicMock(
                        **{
                            "get.return_value": {
                                "Body": MagicMock(**{"read.return_value": raw_content}),
                                "ContentLength": len(raw_content),
                            }
                        }
                    )
                }
            )

            ObjectStore._stores = {}

            rows = list(loader)
            assert len(rows) == 4
            assert {r[0] for r in rows} == set(range(4))

            _data = rows[0][1]
            assert isinstance(_data["label"], int)
            assert isinstance(_data["image"], Image)
            assert len(_data["image"].to_bytes()) == 28 * 28
            assert isinstance(_data["image"].to_bytes(), bytes)

            assert len(ObjectStore._stores) == 4
            assert (
                ObjectStore._stores["local.s3.s3://127.0.0.1/starwhale/"].backend.kind
                == SWDSBackendType.S3
            )
            assert (
                ObjectStore._stores["local.s3.s3://127.0.0.1:9000/starwhale/"].bucket
                == "starwhale"
            )

            loader = get_data_loader(self.dataset_uri)
            assert isinstance(loader, DataLoader)
            assert loader.session_consumption is None
            assert len(list(loader)) == 4

    @Mocker()
    @patch("starwhale.utils.config.load_swcli_config")
    @patch("starwhale.core.dataset.model.CloudDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_swds_bin_s3(
        self,
        rm: Mocker,
        m_scan: MagicMock,
        m_scan_id: MagicMock,
        m_summary: MagicMock,
        m_conf: MagicMock,
    ) -> None:
        m_conf.return_value = {
            "instances": {
                "foo": {"uri": "http://127.0.0.1:1234", "sw_token": "token"},
                "local": {"uri": "local"},
            },
            "storage": {"root": tempfile.gettempdir()},
        }
        rm.get(
            "http://127.0.0.1:1234/api/v1/project/self",
            json={"data": {"id": 1, "name": "project"}},
        )
        m_summary.return_value = DatasetSummary(rows=1)
        m_scan_id.return_value = [{"id": 0}]
        version = "1122334455667788"
        dataset_uri = Resource(
            f"http://127.0.0.1:1234/project/1/dataset/mnist/version/{version}",
            typ=ResourceType.dataset,
            refine=False,
        )

        os.environ[SWEnv.instance_token] = "123"
        consumption = get_dataset_consumption(self.dataset_uri, session_id="5")
        loader = get_data_loader(dataset_uri, session_consumption=consumption)
        assert isinstance(loader, DataLoader)
        assert isinstance(loader.session_consumption, StandaloneTDSC)
        assert isinstance(
            loader.tabular_dataset._ds_wrapper._data_store, RemoteDataStore
        )

        fname = "data_ubyte_0.swds_bin"
        m_scan.return_value = [
            TabularDatasetRow(
                features={
                    "image": GrayscaleImage(
                        link=Link(
                            fname,
                            offset=32,
                            size=784,
                            _swds_bin_offset=0,
                            _swds_bin_size=8160,
                        )
                    ),
                    "label": 0,
                },
                id=0,
            )
        ]

        with open(os.path.join(self.swds_dir, fname), "rb") as f:
            swds_content = f.read(-1)

        signed_url = "http://minio/signed/path/file"
        rm.post(
            "http://127.0.0.1:1234/api/v1/filestorage/sign-links",
            json={"data": {fname: signed_url}},
        )
        rm.get(
            signed_url,
            content=swds_content,
        )

        ObjectStore._stores = {}

        rows = list(loader)
        assert len(rows) == 1
        _idx, _data = rows[0]
        assert _idx == 0
        assert _data["label"] == 0

        assert len(_data["image"].to_bytes()) == 28 * 28
        assert isinstance(_data["image"], Image)

        assert list(ObjectStore._stores.keys()) == ["cloud://foo."]
        backend = ObjectStore._stores["cloud://foo."].backend
        assert isinstance(backend, SignedUrlBackend)
        assert backend.kind == SWDSBackendType.SignedUrl

        assert ObjectStore._stores["cloud://foo."].bucket == ""
        assert ObjectStore._stores["cloud://foo."].key_prefix == ""

    @patch.dict(os.environ, {})
    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_swds_bin_local_fs(self, m_scan: MagicMock, m_summary: MagicMock) -> None:
        m_summary.return_value = DatasetSummary(
            rows=2,
            increased_rows=2,
        )
        loader = get_data_loader(self.dataset_uri)
        assert isinstance(loader, DataLoader)

        bf = LocalFileStore().put(os.path.join(self.swds_dir, "data_ubyte_0.swds_bin"))
        m_scan.return_value = [
            TabularDatasetRow(
                features={
                    "image": GrayscaleImage(
                        link=Link(
                            bf.hash,
                            offset=32,
                            size=784,
                            _swds_bin_offset=0,
                            _swds_bin_size=8160,
                        )
                    ),
                    "label": 0,
                },
                id=0,
            ),
            TabularDatasetRow(
                features={
                    "image": GrayscaleImage(
                        link=Link(
                            bf.hash,
                            offset=32,
                            size=784,
                            _swds_bin_offset=0,
                            _swds_bin_size=8160,
                        )
                    ),
                    "label": 1,
                },
                id=1,
            ),
        ]

        ObjectStore._stores = {}

        rows = list(loader)
        assert len(rows) == 2

        assert {rows[0][0], rows[1][0]} == {0, 1}

        _data = rows[0][1]
        assert isinstance(_data["label"], int)
        assert isinstance(_data["image"], Image)
        assert len(_data["image"].to_bytes()) == 784
        assert isinstance(_data["image"].to_bytes(), bytes)

        key = "local."
        assert list(ObjectStore._stores.keys()) == [key]
        backend = ObjectStore._stores[key].backend
        assert isinstance(backend, LocalFSStorageBackend)
        assert backend.kind == SWDSBackendType.LocalFS

    @Mocker()
    @patch.dict(os.environ, {"SW_TOKEN": "a", "SW_POD_NAME": "b"})
    @patch("starwhale.utils.config.load_swcli_config")
    @patch("starwhale.core.dataset.model.CloudDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan_batch")
    @patch("starwhale.core.dataset.tabular.TabularDatasetSessionConsumption")
    def test_remote_batch_sign(
        self,
        rm: Mocker,
        m_sc: MagicMock,
        m_scan_batch: MagicMock,
        m_summary: MagicMock,
        m_conf: MagicMock,
    ) -> None:
        m_conf.return_value = {
            "instances": {
                "foo": {"uri": "http://localhost", "sw_token": "token"},
                "local": {"uri": "local"},
            },
        }
        rm.get(
            "http://localhost/api/v1/project/x",
            json={"data": {"id": 1, "name": "x"}},
        )
        rm.get("http://localhost/api/v1/project/1/dataset/mnist", json={})
        m_summary.return_value = DatasetSummary(rows=4)
        tdsc = m_sc()
        tdsc.get_scan_range.side_effect = [["a", "e"]] + [None] * 120
        tdsc.batch_size = 20
        tdsc.session_start = "a"
        tdsc.session_end = "e"
        dataset_uri = Resource(
            "http://localhost/projects/x/datasets/mnist/versions/1122",
            typ=ResourceType.dataset,
        )
        m_scan_batch.return_value = [
            [
                TabularDatasetRow(
                    id="a",
                    features={
                        "image": Image(
                            link=Link(
                                "l11",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                        "label": Image(
                            link=Link(
                                "l1",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                    },
                ),
                TabularDatasetRow(
                    id="b",
                    features={
                        "image": Image(
                            link=Link(
                                "l12",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                        "label": Image(
                            link=Link(
                                "l2",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                    },
                ),
            ],
            [
                TabularDatasetRow(
                    id="c",
                    features={
                        "image": Image(
                            link=Link(
                                "l13",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                        "label": Image(
                            link=Link(
                                "l3",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                    },
                ),
                TabularDatasetRow(
                    id="d",
                    features={
                        "image": Image(
                            link=Link(
                                "l14",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                        "label": Image(
                            link=Link(
                                "l4",
                                offset=32,
                                size=784,
                                _swds_bin_offset=0,
                                _swds_bin_size=8160,
                            )
                        ),
                    },
                ),
            ],
        ]

        _uri_dict = {
            "l1": "http://l1/get-file",
            "l2": "http://l2/get-file",
            "l3": "http://l3/get-file",
            "l4": "http://l4/get-file",
            "l11": "http://l11/get-file",
            "l12": "http://l12/get-file",
            "l13": "http://l13/get-file",
            "l14": "http://l14/get-file",
        }

        raw_content = b"abcdefg"
        req_get_file = rm.register_uri(HTTPMethod.GET, "/get-file", content=raw_content)
        rm.post(
            "http://localhost/api/v1/filestorage/sign-links",
            json={"data": _uri_dict},
        )

        loader = get_data_loader(
            dataset_uri,
            start="a",
            end="e",
            session_consumption=tdsc,
            field_transformer={"image": "img"},
        )
        _label_uris_map = {}
        for _, data in loader:
            self.assertEqual(raw_content, data["img"].to_bytes())
            _label_uris_map[data["label"].link.uri] = data["label"].link._signed_uri
            _label_uris_map[data["img"].link.uri] = data["img"].link._signed_uri
            self.assertEqual(
                data["label"].link._signed_uri,
                _uri_dict.get(data["label"].link.uri),
            )
            self.assertEqual(
                data["img"].link._signed_uri,
                _uri_dict.get(data["img"].link.uri),
            )

        self.assertEqual(req_get_file.call_count, 8)
        self.assertEqual(len(_label_uris_map), 8)

    def test_data_row(self) -> None:
        dr = DataRow(index=1, features={"data": Image(), "label": 1})
        index, data = dr
        assert index == 1
        assert isinstance(data["data"], Image)
        assert data["label"] == 1
        assert dr[0] == 1
        assert len(dr) == 2

        dr_another = DataRow(index=2, features={"data": Image(), "label": 2})
        assert dr < dr_another
        assert dr != dr_another

        dr_third = DataRow(index=1, features={"data": Image(fp=b""), "label": 10})
        assert dr >= dr_third

    def test_data_row_exceptions(self) -> None:
        with self.assertRaises(TypeError):
            DataRow(index=b"", features=Image())  # type: ignore

        with self.assertRaises(TypeError):
            DataRow(index=1, features=b"")  # type: ignore

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_loader_with_cache(self, m_scan: MagicMock, m_summary: MagicMock) -> None:
        rows_cnt = 100
        m_summary.return_value = DatasetSummary(rows=1)
        fname = "data_ubyte_0.swds_bin"
        m_scan.return_value = [
            TabularDatasetRow(
                id=i,
                features={
                    "l": Link(
                        fname,
                        offset=32,
                        size=784,
                        _swds_bin_offset=0,
                        _swds_bin_size=8160,
                    ),
                    "label": i,
                },
            )
            for i in range(0, rows_cnt)
        ]
        data_dir = DatasetStorage(self.dataset_uri).data_dir
        ensure_dir(data_dir)
        shutil.copyfile(os.path.join(self.swds_dir, fname), str(data_dir / fname))

        loader = get_data_loader(self.dataset_uri, cache_size=50, num_workers=4)
        assert len(list(loader)) == rows_cnt

        loader = get_data_loader(self.dataset_uri, cache_size=100, num_workers=10)
        assert len(list(loader)) == rows_cnt

        loader = get_data_loader(self.dataset_uri, cache_size=1, num_workers=1)
        assert len(list(loader)) == rows_cnt

        with self.assertRaisesRegex(ValueError, "must be a positive int number"):
            get_data_loader(self.dataset_uri, cache_size=0)

        with self.assertRaisesRegex(ValueError, "must be a positive int number"):
            get_data_loader(self.dataset_uri, num_workers=0)

    def test_processed_key_range(self) -> None:
        loader = get_data_loader(self.dataset_uri)
        with self.assertRaisesRegex(
            RuntimeError, "key processed queue is not initialized"
        ):
            loader._get_processed_key_range()

        loader._key_processed_queue = queue.Queue()
        pk = loader._get_processed_key_range()
        assert pk == []

        for i in range(25):
            loader._key_processed_queue.put(i)

        loader._key_range_dict = {
            (0, 10): {"rows_cnt": 10, "processed_cnt": 0},
            (10, 20): {"rows_cnt": 10, "processed_cnt": 0},
            (20, 30): {"rows_cnt": 10, "processed_cnt": 0},
        }

        pk = loader._get_processed_key_range()
        assert pk == [(0, 10), (10, 20)]

        assert (0, 10) not in loader._key_range_dict
        assert (10, 20) not in loader._key_range_dict
        assert loader._key_range_dict[(20, 30)]["processed_cnt"] == 5

        with self.assertRaisesRegex(RuntimeError, "not found in key range"):
            loader._key_processed_queue.put(30)
            loader._get_processed_key_range()

    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_session_consumption(self, mock_scan: MagicMock) -> None:
        mock_sc = MagicMock()
        mock_sc.session_start = None
        mock_sc.session_end = None
        mock_sc.batch_size = 1

        start_key, end_key = 0, 5002
        chunk_size = 10
        count = end_key - start_key

        def _chunk(start: int, end: int, size: int) -> t.Iterator[t.Tuple[int, int]]:
            full_range = range(start, end)
            for i in range(0, len(full_range), size):
                slice = full_range[i : i + size]
                yield (slice[0], slice[-1] + 1)

        allocated_keys = list(_chunk(start_key, end_key, chunk_size))

        def _iter_none() -> t.Iterable:
            while True:
                yield None

        mock_sc.get_scan_range.side_effect = chain(allocated_keys, _iter_none())

        def _mock_scan(*args: t.Any, **kwargs: t.Any) -> t.Any:
            _s, _e = args
            if _s is None:
                _s = start_key
            if _e is None:
                _e = end_key

            for i in range(_s, _e):
                # simulate data unpacking
                time.sleep(random.randint(0, 2) / 1000)
                yield TabularDatasetRow(id=i, features={"label": i})

        mock_scan.side_effect = _mock_scan

        exceptions = []

        def _consume_loader(consumed_ids: t.Dict[str, list], name: str) -> None:
            try:
                loader = get_data_loader(
                    dataset_uri=self.dataset_uri, session_consumption=mock_sc
                )
                for item in loader:
                    consumed_ids[name].append(item.index)
                    # simulate data processing(predicting, etc.)
                    time.sleep(random.randint(1, 3) / 1000)
            except Exception as e:
                exceptions.append(e)
                raise

        consumed_ids = defaultdict(list)
        loader_threads = []
        for i in range(0, 10):
            _n = f"loader-{i}"
            _t = threading.Thread(
                name=_n,
                target=_consume_loader,
                args=(consumed_ids, _n),
                daemon=True,
            )
            _t.start()
            loader_threads.append(_t)

        for _t in loader_threads:
            _t.join()

        assert len(exceptions) == 0
        assert len(list(consumed_ids.values())[0]) < count
        assert len(list(chain(*consumed_ids.values()))) == count

        submit_processed_keys = sorted(
            chain(*[s[0][0] for s in mock_sc.get_scan_range.call_args_list if s[0][0]])
        )
        assert submit_processed_keys == allocated_keys

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_loader_with_scan_exception(
        self, m_scan: MagicMock, m_summary: MagicMock
    ) -> None:
        m_summary.return_value = DatasetSummary(
            rows=1,
            increased_rows=1,
        )

        def _scan_exception(*args: t.Any, **kwargs: t.Any) -> t.Any:
            raise RuntimeError("scan error")

        m_scan.side_effect = _scan_exception

        with self.assertRaisesRegex(RuntimeError, "scan error"):
            loader = get_data_loader(self.dataset_uri)
            [d.index for d in loader]

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_loader_with_makefile_exception(
        self, m_scan: MagicMock, m_summary: MagicMock
    ) -> None:
        m_summary.return_value = DatasetSummary(
            rows=1,
            increased_rows=1,
        )

        m_scan.return_value = [
            TabularDatasetRow(
                id=0,
                features={
                    "l": Image(
                        link=Link(
                            "not-found",
                            offset=32,
                            size=784,
                            _swds_bin_offset=0,
                            _swds_bin_size=8160,
                        )
                    ),
                    "label": 0,
                },
            )
        ]
        loader = get_data_loader(self.dataset_uri)
        with self.assertRaises(NotFoundError):
            [d.index for d in loader]
