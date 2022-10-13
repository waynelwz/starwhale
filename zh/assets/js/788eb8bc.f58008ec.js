"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[523],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return d}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=c(a),d=r,h=m["".concat(s,".").concat(d)]||m[d]||u[d]||l;return a?n.createElement(h,i(i({ref:t},p),{},{components:a})):n.createElement(h,i({ref:t},p))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var c=2;c<l;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},385:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return o},metadata:function(){return c},toc:function(){return u}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),i=["components"],o={title:"CIFAR10\u6570\u636e\u96c6\u7684\u7b80\u5355\u56fe\u5f62\u8bc6\u522b\u6a21\u578b\u8bc4\u6d4b"},s=void 0,c={unversionedId:"tutorials/cifar10",id:"tutorials/cifar10",title:"CIFAR10\u6570\u636e\u96c6\u7684\u7b80\u5355\u56fe\u5f62\u8bc6\u522b\u6a21\u578b\u8bc4\u6d4b",description:"\u672c\u4f8b\u5b50\u53c2\u8003Pytorch \u8bad\u7ec3\u5206\u7c7b\u5668\u5bf9cifar10\u6570\u636e\u96c6\u8fdb\u884c\u56fe\u7247\u5206\u7c7b\u548c\u6a21\u578b\u8bc4\u6d4b\uff0c\u76f8\u5173\u4ee3\u7801\u7684\u94fe\u63a5\uff1aexample/cifar10\u3002",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/tutorials/cifar10.md",sourceDirName:"tutorials",slug:"/tutorials/cifar10",permalink:"/zh/docs/tutorials/cifar10",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/tutorials/cifar10.md",tags:[],version:"current",frontMatter:{title:"CIFAR10\u6570\u636e\u96c6\u7684\u7b80\u5355\u56fe\u5f62\u8bc6\u522b\u6a21\u578b\u8bc4\u6d4b"},sidebar:"mainSidebar",previous:{title:"AG News\u6570\u636e\u96c6\u7684\u6587\u672c\u5206\u7c7b\u6a21\u578b\u8bc4\u6d4b",permalink:"/zh/docs/tutorials/ag_news"},next:{title:"PennFudanPed\u6570\u636e\u96c6\u7684\u76ee\u6807\u68c0\u6d4b\u4efb\u52a1\u6a21\u578b\u8bc4\u6d4b",permalink:"/zh/docs/tutorials/pfp"}},p={},u=[{value:"1.\u524d\u7f6e\u6761\u4ef6",id:"1\u524d\u7f6e\u6761\u4ef6",level:2},{value:"1.1 \u57fa\u7840\u73af\u5883",id:"11-\u57fa\u7840\u73af\u5883",level:3},{value:"1.2 Starwhale Runtime\u6fc0\u6d3b",id:"12-starwhale-runtime\u6fc0\u6d3b",level:3},{value:"1.3 \u6570\u636e\u51c6\u5907\u4e0e\u6a21\u578b\u8bad\u7ec3",id:"13-\u6570\u636e\u51c6\u5907\u4e0e\u6a21\u578b\u8bad\u7ec3",level:3},{value:"2.Starwhale\u7684\u6a21\u578b\u8bc4\u6d4b\u8fc7\u7a0b",id:"2starwhale\u7684\u6a21\u578b\u8bc4\u6d4b\u8fc7\u7a0b",level:2},{value:"\u6b65\u9aa41\uff1a\u6784\u5efaStarwhale Dataset",id:"\u6b65\u9aa41\u6784\u5efastarwhale-dataset",level:3},{value:"\u6b65\u9aa42\uff1aStandalone Instance\u4e2d\u8bc4\u6d4b\u6a21\u578b",id:"\u6b65\u9aa42standalone-instance\u4e2d\u8bc4\u6d4b\u6a21\u578b",level:3},{value:"\u6b65\u9aa43\uff1a\u6784\u5efaStarwhale Model",id:"\u6b65\u9aa43\u6784\u5efastarwhale-model",level:3},{value:"\u6b65\u9aa44\uff1aCloud Instance\u4e2d\u8bc4\u6d4b\u6a21\u578b\uff08\u53ef\u9009\uff09",id:"\u6b65\u9aa44cloud-instance\u4e2d\u8bc4\u6d4b\u6a21\u578b\u53ef\u9009",level:3},{value:"3.\u53c2\u8003\u8d44\u6599",id:"3\u53c2\u8003\u8d44\u6599",level:2}],m={toc:u};function d(e){var t=e.components,o=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,n.Z)({},m,o,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u672c\u4f8b\u5b50",(0,l.kt)("a",{parentName:"p",href:"https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html"},"\u53c2\u8003Pytorch \u8bad\u7ec3\u5206\u7c7b\u5668"),"\u5bf9",(0,l.kt)("a",{parentName:"p",href:"https://www.cs.toronto.edu/~kriz/cifar.html"},"cifar10\u6570\u636e\u96c6"),"\u8fdb\u884c\u56fe\u7247\u5206\u7c7b\u548c\u6a21\u578b\u8bc4\u6d4b\uff0c\u76f8\u5173\u4ee3\u7801\u7684\u94fe\u63a5\uff1a",(0,l.kt)("a",{parentName:"p",href:"https://github.com/star-whale/starwhale/tree/main/example/cifar10"},"example/cifar10"),"\u3002"),(0,l.kt)("p",null,"\u4ece\u8be5\u4f8b\u4e2d\uff0c\u6211\u4eec\u80fd\u5b9e\u8df5\u5982\u4e0bStarwhale\u529f\u80fd\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5982\u4f55\u4f7f\u7528Image\u7c7b\u578b\u6784\u5efaswds\u6570\u636e\u96c6\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u5982\u679c\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"li"},"starwhale.multi_classification")," \u4fee\u9970\u5668\u6765\u7b80\u5316\u591a\u5206\u7c7b\u95ee\u9898cmp\u90e8\u5206\u7684\u7f16\u5199\u3002")),(0,l.kt)("h2",{id:"1\u524d\u7f6e\u6761\u4ef6"},"1.\u524d\u7f6e\u6761\u4ef6"),(0,l.kt)("p",null,"\u9605\u8bfb\u672c\u6587\u524d\uff0c\u5efa\u8bae\u5148\u9605\u8bfb",(0,l.kt)("a",{parentName:"p",href:"/zh/docs/tutorials/pytorch"},"Pytorch Runtime\u6784\u5efa"),", ",(0,l.kt)("a",{parentName:"p",href:"/zh/docs/tutorials/speech"},"Speech Commands\u6570\u636e\u96c6\u7684\u591a\u5206\u7c7b\u4efb\u52a1\u6a21\u578b\u8bc4\u6d4b"),"\u3002"),(0,l.kt)("h3",{id:"11-\u57fa\u7840\u73af\u5883"},"1.1 \u57fa\u7840\u73af\u5883"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Python\u7248\u672c: 3.7 ~ 3.10\u3002"),(0,l.kt)("li",{parentName:"ul"},"OS\u73af\u5883: Linux\u6216macOS(\u4ec5\u8fd0\u884cStandalone)\u3002"),(0,l.kt)("li",{parentName:"ul"},"Starwhale Client \u5b8c\u6210\u5b89\u88c5\uff0c\u4e14\u7248\u672c\u4e0d\u65e9\u4e8e0.3.0\u3002"),(0,l.kt)("li",{parentName:"ul"},"[\u53ef\u9009]","Starwhale Controller \u5b8c\u6210\u5b89\u88c5\uff0c\u4e14\u7248\u672c\u4e0d\u65e9\u4e8e0.3.0\uff0c\u5982\u679c\u53ea\u5e0c\u671b\u5728Standalone Instance\u4e2d\u8fdb\u884c\u8bc4\u6d4b\uff0c\u53ef\u4ee5\u5ffd\u7565\u8be5\u6b65\u9aa4\u3002"),(0,l.kt)("li",{parentName:"ul"},"Runtime: ",(0,l.kt)("a",{parentName:"li",href:"https://github.com/star-whale/starwhale/tree/main/example/runtime/pytorch"},"Pytorch Runtime Example"))),(0,l.kt)("h3",{id:"12-starwhale-runtime\u6fc0\u6d3b"},"1.2 Starwhale Runtime\u6fc0\u6d3b"),(0,l.kt)("p",null,"\u672c\u4f8b\u53ef\u4ee5\u4f7f\u7528Starwhale\u63d0\u4f9b\u7684",(0,l.kt)("a",{parentName:"p",href:"https://github.com/star-whale/starwhale/tree/main/example/runtime/pytorch"},"Pytorch Runtime\u4f8b\u5b50"),"\u4f5c\u4e3aStarwhale Runtime\uff0c\u4e0d\u9700\u8981\u989d\u5916\u7f16\u5199Runtime\u914d\u7f6e\u3002\u6a21\u578b\u8bad\u7ec3\u548c\u8bc4\u6d4b\u90fd\u53ef\u4ee5\u4f7f\u7528\u8be5Runtime\u3002"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u51c6\u5907Runtime\uff1a\u4e0b\u8f7d\u6216\u91cd\u65b0\u6784\u5efa\uff0c\u5982\u4f55Standalone Instance\u4e2d\u5df2\u7ecf\u6709\u8be5Runtime\uff0c\u5219\u5ffd\u7565\u8be5\u6b65\u9aa4\u3002")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"# \u4e0b\u8f7dStarwhale Cloud\u5df2\u7ecf\u6784\u5efa\u597d\u7684Pytorch Runtime\nswcli runtime copy https://cloud.starwhale.ai/project/demo/runtime/pytorch/version/latest self\n\n# \u6216\u6839\u636epytorch runtime example\u5728\u672c\u5730\u6784\u5efa\u4e00\u4e2a\u65b0\u7684Runtime\ngit clone --depth=1 https://github.com/star-whale/starwhale.git\ncd starwhale/example/runtime/pytorch\nswcli runtime build .\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Restore Runtime\uff1a\u672c\u5730\u590d\u539fRuntime\u73af\u5883\uff0c\u5e76\u5728\u5f53\u524dshell\u4e2d\u6fc0\u6d3b\u76f8\u5e94\u7684Python\u73af\u5883")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"swcli runtime restore pytorch/version/latest\nswcli runtime activate --uri pytorch/version/latest\n")),(0,l.kt)("h3",{id:"13-\u6570\u636e\u51c6\u5907\u4e0e\u6a21\u578b\u8bad\u7ec3"},"1.3 \u6570\u636e\u51c6\u5907\u4e0e\u6a21\u578b\u8bad\u7ec3"),(0,l.kt)("p",null,"\u6570\u636e\u51c6\u5907\u548c\u6a21\u578b\u8bad\u7ec3\u975e\u5e38\u5bb9\u6613\uff0c\u53ea\u9700\u8981\u4e24\u6b65\u5c31\u80fd\u5b8c\u6210\u64cd\u4f5c\uff1a\u4e0b\u8f7d\u4ee3\u7801\u3001\u5f00\u59cb\u8bad\u7ec3\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"git clone --depth=1 https://github.com/star-whale/starwhale.git\ncd starwhale/example/cifar10\nmake train\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"make train")," \u547d\u4ee4\u9700\u8981\u5728Pytorch Runtime \u5df2\u7ecf\u6fc0\u6d3b\u7684Shell\u73af\u5883\u4e2d\u6267\u884c\uff0c\u5426\u5219\u53ef\u80fd\u63d0\u793a\u67d0\u4e9bPython\u5305Import Error\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"make train")," \u547d\u4ee4\u4f1a\u81ea\u52a8\u4e0b\u8f7d\u6570\u636e\uff0c\u5982\u679c\u9047\u5230\u7f51\u7edc\u95ee\u9898\uff0c\u8bf7\u5408\u7406\u8bbe\u7f6e\u4ee3\u7406\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"make train")," \u8fc7\u7a0b\u53ef\u80fd\u4f1a\u6bd4\u8f83\u6162\uff0c\u6267\u884c\u65f6\u95f4\u957f\u77ed\u53d6\u51b3\u4e8e\u7f51\u7edc\u901f\u5ea6\u3001\u673a\u5668\u914d\u7f6e\u3001GPU\u8d44\u6e90\u60c5\u51b5\u7b49\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u547d\u4ee4\u6267\u884c\u7ed3\u675f\u540e\uff0c\u53ef\u4ee5\u5230",(0,l.kt)("inlineCode",{parentName:"li"},"data"),"\u76ee\u5f55\u67e5\u770b\u539f\u59cb\u6570\u636e\uff0c",(0,l.kt)("inlineCode",{parentName:"li"},"models"),"\u76ee\u5f55\u67e5\u770b\u5df2\u7ecf\u6784\u5efa\u597d\u7684\u6a21\u578b\u3002"),(0,l.kt)("li",{parentName:"ul"},"\u53ef\u4ee5\u5728train.py\u4e2d\u5bf9\u8bad\u7ec3\u8fc7\u7a0b\u7684\u4e00\u4e9b\u53c2\u6570\u8fdb\u884c\u8c03\u6574\uff0c\u6bd4\u5982epoch\u503c\u7b49\u3002")),(0,l.kt)("h2",{id:"2starwhale\u7684\u6a21\u578b\u8bc4\u6d4b\u8fc7\u7a0b"},"2.Starwhale\u7684\u6a21\u578b\u8bc4\u6d4b\u8fc7\u7a0b"),(0,l.kt)("h3",{id:"\u6b65\u9aa41\u6784\u5efastarwhale-dataset"},"\u6b65\u9aa41\uff1a\u6784\u5efaStarwhale Dataset"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"#\u5982\u679c\u5df2\u7ecf\u6fc0\u6d3b\u8be5runtime\u73af\u5883\uff0c\u5219\u5ffd\u7565\u672c\u884c\u547d\u4ee4\nswcli runtime activate --uri pytorch/version/latest\n# \u6839\u636edataset.yaml\u6784\u5efaswds-bin\u683c\u5f0fin\u683c\u5f0fin\u683c\u5f0fin\u683c\u5f0fin\u683c\u5f0f\u7684\u6570\u636e\u96c6\nswcli dataset build .\n# \u67e5\u770b\u6700\u65b0\u6784\u5efa\u7684\u6570\u636e\u96c6\u8be6\u60c5\nswcli dataset info cifar10-test/version/latest\n")),(0,l.kt)("p",null,"\u4e0a\u9762\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"build"),"\u547d\u4ee4\u5728",(0,l.kt)("inlineCode",{parentName:"p"},"starwhale/example/cifar10"),"\u4e2d\u6267\u884c\uff0c\u4e5f\u53ef\u4ee5\u5728\u5176\u4ed6\u76ee\u5f55\u4e2d\u6267\u884c\uff0c\u4f46\u8981\u5408\u7406\u8bbe\u7f6e ",(0,l.kt)("inlineCode",{parentName:"p"},"swcli dataset build"),"\u547d\u4ee4\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"WORKDIR"),"\u53c2\u6570\u3002\u5982\u679c\u4e0d\u60f3\u6bcf\u6b21\u5f00\u542f\u65b0\u7684shell\u65f6\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"p"},"build"),"\u547d\u4ee4\u90fd\u5148\u6fc0\u6d3bruntime\u73af\u5883\uff0c\u53ef\u4ee5\u6267\u884c ",(0,l.kt)("inlineCode",{parentName:"p"},"build")," \u547d\u4ee4\u7684\u65f6\u5019\u6307\u5b9a ",(0,l.kt)("inlineCode",{parentName:"p"},"--runtime")," \u53c2\u6570\u3002\u6784\u5efa\u6570\u636e\u96c6\u7684\u65f6\u5019\uff0c\u672c\u4f8b\u63d0\u4f9b\u4e86\u5c06\u539f\u59cb\u6570\u636e\u96c6Python\u683c\u5f0f\u8f6c\u53d8\u4e3a ",(0,l.kt)("inlineCode",{parentName:"p"},"starwhale.Image")," \u7684\u65b9\u5f0f\uff0c\u6838\u5fc3\u4ee3\u7801\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},'from starwhale import Image, MIMEType\ndef _iter_item(paths: t.List[Path]) -> t.Generator[t.Tuple[t.Any, t.Dict], None, None]:\n    for path in paths:\n        with path.open("rb") as f:\n            content = pickle.load(f, encoding="bytes")\n            for data, label, filename in zip(\n                content[b"data"], content[b"labels"], content[b"filenames"]\n            ):\n                annotations = {\n                    "label": label,\n                    "label_display_name": dataset_meta["label_names"][label],\n                }\n\n                image_array = data.reshape(3, 32, 32).transpose(1, 2, 0)\n                image_bytes = io.BytesIO()\n                PILImage.fromarray(image_array).save(image_bytes, format="PNG")\n\n                yield Image(\n                    fp=image_bytes.getvalue(),\n                    display_name=filename.decode(),\n                    shape=image_array.shape,\n                    mime_type=MIMEType.PNG,\n                ), annotations\n')),(0,l.kt)("p",null,"\u5f53\u5206\u53d1\u6570\u636e\u96c6\u5230Cloud Instance\u540e\uff0c\u53ef\u4ee5Web\u754c\u9762\u4e2d\u4f7f\u7528Dataset Viewer\u89c2\u5bdf\u6570\u636e\u96c6\uff1a"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"dataset-viewer.gif",src:a(8939).Z,width:"2522",height:"1368"})),(0,l.kt)("h3",{id:"\u6b65\u9aa42standalone-instance\u4e2d\u8bc4\u6d4b\u6a21\u578b"},"\u6b65\u9aa42\uff1aStandalone Instance\u4e2d\u8bc4\u6d4b\u6a21\u578b"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"#\u5982\u679c\u5df2\u7ecf\u6fc0\u6d3b\u8be5runtime\u73af\u5883\uff0c\u5219\u5ffd\u7565\u672c\u884c\u547d\u4ee4\nswcli runtime activate --uri pytorch/version/latest\n# \u6839\u636emodel.yaml\u8fd0\u884c\u8bc4\u6d4b\u4efb\u52a1\nswcli model eval . --dataset  cifar10-test/version/latest\n# \u5c55\u793a\u8bc4\u6d4b\u7ed3\u679c\nswcli model info ${version}\n")),(0,l.kt)("p",null,"\u4e0a\u9762\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"build"),"\u547d\u4ee4\u5728",(0,l.kt)("inlineCode",{parentName:"p"},"starwhale/example/cifar10"),"\u4e2d\u6267\u884c\uff0c\u4e5f\u53ef\u4ee5\u5728\u5176\u4ed6\u76ee\u5f55\u4e2d\u6267\u884c\uff0c\u4f46\u8981\u5408\u7406\u8bbe\u7f6e ",(0,l.kt)("inlineCode",{parentName:"p"},"swcli model eval"),"\u547d\u4ee4\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"WORKDIR"),"\u53c2\u6570\u3002\u5982\u679c\u4e0d\u60f3\u6bcf\u6b21\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"p"},"eval"),"\u547d\u4ee4\u90fd\u6307\u5b9a",(0,l.kt)("inlineCode",{parentName:"p"},"--runtime"),"\u53c2\u6570\uff0c\u5219\u53ef\u4ee5\u5148\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"p"},"swcli runtime activate --uri pytorch/version/latest"),"\u547d\u4ee4\u6fc0\u6d3b\u5f53\u524dshell\u73af\u5883\uff0c\u6216\u5728\u4e00\u4e2a\u5df2\u7ecf\u6fc0\u6d3bPytorch Runtime\u73af\u5883shell\u4e2d\u6267\u884c\u8bc4\u6d4b\u3002"),(0,l.kt)("h3",{id:"\u6b65\u9aa43\u6784\u5efastarwhale-model"},"\u6b65\u9aa43\uff1a\u6784\u5efaStarwhale Model"),(0,l.kt)("p",null,"\u4e00\u822c\u60c5\u51b5\u4e0b\uff0c\u7528\u6237\u7ecf\u8fc7\u591a\u6b21\u8fd0\u884c\u6a21\u578b\u8bc4\u6d4b\u547d\u4ee4(\u6b65\u9aa42)\u8fdb\u884c\u8c03\u8bd5\uff0c\u5f97\u5230\u4e00\u4e2a\u53ef\u4ee5\u5728\u5927\u6570\u636e\u91cf\u4e0b\u8fd0\u884c\u8bc4\u6d4b\u6216\u53ef\u53d1\u5e03\u7684\u6a21\u578b\uff0c\u5c31\u9700\u8981\u6267\u884c\u6b65\u9aa43\uff0c\u6784\u5efa\u4e00\u4e2a\u53ef\u5206\u53d1\u7684Starwhale Model\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"#\u6839\u636emodel.yaml\u6784\u5efaStarwhale Model\nswcli model build . --uri pytorch/version/latest\n# \u67e5\u770b\u6700\u65b0\u6784\u5efa\u7684\u6a21\u578b\u4fe1\u606f\nswcli model info cifar_net/version/latest\n")),(0,l.kt)("h3",{id:"\u6b65\u9aa44cloud-instance\u4e2d\u8bc4\u6d4b\u6a21\u578b\u53ef\u9009"},"\u6b65\u9aa44\uff1aCloud Instance\u4e2d\u8bc4\u6d4b\u6a21\u578b\uff08\u53ef\u9009\uff09"),(0,l.kt)("p",null,"\u5728Cloud Instance\u4e0a\u8fd0\u884c\u8bc4\u6d4b\u4efb\u52a1\uff0c\u9700\u8981\u5c06Standalone Instance\u4e0a\u6784\u5efa\u7684Model\u3001Dataset\u548cRuntime\u53d1\u5e03\u5230\u76f8\u5e94\u7684Instance\u4e0a\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"# \u767b\u9646\u76f8\u5173instance\uff0c\u4e4b\u540e\u53ef\u4ee5\u7528 prod alias\u8bbf\u95ee\u8be5instance\nswcli instance login --username ${username} --token ${token}  http://${instance-address} --alias prod\n# \u5c06\u672c\u5730\u9ed8\u8ba4instance\u6539\u4e3astandalone\nswcli instance select local\n#\u4e0a\u4f20model\u5230prod instance\u4e2did\u4e3a1\u7684project\u4e2d\nswcli model copy cifar_net/version/latest cloud://prod/project/1\n#\u4e0a\u4f20dataset\u5230prod instance\u4e2did\u4e3a1\u7684project\u4e2d\nswcli dataset copy cifar10-test/version/latest cloud://prod/project/1\n#\u4e0a\u4f20runtime\u5230prod instance\u4e2did\u4e3a1\u7684project\u4e2d\nswcli runtime copy pytorch/version/latest cloud://prod/project/1\n")),(0,l.kt)("p",null,"\u7136\u540e\uff0c\u53ef\u4ee5\u5728\u7ec8\u7aef\u4e2d\u6267\u884c",(0,l.kt)("inlineCode",{parentName:"p"},"swcli ui prod"),"\u547d\u4ee4\uff0c\u53ef\u4ee5\u62c9\u8d77\u6d4f\u89c8\u5668\u5e76\u8fdb\u5165prod instance\u7684web\u9875\u9762\u4e2d\uff0c\u63a5\u7740\u8fdb\u5165\u76f8\u5173project\uff0c\u521b\u5efa\u8bc4\u6d4b\u4efb\u52a1\u5373\u53ef\u3002"),(0,l.kt)("h2",{id:"3\u53c2\u8003\u8d44\u6599"},"3.\u53c2\u8003\u8d44\u6599"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html"},"Training a classifier")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://www.cs.toronto.edu/~kriz/cifar.html"},"cifar10 \u6570\u636e\u96c6"))))}d.isMDXComponent=!0},8939:function(e,t,a){t.Z=a.p+"assets/images/cifar10-dataset-59d0f04ac288a6306a91b91ba562d4a8.gif"}}]);