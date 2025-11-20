// Init EmailJS
emailjs.init("pXhcmGhi2ZodFCjFc");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".cont-container");
    const inputs = form.querySelectorAll("input");
    const submitBtn = form.querySelector(".message-btn");
    const nav = document.querySelector("nav");
    const header = document.querySelector("header");

    // --- STICKY NAVBAR WITH BLUR EFFECT ON SCROLL ---
    let lastScroll = 0;
    
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 80) {
            nav.classList.add("scrolled");
            header.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
            header.classList.remove("scrolled");
        }
        
        lastScroll = currentScroll;
    });

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    const toggleMenu = () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    };

    hamburger.addEventListener("click", toggleMenu);

    // Close menu when a link is clicked (for better mobile UX)
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                toggleMenu();
            }
        });
    });

    // --- Form Handling and Validation ---
    
    // Handle form submission with button state changes
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let valid = true;

        // Basic validation
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = "#FF6B6B";
                valid = false;
            } else {
                input.style.borderColor = "#bbb";
            }
        });

        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = "#FF6B6B";
            valid = false;
        }

        if (!valid) {
            alert("Please fill all fields correctly.");
            return;
        }

        // Check internet connectivity
        if (!navigator.onLine) {
            submitBtn.textContent = "Failed";
            submitBtn.classList.remove("sending", "sent");
            submitBtn.classList.add("failed");
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = "Send Message";
                submitBtn.classList.remove("failed");
                submitBtn.disabled = false;
            }, 3000);
            return;
        }

        // Change button to "Sending..." state
        submitBtn.textContent = "Sending...";
        submitBtn.classList.add("sending");
        submitBtn.disabled = true;

        try {
            // Send email via EmailJS
            await emailjs.sendForm('service_d2homxm', 'template_5ugbfmu', form);
            
            // Success state - change to "Sent!"
            submitBtn.textContent = "Sent!";
            submitBtn.classList.remove("sending");
            submitBtn.classList.add("sent");
            
            // Reset form
            form.reset();
            inputs.forEach(input => {
                input.style.borderColor = "#bbb";
                input.classList.remove("filled");
            });
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = "Send Message";
                submitBtn.classList.remove("sent");
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (err) {
            console.error(err);
            
            // Error state - change to "Failed"
            submitBtn.textContent = "Failed";
            submitBtn.classList.remove("sending");
            submitBtn.classList.add("failed");
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = "Send Message";
                submitBtn.classList.remove("failed");
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    
    // Floating label logic
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.add("filled");
            } else {
                input.classList.remove("filled");
            }
        });
    });

    // ---------------------------------------------
    // --- SCROLL REVEAL ANIMATION LOGIC ---
    // ---------------------------------------------
    const hiddenElements = document.querySelectorAll(".hidden");

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                handleStaggeredChildren(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const handleStaggeredChildren = (parent) => {
        let childrenToStagger = [];

        if (parent.classList.contains("tech-categories")) {
            childrenToStagger = parent.querySelectorAll(".tech-category");
        } else if (parent.classList.contains("projects-grid")) {
            childrenToStagger = parent.querySelectorAll(".project-card");
        } else if (parent.classList.contains("timeline")) {
            childrenToStagger = parent.querySelectorAll(".container"); 
        }

        childrenToStagger.forEach((child, index) => {
            child.style.setProperty('--i', index); 
            child.classList.add("show");
        });
    };
    
    hiddenElements.forEach(el => {
        el.classList.add("hidden"); 
        
        if (el.classList.contains("tech-categories") || el.classList.contains("projects-grid") || el.classList.contains("timeline")) {
            observer.observe(el);
            el.querySelectorAll('.tech-category, .project-card, .container').forEach(child => {
                child.classList.remove("hidden");
                child.classList.add("hidden");
            });
        } else {
            observer.observe(el);
        }
    });

});