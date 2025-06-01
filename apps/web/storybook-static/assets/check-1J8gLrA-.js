import{r as u,a as C}from"./index-B2-qRKKC.js";import{j as y}from"./jsx-runtime-DF2Pcvd1.js";function _(e,t=[]){let o=[];function i(n,s){const c=u.createContext(s),f=o.length;o=[...o,s];const l=d=>{var x;const{scope:m,children:b,...h}=d,v=((x=m==null?void 0:m[e])==null?void 0:x[f])||c,w=u.useMemo(()=>h,Object.values(h));return y.jsx(v.Provider,{value:w,children:b})};l.displayName=n+"Provider";function a(d,m){var v;const b=((v=m==null?void 0:m[e])==null?void 0:v[f])||c,h=u.useContext(b);if(h)return h;if(s!==void 0)return s;throw new Error(`\`${d}\` must be used within \`${n}\``)}return[l,a]}const r=()=>{const n=o.map(s=>u.createContext(s));return function(c){const f=(c==null?void 0:c[e])||n;return u.useMemo(()=>({[`__scope${e}`]:{...c,[e]:f}}),[c,f])}};return r.scopeName=e,[i,g(r,...t)]}function g(...e){const t=e[0];if(e.length===1)return t;const o=()=>{const i=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(n){const s=i.reduce((c,{useScope:f,scopeName:l})=>{const d=f(n)[`__scope${l}`];return{...c,...d}},{});return u.useMemo(()=>({[`__scope${t.scopeName}`]:s}),[s])}};return o.scopeName=t.scopeName,o}function B(e,t,{checkForDefaultPrevented:o=!0}={}){return function(r){if(e==null||e(r),o===!1||!r.defaultPrevented)return t==null?void 0:t(r)}}var p=globalThis!=null&&globalThis.document?u.useLayoutEffect:()=>{},$=C[" useInsertionEffect ".trim().toString()]||p;function M({prop:e,defaultProp:t,onChange:o=()=>{},caller:i}){const[r,n,s]=k({defaultProp:t,onChange:o}),c=e!==void 0,f=c?e:r;{const a=u.useRef(e!==void 0);u.useEffect(()=>{const d=a.current;d!==c&&console.warn(`${i} is changing from ${d?"controlled":"uncontrolled"} to ${c?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),a.current=c},[c,i])}const l=u.useCallback(a=>{var d;if(c){const m=z(a)?a(e):a;m!==e&&((d=s.current)==null||d.call(s,m))}else n(a)},[c,e,n,s]);return[f,l]}function k({defaultProp:e,onChange:t}){const[o,i]=u.useState(e),r=u.useRef(o),n=u.useRef(t);return $(()=>{n.current=t},[t]),u.useEffect(()=>{var s;r.current!==o&&((s=n.current)==null||s.call(n,o),r.current=o)},[o,r]),[o,i,n]}function z(e){return typeof e=="function"}function I(e){const t=u.useRef({value:e,previous:e});return u.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}function O(e){const[t,o]=u.useState(void 0);return p(()=>{if(e){o({width:e.offsetWidth,height:e.offsetHeight});const i=new ResizeObserver(r=>{if(!Array.isArray(r)||!r.length)return;const n=r[0];let s,c;if("borderBoxSize"in n){const f=n.borderBoxSize,l=Array.isArray(f)?f[0]:f;s=l.inlineSize,c=l.blockSize}else s=e.offsetWidth,c=e.offsetHeight;o({width:s,height:c})});return i.observe(e,{box:"border-box"}),()=>i.unobserve(e)}else o(void 0)},[e]),t}/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),S=(...e)=>e.filter((t,o,i)=>!!t&&t.trim()!==""&&i.indexOf(t)===o).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var A={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=u.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:o=2,absoluteStrokeWidth:i,className:r="",children:n,iconNode:s,...c},f)=>u.createElement("svg",{ref:f,...A,width:t,height:t,stroke:e,strokeWidth:i?Number(o)*24/Number(t):o,className:S("lucide",r),...c},[...s.map(([l,a])=>u.createElement(l,a)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=(e,t)=>{const o=u.forwardRef(({className:i,...r},n)=>u.createElement(R,{ref:n,iconNode:t,className:S(`lucide-${P(e)}`,i),...r}));return o.displayName=`${e}`,o};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=E("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);export{N as C,M as a,B as b,_ as c,I as d,O as e,E as f,p as u};
