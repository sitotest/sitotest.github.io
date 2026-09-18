document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Hero carousel
  var slides = document.querySelectorAll('.hero-slide');
  var dotsWrap = document.querySelector('.hero-dots');
  if (slides.length) {
    var current = 0;
    slides.forEach(function (s, i) {
      if (dotsWrap) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Vai alla slide ' + (i + 1));
        if (i === 0) b.classList.add('active');
        b.addEventListener('click', function () { show(i); });
        dotsWrap.appendChild(b);
      }
    });
    function show(i) {
      slides[current].classList.remove('active');
      if (dotsWrap) dotsWrap.children[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      if (dotsWrap) dotsWrap.children[current].classList.add('active');
    }
    setInterval(function () {
      show((current + 1) % slides.length);
    }, 6000);
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Scroll-reveal animation for cards / boxes / gallery items
  var revealTargets = document.querySelectorAll(
    '.card, .info-box, .cta-box, .gallery-item, .team-card, .faq-item'
  );
  revealTargets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min(i * 60, 400) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ---------- Lightbox ----------
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div class="lightbox-content">' +
      '<button class="lightbox-close" aria-label="Chiudi">&times;</button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="Precedente">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lightbox-nav lightbox-next" aria-label="Successiva">&#8250;</button>' +
      '<div class="lightbox-caption"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var lbImg = overlay.querySelector('img');
  var lbCaption = overlay.querySelector('.lightbox-caption');
  var lbClose = overlay.querySelector('.lightbox-close');
  var lbPrev = overlay.querySelector('.lightbox-prev');
  var lbNext = overlay.querySelector('.lightbox-next');

  var group = [];
  var groupIndex = 0;

  function openLightbox(items, index) {
    group = items;
    groupIndex = index;
    showCurrent();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function showCurrent() {
    var item = group[groupIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt || '';
    lbCaption.textContent = item.alt || '';
    var multi = group.length > 1;
    lbPrev.style.display = multi ? 'flex' : 'none';
    lbNext.style.display = multi ? 'flex' : 'none';
  }
  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showNext(delta) {
    groupIndex = (groupIndex + delta + group.length) % group.length;
    showCurrent();
  }

  lbClose.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });
  lbPrev.addEventListener('click', function () { showNext(-1); });
  lbNext.addEventListener('click', function () { showNext(1); });
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showNext(-1);
    if (e.key === 'ArrowRight') showNext(1);
  });

  // Wire up gallery grid (Staff Pets) as one navigable group
  var galleryImgs = Array.prototype.map.call(
    document.querySelectorAll('.gallery-item img'),
    function (img) { return { src: img.src, alt: img.alt }; }
  );
  document.querySelectorAll('.gallery-item').forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(galleryImgs, i); });
  });

  // Wire up any other zoomable single images (card media, centro photos, etc.)
  document.querySelectorAll('.zoomable img').forEach(function (img) {
    img.parentElement.style.cursor = 'zoom-in';
    img.parentElement.addEventListener('click', function () {
      openLightbox([{ src: img.src, alt: img.alt }], 0);
    });
  });
});
