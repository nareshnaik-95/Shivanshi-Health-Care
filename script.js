/* ============================================================
   SHIVANSHI HEALTH CARE — Premium Hospital Website
   JavaScript: Navigation, Animations, Interactions
   ============================================================ */

(function () {
  'use strict';

  // ─── Navbar Scroll Effect ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ─── Mobile Menu Toggle ─────────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Global function for mobile menu links
  window.closeMobileMenu = function () {
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // ─── Smooth Scroll for Anchor Links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ─── Intersection Observer for Fade Animations ──────────────
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const animationObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedElements.forEach(function (el) {
    animationObserver.observe(el);
  });

  // ─── Active Nav Link Highlighting ───────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a');

  function highlightNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.style.color = '';
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.style.color = 'var(--primary)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Staggered Animation Delays ─────────────────────────────
  function addStaggeredDelays(selector, baseDelay) {
    const items = document.querySelectorAll(selector);
    items.forEach(function (item, index) {
      if (!item.style.transitionDelay) {
        item.style.transitionDelay = (baseDelay + index * 0.08) + 's';
      }
    });
  }

  addStaggeredDelays('.service-card', 0.05);
  addStaggeredDelays('.review-card', 0.05);

  // ─── Counter Animation for Hero Stats ───────────────────────
  function animateCounter(element, target, suffix, duration) {
    if (!element) return;
    var start = 0;
    var startTime = null;
    var isFloat = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = start + (target - start) * eased;

      if (isFloat) {
        element.textContent = current.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Observe hero stats for counter animation
  var heroStatsAnimated = false;
  var heroStatsContainer = document.querySelector('.hero-stats');

  if (heroStatsContainer) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !heroStatsAnimated) {
            heroStatsAnimated = true;
            var statValues = document.querySelectorAll('.hero-stat-value');
            if (statValues.length >= 3) {
              animateCounter(statValues[0], 5.0, ' ★', 1500);
              animateCounter(statValues[1], 600, '+', 2000);
              animateCounter(statValues[2], 2, '', 1000);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroStatsContainer);
  }

  // ─── Review Stars Animation ─────────────────────────────────
  var reviewRatingAnimated = false;
  var reviewRatingEl = document.querySelector('.reviews-rating-value');

  if (reviewRatingEl) {
    var ratingObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !reviewRatingAnimated) {
            reviewRatingAnimated = true;
            animateCounter(reviewRatingEl, 5.0, '', 1500);
          }
        });
      },
      { threshold: 0.5 }
    );
    ratingObserver.observe(reviewRatingEl);
  }

  // ─── Parallax Subtle Effect on Hero ─────────────────────────
  var heroContent = document.querySelector('.hero-content');
  var heroImage = document.querySelector('.hero-image');

  function handleHeroParallax() {
    if (!heroContent) return;
    var scrolled = window.scrollY;
    if (scrolled < 800) {
      var translateY = scrolled * 0.15;
      heroContent.style.transform = 'translateY(' + translateY + 'px)';
      if (heroImage) {
        heroImage.style.transform = 'translateY(' + (translateY * 0.6) + 'px)';
      }
    }
  }

  window.addEventListener('scroll', handleHeroParallax, { passive: true });

  // ─── Service Cards Hover Ripple Effect ──────────────────────
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mouseenter', function (e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      this.style.setProperty('--ripple-x', x + 'px');
      this.style.setProperty('--ripple-y', y + 'px');
    });
  });

  // ─── Scroll to Top on Logo Click ────────────────────────────
  var brandLink = document.querySelector('.navbar-brand');
  if (brandLink) {
    brandLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Dynamic Year in Footer ─────────────────────────────────
  var footerYear = document.querySelector('.footer-bottom p');
  if (footerYear) {
    var currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
  }

  // ─── Navbar Hide/Show on Scroll (Mobile) ────────────────────
  var prevScrollPos = window.scrollY;

  function handleNavVisibility() {
    if (window.innerWidth > 768) return;

    var currentScrollPos = window.scrollY;
    if (prevScrollPos > currentScrollPos || currentScrollPos < 100) {
      navbar.style.transform = 'translateY(0)';
    } else {
      navbar.style.transform = 'translateY(-100%)';
    }
    prevScrollPos = currentScrollPos;
  }

  window.addEventListener('scroll', handleNavVisibility, { passive: true });

  // ─── Lazy Load Enhancement ──────────────────────────────────
  if ('IntersectionObserver' in window) {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  // ─── Console Branding ───────────────────────────────────────
  console.log(
    '%c🏥 Shivanshi Health Care — Nadergul, Hyderabad',
    'font-size: 14px; font-weight: bold; color: #0369A1; background: #F0F9FF; padding: 8px 16px; border-radius: 4px;'
  );

  // ─── Initial Trigger ───────────────────────────────────────
  handleNavScroll();
  highlightNav();

})();
