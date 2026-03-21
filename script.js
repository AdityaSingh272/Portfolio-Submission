(function () {
  const sections = document.querySelectorAll('main section[id]');
  const desktopLinks = document.querySelectorAll('nav ul a');
  const btn = document.getElementById('navHamburger');
  const menu = document.getElementById('navMobileMenu');
  const icon = document.getElementById('hamburgerIcon');
  const mobileLinks = document.querySelectorAll('.nav-mobile-menu a');
  const allLinks = [...desktopLinks, ...mobileLinks];

  let isClickScrolling = false, clickScrollTimeout, clickedId = '';

  function setActive(id) {
    allLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (isClickScrolling) { if (clickedId) setActive(clickedId); return; }
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const NAV_H = 85;
      let cur = '';
      sections.forEach(s => { if (s.getBoundingClientRect().top <= NAV_H) cur = s.getAttribute('id'); });
      if (cur) setActive(cur);
      scrollTicking = false;
    });
  }, { passive: true });

  allLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      clickedId = id;
      setActive(id);
      if (menu) { menu.classList.remove('open'); if (icon) icon.textContent = 'terminal'; }
      isClickScrolling = true;
      clearTimeout(clickScrollTimeout);
      target.scrollIntoView({ behavior: 'smooth' });
      clickScrollTimeout = setTimeout(() => {
        isClickScrolling = false;
        setActive(clickedId);
        clickedId = '';
      }, 1200);
    });
  });

  if (btn && menu) {
    let isOpen = false;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      isOpen = !isOpen;
      menu.classList.toggle('open', isOpen);
      if (icon) icon.textContent = isOpen ? 'close' : 'terminal';
    });
    document.addEventListener('click', e => {
      if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
        isOpen = false;
        menu.classList.remove('open');
        if (icon) icon.textContent = 'terminal';
      }
    });
  }

  window.dispatchEvent(new Event('scroll'));
})();

(function () {
  const wrapper = document.querySelector('.terminal-wrapper');
  const terminal = document.querySelector('.terminal-window');
  if (!wrapper || !terminal) return;
  if (window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches) return;

  const MAX_TILT = 10;
  const MAX_LIFT = 20;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHovering = false;
  let rafId;

  terminal.style.transformStyle = 'preserve-3d';
  wrapper.style.perspective = '900px';

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);

    terminal.style.transform = `
      rotateX(${currentX}deg)
      rotateY(${currentY}deg)
      translateZ(${MAX_LIFT}px)
    `;

    const glowX = (currentY / MAX_TILT) * 15;
    const glowY = -(currentX / MAX_TILT) * 15;
    const intensity = Math.sqrt((currentX / MAX_TILT) ** 2 + (currentY / MAX_TILT) ** 2);

    terminal.style.boxShadow = `
      ${glowX}px ${glowY}px ${50 + 40 * intensity}px rgba(0, 220, 229, ${0.15 + 0.25 * intensity}),
      0 25px 50px rgba(0, 0, 0, 0.6)
    `;

    if (isHovering || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
      rafId = requestAnimationFrame(animate);
    } else {
      terminal.style.willChange = 'auto';
    }
  }

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetX = y * MAX_TILT;
    targetY = x * MAX_TILT;
    if (!isHovering) {
      isHovering = true;
      terminal.style.willChange = 'transform';
      cancelAnimationFrame(rafId);
      animate();
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    isHovering = false;
    targetX = 0;
    targetY = 0;
  });
})();

(function () {
  const roles = ["Engineer", "Developer", "Architect", "Designer", "Innovator"];
  const el = document.getElementById("heroRole");
  if (!el) return;

  let index = 0;
  el.textContent = roles[0];
  el.classList.add("visible");

  function switchRole() {
    el.classList.remove("visible");
    el.classList.add("fade-out");

    setTimeout(() => {
      index = (index + 1) % roles.length;
      el.textContent = roles[index];
      el.classList.remove("fade-out");
      el.classList.add("fade-in");

      void el.offsetWidth;

      el.classList.remove("fade-in");
      el.classList.add("visible");
    }, 350);
  }

  setInterval(switchRole, 2500);
})();

(function () {
  const screen = document.getElementById('bootScreen');
  const bar = document.getElementById('bootBar');
  const status = document.getElementById('bootStatus');
  const lines = document.getElementById('bootLines');
  if (!screen) return;

  const steps = [
    { text: 'Loading system kernel...', pct: 15 },
    { text: 'Mounting file systems...', pct: 30 },
    { text: 'Initializing UI components...', pct: 50 },
    { text: 'Fetching portfolio data...', pct: 65 },
    { text: 'Compiling shaders...', pct: 80 },
    { text: 'Optimizing critical path...', pct: 92 },
    { text: 'Build: SUCCESS (O3)', pct: 100 },
  ];

  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      status.textContent = 'LAUNCH SEQUENCE COMPLETE';
      setTimeout(() => screen.classList.add('done'), 500);
      return;
    }
    const s = steps[i++];
    bar.style.width = s.pct + '%';
    status.textContent = s.text.toUpperCase();
    const p = document.createElement('p');
    p.className = 'ok';
    p.textContent = s.text;
    lines.appendChild(p);
    lines.scrollTop = lines.scrollHeight;
    setTimeout(nextStep, 260);
  }
  setTimeout(nextStep, 180);
})();

(function () {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  if (window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = ring.style.display = 'none';
    return;
  }

  const noHandCursor = document.createElement('style');
  noHandCursor.textContent = '* { cursor: none !important; }';
  document.head.appendChild(noHandCursor);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = 'a, button, .project-card, .contact-card, .skill-card, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
  });
})();

(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT = window.innerWidth < 768 ? 45 : 90;
  const PRIMARY = '0,220,229';
  const SECONDARY = '255,170,247';
  const TERTIARY = '76,227,70';
  const COLORS = [PRIMARY, SECONDARY, TERTIARY];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.4 + 0.1,
    };
  }

  function init() { resize(); particles = Array.from({ length: COUNT }, mkParticle); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${PRIMARY},${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  init(); draw();
  window.addEventListener('resize', resize);
})();

(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

(function () {
  fetch('https://api.github.com/users/AdityaSingh272')
    .then(r => r.json())
    .then(data => {
      const r = document.getElementById('ghRepos');
      const f = document.getElementById('ghFollowers');
      const g = document.getElementById('ghFollowing');
      if (r) r.textContent = data.public_repos ?? '—';
      if (f) f.textContent = data.followers ?? '—';
      if (g) g.textContent = data.following ?? '—';
    }).catch(() => { });
})();

(function () {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;
  let light = false;
  btn.addEventListener('click', () => {
    light = !light;
    document.body.classList.toggle('light-mode', light);
    icon.textContent = light ? 'dark_mode' : 'light_mode';
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) { }
  });
  try {
    if (localStorage.getItem('theme') === 'light') {
      light = true;
      document.body.classList.add('light-mode');
      icon.textContent = 'dark_mode';
    }
  } catch (e) { }
})();

(function () {
  function initTerminal() {
    const overlay = document.getElementById('easterEgg');
    const input = document.getElementById('eeInput');
    const output = document.getElementById('eeOutput');
    const closeBtn = document.getElementById('eeClose');
    if (!overlay || !input || !output || !closeBtn) return;

    const commands = {
      help: () => [
        'Available commands:',
        '  <span class="ee-cmd">about</span>            — Who is Aditya?',
        '  <span class="ee-cmd">skills</span>           — Tech stack',
        '  <span class="ee-cmd">projects</span>         — Selected works',
        '  <span class="ee-cmd">contact</span>          — Get in touch',
        '  <span class="ee-cmd">hire aditya</span>      — Best decision you\'ll make',
        '  <span class="ee-cmd">sudo hire aditya</span> — Even better',
        '  <span class="ee-cmd">ls</span>               — List portfolio sections',
        '  <span class="ee-cmd">whoami</span>           — Current user',
        '  <span class="ee-cmd">clear</span>            — Clear terminal',
        '  <span class="ee-cmd">exit</span>             — Close terminal',
      ].join('\n'),
      about: () => 'Aditya Kumar Singh — Systems & Full-stack Architect.\nBuilds high-performance engines, marketplaces, and real-time\ndashboards. Passionate about the critical path.',
      skills: () => 'SYSTEM:  C++ / STL, Multi-threading, Memory Management\nWEB:     React, Next.js, Node.js, GraphQL, Tailwind CSS\nDEVOPS:  PostgreSQL, Redis, Docker, CI/CD\nEXTRA:   OpenGL, WebSockets, Embedded Logic',
      projects: () => '1. High-Performance Rendering Engine  [C++ / OpenGL]\n2. E-Commerce Nexus                   [Next.js / PostgreSQL]\n3. Real-time Analytics Dashboard      [C++ / React / WS]',
      contact: () => 'Email:    adityasingh27022005@gmail.com\nLinkedIn: linkedin.com/in/aditya-kumar-singh-252a7939b/\nGitHub:   github.com/AdityaSingh272',
      ls: () => 'drwxr-xr-x  home/\ndrwxr-xr-x  projects/\ndrwxr-xr-x  skills/\ndrwxr-xr-x  contact/',
      whoami: () => 'visitor@aditya-portfolio',
      'hire aditya': () => '✓ Request submitted.\n✓ Background check: PASSED\n✓ Skills verified: EXCEPTIONAL\nResponse: Aditya will get back to you shortly.',
      'sudo hire aditya': () => '[sudo] password for visitor: ********\n✓ Root access granted.\n✓ Hiring process initiated with PRIORITY flag.\n✓ Salary range: Negotiable (but he\'s worth it).\nStatus: HIRED 🎉',
      clear: () => { output.innerHTML = ''; return null; },
      exit: () => { closeOverlay(); return null; },
    };

    function openOverlay() { overlay.classList.add('open'); setTimeout(() => input.focus(), 200); }
    function closeOverlay() { overlay.classList.remove('open'); }

    window.__openTerminal = openOverlay;

    const hintBtn = document.getElementById('terminalHint');
    if (hintBtn) {
      hintBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openOverlay();
      });
    }

    document.addEventListener('keydown', function (e) {
      const tag = document.activeElement.tagName;
      const isEeInput = document.activeElement === input;
      if (!isEeInput && (tag === 'INPUT' || tag === 'TEXTAREA')) return;
      if (e.key === '`' || e.key === '~' || e.code === 'Backquote') {
        e.preventDefault();
        overlay.classList.contains('open') ? closeOverlay() : openOverlay();
        return;
      }
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
    });

    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });

    let history = [], histIdx = -1;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        if (!cmd) return;
        history.unshift(cmd); histIdx = -1;
        input.value = '';
        const cmdLine = document.createElement('p');
        cmdLine.className = 'cmd-line';
        cmdLine.textContent = cmd;
        output.appendChild(cmdLine);
        const fn = commands[cmd];
        const result = fn ? fn() : `bash: ${cmd}: command not found\nTry 'help' for available commands.`;
        if (result !== null && result !== undefined) {
          result.split('\n').forEach(line => {
            const p = document.createElement('p');
            p.className = 'resp' + (result.startsWith('✓') || result.includes('PASSED') || result.includes('HIRED') ? ' ok' : '');
            p.innerHTML = line;
            output.appendChild(p);
          });
        }
        output.scrollTop = output.scrollHeight;
      }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; } }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > 0) { histIdx--; input.value = history[histIdx]; } else { histIdx = -1; input.value = ''; } }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTerminal);
  else initTerminal();
})();

(function () {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('formSubmitBtn');
  const btnTxt = document.getElementById('formBtnText');
  const status = document.getElementById('formStatus');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btnTxt.textContent = 'TRANSMITTING...';
    status.textContent = '';
    status.className = 'form-status';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if (res.ok) { status.textContent = '✓ Message transmitted successfully. Aditya will respond shortly.'; status.className = 'form-status ok'; form.reset(); }
      else throw new Error('Server error');
    } catch { status.textContent = '✗ Transmission failed. Please email directly.'; status.className = 'form-status err'; }
    finally { btn.disabled = false; btnTxt.textContent = 'TRANSMIT MESSAGE'; }
  });
})();
