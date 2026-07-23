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
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const successText = document.getElementById('successText');
    const resetRsvpBtn = document.getElementById('resetRsvp');
    const attendingDetails = document.getElementById('attendingDetails');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const submitBtn = document.getElementById('submitBtn');

    // Toggle details (dietary, song) based on attendance response
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'attending') {
                attendingDetails.classList.add('open');
                document.getElementById('dietary').required = false;
            } else {
                attendingDetails.classList.remove('open');
            }
        });
    });

    // Initialize opening state based on default selection (attending)
    const checkedAttendance = document.querySelector('input[name="attendance"]:checked');
    if (checkedAttendance && checkedAttendance.value === 'attending') {
        attendingDetails.classList.add('open');
    }

    // Form Submission Handling
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation
            const name = document.getElementById('guestName').value.trim();
            const email = document.getElementById('guestEmail').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked').value;

            if (!name || !email) {
                alert('Please fill out all required fields.');
                return;
            }

            // Put button into loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate server network latency (1.5 seconds)
            setTimeout(() => {
                // Clear loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Customize the success message based on attendance choice
                if (attendance === 'attending') {
                    const selectedEvents = [];
                    if (document.getElementById('eventWedding')?.checked) selectedEvents.push("Wedding Ceremony & Dinner (Wed Jun 9)");
                    if (document.getElementById('eventHamarCabin')?.checked) selectedEvents.push("Hamar Cabin Stay (Fri–Sun)");
                    if (document.getElementById('eventFestival')?.checked) selectedEvents.push("Hamar Medieval Festival (Sat Jun 12)");

                    let eventSummary = "";
                    if (selectedEvents.length > 0) {
                        eventSummary = ` You are registered for: ${selectedEvents.join(", ")}.`;
                    }

                    successText.innerText = `We are so excited to celebrate with you, ${name}!${eventSummary} Your response has been saved.`;
                } else {
                    successText.innerText = `Thank you for letting us know, ${name}. We will miss you at the wedding, but wish you all the best!`;
                }

                // Hide form and show success card with animations
                rsvpForm.classList.add('fade-out');
                setTimeout(() => {
                    rsvpForm.classList.add('hidden'); // absolute display none after fade-out
                    rsvpSuccess.classList.remove('hidden');
                }, 500);

            }, 1500);
        });
    }

    // Reset Form for edits/updates
    if (resetRsvpBtn) {
        resetRsvpBtn.addEventListener('click', () => {
            rsvpSuccess.classList.add('hidden');
            rsvpForm.classList.remove('hidden');
            rsvpForm.classList.remove('fade-out');
            rsvpForm.reset();
            
            // Set details section state back to visible (since form resets to default "attending")
            attendingDetails.classList.add('open');
        });
    }
});
