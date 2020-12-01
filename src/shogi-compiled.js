'use strict';(function(C){function l(a){const b={},c={};for(const e in a){const f=a[e];Array.isArray(f)?(b[e]=f[m.s],c[e]=f[m.m]):(b[e]=f,c[e]=f)}return[b,c]}function t(a,b){var c=b.sentei?m.s:m.m;b=g("svg",n.root[c]);const e=g("polygon",n.a[c]),f=g("polygon",n.A[c]);c=g("text",n.B[c]);c.textContent=a;b.appendChild(e);b.appendChild(f);b.appendChild(c);return b}function h(a,b){return a.querySelectorAll("."+d.j)[b.dan-1].querySelectorAll("."+d.i)[9-b.suji]}function u(a){return a.classList.contains(d.b)}
function p(a,b){return k(h(a,b))}function k(a){return a.querySelector("."+d.a)||null}function v(a){a.classList.add(d.c)}function w(a){a.classList.remove(d.c)}function x(a){return a.classList.contains(d.c)}function y(a,b){a=h(a,b);(b=k(a))&&a.removeChild(b)}function z(a){return a.textContent.trim()}function q(a){return(a=k(a))&&z(a)}function g(a,b={}){a=D.has(a)?document.createElementNS("http://www.w3.org/2000/svg",a):document.createElement(a);for(const c in b)a.setAttribute(c,b[c]);return a}const d=
{u:"shogi__board",F:"shogi__suji_text_row",D:"shogi__suji_text",l:"shogi__dan_text",j:"shogi__dan_row",v:"shogi__board__dot",i:"shogi__cell",b:"shogi__cell--highlighted",a:"shogi__koma",c:"shogi__koma--selected",C:"shogi__mochigomas",o:"shogi__mochigomas--koutei",f:"shogi__mochigoma",h:"shogi__mochigoma__koma",g:"shogi__mochigoma__count"},m={s:0,m:1},n={root:l({"class":d.a,viewBox:"0 0 250 250"}),a:l({points:["125,0 195,30 235,238 15,238 55,30","125,238 195,208 235,0 15,0 55,208"],fill:"rgb(221,190,138)"}),
A:l({points:["15,238 235,238 232,250 18,250","125,238 195,208 192,220 125,250 58,220 55,208"],fill:"rgb(133,111,83)"}),B:l({"text-anchor":"middle","dominant-baseline":"middle","font-size":"120px",x:"125",y:["145","93"],transform:["","rotate(180,125,93)"]})},D=new Set(["svg","polygon","text"]),E="\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341".split("");C.Shogi={komaTypes:"\u738b\u7389\u98db\u9f8d\u89d2\u99ac\u91d1\u9280\u5168\u6842\u572d\u9999\u674f\u6b69\u3068".split(""),komaSVG:t,
boardDiv:function(){const a=g("div",{"class":d.u});var b=g("div",{"class":d.F});for(var c=9;1<=c;c--){var e=g("div",{"class":d.D});e.textContent=c;b.appendChild(e)}b.appendChild(g("div",{"class":d.l}));a.appendChild(b);for(b=1;9>=b;b++){c=g("div",{"class":d.j});for(e=9;1<=e;e--){if(!(3!=e&&6!=e||3!=b&&6!=b)){var f=g("div",{"class":d.v});c.appendChild(f)}f=g("div",{"class":d.i});c.appendChild(f)}e=g("div",{"class":d.l});f=g("span");f.textContent=E[b-1];e.appendChild(f);c.appendChild(e);a.appendChild(c)}return a},
mochigomasDiv:function(){const a=g("div",{"class":d.C});for(let b=0;7>b;b++){const c=g("div",{"class":d.f});c.appendChild(g("div",{"class":d.h}));c.appendChild(g("div",{"class":d.g}));a.appendChild(c)}return a},cellAt:h,highlightCellAt:function(a,b){h(a,b).classList.add(d.b)},unhighlightCellAt:function(a,b){h(a,b).classList.remove(d.b)},cellHighlighted:u,cellHighlightedAt:function(a,b){return u(h(a,b))},komaAt:p,komaIn:k,selectKoma:v,unselectKoma:w,komaSelected:x,selectKomaAt:function(a,b){(a=p(a,
b))&&v(a)},unselectKomaAt:function(a,b){(a=p(a,b))&&w(a)},komaSelectedAt:function(a,b){return(a=p(a,b))&&x(a)},putKomaAt:function(a,b,c){y(a,c);h(a,c).appendChild(b)},removeKomaAt:y,komaType:z,komaTypeAt:function(a,b){return q(h(a,b))},komaTypeIn:q,setMochigomas:function(a,b,c){c.sentei?a.classList.remove(d.o):a.classList.add(d.o);a=a.querySelectorAll("."+d.f);for(let f=0;7>f;f++){var e=a[f];const r=e.querySelector("."+d.h);e=e.querySelector("."+d.g);const A=k(r);A&&r.removeChild(A);e.textContent=
"";const {type:B,count:F}=b[f]||{};B&&(r.appendChild(t(B,c)),e.textContent=F)}},getMochigomas:function(a){a=a.querySelectorAll("."+d.f);const b=[];for(let f=0;7>f;f++){var c=a[f],e=c.querySelector("."+d.g);c=q(c.querySelector("."+d.h));e=parseInt(e.textContent,10);c&&(b[f]={type:c,count:e})}return b}}})(window);
