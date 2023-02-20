"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[4793],{3905:function(e,t,a){a.d(t,{Zo:function(){return m},kt:function(){return d}});var n=a(7294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},m=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,r=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),c=p(a),d=l,h=c["".concat(s,".").concat(d)]||c[d]||u[d]||r;return a?n.createElement(h,i(i({ref:t},m),{},{components:a})):n.createElement(h,i({ref:t},m))}));function d(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=a.length,i=new Array(r);i[0]=c;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:l,i[1]=o;for(var p=2;p<r;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},5047:function(e,t,a){a.r(t),a.d(t,{assets:function(){return s},contentTitle:function(){return i},default:function(){return u},frontMatter:function(){return r},metadata:function(){return o},toc:function(){return p}});var n=a(3117),l=(a(7294),a(3905));const r={title:"Standalone Quickstart"},i=void 0,o={unversionedId:"quickstart/standalone",id:"quickstart/standalone",title:"Standalone Quickstart",description:"This tutorial is also available as a Colab Notebook.",source:"@site/docs/quickstart/standalone.md",sourceDirName:"quickstart",slug:"/quickstart/standalone",permalink:"/docs/quickstart/standalone",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/quickstart/standalone.md",tags:[],version:"current",frontMatter:{title:"Standalone Quickstart"},sidebar:"mainSidebar",next:{title:"On-Premises Quickstart",permalink:"/docs/quickstart/on-premises"}},s={},p=[{value:"1. Installing Starwhale",id:"1-installing-starwhale",level:2},{value:"2. Downloading Examples",id:"2-downloading-examples",level:2},{value:"3. Building Runtime",id:"3-building-runtime",level:2},{value:"4. Building Model",id:"4-building-model",level:2},{value:"5. Building Dataset",id:"5-building-dataset",level:2},{value:"6. Running an Evaluation Job",id:"6-running-an-evaluation-job",level:2}],m={toc:p};function u(e){let{components:t,...r}=e;return(0,l.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"This tutorial is also available as a ",(0,l.kt)("a",{parentName:"strong",href:"https://colab.research.google.com/github/star-whale/starwhale/blob/main/example/notebooks/quickstart-standalone.ipynb"},"Colab Notebook"),".")),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"Core Workflow",src:a(8629).Z,width:"3036",height:"1741"})),(0,l.kt)("h2",{id:"1-installing-starwhale"},"1. Installing Starwhale"),(0,l.kt)("p",null,"Starwhale has three types of instances: Standalone, On-Premises, and Cloud Hosted. Starting with the standalone mode is ideal for quickly understanding and mastering Starwhale.\nYou install Starwhale Standalone by running:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"python3 -m pip install starwhale\n")),(0,l.kt)("admonition",{type:"note"},(0,l.kt)("p",{parentName:"admonition"},"You can install the alpha version by the ",(0,l.kt)("inlineCode",{parentName:"p"},"--pre")," argument.")),(0,l.kt)("admonition",{type:"note"},(0,l.kt)("p",{parentName:"admonition"},"Starwhale standalone requires Python 3.7~3.11. Currently, Starwhale only supports Linux and macOS. Windows is coming soon.")),(0,l.kt)("p",null,"At the installation stage, we strongly recommend you follow the ",(0,l.kt)("a",{parentName:"p",href:"/docs/guides/install/standalone"},"doc"),"."),(0,l.kt)("h2",{id:"2-downloading-examples"},"2. Downloading Examples"),(0,l.kt)("p",null,"Download Starwhale examples by cloning Starwhale via:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/star-whale/starwhale.git\ncd starwhale\n")),(0,l.kt)("p",null,"We will use ML/DL HelloWorld code ",(0,l.kt)("inlineCode",{parentName:"p"},"MNIST")," to start your Starwhale journey. The following steps are all performed in the ",(0,l.kt)("inlineCode",{parentName:"p"},"starwhale")," directory."),(0,l.kt)("h2",{id:"3-building-runtime"},"3. Building Runtime"),(0,l.kt)("p",null,"Runtime example code are in the ",(0,l.kt)("inlineCode",{parentName:"p"},"example/runtime/pytorch")," directory."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Build the Starwhale Runtime bundle:."),(0,l.kt)("admonition",{parentName:"li",type:"tip"},(0,l.kt)("p",{parentName:"admonition"},"When you first build runtime, creating an isolated python environment and downloading python dependencies will take a lot of time. The command execution time is related to the network environment of the machine and the number of packages in the runtime.yaml. Using the befitting pypi mirror and cache config in the ",(0,l.kt)("inlineCode",{parentName:"p"},"~/.pip/pip.conf")," file is a recommended practice."),(0,l.kt)("p",{parentName:"admonition"},"For users in the mainland of China, the following conf file is an option:"),(0,l.kt)("pre",{parentName:"admonition"},(0,l.kt)("code",{parentName:"pre",className:"language-conf"},"[global]\ncache-dir = ~/.cache/pip\nindex-url = https://mirrors.aliyun.com/pypi/simple/\nextra-index-url = https://pypi.doubanio.com/simple\n"))),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime build example/runtime/pytorch\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Check your local Starwhale Runtime:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime list\nswcli runtime info pytorch/version/latest\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Restore Starwhale Runtime(optional):"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli runtime restore pytorch/version/latest\n")))),(0,l.kt)("h2",{id:"4-building-model"},"4. Building Model"),(0,l.kt)("p",null,"Model example code are in the ",(0,l.kt)("inlineCode",{parentName:"p"},"example/mnist")," directory."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Download pre-trained model file:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"cd example/mnist\nmake download-model\n# For users in the mainland of China, please add `CN=1` environment for make command:\n# CN=1 make download-model\ncd -\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Build a Starwhale Model with prebuilt Starwhale Runtime:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model build example/mnist --runtime pytorch/version/latest\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Check your local Starwhale Model:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli model list\nswcli model info mnist/version/latest\n")))),(0,l.kt)("h2",{id:"5-building-dataset"},"5. Building Dataset"),(0,l.kt)("p",null,"Dataset example code are in the ",(0,l.kt)("inlineCode",{parentName:"p"},"example/mnist")," directory."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Download the MNIST raw data:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"cd example/mnist\nmake download-data\n# For users in the mainland of China, please add `CN=1` environment for make command:\n# CN=1 make download-data\ncd -\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Build a Starwhale Dataset with prebuilt Starwhale Runtime:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset build example/mnist --runtime pytorch/version/latest\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Check your local Starwhale Dataset:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset list\nswcli dataset info mnist/version/latest\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Head some records from the mnist dataset:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli dataset head mnist/version/latest\n")))),(0,l.kt)("h2",{id:"6-running-an-evaluation-job"},"6. Running an Evaluation Job"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Create an evaluation job"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli eval run --model mnist/version/latest --dataset mnist/version/latest --runtime pytorch/version/latest\n"))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Check the evaluation result:"),(0,l.kt)("pre",{parentName:"li"},(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"swcli eval list\nswcli eval info $(swcli eval list | grep mnist | grep success | awk '{print $1}' | head -n 1)\n")),(0,l.kt)("p",{parentName:"li"}," \ud83d\udc4f Now, you have completed the basic steps for Starwhale standalone."))))}u.isMDXComponent=!0},8629:function(e,t,a){t.Z=a.p+"assets/images/standalone-core-workflow-270ac0f0cb5b20dbe5ccd11727e2620b.gif"}}]);