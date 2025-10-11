(function() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', isDark);

  // Ensure favicon is present on every page
  (function ensureFavicon(){
    const existing = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    const href = 'assets/ikman-logo-mark.svg';
    if (!existing) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'icon');
      link.setAttribute('type', 'image/svg+xml');
      link.setAttribute('href', href);
      document.head.appendChild(link);
      const shortcut = document.createElement('link');
      shortcut.setAttribute('rel', 'shortcut icon');
      shortcut.setAttribute('href', href);
      document.head.appendChild(shortcut);
    }
  })();

  function setTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(btn => {
      btn.setAttribute('aria-pressed', String(dark));
      btn.innerHTML = dark ? '☀️' : '🌙';
    });
  }

  document.addEventListener('click', function(e) {
    const toggle = e.target.closest('[data-theme-toggle]');
    if (toggle) { setTheme(!document.documentElement.classList.contains('dark')); }

    const favBtn = e.target.closest('[data-fav-id]');
    if (favBtn) {
      const id = favBtn.getAttribute('data-fav-id');
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const idx = favorites.indexOf(id);
      if (idx >= 0) { favorites.splice(idx,1); favBtn.classList.remove('active'); }
      else { favorites.push(id); favBtn.classList.add('active'); }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  });

  // Mobile bottom nav active state
  const setActiveMobileNav = () => {
    const path = location.pathname.split('/').pop();
    document.querySelectorAll('.mobile-bottom-nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href.endsWith(path));
    });
  };
  window.addEventListener('DOMContentLoaded', setActiveMobileNav);

  // Simple cart helpers using localStorage
  const CART_KEY = 'cart:items';
  function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); } catch { return []; } }
  function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); updateCartBadge(); }
  function addToCart(item){ const items = getCart(); const found = items.find(i=>i.id===item.id); if(found){ found.qty += 1; } else { items.push({ ...item, qty:1 }); } saveCart(items); }
  function removeFromCart(id){ const items = getCart().filter(i=>i.id!==id); saveCart(items); }
  function updateQty(id, q){ const items = getCart(); const it = items.find(i=>i.id===id); if(it){ it.qty = Math.max(1, q); saveCart(items); } }
  function clearCart(){ saveCart([]); }
  function updateCartBadge(){ const c = document.getElementById('cart-count'); if(!c) return; const n = getCart().reduce((a,b)=>a+b.qty,0); c.textContent = n; c.style.display = n>0? 'inline-flex' : 'none'; }
  window.addEventListener('DOMContentLoaded', updateCartBadge);

  // AI-like search suggestions (mock)
  function initSearch(selectorInput, selectorList) {
    const input = document.querySelector(selectorInput);
    const list = document.querySelector(selectorList);
    if (!input || !list) return;
    const sample = ['iPhone 14', 'Hybrid car', 'Laptop i7', 'Sofa set', 'House in Colombo', 'Motorbike', 'AC Inverter', 'Gaming PC', 'Tutor', 'Delivery Job'];
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      list.innerHTML = '';
      if (!q) { list.classList.add('hidden'); return; }
      const matches = sample.filter(s => s.toLowerCase().includes(q)).slice(0, 6);
      matches.forEach(m => {
        const item = document.createElement('div');
        item.className = 'suggest-item';
        item.textContent = m;
        item.tabIndex = 0;
        item.addEventListener('click', () => { input.value = m; list.classList.add('hidden'); });
        list.appendChild(item);
      });
      list.classList.toggle('hidden', matches.length === 0);
    });
    document.addEventListener('click', (ev) => { if (!ev.target.closest('.search-wrap')) list.classList.add('hidden'); });
  }
  window.AppCore = { setTheme, initSearch, addToCart, getCart, removeFromCart, updateQty, clearCart, updateCartBadge };
})();


