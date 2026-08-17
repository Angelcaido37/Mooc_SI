
(()=>{
 document.documentElement.dataset.nexusAccessibility='18';
 document.querySelectorAll('img:not([alt])').forEach(img=>img.setAttribute('alt',''));
 document.querySelectorAll('button:not([type])').forEach(b=>b.type='button');
 document.querySelectorAll('main').forEach(m=>{if(!m.id)m.id='main';});
 const status=document.createElement('div');status.id='nexusA11yStatus';status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.appendChild(status);
 window.NEXUS_A11Y_ANNOUNCE=(msg)=>{status.textContent='';setTimeout(()=>status.textContent=String(msg||''),25)};
})();
