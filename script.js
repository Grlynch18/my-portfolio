// Init EmailJS
emailjs.init("pXhcmGhi2ZodFCjFc");

document.addEventListener("DOMContentLoaded", () => {
    const form      = document.querySelector(".cont-container");
    const inputs    = form.querySelectorAll("input");
    const submitBtn = form.querySelector(".message-btn");
    const nav       = document.querySelector("nav");
    const header    = document.querySelector("header");

    // ─── STICKY NAVBAR ───────────────────────────────────────
    // Use rAF to batch scroll reads — prevents forced reflow on every scroll event
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY > 80;
                nav.classList.toggle("scrolled", scrolled);
                header.classList.toggle("scrolled", scrolled);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // passive: true lets browser scroll without waiting for JS

    // ─── HAMBURGER MENU ──────────────────────────────────────
    const hamburger = document.querySelector(".hamburger");
    const navLinks  = document.querySelector(".nav-links");

    const toggleMenu = (force) => {
        const isOpen = typeof force === "boolean"
            ? force
            : !hamburger.classList.contains("active");
        hamburger.classList.toggle("active", isOpen);
        navLinks.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
    };

    hamburger.addEventListener("click", () => toggleMenu());

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) toggleMenu(false);
        });
    });

    // Close on outside tap (mobile UX)
    document.addEventListener("click", (e) => {
        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            toggleMenu(false);
        }
    });

    // ─── FORM VALIDATION & SUBMISSION ────────────────────────
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let valid = true;

        inputs.forEach(input => {
            const ok = input.value.trim() !== "";
            input.style.borderColor = ok ? "#ddd" : "#FF6B6B";
            if (!ok) valid = false;
        });

        const emailInput = form.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = "#FF6B6B";
            valid = false;
        }

        if (!valid) return;

        if (!navigator.onLine) {
            setBtn("Failed", "failed", true);
            resetBtn(3000);
            return;
        }

        setBtn("Sending...", "sending", true);

        try {
            await emailjs.sendForm("service_d2homxm", "template_5ugbfmu", form);
            setBtn("Sent!", "sent", true);
            form.reset();
            inputs.forEach(input => {
                input.style.borderColor = "#ddd";
                input.classList.remove("filled");
            });
        } catch (err) {
            console.error(err);
            setBtn("Failed", "failed", true);
        }

        resetBtn(3000);
    });

    function setBtn(text, cls, disabled) {
        submitBtn.textContent = text;
        submitBtn.className   = "message-btn " + cls;
        submitBtn.disabled    = disabled;
    }

    function resetBtn(delay) {
        setTimeout(() => {
            submitBtn.textContent = "Send Message";
            submitBtn.className   = "message-btn";
            submitBtn.disabled    = false;
        }, delay);
    }

    // ─── FLOATING LABEL ──────────────────────────────────────
    inputs.forEach(input => {
        const update = () => input.classList.toggle("filled", input.value.trim() !== "");
        input.addEventListener("input",  update);
        input.addEventListener("change", update); // catches autofill
    });

    // ─── MOBILE: TAP-TO-REVEAL PROJECT CARDS ─────────────────
    // On touch devices, a tap on a card reveals the overlay (like hover on desktop).
    // A second tap on a link inside works normally. Tapping outside closes.
    const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (!isTouchDevice()) return; // desktop — CSS hover handles it

            const isLink = e.target.closest(".project-link");

            if (!card.classList.contains("tapped")) {
                // First tap — reveal overlay, block the link click
                e.preventDefault();
                // Close any other open cards
                document.querySelectorAll(".project-card.tapped").forEach(c => {
                    if (c !== card) c.classList.remove("tapped");
                });
                card.classList.add("tapped");
            }
            // If already tapped and user tapped a link — let it through naturally
        });
    });

    // Tap outside any card → close all
    document.addEventListener("click", (e) => {
        if (!isTouchDevice()) return;
        if (!e.target.closest(".project-card")) {
            document.querySelectorAll(".project-card.tapped").forEach(c => c.classList.remove("tapped"));
        }
    });

    // ─── SCROLL REVEAL ───────────────────────────────────────
    // Single IntersectionObserver for everything — lean and efficient
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.add("show");

            // Stagger children if needed
            const children = el.querySelectorAll(
                ".tech-category, .project-card, .container"
            );
            children.forEach((child, i) => {
                child.style.setProperty("--i", i);
            });

            // Stop observing — no need to re-trigger
            obs.unobserve(el);
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    });

    // Observe all hidden elements
    document.querySelectorAll(".hidden").forEach(el => {
        revealObserver.observe(el);
    });

});