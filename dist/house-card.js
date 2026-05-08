/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const o=this.t;if(e&&void 0===t){const e=void 0!==o&&1===o.length;e&&(t=i.get(o)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(o,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new r(i,t,o)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,m=globalThis,g=m.trustedTypes,u=g?g.emptyScript:"",f=m.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},v=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const s=i?.call(this);r?.call(this,e),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const o=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((o,i)=>{if(e)o.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,o.appendChild(i)}})(o,this.constructor.elementStyles),o}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(void 0!==i&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:b).toAttribute(e,o.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=o.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const s=r.fromAttribute(e,t.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(t,e,o,i=!1,r){if(void 0!==t){const s=this.constructor;if(!1===i&&(r=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??v)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:r},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==r||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,o,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[_("elementProperties")]=new Map,$[_("finalized")]=new Map,f?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,w=t=>t,A=x.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+C,R=`<${E}>`,M=document,F=()=>M.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,z=/>/g,O=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,I=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),B=I(1),q=I(2),G=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,X=M.createTreeWalker(M,129);function Y(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const K=(t,e)=>{const o=t.length-1,i=[];let r,s=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<o;e++){const o=t[e];let a,l,d=-1,c=0;for(;c<o.length&&(n.lastIndex=c,l=n.exec(o),null!==l);)c=n.lastIndex,n===H?"!--"===l[1]?n=N:void 0!==l[1]?n=z:void 0!==l[2]?(j.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=O):void 0!==l[3]&&(n=O):n===O?">"===l[0]?(n=r??H,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?O:'"'===l[3]?L:D):n===L||n===D?n=O:n===N||n===z?n=H:(n=O,r=void 0);const h=n===O&&t[e+1].startsWith("/>")?" ":"";s+=n===H?o+R:d>=0?(i.push(a),o.slice(0,d)+S+o.slice(d)+C+h):o+C+(-2===d?e:h)}return[Y(t,s+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let r=0,s=0;const n=t.length-1,a=this.parts,[l,d]=K(t,e);if(this.el=J.createElement(l,o),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=X.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=d[s++],o=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:o,ctor:"."===n[1]?ot:"?"===n[1]?it:"@"===n[1]?rt:et}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],F()),X.nextNode(),a.push({type:2,index:++r});i.append(t[e],F())}}}else if(8===i.nodeType)if(i.data===E)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const o=M.createElement("template");return o.innerHTML=t,o}}function Z(t,e,o=t,i){if(e===G)return e;let r=void 0!==i?o._$Co?.[i]:o._$Cl;const s=P(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(t),r._$AT(t,o,i)),void 0!==i?(o._$Co??=[])[i]=r:o._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);X.currentNode=i;let r=X.nextNode(),s=0,n=0,a=o[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=o[++n]}s!==a?.index&&(r=X.nextNode(),s++)}return X.currentNode=M,i}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),P(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=J.createElement(Y(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new J(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const r of t)i===e.length?e.push(o=new tt(this.O(F()),this.O(F()),this,this.options)):o=e[i],o._$AI(r),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(t,e=this,o,i){const r=this.strings;let s=!1;if(void 0===r)t=Z(this,t,e,0),s=!P(t)||t!==this._$AH&&t!==G,s&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Z(this,i[o+n],e,n),a===G&&(a=this._$AH[n]),s||=!P(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}s&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class rt extends et{constructor(t,e,o,i,r){super(t,e,o,i,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??V)===G)return;const o=this._$AH,i=t===V&&o!==V||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==V&&(o===V||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(J,tt),(x.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const i=o?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=o?.renderBefore??null;i._$litPart$=r=new tt(e.insertBefore(F(),t),t,void 0,o??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const dt=at.litElementPolyfillSupport;dt?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ct={bedroom:"mdi:bed",master_bedroom:"mdi:bed-king",bathroom:"mdi:shower",toilet:"mdi:toilet",kitchen:"mdi:silverware-fork-knife",lounge:"mdi:sofa",living_room:"mdi:sofa",dining:"mdi:food-fork-drink",office:"mdi:desk",study:"mdi:bookshelf",hall:"mdi:door-open",entrance:"mdi:door",landing:"mdi:stairs",garage:"mdi:garage",garden:"mdi:flower",utility:"mdi:washing-machine",conservatory:"mdi:greenhouse",playroom:"mdi:toy-brick",gym:"mdi:dumbbell"},ht={bedroom:"Bedroom",master_bedroom:"Master Bedroom",bathroom:"Bathroom",toilet:"Toilet / WC",kitchen:"Kitchen",lounge:"Lounge",living_room:"Living Room",dining:"Dining Room",office:"Office",study:"Study",hall:"Hall",entrance:"Entrance",landing:"Landing",garage:"Garage",garden:"Garden",utility:"Utility Room",conservatory:"Conservatory",playroom:"Playroom",gym:"Gym"},pt="floors",mt="grid",gt="room",ut=["#4a90d9","#7b68ee","#50c878","#ff8c42","#e84393","#20b2aa","#ffd700","#cd853f"];customElements.define("house-card-editor",class extends lt{static get properties(){return{hass:{type:Object},_config:{type:Object},_editorState:{type:String},_activeFloorIdx:{type:Number},_activeRoomId:{type:String},_dragStart:{type:Object},_dragCurrent:{type:Object},_isDragging:{type:Boolean}}}static get styles(){return s`
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

      .hint {
        font-size: 0.78rem;
        color: var(--secondary-text-color);
        font-style: italic;
        margin-top: 4px;
      }
    `}constructor(){super(),this._editorState=pt,this._activeFloorIdx=0,this._activeRoomId=null,this._dragStart=null,this._dragCurrent=null,this._isDragging=!1,this._pendingRoom=null,this._pendingName="",this._newFloorName="",this._newFloorCols=8,this._newFloorRows=6}setConfig(t){this._config={...t}}async firstUpdated(){if(!customElements.get("ha-entity-picker")){const t=await window.loadCardHelpers(),e=await t.createCardElement({type:"entities",entities:[]});await e.constructor.getConfigElement()}this.requestUpdate()}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)}_addFloor(){const t=this._newFloorName.trim()||`Floor ${(this._config.floors?.length||0)+1}`,e=Math.max(4,Math.min(16,parseInt(this._newFloorCols)||8)),o=Math.max(3,Math.min(12,parseInt(this._newFloorRows)||6)),i=`floor_${Date.now()}`;this._config={...this._config,floors:[...this._config.floors||[],{id:i,name:t,cols:e,rows:o,rooms:[]}]},this._newFloorName="",this._newFloorCols=8,this._newFloorRows=6,this._fireConfigChanged(),this.requestUpdate()}_deleteFloor(t){const e=[...this._config.floors||[]];e.splice(t,1),this._config={...this._config,floors:e},this._fireConfigChanged(),this.requestUpdate()}_editFloor(t){this._activeFloorIdx=t,this._editorState=mt,this._pendingRoom=null,this.requestUpdate()}_getActiveFloor(){return this._config.floors?.[this._activeFloorIdx]||null}_getCellFromEvent(t,e,o){const i=e.getBoundingClientRect(),r=(t.clientX-i.left)/i.width,s=(t.clientY-i.top)/i.height,n=Math.floor(r*o.cols),a=Math.floor(s*o.rows);return{col:Math.max(0,Math.min(o.cols-1,n)),row:Math.max(0,Math.min(o.rows-1,a))}}_onGridMouseDown(t){if(0!==t.button)return;const e=this._getActiveFloor();if(!e)return;const o=this.shadowRoot.querySelector(".grid-painter"),i=this._getCellFromEvent(t,o,e);this._dragStart=i,this._dragCurrent=i,this._isDragging=!0,t.preventDefault()}_onGridMouseMove(t){if(!this._isDragging)return;const e=this._getActiveFloor();if(!e)return;const o=this.shadowRoot.querySelector(".grid-painter"),i=this._getCellFromEvent(t,o,e);this._dragCurrent=i,this.requestUpdate()}_onGridMouseUp(t){if(!this._isDragging)return;this._isDragging=!1;const e=this._dragStart,o=this._dragCurrent,i=Math.min(e.col,o.col),r=Math.min(e.row,o.row),s=Math.abs(o.col-e.col)+1,n=Math.abs(o.row-e.row)+1,a=(this._getActiveFloor().rooms||[]).some(t=>i<t.col+t.width&&i+s>t.col&&r<t.row+t.height&&r+n>t.row);if(a)return this._dragStart=null,this._dragCurrent=null,void this.requestUpdate();this._pendingRoom={col:i,row:r,width:s,height:n},this._pendingName="",this._dragStart=null,this._dragCurrent=null,this.requestUpdate()}_confirmRoom(){const t=this._pendingName.trim();if(!t||!this._pendingRoom)return;const e=this._getActiveFloor(),o=(e.rooms?.length||0)%ut.length,i={id:`room_${Date.now()}`,name:t,color:ut[o],...this._pendingRoom,entities:{}},r=[...this._config.floors||[]];r[this._activeFloorIdx]={...e,rooms:[...e.rooms||[],i]},this._config={...this._config,floors:r},this._pendingRoom=null,this._pendingName="",this._fireConfigChanged(),this.requestUpdate()}_cancelRoom(){this._pendingRoom=null,this._pendingName="",this.requestUpdate()}_deleteRoom(t){const e=this._getActiveFloor(),o=[...this._config.floors||[]];o[this._activeFloorIdx]={...e,rooms:(e.rooms||[]).filter(e=>e.id!==t)},this._config={...this._config,floors:o},this._fireConfigChanged(),this.requestUpdate()}_editRoom(t){this._activeRoomId=t,this._editorState=gt,this.requestUpdate()}_getActiveRoom(){const t=this._getActiveFloor();return(t?.rooms||[]).find(t=>t.id===this._activeRoomId)||null}_updateRoomEntity(t,e,o){const i=this._getActiveFloor(),r=[...this._config.floors||[]];r[this._activeFloorIdx]={...i,rooms:(i.rooms||[]).map(i=>i.id!==t?i:{...i,entities:{...i.entities,[e]:o}})},this._config={...this._config,floors:r},this._fireConfigChanged(),this.requestUpdate()}_updateRoomType(t,e){const o=this._getActiveFloor(),i=[...this._config.floors||[]];i[this._activeFloorIdx]={...o,rooms:(o.rooms||[]).map(o=>o.id===t?{...o,room_type:e||void 0}:o)},this._config={...this._config,floors:i},this._fireConfigChanged(),this.requestUpdate()}_updateRoomName(t,e){const o=this._getActiveFloor(),i=[...this._config.floors||[]];i[this._activeFloorIdx]={...o,rooms:(o.rooms||[]).map(o=>o.id===t?{...o,name:e}:o)},this._config={...this._config,floors:i},this._fireConfigChanged(),this.requestUpdate()}_getPreviewRect(){if(!this._dragStart||!this._dragCurrent)return null;const t=this._dragStart,e=this._dragCurrent;return{col:Math.min(t.col,e.col),row:Math.min(t.row,e.row),width:Math.abs(e.col-t.col)+1,height:Math.abs(e.row-t.row)+1}}_renderGridPainter(t){const e=t.cols,o=t.rows,i=100/e,r=100/o,s=o/e*100,n=this._getPreviewRect(),a=[];for(let t=0;t<o;t++)for(let o=0;o<e;o++){const e=n&&o>=n.col&&o<n.col+n.width&&t>=n.row&&t<n.row+n.height;a.push(B`
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
        <button class="back-btn" @click=${()=>{this._editorState=pt,this._pendingRoom=null}}>
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
                ${t.entities?.light||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity?"· entities configured":"· no entities"}
              </div>
            </div>
          `)}
        </div>
      `:""}
    `}_renderRoomState(){const t=this._getActiveRoom(),e=this._getActiveFloor();return t?B`
      <div class="section-header">
        <button class="back-btn" @click=${()=>{this._editorState=mt,this._activeRoomId=null}}>
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
          ${Object.entries(ht).map(([e,o])=>B`
            <option value="${e}" ?selected=${t.room_type===e}>${o}</option>
          `)}
        </select>
      </div>

      <div class="section-title" style="margin-bottom:8px;">Entity Bindings</div>

      ${[{key:"light",label:"Light",domains:["light"]},{key:"occupancy",label:"Occupancy",domains:["binary_sensor"]},{key:"temperature",label:"Temperature",domains:["sensor"]},{key:"humidity",label:"Humidity",domains:["sensor"]}].map(({key:e,label:o,domains:i})=>B`
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
    `:B`<div>Room not found</div>`}render(){if(!this._config)return B`<div>Loading...</div>`;switch(this._editorState){case mt:return this._renderGridState();case gt:return this._renderRoomState();default:return this._renderFloorsState()}}});customElements.define("house-card",class extends lt{static get properties(){return{_config:{type:Object},_hass:{type:Object},_activeFloor:{type:Number},_activeHeatmapMode:{type:String}}}static get styles(){return s`
      :host {
        display: block;
        height: 100%;
        font-family: var(--primary-font-family, sans-serif);
      }

      ha-card {
        overflow: hidden;
        padding: 0;
        height: 100%;
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
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 16px 32px;
        min-height: 0;
        perspective: 2400px;
        perspective-origin: 50% 30%;
        overflow: visible;
      }

      .grid-canvas {
        position: relative;
        width: 100%;
        min-height: 80px;
        background: rgba(10, 11, 20, 0.95);
        border-radius: 2px;
        transform-style: preserve-3d;
        transform: rotateX(35deg) rotateY(6deg);
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
        --mdc-icon-size: 42px;
        opacity: 0.13;
        pointer-events: none;
        color: white;
      }

      /* ── Occupancy watermark — centred person icon, fades with different durations ── */
      .occupancy-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-icon-size: 56px;
        opacity: 0;
        pointer-events: none;
        color: #4cdf80;
        /*
         * Slow fade-out: transition fires when .occupied is removed.
         * The fast fade-in below overrides this while .occupied is present.
         */
        transition: opacity 7s ease-out;
      }

      .occupancy-watermark.occupied {
        opacity: 0.22;
        /* Fast fade-in: overrides the base 7s rule while this class is applied. */
        transition: opacity 0.5s ease-in;
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
        border-radius: 10px;
        padding: 7px 10px 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: calc(100% - 14px);
        pointer-events: none;
        backdrop-filter: blur(4px);
      }

      .info-header {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .info-room-name {
        font-size: 0.82rem;
        font-weight: 600;
        color: rgba(255,255,255,0.96);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.77rem;
        color: rgba(255,255,255,0.88);
        line-height: 1.3;
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
        font-size: 0.7rem;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .heatmap-legend-hum {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        color: var(--secondary-text-color);
      }

      /* ── Legend bar ── */
      .legend {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        padding: 7px 16px 8px;
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        flex-shrink: 0;
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      }

      .no-floor {
        padding: 32px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 0.9rem;
      }
    `}constructor(){super(),this._config=null,this._hass=null,this._activeFloor=0,this._activeHeatmapMode=null,this._uid=Math.random().toString(36).slice(2,8),this._pressRoom=null,this._pressTimer=null,this._pressStartX=0,this._pressStartY=0}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=t,this._activeFloor=0}set hass(t){this._hass=t}static getConfigElement(){return document.createElement("house-card-editor")}static getStubConfig(){return{title:"My House",floors:[{id:"ground",name:"Ground Floor",cols:8,rows:6,rooms:[]}]}}_getEntityState(t){return t&&this._hass&&this._hass.states[t]||null}_isLightOn(t){return"on"===this._getEntityState(t)?.state}_isOccupied(t){return"on"===this._getEntityState(t)?.state}_getTemperature(t){const e=this._getEntityState(t);if(!e)return null;const o=parseFloat(e.state);if(isNaN(o))return null;const i=e.attributes?.unit_of_measurement||"°C";return`${o.toFixed(1)}${i}`}_getHumidity(t){const e=this._getEntityState(t);if(!e)return null;const o=parseFloat(e.state);return isNaN(o)?null:`${Math.round(o)}%`}_getLightColor(t){const e=this._getEntityState(t);if(!e||"on"!==e.state)return null;const o=e.attributes?.rgb_color;return Array.isArray(o)&&3===o.length?`${o[0]},${o[1]},${o[2]}`:"255,210,150"}_handleRoomTap(t){this._hass&&t.entities?.light&&this._hass.callService("light","toggle",{entity_id:t.entities.light})}_handleRoomLongPress(t){const e=t.entities?.light||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity;e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRoomPointerDown(t,e){void 0!==t.button&&0!==t.button||(t.preventDefault(),t.stopPropagation(),this._pressRoom=e,this._pressStartX=t.clientX,this._pressStartY=t.clientY,this._pressTimer=setTimeout(()=>{this._pressTimer=null,this._pressRoom=null,this._handleRoomLongPress(e)},500))}_onRoomPointerUp(t){if(!this._pressRoom)return;const e=this._pressRoom,o=Math.abs(t.clientX-this._pressStartX),i=Math.abs(t.clientY-this._pressStartY);clearTimeout(this._pressTimer),this._pressTimer=null,this._pressRoom=null,o<10&&i<10&&this._handleRoomTap(e)}_onRoomPointerCancel(){clearTimeout(this._pressTimer),this._pressTimer=null,this._pressRoom=null}_getHeatmapMode(){return this._activeHeatmapMode??this._config?.heatmap_mode??"off"}_cycleHeatmapMode(){const t=["off","temperature","humidity","combined"],e=this._getHeatmapMode();this._activeHeatmapMode=t[(t.indexOf(e)+1)%t.length]}_renderHeatmapToggle(){const t=this._getHeatmapMode(),e={off:{icon:"mdi:thermometer-off",color:"rgba(135,135,148,0.55)",label:"Thermal overlay: off"},temperature:{icon:"mdi:thermometer",color:"#ff8c42",label:"Thermal overlay: temperature"},humidity:{icon:"mdi:water-percent",color:"#55b2ff",label:"Thermal overlay: humidity"},combined:{icon:"mdi:blur",color:"#c084fc",label:"Thermal overlay: combined"}},{icon:o,color:i,label:r}=e[t]||e.off;return B`
      <button class="heatmap-toggle" @click=${this._cycleHeatmapMode} title="${r}">
        <ha-icon icon="${o}" style="color:${i};--mdc-icon-size:20px;"></ha-icon>
      </button>
    `}_tempColour(t,[e,o]){const i=[{f:0,c:[44,95,163]},{f:.3,c:[29,158,117]},{f:.5,c:[245,196,62]},{f:.7,c:[232,138,48]},{f:1,c:[208,72,72]}],r=Math.max(0,Math.min(1,(t-e)/(o-e)));for(let t=0;t<i.length-1;t++)if(r<=i[t+1].f){const e=(r-i[t].f)/(i[t+1].f-i[t].f),o=i[t].c.map((o,r)=>Math.round(o+(i[t+1].c[r]-o)*e));return`rgb(${o[0]},${o[1]},${o[2]})`}return`rgb(${i.at(-1).c.join(",")})`}_hashCode(t){let e=0;for(const o of t)e=(e<<5)-e+o.charCodeAt(0)|0;return e}_mulberry32(t){return()=>{let e=t=t+1831565813|0;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}_humidityDroplets(t,e){if(null==t._hum||t._hum<e)return"";const o=this._mulberry32(this._hashCode(t.id||"")),i=Math.max(0,(t._hum-35)/65),r=Math.round(i*t.width*t.height*1.5),s=[];for(let e=0;e<r;e++){const e=100*(t.col+o()*t.width),i=100*(t.row+o()*t.height),r=1.4+2.6*o(),n=(.35+.35*o()).toFixed(2);s.push(q`<circle cx=${e} cy=${i} r=${r} fill="rgba(140,210,255,${n})"/>`)}return s}_renderThermalLayer(t){const e=this._getHeatmapMode();if("off"===e)return"";const o="temperature"===e||"combined"===e,i="humidity"===e||"combined"===e,r=t.temperature_range||this._config.temperature_range||[16,26],s=this._config.humidity_floor??50,n=`thermalBlur_${this._uid}`,a=(t.rooms||[]).filter(t=>!1!==t.heatmap).map(t=>{const e=parseFloat(this._getEntityState(t.entities?.temperature)?.state),o=parseFloat(this._getEntityState(t.entities?.humidity)?.state);return{...t,_temp:isNaN(e)?null:e,_hum:isNaN(o)?null:o}});return q`
      <svg class="thermal-svg"
           viewBox="0 0 ${100*t.cols} ${100*t.rows}"
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="${n}" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="42"/>
          </filter>
        </defs>

        ${o?q`
          <g filter="url(#${n})">
            ${a.map(t=>q`
              <rect
                x=${100*t.col} y=${100*t.row}
                width=${100*t.width} height=${100*t.height}
                fill=${null!=t._temp?this._tempColour(t._temp,r):"rgba(80,80,90,0.35)"}
              />`)}
          </g>`:""}

        ${i?q`
          <g>
            ${a.map(t=>this._humidityDroplets(t,s))}
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
    `}_renderFloor(t){if(!t||!t.cols||!t.rows)return B`<div class="no-floor">Floor not configured</div>`;const e=this._getHeatmapMode(),o=t.rooms||[],i=100/t.cols,r=100/t.rows;return B`
      <div class="grid-wrapper">
        <div class="grid-canvas"
             style="aspect-ratio:${t.cols}/${t.rows};"
             data-heatmap="${e}">
          ${this._renderThermalLayer(t)}
          ${o.map(t=>this._renderRoom(t,i,r))}
        </div>
      </div>
    `}_renderRoom(t,e,o){const i=!!t.entities?.light&&this._isLightOn(t.entities.light),r=!!t.entities?.occupancy&&this._isOccupied(t.entities.occupancy),s=t.entities?.temperature?this._getTemperature(t.entities.temperature):null,n=t.entities?.humidity?this._getHumidity(t.entities.humidity):null,a=t.entities?.light?this._getLightColor(t.entities.light):null,l=.6,d=`${t.col*e+l}%`,c=`${t.row*o+l}%`,h=t.width*e-1.2+"%",p=t.height*o-1.2+"%",m=["room-face",i?"light-on":"",!!(t.entities?.light||t.entities?.occupancy||t.entities?.temperature||t.entities?.humidity)?"interactive":""].filter(Boolean).join(" "),g=t.color,u=a?`box-shadow:0 0 20px 8px rgba(${a},0.40),0 0 52px 22px rgba(${a},0.16);`:"box-shadow:none;",f=a?`background:linear-gradient(to bottom,rgba(${a},0.28),rgba(${a},0.10)),linear-gradient(to bottom,rgba(20,23,40,0.82),rgba(8,10,22,0.96));`:`background:linear-gradient(to bottom,${g}1c 0%,${g}06 100%),linear-gradient(to bottom,rgba(20,23,40,0.90),rgba(8,10,22,0.97));`,_=a?`background:linear-gradient(to right,rgba(${a},0.10),rgba(${a},0.24)),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`:`background:linear-gradient(to right,${g}15 0%,${g}05 100%),linear-gradient(to right,rgba(8,10,22,0.97),rgba(16,18,34,0.90));`,b=i?"#ffd700":"rgba(135,135,148,0.55)",v=r?"#4cdf80":"rgba(135,135,148,0.45)",y=ct[t.room_type];return B`
      <div class="room-3d" style="left:${d};top:${c};width:${h};height:${p};">

        <div
          class="${m}"
          style="background-color:${g}0f;${u}"
          @pointerdown=${e=>this._onRoomPointerDown(e,t)}
          @pointerup=${t=>this._onRoomPointerUp(t)}
          @pointercancel=${()=>this._onRoomPointerCancel()}
          @pointerleave=${()=>this._onRoomPointerCancel()}
        >
          ${y?B`
            <ha-icon icon="${y}" class="room-type-icon"></ha-icon>`:""}

          ${t.entities?.occupancy?B`
            <ha-icon icon="mdi:account"
              class="occupancy-watermark ${r?"occupied":""}"></ha-icon>`:""}

          <div class="room-info-card">
            <div class="info-header">
              <ha-icon icon="mdi:lightbulb"
                style="color:${b};--mdc-icon-size:18px;flex-shrink:0;"></ha-icon>
              <span class="info-room-name">${t.name}</span>
            </div>

            ${s?B`
              <div class="info-row">
                <ha-icon icon="mdi:thermometer"
                  style="color:${"rgba(255,168,75,0.92)"};--mdc-icon-size:16px;flex-shrink:0;"></ha-icon>
                <span>${s}</span>
              </div>`:""}

            ${n?B`
              <div class="info-row">
                <ha-icon icon="mdi:water-percent"
                  style="color:${"rgba(85,178,255,0.92)"};--mdc-icon-size:16px;flex-shrink:0;"></ha-icon>
                <span>${n}</span>
              </div>`:""}

            ${t.entities?.occupancy?B`
              <div class="info-row">
                <ha-icon icon="mdi:account"
                  style="color:${v};--mdc-icon-size:16px;flex-shrink:0;"></ha-icon>
              </div>`:""}
          </div>
        </div>

        <div class="room-wall-front" style="${f}"></div>
        <div class="room-wall-left"  style="${_}"></div>

      </div>
    `}_renderLegend(){const t=(t,e)=>B`<ha-icon icon="${t}" style="color:${e};--mdc-icon-size:14px;"></ha-icon>`;return B`
      <div class="legend">
        <div class="legend-item">${t("mdi:lightbulb","#ffd700")}<span>Light On</span></div>
        <div class="legend-item">${t("mdi:lightbulb","rgba(135,135,148,0.55)")}<span>Light Off</span></div>
        <div class="legend-item">${t("mdi:account","#4cdf80")}<span>Occupied</span></div>
        <div class="legend-item">${t("mdi:account","rgba(135,135,148,0.45)")}<span>Unoccupied</span></div>
      </div>
    `}render(){if(!this._config)return B``;const t=this._config.floors||[],e=t[this._activeFloor],o=t.length>1;return B`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title||""}</span>
          ${this._renderHeatmapToggle()}
        </div>

        ${o?B`
          <div class="floor-tabs">
            ${t.map((t,e)=>B`
              <button
                class="floor-tab ${e===this._activeFloor?"active":""}"
                @click=${()=>{this._activeFloor=e}}
              >${t.name||`Floor ${e+1}`}</button>
            `)}
          </div>`:""}

        ${0===t.length?B`<div class="no-floor">No floors configured. Click the edit button to get started.</div>`:B`
            ${this._renderFloor(e)}
            ${this._renderHeatmapLegend(e)}
            ${this._renderLegend()}
          `}
      </ha-card>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"house-card",name:"House Card",description:"Visual floorplan card with grid-based room layout and entity state display.",preview:!1});
