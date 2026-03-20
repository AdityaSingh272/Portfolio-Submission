(function () {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("nav ul a");

  let isClickScrolling = false;
  let clickScrollTimeout;

  function setActive(id) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === "#" + id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function onScroll() {
    if (isClickScrolling) return;

    let currentId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2) {
        currentId = section.getAttribute("id");
      }
    });

    if (currentId) setActive(currentId);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      setActive(targetId);

      isClickScrolling = true;
      clearTimeout(clickScrollTimeout);

      target.scrollIntoView({ behavior: "smooth" });

      clickScrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });

  window.addEventListener("scroll", onScroll);
  onScroll();
})();


(function () {
  const wrapper = document.querySelector(".terminal-wrapper");
  const terminal = document.querySelector(".terminal-window");
  if (!wrapper || !terminal) return;

  const MAX_TILT = 10;
  const MAX_LIFT = 20;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHovering = false;
  let rafId;

  terminal.style.willChange = "transform";
  terminal.style.transformStyle = "preserve-3d";
  wrapper.style.perspective = "900px";

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
      ${glowX}px ${glowY}px ${30 + 30 * intensity}px rgba(0, 220, 229, ${0.05 + 0.2 * intensity}),
      0 25px 50px rgba(0, 0, 0, 0.6)
    `;

    if (isHovering || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
      rafId = requestAnimationFrame(animate);
    }
  }

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    targetX = y * MAX_TILT;
    targetY = x * MAX_TILT;

    if (!isHovering) {
      isHovering = true;
      cancelAnimationFrame(rafId);
      animate();
    }
  });

  wrapper.addEventListener("mouseleave", () => {
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
  const btn = document.getElementById('navHamburger');
  const menu = document.getElementById('navMobileMenu');
  const icon = document.getElementById('hamburgerIcon');
  const mobileLinks = document.querySelectorAll('.nav-mobile-menu a');
  if (!btn || !menu) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    if (isOpen) {
      menu.classList.add('open');
      icon.textContent = 'close';
    } else {
      menu.classList.remove('open');
      icon.textContent = 'terminal';
    }
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('open');
    icon.textContent = 'terminal';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      mobileLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  const sections = document.querySelectorAll('main section[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 80) {
        currentId = section.getAttribute('id');
      }
    });
    if (currentId) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + currentId));
      mobileLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + currentId));
    }
  });
})();