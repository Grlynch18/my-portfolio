// Init EmailJS
emailjs.init("pXhcmGhi2ZodFCjFc");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".cont-container");
    const inputs = form.querySelectorAll("input");

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
    
    // Handle form submission
    form.addEventListener("submit", (e) => {
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

        // Send email via EmailJS
        emailjs.sendForm('service_d2homxm', 'template_5ugbfmu', form)
            .then(() => {
                alert("Message sent successfully!");
                form.reset();
                inputs.forEach(input => input.style.borderColor = "#bbb");
                // Remove the 'filled' class on reset to move labels back
                inputs.forEach(input => input.classList.remove("filled")); 
            })
            .catch((err) => {
                console.error(err);
                alert("Oops! Something went wrong. Please try again.");
            });
    });

    
    // Floating label logic
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            // This is primarily handled by the :not(:placeholder-shown) in CSS, 
            // but keeping this for potential cross-browser or complex state management
            if (input.value.trim() !== "") {
                input.classList.add("filled");
            } else {
                input.classList.remove("filled");
            }
        });
    });

    // ---------------------------------------------
    // --- SCROLL REVEAL ANIMATION LOGIC (NEW CODE) ---
    // ---------------------------------------------
    const hiddenElements = document.querySelectorAll(".hidden");

    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'show' class to start the transition
                entry.target.classList.add("show");
                
                // Handle staggered children animations
                handleStaggeredChildren(entry.target);
                
                // Stop observing once it has been revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Function to apply staggering to children elements
    const handleStaggeredChildren = (parent) => {
        let childrenToStagger = [];

        // Check for specific parents that require staggering
        if (parent.classList.contains("tech-categories")) {
            childrenToStagger = parent.querySelectorAll(".tech-category");
        } else if (parent.classList.contains("projects-grid")) {
            childrenToStagger = parent.querySelectorAll(".project-card");
        } else if (parent.classList.contains("timeline")) {
            // Timeline items use the 'container' class
            childrenToStagger = parent.querySelectorAll(".container"); 
        }

        // Apply a custom CSS property (--i) for staggered delay
        childrenToStagger.forEach((child, index) => {
            // Set the transition delay index on the element
            child.style.setProperty('--i', index); 
            // Add 'show' class to children immediately so the CSS transition starts with the calculated delay
            child.classList.add("show");
        });
    };
    
    // Apply initial 'hidden' class and observe elements
    hiddenElements.forEach(el => {
        // Ensure all target elements start hidden
        el.classList.add("hidden"); 
        
        // For parent elements that contain staggered children, only observe the parent
        if (el.classList.contains("tech-categories") || el.classList.contains("projects-grid") || el.classList.contains("timeline")) {
            observer.observe(el);
            // Also ensure the children start hidden (though they inherit from .hidden)
            // and remove the 'hidden' class from the children to let the parent's 'show' handle them via handleStaggeredChildren
            el.querySelectorAll('.tech-category, .project-card, .container').forEach(child => {
                child.classList.remove("hidden");
                child.classList.add("hidden"); // Re-add to ensure initial state is set
            });
        } else {
            // Observe single elements
            observer.observe(el);
        }
    });

});