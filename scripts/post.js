(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const r = await fetch(el.getAttribute('data-include')); el.innerHTML = await r.text(); }); }
  let current = 1; const total = 4;
  function setStep(n){
    current = Math.max(1, Math.min(total, n));
    document.querySelectorAll('.step').forEach(s => s.classList.toggle('hidden', Number(s.getAttribute('data-step')) !== current));
    const bar = document.getElementById('bar'); if(bar) bar.style.width = ((current-1)/(total-1))*100 + '%';
    const prev = document.getElementById('prev'); const next = document.getElementById('next');
    if(prev) prev.disabled = current===1;
    if(next) next.textContent = current===total? 'Publish' : 'Next';
  }
  function onFiles(files){
    const preview = document.getElementById('preview'); if(!preview) return;
    Array.from(files).forEach(f => { const url = URL.createObjectURL(f); const img = document.createElement('img'); img.src=url; img.loading='lazy'; img.style.borderRadius='12px'; preview.appendChild(img); });
  }
  window.addEventListener('DOMContentLoaded', function(){
    includePartials();
    setStep(1);
    document.getElementById('prev').addEventListener('click', ()=> setStep(current-1));
    document.getElementById('next').addEventListener('click', ()=> {
      if (current===total) { alert('Ad published (mock)!'); location.href='profile.html'; return; }
      setStep(current+1);
    });
    const drop = document.getElementById('drop');
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.opacity='0.8'; });
    drop.addEventListener('dragleave', ()=> drop.style.opacity='1');
    drop.addEventListener('drop', e => { e.preventDefault(); drop.style.opacity='1'; onFiles(e.dataTransfer.files); });
    drop.addEventListener('click', ()=> { const input = document.createElement('input'); input.type='file'; input.accept='image/*'; input.multiple=true; input.onchange = ()=> onFiles(input.files); input.click(); });
  });
})();


