(function(){
  function includePartials(){ document.querySelectorAll('[data-include]').forEach(async el => { const r = await fetch(el.getAttribute('data-include')); el.innerHTML = await r.text(); }); }
  function swapTab(name){
    document.querySelectorAll('.tab').forEach(t=>{ const on = t.getAttribute('data-tab')===name; t.classList.toggle('active', on); t.setAttribute('aria-selected', String(on)); });
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('hidden', p.getAttribute('data-panel')!==name));
  }
  function validateEmail(v){ return /.+@.+\..+/.test(v); }
  function getRemembered(){ try { return JSON.parse(localStorage.getItem('remember')||'null'); } catch { return null; } }
  function setRemembered(id){ localStorage.setItem('remember', JSON.stringify(id)); }

  window.addEventListener('DOMContentLoaded', function(){
    includePartials();

    // Tabs
    document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click', ()=> swapTab(t.getAttribute('data-tab'))));

    // Remembered ID
    const remembered = getRemembered();
    if (remembered && document.getElementById('login-id')) { document.getElementById('login-id').value = remembered; document.getElementById('remember').checked = true; }

    // Show/Hide password
    const pass = document.getElementById('login-pass');
    const toggle = document.getElementById('togglePass');
    if (toggle && pass) toggle.addEventListener('click', ()=> { pass.type = pass.type==='password'?'text':'password'; });

    // Login submit (mock)
    const flog = document.getElementById('form-login');
    if (flog) flog.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('login-id').value.trim();
      const pw = document.getElementById('login-pass').value;
      const error = document.getElementById('login-error');
      const ok = (id && pw.length>=4 && (validateEmail(id) || /^(07|\+94)/.test(id)));
      if (!ok) { error.style.display='block'; return; }
      error.style.display='none';
      if (document.getElementById('remember').checked) setRemembered(id); else localStorage.removeItem('remember');
      alert('Logged in (mock). Redirecting to profile...');
      location.href = 'profile.html';
    });

    // Register submit (mock)
    const freg = document.getElementById('form-register');
    if (freg) freg.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-pass').value;
      if (!validateEmail(email) || pass.length < 8) { alert('Please check your details.'); return; }
      alert('Account created (mock). You can now log in.');
      swapTab('login');
      document.getElementById('login-id').value = email;
    });

    // Social buttons (mock)
    document.querySelectorAll('[data-social]').forEach(b=>b.addEventListener('click', ()=> alert('Social login via '+b.getAttribute('data-social')+' (mock)')));

    // Forgot password (mock)
    const forgot = document.getElementById('forgot');
    if (forgot) forgot.addEventListener('click', (e)=>{ e.preventDefault(); const id = prompt('Enter your email to reset password:'); if (id) alert('Reset link sent to '+id+' (mock).'); });
  });
})();


