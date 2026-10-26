/* Stable chapter anchors only; case-study directories have been removed. */
(()=>{
 const main=document.querySelector('main');if(!main)return;
 main.querySelectorAll(':scope > .case-section').forEach((section,index)=>{
  if(!section.id)section.id='mde-chapter-'+String(index+1).padStart(2,'0');
 });
})();
