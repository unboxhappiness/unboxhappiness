/* ─── Hamburger ─── */
const ham=document.getElementById('ham');
const mobileMenu=document.getElementById('mobileMenu');
ham.addEventListener('click',()=>{ham.classList.toggle('open');mobileMenu.classList.toggle('open');});
function closeMobile(){ham.classList.remove('open');mobileMenu.classList.remove('open');}
document.addEventListener('click',e=>{if(!ham.contains(e.target)&&!mobileMenu.contains(e.target))closeMobile();});

/* ─── Reveal on scroll ─── */
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ─── Stagger animation ─── */
document.querySelectorAll('.problem-card,.aud-card-new,.aud-card-sm,.offer-card,.why-card').forEach((el,i)=>{
  el.style.transitionDelay=`${Math.min(i*0.06,0.48)}s`;
});

/* ─── Tab switch (Products / Services) ─── */
function switchTab(tab,btn){
  document.querySelectorAll('.offer-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.offer-panel').forEach(p=>p.classList.remove('active'));
  (btn||document.getElementById('tab-'+tab)).classList.add('active');
  const panel=document.getElementById('panel-'+tab);
  panel.classList.add('active');
  panel.querySelectorAll('.offer-card').forEach((el,i)=>{
    el.style.opacity='0';el.style.transform='translateY(16px)';
    setTimeout(()=>{el.style.transition='opacity .35s ease,transform .35s ease';el.style.opacity='1';el.style.transform='translateY(0)';},i*45);
  });
}

/* ─── showTab: called from nav/footer links ─── */
function showTab(tab){
  setTimeout(()=>switchTab(tab),100);
}

/* ─── Form submit ─── */
async function submitForm(){
  const name=document.getElementById('fname').value.trim();
  const phone=document.getElementById('fphone').value.trim();
  const biz=document.getElementById('fbiz').value;
  const city=document.getElementById('fcity').value.trim();
  const msg=document.getElementById('fmsg').value.trim();
  if(!name||!phone){showToast('⚠️ Please enter name and mobile number.');return;}
  try{
    await fetch('https://formspree.io/f/mlgadgvo',{method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({name,phone,business:biz,city,message:msg})});
  }catch(e){}
  showToast('✅ Received! Opening WhatsApp now...');
  const wa=encodeURIComponent(`Hello Unbox Happiness! 🎁\n\nNaam: ${name}\nPhone: ${phone}\nBusiness: ${biz||'Not specified'}\nCity: ${city||'Not specified'}\nMessage: ${msg||'Brand enquiry'}`);
  setTimeout(()=>window.open(`https://wa.me/919203593522?text=${wa}`,'_blank'),800);
}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);}
