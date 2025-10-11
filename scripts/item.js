(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const r = await fetch(el.getAttribute('data-include')); el.innerHTML = await r.text(); }); }
  window.addEventListener('DOMContentLoaded', function(){
    includePartials();
    const root = document.querySelector('main .grid');
    const buy = document.getElementById('buyNow');
    if (buy) buy.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = root?.getAttribute('data-id') || '';
      const title = document.getElementById('item-title')?.textContent?.trim() || '';
      const priceNum = Number(root?.getAttribute('data-price') || '0');
      location.href = `buy.html?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&price=${encodeURIComponent(priceNum)}`;
    });

    // Add to cart
    const addCart = document.getElementById('addToCart');
    if (addCart) addCart.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = root?.getAttribute('data-id') || '';
      const title = document.getElementById('item-title')?.textContent?.trim() || '';
      const priceNum = Number((document.getElementById('item-price')?.textContent||'').replace(/[^0-9]/g,'')) || Number(root?.getAttribute('data-price')||0);
      const img = document.querySelector('#gallery img')?.getAttribute('src') || '';
      if (window.AppCore && window.AppCore.addToCart) window.AppCore.addToCart({ id, title, price: priceNum, img });
      addCart.classList.add('active');
      addCart.innerHTML = '✓ Added to cart';
      setTimeout(()=>{ addCart.classList.remove('active'); addCart.innerHTML = '<span class="icon">🛒</span>Add to cart'; }, 1500);
    });
    // Build luxury similar ads carousel in sidebar if placeholder exists
    const similarHost = document.getElementById('similar-host');
    if (similarHost) {
      // Detect category from breadcrumbs or page context
      const crumbs = Array.from(document.querySelectorAll('.breadcrumbs a')).map(a => (a.getAttribute('href')||'').toLowerCase()).join(' ');
      const isVehicles = /cat-vehicles|vehicles/.test(crumbs);
      const isElectronics = /cat-electronics|electronics/.test(crumbs);
      const isProperty = /cat-property|property/.test(crumbs);
      const isMobiles = /cat-mobiles|mobiles/.test(crumbs);
      const isFashion = /cat-fashion|fashion/.test(crumbs);

      // Curated pools using your existing images
      const poolVehicles = [
        { href: 'feat-6.html', img: 'Img/veh1.jpg', title: 'Toyota Aqua 2018', km: '75,000 km', city: 'Colombo', price: 'Rs 4,750,000', days: '14 days' },
        { href: 'feat-1.html', img: 'Img/audi 1.jpg', title: 'Audi Q7 2025', km: 'Delivery km', city: 'Colombo', price: 'Rs 74,500,000', days: '2 days' },
        { href: '#', img: 'Img/Toyota Premio.jpg', title: 'Toyota Premio', km: '82,000 km', city: 'Gampaha', price: 'Rs 10,800,000', days: '17 days' },
        { href: '#', img: 'Img/Suzuki Alto.jpg', title: 'Suzuki Alto', km: '45,000 km', city: 'Kandy', price: 'Rs 3,450,000', days: '9 days' },
        { href: '#', img: 'Img/Nissan GT-R black edition 2024.jpg', title: 'Nissan GT-R 2024', km: '12,000 km', city: 'Colombo', price: 'Rs 59,500,000', days: '5 days' },
        { href: '#', img: 'Img/TOYOTA LAND CRUISER SAHARA LC 300 2024.jpg', title: 'Land Cruiser LC300', km: '8,000 km', city: 'Colombo', price: 'Rs 185,000,000', days: '7 days' }
      ];
      const poolElectronics = [
        { href: 'feat-2.html', img: 'Img/i5 4th Gen Desktop Full set Pc.jpg', title: 'i5 Desktop Full Set', km: '', city: 'Anuradhapura', price: 'Rs 50,000', days: '1 day' },
        { href: '#', img: 'Img/Samsung Galaxy S24 Ultra.jpg', title: 'Galaxy S24 Ultra', km: '', city: 'Colombo', price: 'Rs 325,000', days: '12 days' },
        { href: '#', img: 'Img/Google Pixel 8 Pro.jpg', title: 'Google Pixel 8 Pro', km: '', city: 'Kandy', price: 'Rs 260,000', days: '8 days' },
        { href: '#', img: 'Img/Xiaomi 14 Pro.jpg', title: 'Xiaomi 14 Pro', km: '', city: 'Galle', price: 'Rs 245,000', days: '10 days' }
      ];
      const poolProperty = [
        { href: 'feat-3.html', img: 'Img/Shop for Rent.jpg', title: 'Shop for Rent – Angoda', km: '', city: 'Colombo', price: 'Rs 22,000 /month', days: '3 days' },
        { href: '#', img: 'Img/Shop1.jpg', title: 'Retail Space – City Centre', km: '', city: 'Colombo', price: 'Rs 180,000 /month', days: '6 days' },
        { href: '#', img: 'Img/Shop3.jpg', title: 'Corner Shop – High Footfall', km: '', city: 'Maharagama', price: 'Rs 95,000 /month', days: '11 days' }
      ];
      const poolMobiles = [
        { href: 'feat-5.html', img: 'Img/Honor X9c (Used).jpg', title: 'Honor X9c (Used)', km: '', city: 'Colombo', price: 'Rs 67,500', days: '4 days' },
        { href: '#', img: 'Img/iPhone 13 Pro.jpg', title: 'iPhone 13 Pro', km: '', city: 'Colombo', price: 'Rs 215,000', days: '9 days' },
        { href: '#', img: 'Img/OnePlus 12.jpg', title: 'OnePlus 12', km: '', city: 'Gampaha', price: 'Rs 195,000', days: '13 days' },
        { href: '#', img: 'Img/Realme GT 6.jpg', title: 'Realme GT 6', km: '', city: 'Kandy', price: 'Rs 159,000', days: '7 days' }
      ];
      const poolFashion = [
        { href: 'feat-4.html', img: 'Img/Diesel Timeframe Daddy Watch.jpg', title: 'Diesel Daddy Watch', km: '', city: 'Colombo', price: 'Rs 79,900', days: '1 day' },
        { href: '#', img: 'Img/watch3.jpg', title: 'Chrono Steel Watch', km: '', city: 'Kotte', price: 'Rs 54,900', days: '6 days' },
        { href: '#', img: 'Img/watch4.jpg', title: 'Vintage Leather Watch', km: '', city: 'Nugegoda', price: 'Rs 39,900', days: '9 days' }
      ];

      const data = isVehicles ? poolVehicles : isElectronics ? poolElectronics : isProperty ? poolProperty : isMobiles ? poolMobiles : isFashion ? poolFashion : (poolVehicles.concat(poolElectronics)).slice(0,6);

      // Carousel structure
      const wrap = document.createElement('section');
      wrap.className = 'similar-lux';
      wrap.innerHTML = `
        <div class="sim-head">
          <div class="sim-title">Similar ads</div>
          <div class="sim-nav">
            <button class="sim-arrow prev" aria-label="Previous">‹</button>
            <button class="sim-arrow next" aria-label="Next">›</button>
          </div>
        </div>
        <div class="sim-viewport">
          <div class="sim-track"></div>
        </div>
        <div class="sim-dots" role="tablist"></div>
      `;
      const track = wrap.querySelector('.sim-track');

      // Build slides: 2 cards per row, 2 rows per slide (like grid of 4)
      const chunk = (arr, size) => arr.reduce((acc,_,i)=> (i%size? acc : acc.concat([arr.slice(i,i+size)])), []);
      const slides = chunk(data, 4);
      slides.forEach((group, idx) => {
        const slide = document.createElement('div');
        slide.className = 'sim-slide';
        slide.setAttribute('data-index', String(idx));
        slide.innerHTML = group.map(item => (
          `<a class="sim-card" href="${item.href}">
            <img class="thumb" src="${item.img}" alt="${item.title}">
            <div class="info">
              <div class="title">${item.title}</div>
              <div class="sub">${item.km ? item.km + ' · ' : ''}${item.city}</div>
              <div class="price">${item.price}</div>
              <div class="age">${item.days}</div>
            </div>
          </a>`
        )).join('');
        track.appendChild(slide);
      });

      // Dots
      const dots = wrap.querySelector('.sim-dots');
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'dot' + (i===0 ? ' active' : '');
        b.setAttribute('aria-label', `Go to slide ${i+1}`);
        b.addEventListener('click', () => go(i));
        dots.appendChild(b);
      });

      let current = 0;
      function go(i){
        current = Math.max(0, Math.min(slides.length-1, i));
        const offset = -current * 100;
        track.style.transform = `translateX(${offset}%)`;
        dots.querySelectorAll('.dot').forEach((d,idx)=>d.classList.toggle('active', idx===current));
      }
      wrap.querySelector('.sim-arrow.prev').addEventListener('click', () => go(current-1));
      wrap.querySelector('.sim-arrow.next').addEventListener('click', () => go(current+1));
      go(0);

      similarHost.replaceWith(wrap);
    }
  });
})();


