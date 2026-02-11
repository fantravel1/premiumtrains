/* ============================================
   PREMIUMTRAINS.COM — Main JavaScript
   Scroll animations, mobile menu, FAQ accordion,
   category filtering, counter animation, score circles
   ============================================ */

(function () {
  'use strict';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavScroll();
    initMobileMenu();
    initScrollReveal();
    initFAQ();
    initCategoryTabs();
    initCounterAnimation();
    initScoreCircles();
    initSmoothScroll();
    initNewsletterForm();
  }

  // ---- Sticky Nav (transparent -> solid on scroll) ----
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var threshold = 60;

    function onScroll() {
      if (window.scrollY > threshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  // ---- Mobile Menu Toggle ----
  function initMobileMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var mobile = document.querySelector('.nav__mobile');
    if (!toggle || !mobile) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobile.classList.contains('open');
      mobile.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu when clicking a link
    var links = mobile.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        mobile.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobile.classList.contains('open')) {
        mobile.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ---- Scroll Reveal (Intersection Observer) ----
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- FAQ Accordion ----
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all others
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            var otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        item.classList.toggle('open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  // ---- Category Tab Filtering ----
  function initCategoryTabs() {
    var tabs = document.querySelectorAll('.category-tab');
    var grid = document.getElementById('trains-grid');
    if (!tabs.length || !grid) return;

    var cards = grid.querySelectorAll('.train-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var category = tab.dataset.category;

        // Update active tab
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter cards
        cards.forEach(function (card) {
          var cardCategory = card.dataset.category;
          if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            // Re-trigger animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Counter Animation ----
  function initCounterAnimation() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      el.textContent = current + (target >= 100 ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + (target >= 100 ? '+' : '');
      }
    }

    requestAnimationFrame(step);
  }

  // ---- Score Circle Animation ----
  function initScoreCircles() {
    var circles = document.querySelectorAll('.score-circle');
    if (!circles.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateScoreCircle(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    circles.forEach(function (circle) {
      observer.observe(circle);
    });
  }

  function animateScoreCircle(circle) {
    var score = parseInt(circle.dataset.score, 10);
    var fillCircle = circle.querySelector('.fill');
    if (!fillCircle) return;

    // Circumference of circle with r=70
    var circumference = 2 * Math.PI * 70; // ~440
    var offset = circumference - (score / 100) * circumference;

    fillCircle.style.strokeDasharray = circumference;
    fillCircle.style.strokeDashoffset = circumference;

    // Trigger animation after a small delay
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fillCircle.style.strokeDashoffset = offset;
      });
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = document.querySelector('.nav')
          ? document.querySelector('.nav').offsetHeight
          : 0;

        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scroll jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ---- Newsletter Form (prevent default, show feedback) ----
  function initNewsletterForm() {
    var forms = document.querySelectorAll('.newsletter-form, .form-group');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var btn = form.querySelector('button');
        if (!input || !btn) return;

        var originalText = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.style.background = '#2D6A4F';
        btn.style.color = '#fff';
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
          input.disabled = false;
          btn.disabled = false;
        }, 3000);
      });
    });
  }

})();
