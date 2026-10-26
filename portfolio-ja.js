(()=>{
'use strict';
const lang=new URLSearchParams(location.search).get('lang')==='ja'?'ja':'en';
document.documentElement.lang=lang;
const nav=document.querySelector('.unified-nav')||document.querySelector('.home-header nav');
if(nav&&!nav.querySelector('.language-switch')){
 const control=document.createElement('div');control.className='language-switch';control.setAttribute('aria-label','Language');
 for(const [key,label] of [['en','EN'],['ja','日本語']]){const a=document.createElement('a'),url=new URL(location.href);url.searchParams.set('lang',key);a.href=url.pathname+url.search+url.hash;a.lang=key;a.textContent=label;if(key===lang)a.setAttribute('aria-current','true');control.append(a)}nav.append(control);
}
function links(){document.querySelectorAll('a[href]').forEach(a=>{if(a.closest('.language-switch')||a.hasAttribute('download'))return;try{const u=new URL(a.getAttribute('href'),location.href);if(u.origin===location.origin&&u.pathname.endsWith('.html')){u.searchParams.set('lang',lang);const value=u.pathname+u.search+u.hash;if(a.getAttribute('href')!==value)a.setAttribute('href',value)}}catch{}})}
links();
if(lang!=='ja')return;
fetch('portfolio-ja-data.json?v=8').then(r=>{if(!r.ok)throw Error('Japanese copy unavailable');return r.json()}).then(dict=>{
 const normalize=text=>text.replace(/\s+/g,' ').trim();
 let pending=false;
 function translate(){pending=false;const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('script,style,svg,textarea,.language-switch')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){const key=normalize(node.nodeValue),value=dict[key];if(value&&value!==key)node.nodeValue=node.nodeValue.replace(node.nodeValue.trim(),value)}links();}
 const title=dict[normalize(document.title)];if(title)document.title=title;
 const meta=document.querySelector('meta[name=description]');if(meta&&dict[normalize(meta.content)])meta.content=dict[normalize(meta.content)];
 if(location.pathname.endsWith('/about.html'))document.querySelectorAll('.resume-job li').forEach(li=>{const value=dict[normalize(li.textContent)];if(value)li.textContent=value});
 translate();
 const phrases={
 '肩書きではなく、行動から設計する。':['肩書きではなく、','行動から設計する。'],
 '業務をつなぐ。ツールもつなぐ。':['業務をつなぐ。','ツールもつなぐ。'],
 'RightCapitalらしさを、すべての画面に。':['RightCapitalらしさを、','すべての画面に。'],
 '設計からコードまで、共通の基盤を。':['設計からコードまで、','共通の基盤を。'],
 '画面全体に、統一感を。':['画面全体に、','統一感を。'],
 '一貫性を保ち、毎月に新しい表情を。':['一貫性を保ち、','毎月に新しい表情を。'],
 '白いモデルに、色と素材を。':['白いモデルに、','色と素材を。'],
 '見つけた問題を、その場で修正。':['見つけた問題を、','その場で修正。'],
 '改善幅と、そのための条件を。':['改善幅と、','そのための条件を。'],
 '限られた時間で、実現できる設計を。':['限られた時間で、','実現できる設計を。'],
 '異なる制作を、共通の仕組みで。':['異なる制作を、','共通の仕組みで。']
 };
 document.querySelectorAll('h2,h3,.about-lead').forEach(el=>{const parts=phrases[normalize(el.textContent)];if(parts)el.replaceChildren(...parts.map(text=>{const span=document.createElement('span');span.className='ja-phrase';span.textContent=text;return span}))});
 new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(translate)}}).observe(document.body,{subtree:true,childList:true,characterData:true});
}).catch(error=>{console.error(error);document.documentElement.lang='en'});
})();
