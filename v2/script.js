(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const glow = document.querySelector('.cursor-glow');
  let motionGeneration = 0;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    themeButton?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#080b09' : '#f1f4ec');
    try { localStorage.setItem('darren-theme', theme); } catch (_) {}
  };

  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    navigation?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (restoreFocus && wasOpen) menuButton?.focus();
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    if (!open) {
      closeMenu(true);
      return;
    }
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    navigation?.classList.add('open');
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => navigation?.querySelector('a')?.focus());
  });
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); });

  let scrollQueued = false;
  const updateScroll = () => {
    const y = window.scrollY;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${distance > 0 ? Math.min(100, (y / distance) * 100) : 0}%`;
    header?.classList.toggle('scrolled', y > 24);
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      requestAnimationFrame(updateScroll);
      scrollQueued = true;
    }
  }, { passive: true });
  updateScroll();

  const revealItems = document.querySelectorAll('.reveal');
  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.setProperty('--delay', `${delay}ms`);
  });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const counters = document.querySelectorAll('[data-counter]');
  const runCounter = (element) => {
    if (element.dataset.counted) return;
    element.dataset.counted = 'true';
    const target = Number(element.dataset.counter);
    const pad = Number(element.dataset.pad || 0);
    if (reducedMotion.matches) {
      element.textContent = String(target).padStart(pad, '0');
      return;
    }
    const start = performance.now();
    const generation = motionGeneration;
    const duration = 900;
    const tick = (now) => {
      if (reducedMotion.matches || generation !== motionGeneration) {
        element.textContent = String(target).padStart(pad, '0');
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = String(Math.round(target * eased)).padStart(pad, '0');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(runCounter);
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -60%', threshold: [0, 0.1, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (finePointer.matches) {
    let pointerQueued = false;
    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerQueued && glow) {
        requestAnimationFrame(() => {
          if (!reducedMotion.matches) {
            glow.style.left = `${pointerX}px`;
            glow.style.top = `${pointerY}px`;
            glow.style.opacity = '1';
          }
          pointerQueued = false;
        });
        pointerQueued = true;
      }
    }, { passive: true });

    document.querySelectorAll('[data-spotlight]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        if (reducedMotion.matches) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  const syncMotionPreference = () => {
    motionGeneration += 1;
    root.classList.toggle('reduced-motion', reducedMotion.matches);
    if (reducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      counters.forEach((element) => {
        element.dataset.counted = 'true';
        element.textContent = String(Number(element.dataset.counter)).padStart(Number(element.dataset.pad || 0), '0');
      });
      if (glow) glow.style.opacity = '0';
    }
  };
  if (typeof reducedMotion.addEventListener === 'function') reducedMotion.addEventListener('change', syncMotionPreference);
  else reducedMotion.addListener(syncMotionPreference);
  syncMotionPreference();

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
