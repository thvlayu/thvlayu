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

            if (!email || !/\\S+@\\S+\\.\\S+/.test(email)) { // Basic email format check
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

        // ADD START: Audio Setup
        const trainSound = new Audio('Assets/Trainsound.mp3');
        trainSound.preload = 'auto';
        const brakeSound = new Audio('Assets/trainbreaks.mp3');
        brakeSound.preload = 'auto';
        let arrivalSoundTimeoutId = null;
        let brakeSoundTimeoutId = null;
        let departureFadeIntervalId = null;
        // ADD END: Audio Setup

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

        // ADD START: Sound Control Functions
        function stopTrainSound() {
            trainSound.pause();
            brakeSound.pause(); // Stop brake sound too
            clearTimeout(arrivalSoundTimeoutId);
            clearTimeout(brakeSoundTimeoutId); // Clear brake timeout
            clearInterval(departureFadeIntervalId);
            // Clear arrival fade out interval if active
            if (arrivalFadeOutIntervalId) {
                clearInterval(arrivalFadeOutIntervalId);
                arrivalFadeOutIntervalId = null;
            }
            trainSound.volume = 1; // Reset volume for next play
            brakeSound.volume = 1; // Reset brake volume
            console.log("All train sounds stopped.");
        }

        let arrivalFadeOutIntervalId = null; // Keep track of arrival fade interval

        function playArrivalSound() {
            stopTrainSound(); // Ensure any previous sound is stopped
            try {
                trainSound.currentTime = 11; // Start at 11 seconds
                trainSound.volume = 1; // Full volume initially
                trainSound.play().catch(e => console.error("Error starting arrival playback:", e)); // Add catch for play promise
                console.log("Playing arrival sound (11s - 14.5s, fade-out)");

                // Clear any previous fade out interval
                if (arrivalFadeOutIntervalId) clearInterval(arrivalFadeOutIntervalId);

                // Schedule the fade-out to start at 14 seconds (0.5s duration)
                arrivalSoundTimeoutId = setTimeout(() => {
                    let currentVolume = 1.0;
                    const fadeDuration = 500; // 0.5 seconds
                    const fadeSteps = 10;
                    const volumeDecrement = 1.0 / fadeSteps;
                    const intervalTime = fadeDuration / fadeSteps;

                    console.log("Starting arrival sound fade-out.");
                    arrivalFadeOutIntervalId = setInterval(() => {
                        currentVolume -= volumeDecrement;
                        if (currentVolume <= 0) {
                            trainSound.volume = 0;
                            trainSound.pause(); // Stop playback after fade
                            clearInterval(arrivalFadeOutIntervalId);
                            arrivalFadeOutIntervalId = null;
                            console.log("Arrival sound fade-out complete and paused.");
                        } else {
                            trainSound.volume = Math.max(0, currentVolume); // Ensure volume doesn't go below 0
                        }
                    }, intervalTime);

                    // Backup stop in case interval fails slightly off timing
                     setTimeout(() => {
                        if (arrivalFadeOutIntervalId) {
                            clearInterval(arrivalFadeOutIntervalId);
                            arrivalFadeOutIntervalId = null;
                            trainSound.pause();
                            trainSound.volume = 0; // Ensure volume is 0
                            console.log("Arrival sound forced stop after fade duration.");
                        }
                    }, fadeDuration + 100); // Stop shortly after expected fade end

                }, 3000); // Start fade-out after 3 seconds (at the 14s mark of the audio)

            } catch (error) {
                console.error("Error playing arrival sound:", error);
            }
        }

        function playBrakeSound() {
            // Don't stop other sounds, just play this one
            brakeSound.pause(); // Stop previous instance if any
            clearTimeout(brakeSoundTimeoutId);
            try {
                brakeSound.currentTime = 2; // Start at 2 seconds
                brakeSound.volume = 1; // Full volume
                brakeSound.play().catch(e => console.error("Error starting brake playback:", e));
                console.log("Playing brake sound (2s - 5s)");

                // Stop after 3 seconds
                brakeSoundTimeoutId = setTimeout(() => {
                    brakeSound.pause();
                    console.log("Brake sound finished.");
                }, 3000);
            } catch (error) {
                console.error("Error playing brake sound:", error);
            }
        }

        function playDepartureSound() {
            stopTrainSound(); // Ensure any previous sound is stopped
            try {
                trainSound.currentTime = 15; // Start at 15 seconds
                trainSound.volume = 0; // Start silent for fade-in
                trainSound.play().catch(e => console.error("Error starting departure playback:", e)); // Add catch for play promise
                console.log("Playing departure sound (15s - end, fade-in 1s)");

                // Fade-in logic
                let currentVolume = 0;
                const fadeDuration = 1000; // 1 second
                const fadeSteps = 20;
                const volumeIncrement = 1.0 / fadeSteps;
                const intervalTime = fadeDuration / fadeSteps;

                // Clear previous interval if any
                if (departureFadeIntervalId) clearInterval(departureFadeIntervalId);

                departureFadeIntervalId = setInterval(() => {
                    currentVolume += volumeIncrement;
                    if (currentVolume >= 1.0) {
                        trainSound.volume = 1.0;
                        clearInterval(departureFadeIntervalId);
                        departureFadeIntervalId = null; // Clear the ID
                        console.log("Departure sound fade-in complete.");
                    } else {
                        trainSound.volume = currentVolume;
                    }
                }, intervalTime);

                // Let sound play to end - remove automatic stop based on animation
                // Check if sound finished naturally and log it
                trainSound.onended = () => {
                    console.log("Departure sound finished playing naturally.");
                    // We might not need to stop explicitly, but good practice to reset
                    stopTrainSound();
                };

            } catch (error) {
                console.error("Error playing departure sound:", error);
            }
        }
        // ADD END: Sound Control Functions

        function showTrain(destinationName, destinationUrl) {
            // Note: Arrival sound is now started 3.5s BEFORE this function is fully called (see scheduleArrival)
            if (!trainElement || !getInBtn) return;

            console.log(`Train arriving visually for: ${destinationName}`);
            // playArrivalSound(); // MOVED to scheduleArrival timeout
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
            playDepartureSound(); // Play departure sound immediately

            isTrainPresent = false;
            currentTrainDestinationUrl = null;
            currentTrainDestinationName = null;
            scheduledDepartureTime = null;
            stopDepartureCountdown(); // Stop countdown
            updateDisplay(`DEPARTING...`, ``); // Update display

            const onTransitionEnd = (event) => {
                // Ensure we only react to the transform property finishing
                if (event.propertyName === 'transform' && event.target === trainElement) {
                    console.log('Departure visual transition finished.');
                    trainElement.classList.add('hidden');
                    trainElement.classList.remove('departing', 'arriving');
                    trainElement.style.transform = ''; // Reset transform for next arrival
                    trainElement.removeEventListener('transitionend', onTransitionEnd);
                    // DO NOT stop sound here - let it play out
                    // stopTrainSound();
                    // Schedule the next arrival AFTER hiding is complete
                    scheduleArrival(); // Schedule the actual next one now
                }
            };

            // Add listener *before* starting the transition
            trainElement.removeEventListener('transitionend', onTransitionEnd); // Remove previous just in case
            trainElement.addEventListener('transitionend', onTransitionEnd);

            // Delay the visual departure animation by 1 second
            console.log('Starting visual departure in 1 second...');
            setTimeout(() => {
                if (trainElement) { // Check if train element still exists
                   console.log('Applying departing class now.');
            trainElement.classList.remove('arriving');
            trainElement.classList.add('departing');
                } else {
                   console.warn("Train element gone before visual departure could start.");
                }
            }, 1000); // 1 second delay for visual departure start

            clearTimeout(currentTrainDepartureTimeoutId); // Clear any pending automatic departure timeout
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
            stopTrainSound(); // Stop any sound before scheduling next action

            if (isTrainPresent) {
                 // Train is present, initiate departure.
                 hideTrain(); // hideTrain now schedules the next arrival via transitionend
            } else {
                 // Train is not present, schedule next arrival.
                 scheduleArrival();
            }
        }

        function scheduleArrival() {
             // Clear any previous arrival timeout
             clearTimeout(currentTrainArrivalTimeoutId);

             const delay = Math.random() * (maxArrivalDelay - minArrivalDelay) + minArrivalDelay;
             scheduledArrivalTime = new Date(Date.now() + delay);
                const randomIndex = Math.floor(Math.random() * randomDestinations.length);
                const destination = randomDestinations[randomIndex];

             console.log(`Scheduling next train (${destination.name}) arrival sound in ~${Math.round((delay - 3500) / 1000)}s, visual in ~${Math.round(delay / 1000)}s.`);
             updateDisplay(`NEXT ARRIVAL: ${destination.name}`, `AT: ${formatTime(scheduledArrivalTime)}`);

             // --- ADJUST SOUND TIMING HERE ---
             // Play arrival sound 1.0 second *before* the scheduled visual arrival time.
             const soundDelay = Math.max(0, delay - 1000); // Ensure delay is not negative
             // Play brake sound 0.5 seconds *before* visual arrival (0.5s after main arrival sound starts)
             const brakeSoundDelay = Math.max(0, delay - 500);
             console.log(`Arrival sound scheduled in ${soundDelay / 1000}s.`);
             console.log(`Brake sound scheduled in ${brakeSoundDelay / 1000}s.`);

             currentTrainArrivalTimeoutId = setTimeout(() => {
                 console.log("Playing arrival sound now (scheduled).");
                 playArrivalSound(); // Start sound first

                 // Schedule the brake sound to start 0.5s after the main arrival sound
                 setTimeout(() => {
                     console.log("Playing brake sound now (scheduled).");
                     playBrakeSound();
                 }, 500); // 500ms delay after main arrival sound starts

                 // Schedule the visual arrival 1.0 second later (to match sound pre-delay)
                 setTimeout(() => {
                    console.log("Showing train visually now (scheduled).");
                    // Call the visual part of showTrain
                    showTrainVisuals(destination.name, destination.url);

                    // Schedule automatic departure if not boarded (based on visual arrival time)
                    clearTimeout(currentTrainDepartureTimeoutId); // Clear any lingering departure timeout
                currentTrainDepartureTimeoutId = setTimeout(() => {
                     if(isTrainPresent) { // Check again if it's still here
                        console.log("Train wait time expired. Departing automatically.");
                            hideTrain(); // hideTrain now handles the sound and visual delay
                        }
                    }, trainWaitTime); // Wait time starts AFTER visual arrival

                 }, 1000); // 1.0 second delay between sound start and visual start

             }, soundDelay);
         }

         // Helper function for just the visual parts of showTrain
         function showTrainVisuals(destinationName, destinationUrl) {
             if (!trainElement || !getInBtn) return;
             console.log(`Showing train visuals for ${destinationName}`);

             // Update state variables (originally in showTrain)
             currentTrainDestinationUrl = destinationUrl;
             currentTrainDestinationName = destinationName;
             scheduledDepartureTime = new Date(Date.now() + trainWaitTime); // Reset departure time based on visual arrival

             // Update display for arrival and start countdown
             updateDisplay(`NOW BOARDING`, `TO: ${destinationName}`);
             startDepartureCountdown(); // Start countdown based on visual arrival

             // Apply visual classes
             trainElement.classList.remove('hidden', 'departing');
             void trainElement.offsetWidth; // Force reflow
             trainElement.classList.add('arriving');
             isTrainPresent = true; // Mark as present visually
         }


        // --- Event Listeners ---
        if (getInBtn) {
            getInBtn.addEventListener('click', () => {
                if (currentTrainDestinationUrl && trainElement && isTrainPresent) {
                    console.log(`Boarding train to: ${currentTrainDestinationName}`);

                     // 0. Fade out button & Stop countdown & Stop arrival sound / Start departure sound
                    getInBtn.classList.add('fade-out');
                    stopDepartureCountdown();
                     playDepartureSound(); // Start departure sound immediately on boarding
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
                     // Clear state *after* sound starts but *before* visual animation delay
                    currentTrainDestinationUrl = null;
                    currentTrainDestinationName = null;
                    scheduledDepartureTime = null;

                     // Delay visual departure and subsequent actions by 1 second
                     console.log('Starting visual departure and redirect sequence in 1 second (boarding)...');
                     setTimeout(() => {
                         console.log('Applying departing class and setting timeouts (boarding).');
                         if (trainElement) {
                             trainElement.classList.remove('arriving');
                             trainElement.classList.add('departing');
                         }

                         // 2. Set timeout for overlay fade-in (relative to visual departure)
                    setTimeout(() => {
                        const blurOverlay = document.getElementById('departure-overlay');
                             // Create overlay if it doesn't exist (robustness)
                             let overlayToUse = blurOverlay;
                             if (!overlayToUse) {
                                 console.log("Creating departure overlay.");
                                 overlayToUse = document.createElement('div');
                                 overlayToUse.id = 'departure-overlay';
                                 document.body.appendChild(overlayToUse);
                             }
                             void overlayToUse.offsetWidth; // Trigger reflow
                             overlayToUse.classList.add('visible');
                             console.log("Departure overlay made visible.");
                         }, 1000); // 1s delay for overlay (2s total from click)

                         // 3. Set timeout for redirection (relative to visual departure)
                    setTimeout(() => {
                        console.log(`Redirecting to: ${redirectUrl}`);
                        if (redirectUrl) {
                             window.location.href = redirectUrl;
                        } else {
                             console.error("Redirect URL was lost before redirection could occur.");
                             // Optionally, hide overlay and reschedule train if redirect fails
                             const overlay = document.getElementById('departure-overlay');
                             if(overlay) overlay.classList.remove('visible');
                                 stopTrainSound(); // Stop sound if redirect fails
                             scheduleArrival(); // Try to recover schedule
                        }
                         }, 1500); // 1.5s delay for redirect (2.5s total from click)

                     }, 1000); // 1 second delay for visual departure start


                     // 4. Schedule the *next* train arrival after a delay (e.g., 3s)
                     // This needs to happen *after* the visual departure has likely completed,
                     // but we start the timer relative to the click for simplicity.
                     // If the redirect happens, this scheduled arrival might not matter.
                    setTimeout(() => {
                         console.log("Scheduling next arrival post-boarding attempt.");
                          // Need to ensure train element is reset if redirect *doesn't* happen
                          if(trainElement && !redirectUrl) { // Only reset if not redirecting
                             trainElement.classList.add('hidden');
                             trainElement.classList.remove('departing', 'arriving');
                              trainElement.style.transform = ''; // Reset transform
                              console.log("Resetting train element state post-failed boarding.");
                         }
                         // Remove button fade-out class for next arrival
                         if(getInBtn) getInBtn.classList.remove('fade-out');

                          // Ensure sound is stopped before next schedule if redirect failed
                          if (!redirectUrl) stopTrainSound();

                         scheduleArrival();
                     }, 3000); // 3 second delay before scheduling next train post-boarding attempt

                } else {
                     console.warn("Get In button clicked, but no destination URL/name set, train element not found, or train not present.");
                }
            });
        }

        // --- Initialization ---
        console.log("Initializing train schedule and display...");
         stopTrainSound(); // Ensure no sound plays initially
        updateDisplay("INITIALIZING...", "AWAITING SCHEDULE"); // Initial display message
        setTimeout(() => {
            scheduleArrival(); // Start the first arrival schedule
        }, 1500); // Short delay before first schedule

    } // end if (trainStationSquare)

}); // End of DOMContentLoaded