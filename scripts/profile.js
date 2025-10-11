(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const r = await fetch(el.getAttribute('data-include')); el.innerHTML = await r.text(); }); }
  const myAds = Array.from({length:6}).map((_,i)=>({ id:'my-'+i, title: 'My Item '+(i+1), price: ((i+1)*15000).toLocaleString('en-LK',{style:'currency',currency:'LKR'}), location: 'Colombo', img: 'https://picsum.photos/seed/my'+i+'/600/400' }));
  const card = item => `
    <a class="listing-card fade-in" href="item.html?id=${item.id}">
      <img class="thumb" loading="lazy" src="${item.img}" alt="${item.title}" />
      <div class="content"><div class="title">${item.title}</div><div class="meta"><span>${item.price}</span><span>${item.location}</span></div></div>
    </a>`;
  window.addEventListener('DOMContentLoaded', function(){
    includePartials();
    document.getElementById('ads').innerHTML = myAds.map(card).join('');
    document.getElementById('ad-count').textContent = myAds.length;
    const favs = JSON.parse(localStorage.getItem('favorites')||'[]');
    document.getElementById('fav-count').textContent = favs.length;
  });
})();


