"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[641],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=u(n),m=l,f=p["".concat(s,".").concat(m)]||p[m]||d[m]||r;return n?a.createElement(f,i(i({ref:t},c),{},{components:n})):a.createElement(f,i({ref:t},c))}));function m(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,i=new Array(r);i[0]=p;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:l,i[1]=o;for(var u=2;u<r;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},354:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return d}});var a=n(7462),l=n(3366),r=(n(7294),n(3905)),i=["components"],o={title:"MNIST with Pytorch"},s=void 0,u={unversionedId:"tutorials/mnist",id:"tutorials/mnist",title:"MNIST with Pytorch",description:"MNIST is the hello world code for Machine Learning. This document will let you master all core Starwhale concepts and workflows.",source:"@site/docs/tutorials/mnist.md",sourceDirName:"tutorials",slug:"/tutorials/mnist",permalink:"/docs/tutorials/mnist",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/tutorials/mnist.md",tags:[],version:"current",frontMatter:{title:"MNIST with Pytorch"},sidebar:"mainSidebar",previous:{title:"On-Premises Quickstart",permalink:"/docs/quickstart/on-premises"},next:{title:"Text Classification on AG News dataset",permalink:"/docs/tutorials/ag_news"}},c={},d=[{value:"Downloading the MNIST example",id:"downloading-the-mnist-example",level:2},{value:"Creating and building Runtime",id:"creating-and-building-runtime",level:2},{value:"Train the MNIST Model",id:"train-the-mnist-model",level:2},{value:"Building Model",id:"building-model",level:2},{value:"Building Dataset",id:"building-dataset",level:2},{value:"Running Standalone Evaluation Job",id:"running-standalone-evaluation-job",level:2},{value:"Copying Model/Dataset/Runtime into Cloud instance",id:"copying-modeldatasetruntime-into-cloud-instance",level:2},{value:"Running Cloud Evaluation Job",id:"running-cloud-evaluation-job",level:2}],p={toc:d};function m(e){var t=e.components,o=(0,l.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"MNIST is the hello world code for Machine Learning. This document will let you master all core Starwhale concepts and workflows."),(0,r.kt)("h2",{id:"downloading-the-mnist-example"},"Downloading the MNIST example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/star-whale/starwhale.git\ncd starwhale/example/mnist\n")),(0,r.kt)("h2",{id:"creating-and-building-runtime"},"Creating and building Runtime"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime create -n pytorch-mnist -m venv --python 3.9 .\nsource venv/bin/activate\npython3 -m pip install -r requirements.txt\nswcli runtime build .\nswcli runtime info pytorch-mnist/version/latest\n")),(0,r.kt)("h2",{id:"train-the-mnist-model"},"Train the MNIST Model"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"make train\n")),(0,r.kt)("p",null,"output: models/mnist_cnn.pt, which is pre-trained model."),(0,r.kt)("h2",{id:"building-model"},"Building Model"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Write some code with Starwhale Python SDK. Full code is ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/star-whale/starwhale/blob/main/example/mnist/mnist/ppl.py"},"here"),".")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'from starwhale.api.model import PipelineHandler\nfrom starwhale.api.metric import multi_classification\n\nclass MNISTInference(PipelineHandler):\n\n    def __init__(self):\n        super().__init__(merge_label=True, ignore_error=False)\n        self.model = self._load_model()\n\n    def ppl(self, data:bytes, **kw):\n        data = self._pre(data)\n        output = self.model(data)\n        return self._post(output)\n\n    def handle_label(self, label:bytes, **kw):\n        return [int(l) for l in label]\n\n    @multi_classification(\n        confusion_matrix_normalize="all",\n        show_hamming_loss=True,\n        show_cohen_kappa_score=True,\n        show_roc_auc=True,\n        all_labels=[i for i in range(0, 10)],\n    )\n    def cmp(self, _data_loader:"DataLoader"):\n        _result, _label, _pr = [], [], []\n        for _data in _data_loader:\n            _label.extend([int(l) for l in _data[self._label_field]])\n            # unpack data according to the return value of function ppl\n            (pred, pr) = _data[self._ppl_data_field]\n            _result.extend([int(l) for l in pred])\n            _pr.extend([l for l in pr])\n\n    def _pre(self, input:bytes):\n        """write some mnist preprocessing code"""\n\n    def _post(self, input:bytes):\n        """write some mnist post-processing code"""\n\n    def _load_model():\n        """load your pre trained model"""\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Define ",(0,r.kt)("inlineCode",{parentName:"li"},"model.yaml"),".")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"name: mnist\nmodel:\n- models/mnist_cnn.pt\nconfig:\n- config/hyperparam.json\nrun:\nppl: mnist.ppl:MNISTInference\n")),(0,r.kt)("h2",{id:"building-dataset"},"Building Dataset"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Write some code with Starwhale Python SDK. Full code is ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/star-whale/starwhale/blob/main/example/mnist/mnist/process.py"},"here"),"."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-python"},' from starwhale.api.dataset import BuildExecutor\n\n class DataSetProcessExecutor(BuildExecutor):\n\n     def iter_data_slice(self, path: str):\n         """read data file, unpack binary data, yield data bytes"""\n\n     def iter_label_slice(self, path: str):\n         """read label file, unpack binary data, yield label bytes"""\n'))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Define ",(0,r.kt)("inlineCode",{parentName:"p"},"dataset.yaml"),"."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},' name: mnist\n mode: generate\n data_dir: data\n data_filter: "t10k-image*"\n label_filter: "t10k-label*"\n process: mnist.process:DataSetProcessExecutor\n attr:\n   alignment_size: 4k\n   volume_size: 2M\n'))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Run one command to build the dataset."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"}," swcli dataset build .\n swcli dataset info mnist/version/latest\n")))),(0,r.kt)("h2",{id:"running-standalone-evaluation-job"},"Running Standalone Evaluation Job"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli -vvv job create --model mnist/version/latest --dataset mnist/version/latest\nswcli job list\nswcli job info ${version}\n")),(0,r.kt)("h2",{id:"copying-modeldatasetruntime-into-cloud-instance"},"Copying Model/Dataset/Runtime into Cloud instance"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model copy mnist/version/latest cloud://pre-k8s/project/1\nswcli dataset copy mnist/version/latest cloud://pre-k8s/project/1\nswcli runtime copy pytorch-mnist/version/latest cloud://pre-k8s/project/1\n")),(0,r.kt)("h2",{id:"running-cloud-evaluation-job"},"Running Cloud Evaluation Job"),(0,r.kt)("p",null,"On the jobs page, you can create an evaluation job."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Create Job Workflow",src:n(4361).Z,width:"2537",height:"1300"}),"\n",(0,r.kt)("img",{alt:"Show Job Results",src:n(9311).Z,width:"2560",height:"1321"})))}m.isMDXComponent=!0},4361:function(e,t,n){t.Z=n.p+"assets/images/create-job-workflow-e6d8be79c612f003c3d07a21a063424a.gif"},9311:function(e,t,n){t.Z=n.p+"assets/images/ui-job-results-9ee97d243fc128844fa3a2a210bde7d7.jpg"}}]);