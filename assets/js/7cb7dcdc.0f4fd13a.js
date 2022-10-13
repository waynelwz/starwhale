"use strict";(self.webpackChunkstarwhale_docs=self.webpackChunkstarwhale_docs||[]).push([[107],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return h}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),m=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=m(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=m(a),h=r,k=u["".concat(s,".").concat(h)]||u[h]||d[h]||l;return a?n.createElement(k,i(i({ref:t},p),{},{components:a})):n.createElement(k,i({ref:t},p))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var m=2;m<l;m++)i[m]=a[m];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5933:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return h},frontMatter:function(){return o},metadata:function(){return m},toc:function(){return d}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),i=["components"],o={title:"Helm Charts Installation"},s=void 0,m={unversionedId:"guides/install/helm-charts",id:"guides/install/helm-charts",title:"Helm Charts Installation",description:"Helm Charts",source:"@site/docs/guides/install/helm-charts.md",sourceDirName:"guides/install",slug:"/guides/install/helm-charts",permalink:"/docs/guides/install/helm-charts",draft:!1,editUrl:"https://github.com/star-whale/starwhale/tree/main/docs/docs/guides/install/helm-charts.md",tags:[],version:"current",frontMatter:{title:"Helm Charts Installation"},sidebar:"mainSidebar",previous:{title:"Standalone Installing",permalink:"/docs/guides/install/standalone"},next:{title:"Overview",permalink:"/docs/guides/config/standalone_config"}},p={},d=[{value:"Helm Charts",id:"helm-charts",level:2},{value:"TL; DR",id:"tl-dr",level:2},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Installing the Chart",id:"installing-the-chart",level:2},{value:"Uninstalling the Chart",id:"uninstalling-the-chart",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Common parameters",id:"common-parameters",level:3},{value:"Starwhale parameters",id:"starwhale-parameters",level:3},{value:"Infra parameters",id:"infra-parameters",level:3},{value:"minikube parameters",id:"minikube-parameters",level:3},{value:"Community",id:"community",level:2}],u={toc:d};function h(e){var t=e.components,a=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"helm-charts"},"Helm Charts"),(0,l.kt)("p",null,"Helm Charts helps you quickly deploy the whole Starwhale instance in Kubernetes."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"To deploy, upgrade, and maintain the Starwhale ",(0,l.kt)("inlineCode",{parentName:"li"},"controller"),"."),(0,l.kt)("li",{parentName:"ul"},"To deploy third-party dependencies, such as minio, mysql, etc.")),(0,l.kt)("h2",{id:"tl-dr"},"TL; DR"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"helm repo add starwhale https://star-whale.github.io/charts\nhelm repo update\nhelm install starwhale starwhale/starwhale -n starwhale --create-namespace\n")),(0,l.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Kubernetes 1.19+"),(0,l.kt)("li",{parentName:"ul"},"Helm 3.2.0+")),(0,l.kt)("h2",{id:"installing-the-chart"},"Installing the Chart"),(0,l.kt)("p",null,"To install the chart with the release name starwhale:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"helm repo add starwhale https://star-whale.github.io/charts\nhelm install starwhale starwhale/starwhale\n")),(0,l.kt)("h2",{id:"uninstalling-the-chart"},"Uninstalling the Chart"),(0,l.kt)("p",null,"To remove the starwhale deployment:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"helm delete starwhale\n")),(0,l.kt)("h2",{id:"parameters"},"Parameters"),(0,l.kt)("h3",{id:"common-parameters"},"Common parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Name"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"image.registry")),(0,l.kt)("td",{parentName:"tr",align:null},"image registry, you can find Starwhale docker images in docker.io or ghcr.io."),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"ghcr.io"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"image.org")),(0,l.kt)("td",{parentName:"tr",align:null},"image registry org, ",(0,l.kt)("a",{parentName:"td",href:"https://hub.docker.com/u/starwhaleai"},"starwhaleai"),"(docker.io) or ",(0,l.kt)("a",{parentName:"td",href:"https://github.com/orgs/star-whale"},"star-whale"),"(ghcr.io) or some custom org name in other registries"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"star-whale"))))),(0,l.kt)("h3",{id:"starwhale-parameters"},"Starwhale parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Name"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"controller.taskSplitSize")),(0,l.kt)("td",{parentName:"tr",align:null},"task split size"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"2"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"controller.auth.username")),(0,l.kt)("td",{parentName:"tr",align:null},"admin user name"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"starwhale"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"controller.auth.password")),(0,l.kt)("td",{parentName:"tr",align:null},"admin user password"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"abcd1234"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"storage.agentHostPathRoot")),(0,l.kt)("td",{parentName:"tr",align:null},"persistent host-path for cache data of job"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"/mnt/data/starwhale"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"mirror.conda.enabled")),(0,l.kt)("td",{parentName:"tr",align:null},"conda mirror"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"true"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"mirror.pypi.enabled")),(0,l.kt)("td",{parentName:"tr",align:null},"pypi mirror"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"true"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"ingress.enabled")),(0,l.kt)("td",{parentName:"tr",align:null},"enable ingress for starwhale controller"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"true"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"ingress.ingressClassName")),(0,l.kt)("td",{parentName:"tr",align:null},"ingress class name"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"nginx"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"ingress.host")),(0,l.kt)("td",{parentName:"tr",align:null},"starwhale controller domain"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"console.pre.intra.starwhale.ai"))))),(0,l.kt)("h3",{id:"infra-parameters"},"Infra parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Name"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"mysql.enabled")),(0,l.kt)("td",{parentName:"tr",align:null},"Deploy a standalone mysql instance with starwhale chart. If set mysql.enabled=true, you should provide a pv for mysql."),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"true"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"mysql.persistence.storageClass")),(0,l.kt)("td",{parentName:"tr",align:null},"mysql pvc storageClass"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"local-storage-mysql"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"externalMySQL.host")),(0,l.kt)("td",{parentName:"tr",align:null},"When mysql.enabled is false, chart will use external mysql."),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"localhost"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"minio.enabled")),(0,l.kt)("td",{parentName:"tr",align:null},"Deploy a standalone minio instance with starwhale chart. If set minio.enabled=true, you should provide a pv for minio."),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"true"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"minio.persistence.storageClass")),(0,l.kt)("td",{parentName:"tr",align:null},"minio pvc storageClass"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"local-storage-minio"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"externalS3OSS.host")),(0,l.kt)("td",{parentName:"tr",align:null},"When minio.enabled is false, chart will use external s3 service."),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"localhost"))))),(0,l.kt)("h3",{id:"minikube-parameters"},"minikube parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Name"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"minikube.enabled")),(0,l.kt)("td",{parentName:"tr",align:null},"minikube mode for the all-in-one test."),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"false"))))),(0,l.kt)("p",null,"In minikube mode, you can easy to build an all-in-one starwhale. Run command example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"helm upgrade --install starwhale starwhale/starwhale --namespace starwhale --create-namespace --set minikube.enabled=true\n")),(0,l.kt)("h2",{id:"community"},"Community"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"To report a bug or request a feature, use ",(0,l.kt)("a",{parentName:"li",href:"https://github.com/star-whale/starwhale/issues/new/choose"},"Github Issues"),"."),(0,l.kt)("li",{parentName:"ul"},"For online support, please join us on ",(0,l.kt)("a",{parentName:"li",href:"https://join.slack.com/t/starwhale/shared_invite/zt-19b6cwnyo-BxMrZYWKj2J~kly1c32oEA"},"Slack"),"."),(0,l.kt)("li",{parentName:"ul"},"Your pull requests are always welcomed: ",(0,l.kt)("a",{parentName:"li",href:"https://github.com/star-whale/starwhale"},"Github Repo"),".")))}h.isMDXComponent=!0}}]);