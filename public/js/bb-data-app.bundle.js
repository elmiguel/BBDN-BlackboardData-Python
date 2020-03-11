/*! For license information please see bb-data-app.bundle.js.LICENSE.txt */
!function(t){var e={};function a(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)a.d(n,s,function(e){return t[e]}.bind(null,s));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s="./client/ts/bb-data-app.ts")}({"./client/ts/bb-data-app.ts":function(t,e,a){"use strict";a.r(e);var n=a("./client/ts/components/bb-data-basic-table-alt-2.ts");customElements.define("bb-data-table-basic-alt2",n.a);const s=window.document.getElementById("bb-data-demo");window.document.querySelectorAll(".query").forEach((function(t){t.addEventListener("click",(function(t){t.preventDefault();const e=t.target,a=JSON.parse(e.dataset.queryConfig);s.setAttribute("queryname",a.queryname)}))}))},"./client/ts/bb-data-variables.ts":function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));const n={host:"http://localhost:3000"}},"./client/ts/components/bb-data-basic-table-alt-2.ts":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a("./client/ts/core/bb-data-abstract-class.ts"),s=a("./client/ts/core/bb-data-service.ts"),o=function(t,e,a,n){return new(a||(a=Promise))((function(s,o){function r(t){try{c(n.next(t))}catch(t){o(t)}}function i(t){try{c(n.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?s(t.value):(e=t.value,e instanceof a?e:new a((function(t){t(e)}))).then(r,i)}c((n=n.apply(t,e||[])).next())}))};class r extends n.a{constructor(){super(),this.bbDataService=new s.a,this.self=this,this.template=window.document.getElementById("bb-data-table-basic-tmpl-alt"),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this.template.content.cloneNode(!0)),this.queryName=this.getAttribute("queryname"),this.select=this.getAttribute("select"),this.type=this.getAttribute("type"),this.format=this.getAttribute("format"),console.log(`[queryName] ${this.queryName}`)}static get observedAttributes(){return["queryname","select","type","format"]}connectedCallback(){}disconnectedCallback(){}attributeChangedCallback(t,e,a){return o(this,void 0,void 0,(function*(){if(e!==a&&"queryname"===t&&a){console.log(t,e,a),this[t]=a;const n=yield this.bbDataService.runQuery2(a);this.data=n[a],console.log("[change detection]",this.data),this.updateTable()}}))}updateTable(){console.log("[updateTable] re-rendering table data..."),console.log("=== DATA ===/>",this.data),this.table=this.shadowRoot.querySelector("table"),this.table.innerHTML="",this.dataTable=new simpleDatatables.DataTable(this.table,{data:this.data,columns:[{select:+this.select,type:this.type,format:this.format}]})}}},"./client/ts/core/bb-data-abstract-class.ts":function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));class n extends HTMLElement{constructor(){super();const t=this;window.irsc||(window.irsc={}),t.constructor.observedAttributes&&t.constructor.observedAttributes.length&&t.constructor.observedAttributes.forEach(t=>{"data"!==t&&(/[-]/gim.test(t)&&(t=this.pascalCase(t)),Object.defineProperty(this,t,{get(){return this.getAttribute(t)},set(e){e?this.setAttribute(t,e):this.removeAttribute(t)}}))})}attributeChangedCallback(t,e,a){if(e!==a){console.log("Abstract attributeChangedCallback....");const e=this[`slot${this.titleize(this.pascalCase(t))}`];e&&(e.innerText=a)}}pascalCase(t){return t.split("-").map((t,e)=>0===e?t:this.titleize(t)).join("")}titleize(t){return t.charAt(0).toUpperCase()+t.slice(1)}}},"./client/ts/core/bb-data-service.ts":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a("./client/ts/bb-data-variables.ts"),s=a("./client/ts/core/bb-data-state.ts"),o=function(t,e,a,n){return new(a||(a=Promise))((function(s,o){function r(t){try{c(n.next(t))}catch(t){o(t)}}function i(t){try{c(n.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?s(t.value):(e=t.value,e instanceof a?e:new a((function(t){t(e)}))).then(r,i)}c((n=n.apply(t,e||[])).next())}))};class r{constructor(){this.bbDataUrl=`${n.a.host}/queries`,this.dataState=new s.a,window.hasOwnProperty("bbdata")||(window.bbdata={}),window.irsc.hasOwnProperty("BbDataService")||(window.irsc.PathwayService=this),this.bbdata=window.bbdata}isTest(t){return!t||"test"===t||""===t||void 0===t}runQuery(t,e=null){console.log(`[BbDataState.runQuery('${t}', ${e})]`),this.isTest(t)?(console.log(`${n.a.host}/test`),fetch(`${n.a.host}/test`).then(t=>t.json()).then(e=>{console.log(e);const a={};a[t]=e,this.dataState.updateState(a)}).catch(t=>{console.log("There was a problem loading test query....."),console.log(t)})):(console.log("this should not run if test!!!!"),this.bbdata.hasOwnProperty(t)||this.isTest(t)||fetch(`${this.bbDataUrl}/${t}`).then(t=>t.json()).then(e=>{console.log(e);const a={};a[t]=e,this.dataState.updateState(a)}).catch(e=>{console.log(`There was an error in retrieving data with queryName: ${t}`),console.log(e)}))}runQuery2(t,e=null){return o(this,void 0,void 0,(function*(){console.log(`[BbDataService.runQuery('${t}', ${e})]`);let a="";a=this.isTest(t)?`${n.a.host}/test`:`${this.bbDataUrl}/${t}`,console.log(`${n.a.host}/test`);try{const e=yield fetch(a).then(t=>t.json());console.log("[BbDataService.runQuery.fetch(url)]...",e);const n={};return n[t]=e,n}catch(e){console.log(`There was an error in retrieving data with queryName: ${t}`),console.log(e)}}))}}},"./client/ts/core/bb-data-state.ts":function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));class n{constructor(){this._unsubscribe=new rxjs.Subject,window.hasOwnProperty("bbdata")||(window.bbdata={}),window.bbdata.hasOwnProperty("BbDataState")||(window.bbdata.BbDataState=this);this.state=new rxjs.BehaviorSubject({}).pipe(rxjs.operators.distinctUntilChanged(),rxjs.operators.filter(t=>t))}updateState(t){console.log("[BbDataState.updateState()]",t),this.state.next(t);const e=new CustomEvent("bb-data-update",{detail:t,bubbles:!0,composed:!0});window.document.querySelectorAll("[class*='bb-data-table']").forEach(t=>{t.dispatchEvent(e)})}getStateSlice(t){return this.state.pipe(rxjs.operators.pluck(t))}freeze(){this._unsubscribe.next(null)}}}});
//# sourceMappingURL=bb-data-app.bundle.map