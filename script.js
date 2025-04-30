document.addEventListener('DOMContentLoaded', function() {
    // Set up background slideshow for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Background images array
        const bgImages = [
            "Assets/bg0.jpeg",
            "Assets/bg1.jpeg",
            "Assets/bg2.jpeg",
            "Assets/bg3.jpeg",
            "Assets/bg4.jpeg",
            "Assets/bg5.jpeg",
            "Assets/bg6.jpeg"
        ];

        let currentImageIndex = 0;
        const bgDivs = []; // Array to hold references to the background divs

        // Basic styling for the hero section
        heroSection.style.position = "relative";
        heroSection.style.marginTop = "1.5rem";
        heroSection.style.overflow = "hidden";

        // --- START: Create Background Layers ---
        // Create and append background divs for each image BUT keep initial opacity 0 for all but first
        bgImages.forEach((imgSrc, index) => {
            const bgDiv = document.createElement('div');
            bgDiv.className = 'hero-bg-slide';
            bgDiv.style.backgroundImage = `url('${imgSrc}')`; // Set the bg image URL
            bgDiv.style.position = 'absolute';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.width = '100%';
            bgDiv.style.height = '100%';
            bgDiv.style.backgroundSize = 'cover';
            bgDiv.style.backgroundPosition = 'center';
            // Start all subsequent images as hidden, first one potentially visible later
            bgDiv.style.opacity = (index === 0) ? '1' : '0';
            bgDiv.style.transition = 'opacity 1.5s ease-in-out';
            bgDiv.style.zIndex = '0';

            heroSection.appendChild(bgDiv);
            bgDivs.push(bgDiv);
        });
        // --- END: Create Background Layers ---


        // --- START: Preload Images and Start Slideshow ---
        let imagesLoadedCount = 0;
        const totalImages = bgImages.length;



        console.log("Preloading background images...");
        bgImages.forEach((imgSrc, index) => {
            const img = new Image();
            img.onload = startSlideshowIfReady; // Increment counter and check if all loaded
            img.onerror = () => {
                console.error(`Failed to load background image: ${imgSrc}`);
                startSlideshowIfReady(); // Still count it so slideshow can start (might miss this image)
            };
            img.src = imgSrc; // Start loading the image
        });

        // Get references to the content elements
        const standardContent = heroSection.querySelector('.hero-standard-content');
        const quoteBox = heroSection.querySelector('.hero-quote-box');
        const poemContent = heroSection.querySelector('#hero-poem-content');
        const haikuContent = heroSection.querySelector('#hero-haiku-content');
        const calendarContent = heroSection.querySelector('#hero-calendar-content');
        const clockWidget = heroSection.querySelector('#hero-clock-widget');

        // --- Clock and Calendar Update Functions ---
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');
        const monthEl = document.getElementById('calendar-month');
        const dayEl = document.getElementById('calendar-day');
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        function updateTimeAndCalendar() {
            const now = new Date();
            const month = now.getMonth();
            const dayOfWeek = now.getDay();
            const dayOfMonth = now.getDate();
            const hours = now.getHours();
            const hoursForClock = hours % 12 === 0 ? 12 : hours % 12; // Convert 0 to 12 for 12hr format
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';

            if (timeEl) {
                timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? '0' + minutes : minutes} <span style="font-size: 1.4rem;">${ampm}</span>`;
            }
            if (dateEl) {
                dateEl.textContent = `${days[dayOfWeek]}, ${months[month]} ${dayOfMonth}`;
            }
            if (monthEl) {
                monthEl.textContent = months[month];
            }
            if (dayEl) {
                dayEl.textContent = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
            }
        }

        // Update time/calendar immediately and then every second
        updateTimeAndCalendar();
        setInterval(updateTimeAndCalendar, 1000);
        // ------------------------------------------

        // Function to update hero content visibility based on index
        function updateHeroContentVisibility(index) {
            // Ensure all elements exist before trying to modify them
            if (!standardContent || !quoteBox || !poemContent || !haikuContent || !calendarContent || !clockWidget) {
                console.error("Hero content elements not found!");
                return;
            }

            // Default: Hide all specific content initially
            standardContent.classList.add('hidden');
            quoteBox.classList.add('hidden');
            poemContent.classList.add('hidden');
            haikuContent.classList.add('hidden');
            calendarContent.classList.add('hidden'); // Hide bg2 elements
            clockWidget.classList.add('hidden'); // Hide bg2 elements

            if (index === 0) { // Show quote box for the first image
                quoteBox.classList.remove('hidden');
            } else if (index === 1) { // Show poem and haiku for the second image
                poemContent.classList.remove('hidden');
                haikuContent.classList.remove('hidden');
            } else if (index === 2) { // Show calendar and clock for the third image
                calendarContent.classList.remove('hidden');
                clockWidget.classList.remove('hidden');
            } else { // Show standard content for other images (currently hidden by CSS)
                // standardContent.classList.remove('hidden');
            }

            void heroSection.offsetWidth;
        }

        // Slideshow function (modified to update content visibility)
        function changeBackground() {
            const previousImageIndex = currentImageIndex;
            currentImageIndex = (currentImageIndex + 1) % bgImages.length;

            // Fade background images
            if (bgDivs[previousImageIndex]) {
                 bgDivs[previousImageIndex].style.opacity = '0';
            }
            if (bgDivs[currentImageIndex]) {
                bgDivs[currentImageIndex].style.opacity = '1';
            }

            // Update content visibility
            updateHeroContentVisibility(currentImageIndex);
        }

        // Initial content visibility setup (after preloading)
        function startSlideshowIfReady() {
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImages) {
                console.log("All background images preloaded. Starting slideshow.");
                // Set initial content visibility based on the starting image (index 0)
                updateHeroContentVisibility(currentImageIndex); // This will now correctly show the quote box first
                // Ensure the first background image div is visible
                if (bgDivs.length > 0) {
                   bgDivs[0].style.opacity = '1';
                }
                // Start the interval timer
                setInterval(changeBackground, 7000);
            }
        }
        // --- END: Preload Images and Start Slideshow ---

    } // End of if (heroSection)

    // Ensure hero content is above the background layers (Keep as is)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.position = "relative";
        heroContent.style.zIndex = "1";
    }

    // --- Rest of your existing JavaScript code ---
    // (Typing animation, newsletter fade, mobile menu, stats, trends, news rendering, filters, load more, form submission)
    // Make sure all necessary checks (if elements exist) and variable scopes are correct as refined previously.

    // Typing animation...
    const noteContent = document.querySelector('.note-content p');
    if (noteContent) { /* ... rest of typing animation code ... */
        const text = noteContent.textContent;
        noteContent.textContent = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                noteContent.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                noteContent.style.borderRight = 'none';
            }
        }, 50);
    }


    // Fade in animation for newsletter...
     const newsletterElements = document.querySelectorAll('.newsletter-content h3, .newsletter-content p');
    newsletterElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 500 + 500);
    });


    // Mobile menu functionality...
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) { /* ... rest of mobile menu code ... */
        const mobileMenuContent = document.createElement('div');
        mobileMenuContent.className = 'mobile-menu-content';
        mobileMenuContent.innerHTML = `
            <h3 class="mobile-menu-heading">Navigation</h3>
            <ul>
                <li><a href="#" class="active">Home</a></li>
                <li><a href="#">Thoughts</a></li>
                <li><a href="#">Projects</a></li>
                <li><a href="#">Resources</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        `;
        document.body.appendChild(mobileMenuContent);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-menu-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = 'var(--text-color)';
        mobileMenuContent.appendChild(closeBtn);

        const overlay = document.querySelector('.mobile-menu-overlay');
        const hamburgerBtn = document.querySelector('.mobile-menu-btn'); // Re-select just in case

        function toggleMenu() {
            document.body.classList.toggle('menu-open');
            mobileMenuContent.classList.toggle('menu-open');
            if (overlay) overlay.classList.toggle('visible'); // Check if overlay exists
            if (hamburgerBtn) hamburgerBtn.classList.toggle('menu-open'); // Check if hamburgerBtn exists
        }

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
        if (overlay) overlay.addEventListener('click', toggleMenu);
        if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    }


    // Animate stats...
     function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return; // Add check if element exists
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    animateValue("update-frequency", 0, 24, 2000);


    // Newsletter form...
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    if (newsletterForm && formMessage) { /* ... rest of form submission code ... */
         newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailEl = document.getElementById('email');
            const feedbackEl = document.getElementById('feedback');
            if (!emailEl) return;

            const email = emailEl.value;
            const feedback = feedbackEl ? feedbackEl.value : '';

            if (!email || !/\S+@\S+\.\S+/.test(email)) { // Basic email format check
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'form-message error visible';
                return;
            }

            formMessage.textContent = 'Thank you for tuning in. Your frequency has been noted.';
            formMessage.className = 'form-message success visible';
            newsletterForm.reset();
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
            console.log('Newsletter submission:', { email, feedback });
        });
    }

    // === Train Station Square Logic ===
    const trainStationSquare = document.getElementById('train-station-square');
    if (trainStationSquare) {
        const trainElement = document.getElementById('train');
        const getInBtn = document.getElementById('get-in-btn');
        // ADD START: Get display elements
        const displayLine1 = document.getElementById('display-line-1');
        const displayLine2 = document.getElementById('display-line-2');
        // ADD END: Get display elements

        // --- Configuration ---
        const minArrivalDelay = 8 * 1000; // 8 seconds
        const maxArrivalDelay = 15 * 1000; // 15 seconds
        const trainWaitTime = 10 * 1000; // 10 seconds wait before departure

        // Update destinations to use internal links (assuming placeholders for now)
        const randomDestinations = [
            { name: "THOUGHTS", url: "#thoughts-section" }, // Use uppercase for display
            { name: "PROJECTS", url: "#projects-section" },
            { name: "RESOURCES", url: "#resources-section" },
            { name: "CONTACT", url: "#contact-section" }
        ];

        let currentTrainArrivalTimeoutId = null;
        let currentTrainDepartureTimeoutId = null;
        let currentDepartureCountdownIntervalId = null;
        let currentTrainDestinationUrl = null;
        let currentTrainDestinationName = null;
        let scheduledArrivalTime = null;
        let scheduledDepartureTime = null;
        let isTrainPresent = false;

        // --- Helper Functions ---
        // ADD START: Format Time (HH:MM)
        function formatTime(date) {
            if (!date) return "--:--";
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0'); // Add seconds
            return `${hours}:${minutes}:${seconds}`; // Include seconds in return
        }
        // ADD END: Format Time (HH:MM)

        // ADD START: Format Countdown (MM:SS)
        function formatCountdown(milliseconds) {
            if (milliseconds < 0) milliseconds = 0;
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        }
        // ADD END: Format Countdown (MM:SS)

        // ADD START: Update Display Function
        function updateDisplay(line1Text = '', line2Text = '') {
            if (displayLine1) displayLine1.textContent = line1Text;
            if (displayLine2) displayLine2.textContent = line2Text;
            console.log(`Display Update: L1="${line1Text}", L2="${line2Text}"`); // Debug log
        }
        // ADD END: Update Display Function

        function showTrain(destinationName, destinationUrl) {
            if (!trainElement || !getInBtn) return;

            console.log(`Train arriving for: ${destinationName}`);
            currentTrainDestinationUrl = destinationUrl;
            currentTrainDestinationName = destinationName;
            scheduledDepartureTime = new Date(Date.now() + trainWaitTime);

            // Update display for arrival and start countdown
            updateDisplay(`NOW BOARDING`, `TO: ${destinationName}`);
            startDepartureCountdown();

            trainElement.classList.remove('hidden', 'departing');
            void trainElement.offsetWidth; // Force reflow
            trainElement.classList.add('arriving');
            isTrainPresent = true;
        }

        function hideTrain() {
            if (!trainElement || !isTrainPresent) return;

            console.log('Train departing...');
            isTrainPresent = false;
            currentTrainDestinationUrl = null;
            currentTrainDestinationName = null;
            scheduledDepartureTime = null;
            stopDepartureCountdown(); // Stop countdown
            updateDisplay(`DEPARTING...`, ``); // Update display

            const onTransitionEnd = (event) => {
                if (event.propertyName === 'transform') {
                    console.log('Departure transition finished.');
                    trainElement.classList.add('hidden');
                    trainElement.classList.remove('departing', 'arriving');
                    trainElement.removeEventListener('transitionend', onTransitionEnd);
                    // Schedule the next arrival AFTER hiding is complete
                    scheduleArrival(); // Schedule the actual next one now
                }
            };

            trainElement.addEventListener('transitionend', onTransitionEnd);
            trainElement.classList.remove('arriving');
            trainElement.classList.add('departing');

            clearTimeout(currentTrainDepartureTimeoutId); // Clear any pending automatic departure
        }

        // ADD START: Departure Countdown Logic
        function startDepartureCountdown() {
            stopDepartureCountdown(); // Clear any existing interval
            currentDepartureCountdownIntervalId = setInterval(() => {
                if (!scheduledDepartureTime) {
                    stopDepartureCountdown();
                    return;
                }
                const remainingTime = scheduledDepartureTime.getTime() - Date.now();
                if (remainingTime <= 0) {
                    // Time's up - trigger departure if not already triggered by boarding
                    stopDepartureCountdown();
                    if(isTrainPresent) { // Only hide if still present
                       hideTrain();
                    }
                } else {
                    // Update display with countdown
                    // Ensure destination name is still available
                    const destName = currentTrainDestinationName || 'UNKNOWN';
                    updateDisplay(`DEPARTURE IN: ${formatCountdown(remainingTime)}`, `TO: ${destName}`);
                }
            }, 1000); // Update every second
        }

        function stopDepartureCountdown() {
            clearInterval(currentDepartureCountdownIntervalId);
            currentDepartureCountdownIntervalId = null;
        }
        // ADD END: Departure Countdown Logic

        // --- Train Schedule Logic --- (Renamed and modified)
        function scheduleNextTrainAction() {
            clearTimeout(currentTrainArrivalTimeoutId);
            clearTimeout(currentTrainDepartureTimeoutId);
            stopDepartureCountdown();

            if (isTrainPresent) {
                 // Train is present, initiate departure.
                 hideTrain(); // hideTrain now schedules the next arrival via transitionend
            } else {
                 // Train is not present, schedule next arrival.
                 scheduleArrival();
            }
        }

        function scheduleArrival() {
             const delay = Math.random() * (maxArrivalDelay - minArrivalDelay) + minArrivalDelay;
             scheduledArrivalTime = new Date(Date.now() + delay);
                const randomIndex = Math.floor(Math.random() * randomDestinations.length);
                const destination = randomDestinations[randomIndex];

             console.log(`Scheduling next train (${destination.name}) in ~${Math.round(delay / 1000)}s at ${formatTime(scheduledArrivalTime)}`);
             updateDisplay(`NEXT ARRIVAL: ${destination.name}`, `AT: ${formatTime(scheduledArrivalTime)}`); // Changed label to AT:

             currentTrainArrivalTimeoutId = setTimeout(() => {
                showTrain(destination.name, destination.url);

                // Schedule automatic departure if not boarded
                currentTrainDepartureTimeoutId = setTimeout(() => {
                     if(isTrainPresent) { // Check again if it's still here
                        console.log("Train wait time expired. Departing automatically.");
                        hideTrain();
                     }
                }, trainWaitTime);

            }, delay);
        }

        // --- Event Listeners ---
        if (getInBtn) {
            getInBtn.addEventListener('click', () => {
                if (currentTrainDestinationUrl && trainElement && isTrainPresent) {
                    console.log(`Boarding train to: ${currentTrainDestinationName}`);

                    // 0. Fade out button & Stop countdown
                    getInBtn.classList.add('fade-out');
                    stopDepartureCountdown();
                    updateDisplay(`BOARDING COMPLETE`, `EN ROUTE TO: ${currentTrainDestinationName}`);

                    // 1. Immediately start departure animation & clear schedule
                    // No need to call hideTrain() fully as we are overriding parts of it
                    isTrainPresent = false; // Mark train as gone for scheduling
                    trainElement.classList.remove('arriving');
                    trainElement.classList.add('departing');
                    clearTimeout(currentTrainDepartureTimeoutId); // Clear scheduled automatic departure
                    clearTimeout(currentTrainArrivalTimeoutId); // Clear any pending arrival timeout just in case

                    // Store URL locally before timeout potentially clears it
                    const redirectUrl = currentTrainDestinationUrl;
                    currentTrainDestinationUrl = null;
                    currentTrainDestinationName = null;
                    scheduledDepartureTime = null;

                    // 2. Set timeout for overlay fade-in (adjust timing slightly)
                    setTimeout(() => {
                        const blurOverlay = document.getElementById('departure-overlay');
                        if (!blurOverlay) { // Create if doesn't exist
                           const newOverlay = document.createElement('div');
                           newOverlay.id = 'departure-overlay';
                           document.body.appendChild(newOverlay);
                           void newOverlay.offsetWidth; // Trigger reflow
                           newOverlay.classList.add('visible');
                        } else {
                           blurOverlay.classList.add('visible');
                        }
                    }, 2000); // 2s delay for overlay, allowing departure anim to start

                    // 3. Set timeout for redirection (original)
                    setTimeout(() => {
                        console.log(`Redirecting to: ${redirectUrl}`);
                        if (redirectUrl) {
                             window.location.href = redirectUrl;
                        } else {
                             console.error("Redirect URL was lost before redirection could occur.");
                             // Optionally, hide overlay and reschedule train if redirect fails
                             const overlay = document.getElementById('departure-overlay');
                             if(overlay) overlay.classList.remove('visible');
                             scheduleArrival(); // Try to recover schedule
                        }
                    }, 2500); // 2.5s delay for redirect (slightly after overlay starts)

                    // 4. Schedule the *next* train arrival after a delay (e.g., 3s) to avoid immediate respawn after redirect
                    // This replaces the scheduling in hideTrain's transitionend for the boarding case
                    setTimeout(() => {
                         // Need to remove the departing train element from DOM or reset its state fully
                         if(trainElement) {
                             trainElement.classList.add('hidden');
                             trainElement.classList.remove('departing', 'arriving');
                             // Reset transform to avoid starting from departed position
                             trainElement.style.transform = '';
                         }
                         // Remove button fade-out class for next arrival
                         if(getInBtn) getInBtn.classList.remove('fade-out');

                         scheduleArrival();
                    }, 3000); // 3 second delay before scheduling next train post-boarding

                } else {
                     console.warn("Get In button clicked, but no destination URL/name set, train element not found, or train not present.");
                }
            });
        }

        // --- Initialization ---
        console.log("Initializing train schedule and display...");
        updateDisplay("INITIALIZING...", "AWAITING SCHEDULE"); // Initial display message
        setTimeout(() => {
            scheduleArrival(); // Start the first arrival schedule
        }, 1500); // Short delay before first schedule

    } // end if (trainStationSquare)

}); // End of DOMContentLoaded