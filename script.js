document.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════
     1. MENÚ MÓVIL
  ══════════════════════════ */
  var toggle = document.querySelector('.nav-toggle');
  var panel  = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ══════════════════════════
     2. FAQ ACORDEÓN
  ══════════════════════════ */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  var diagnosisForm = document.getElementById('diagnosis-form');
  if (diagnosisForm) {
    diagnosisForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var formData = new FormData(diagnosisForm);
      var subject = 'Solicitud de diagnóstico - ' + formData.get('nombre');
      var body = [
        'Nombre: ' + formData.get('nombre'),
        'Empresa: ' + (formData.get('empresa') || 'No indicada'),
        'Correo: ' + formData.get('correo'),
        'Servicio: ' + formData.get('servicio'),
        '',
        'Proyecto:',
        formData.get('mensaje') || 'No indicado'
      ].join('\n');

      window.location.href = 'mailto:johncordova639@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      var status = diagnosisForm.querySelector('.form-status');
      if (status) status.textContent = 'Se abrirá tu aplicación de correo para completar el envío.';
    });
  }

  /* ══════════════════════════
     3. CURSOR PERSONALIZADO
  ══════════════════════════ */
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');

  if (dot && ring) {
    var mouseX = 0, mouseY = 0;
    var ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    var hoverTargets = document.querySelectorAll(
      'a, button, .card, .plan, .faq-q, .process-item'
    );
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      });
    });
  }

  /* ══════════════════════════
     4. CAMPO ESTELAR 3D
  ══════════════════════════ */
  var canvas = document.getElementById('particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, stars = [];
    var planets = [
      { x: 0.13, y: 0.26, size: 74, color: '#A9352F', light: '#E77B61', type: 'rocky', ring: false, angle: 0 },
      { x: 0.86, y: 0.58, size: 112, color: '#2457A6', light: '#8CB5FF', type: 'gas', ring: true, angle: 2.4 },
      { x: 0.72, y: 0.16, size: 38, color: '#8994A4', light: '#F1F4F8', type: 'moon', ring: false, angle: 4.1 }
    ];
    var depth = 900;
    var pointerX = 0;
    var pointerY = 0;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', function (e) {
      pointerX = (e.clientX / W - 0.5) * 80;
      pointerY = (e.clientY / H - 0.5) * 80;
    });

    var STAR_COUNT = 180;

    function Star() {
      this.reset();
    }
    Star.prototype.reset = function () {
      this.x = (Math.random() - 0.5) * W;
      this.y = (Math.random() - 0.5) * H;
      this.z = Math.random() * depth + 1;
      this.previousZ = this.z;
      this.color = Math.random() > 0.5
        ? 'rgba(214,40,57,'
        : 'rgba(21,94,239,';
    };
    Star.prototype.update = function () {
      this.previousZ = this.z;
      this.z -= 3.2;
      if (this.z <= 1) this.reset();
    };
    Star.prototype.draw = function () {
      var scale = depth / this.z;
      var x = this.x * scale + W / 2 + pointerX;
      var y = this.y * scale + H / 2 + pointerY;
      var previousScale = depth / this.previousZ;
      var previousX = this.x * previousScale + W / 2 + pointerX;
      var previousY = this.y * previousScale + H / 2 + pointerY;
      var radius = Math.max(0.35, (1 - this.z / depth) * 2.2);
      var alpha = Math.min(0.9, 1 - this.z / depth + 0.15);

      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) {
        this.reset();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(previousX, previousY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = this.color + (alpha * 0.45) + ')';
      ctx.lineWidth = radius;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    };

    function drawUniverse() {
      var background = ctx.createLinearGradient(0, 0, W, H);
      background.addColorStop(0, '#030817');
      background.addColorStop(0.52, '#071631');
      background.addColorStop(1, '#050B18');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, W, H);

      var nebula = ctx.createRadialGradient(W * 0.22, H * 0.24, 0, W * 0.22, H * 0.24, W * 0.48);
      nebula.addColorStop(0, 'rgba(21,94,239,0.16)');
      nebula.addColorStop(0.55, 'rgba(21,94,239,0.04)');
      nebula.addColorStop(1, 'rgba(21,94,239,0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, W, H);

      var redNebula = ctx.createRadialGradient(W * 0.82, H * 0.7, 0, W * 0.82, H * 0.7, W * 0.42);
      redNebula.addColorStop(0, 'rgba(214,40,57,0.12)');
      redNebula.addColorStop(0.65, 'rgba(214,40,57,0.025)');
      redNebula.addColorStop(1, 'rgba(214,40,57,0)');
      ctx.fillStyle = redNebula;
      ctx.fillRect(0, 0, W, H);
    }

    function drawPlanet(planet) {
      planet.angle += 0.00015;
      var orbitX = W * 0.0025;
      var orbitY = H * 0.002;
      var x = W * planet.x + Math.cos(planet.angle) * orbitX;
      var y = H * planet.y + Math.sin(planet.angle) * orbitY;
      var size = planet.size * Math.min(1.25, Math.max(0.78, W / 1100));

      ctx.save();
      if (planet.ring) {
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.55, size * 0.35, -0.2, 0, Math.PI * 2);
        ctx.strokeStyle = planet.color === '#D62839' ? 'rgba(255,154,139,0.6)' : 'rgba(183,194,210,0.55)';
        ctx.lineWidth = Math.max(2, size * 0.045);
        ctx.stroke();
      }

      var sphere = ctx.createRadialGradient(x - size * 0.35, y - size * 0.42, size * 0.08, x, y, size);
      sphere.addColorStop(0, planet.light);
      sphere.addColorStop(0.34, planet.color);
      sphere.addColorStop(1, '#020611');
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = sphere;
      ctx.shadowColor = planet.color;
      ctx.shadowBlur = size * 0.16;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size * 0.98, 0, Math.PI * 2);
      ctx.clip();
      if (planet.type === 'gas') {
        for (var band = -5; band <= 5; band++) {
          var bandY = y + band * size * 0.17;
          var bandGradient = ctx.createLinearGradient(x - size, bandY, x + size, bandY + size * 0.06);
          bandGradient.addColorStop(0, 'rgba(5,25,68,0.18)');
          bandGradient.addColorStop(0.35, band % 2 ? 'rgba(220,232,255,0.28)' : 'rgba(104,143,211,0.25)');
          bandGradient.addColorStop(0.7, 'rgba(255,255,255,0.12)');
          bandGradient.addColorStop(1, 'rgba(3,12,35,0.24)');
          ctx.beginPath();
          ctx.ellipse(x, bandY, size * 1.08, size * 0.075, 0.03, 0, Math.PI * 2);
          ctx.fillStyle = bandGradient;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.ellipse(x + size * 0.28, y + size * 0.18, size * 0.23, size * 0.1, -0.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(214,40,57,0.42)';
        ctx.fill();
      } else if (planet.type === 'rocky' || planet.type === 'moon') {
        var craterCount = planet.type === 'moon' ? 11 : 14;
        for (var crater = 0; crater < craterCount; crater++) {
          var craterAngle = crater * 2.399;
          var craterDistance = size * (0.18 + (crater % 4) * 0.15);
          var craterX = x + Math.cos(craterAngle) * craterDistance;
          var craterY = y + Math.sin(craterAngle) * craterDistance * 0.82;
          var craterSize = size * (0.025 + (crater % 3) * 0.014);
          ctx.beginPath();
          ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
          ctx.fillStyle = planet.type === 'moon' ? 'rgba(22,30,45,0.3)' : 'rgba(62,18,24,0.22)';
          ctx.fill();
          ctx.strokeStyle = planet.type === 'moon' ? 'rgba(255,255,255,0.16)' : 'rgba(255,170,145,0.12)';
          ctx.lineWidth = Math.max(0.7, size * 0.012);
          ctx.stroke();
        }
      }
      ctx.restore();

      var shadow = ctx.createRadialGradient(x + size * 0.45, y - size * 0.2, size * 0.2, x + size * 0.55, y, size * 1.1);
      shadow.addColorStop(0, 'rgba(0,0,0,0)');
      shadow.addColorStop(0.62, 'rgba(0,0,0,0.02)');
      shadow.addColorStop(1, 'rgba(0,0,0,0.62)');
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = shadow;
      ctx.fill();
      ctx.restore();

      if (planet.ring) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.55, size * 0.35, -0.2, Math.PI, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220,232,255,0.42)';
        ctx.lineWidth = Math.max(2, size * 0.04);
        ctx.stroke();
        ctx.restore();
      }
    }

    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }

    function loop(time) {
      ctx.clearRect(0, 0, W, H);
      drawUniverse();
      planets.forEach(function (planet) { drawPlanet(planet); });
      stars.forEach(function (star) {
        star.update();
        star.draw();
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ══════════════════════════
     5. TILT 3D EN CARDS
  ══════════════════════════ */
  document.querySelectorAll('.card, .hero-panel').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var dx   = (e.clientX - cx) / (rect.width  / 2);
      var dy   = (e.clientY - cy) / (rect.height / 2);
      el.style.transform =
        'perspective(900px) rotateX(' + (-dy * 8) + 'deg) rotateY(' + (dx * 8) + 'deg) translateY(-6px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });

  /* ══════════════════════════
     6. SCROLL REVEAL
  ══════════════════════════ */
  var reveals = document.querySelectorAll(
    '.card, .plan, .process-item, .section-head, ' +
    '.page-hero h1, .page-hero p, ' +
    '.hero h1, .hero-lead, .hero-actions, .hero-panel'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ══════════════════════════
     7. HEADER SOMBRA AL SCROLL
  ══════════════════════════ */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(16,24,38,0.08)'
        : 'none';
    }, { passive: true });
  }

  /* ══════════════════════════
     8. SMOOTH SCROLL ANCLAS
  ══════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});