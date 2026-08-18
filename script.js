const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Biblioteca BManager — popup + Google Sheets (Apps Script)
const LEADS_ENDPOINT='https://script.google.com/macros/s/AKfycby7FOgs-FHnRqqFP6uxAGNxe8vyDkK1xX_hXjZVUc6lUSsj9QvqK38c1xzwDE8oLCGJ/exec';
const leadModal=document.querySelector('#lead-modal');
const leadForm=document.querySelector('#lead-form');
const leadName=document.querySelector('#lead-name');
const leadEmail=document.querySelector('#lead-email');
const leadMaterial=document.querySelector('#lead-material');
const leadFeedback=document.querySelector('#lead-feedback');
let pendingDownload='';

function openLeadModal(button){
  pendingDownload=button.dataset.file||'';
  leadMaterial.value=button.dataset.material||'';
  leadFeedback.textContent='';
  leadModal.classList.add('open');
  leadModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  setTimeout(()=>leadName.focus(),50);
}
function closeLeadModal(){
  leadModal.classList.remove('open');
  leadModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
function startDownload(file){
  const a=document.createElement('a');
  a.href=file;
  a.download='';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

document.querySelectorAll('.lead-download').forEach(button=>button.addEventListener('click',()=>openLeadModal(button)));
document.querySelectorAll('[data-close-lead-modal]').forEach(el=>el.addEventListener('click',closeLeadModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&leadModal?.classList.contains('open'))closeLeadModal()});

leadForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!leadForm.reportValidity())return;
  const submit=leadForm.querySelector('.lead-submit');
  submit.disabled=true;
  submit.textContent='Liberando...';
  leadFeedback.textContent='';
  const payload={
    nome:leadName.value.trim(),
    email:leadEmail.value.trim(),
    material:leadMaterial.value
  };
  try{
    await fetch(LEADS_ENDPOINT,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(payload)
    });
    if(typeof gtag==='function')gtag('event','download_material',{material:payload.material});
    leadFeedback.textContent='Pronto! Seu download vai começar.';
    startDownload(pendingDownload);
    setTimeout(()=>{closeLeadModal();leadForm.reset();},700);
  }catch(error){
    leadFeedback.textContent='Não foi possível liberar o download. Tente novamente.';
  }finally{
    submit.disabled=false;
    submit.textContent='Liberar download ↓';
  }
});
