/* ============================================
   SHARPCUTS — script.js
   Maxwell Mutari Mbugua — 220882
============================================ */

document.addEventListener('DOMContentLoaded', function() {

    /* ============================================
       SHARED VALIDATORS
       Used by both bookingForm and contactForm
    ============================================ */

    function validateName(value, errorId) {
        if (value === "") {
            document.getElementById(errorId).textContent = "Full name is required.";
            return false;
        } else if (value.length < 3) {
            document.getElementById(errorId).textContent = "Name must be at least 3 characters long.";
            return false;
        } else if (!/^[a-zA-Z\s']+$/.test(value)) {
            document.getElementById(errorId).textContent = "Name can only contain letters, spaces and apostrophes.";
            return false;
        }
        return true;
    }

    function validatePhone(value, errorId) {
        if (value === "") {
            document.getElementById(errorId).textContent = "Phone number is required.";
            return false;
        } else if (!/^(0\d{9}|\+254\d{9})$/.test(value)) {
            document.getElementById(errorId).textContent = "Enter a valid number starting with 0, 10 digits total.";
            return false;
        }
        return true;
    }

    function validateEmail(value, errorId) {
        if (value === "") {
            document.getElementById(errorId).textContent = "Email is required.";
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            document.getElementById(errorId).textContent = "Please enter a valid email address.";
            return false;
        }
        return true;
    }


    /* ============================================
       SERVICES FILTER
       Used on: services.html
    ============================================ */

    function filterServices(category) {
        const rows = document.querySelectorAll("#services-table tr");
        let visibleCount = 0;

        document.querySelectorAll("[data-filter]").forEach(button => {
            button.classList.remove("filter-active");
        });

        document
            .querySelector(`[data-filter="${category}"]`)
            .classList.add("filter-active");

        rows.forEach(row => {
            if (category === "all" || row.dataset.category === category) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        const noResults = document.getElementById("no-results");
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    window.filterServices = filterServices;


    /* ============================================
       GALLERY FILTER
       Used on: gallery.html
    ============================================ */

    function filterGallery(category) {
        const items = document.querySelectorAll("#gallery-grid > div");
        let visibleCount = 0;

        document.querySelectorAll("[data-filter]").forEach(button => {
            button.classList.remove("filter-active");
        });

        document
            .querySelector(`[data-filter="${category}"]`)
            .classList.add("filter-active");

        items.forEach(item => {
            if (category === "all" || item.dataset.category === category) {
                item.style.display = "";
                visibleCount++;
            } else {
                item.style.display = "none";
            }
        });

        const noResults = document.getElementById("no-results");
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }
    
    window.filterGallery = filterGallery;


    /* ============================================
       DYNAMIC TIME SLOTS BASED ON DAY OF WEEK
       Used on: booking.html
    ============================================ */

    const dateInput = document.getElementById("date");
    const timeSelect = document.getElementById("time");

    if (dateInput && timeSelect) {
        dateInput.addEventListener("change", function() {
            const selectedDate = new Date(dateInput.value);
            const dayOfWeek = selectedDate.getDay();

            const weekdaySlots = [
                "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
            ];
            const sundaySlots = [
                "10:00 AM", "11:00 AM", "12:00 PM",
                "1:00 PM", "2:00 PM", "3:00 PM"
            ];

            const slotsToShow = (dayOfWeek === 0) ? sundaySlots : weekdaySlots;

            timeSelect.innerHTML = "";

            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Select a time";
            timeSelect.appendChild(placeholder);

            slotsToShow.forEach(function(slot) {
                const option = document.createElement("option");
                option.value = slot;
                option.textContent = slot;
                timeSelect.appendChild(option);
            });
        });
    }


    /* ============================================
       BOOKING FORM VALIDATION
       Used on: booking.html
    ============================================ */

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        const bookingFields = bookingForm.querySelectorAll("input, select, textarea");

        bookingFields.forEach(function(field, index) {
            field.addEventListener("keydown", function(e) {
                if (e.key === "Enter" && field.tagName !== "TEXTAREA") {
                    e.preventDefault();

                    let currentValid = true;

                    // Clear previous error for this field first
                    if (field.id === "full_name") {
                        document.getElementById("nameError").textContent = "";
                        currentValid = validateName(field.value.trim(), "nameError");
                    } else if (field.id === "phone") {
                        document.getElementById("phoneError").textContent = "";
                        currentValid = validatePhone(field.value.trim(), "phoneError");
                    } else if (field.id === "email") {
                        document.getElementById("emailError").textContent = "";
                        currentValid = validateEmail(field.value.trim(), "emailError");
                    } else if (field.id === "service") {
                        document.getElementById("serviceError").textContent = "";
                        if (field.value === "") {
                            document.getElementById("serviceError").textContent = "Please choose a service.";
                            currentValid = false;
                        }
                    } else if (field.id === "date") {
                        document.getElementById("dateError").textContent = "";
                        if (field.value === "") {
                            document.getElementById("dateError").textContent = "Please choose a date.";
                            currentValid = false;
                        }
                    } else if (field.id === "time") {
                        document.getElementById("timeError").textContent = "";
                        if (field.value === "") {
                            document.getElementById("timeError").textContent = "Please choose a time.";
                            currentValid = false;
                        }
                    }

                    // Only move to next field if current is valid
                    if (currentValid) {
                        const next = bookingFields[index + 1];
                        if (next) next.focus();
                    }
                }
            });
        });

        bookingForm.addEventListener("submit", function(event) {
            event.preventDefault();

            document.getElementById("message").textContent = "";
            document.getElementById("nameError").textContent = "";
            document.getElementById("phoneError").textContent = "";
            document.getElementById("emailError").textContent = "";
            document.getElementById("serviceError").textContent = "";
            document.getElementById("dateError").textContent = "";
            document.getElementById("timeError").textContent = "";
            document.getElementById("successMessage").textContent = "";

            let isValid = true;

            if (!validateName(document.getElementById("full_name").value.trim(), "nameError")) isValid = false;
            if (!validatePhone(document.getElementById("phone").value.trim(), "phoneError")) isValid = false;
            if (!validateEmail(document.getElementById("email").value.trim(), "emailError")) isValid = false;

            const service = document.getElementById("service").value;
            if (service === "") {
                document.getElementById("serviceError").textContent = "Please choose a service.";
                isValid = false;
            }

            const date = document.getElementById("date").value;
            if (date === "") {
                document.getElementById("dateError").textContent = "Please choose a date.";
                isValid = false;
            }

            const time = document.getElementById("time").value;
            if (time === "") {
                document.getElementById("timeError").textContent = "Please choose a time.";
                isValid = false;
            }

            if (isValid) {
                const phone = document.getElementById("phone").value.trim();
                document.getElementById("successMessage").textContent =
                    "Booking received! We will contact you at " + phone + " to confirm.";
                bookingForm.reset();
            } else {
                document.getElementById("message").textContent =
                    "Please correct the errors above and try again.";
            }
        });
    }


    /* ============================================
       CONTACT FORM VALIDATION
       Used on: contact.html
    ============================================ */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        const contactFields = contactForm.querySelectorAll("input, select, textarea");

        contactFields.forEach(function(field, index) {
            field.addEventListener("keydown", function(e) {
                if (e.key === "Enter" && field.tagName !== "TEXTAREA") {
                    e.preventDefault();

                    let currentValid = true;

                    // Clear previous error for this field first
                    if (field.id === "full_name") {
                        document.getElementById("nameError").textContent = "";
                        currentValid = validateName(field.value.trim(), "nameError");
                    } else if (field.id === "phone") {
                        document.getElementById("phoneError").textContent = "";
                        currentValid = validatePhone(field.value.trim(), "phoneError");
                    } else if (field.id === "email") {
                        document.getElementById("emailError").textContent = "";
                        currentValid = validateEmail(field.value.trim(), "emailError");
                    } else if (field.id === "subject") {
                        document.getElementById("subjectError").textContent = "";
                        if (field.value === "") {
                            document.getElementById("subjectError").textContent = "Please select a subject.";
                            currentValid = false;
                        }
                    }

                    // Only move to next field if current is valid
                    if (currentValid) {
                        const next = contactFields[index + 1];
                        if (next) next.focus();
                    }
                }
            });
        });

        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            document.getElementById("nameError").textContent = "";
            document.getElementById("phoneError").textContent = "";
            document.getElementById("emailError").textContent = "";
            document.getElementById("subjectError").textContent = "";
            document.getElementById("messageError").textContent = "";
            document.getElementById("message").textContent = "";
            document.getElementById("contactSuccess").textContent = "";

            let isValid = true;

            if (!validateName(document.getElementById("full_name").value.trim(), "nameError")) isValid = false;
            if (!validatePhone(document.getElementById("phone").value.trim(), "phoneError")) isValid = false;
            if (!validateEmail(document.getElementById("email").value.trim(), "emailError")) isValid = false;

            const subject = document.getElementById("subject").value;
            if (subject === "") {
                document.getElementById("subjectError").textContent = "Please select a subject.";
                isValid = false;
            }

            const messageText = document.getElementById("message_box").value.trim();
            if (messageText === "") {
                document.getElementById("messageError").textContent = "Please enter a message.";
                isValid = false;
            } else if (messageText.length < 10) {
                document.getElementById("messageError").textContent = "Message must be at least 10 characters.";
                isValid = false;
            }

            if (isValid) {
                const email = document.getElementById("email").value.trim();
                document.getElementById("contactSuccess").textContent =
                    "Message sent! We will get back to you at " + email + ".";
                contactForm.reset();
            } else {
                document.getElementById("message").textContent =
                    "Please correct the errors above and try again.";
            }
        });
    }


    /* ============================================
       AUTO-UPDATE FOOTER YEAR
       Used on: every page
    ============================================ */

    const yearElements = document.querySelectorAll(".footer-year");
    const currentYear = new Date().getFullYear();
    yearElements.forEach(function(el) {
        el.textContent = currentYear;
    });

    /* ============================================
        WELCOME PAGE
        Used on: welcome.html only
    ============================================ */
    const welcome = document.querySelector(".welcome");
    const welcomeContent = document.querySelector(".welcome-content");

    if (welcome && welcomeContent) {
        setTimeout(function() {
            welcome.classList.add("visible");
            welcomeContent.classList.add("visible");
        }, 300);
    }
    console.log("SharpCuts script loaded successfully.");

}); // end DOMContentLoaded