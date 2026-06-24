/* =========================================================
   Rubine Iqbal — 2026 portfolio interactions
   - Cursor glow
   - Theme toggle (dark/light)
   - Particles background
   - Typing effect
   - GSAP scroll + micro animations
   - AOS init
   - Testimonials slider
   - Portfolio filtering
   - Animated counters
   - Scroll progress
   - Loading screen
   ========================================================= */

(function(){
  const d = document;
  const body = d.body;

  // -----------------------------
  // Loading Screen
  // -----------------------------
  const loading = d.querySelector('.loading-screen');
  const hideLoading = () => {
    if(!loading) return;
    loading.classList.add('is-hidden');
    setTimeout(()=>{ loading?.remove(); }, 520);
  };
  if (document.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', () => {
      setTimeout(hideLoading, 900);
    });
  } else {
    setTimeout(hideLoading, 600);
  }

  // -----------------------------
  // Theme
  // -----------------------------
  const themeToggle = d.getElementById('themeToggle');

  function getStoredTheme(){
    try{ return localStorage.getItem('theme'); }catch{ return null; }
  }
  function setTheme(theme){
    if(!theme) return;
    body.setAttribute('data-theme', theme);
    try{ localStorage.setItem('theme', theme); }catch{}
  }

  // Default: dark
  const stored = getStoredTheme();
  if(stored === 'light' || stored === 'dark'){
    setTheme(stored);
  } else {
    setTheme('dark');
  }

  // icons are controlled in CSS by body[data-theme]
  function updateThemeIcon(){}
  updateThemeIcon();


  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const current = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
      updateThemeIcon();
    });
  }


  // -----------------------------
  // Cursor Glow Effect
  // -----------------------------
  const glow = d.querySelector('.cursor-glow');
  const dot = d.querySelector('.cursor-dot');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  function onMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(glow){ glow.style.left = mouseX + 'px'; glow.style.top = mouseY + 'px'; }
    if(dot){ dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
  }

  if(glow && dot && window.matchMedia && window.matchMedia('(hover: hover)').matches){
    d.addEventListener('mousemove', onMove, { passive: true });
  }

  // Smooth-ish easing for glow using rAF
  if(glow && dot && window.matchMedia && window.matchMedia('(hover: hover)').matches){
    const loop = () => {
      glowX += (mouseX - glowX) * 0.18;
      glowY += (mouseY - glowY) * 0.18;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // -----------------------------
  // Scroll Progress Bar
  // -----------------------------
  const progress = d.querySelector('.scroll-progress');
  function updateProgress(){
    if(!progress) return;
    const scrollTop = window.pageYOffset || d.documentElement.scrollTop;
    const height = (d.documentElement.scrollHeight - window.innerHeight);
    const pct = height > 0 ? (scrollTop / height) : 0;
    progress.style.width = Math.max(0, Math.min(1, pct)) * 100 + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // -----------------------------
  // Back to top
  // -----------------------------
  const backToTop = d.getElementById('backToTop');
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -----------------------------
  // Typing effect (roles)
  // -----------------------------
  const typingEl = d.getElementById('typingText');
  const typingRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'UI/UX Designer',
    'Freelancer'
  ];

  function typingLoop(){
    if(!typingEl) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if(reduceMotion){
      typingEl.textContent = typingRoles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const baseTyping = 62;
    const baseDeleting = 38;

    const tick = () => {
      const role = typingRoles[roleIndex];
      if(!deleting){
        typingEl.textContent = role.slice(0, charIndex + 1);
        charIndex++;
        if(charIndex >= role.length){
          deleting = true;
          setTimeout(tick, 1200);
          return;
        }
        setTimeout(tick, baseTyping + Math.random()*35);
      } else {
        typingEl.textContent = role.slice(0, charIndex - 1);
        charIndex--;
        if(charIndex <= 0){
          deleting = false;
          roleIndex = (roleIndex + 1) % typingRoles.length;
          setTimeout(tick, 450);
          return;
        }
        setTimeout(tick, baseDeleting + Math.random()*20);
      }
    };

    setTimeout(tick, 600);
  }

  typingLoop();

  // -----------------------------
  // Portfolio filtering
  // -----------------------------
  const filterBtns = d.querySelectorAll('.filter-btn');
  const grid = d.getElementById('portfolioGrid');

  function setActiveFilter(btn){
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn?.classList.add('is-active');
  }

  function applyFilter(cat){
    if(!grid) return;
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const show = cat === 'all' || cardCat === cat;
      card.classList.toggle('hide', !show);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter') || 'all';
      setActiveFilter(btn);
      applyFilter(cat);
    });
  });

  // -----------------------------
  // Testimonials slider
  // -----------------------------
  const track = d.getElementById('testimonialTrack');
  const prevBtn = d.getElementById('testimonialPrev');
  const nextBtn = d.getElementById('testimonialNext');
  const dotsWrap = d.getElementById('testimonialDots');

  if(track && prevBtn && nextBtn && dotsWrap){
    const slides = Array.from(track.querySelectorAll('.testimonial'));
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    let index = 0;
    let timer = null;

    // Build dots
    dotsWrap.innerHTML = '';
    const dotBtns = slides.map((_, i) => {
      const b = d.createElement('button');
      b.type = 'button';
      b.className = 'dot-btn' + (i === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
      b.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(b);
      return b;
    });

    function render(){
      track.style.transform = `translateX(${-index * 100}%)`;
      dotBtns.forEach((b, i) => b.classList.toggle('is-active', i === index));
    }

    function go(i, manual){
      index = (i + slides.length) % slides.length;
      render();
      if(manual) restart();
    }

    function next(){ go(index + 1, true); }
    function prev(){ go(index - 1, true); }

    function restart(){
      if(timer) clearInterval(timer);
      if(reduceMotion) return;
      timer = setInterval(() => go(index + 1, false), 5200);
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    render();
    restart();
  }

  // -----------------------------
  // Animated circular progress indicators
  // (We implement using conic-gradient on .skill-progress)
  // -----------------------------
  function initSkillRadials(){
    const radials = d.querySelectorAll('.skill-progress');
    radials.forEach(el => {
      const value = Number(el.getAttribute('data-progress') || '0');
      const pct = Math.max(0, Math.min(100, value));
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

      // Create base ring
      el.style.background = `conic-gradient(var(--secondary) ${pct}%, rgba(255,255,255,.10) 0)`;
      el.style.borderRadius = '50%';
      el.style.position = 'relative';

      // inner cutout
      const inner = d.createElement('div');
      inner.style.position = 'absolute';
      inner.style.inset = '10px';
      inner.style.borderRadius = '50%';
      inner.style.background = getComputedStyle(body).getPropertyValue('--bg');
      inner.style.opacity = body.getAttribute('data-theme') === 'light' ? '0.92' : '0.62';
      inner.style.border = '1px solid rgba(255,255,255,.10)';
      inner.style.backdropFilter = 'blur(10px)';
      inner.style.webkitBackdropFilter = 'blur(10px)';

      el.appendChild(inner);

      if(!reduceMotion){
        el.style.transform = 'scale(.86)';
        el.style.opacity = '0';
        setTimeout(() => {
          el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1), opacity .7s cubic-bezier(.16,1,.3,1)';
          el.style.transform = 'scale(1)';
          el.style.opacity = '1';
        }, 140);
      }

      // store for AOS / GSAP possible
    });
  }
  initSkillRadials();

  // -----------------------------
  // Counters (animated)
  // -----------------------------
  function initCounters(){
    const els = d.querySelectorAll('[data-animate-counter]');
    if(!els.length) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if(reduceMotion){
      els.forEach(el => {
        const v = Number(el.getAttribute('data-animate-counter') || '0');
        el.textContent = String(v);
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute('data-animate-counter') || '0');
        const duration = 1000 + (target * 8);
        const start = performance.now();
        const from = 0;

        const animate = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = Math.round(from + (target - from) * eased);
          el.textContent = String(current);
          if(t < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        io.unobserve(el);
      });
    }, { threshold: 0.35 });

    els.forEach(el => io.observe(el));
  }
  initCounters();

  // -----------------------------
  // GSAP animations
  // -----------------------------
  function initGsap(){
    if(typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // hero card hover micro
    gsap.utils.toArray('.hero-card, .glass-card, .project-item, .service-card').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -8;
        const ry = (x - 0.5) * 8;
        el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    // Scroll reveal
    gsap.fromTo('.site-header', { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });

    gsap.utils.toArray('[data-aos]').forEach((el) => {
      // AOS already handles; keep GSAP light
      // no-op
    });

    // Section subtle parallax
    gsap.utils.toArray('.section').forEach((section) => {
      const bg = section.querySelector('.hero-gradient-line');
      if(bg) return;
      gsap.to(section, {
        y: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    // Scroll progress already handled in CSS/JS
  }
  initGsap();

  // -----------------------------
  // AOS init
  // -----------------------------
  function initAos(){
    if(typeof AOS === 'undefined') return;
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }
  initAos();

  // -----------------------------
  // Particles background
  // -----------------------------
  function initParticles(){
    const canvas = d.getElementById('particles');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if(reduceMotion) return;

    let w = 0, h = 0;
    let particles = [];
    const count = 70;

    function resize(){
      const rect = canvas.getBoundingClientRect();
      w = Math.max(300, Math.floor(rect.width));
      h = Math.max(250, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
    }

    function rand(min, max){ return Math.random() * (max - min) + min; }

    function reset(){
      particles = Array.from({length: count}).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.35, 0.35),
        vy: rand(-0.2, 0.2),
        r: rand(1.1, 2.4),
        a: rand(0.25, 0.9),
        hue: Math.random() < 0.5 ? 260 : (185 + Math.random()*40)
      }));
    }

    function draw(){
      ctx.clearRect(0,0,w,h);

      // connections
      for(let i=0;i<particles.length;i++){
        const p = particles[i];
        // move
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < -20) p.x = w + 20;
        if(p.x > w + 20) p.x = -20;
        if(p.y < -20) p.y = h + 20;
        if(p.y > h + 20) p.y = -20;

        // dot
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();

        for(let j=i+1;j<particles.length;j++){
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if(dist < 120){
            const alpha = (1 - dist/120) * 0.35;
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    reset();
    window.addEventListener('resize', () => { resize(); reset(); }, { passive: true });
    draw();
  }
  initParticles();

  // -----------------------------
  // Contact form micro (demo)
  // -----------------------------
  const form = d.getElementById('contactForm');
  const toast = d.getElementById('formToast');
  const toastClose = d.getElementById('toastClose');

  function showToast(){
    if(!toast) return;
    toast.classList.add('is-show');
  }
  function hideToast(){
    if(!toast) return;
    toast.classList.remove('is-show');
  }

  toastClose?.addEventListener('click', hideToast);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = ['name','email','subject','message'];
    let ok = true;
    required.forEach(id => {
      const el = d.getElementById(id);
      if(!el || !el.value.trim()) ok = false;
    });

    if(!ok){
      // fallback: native validity
      showToast();
      return;
    }

    showToast();
    // Micro: reset after
    setTimeout(() => {
      form.reset();
      hideToast();
    }, 3800);
  });

})();

