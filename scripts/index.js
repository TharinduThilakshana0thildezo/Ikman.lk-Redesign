// Home page logic: include partials, populate featured and recommended
(function() {
  function includePartials() {
    document.querySelectorAll('[data-include]').forEach(async el => {
      const url = el.getAttribute('data-include');
      const res = await fetch(url);
      el.innerHTML = await res.text();
    });
  }
  function wireAddToCart(container){
    if(!container) return;
    container.addEventListener('click', e => {
      const button = e.target.closest('[data-add-cart]');
      if (!button) return;
      const card = button.closest('.listing-card');
      if (!card) return;
      const payload = {
        id: card.getAttribute('data-id') || '',
        title: card.getAttribute('data-title') || (card.querySelector('.title')?.textContent?.trim() || ''),
        price: Number(card.getAttribute('data-price') || '0'),
        img: card.getAttribute('data-img') || (card.querySelector('img')?.getAttribute('src') || '')
      };
      if (window.AppCore && AppCore.addToCart) {
        AppCore.addToCart(payload);
        AppCore.updateCartBadge && AppCore.updateCartBadge();
        button.textContent = 'Added';
        setTimeout(()=> button.textContent='Add to Cart', 1000);
      }
    });
  }
  window.addEventListener('DOMContentLoaded', () => {
    includePartials();
    wireAddToCart(document.getElementById('featured-grid'));
    wireAddToCart(document.getElementById('recommend-grid'));
  });
})();


