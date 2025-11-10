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
                inputs.forEach(input => input.classList.remove("filled")); // reset floating labels
            })
            .catch((err) => {
                console.error(err);
                alert("Oops! Something went wrong. Please try again.");
            });
    });

    
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.add("filled");
            } else {
                input.classList.remove("filled");
            }
        });
    });
});