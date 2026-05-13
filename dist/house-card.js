/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const o=this.t;if(e&&void 0===t){const e=void 0!==o&&1===o.length;e&&(t=i.get(o)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(o,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new r(i,t,o)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,m=globalThis,g=m.trustedTypes,u=g?g.emptyScript:"",f=m.reactiveElementPolyfillSupport,b=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},_=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:_};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const s=i?.call(this);r?.call(this,e),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const o=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((o,i)=>{if(e)o.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,o.appendChild(i)}})(o,this.constructor.elementStyles),o}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(void 0!==i&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:v).toAttribute(e,o.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=o.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const s=r.fromAttribute(e,t.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(t,e,o,i=!1,r){if(void 0!==t){const s=this.constructor;if(!1===i&&(r=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??_)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:r},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==r||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,o,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,f?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,w=t=>t,k=$.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",F=`lit$${Math.random().toFixed(9).slice(2)}$`,R="?"+F,S=`<${R}>`,E=document,M=()=>E.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,H="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,P=/>/g,U=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,I=/^(?:script|style|textarea|title)$/i,j=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),B=j(1),q=j(2),G=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,Y=E.createTreeWalker(E,129);function X(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const o=t.length-1,i=[];let r,s=2===e?"<svg>":3===e?"<math>":"",n=z;for(let e=0;e<o;e++){const o=t[e];let a,l,c=-1,d=0;for(;d<o.length&&(n.lastIndex=d,l=n.exec(o),null!==l);)d=n.lastIndex,n===z?"!--"===l[1]?n=O:void 0!==l[1]?n=P:void 0!==l[2]?(I.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=r??z,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?D:L):n===D||n===L?n=U:n===O||n===P?n=z:(n=U,r=void 0);const h=n===U&&t[e+1].startsWith("/>")?" ":"";s+=n===z?o+S:c>=0?(i.push(a),o.slice(0,c)+C+o.slice(c)+F+h):o+F+(-2===c?e:h)}return[X(t,s+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let r=0,s=0;const n=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=K.createElement(l,o),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Y.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[s++],o=i.getAttribute(t).split(F),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:o,ctor:"."===n[1]?ot:"?"===n[1]?it:"@"===n[1]?rt:et}),i.removeAttribute(t)}else t.startsWith(F)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(F),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],M()),Y.nextNode(),a.push({type:2,index:++r});i.append(t[e],M())}}}else if(8===i.nodeType)if(i.data===R)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(F,t+1));)a.push({type:7,index:r}),t+=F.length-1}r++}}static createElement(t,e){const o=E.createElement("template");return o.innerHTML=t,o}}function Z(t,e,o=t,i){if(e===G)return e;let r=void 0!==i?o._$Co?.[i]:o._$Cl;const s=T(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(t),r._$AT(t,o,i)),void 0!==i?(o._$Co??=[])[i]=r:o._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);Y.currentNode=i;let r=Y.nextNode(),s=0,n=0,a=o[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=o[++n]}s!==a?.index&&(r=Y.nextNode(),s++)}return Y.currentNode=E,i}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),T(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=K.createElement(X(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const r of t)i===e.length?e.push(o=new tt(this.O(M()),this.O(M()),this,this.options)):o=e[i],o._$AI(r),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(t,e=this,o,i){const r=this.strings;let s=!1;if(void 0===r)t=Z(this,t,e,0),s=!T(t)||t!==this._$AH&&t!==G,s&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Z(this,i[o+n],e,n),a===G&&(a=this._$AH[n]),s||=!T(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}s&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class rt extends et{constructor(t,e,o,i,r){super(t,e,o,i,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??V)===G)return;const o=this._$AH,i=t===V&&o!==V||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==V&&(o===V||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=$.litHtmlPolyfillSupport;nt?.(K,tt),($.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const i=o?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=o?.renderBefore??null;i._$litPart$=r=new tt(e.insertBefore(M(),t),t,void 0,o??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const dt={bedroom:"mdi:bed",master_bedroom:"mdi:bed-king",bathroom:"mdi:shower",toilet:"mdi:toilet",kitchen:"mdi:silverware-fork-knife",lounge:"mdi:sofa",living_room:"mdi:sofa",dining:"mdi:food-fork-drink",office:"mdi:desk",study:"mdi:bookshelf",hall:"mdi:door-open",entrance:"mdi:door",landing:"mdi:stairs",garage:"mdi:garage",garden:"mdi:flower",utility:"mdi:washing-machine",conservatory:"mdi:greenhouse",playroom:"mdi:toy-brick",gym:"mdi:dumbbell"},ht={person:{icon:"mdi:walk",color:"#22d3ee"},dog:{icon:"mdi:dog",color:"#fbbf24"},cat:{icon:"mdi:cat",color:"#c084fc"},vehicle:{icon:"mdi:car",color:"#60a5fa"},package:{icon:"mdi:package-variant",color:"#fb923c"}},pt={bedroom:"Bedroom",master_bedroom:"Master Bedroom",bathroom:"Bathroom",toilet:"Toilet / WC",kitchen:"Kitchen",lounge:"Lounge",living_room:"Living Room",dining:"Dining Room",office:"Office",study:"Study",hall:"Hall",entrance:"Entrance",landing:"Landing",garage:"Garage",garden:"Garden",utility:"Utility Room",conservatory:"Conservatory",playroom:"Playroom",gym:"Gym"},mt="floors",gt="grid",ut="room",ft=["#3d5a78","#4d4870","#2d5a40","#6a4530","#6a3055","#2a5550","#5a5020","#6a4020"];function bt(t,e,o,i){const r=i?.tilt??.55;return{sx:t-e*(i?.shear??.15),sy:e*r-o}}customElements.define("house-card-editor",class extends lt{static get properties(){return{hass:{type:Object},_config:{type:Object},_editorState:{type:String},_activeFloorIdx:{type:Number},_activeRoomId:{type:String},_dragStart:{type:Object},_dragCurrent:{type:Object},_isDragging:{type:Boolean}}}static get styles(){return s`
      :host {
        display: block;
        padding: 4px 0;
      }

      /* ── Section headers ── */
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .back-btn {
        background: none;
        border: none;
        color: var(--primary-color, #4a90d9);
        cursor: pointer;
        font-size: 0.85rem;
        padding: 4px 0;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* ── Floors list ── */
      .floor-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .floor-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--secondary-background-color, rgba(255,255,255,0.05));
        border-radius: 8px;
        border: 1px solid var(--divider-color, rgba(255,255,255,0.1));
      }

      .floor-item-name {
        flex: 1;
        font-size: 0.9rem;
        color: var(--primary-text-color);
      }

      .floor-item-meta {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
      }

      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--secondary-text-color);
        border-radius: 4px;
        transition: color 0.2s, background 0.2s;
      }

      .icon-btn:hover {
        color: var(--primary-text-color);
        background: rgba(255,255,255,0.08);
      }

      .icon-btn.danger:hover {
        color: var(--error-color, #f44336);
        background: rgba(244,67,54,0.1);
      }

      .icon-btn.edit {
        color: var(--primary-color, #4a90d9);
      }

      /* ── Add floor form ── */
      .add-floor-form {
        display: grid;
        grid-template-columns: 1fr 80px 80px;
        gap: 8px;
        align-items: end;
        padding: 12px;
        background: var(--secondary-background-color, rgba(255,255,255,0.03));
        border-radius: 8px;
        border: 1px dashed var(--divider-color, rgba(255,255,255,0.15));
        margin-bottom: 16px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .form-label {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      input[type="text"],
      input[type="number"],
      select {
        background: var(--card-background-color, #1c1c1e);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
        border-radius: 6px;
        color: var(--primary-text-color);
        padding: 6px 10px;
        font-size: 0.9rem;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s;
      }

      input:focus, select:focus {
        border-color: var(--primary-color, #4a90d9);
      }

      /* ── Buttons ── */
      .btn {
        padding: 8px 14px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s;
      }

      .btn-primary {
        background: var(--primary-color, #4a90d9);
        color: white;
      }

      .btn-primary:hover {
        filter: brightness(1.1);
      }

      .btn-secondary {
        background: var(--secondary-background-color, rgba(255,255,255,0.08));
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
      }

      .btn-secondary:hover {
        background: rgba(255,255,255,0.12);
      }

      .btn-danger {
        background: rgba(244,67,54,0.15);
        color: var(--error-color, #f44336);
        border: 1px solid rgba(244,67,54,0.3);
      }

      /* ── Grid painter ── */
      .grid-instructions {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        margin-bottom: 12px;
        line-height: 1.5;
      }

      .grid-painter {
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        margin-bottom: 16px;
        border: 1px solid var(--divider-color, rgba(255,255,255,0.1));
        border-radius: 8px;
        overflow: hidden;
        cursor: crosshair;
      }

      .grid-cell {
        position: absolute;
        box-sizing: border-box;
        border: 1px solid rgba(255,255,255,0.06);
        transition: background 0.1s;
      }

      .grid-cell.empty {
        background: rgba(255,255,255,0.02);
      }

      .grid-cell.preview {
        background: rgba(74, 144, 217, 0.25);
        border-color: rgba(74, 144, 217, 0.5);
      }

      .room-overlay {
        position: absolute;
        box-sizing: border-box;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: filter 0.2s;
        cursor: pointer;
      }

      .room-overlay:hover {
        filter: brightness(1.2);
        z-index: 10;
      }

      .room-overlay-name {
        font-size: 0.65rem;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        text-align: center;
        padding: 2px 4px;
        pointer-events: none;
      }

      .room-overlay-del {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 16px;
        height: 16px;
        background: rgba(244,67,54,0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .room-overlay:hover .room-overlay-del {
        opacity: 1;
      }

      /* ── Room name dialog ── */
      .room-name-dialog {
        margin: 12px 0;
        padding: 12px;
        background: var(--secondary-background-color, rgba(255,255,255,0.05));
        border-radius: 8px;
        border: 1px solid var(--primary-color, #4a90d9);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .room-name-dialog-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .dialog-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      /* ── Room entity editor ── */
      .entity-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }

      .entity-row:last-child {
        border-bottom: none;
      }

      .entity-type-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text-color);
      }

      .rooms-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }

      .room-list-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: var(--secondary-background-color, rgba(255,255,255,0.04));
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
      }

      .room-list-item:hover {
        border-color: var(--primary-color, #4a90d9);
        background: rgba(74,144,217,0.08);
      }

      .room-list-item .room-color-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .divider {
        height: 1px;
        background: var(--divider-color, rgba(255,255,255,0.08));
        margin: 16px 0;
      }

      .picker-loading {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        padding: 8px 0;
      }

      .detection-entry {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .detection-entry ha-entity-picker,
      .detection-entry .picker-loading {
        flex: 1;
      }

      .detection-entry select {
        width: 110px;
        flex-shrink: 0;
      }

      .detection-remove {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        font-size: 1.1rem;
        padding: 2px 4px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .detection-remove:hover {
        color: var(--error-color, #f44336);
        background: rgba(244,67,54,0.1);
      }

      .add-detection-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: 1px dashed var(--divider-color, rgba(255,255,255,0.2));
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        color: var(--secondary-text-color);
        font-size: 0.82rem;
        width: 100%;
        margin-top: 4px;
        transition: border-color 0.2s, color 0.2s;
      }

      .add-detection-btn:hover {
        border-color: var(--primary-color, #4a90d9);
        color: var(--primary-color, #4a90d9);
      }

      .hint {
        font-size: 0.78rem;
        color: var(--secondary-text-color);
        font-style: italic;
        margin-top: 4px;
      }
    `}constructor(){super(),this._editorState=mt,this._activeFloorIdx=0,this._activeRoomId=null,this._dragStart=null,this._dragCurrent=null,this._isDragging=!1,this._pendingRoom=null,this._pendingName="",this._newFloorName="",this._newFloorCols=8,this._newFloorRows=6}setConfig(t){this._config={...t}}async firstUpdated(){if(!customElements.get("ha-entity-picker")){const t=await window.loadCardHelpers(),e=await t.createCardElement({type:"entities",entities:[]});await e.constructor.getConfigElement()}this.requestUpdate()}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)}_addFloor(){const t=this._newFloorName.trim()||`Floor ${(this._config.floors?.length||0)+1}`,e=Math.max(4,Math.min(16,parseInt(this._newFloorCols)||8)),o=Math.max(3,Math.min(12,parseInt(this._newFloorRows)||6)),i=`floor_${Date.now()}`;this._config={...this._config,floors:[...this._config.floors||[],{id:i,name:t,cols:e,rows:o,rooms:[]}]},this._newFloorName="",this._newFloorCols=8,this._newFloorRows=6,this._fireConfigChanged(),this.requestUpdate()}_deleteFloor(t){const e=[...this._config.floors||[]];e.splice(t,1),this._config={...this._config,floors:e},this._fireConfigChanged(),this.requestUpdate()}_editFloor(t){this._activeFloorIdx=t,this._editorState=gt,this._pendingRoom=null,this.requestUpdate()}_getActiveFloor(){return this._config.floors?.[this._activeFloorIdx]||null}_getCellFromEvent(t,e,o){const i=e.getBoundingClientRect(),r=(t.clientX-i.left)/i.width,s=(t.clientY-i.top)/i.height,n=Math.floor(r*o.cols),a=Math.floor(s*o.rows);return{col:Math.max(0,Math.min(o.cols-1,n)),row:Math.max(0,Math.min(o.rows-1,a))}}_onGridMouseDown(t){if(0!==t.button)return;const e=this._getActiveFloor();if(!e)return;const o=this.shadowRoot.querySelector(".grid-painter"),i=this._getCellFromEvent(t,o,e);this._dragStart=i,this._dragCurrent=i,this._isDragging=!0,t.preventDefault()}_onGridMouseMove(t){if(!this._isDragging)return;const e=this._getActiveFloor();if(!e)return;const o=this.shadowRoot.querySelector(".grid-painter"),i=this._getCellFromEvent(t,o,e);this._dragCurrent=i,this.requestUpdate()}_onGridMouseUp(t){if(!this._isDragging)return;this._isDragging=!1;const e=this._dragStart,o=this._dragCurrent,i=Math.min(e.col,o.col),r=Math.min(e.row,o.row),s=Math.abs(o.col-e.col)+1,n=Math.abs(o.row-e.row)+1,a=(this._getActiveFloor().rooms||[]).some(t=>i<t.col+t.width&&i+s>t.col&&r<t.row+t.height&&r+n>t.row);if(a)return this._dragStart=null,this._dragCurrent=null,void this.requestUpdate();this._pendingRoom={col:i,row:r,width:s,height:n},this._pendingName="",this._dragStart=null,this._dragCurrent=null,this.requestUpdate()}_confirmRoom(){const t=this._pendingName.trim();if(!t||!this._pendingRoom)return;const e=this._getActiveFloor(),o=(e.rooms?.length||0)%ft.length,i={id:`room_${Date.now()}`,name:t,color:ft[o],...this._pendingRoom,entities:{}},r=[...this._config.floors||[]];r[this._activeFloorIdx]={...e,rooms:[...e.rooms||[],i]},this._config={...this._config,floors:r},this._pendingRoom=null,this._pendingName="",this._fireConfigChanged(),this.requestUpdate()}_cancelRoom(){this._pendingRoom=null,this._pendingName="",this.requestUpdate()}_deleteRoom(t){const e=this._getActiveFloor(),o=[...this._config.floors||[]];o[this._activeFloorIdx]={...e,rooms:(e.rooms||[]).filter(e=>e.id!==t)},this._config={...this._config,floors:o},this._fireConfigChanged(),this.requestUpdate()}_editRoom(t){this._activeRoomId=t,this._editorState=ut,this.requestUpdate()}_getActiveRoom(){const t=this._getActiveFloor();return(t?.rooms||[]).find(t=>t.id===this._activeRoomId)||null}_updateRoomEntity(t,e,o){const i=this._getActiveFloor(),r=[...this._config.floors||[]];r[this._activeFloorIdx]={...i,rooms:(i.rooms||[]).map(i=>i.id!==t?i:{...i,entities:{...i.entities,[e]:o}})},this._config={...this._config,floors:r},this._fireConfigChanged(),this.requestUpdate()}_updateRoomType(t,e){const o=this._getActiveFloor(),i=[...this._config.floors||[]];i[this._activeFloorIdx]={...o,rooms:(o.rooms||[]).map(o=>o.id===t?{...o,room_type:e||void 0}:o)},this._config={...this._config,floors:i},this._fireConfigChanged(),this.requestUpdate()}_updateRoomName(t,e){const o=this._getActiveFloor(),i=[...this._config.floors||[]];i[this._activeFloorIdx]={...o,rooms:(o.rooms||[]).map(o=>o.id===t?{...o,name:e}:o)},this._config={...this._config,floors:i},this._fireConfigChanged(),this.requestUpdate()}_updateDetection(t,e,o,i){const r=this._getActiveFloor(),s=[...this._config.floors||[]];s[this._activeFloorIdx]={...r,rooms:(r.rooms||[]).map(r=>{if(r.id!==t)return r;const s=[...r.entities?.detections||[]];return s[e]={...s[e],[o]:i},{...r,entities:{...r.entities,detections:s}}})},this._config={...this._config,floors:s},this._fireConfigChanged(),this.requestUpdate()}_addDetection(t){const e=this._getActiveFloor(),o=[...this._config.floors||[]];o[this._activeFloorIdx]={...e,rooms:(e.rooms||[]).map(e=>{if(e.id!==t)return e;const o=[...e.entities?.detections||[],{entity:"",type:"person"}];return{...e,entities:{...e.entities,detections:o}}})},this._config={...this._config,floors:o},this._fireConfigChanged(),this.requestUpdate()}_removeDetection(t,e){const o=this._getActiveFloor(),i=[...this._config.floors||[]];i[this._activeFloorIdx]={...o,rooms:(o.rooms||[]).map(o=>{if(o.id!==t)return o;const i=(o.entities?.detections||[]).filter((t,o)=>o!==e);return{...o,entities:{...o.entities,detections:i}}})},this._config={...this._config,floors:i},this._fireConfigChanged(),this.requestUpdate()}_getPreviewRect(){if(!this._dragStart||!this._dragCurrent)return null;const t=this._dragStart,e=this._dragCurrent;return{col:Math.min(t.col,e.col),row:Math.min(t.row,e.row),width:Math.abs(e.col-t.col)+1,height:Math.abs(e.row-t.row)+1}}_renderGridPainter(t){const e=t.cols,o=t.rows,i=100/e,r=100/o,s=o/e*100,n=this._getPreviewRect(),a=[];for(let t=0;t<o;t++)for(let o=0;o<e;o++){const e=n&&o>=n.col&&o<n.col+n.width&&t>=n.row&&t<n.row+n.height;a.push(B`
          <div
            class="grid-cell ${e?"preview":"empty"}"
            style="
              left:${o*i}%;
              top:${t*r}%;
              width:${i}%;
              height:${r}%;
            "
          ></div>
        `)}const l=(t.rooms||[]).map(t=>B`
      <div
        class="room-overlay"
        style="
          left:${t.col*i}%;
          top:${t.row*r}%;
          width:${t.width*i}%;
          height:${t.height*r}%;
          background:${t.color}55;
          border-color:${t.color};
        "
        @click=${e=>{e.stopPropagation(),this._editRoom(t.id)}}
      >
        <div class="room-overlay-name">${t.name}</div>
        <div
          class="room-overlay-del"
          @click=${e=>{e.stopPropagation(),this._deleteRoom(t.id)}}
        >✕</div>
      </div>
    `);return B`
      <div
        class="grid-painter"
        style="padding-bottom:${s}%; position:relative;"
        @mousedown=${this._onGridMouseDown}
        @mousemove=${this._onGridMouseMove}
        @mouseup=${this._onGridMouseUp}
        @mouseleave=${()=>{this._isDragging&&this._onGridMouseUp()}}
      >
        ${a}
        ${l}
      </div>
    `}_renderFloorsState(){const t=this._config.floors||[];return B`
      <div class="section-header">
        <div class="section-title">Floors</div>
      </div>

      <div class="floor-list">
        ${0===t.length?B`
          <div class="hint">No floors yet — add one below.</div>
        `:t.map((t,e)=>B`
          <div class="floor-item">
            <div class="floor-item-name">${t.name}</div>
            <div class="floor-item-meta">${t.cols}×${t.rows} · ${(t.rooms||[]).length} rooms</div>
            <button class="icon-btn edit" @click=${()=>this._editFloor(e)} title="Edit layout">✏️</button>
            <button class="icon-btn danger" @click=${()=>this._deleteFloor(e)} title="Delete floor">🗑</button>
          </div>
        `)}
      </div>

      <div class="add-floor-form">
        <div class="form-field">
          <label class="form-label">Floor Name</label>
          <input
            type="text"
            .value=${this._newFloorName}
            placeholder="e.g. Ground Floor"
            @input=${t=>{this._newFloorName=t.target.value}}
          />
        </div>
        <div class="form-field">
          <label class="form-label">Columns</label>
          <input
            type="number"
            .value=${this._newFloorCols}
            min="4" max="16"
            @input=${t=>{this._newFloorCols=t.target.value}}
          />
        </div>
        <div class="form-field">
          <label class="form-label">Rows</label>
          <input
            type="number"
            .value=${this._newFloorRows}
            min="3" max="12"
            @input=${t=>{this._newFloorRows=t.target.value}}
          />
        </div>
      </div>
      <button class="btn btn-primary" @click=${this._addFloor}>+ Add Floor</button>

      <div class="divider"></div>

      <div class="form-field">
        <label class="form-label">Card Title</label>
        <input
          type="text"
          .value=${this._config.title||""}
          placeholder="My House"
          @input=${t=>{this._config={...this._config,title:t.target.value},this._fireConfigChanged()}}
        />
      </div>
    `}_renderGridState(){const t=this._getActiveFloor();if(!t)return B`<div>Floor not found</div>`;const e=t.rooms||[];return B`
      <div class="section-header">
        <button class="back-btn" @click=${()=>{this._editorState=mt,this._pendingRoom=null}}>
          ← Floors
        </button>
        <div class="section-title">${t.name}</div>
      </div>

      <p class="grid-instructions">
        Click and drag on the grid to draw a room rectangle. Click a room to edit its entities. Hover a room and click ✕ to remove it.
      </p>

      ${this._renderGridPainter(t)}

      ${this._pendingRoom?B`
        <div class="room-name-dialog">
          <div class="room-name-dialog-title">Name this room (${this._pendingRoom.width}×${this._pendingRoom.height})</div>
          <div class="form-field">
            <input
              type="text"
              .value=${this._pendingName}
              placeholder="e.g. Lounge"
              autofocus
              @input=${t=>{this._pendingName=t.target.value}}
              @keydown=${t=>{"Enter"===t.key&&this._confirmRoom(),"Escape"===t.key&&this._cancelRoom()}}
            />
          </div>
          <div class="dialog-actions">
            <button class="btn btn-secondary" @click=${this._cancelRoom}>Cancel</button>
            <button class="btn btn-primary" @click=${this._confirmRoom}>Add Room</button>
          </div>
        </div>
      `:""}

      ${e.length>0?B`
        <div class="divider"></div>
        <div class="section-title" style="margin-bottom:10px;">Rooms on this floor</div>
        <div class="rooms-list">
          ${e.map(t=>B`
            <div class="room-list-item" @click=${()=>this._editRoom(t.id)}>
              <div class="room-color-dot" style="background:${t.color};"></div>
              <div style="flex:1;font-size:0.88rem;">${t.name}</div>
              <div style="font-size:0.75rem;color:var(--secondary-text-color);">
                ${t.width}×${t.height}
                ${t.entities?.light||t.entities?.climate||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity?"· entities configured":"· no entities"}
              </div>
            </div>
          `)}
        </div>
      `:""}
    `}_renderRoomState(){const t=this._getActiveRoom(),e=this._getActiveFloor();return t?B`
      <div class="section-header">
        <button class="back-btn" @click=${()=>{this._editorState=gt,this._activeRoomId=null}}>
          ← ${e?.name}
        </button>
        <div class="section-title">${t.name}</div>
      </div>

      <div class="form-field" style="margin-bottom:12px;">
        <label class="form-label">Room Name</label>
        <input
          type="text"
          .value=${t.name}
          @input=${e=>this._updateRoomName(t.id,e.target.value)}
        />
      </div>

      <div class="form-field" style="margin-bottom:16px;">
        <label class="form-label">Room Type</label>
        <select
          .value=${t.room_type||""}
          @change=${e=>this._updateRoomType(t.id,e.target.value)}
        >
          <option value="">— None —</option>
          ${Object.entries(pt).map(([e,o])=>B`
            <option value="${e}" ?selected=${t.room_type===e}>${o}</option>
          `)}
        </select>
      </div>

      <div class="section-title" style="margin-bottom:8px;">Entity Bindings</div>

      ${[{key:"light",label:"Light",domains:["light"]},{key:"climate",label:"Thermostat / TRV",domains:["climate"]},{key:"occupancy",label:"Occupancy",domains:["binary_sensor"]},{key:"temperature",label:"Temperature",domains:["sensor"]},{key:"humidity",label:"Humidity",domains:["sensor"]}].map(({key:e,label:o,domains:i})=>B`
        <div class="entity-row">
          <div class="entity-type-label">${o}</div>
          ${customElements.get("ha-entity-picker")?B`<ha-entity-picker
                .hass=${this.hass}
                .value=${t.entities?.[e]||""}
                .includeDomains=${i}
                allow-custom-entity
                @value-changed=${o=>this._updateRoomEntity(t.id,e,o.detail.value)}
              ></ha-entity-picker>`:B`<div class="picker-loading">Loading…</div>`}
        </div>
      `)}

      <div class="section-title" style="margin-top:16px;margin-bottom:8px;">Camera Detections</div>

      ${(t.entities?.detections||[]).map((e,o)=>B`
        <div class="detection-entry">
          <select
            .value=${e.type||"person"}
            @change=${e=>this._updateDetection(t.id,o,"type",e.target.value)}
          >
            ${Object.entries(ht).map(([t])=>B`
              <option value="${t}" ?selected=${e.type===t}>
                ${t.charAt(0).toUpperCase()+t.slice(1)}
              </option>`)}
          </select>
          ${customElements.get("ha-entity-picker")?B`<ha-entity-picker
                .hass=${this.hass}
                .value=${e.entity||""}
                .includeDomains=${["binary_sensor"]}
                allow-custom-entity
                @value-changed=${e=>this._updateDetection(t.id,o,"entity",e.detail.value)}
              ></ha-entity-picker>`:B`<div class="picker-loading">Loading…</div>`}
          <button class="detection-remove"
            @click=${()=>this._removeDetection(t.id,o)}
            title="Remove">✕</button>
        </div>`)}

      <button class="add-detection-btn" @click=${()=>this._addDetection(t.id)}>
        + Add detection
      </button>
    `:B`<div>Room not found</div>`}render(){if(!this._config)return B`<div>Loading...</div>`;switch(this._editorState){case gt:return this._renderGridState();case ut:return this._renderRoomState();default:return this._renderFloorsState()}}});customElements.define("house-card",class extends lt{static get properties(){return{_config:{type:Object},_hass:{type:Object},_activeFloor:{type:Number},_activeHeatmapMode:{type:String},_activeLayout:{type:String}}}static get styles(){return s`
      :host {
        display: block;
        font-family: var(--primary-font-family, sans-serif);
      }

      ha-card {
        overflow: hidden;
        padding: 0;
        display: flex;
        flex-direction: column;
      }

      .card-header {
        display: flex;
        align-items: center;
        padding: 12px 16px 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--primary-text-color);
        flex-shrink: 0;
      }

      .card-title {
        flex: 1;
      }

      .heatmap-toggle {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        flex-shrink: 0;
      }

      .heatmap-toggle:hover {
        background: rgba(255,255,255,0.08);
      }

      .floor-tabs {
        display: flex;
        gap: 4px;
        padding: 10px 16px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1));
        flex-shrink: 0;
      }

      .floor-tab {
        padding: 6px 14px;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }

      .floor-tab.active {
        color: var(--primary-text-color);
        border-bottom-color: var(--primary-color, #4a90d9);
        font-weight: 500;
      }

      .floor-tab:hover:not(.active) {
        color: var(--primary-text-color);
        background: rgba(255,255,255,0.05);
      }

      .grid-wrapper {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 10px 14px 22px;
        overflow: hidden;
        perspective: 2400px;
        perspective-origin: 50% 50%;
      }

      .grid-canvas {
        position: relative;
        /* Width capped by JS (_sizeGridCanvas) so visual height fits wrapper */
        width: 100%;
        height: auto;
        min-height: 80px;
        /* Must not shrink — the wrapper clips overflow to visual height via JS */
        flex-shrink: 0;
        background: rgba(10, 11, 20, 0.95);
        border-radius: 2px;
        transform-style: preserve-3d;
        transform-origin: 50% 50%;
        transform: rotateX(38deg) rotateY(0deg);
        overflow: visible;
      }

      /* ── Thermal SVG overlay — sits behind all room divs ── */
      .thermal-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        border-radius: inherit;
        overflow: hidden;
      }

      /* ── Room 3D wrapper ── */
      .room-3d {
        position: absolute;
        box-sizing: border-box;
        transform-style: preserve-3d;
        z-index: 1;
      }

      /* ── Top face ── */
      .room-face {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border: 1px solid rgba(75, 80, 110, 0.38);
        background: rgba(30, 33, 52, 0.93);
        /*
         * Smooth the light-spill glow and background colour transitions.
         * box-shadow transition animates the glow in/out over 400ms.
         */
        transition: box-shadow 0.4s ease, background 0.4s ease;
        /* Prevent browser long-press context menu on touch devices */
        touch-action: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      .room-face.light-on {
        background: linear-gradient(150deg, rgba(90, 66, 14, 0.97), rgba(46, 31, 5, 0.99));
        border-color: rgba(175, 130, 32, 0.32);
      }

      .room-face.interactive {
        cursor: pointer;
      }

      /* ── Heatmap mode: fade room faces so thermal SVG shows through ── */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .room-face {
        background: rgba(5, 6, 14, 0.20) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
      }

      /* Preserve a subtle warm hint for lit rooms even in heatmap mode */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .room-face.light-on {
        background: linear-gradient(150deg, rgba(90, 66, 14, 0.35), rgba(46, 31, 5, 0.40)) !important;
        border-color: rgba(175, 130, 32, 0.32) !important;
      }

      /* Make info cards more opaque for legibility over the heatmap */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .room-info-card {
        background: rgba(5, 6, 14, 0.88);
      }

      /* Boost text legibility in heatmap mode */
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .info-room-name,
      .grid-canvas[data-heatmap]:not([data-heatmap="off"]) .info-row {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      }

      /* ── Room type icon — large semi-transparent watermark ── */
      .room-type-icon {
        position: absolute;
        bottom: 7px;
        right: 7px;
        --mdc-icon-size: clamp(36px, 5vw, 80px);
        opacity: 0.13;
        pointer-events: none;
        color: white;
      }

      /* ── Heating indicator — flame icon pulses when actively calling for heat ── */
      @keyframes heat-call-pulse {
        0%   { opacity: 0.65; transform: scale(1.0); }
        50%  { opacity: 1.0;  transform: scale(1.15); }
        100% { opacity: 0.65; transform: scale(1.0); }
      }

      .heat-calling {
        animation: heat-call-pulse 2s ease-in-out infinite;
        color: #ff8c42 !important;
      }

      /* ── Detection icons — row of camera detection indicators ── */
      @keyframes detection-pop {
        0%   { opacity: 0;    transform: scale(1.4); }
        50%  { opacity: 1.0;  transform: scale(0.92); }
        100% { opacity: 1.0;  transform: scale(1.0); }
      }

      .detection-row {
        display: flex;
        align-items: center;
        gap: clamp(3px, 0.4vw, 7px);
      }

      .detection-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 5s ease-out;
      }

      .detection-icon-wrap.active {
        animation: detection-pop 0.5s ease-out forwards;
        transition: opacity 0.3s ease-in;
      }

      /* ── Occupancy watermark — centred person icon, fades with different durations ── */
      @keyframes occupancy-pulse {
        0%   { opacity: 0;    transform: translate(-50%, -50%) scale(1.5); }
        40%  { opacity: 0.30; transform: translate(-50%, -50%) scale(0.95); }
        100% { opacity: 0.22; transform: translate(-50%, -50%) scale(1.0); }
      }

      .occupancy-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-icon-size: 56px;
        opacity: 0;
        pointer-events: none;
        color: #4cdf80;
        transition: opacity 7s ease-out;
      }

      .occupancy-watermark.occupied {
        animation: occupancy-pulse 0.7s ease-out forwards;
      }

      /* ── Front wall ── */
      .room-wall-front {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 18px;
        transform-origin: center bottom;
        transform: rotateX(-90deg);
        border-left: 1px solid rgba(255,255,255,0.03);
        border-right: 1px solid rgba(0,0,0,0.52);
        border-bottom: 2px solid rgba(0,0,0,0.75);
      }

      /* ── Left wall ── */
      .room-wall-left {
        position: absolute;
        top: 0;
        left: -1px;
        bottom: 0;
        width: 18px;
        transform-origin: left center;
        transform: rotateY(-90deg);
        border-top: 1px solid rgba(255,255,255,0.03);
        border-bottom: 1px solid rgba(0,0,0,0.48);
        border-left: 2px solid rgba(0,0,0,0.7);
      }

      /* ── Floating info card ── */
      .room-info-card {
        position: absolute;
        top: 7px;
        left: 7px;
        background: rgba(5, 6, 14, 0.78);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: clamp(8px, 1vw, 16px);
        padding: clamp(7px, 0.8vw, 16px) clamp(10px, 1.2vw, 22px);
        display: flex;
        flex-direction: column;
        gap: clamp(4px, 0.5vw, 10px);
        max-width: calc(100% - 14px);
        pointer-events: none;
        backdrop-filter: blur(4px);
      }

      .info-header {
        display: flex;
        align-items: center;
        gap: clamp(5px, 0.6vw, 10px);
      }

      .info-room-name {
        font-size: clamp(0.8rem, 1.2vw, 1.8rem);
        font-weight: 600;
        color: rgba(255,255,255,0.96);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: clamp(4px, 0.5vw, 8px);
        font-size: clamp(0.75rem, 1.0vw, 1.5rem);
        color: rgba(255,255,255,0.88);
        line-height: 1.3;
      }

      .info-header ha-icon,
      .info-row ha-icon {
        --mdc-icon-size: clamp(16px, 1.4vw, 26px);
        flex-shrink: 0;
      }

      /* ── Heatmap legend bar ── */
      .heatmap-legend {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 16px 6px;
        flex-shrink: 0;
      }

      .heatmap-legend-temp {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
      }

      .heatmap-gradient-bar {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(to right,
          rgb(44,95,163),
          rgb(29,158,117),
          rgb(245,196,62),
          rgb(232,138,48),
          rgb(208,72,72));
      }

      .heatmap-legend-label {
        font-size: clamp(0.68rem, 1.4vw, 0.85rem);
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .heatmap-legend-hum {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: clamp(0.68rem, 1.4vw, 0.85rem);
        color: var(--secondary-text-color);
      }

      /* ── Legend bar ── */
      .legend {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: clamp(10px, 1.2vw, 22px);
        padding: clamp(5px, 0.5vw, 10px) 16px;
        font-size: clamp(0.72rem, 1.0vw, 1.2rem);
        color: var(--secondary-text-color);
        flex-shrink: 0;
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: clamp(3px, 0.4vw, 8px);
        white-space: nowrap;
      }

      .legend-item ha-icon {
        --mdc-icon-size: clamp(13px, 1.1vw, 20px);
      }

      /* ── Axonometric / dollhouse view ── */
      .axo-wrapper {
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 16px 16px;
        overflow: hidden;
      }

      /*
       * max-width + max-height with aspect-ratio means the browser picks the
       * largest size that fits within BOTH the wrapper width and wrapper height.
       * This ensures two-floor SVGs shrink to fit the card rather than clipping.
       */
      .axo-svg {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        overflow: visible;
      }

      .no-floor {
        padding: 32px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 0.9rem;
      }
    `}constructor(){super(),this._config=null,this._hass=null,this._activeFloor=0,this._activeHeatmapMode=null,this._activeLayout=null,this._pressRoom=null,this._pressTimer=null,this._pressStartX=0,this._pressStartY=0}connectedCallback(){super.connectedCallback(),this._gridRO=new ResizeObserver(()=>this._sizeGridCanvas())}disconnectedCallback(){this._gridRO?.disconnect(),this._gridROTarget=null,super.disconnectedCallback()}updated(){const t=this.shadowRoot?.querySelector(".grid-wrapper");t&&t!==this._gridROTarget&&(this._gridRO?.disconnect(),this._gridRO?.observe(t),this._gridROTarget=t),this._sizeGridCanvas()}_floorBounds(t){const e=t?.rooms||[];if(!e.length)return{minCol:0,minRow:0,usedCols:t?.cols||1,usedRows:t?.rows||1};const o=Math.min(...e.map(t=>t.col)),i=Math.min(...e.map(t=>t.row)),r=Math.max(...e.map(t=>t.col+t.width)),s=Math.max(...e.map(t=>t.row+t.height));return{minCol:o,minRow:i,usedCols:r-o,usedRows:s-i}}_sizeGridCanvas(){const t=this.shadowRoot?.querySelector(".grid-wrapper"),e=this.shadowRoot?.querySelector(".grid-canvas");if(!t||!e)return;const o=t.clientWidth;o&&(e.style.width=o+"px",this._applyCanvasHeight(t,e),requestAnimationFrame(()=>this._applyCanvasHeight(t,e)))}_applyCanvasHeight(t,e){const o=e.offsetHeight;if(!o||o<=80)return;const i=38*Math.PI/180,r=Math.cos(i),s=Math.round(o*r);t.style.height=s+32+"px";const n=Math.round(o*(1-r)/2);e.style.marginTop=-n+"px";const a=e.getBoundingClientRect().top,l=t.getBoundingClientRect().top,c=Math.round(a-l-10);if(Math.abs(c)>2){const t=parseInt(e.style.marginTop)||0;e.style.marginTop=t-c+"px"}const d=parseInt(e.style.marginTop)||0;t.style.perspectiveOrigin=`50% ${10+d+Math.round(o/2)}px`}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=t,this._activeFloor=0}set hass(t){this._hass=t}static getConfigElement(){return document.createElement("house-card-editor")}static getStubConfig(){return{title:"My House",floors:[{id:"ground",name:"Ground Floor",cols:8,rows:6,rooms:[]}]}}_getEntityState(t){return t&&this._hass&&this._hass.states[t]||null}_isLightOn(t){return"on"===this._getEntityState(t)?.state}_isOccupied(t){return"on"===this._getEntityState(t)?.state}_getTemperature(t){const e=this._getEntityState(t);if(!e)return null;const o=parseFloat(e.state);if(isNaN(o))return null;const i=e.attributes?.unit_of_measurement||"°C";return`${o.toFixed(1)}${i}`}_getHumidity(t){const e=this._getEntityState(t);if(!e)return null;const o=parseFloat(e.state);return isNaN(o)?null:`${Math.round(o)}%`}_getHeatingInfo(t){const e=this._getEntityState(t);if(!e)return null;const o=e.attributes||{},i=parseFloat(o.current_temperature),r=parseFloat(o.temperature);if(isNaN(i)&&isNaN(r))return null;const s=o.unit_of_measurement||"°C",n=o.hvac_action,a=n?"heating"===n:!isNaN(i)&&!isNaN(r)&&i<r-.5;return{current:isNaN(i)?null:i,setpoint:isNaN(r)?null:r,unit:s,calling:a}}_getDetections(t){return t?.length?t.map(t=>{const e=ht[t.type]||{icon:"mdi:eye",color:"#94a3b8"},o="on"===this._getEntityState(t.entity)?.state;return{type:t.type,icon:e.icon,color:e.color,active:o}}):[]}_getLightColor(t){const e=this._getEntityState(t);if(!e||"on"!==e.state)return null;const o=e.attributes?.rgb_color;return Array.isArray(o)&&3===o.length?`${o[0]},${o[1]},${o[2]}`:"255,210,150"}_handleRoomTap(t){this._hass&&t.entities?.light&&this._hass.callService("light","toggle",{entity_id:t.entities.light})}_handleRoomLongPress(t){const e=t.entities?.light||t.entities?.climate||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity;e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRoomPointerDown(t,e){void 0!==t.button&&0!==t.button||(t.preventDefault(),t.stopPropagation(),this._pressRoom=e,this._pressStartX=t.clientX,this._pressStartY=t.clientY,this._pressTimer=setTimeout(()=>{this._pressTimer=null,this._pressRoom=null,this._handleRoomLongPress(e)},500))}_onRoomPointerUp(t){if(!this._pressRoom)return;const e=this._pressRoom,o=Math.abs(t.clientX-this._pressStartX),i=Math.abs(t.clientY-this._pressStartY);clearTimeout(this._pressTimer),this._pressTimer=null,this._pressRoom=null,o<10&&i<10&&this._handleRoomTap(e)}_onRoomPointerCancel(){clearTimeout(this._pressTimer),this._pressTimer=null,this._pressRoom=null}_getHeatmapMode(){return this._activeHeatmapMode??this._config?.heatmap_mode??"off"}_cycleHeatmapMode(){const t=["off","temperature","humidity","combined"],e=this._getHeatmapMode();this._activeHeatmapMode=t[(t.indexOf(e)+1)%t.length]}_getActiveLayout(){return this._activeLayout??this._config.display?.layout??"flat"}_cycleLayout(){this._activeLayout="flat"===this._getActiveLayout()?"axonometric":"flat"}_renderLayoutToggle(){const t="axonometric"===this._getActiveLayout();return B`
      <button class="heatmap-toggle"
              @click=${this._cycleLayout}
              title="${t?"Switch to flat plan view":"Switch to dollhouse view"}">
        <ha-icon icon="${t?"mdi:floor-plan":"mdi:cube-outline"}"
                 style="color:${t?"#a78bfa":"rgba(135,135,148,0.55)"};--mdc-icon-size:20px;">
        </ha-icon>
      </button>
    `}_renderHeatmapToggle(){const t=this._getHeatmapMode(),e={off:{icon:"mdi:thermometer-off",color:"rgba(135,135,148,0.55)",label:"Thermal overlay: off"},temperature:{icon:"mdi:thermometer",color:"#ff8c42",label:"Thermal overlay: temperature"},humidity:{icon:"mdi:water-percent",color:"#55b2ff",label:"Thermal overlay: humidity"},combined:{icon:"mdi:blur",color:"#c084fc",label:"Thermal overlay: combined"}},{icon:o,color:i,label:r}=e[t]||e.off;return B`
      <button class="heatmap-toggle" @click=${this._cycleHeatmapMode} title="${r}">
        <ha-icon icon="${o}" style="color:${i};--mdc-icon-size:20px;"></ha-icon>
      </button>
    `}_tempColour(t,[e,o]){const i=[{f:0,c:[44,95,163]},{f:.3,c:[29,158,117]},{f:.5,c:[245,196,62]},{f:.7,c:[232,138,48]},{f:1,c:[208,72,72]}],r=Math.max(0,Math.min(1,(t-e)/(o-e)));for(let t=0;t<i.length-1;t++)if(r<=i[t+1].f){const e=(r-i[t].f)/(i[t+1].f-i[t].f),o=i[t].c.map((o,r)=>Math.round(o+(i[t+1].c[r]-o)*e));return`rgb(${o[0]},${o[1]},${o[2]})`}return`rgb(${i.at(-1).c.join(",")})`}_hashCode(t){let e=0;for(const o of t)e=(e<<5)-e+o.charCodeAt(0)|0;return e}_mulberry32(t){return()=>{let e=t=t+1831565813|0;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}_humidityDroplets(t,e){if(null==t._hum||t._hum<e)return"";const o=this._mulberry32(this._hashCode(t.id||"")),i=Math.max(0,(t._hum-35)/65),r=Math.round(i*t.width*t.height*1.5),s=[];for(let e=0;e<r;e++){const e=100*(t.col+o()*t.width),i=100*(t.row+o()*t.height),r=1.4+2.6*o(),n=(.35+.35*o()).toFixed(2);s.push(q`<circle cx=${e} cy=${i} r=${r} fill="rgba(140,210,255,${n})"/>`)}return s}_renderThermalLayer(t,e=0,o=0,i=null,r=null){const s=this._getHeatmapMode();if("off"===s)return"";const n="temperature"===s||"combined"===s,a="humidity"===s||"combined"===s,l=t.temperature_range||this._config.temperature_range||[16,26],c=this._config.humidity_floor??50,d=i??t.cols,h=r??t.rows,p=(t.rooms||[]).filter(t=>!1!==t.heatmap).map(t=>{const i=parseFloat(this._getEntityState(t.entities?.temperature)?.state),r=parseFloat(this._getEntityState(t.entities?.humidity)?.state);return{...t,col:t.col-e,row:t.row-o,_temp:isNaN(i)?null:i,_hum:isNaN(r)?null:r}});return q`
      <svg class="thermal-svg"
           viewBox="0 0 ${100*d} ${100*h}"
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">

        ${n?q`
          <g style="filter: blur(50px);">
            ${p.map(t=>q`
              <rect
                x=${100*t.col} y=${100*t.row}
                width=${100*t.width} height=${100*t.height}
                fill=${null!=t._temp?this._tempColour(t._temp,l):"rgba(80,80,90,0.35)"}
              />`)}
          </g>`:""}

        ${a?q`
          <g>
            ${p.map(t=>this._humidityDroplets(t,c))}
          </g>`:""}
      </svg>`}_renderHeatmapLegend(t){const e=this._getHeatmapMode();if("off"===e)return"";const o="temperature"===e||"combined"===e,i="humidity"===e||"combined"===e,r=t?.temperature_range||this._config.temperature_range||[16,26];return B`
      <div class="heatmap-legend">
        ${o?B`
          <div class="heatmap-legend-temp">
            <span class="heatmap-legend-label">${r[0]}°</span>
            <div class="heatmap-gradient-bar"></div>
            <span class="heatmap-legend-label">${r[1]}°</span>
          </div>`:""}
        ${i?B`
          <div class="heatmap-legend-hum">
            <ha-icon icon="mdi:water-percent" style="color:#55b2ff;--mdc-icon-size:12px;"></ha-icon>
            <span>Humidity</span>
          </div>`:""}
      </div>
    `}_projectionOpts(){const t=this._config.display||{};return{tilt:t.tilt??.55,shear:t.shear??.15}}_renderAxonometric(t){if(!t||0===t.length)return B`<div class="no-floor">No floors configured.</div>`;const e=[...t].sort((t,e)=>(t.level??0)-(e.level??0)),o=this._projectionOpts(),i=this._config.display||{},r=i.wall_height??25,s=i.floor_gap??250,n=e.map((t,e)=>({floor:t,z:(t.level??e)*(r+s)})),a=[];n.forEach(({floor:t,z:e})=>{const i=100*t.cols,s=100*t.rows;[[0,0],[i,0],[i,s],[0,s]].forEach(([t,i])=>{a.push(bt(t,i,e,o)),a.push(bt(t,i,e-r,o))})});const l=Math.min(...a.map(t=>t.sx))-50,c=Math.min(...a.map(t=>t.sy))-50-20,d=Math.max(...a.map(t=>t.sx))+50,h=Math.max(...a.map(t=>t.sy))+50,p=d-l,m=h-c;return B`
      <div class="axo-wrapper">
        <svg class="axo-svg"
             viewBox="${l.toFixed(1)} ${c.toFixed(1)} ${p.toFixed(1)} ${m.toFixed(1)}"
             preserveAspectRatio="xMidYMid meet"
             style="aspect-ratio:${(p/m).toFixed(4)};">
          ${n.map(({floor:t,z:e},i)=>q`
            ${this._renderFloorAxo(t,e,o,r)}
          `)}
          ${n.slice(0,-1).map(({floor:t,z:e},i)=>this._renderGapLabel(t,e,n[i+1].z,r,o))}
        </svg>
      </div>
    `}_renderGapLabel(t,e,o,i,r){const s=o-e-i;if(s<40)return"";const n=bt(.72*(100*t.cols),.18*(100*t.rows),e+i+.5*s,r);return q`
      <text x="${n.sx.toFixed(2)}" y="${n.sy.toFixed(2)}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="var(--primary-font-family, sans-serif)"
            font-size="8" letter-spacing="2"
            fill="rgba(255,255,255,0.22)">── BETWEEN FLOORS ──</text>
    `}_renderFloorAxo(t,e,o,i){if(!t.cols||!t.rows)return q``;const r=100*t.cols,s=100*t.rows,n=[bt(0,0,e,o),bt(r,0,e,o),bt(r,s,e,o),bt(0,s,e,o)].map(t=>`${t.sx.toFixed(2)},${t.sy.toFixed(2)}`).join(" "),a=bt(r/2,0,e+14,o),l=[...t.rooms||[]].sort((t,e)=>100*t.row+t.col-(100*e.row+e.col));return q`
      <g class="floor-axo">
        <polygon points="${n}"
                 fill="rgba(10,11,20,0.92)"
                 stroke="rgba(255,255,255,0.10)"
                 stroke-width="1"/>
        ${l.map(t=>this._renderRoomAxo(t,e,o,i))}
        <text x="${a.sx.toFixed(2)}" y="${(a.sy-4).toFixed(2)}"
              text-anchor="middle" dominant-baseline="auto"
              font-family="var(--primary-font-family, sans-serif)"
              font-size="10" font-weight="700" letter-spacing="2"
              fill="rgba(255,255,255,0.38)">
          ${(t.name||"Floor").toUpperCase()}
        </text>
      </g>
    `}_renderRoomAxo(t,e,o,i){const r=function(t,e,o){const i=100*t.col,r=100*t.row,s=i+100*t.width,n=r+100*t.height;return[bt(i,r,e,o),bt(s,r,e,o),bt(s,n,e,o),bt(i,n,e,o)]}(t,e,o),[s,n,a,l]=r,c={sx:s.sx,sy:s.sy+i},d={sx:n.sx,sy:n.sy+i},h={sx:a.sx,sy:a.sy+i},p={sx:l.sx,sy:l.sy+i},m=t=>t.map(t=>`${t.sx.toFixed(2)},${t.sy.toFixed(2)}`).join(" ");t.color;const g=t.entities?.light?this._getLightColor(t.entities.light):null,u=!!t.entities?.occupancy&&this._isOccupied(t.entities.occupancy),f=t.entities?.temperature?this._getTemperature(t.entities.temperature):null,b=t.entities?.humidity?this._getHumidity(t.entities.humidity):null,v=t.entities?.climate?this._getHeatingInfo(t.entities.climate):null,_=this._getDetections(t.entities?.detections),y=bt(100*(t.col+t.width/2),100*(t.row+t.height/2),e,o),x=100*t.width,$=Math.max(10,Math.min(18,x/12)),w=Math.max(8,Math.min(12,x/18)),k=!!(f||b||v||_.length);y.sy;const A=g?`rgba(${g},0.38)`:"rgba(28,32,52,0.88)",C=g?`rgba(${g},0.70)`:"rgba(255,255,255,0.10)",F=g?`rgba(${g},0.18)`:"rgba(12,15,28,0.90)",R=g?`rgba(${g},0.12)`:"rgba(12,15,28,0.85)",S=g?`rgba(${g},0.08)`:"rgba(8,10,20,0.80)",E=g?`rgba(${g},0.06)`:"rgba(8,10,20,0.75)",M=.42*x,T=100*t.height*.42*(o.tilt??.55),N=.7*w,H=Math.min(.85*x,6.5*$),z=(f||b?1:0)+(v?1:0)+(_.length?1:0),O=k?$+z*(1.3*w)+2*N+2:$+2*N,P=y.sx-H/2,U=y.sy-O/2,L=k?U+N+.5*$:U+O/2,D=L+.6*$+.65*w+2,I=!!(t.entities?.light||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity||t.entities?.climate||t.entities?.detections?.length);return q`
      <g class="room-axo"
         pointer-events="all"
         style="${I?"cursor:pointer":""}"
         @click=${I?()=>this._handleRoomTap(t):null}>

        <!-- Back wall -->
        <polygon points="${m([s,n,d,c])}"
                 fill="${S}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

        <!-- Left wall -->
        <polygon points="${m([l,s,c,p])}"
                 fill="${E}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

        <!-- Floor face -->
        <polygon points="${m(r)}"
                 fill="${A}" stroke="${C}" stroke-width="0.8"/>

        <!-- Light glow — double ring matching flat card style -->
        ${g?q`
          <ellipse cx="${y.sx.toFixed(2)}" cy="${y.sy.toFixed(2)}"
                   rx="${(1.6*M).toFixed(2)}" ry="${(1.6*T).toFixed(2)}"
                   fill="rgba(${g},0.14)"
                   style="filter:blur(22px);"
                   pointer-events="none"/>
          <ellipse cx="${y.sx.toFixed(2)}" cy="${y.sy.toFixed(2)}"
                   rx="${M.toFixed(2)}" ry="${T.toFixed(2)}"
                   fill="rgba(${g},0.32)"
                   style="filter:blur(10px);"
                   pointer-events="none"/>`:""}

        <!-- Heat glow — warm amber floor bloom when actively calling for heat -->
        ${v?.calling?q`
          <ellipse cx="${y.sx.toFixed(2)}" cy="${y.sy.toFixed(2)}"
                   rx="${(1.4*M).toFixed(2)}" ry="${(1.4*T).toFixed(2)}"
                   fill="rgba(255,100,20,0.12)"
                   style="filter:blur(28px);"
                   pointer-events="none"/>
          <ellipse cx="${y.sx.toFixed(2)}" cy="${y.sy.toFixed(2)}"
                   rx="${(.7*M).toFixed(2)}" ry="${(.7*T).toFixed(2)}"
                   fill="rgba(255,120,30,0.20)"
                   style="filter:blur(12px);"
                   pointer-events="none"/>`:""}

        <!-- Front wall -->
        <polygon points="${m([l,a,h,p])}"
                 fill="${F}" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>

        <!-- Right wall -->
        <polygon points="${m([n,a,h,d])}"
                 fill="${R}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

        <!-- Recessed info card — shadow offset, then card, then top-edge highlight -->
        <rect x="${(P+1).toFixed(2)}" y="${(U+1).toFixed(2)}"
              width="${H.toFixed(2)}" height="${O.toFixed(2)}" rx="3"
              fill="rgba(0,0,0,0.45)" pointer-events="none"/>
        <rect x="${P.toFixed(2)}" y="${U.toFixed(2)}"
              width="${H.toFixed(2)}" height="${O.toFixed(2)}" rx="3"
              fill="rgba(0,0,0,0.38)" stroke="rgba(255,255,255,0.10)" stroke-width="0.6"
              pointer-events="none"/>
        <line x1="${(P+2).toFixed(2)}" y1="${(U+.5).toFixed(2)}"
              x2="${(P+H-2).toFixed(2)}" y2="${(U+.5).toFixed(2)}"
              stroke="rgba(255,255,255,0.22)" stroke-width="0.6" pointer-events="none"/>

        <!-- Occupancy person icon -->
        ${u?q`
          <g pointer-events="none"
             transform="translate(${(P+H-1.2*w).toFixed(2)},${(U+.4*N).toFixed(2)}) scale(${(.9*w/24).toFixed(4)})">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                  fill="rgba(76,223,128,0.90)"/>
          </g>`:""}

        <!-- Room name -->
        <text x="${y.sx.toFixed(2)}" y="${L.toFixed(2)}"
              text-anchor="middle" dominant-baseline="middle"
              font-family="var(--primary-font-family, sans-serif)"
              font-size="${$.toFixed(1)}" font-weight="600"
              fill="rgba(255,255,255,${g?"0.95":"0.82"})"
              pointer-events="none">
          ${t.name||""}
        </text>

        ${k?(()=>{const t=[f,b].filter(Boolean).join(" · "),e=v?(null!==v.current?`${v.current.toFixed(1)}${v.unit}`:"—")+(null!==v.setpoint?`→${v.setpoint.toFixed(1)}${v.unit}`:""):null,o=[t||null,e].filter(Boolean),i=1.3*w,r=o.length+(_.length?1:0),s=r>1?D-i*(r-1)/2:D,n=Math.max(2.5,.38*w),a=2.8*n,l=_.length*a-.2*a,c=s+o.length*i,d=y.sx-l/2+n;return q`
              ${o.map((t,o)=>q`
                <text x="${y.sx.toFixed(2)}" y="${(s+o*i).toFixed(2)}"
                      text-anchor="middle" dominant-baseline="middle"
                      font-family="var(--primary-font-family, sans-serif)"
                      font-size="${w.toFixed(1)}"
                      fill="${t===e&&v?.calling?"rgba(255,140,66,0.90)":"rgba(255,255,255,0.55)"}"
                      pointer-events="none">
                  ${t}
                </text>`)}
              ${_.map((t,e)=>q`
                <circle cx="${(d+e*a).toFixed(2)}" cy="${c.toFixed(2)}"
                        r="${n.toFixed(2)}"
                        fill="${t.active?t.color:"rgba(255,255,255,0.15)"}"
                        pointer-events="none"/>`)}`})():""}
      </g>
    `}_getSunStyle(){const t=this._hass?.states?.["sun.sun"],e=t?.attributes?.elevation??null;if(null===e)return"";if(e>=15)return"";if(e>=-6){return`box-shadow:inset 0 0 140px rgba(255,120,30,${(.28*(1-(e+6)/21)).toFixed(3)});`}if(e>=-18){const t=(e+18)/12;return`box-shadow:inset 0 0 140px rgba(255,100,20,${(.1*t).toFixed(3)}),inset 0 0 100px rgba(20,40,120,${(.18*(1-t)).toFixed(3)});`}return"box-shadow:inset 0 0 100px rgba(20,40,120,0.18);"}_renderFloor(t){if(!t||!t.cols||!t.rows)return B`<div class="no-floor">Floor not configured</div>`;const e=this._getHeatmapMode(),o=t.rooms||[],i=this._getSunStyle(),{minCol:r,minRow:s,usedCols:n,usedRows:a}=this._floorBounds(t),l=100/n,c=100/a;return B`
      <div class="grid-wrapper">
        <div class="grid-canvas"
             style="aspect-ratio:${n}/${a};${i}"
             data-heatmap="${e}">
          ${this._renderThermalLayer(t,r,s,n,a)}
          ${o.map(t=>this._renderRoom(t,l,c,r,s))}
        </div>
      </div>
    `}_renderRoom(t,e,o,i=0,r=0){const s=!!t.entities?.light&&this._isLightOn(t.entities.light),n=!!t.entities?.occupancy&&this._isOccupied(t.entities.occupancy),a=t.entities?.temperature?this._getTemperature(t.entities.temperature):null,l=t.entities?.humidity?this._getHumidity(t.entities.humidity):null,c=t.entities?.light?this._getLightColor(t.entities.light):null,d=t.entities?.climate?this._getHeatingInfo(t.entities.climate):null,h=this._getDetections(t.entities?.detections),p=.6,m=`${(t.col-i)*e+p}%`,g=`${(t.row-r)*o+p}%`,u=t.width*e-1.2+"%",f=t.height*o-1.2+"%",b=["room-face",s?"light-on":"",!!(t.entities?.light||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity||t.entities?.climate||t.entities?.detections?.length)?"interactive":""].filter(Boolean).join(" "),v=t.color,_=c?`box-shadow:0 0 20px 8px rgba(${c},0.40),0 0 52px 22px rgba(${c},0.16);`:"box-shadow:none;",y=c?`background:linear-gradient(to bottom,rgba(${c},0.28),rgba(${c},0.10)),linear-gradient(to bottom,rgba(20,23,40,0.82),rgba(8,10,22,0.96));`:`background:linear-gradient(to bottom,${v}1c 0%,${v}06 100%),linear-gradient(to bottom,rgba(20,23,40,0.90),rgba(8,10,22,0.97));`,x=c?`background:linear-gradient(to right,rgba(${c},0.10),rgba(${c},0.24)),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`:`background:linear-gradient(to right,${v}15 0%,${v}05 100%),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`,$=s?"#ffd700":"rgba(135,135,148,0.55)",w=n?"#4cdf80":"rgba(135,135,148,0.45)",k=dt[t.room_type];return B`
      <div class="room-3d" style="left:${m};top:${g};width:${u};height:${f};">

        <div
          class="${b}"
          style="background-color:${v}0f;${_}"
          @pointerdown=${e=>this._onRoomPointerDown(e,t)}
          @pointerup=${t=>this._onRoomPointerUp(t)}
          @pointercancel=${()=>this._onRoomPointerCancel()}
          @pointerleave=${()=>this._onRoomPointerCancel()}
        >
          ${k?B`
            <ha-icon icon="${k}" class="room-type-icon"></ha-icon>`:""}

          ${t.entities?.occupancy?B`
            <ha-icon icon="mdi:account"
              class="occupancy-watermark ${n?"occupied":""}"></ha-icon>`:""}

          <div class="room-info-card">
            <div class="info-header">
              <ha-icon icon="mdi:lightbulb"
                style="color:${$};--mdc-icon-size:18px;flex-shrink:0;"></ha-icon>
              <span class="info-room-name">${t.name}</span>
            </div>

            ${a?B`
              <div class="info-row">
                <ha-icon icon="mdi:thermometer"
                  style="color:${"rgba(255,168,75,0.92)"};flex-shrink:0;"></ha-icon>
                <span>${a}</span>
              </div>`:""}

            ${l?B`
              <div class="info-row">
                <ha-icon icon="mdi:water-percent"
                  style="color:${"rgba(85,178,255,0.92)"};flex-shrink:0;"></ha-icon>
                <span>${l}</span>
              </div>`:""}

            ${d?B`
              <div class="info-row">
                <ha-icon icon="mdi:fire"
                  class="${d.calling?"heat-calling":""}"
                  style="color:${d.calling?"#ff8c42":"rgba(135,135,148,0.55)"};flex-shrink:0;"></ha-icon>
                <span>${null!==d.current?`${d.current.toFixed(1)}${d.unit}`:"—"}
                  ${null!==d.setpoint?`/ ${d.setpoint.toFixed(1)}${d.unit}`:""}</span>
              </div>`:""}

            ${t.entities?.occupancy?B`
              <div class="info-row">
                <ha-icon icon="mdi:account"
                  style="color:${w};flex-shrink:0;"></ha-icon>
              </div>`:""}

            ${h.length?B`
              <div class="detection-row">
                ${h.map(t=>B`
                  <div class="detection-icon-wrap ${t.active?"active":""}">
                    <ha-icon icon="${t.icon}"
                      style="color:${t.active?t.color:"rgba(135,135,148,0.35)"};
                             --mdc-icon-size:clamp(14px, 1.2vw, 22px);"></ha-icon>
                  </div>`)}
              </div>`:""}
          </div>
        </div>

        <div class="room-wall-front" style="${y}"></div>
        <div class="room-wall-left"  style="${x}"></div>

      </div>
    `}_renderLegend(){const t=(t,e)=>B`<ha-icon icon="${t}" style="color:${e};--mdc-icon-size:14px;"></ha-icon>`;return B`
      <div class="legend">
        <div class="legend-item">${t("mdi:lightbulb","#ffd700")}<span>Light On</span></div>
        <div class="legend-item">${t("mdi:lightbulb","rgba(135,135,148,0.55)")}<span>Light Off</span></div>
        <div class="legend-item">${t("mdi:account","#4cdf80")}<span>Occupied</span></div>
        <div class="legend-item">${t("mdi:account","rgba(135,135,148,0.45)")}<span>Unoccupied</span></div>
      </div>
    `}render(){if(!this._config)return B``;const t=this._getActiveLayout(),e=this._config.floors||[],o=e[this._activeFloor],i=e.length>1&&"axonometric"!==t;return B`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title||""}</span>
          ${this._renderLayoutToggle()}
          ${this._renderHeatmapToggle()}
        </div>

        ${i?B`
          <div class="floor-tabs">
            ${e.map((t,e)=>B`
              <button
                class="floor-tab ${e===this._activeFloor?"active":""}"
                @click=${()=>{this._activeFloor=e}}
              >${t.name||`Floor ${e+1}`}</button>
            `)}
          </div>`:""}

        ${0===e.length?B`<div class="no-floor">No floors configured. Click the edit button to get started.</div>`:"axonometric"===t?this._renderAxonometric(e):B`
              ${this._renderFloor(o)}
              ${this._renderHeatmapLegend(o)}
              ${this._renderLegend()}
            `}
      </ha-card>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"house-card",name:"House Card",description:"Visual floorplan card with grid-based room layout and entity state display.",preview:!1});
