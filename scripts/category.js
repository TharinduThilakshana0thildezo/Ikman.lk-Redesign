(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const r = await fetch(el.getAttribute('data-include')); el.innerHTML = await r.text(); }); }
  window.addEventListener('DOMContentLoaded', function(){
    includePartials();
    const paginate = (function(){
      const state = { page: 1, perPage: 20 };
      function getItems(){ return Array.from(document.querySelectorAll('#cat-grid .listing-card')); }
      function pageCount(){ return Math.max(1, Math.ceil(getItems().length / state.perPage)); }
      function renderControls(){
        let bar = document.getElementById('pagination');
        if(!bar){
          bar = document.createElement('div');
          bar.id = 'pagination';
          bar.className = 'pagination luxury';
          const host = document.querySelector('#cat-grid');
          host && host.insertAdjacentElement('afterend', bar);
        }
        bar.innerHTML = '';
        const totalReal = pageCount();
        const total = Math.max(totalReal, 10);
        const mk = (label, page, disabled=false, active=false, kind='num')=>{
          const b = document.createElement('button'); b.className = 'page-btn'+(active?' active':'') + (kind!=='num' ? ' nav' : ''); b.textContent = label;
          if(disabled || page>totalReal) b.setAttribute('disabled','');
          b.addEventListener('click', ()=>{ if(disabled || page>totalReal) return; state.page = page; apply(); });
          return b;
        };
        // First / Prev
        bar.appendChild(mk('«', 1, state.page===1, false, 'nav'));
        bar.appendChild(mk('⟨', Math.max(1, state.page-1), state.page===1, false, 'nav'));
        // 5 numbered pages with ellipses, but visually pad to 10 total pages
        const totalToShow = 5; const half = Math.floor(totalToShow/2);
        let start = Math.max(1, state.page - half); let end = Math.min(total, start + totalToShow - 1); start = Math.max(1, end - totalToShow + 1);
        if (start > 1) { bar.appendChild(mk('1', 1, false, state.page===1)); if (start > 2) { const d=document.createElement('span'); d.className='sep'; d.textContent='…'; bar.appendChild(d); } }
        for(let i=start;i<=end;i++) bar.appendChild(mk(String(i), i, false, i===state.page));
        if (end < total) { if (end < total-1) { const d=document.createElement('span'); d.className='sep'; d.textContent='…'; bar.appendChild(d); } bar.appendChild(mk(String(total), total, false, state.page===total)); }
        // Next / Last
        bar.appendChild(mk('⟩', Math.min(total, state.page+1), state.page>=totalReal, false, 'nav'));
        bar.appendChild(mk('»', total, state.page>=totalReal, false, 'nav'));
      }
      function apply(){
        const items = getItems(); const total = pageCount(); if(state.page>total) state.page = total;
        const start = (state.page-1)*state.perPage; const end = start + state.perPage;
        items.forEach((el, idx)=>{ el.style.display = (idx>=start && idx<end) ? '' : 'none'; });
        renderControls();
      }
      return { apply };
    })();
    paginate.apply();
  });
})();


