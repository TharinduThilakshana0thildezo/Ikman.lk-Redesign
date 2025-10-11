(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const res = await fetch(el.getAttribute('data-include')); el.innerHTML = await res.text(); }); }
  function wireCart(grid){
    if(!grid) return;
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-add-cart]'); if(!b) return;
      const card = b.closest('.listing-card'); if(!card) return;
      const payload = {
        id: card.getAttribute('data-id') || '',
        title: card.getAttribute('data-title') || (card.querySelector('.title')?.textContent?.trim() || ''),
        price: Number(card.getAttribute('data-price') || '0'),
        img: card.getAttribute('data-img') || (card.querySelector('img')?.getAttribute('src') || '')
      };
      if (window.AppCore && AppCore.addToCart) { AppCore.addToCart(payload); AppCore.updateCartBadge && AppCore.updateCartBadge(); b.textContent='Added'; setTimeout(()=> b.textContent='Add to Cart', 1000); }
    });
  }
  function initFilters(){
    document.querySelectorAll('[data-collapse]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-collapse');
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.classList.toggle('hidden');
        btn.querySelector('span').textContent = panel.classList.contains('hidden') ? '▸' : '▾';
      });
    });
    function fmt(v){ return Number(v).toLocaleString('en-LK', { style:'currency', currency:'LKR'}); }
    const min = document.getElementById('minPrice');
    const max = document.getElementById('maxPrice');
    const out = document.getElementById('priceDisplay');
    function updatePrice(){
      const a = min.value; const b = max.value;
      if(!a && !b) { out.textContent = 'Any price'; return; }
      if(a && b) { out.textContent = fmt(a)+' – '+fmt(b); return; }
      if(a) { out.textContent = 'From '+fmt(a); return; }
      if(b) { out.textContent = 'Up to '+fmt(b); return; }
    }
    [min,max].forEach(i=> i && i.addEventListener('input', updatePrice));
    updatePrice();
    const applyBtn = document.querySelector('aside .btn.btn-primary');
    // Live filter the location checklist
    const locSearch = document.getElementById('locationSearch');
    if (locSearch) {
      locSearch.addEventListener('input', () => {
        const q = locSearch.value.trim().toLowerCase();
        const labels = Array.from(document.querySelectorAll('#location .filter-body label'));
        labels.forEach(l => { const t = l.textContent.trim().toLowerCase(); l.style.display = t.includes(q) ? '' : 'none'; });
      });
    }
    applyBtn.addEventListener('click', () => {
      const urgent = document.querySelector('#urgent input[type="checkbox"]').checked;
      const poster = (document.querySelector('input[name="poster"]:checked')||{}).nextSibling?.textContent?.trim();
      const conditions = Array.from(document.querySelectorAll('#condition input[type="checkbox"]:checked')).map(x=>x.parentElement.textContent.trim());
      const locations = Array.from(document.querySelectorAll('#location input[type="checkbox"]:checked')).map(x=>x.parentElement.textContent.trim());
      const sellers = Array.from(document.querySelectorAll('#seller input[type="checkbox"]:checked')).map(x=>x.parentElement.textContent.trim());
      const cats = Array.from(document.querySelectorAll('#category input[type="checkbox"]:checked')).map(x=>x.parentElement.textContent.trim());
      const keyword = (document.getElementById('keyword')?.value || '').trim().toLowerCase();
      const minV = min.value? Number(min.value): -Infinity;
      const maxV = max.value? Number(max.value): Infinity;
      const cards = Array.from(document.querySelectorAll('#browse-grid .listing-card'));
      cards.forEach(card => {
        const vUrgent = card.hasAttribute('data-urgent');
        const vPoster = card.getAttribute('data-poster') || '';
        const vCondition = card.getAttribute('data-condition') || '';
        const vLocation = card.getAttribute('data-location') || '';
        const vSeller = card.getAttribute('data-seller') || '';
        const vCat = card.getAttribute('data-category') || '';
        const vPrice = Number(card.getAttribute('data-price') || '0');
        const vTitle = (card.getAttribute('data-title') || card.querySelector('.title')?.textContent || '').toLowerCase();
        const matches =
          (urgent? vUrgent : true) &&
          (poster? vPoster === poster : true) &&
          (conditions.length? conditions.includes(vCondition): true) &&
          (locations.length? locations.includes(vLocation): true) &&
          (sellers.length? sellers.includes(vSeller): true) &&
          (cats.length? cats.includes(vCat): true) &&
          (vPrice >= minV && vPrice <= maxV) &&
          (keyword? vTitle.includes(keyword) : true);
        card.style.display = matches ? '' : 'none';
      });
      paginate.apply();
    });
  }
  /* Pagination */
  const paginate = (function(){
    const state = { page: 1, perPage: 20 };
    function getItems(){ return Array.from(document.querySelectorAll('#browse-grid .listing-card')).filter(x=>x.style.display!== 'none'); }
    function pageCount(){ return Math.max(1, Math.ceil(getItems().length / state.perPage)); }
    function renderControls(){
      let bar = document.getElementById('pagination');
      if(!bar){
        bar = document.createElement('div');
        bar.id = 'pagination';
        bar.className = 'pagination luxury';
        const host = document.querySelector('#browse-grid');
        host && host.insertAdjacentElement('afterend', bar);
      }
      bar.innerHTML = '';
      const totalReal = pageCount();
      const total = Math.max(totalReal, 10);
      const makeBtn = (label, page, disabled=false, active=false, kind='num')=>{
        const b = document.createElement('button');
        b.className = 'page-btn' + (active? ' active':'') + (kind!=='num' ? ' nav' : '');
        b.textContent = label;
        if(disabled || page>totalReal){ b.setAttribute('disabled',''); }
        b.addEventListener('click', ()=> { if(disabled || page>totalReal) return; state.page = page; apply(); });
        return b;
      };
      // First / Prev
      bar.appendChild(makeBtn('«', 1, state.page===1, false, 'nav'));
      bar.appendChild(makeBtn('⟨', Math.max(1, state.page-1), state.page===1, false, 'nav'));
      // show exactly up to 5 page numbers centered around current, with ellipses if needed
      const totalToShow = 5;
      const half = Math.floor(totalToShow/2);
      let start = Math.max(1, state.page - half);
      let end = Math.min(total, start + totalToShow - 1);
      start = Math.max(1, end - totalToShow + 1);
      if (start > 1) {
        bar.appendChild(makeBtn('1', 1, false, state.page===1));
        if (start > 2) {
          const dots = document.createElement('span'); dots.className='sep'; dots.textContent='…'; bar.appendChild(dots);
        }
      }
      for(let i=start;i<=end;i++) bar.appendChild(makeBtn(String(i), i, false, i===state.page));
      if (end < total) {
        if (end < total-1) {
          const dots = document.createElement('span'); dots.className='sep'; dots.textContent='…'; bar.appendChild(dots);
        }
        bar.appendChild(makeBtn(String(total), total, false, state.page===total));
      }
      // Next / Last
      bar.appendChild(makeBtn('⟩', Math.min(total, state.page+1), state.page>=totalReal, false, 'nav'));
      bar.appendChild(makeBtn('»', total, state.page>=totalReal, false, 'nav'));
    }
    function apply(){
      const items = getItems();
      const total = pageCount();
      if(state.page>total) state.page = total;
      const start = (state.page-1)*state.perPage;
      const end = start + state.perPage;
      items.forEach((el, idx)=>{ el.style.display = (idx>=start && idx<end) ? '' : 'none'; });
      renderControls();
    }
    return { apply, state };
  })();
  window.addEventListener('DOMContentLoaded', function(){ includePartials(); wireCart(document.getElementById('browse-grid')); initFilters(); paginate.apply(); });
})();


