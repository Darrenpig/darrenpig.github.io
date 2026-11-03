(() => {
  'use strict';

  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const embedded = root.classList.contains('embedded');

  if (!window.gsap || !window.ScrollTrigger) {
    root.dataset.gsap = 'unavailable';
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  let context = null;

  const showBaseContent = () => {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  };

  const init = () => {
    if (context || motion.matches) return;
    root.classList.add('gsap-enabled');
    root.dataset.gsap = 'ready';
    showBaseContent();

    context = gsap.context(() => {
      const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
      hero
        .from('.hero .eyebrow', { y: 18, opacity: 0, duration: 0.45 })
        .from('.hero-name', { y: 90, opacity: 0, duration: 0.85 }, '-=0.15')
        .from('.hero-alias', { x: -42, opacity: 0, duration: 0.65 }, '-=0.55')
        .from('.hero-chinese', { y: 16, opacity: 0, duration: 0.45 }, '-=0.35')
        .from('.hero-intro', { y: 24, opacity: 0, duration: 0.55 }, '-=0.25')
        .from('.hero-actions .button', { y: 22, opacity: 0, duration: 0.45, stagger: 0.09 }, '-=0.3')
        .from('.portrait-card', { scale: 0.92, rotation: 1.5, opacity: 0, duration: 0.9, transformOrigin: '50% 60%' }, 0.25)
        .from('.floating-tag', { scale: 0, opacity: 0, duration: 0.45, stagger: 0.12, ease: 'back.out(1.8)' }, '-=0.35')
        .from('.hero-stats > div', { y: 26, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.2');

      if (!embedded) {
        gsap.to('.tag-bsp', { y: 9, rotation: -2, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.tag-robotics', { y: -9, rotation: 2, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.orbit-two', { rotation: '+=360', duration: 42, repeat: -1, ease: 'none' });
      }

      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header.querySelectorAll('.section-kicker, h2, .section-header > p'), {
          scrollTrigger: { trigger: header, start: 'top 84%', once: true },
          y: 46,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          y: 76,
          opacity: 0,
          duration: 0.85,
          delay: (index % 2) * 0.08,
          ease: 'power3.out'
        });
        if (!embedded) {
          const visual = card.querySelector('.project-media picture') || card.querySelector('.project-media img');
          if (visual) {
            gsap.fromTo(visual, { yPercent: -2.5, scale: 1.07 }, {
              yPercent: 2.5,
              scale: 1.07,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
            });
          }
        }
      });

      gsap.from('.statement blockquote', {
        scrollTrigger: { trigger: '.statement', start: 'top 78%', once: true },
        y: 45,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.timeline-item', {
        scrollTrigger: { trigger: '.timeline', start: 'top 82%', once: true },
        y: 44,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out'
      });
      gsap.from('.stack-row', {
        scrollTrigger: { trigger: '.stack-panel', start: 'top 82%', once: true },
        x: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: 'power2.out'
      });
      gsap.from('.terminal', {
        scrollTrigger: { trigger: '.stack-panel', start: 'top 72%', once: true },
        y: 28,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out'
      });

      gsap.utils.toArray('.background-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
          y: 54,
          opacity: 0,
          duration: 0.75,
          delay: index * 0.08,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.media-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          y: 48,
          clipPath: 'inset(12% 0 12% 0)',
          opacity: 0,
          duration: 0.8,
          delay: (index % 2) * 0.08,
          ease: 'power3.out'
        });
        gsap.from(card.querySelector('.media-overlay'), {
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
          y: 20,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out'
        });
      });

      gsap.from('.contact-section .section-kicker, .contact-section h2, .contact-section > p, .contact-email, .social-links', {
        scrollTrigger: { trigger: '.contact-section', start: 'top 76%', once: true },
        y: 38,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out'
      });
    });
  };

  const destroy = () => {
    if (context) {
      context.revert();
      context = null;
    }
    root.classList.remove('gsap-enabled');
    root.dataset.gsap = 'disabled';
    showBaseContent();
  };

  const syncMotion = () => {
    if (motion.matches) destroy();
    else init();
  };

  if (typeof motion.addEventListener === 'function') motion.addEventListener('change', syncMotion);
  else motion.addListener(syncMotion);

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

  init();
})();
