if(!self.define){let e,i={};const o=(o,r)=>(o=new URL(o+".js",r).href,i[o]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=i,document.head.appendChild(e)}else e=o,importScripts(o),i()})).then((()=>{let e=i[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(r,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let n={};const s=e=>o(e,c),f={module:{uri:c},exports:n,require:s};i[c]=Promise.all(r.map((e=>f[e]||s(e)))).then((e=>(t(...e),n)))}}define(["./workbox-873c5e43"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"app.js",revision:"9c28009ac23b69f39f5b609c46c39dc8"},{url:"app.js.LICENSE.txt",revision:"654ae0929d440554a3f74a1c43ed3390"},{url:"favicon.ico",revision:"661c73f49c667a59ffe45645ed49b9b4"},{url:"index.html",revision:"cecfda310d34de159f32ca76e7919f98"}],{})}));
//# sourceMappingURL=service-worker.js.map
