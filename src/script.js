document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. MOBILE NAVIGATION MENU TOGGLE
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* ==========================================================================
       3. WEDDING COUNTDOWN TIMER
       ========================================================================== */
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const targetDateString = countdownElement.getAttribute('data-date');
        const targetDate = new Date(targetDateString).getTime();

        const daysVal = document.getElementById('days');
        const hoursVal = document.getElementById('hours');
        const minutesVal = document.getElementById('minutes');
        const secondsVal = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            // If the countdown is over, display zeros or wedding message
            if (distance < 0) {
                if (daysVal) daysVal.innerText = '00';
                if (hoursVal) hoursVal.innerText = '00';
                if (minutesVal) minutesVal.innerText = '00';
                if (secondsVal) secondsVal.innerText = '00';
                
                // Optional: Update title of the countdown
                const subtitle = document.querySelector('.hero-subtitle');
                if (subtitle) {
                    subtitle.innerText = "Just Married! ❤️";
                }
                return;
            }

            // Calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Format numbers: pad with leading zero
            if (daysVal) daysVal.innerText = days.toString().padStart(2, '0');
            if (hoursVal) hoursVal.innerText = hours.toString().padStart(2, '0');
            if (minutesVal) minutesVal.innerText = minutes.toString().padStart(2, '0');
            if (secondsVal) secondsVal.innerText = seconds.toString().padStart(2, '0');
        }

        // Run immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const animateElements = document.querySelectorAll('.animate-on-scroll, .timeline-item');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.15 // trigger when 15% of the element is visible
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target); // only animate once
                }
            });
        }, observerOptions);

        animateElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(el => el.classList.add('show'));
    }

    /* ==========================================================================
       5. RSVP FORM INTERACTIONS
       ========================================================================== */
    // Replace with the deployment URL of your Google Apps Script Web App (see tools/ setup notes).
    const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbz0ycuITjxyoe6_gGyglXv3FBDETObPN-zBHlArdowPrlVItHQPPmopZ0lz4xGm8iLjyA/exec";

    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const successText = document.getElementById('successText');
    const resetRsvpBtn = document.getElementById('resetRsvp');
    const plusOneCheckbox = document.getElementById('plusOne');
    const plusOneDetails = document.getElementById('plusOneDetails');
    const submitBtn = document.getElementById('submitBtn');

    // Toggle the plus-one name field when the plus-one checkbox is ticked
    if (plusOneCheckbox && plusOneDetails) {
        plusOneCheckbox.addEventListener('change', () => {
            if (plusOneCheckbox.checked) {
                plusOneDetails.classList.add('open');
            } else {
                plusOneDetails.classList.remove('open');
            }
        });
    }

    // Form Submission Handling
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Perform simple validation
            const name = document.getElementById('guestName').value.trim();
            const email = document.getElementById('guestEmail').value.trim();

            if (!name || !email) {
                alert('Please fill out all required fields.');
                return;
            }

            const attendingWedding = document.getElementById('attendWedding')?.checked || false;
            const attendingHytta = document.getElementById('attendHytta')?.checked || false;
            const bringingPlusOne = plusOneCheckbox?.checked || false;
            const plusOneName = document.getElementById('plusOneName').value.trim();
            const plusOneDietary = document.getElementById('plusOneDietary').value.trim();
            const dietary = document.getElementById('dietary').value.trim();

            // Put button into loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const params = new URLSearchParams();
                params.append('name', name);
                params.append('email', email);
                params.append('attending_wedding', attendingWedding ? 'Yes' : 'No');
                params.append('attending_hytta', attendingHytta ? 'Yes' : 'No');
                params.append('plus_one', bringingPlusOne ? 'Yes' : 'No');
                params.append('plus_one_name', bringingPlusOne ? plusOneName : '');
                params.append('dietary', dietary);
                params.append('plus_one_dietary', bringingPlusOne ? plusOneDietary : '');

                await fetch(RSVP_ENDPOINT, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: params
                });

                // Clear loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Customize the success message based on attendance choices
                const selectedEvents = [];
                if (attendingWedding) selectedEvents.push('the Wedding (Wed Jun 9)');
                if (attendingHytta) selectedEvents.push('the Hytta (Thu–Sun)');

                let eventSummary = '';
                if (selectedEvents.length > 0) {
                    eventSummary = ` We look forward to seeing you at: ${selectedEvents.join(' and ')}.`;
                    if (bringingPlusOne && plusOneName) {
                        eventSummary += ` We've noted your plus one, ${plusOneName}.`;
                    }
                    successText.innerText = `We are so excited to celebrate with you, ${name}!${eventSummary} Your response has been saved.`;
                } else {
                    successText.innerText = `Thank you for letting us know, ${name}. We will miss you, but wish you all the best!`;
                }

                // Hide form and show success card with animations
                rsvpForm.classList.add('fade-out');
                setTimeout(() => {
                    rsvpForm.classList.add('hidden'); // absolute display none after fade-out
                    rsvpSuccess.classList.remove('hidden');
                }, 500);
            } catch (err) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                alert('Something went wrong sending your RSVP. Please check your connection and try again.');
            }
        });
    }

    // Reset Form for edits/updates
    if (resetRsvpBtn) {
        resetRsvpBtn.addEventListener('click', () => {
            rsvpSuccess.classList.add('hidden');
            rsvpForm.classList.remove('hidden');
            rsvpForm.classList.remove('fade-out');
            rsvpForm.reset();
            plusOneDetails.classList.remove('open');
        });
    }
});
