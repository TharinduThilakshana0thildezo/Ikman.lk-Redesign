(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const r = await fetch(el.getAttribute('data-include')); el.innerHTML = await r.text(); }); }

  const seed = [
    { id:'t1', name:'Ruwan Perera', last:'Is this still available?', avatar:'🧑' },
    { id:'t2', name:'Nisha Fernando', last:'Can you deliver?', avatar:'👩' },
    { id:'t3', name:'Sameera', last:'Can I see more photos?', avatar:'🧔' },
    { id:'t4', name:'Kalpa', last:'What is the final price?', avatar:'👨' },
    { id:'t5', name:'Ishara', last:'Where can we meet?', avatar:'👩‍💼' },
    { id:'t6', name:'Dinesh', last:'Available today?', avatar:'👨‍🔧' }
  ];
  let active = seed[0].id;
  const state = { typingTimer:null };
  const msgs = JSON.parse(localStorage.getItem('chat:'+active) || '[]');

  function formatTime(d){ const h = d.getHours().toString().padStart(2,'0'); const m = d.getMinutes().toString().padStart(2,'0'); return `${h}:${m}`; }

  function renderHeader(){
    const t = seed.find(s=>s.id===active);
    const name = document.getElementById('convName');
    const status = document.getElementById('convStatus');
    const avatar = document.getElementById('convAvatar');
    if (t && name && status && avatar){ name.textContent = t.name; status.textContent = 'Online'; avatar.textContent = t.avatar; }
  }

  function render(){
    const list = document.getElementById('msgs');
    list.innerHTML = msgs.map(m => {
      const ts = formatTime(new Date(m.ts||Date.now()));
      const read = m.me ? (m.read? ' · ✓✓' : ' · ✓') : '';
      return `<div class="msg ${m.me?'sent':'received'}">
        <div class="text">${m.text}</div>
        <div class="meta"><span>${ts}</span>${m.me?`<span>${read}</span>`:''}</div>
      </div>`;
    }).join('');
    list.scrollTop = list.scrollHeight;
  }

  function persist(){ localStorage.setItem('chat:'+active, JSON.stringify(msgs)); }

  function autoReply(userText){
    const typing = document.getElementById('typing');
    typing.classList.remove('hidden');
    clearTimeout(state.typingTimer);
    state.typingTimer = setTimeout(()=>{
      typing.classList.add('hidden');
      const reply = generateReply(userText);
      msgs.push({ me:false, text: reply, ts: Date.now() });
      // mark last outgoing as read
      for(let i=msgs.length-1;i>=0;i--){ if(msgs[i].me){ msgs[i].read = true; break; } }
      render();
      persist();
    }, 700 + Math.min(1200, userText.length*20));
  }

  function generateReply(text){
    const canned = [
      'Thanks for your message! I will get back to you shortly.',
      'Yes, it is available right now.',
      'Price is negotiable within reason 🙂',
      'We can arrange delivery or pickup depending on your location.',
      'I am in Colombo 05. Where are you based?',
      'Sure, I can share more photos in the chat.',
      'I can hold it for you for 24 hours with a small advance.',
      'If you like, we can schedule a quick call.',
      'Cash or bank transfer accepted. Receipts provided.',
      'This item has a 7-day checking warranty.'
    ];
    // Keywords first
    const lower = text.toLowerCase();
    if (lower.includes('price') || lower.includes('discount')) return canned[2];
    if (lower.includes('available')) return canned[1];
    if (lower.includes('deliver') || lower.includes('pickup')) return canned[3];
    if (lower.includes('where') || lower.includes('location')) return canned[4];
    // Otherwise random
    return canned[Math.floor(Math.random()*canned.length)];
  }

  function resizeTextarea(el){ el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 160) + 'px'; }

  window.addEventListener('DOMContentLoaded', function(){
    includePartials();
    const threads = document.getElementById('threads');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.querySelector('.sidebar');
    seed.forEach(t => {
      const row = document.createElement('div');
      row.className = 'thread';
      row.dataset.id = t.id;
      row.innerHTML = `<div class="avatar">${t.avatar}</div><div class="t-main"><div class="t-top"><strong>${t.name}</strong><time class="t-time">${formatTime(new Date())}</time></div><div class="muted meta">${t.last}</div></div><span class="unread">${Math.floor(Math.random()*3)}</span>`;
      threads.appendChild(row);
    });
    function openSidebar(){ if(sidebar){ sidebar.classList.add('open'); if(overlay){ overlay.hidden = false; } } }
    function closeSidebar(){ if(sidebar){ sidebar.classList.remove('open'); if(overlay){ overlay.hidden = true; } } }
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    const search = document.getElementById('searchThreads');
    if (search) search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      Array.from(threads.children).forEach(ch => { const name = ch.querySelector('strong')?.textContent.toLowerCase() || ''; ch.style.display = name.includes(q) ? '' : 'none'; });
    });
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) clearSearch.addEventListener('click', () => { if(search){ search.value=''; search.dispatchEvent(new Event('input')); search.focus(); } });
    // Quick filter (all/unread)
    threads.parentElement?.querySelectorAll('.chip[data-filter]').forEach(chip => chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-filter');
      Array.from(threads.children).forEach(row => {
        const unread = parseInt(row.querySelector('.unread')?.textContent||'0',10);
        row.style.display = (type==='unread' ? unread>0 : true) ? '' : 'none';
      });
    }));
    renderHeader();
    render();

    const form = document.getElementById('composer');
    const input = document.getElementById('m');
    const emojiBtn = document.getElementById('emojiBtn');
    const attachBtn = document.getElementById('attachBtn');
    const infoBtn = document.getElementById('infoBtn');
    const closeDetails = document.getElementById('closeDetails');
    const detailsPane = document.getElementById('detailsPane');
    const voiceCallBtn = document.getElementById('voiceCallBtn');
    const videoCallBtn = document.getElementById('videoCallBtn');
    const pinBtn = document.getElementById('pinBtn');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = input.value.trim(); if(!text) return;
      msgs.push({ me:true, text, ts: Date.now(), read:false });
      render();
      persist();
      input.value=''; resizeTextarea(input); input.focus();
      autoReply(text);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });
    input.addEventListener('input', () => resizeTextarea(input));

    emojiBtn.addEventListener('click', () => { input.value += (input.value && !input.value.endsWith(' ')?' ':'') + '🙂'; input.focus(); resizeTextarea(input); });
    attachBtn.addEventListener('click', () => alert('Attachments are not implemented in this demo.'));
    if (infoBtn && detailsPane) infoBtn.addEventListener('click', () => { detailsPane.hidden = !detailsPane.hidden; });
    if (closeDetails && detailsPane) closeDetails.addEventListener('click', () => { detailsPane.hidden = true; });
    if (voiceCallBtn) voiceCallBtn.addEventListener('click', () => alert('Starting voice call…'));
    if (videoCallBtn) videoCallBtn.addEventListener('click', () => alert('Starting video call…'));
    if (pinBtn) pinBtn.addEventListener('click', () => alert('Chat pinned.'));

    threads.addEventListener('click', e => {
      const row = e.target.closest('.thread'); if(!row) return; active = row.dataset.id; const m = JSON.parse(localStorage.getItem('chat:'+active) || '[]'); msgs.length=0; msgs.push(...m); renderHeader(); render(); const badge = row.querySelector('.unread'); if (badge) badge.textContent='0';
      threads.querySelectorAll('.thread').forEach(el => el.classList.toggle('active', el===row));
      closeSidebar();
    });
  });
})();


