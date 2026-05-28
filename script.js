/* ═══════════════════════════════════════════════════
   ADEMIDE ADEDEJI — PORTFOLIO JAVASCRIPT
   Handles: cursor, typewriter, particles, navbar,
   counters, scroll reveal, form, theme toggle
═══════════════════════════════════════════════════ */

// ── Init EmailJS ──────────────────────────────────
emailjs.init("pXhcmGhi2ZodFCjFc");

document.addEventListener("DOMContentLoaded", () => {

  /* ─────────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────────── */
  const cursor         = document.getElementById("cursor");
  const cursorFollower = document.getElementById("cursorFollower");

  if (cursor && cursorFollower && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top  = mouseY + "px";
    }, { passive: true });

    // Smooth follower via rAF
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = followerX + "px";
      cursorFollower.style.top  = followerY + "px";
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Hover state on interactive elements
    const hoverTargets = "a, button, .project-card, .tech-cat-card, .about-card, .contact-link-item, .tl-content";
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      cursorFollower.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "1";
    });
  }

  /* ─────────────────────────────────────────────
     2. THEME TOGGLE
  ───────────────────────────────────────────── */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon   = document.getElementById("themeIcon");
  const html        = document.documentElement;

  // Persist preference
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "dark"
      ? "bi bi-moon-stars-fill"
      : "bi bi-sun-fill";
  }

  /* ─────────────────────────────────────────────
     3. NAVBAR — scroll shrink + active link
  ───────────────────────────────────────────── */
  const header  = document.getElementById("header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  let navTicking = false;
  window.addEventListener("scroll", () => {
    if (!navTicking) {
      requestAnimationFrame(() => {
        header?.classList.toggle("scrolled", window.scrollY > 60);
        highlightActiveLink();
        navTicking = false;
      });
      navTicking = true;
    }
  }, { passive: true });

  function highlightActiveLink() {
    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  /* ─────────────────────────────────────────────
     4. HAMBURGER MOBILE MENU
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.getElementById("navLinks");

  const toggleMenu = (force) => {
    const open = typeof force === "boolean"
      ? force
      : !hamburger.classList.contains("active");
    hamburger.classList.toggle("active", open);
    navLinksEl.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
  };

  hamburger?.addEventListener("click", () => toggleMenu());

  navLinksEl?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (
      navLinksEl?.classList.contains("open") &&
      !navLinksEl.contains(e.target) &&
      !hamburger?.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  /* ─────────────────────────────────────────────
     5. TYPEWRITER EFFECT
  ───────────────────────────────────────────── */
  const roleEl = document.getElementById("roleText");
  const phrases = [
    "intelligent web apps.",
    "AI automation tools.",
    "Telegram bots.",
    "scalable backends.",
    "digital experiences.",
  ];

  if (roleEl) {
    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let isPausing   = false;

    const type = () => {
      if (isPausing) return;

      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        roleEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isPausing = true;
          setTimeout(() => { isPausing = false; isDeleting = true; type(); }, 2200);
          return;
        }
        setTimeout(type, 65);
      } else {
        charIndex--;
        roleEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      }
    };

    // Start after a short delay for polish
    setTimeout(type, 1200);
  }

  /* ─────────────────────────────────────────────
     6. PARTICLE CANVAS
  ───────────────────────────────────────────── */
  const canvas  = document.getElementById("particleCanvas");
  const ctx     = canvas?.getContext("2d");

  if (canvas && ctx) {
    let particles = [];
    const PARTICLE_COUNT = 60;

    const resize = () => {
      canvas.width  = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x   = Math.random() * canvas.width;
        this.y   = Math.random() * canvas.height;
        this.vx  = (Math.random() - 0.5) * 0.4;
        this.vy  = (Math.random() - 0.5) * 0.4;
        this.r   = Math.random() * 1.8 + 0.4;
        this.a   = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? "108,142,255" : "167,139,250";
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.a})`;
        ctx.fill();
      }
    }

    // Init
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Draw connecting lines between close particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108,142,255,${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animId = requestAnimationFrame(animate);
    };
    animate();

    // Pause when tab hidden to save resources
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animate();
    });
  }

  /* ─────────────────────────────────────────────
     7. SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      obs.unobserve(entry.target);
    });
  }, {
    threshold:  0.08,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll(".reveal-up").forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────────
     8. ANIMATED COUNTERS
  ───────────────────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute("data-count"), 10);
      animateCounter(el, target);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────────
     9. CONTACT FORM
  ───────────────────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const submitBtn   = document.getElementById("submitBtn");

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    contactForm.querySelectorAll("input, textarea").forEach(field => {
      const ok = field.value.trim() !== "";
      field.style.borderColor = ok ? "" : "rgba(239,68,68,0.7)";
      if (!ok) valid = false;
    });

    // Email format check
    const emailField = contactForm.querySelector('input[type="email"]');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField?.value ?? "");
    if (!emailOk) {
      emailField.style.borderColor = "rgba(239,68,68,0.7)";
      valid = false;
    }

    if (!valid) {
      // Shake animation
      contactForm.style.animation = "none";
      requestAnimationFrame(() => {
        contactForm.style.animation = "shake 0.4s ease";
      });
      return;
    }

    if (!navigator.onLine) {
      setSubmitState("failed", "No Connection");
      resetSubmitState(3000);
      return;
    }

    setSubmitState("sending", "Sending...");

    try {
      await emailjs.sendForm("service_d2homxm", "template_5ugbfmu", contactForm);
      setSubmitState("sent", "Message Sent!");
      contactForm.reset();
      // Clear field styles
      contactForm.querySelectorAll("input, textarea").forEach(f => f.style.borderColor = "");
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitState("failed", "Failed — Try Again");
    }

    resetSubmitState(3500);
  });

  function setSubmitState(cls, label) {
    if (!submitBtn) return;
    submitBtn.querySelector("span").textContent = label;
    submitBtn.className = `btn-liquid btn-submit-liquid ${cls}`;
    submitBtn.disabled  = true;
  }

  function resetSubmitState(delay) {
    setTimeout(() => {
      if (!submitBtn) return;
      submitBtn.querySelector("span").textContent = "Send Message";
      submitBtn.className = "btn-liquid btn-submit-liquid";
      submitBtn.disabled  = false;
    }, delay);
  }

  // Clear red border on input
  contactForm?.querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("input", () => { field.style.borderColor = ""; });
  });

  /* ─────────────────────────────────────────────
     10. SMOOTH SCROLL for nav links
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ─────────────────────────────────────────────
     11. MAGNETIC BUTTON EFFECT (desktop only)
  ───────────────────────────────────────────── */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn-liquid").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect   = btn.getBoundingClientRect();
        const x      = e.clientX - rect.left - rect.width  / 2;
        const y      = e.clientY - rect.top  - rect.height / 2;
        const factor = 0.25;
        btn.style.transform = `translate(${x * factor}px, ${y * factor}px) scale(1.03)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ─────────────────────────────────────────────
     12. HERO CARD TILT (subtle mouse parallax)
  ───────────────────────────────────────────── */
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const rx =  ((e.clientY - cy) / cy) * 5;
      const ry = -((e.clientX - cx) / cx) * 5;
      heroVisual.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     13. PAGE LOAD REVEAL — body fade in
  ───────────────────────────────────────────── */
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = "1";
    });
  });

}); // end DOMContentLoaded


/* ─────────────────────────────────────────────────
   CSS KEYFRAME FOR SHAKE (injected dynamically)
───────────────────────────────────────────────── */
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);