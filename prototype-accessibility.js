(()=>{
 if(!document.title)document.title='Iris AI — interactive design prototype';
 if(!document.querySelector('main')){const main=document.createElement('main');main.style.display='contents';main.id='prototype-content';[...document.body.children].filter(e=>!['SCRIPT','STYLE'].includes(e.tagName)).forEach(e=>main.append(e));document.body.prepend(main);}
 if(!document.querySelector('h1')){const h=document.createElement('h1');h.textContent='Iris AI prototype';h.style.cssText='position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap';(document.querySelector('main')||document.body).prepend(h);}
 const panel=document.querySelector('#aiPanel');if(panel&&!panel.closest('main')){panel.setAttribute('role','complementary');panel.setAttribute('aria-label','Iris assistant');}
 document.querySelectorAll('nav').forEach((n,i)=>{if(!n.hasAttribute('aria-label'))n.setAttribute('aria-label',i?'Planning sections':'Product navigation');});
 document.querySelectorAll('input,textarea,select').forEach(e=>{if(e.labels?.length||e.hasAttribute('aria-label'))return;const names={millennialAge:'Client retirement age',mikeAge:'Co-client retirement age'};e.setAttribute('aria-label',names[e.id]||e.placeholder||e.value||'Ask Iris');});
 document.querySelectorAll('button').forEach(b=>{if(!b.textContent.trim()&&!b.hasAttribute('aria-label'))b.setAttribute('aria-label',b.title||'Open Iris assistant');});
 function keyboardControls(){document.querySelectorAll('[onclick]:not(button):not(a):not(input):not(select):not(textarea)').forEach(e=>{if(e.dataset.keyboardReady)return;e.dataset.keyboardReady='true';e.setAttribute('role','button');e.tabIndex=0;e.addEventListener('keydown',ev=>{if(ev.target===e&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();e.click();}});});}
 keyboardControls();new MutationObserver(keyboardControls).observe(document.body,{childList:true,subtree:true});
})();
(()=>{
 const css=document.createElement('style');css.textContent=`
 .label,.header-sub,.section-label,.connector-name,.connector-desc,.input-placeholder,.sender-name,.category-label,.mini-card-value,.snapshot-item-label,.step-num,.sub-intro,.ai-title-sub,.suggestions-header,.description,.grid-label,.tab,.sub-nav a,.notes-section>span,.issues-footer p{color:#4f565d!important}
 .connector.disabled{opacity:1!important}.drawer-btn.cancel{background:#e5e7eb!important;color:#242424!important}
 #approveBtn{background:#187052!important;color:#fff!important}
 :where(a,button,input,textarea,select,[tabindex]):focus-visible{outline:2px solid #2145b0;outline-offset:3px}
 @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`;
 document.head.append(css);
 const authorize=location.pathname.includes('authorization-original');
 const ai=document.querySelector('#aiPanel');if(authorize&&ai){ai.setAttribute('role','main');ai.setAttribute('aria-label','Iris authorization prototype');if(!ai.querySelector('h1')){const h=document.createElement('h1');h.textContent='Iris authorization';h.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';ai.prepend(h);}}
 document.querySelectorAll('#editDrawer').forEach(e=>{e.setAttribute('role','region');e.setAttribute('aria-label','Edit plan settings');});
 document.querySelectorAll('[onclick][role=button]').forEach(e=>{if(!e.textContent.trim()&&!e.hasAttribute('aria-label'))e.setAttribute('aria-label',/toggle/i.test(e.id)?'Toggle client data access':'Close settings');});
})();
