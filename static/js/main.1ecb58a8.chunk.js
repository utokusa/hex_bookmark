(this.webpackJsonphex_bookmark=this.webpackJsonphex_bookmark||[]).push([[0],{203:function(e,t,n){e.exports=n(302)},300:function(e,t,n){e.exports=n.p+"static/media/shape.cbf2fd30.svg"},301:function(e,t,n){e.exports=n.p+"static/media/logo.5b607bd4.svg"},302:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(14),i=n.n(r),l=n(24),c=n(18),u=n(38),f=n(39),d=n(40),s=n(339),m=n(344),p=n(345),b=n(156),g=n(116),v=n(186),O=n(342),k=n(16),h=n(7),y=n(26),E=n(346),j=n(171),w=n(185),x=n.n(w),S=n(139),I=n.n(S),B=Object(s.a)((function(e){return{input:{display:"none"},button:{margin:e.spacing(.5)}}}));function D(e){var t=B();return o.a.createElement("div",null,o.a.createElement("input",{className:t.input,accept:e.accept,id:e.strId,type:"file",ref:e.fin,onChange:e.onChange}),o.a.createElement("label",{htmlFor:e.strId},o.a.createElement(j.a,{className:t.button,variant:"contained",color:"primary",size:"small",component:"span"},e.label)))}var R=n(343),L=Object(s.a)((function(e){return{input:{display:"none"},button:{margin:e.spacing(.5)}}}));function T(e){return o.a.createElement(R.a,null,o.a.createElement(E.a,{mt:2},o.a.createElement(C,{boxShadow:3,bgcolor:"background.paper",fin:e.fin,onToggleByteOder:e.onToggleByteOder,onSaveBookmark:e.onSaveBookmark,onBookmarkLoad:e.onBookmarkLoad,isLittleEndian:e.isLittleEndian,columns:e.columns,data:e.data,onRowAdd:e.onRowAdd,onRowUpdate:e.onRowUpdate,onRowDelete:e.onRowDelete,bookmarkFile:e.bookmarkFile})))}function C(e){var t=e.bookmarkFile,n=L();function a(){e.onToggleByteOder()}function r(){e.onSaveBookmark()}function i(){e.onBookmarkLoad()}var l=e.isLittleEndian?"Little Endian":"Big Endian";return o.a.createElement("div",null,o.a.createElement(I.a,{title:"Bookmarks",columns:e.columns,data:e.data,editable:{onRowAdd:function(t){return e.onRowAdd(t)},onRowUpdate:function(t,n){return e.onRowUpdate(t,n)},onRowDelete:function(t){return e.onRowDelete(t)}},options:{exportButton:!0},components:{Toolbar:function(e){return o.a.createElement("div",null,o.a.createElement(S.MTableToolbar,e),o.a.createElement(E.a,{display:"flex",flexDirection:"row",alignItems:"center",mx:3},o.a.createElement(j.a,{variant:"outlined",color:"primary",size:"small",onClick:a,style:{width:"9rem"},className:n.button},l),o.a.createElement(j.a,{variant:"contained",color:"primary",size:"small",className:n.button,startIcon:o.a.createElement(x.a,null),onClick:r},"Save Bookmark"),o.a.createElement(D,{accept:"application/json",strId:"load-button-file",fin:t,onChange:i,label:"Load Bookmark"})))}}}))}function F(e){return o.a.createElement(R.a,null,o.a.createElement(E.a,{boxShadow:3,bgcolor:"background.paper",mt:3,p:3,display:"flex",flexDirection:"row",alignItems:"center"},o.a.createElement(U,{fin:e.fin,onChange:function(t,n){e.onChange(t,n)}}),o.a.createElement(E.a,{mx:3},o.a.createElement(g.a,{noWrap:"true",style:{width:"35rem",textAlign:"left"}},e.fileInfo))))}function U(e){return o.a.createElement("div",null,o.a.createElement(D,{strId:"open-binnary-file-button",fin:e.fin,onChange:function(t){t.preventDefault();var n=e.fin.current.files[0].name;e.onChange(n,"")},label:"Open"}))}function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach((function(t){Object(h.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function A(e){var t,n,a=o.a.useState({fileInfo:"Input Binary File",data:""}),r=Object(y.a)(a,2),i=r[0],l=r[1];var c={int8:0,uint8:1,int16:2,uint16:3,int32:4,uint32:5,float32:6,float64:7,ascii:8},u=(t={},Object(h.a)(t,c.int8,"int8"),Object(h.a)(t,c.uint8,"uint8"),Object(h.a)(t,c.int16,"int16"),Object(h.a)(t,c.uint16,"uint16"),Object(h.a)(t,c.int32,"int32"),Object(h.a)(t,c.uint32,"uint32"),Object(h.a)(t,c.float32,"float32"),Object(h.a)(t,c.float64,"float64"),Object(h.a)(t,c.ascii,"ascii"),t),f=(n={},Object(h.a)(n,c.int8,1),Object(h.a)(n,c.uint8,1),Object(h.a)(n,c.int16,2),Object(h.a)(n,c.uint16,2),Object(h.a)(n,c.int32,4),Object(h.a)(n,c.uint32,4),Object(h.a)(n,c.float32,4),Object(h.a)(n,c.float64,8),Object(h.a)(n,c.ascii,1),n),d=c.int32,s=String(d),m=f[c.int32],p=o.a.useState({columns:[{title:"Offset",field:"offset"},{title:"Name",field:"name"},{title:"Data Type",field:"dataType",lookup:u},{title:"Data size",field:"dataSize"},{title:"Value",field:"value",type:"numeric",editable:"never"},{title:"Hex Dump",field:"hexDump",editable:"never"}],data:[{offset:"0x00000000",name:"",dataType:s,dataSize:m,value:"",hexDump:""}],isLittleEndian:!0}),b=Object(y.a)(p,2),g=b[0],v=b[1];function O(e,t){var n=parseInt(t.offset);(isNaN(n)||n<0||n>0x10000000000000000)&&(t.offset="0x0000"),"undefined"==typeof t.dataType&&(t.dataType=d),function(e){var t=parseInt(e.dataType);if(t===c.ascii){var n=parseInt(e.dataSize);isNaN(n)||n<1||n>100?e.dataSize=1:e.dataSize=n}else e.dataSize=f[t]}(t),function(e){"undefined"!=typeof e.name&&e.name.length>100&&(e.name=e.name.slice(0,100))}(t),v((function(n){var a=Object(k.a)(n.data);return a[a.indexOf(e)]=t,z({},n,{data:a})}))}function j(e,t,n,a,o){var r=0;return n+a>t.byteLength?"Offset out of bounds":(e===c.int8?r=t.getInt8(n,o):e===c.uint8?r=t.getUint8(n,o):e===c.int16?r=t.getInt16(n,o):e===c.uint16?r=t.getUint16(n,o):e===c.int32?r=t.getInt32(n,o):e===c.uint32?r=t.getUint32(n,o):e===c.float32?r=t.getFloat32(n,o):e===c.float64?r=t.getFloat64(n,o):e===c.ascii?r=function(e,t,n,a){for(var o=[],r=0;r<n;++r){var i=e.getUint8(t+1*r,a);(i<32||i>126)&&(i=46),o.push(i)}return String.fromCharCode.apply(String,o)}(t,n,a,o):console.log("Unkown Data Type!"),r)}function w(e,t,n){return t+n>e.byteLength?"":function(e){var t=[];return t.push.apply(t,Object(k.a)(Array.prototype.map.call(e,(function(e){return("00"+e.toString(16).toUpperCase()).slice(-2)})))),t.join("")}(new Uint8Array(e).slice(t,t+n))}function x(e,t,n){var a=e.current.files[0];if("undefined"!==typeof a){var o=new FileReader;o.onload=function(e){var a=o.result,r=new DataView(a),i=parseInt(n.offset);if(isNaN(i))v((function(e){var a=Object(k.a)(e.data);return n.value="Invalid Offset",a[a.indexOf(t)]=n,z({},e,{data:a})}));else{var l=parseInt(n.dataType),c=parseInt(n.dataSize),u=j(l,r,i,c,g.isLittleEndian),f=w(a,i,c);v((function(e){var a=Object(k.a)(e.data);return n.value=u,n.hexDump=f,a[a.indexOf(t)]=n,z({},e,{data:a})}))}},o.onerror=function(e){console.log("onerror")},o.onload=o.onload.bind(this),o.readAsArrayBuffer(a)}else console.log("case undefined")}function S(){v((function(t){var n=Object(k.a)(t.data);for(var a in n)O(n[a],n[a]),I(n[a],n[a]),x(e.fin,n[a],n[a]);return z({},t,{data:n})}))}function I(e,t){!function(e,t){v((function(n){var a=Object(k.a)(n.data),o=parseInt(t.offset),r=o>4294967295?16:8;return t.offset="0x"+o.toString(16).toUpperCase().padStart(r,"0"),a[a.indexOf(e)]=t,z({},n,{data:a})}))}(e,t)}return o.a.createElement(E.a,null,o.a.createElement(F,{fin:e.fin,onChange:function(e,t){l({fileInfo:e,data:t}),S()},fileInfo:i.fileInfo,data:i.data}),o.a.createElement(T,{fin:e.fin,onToggleByteOder:function(){v((function(e){return e.isLittleEndian=!e.isLittleEndian,z({},e)})),S()},onSaveBookmark:function(){var e=[];for(var t in g.data){var n=g.data[t];e.push({offset:n.offset,name:n.name,dataType:n.dataType,dataSize:n.dataSize})}var a=JSON.stringify(e),o=new Blob([a],{type:"text/plain"}),r=document.createElement("a");r.href=window.URL.createObjectURL(o),r.download="my_hex_bookmark.json",r.click()},onBookmarkLoad:function(){var t=e.bookmarkFile.current.files[0];if("undefined"!==typeof t){var n=new FileReader;n.onload=function(e){var t=JSON.parse(e.target.result);v((function(e){var n=[];for(var a in t)n.push(t[a]);return z({},e,{data:n})})),S()},n.onerror=function(e){console.error("reading failed")},n.onload=n.onload.bind(this),n.readAsText(t)}},isLittleEndian:g.isLittleEndian,columns:g.columns,data:g.data,onRowAdd:function(t){return new Promise((function(n){n(),v((function(e){var n=Object(k.a)(e.data);return n.push(t),z({},e,{data:n})})),O(t,t),I(t,t),x(e.fin,t,t)}))},onRowUpdate:function(t,n){return new Promise((function(a){a(),n&&(O(n,t),I(n,t),x(e.fin,n,t))}))},onRowDelete:function(e){return new Promise((function(t){t(),v((function(t){var n=Object(k.a)(t.data);return n.splice(n.indexOf(e),1),z({},t,{data:n})}))}))},bookmarkFile:e.bookmarkFile}))}var P=n(300),J=n(301),_=Object(v.a)({typography:{fontFamily:['"Courier New"',"Consolas","monospace"].join(",")},palette:{primary:{light:"#d9d9d9",main:"#7b7b7b",dark:"#262626",contrastText:"#fff"},secondary:{light:"#d9d9d9",main:"#7b7b7b",dark:"#262626",contrastText:"#fff"}}}),W=Object(s.a)((function(e){return{app:{textAlign:"center",flexGrow:1,backgroundColor:e.palette.grey[100],overflow:"hidden",background:"url(".concat(P,") no-repeat"),backgroundSize:"cover",backgroundPosition:"0 200px",paddingBottom:200}}}));function H(e){return o.a.createElement("div",null,o.a.createElement(O.a,{theme:_},o.a.createElement(m.a,{position:"static",color:"default"},o.a.createElement(b.a,null,o.a.createElement(g.a,{variant:"h3",color:"inherit"},"Hex Bookmark"),o.a.createElement("div",{style:{marginLeft:"1.5em"}},o.a.createElement("img",{width:50,height:50,src:J,alt:""})))),o.a.createElement(M,null),o.a.createElement(V,null)))}var M=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(f.a)(t).call(this,e))).fileInput=o.a.createRef(),n.bookmarkFile=o.a.createRef(),n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(A,{fin:this.fileInput,bookmarkFile:this.bookmarkFile}))}}]),t}(o.a.Component);function V(){return o.a.createElement(g.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",o.a.createElement(p.a,{color:"inherit",href:"https://github.com/utokusa/"},"Utokusa")," ",(new Date).getFullYear(),".")}var G=function(e){var t=W(e);return o.a.createElement("div",{className:t.app},o.a.createElement(H,null),o.a.createElement("link",{rel:"stylesheet",href:"https://fonts.googleapis.com/icon?family=Material+Icons"}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(G,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[203,1,2]]]);
//# sourceMappingURL=main.1ecb58a8.chunk.js.map