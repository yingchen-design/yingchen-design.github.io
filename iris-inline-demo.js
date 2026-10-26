(()=>{
 const params=new URLSearchParams(location.search),initial=params.get('mode')||'home';
 const panel=document.querySelector('#aiPanel'),chat=document.querySelector('#chatArea');
 panel.setAttribute('role','main');panel.setAttribute('aria-label','Interactive Iris design prototype');
 document.querySelector('.floating-action-btn')?.remove();
 document.querySelectorAll('.ai-title-main').forEach(e=>e.textContent='Iris');
 const note=document.createElement('div');note.className='inline-demo-note';note.textContent='Design prototype · Simulated client data · Changes stay in this demo';panel.querySelector('.ai-header').after(note);
 const bar=document.createElement('div');bar.className='inline-modebar';bar.setAttribute('aria-label','Prototype tasks');note.after(bar);
 const modes=[['home','Ask Iris'],['issues','Review findings'],['compare','Compare plans'],['authorization','Data access']];
 for(const [mode,label]of modes){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.mode=mode;b.onclick=()=>setMode(mode);bar.append(b);}
 if(initial!=='home')bar.hidden=true;
 let activeCard=null,activeKey='',returnFocus=null,selectedPlan='Plan B';
 const baseOpen=openDrawer,baseAsk=askQuestion;
 const labels={'retirement-expense':['Monthly retirement expense','13'],'retirement-age':['Retirement age','62'],'home-relocation':['Relocation budget','0'],'medical':['Monthly medical expense','0'],'alimony':['Monthly alimony','0'],'social-security':['Annual Social Security benefit','0'],'health-insurance-1':['Monthly health insurance premium','0'],'health-insurance-2':['Monthly health insurance premium','0'],'salary':['Annual salary','0']};
 window.openDrawer=(section,key)=>{
  activeKey=key;activeCard=[...document.querySelectorAll('.mini-card')].find(e=>e.getAttribute('onclick')?.includes("'"+key+"'"));returnFocus=activeCard;
  baseOpen(section,key);
  const [label,value]=labels[key]||['Amount','0'];
  document.querySelector('.drawer-form').innerHTML='';
  const group=document.createElement('div');group.className='form-group';const l=document.createElement('label');l.className='form-label';l.htmlFor='inline-edit-value';l.textContent=label;
  const input=document.createElement('input');input.id='inline-edit-value';input.className='form-input';input.type='number';input.min='0';input.step=key==='retirement-age'?'1':'0.01';input.value=activeCard?.dataset.savedValue||value;
  group.append(l,input);document.querySelector('.drawer-form').append(group);setTimeout(()=>input.focus({preventScroll:true}),50);
 };
 const baseClose=closeDrawer;window.closeDrawer=()=>{baseClose();returnFocus?.focus({preventScroll:true});};
 const save=document.querySelector('.drawer-btn.save');save.onclick=()=>{
  const input=document.querySelector('#inline-edit-value');if(!input?.reportValidity())return;
  const value=input.value;if(activeCard){activeCard.dataset.savedValue=value;const v=activeCard.querySelector('.mini-card-value');if(v)v.textContent=(labels[activeKey]?.[0]||'Value')+': '+Number(value).toLocaleString('en-US');const issue=activeCard.closest('.issue-card');if(issue){issue.dataset.resolved='true';const badge=issue.querySelector('.badge');if(badge){badge.textContent='Updated';badge.style.cssText='background:#e5f2e9;color:#245336';}}}
  closeDrawer();let status=document.querySelector('.inline-save-status');if(!status){status=document.createElement('div');status.className='inline-save-status';status.setAttribute('role','status');chat.prepend(status);}status.textContent='Saved in this demo. The linked finding has been updated.';
 };
 window.askQuestion=q=>{const safe=String(q).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));baseAsk(safe);};
 window.smoothScrollToBottom=()=>{};
 document.querySelector('.send-icon')?.remove();document.querySelector('.attach-btn')?.remove();
 const send=document.createElement('button');send.type='button';send.textContent='Send';send.setAttribute('aria-label','Send question to Iris');send.onclick=()=>{const input=document.querySelector('#chatInput');if(input.value.trim()){askQuestion(input.value);input.value='';}};document.querySelector('.input-box').append(send);
 document.querySelector('.ai-actions button[title="New chat"]').onclick=()=>setMode('home');
 function setMode(mode){
  closeDrawer();document.querySelector('#authModal').classList.remove('show');newChat();pendingQuestion=null;isDataAccessAuthorized=mode!=='authorization';isAIOpen=true;isFullscreen=true;panel.classList.add('open','fullscreen');panel.classList.remove('pushed');
  document.querySelector('#clientDataToggle').classList.toggle('on',isDataAccessAuthorized);initializeDataAccess();
  bar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  if(mode==='issues'||mode==='compare'){document.querySelector('#suggestionsSection').style.display='none';chat.innerHTML='';if(mode==='issues')showProfileIssues();else showAnalysis();}
  chat.scrollTop=0;
 }
 function enhance(){
  document.querySelectorAll('.plan-card').forEach(card=>{if(card.dataset.inlineReady)return;card.dataset.inlineReady='true';card.setAttribute('role','button');card.tabIndex=0;const tag=card.querySelector('.plan-tag')?.textContent.trim();card.setAttribute('aria-label','Select '+tag);card.setAttribute('aria-pressed',String(tag===selectedPlan));card.onclick=()=>{selectedPlan=tag;document.querySelectorAll('.plan-card').forEach(c=>c.setAttribute('aria-pressed',String(c===card)));const b=document.querySelector('#approveBtn');if(b){b.disabled=false;b.textContent='Apply '+tag;}};});
  const approve=document.querySelector('#approveBtn');if(approve&&!approve.dataset.inlineReady){approve.dataset.inlineReady='true';approve.textContent='Apply '+selectedPlan;approve.onclick=()=>{const card=[...document.querySelectorAll('.plan-card')].find(c=>c.querySelector('.plan-tag')?.textContent.trim()===selectedPlan);let status=document.createElement('p');status.setAttribute('role','status');status.className='inline-save-status';status.textContent=selectedPlan+' applied in this demo. Illustrative success rate: '+(card?.querySelector('.plan-result')?.textContent.replace('→','').trim()||'88%')+'.';approve.parentElement.after(status);approve.textContent=selectedPlan+' applied';approve.disabled=true;};}
  document.querySelectorAll('.btn-outline,.btn-disapprove').forEach(e=>e.remove());
  document.querySelectorAll('[onclick][role=button]').forEach(e=>{if(!e.textContent.trim()&&!e.hasAttribute('aria-label'))e.setAttribute('aria-label',e.classList.contains('toggle')?'Toggle client data access':'Close editing');});
 }
 new MutationObserver(enhance).observe(chat,{childList:true,subtree:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.querySelector('#authModal.show'))cancelAuthorization();else closeDrawer();}if((e.key==='Enter'||e.key===' ')&&e.target.matches('.plan-card')){e.preventDefault();e.target.click();}});
 const modal=document.querySelector('#authModal');modal.setAttribute('role','dialog');modal.setAttribute('aria-label','Authorize client data access');modal.setAttribute('aria-modal','true');
 new MutationObserver(()=>{const open=modal.classList.contains('show');panel.inert=open;if(open)setTimeout(()=>modal.querySelector('button').focus(),0);else if(document.activeElement.closest('#authModal'))document.querySelector('#chatInput').focus();}).observe(modal,{attributes:true,attributeFilter:['class']});
 modal.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const buttons=[...modal.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
 function start(){setMode(initial);enhance();}
 if(document.readyState==='complete')start();else addEventListener('load',start,{once:true});
})();
