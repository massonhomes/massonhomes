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

// Tier CTA — pre-fill main contact form with chosen tier (still useful for cash-offer
// option in the main contact form select, kept defensively for any data-tier elements
// that aren't modal triggers)
(function(){
  document.querySelectorAll('[data-tier]').forEach(function(btn){
    // Skip if this element is a modal opener — modals carry their own tier data
    if(btn.hasAttribute('data-modal-open')) return;
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
// Handles two confirmation patterns:
//   1. Sibling .form-confirm (legacy: quick-call, main consultation, builders form)
//   2. Sibling .modal-confirm + .modal-form parent (new: cash-offer, guide, tier modals)
(function(){
  document.querySelectorAll('form.formspree-form').forEach(function(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"], .form-btn, .modal-btn');
      var modalForm = form.closest('.modal-form');
      var modalConfirm = modalForm ? modalForm.parentElement.querySelector('.modal-confirm') : null;
      var legacyConfirm = form.parentElement.querySelector('.form-confirm');
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
          if(modalForm && modalConfirm){
            // Modal pattern: hide the form, show the confirm block
            modalForm.classList.add('hidden');
            modalConfirm.classList.add('show');
            // Scroll modal back to top so user sees the confirmation
            var modal = modalForm.closest('.modal');
            if(modal) modal.scrollTop = 0;
          } else if(legacyConfirm){
            form.style.display = 'none';
            legacyConfirm.classList.add('show');
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

// Modal controller — open/close, focus trap, ESC, click-outside.
// Triggers: any element with [data-modal-open="modalId"]
// Closers: [data-modal-close], the backdrop itself (if click target is backdrop), Escape key
(function(){
  var openTriggers = document.querySelectorAll('[data-modal-open]');
  if(openTriggers.length === 0) return;

  var lastFocused = null;
  var activeModal = null;
  var keydownHandler = null;

  function getFocusable(modal){
    return Array.prototype.slice.call(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function(el){
      // Exclude hidden form (when in confirm state)
      return el.offsetParent !== null;
    });
  }

  function openModal(modalId){
    var modal = document.getElementById(modalId);
    if(!modal) return;

    // Reset modal to form state (in case it was previously submitted)
    var modalForm = modal.querySelector('.modal-form');
    var modalConfirm = modal.querySelector('.modal-confirm');
    if(modalForm) modalForm.classList.remove('hidden');
    if(modalConfirm) modalConfirm.classList.remove('show');

    // Reset any stuck submit-button state (if user previously hit an error)
    var btn = modal.querySelector('button[type="submit"], .modal-btn');
    if(btn && btn.disabled){
      btn.disabled = false;
      // Restore label — find it from text or default
      if(btn.textContent === 'Sending...' ||
         btn.textContent.indexOf('Try again') === 0 ||
         btn.textContent.indexOf('Connection error') === 0){
        // Map modal IDs to their original button labels
        var labels = {
          'cashOfferModal': 'Request My Offer',
          'guideModal': 'Send Me The Guide',
          'tierFullModal': 'Start The Conversation',
          'tierEnhancedModal': 'Start The Conversation',
          'tierReserveModal': 'Request Private Consultation'
        };
        btn.textContent = labels[modalId] || 'Submit';
      }
    }

    lastFocused = document.activeElement;
    activeModal = modal;

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('show');
    document.body.classList.add('modal-open');

    // Focus first focusable element after a tick (let display take effect)
    setTimeout(function(){
      var focusable = getFocusable(modal);
      if(focusable.length > 0) focusable[0].focus();
    }, 50);

    // Set up keydown handler for ESC + focus trap
    keydownHandler = function(e){
      if(e.key === 'Escape'){
        e.preventDefault();
        closeModal();
        return;
      }
      if(e.key === 'Tab'){
        var focusable = getFocusable(modal);
        if(focusable.length === 0){
          e.preventDefault();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault();
          last.focus();
        } else if(!e.shiftKey && document.activeElement === last){
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', keydownHandler);
  }

  function closeModal(){
    if(!activeModal) return;
    activeModal.setAttribute('aria-hidden', 'true');
    activeModal.classList.remove('show');
    document.body.classList.remove('modal-open');

    if(keydownHandler){
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }

    if(lastFocused && lastFocused.focus){
      lastFocused.focus();
    }
    activeModal = null;
    lastFocused = null;
  }

  // Wire up open triggers
  openTriggers.forEach(function(trigger){
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      var modalId = this.getAttribute('data-modal-open');
      openModal(modalId);
    });
  });

  // Wire up close buttons (event delegation handles close on dynamically added modals too)
  document.addEventListener('click', function(e){
    // Close button
    if(e.target.closest('[data-modal-close]')){
      closeModal();
      return;
    }
    // Backdrop click (only when click landed on the backdrop itself, not the modal contents)
    if(e.target.classList && e.target.classList.contains('modal-backdrop')){
      closeModal();
    }
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
