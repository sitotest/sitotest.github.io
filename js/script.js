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
});
