/* ============================================================
   MASSON HOMES — MAIN SCRIPT
   ============================================================ */

// Nav scroll state
(function(){
  var nav = document.getElementById('nav');
  if(!nav) return;
  function update(){ nav.classList.toggle('scrolled', window.scrollY > 40); }
  update();
  window.addEventListener('scroll', update, {passive:true});
})();

// Mobile nav toggle — with focus trap and escape-to-close
(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(!toggle || !links) return;

  function closeMenu(){
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu(){
    links.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    // Focus first link in menu for keyboard users
    var firstLink = links.querySelector('a');
    if(firstLink) firstLink.focus();
  }

  toggle.addEventListener('click', function(){
    if(links.classList.contains('open')) closeMenu();
    else openMenu();
  });

  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && links.classList.contains('open')){
      closeMenu();
      toggle.focus();
    }
  });

  // Focus trap: when menu is open and user tabs past last link, wrap to first (and vice versa)
  links.addEventListener('keydown', function(e){
    if(e.key !== 'Tab' || !links.classList.contains('open')) return;
    var focusable = Array.prototype.slice.call(links.querySelectorAll('a'));
    if(focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function(e){
    if(links.classList.contains('open') &&
       !links.contains(e.target) &&
       !toggle.contains(e.target)){
      closeMenu();
    }
  });
})();

// Savings calculator
(function(){
  var vi = document.getElementById('homeVal');
  var cr = document.getElementById('calcResults');
  var announce = document.getElementById('calcAnnounce');
  if(!vi || !cr) return;
  function fmt(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
  function feeInfo(v){
    // Returns {fee, label, note} — for homes above $1.5M, Reserve scales up
    if(v >= 1500000) return {fee: 13500, label: '$13,500+', note: 'Reserve pricing scales for homes above $1.5M — custom consultation recommended.'};
    if(v >= 800000)  return {fee: 11000, label: fmt(11000), note: ''};
    if(v >= 500000)  return {fee: 8000,  label: fmt(8000),  note: ''};
    return               {fee: 5500,  label: fmt(5500),  note: ''};
  }
  var announceTimer;
  vi.addEventListener('input', function(){
    var raw = this.value.replace(/[^0-9]/g, '');
    var noteEl = document.getElementById('rNote');
    if(raw){
      var n = parseInt(raw, 10);
      this.value = fmt(n);
      if(n >= 100000){
        var t = Math.round(n * 0.03);
        var info = feeInfo(n);
        var s = t - info.fee;
        document.getElementById('rTrad').textContent = fmt(t);
        document.getElementById('rFlat').textContent = info.label;
        document.getElementById('rSave').textContent = fmt(s > 0 ? s : 0);
        if(noteEl){
          noteEl.textContent = info.note;
          noteEl.style.display = info.note ? 'block' : 'none';
        }
        cr.classList.add('show');
        if(announce){
          clearTimeout(announceTimer);
          announceTimer = setTimeout(function(){
            announce.textContent =
              'On a home valued at ' + fmt(n) + ', ' +
              'you would save approximately ' + fmt(s > 0 ? s : 0) +
              ' compared to a traditional 3 percent listing commission.';
          }, 700);
        }
      } else {
        cr.classList.remove('show');
      }
    } else {
      this.value = '';
      cr.classList.remove('show');
      if(announce) announce.textContent = '';
    }
  });
})();

// Tier CTA — pre-fill contact form with chosen tier
(function(){
  document.querySelectorAll('[data-tier]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var tier = this.getAttribute('data-tier');
      setTimeout(function(){
        var sel = document.getElementById('cfTier');
        if(sel) sel.value = tier;
      }, 500);
    });
  });
})();

// Generic Formspree handler — applies to all forms with class "formspree-form"
(function(){
  document.querySelectorAll('form.formspree-form').forEach(function(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"], .form-btn');
      // Look for sibling confirm element (either inline like quick-confirm or below form)
      var confirmEl = form.parentElement.querySelector('.form-confirm');
      var origText = btn ? btn.textContent : 'Sending...';
      if(btn){
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }
      try {
        var resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {'Accept': 'application/json'}
        });
        if(resp.ok){
          if(confirmEl){
            form.style.display = 'none';
            confirmEl.classList.add('show');
          } else if(btn){
            btn.textContent = 'Sent ✓';
          }
        } else {
          if(btn){
            btn.textContent = 'Try again — or email hello@massonhomes.com';
            btn.disabled = false;
          }
        }
      } catch(err){
        if(btn){
          btn.textContent = 'Connection error — or email us';
          btn.disabled = false;
        }
      }
    });
  });
})();

// Scroll reveal
(function(){
  if(!('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll(
    '.anchor, .tier, .market-card, .tl-step, .founder, ' +
    '.offering, .builders-stat, .cash-offer-content, .cash-offer-visual'
  );
  targets.forEach(function(el){
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, i){
      if(entry.isIntersecting){
        setTimeout(function(){
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  targets.forEach(function(el){ io.observe(el); });
})();
