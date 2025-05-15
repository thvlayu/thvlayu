// Basic script
console.log("Script loaded!");

gsap.registerPlugin(ScrollTrigger, SplitText);

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {

    const container = document.querySelector(".invitation-container");
    const image = document.querySelector(".invitation-image");
    const textElements = gsap.utils.toArray(".invitation-text p");

    // Select Welcome Screen Elements
    const welcomeScreen = document.querySelector(".welcome-screen");
    const welcomeTitle = document.querySelector(".welcome-title");
    const welcomeSubtitle = document.querySelector(".welcome-subtitle");
    const stayButton = document.getElementById("stay-button");
    const acceptButton = document.getElementById("accept-button");

    // Select Light Exploration Elements
    const lightContainer = document.querySelector(".light-explore-container");
    const lightImage = document.querySelector(".light-image");

    // Select SVG rects for dynamic dash calculation
    const stayButtonRect = document.querySelector("#stay-button svg rect");
    const acceptButtonRect = document.querySelector("#accept-button svg rect");

    // Select Stay Page Container
    const stayPageContainer = document.querySelector(".stay-page-container");
    const staySections = gsap.utils.toArray(".stay-section");

    if (!container || !image || textElements.length === 0 || 
        !welcomeScreen || !welcomeTitle || !welcomeSubtitle || !stayButton || !acceptButton ||
        !lightContainer || !lightImage || !stayButtonRect || !acceptButtonRect || !stayPageContainer) {
        console.error("One or more critical elements for animation not found! Check selectors.");
        return;
    }

    // --- Calculate path lengths and set dash properties ---
    // Note: Button must be visible for getBBox/getTotalLength to work reliably.
    // We assume they become visible enough during setup or initial state.
    try {
        const stayLength = stayButtonRect.getTotalLength();
        stayButtonRect.style.strokeDasharray = stayLength;
        stayButtonRect.style.strokeDashoffset = stayLength;
        console.log(`Stay button rect length: ${stayLength}`);

        const acceptLength = acceptButtonRect.getTotalLength();
        acceptButtonRect.style.strokeDasharray = acceptLength;
        acceptButtonRect.style.strokeDashoffset = acceptLength;
        console.log(`Accept button rect length: ${acceptLength}`);
    } catch (error) {
        console.error("Error calculating SVG path lengths. Ensure elements are rendered: ", error);
        // Fallback or alternative handling might be needed if errors occur
    }

    // --- Create paused gradient animation for welcomeTitle ---
    const gradientAnimation = gsap.fromTo(welcomeTitle,
        { backgroundPosition: "0% center" },
        {
            backgroundPosition: "-300% center",
            ease: "linear",
            duration: 12, 
            repeat: -1,
            paused: true
        }
    );

    // --- Create timeline for Welcome Screen Content (initially paused) ---
    const welcomeContentTl = gsap.timeline({ paused: true });
    welcomeContentTl
        .to([welcomeTitle, welcomeSubtitle], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            onStart: () => {
                if (gradientAnimation && !gradientAnimation.isActive()) {
                    gradientAnimation.play();
                    console.log("Gradient animation started with welcome text reveal.");
                }
            }
        })
        .to([stayButton, acceptButton], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            onComplete: () => {
                console.log("Welcome screen content fully loaded. Scrolling locked.");
            }
        }, "-=0.4"); // Overlap with text animation slightly

    // --- Initial GSAP Sets ---
    gsap.set(image, { opacity: 0, scale: 0.9 });
    const splitEntrance = new SplitText(textElements, { type: "chars, words" });
    gsap.set(splitEntrance.chars, { opacity: 0, y: 20 });
    
    gsap.set(welcomeScreen, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
    gsap.set([welcomeTitle, welcomeSubtitle, stayButton, acceptButton], { opacity: 0, y: 30 });
    gsap.set(stayPageContainer, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
    gsap.set(staySections, { opacity: 0, y: 50 });

    // --- Entrance Animation (Invitation) --- 
    gsap.to(image, { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5, 
        ease: "power2.out" 
    });
    gsap.to(splitEntrance.chars, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power2.out", 
        stagger: 0.03,
        delay: 0.5
    });

    // --- ScrollTrigger Animation (Main Timeline) --- 
    const splitExit = new SplitText(textElements, { type: "chars" });

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=250%", 
            scrub: 1,
            pin: true,
            pinSpacing: true,
            markers: true
        }
    });

    tl
        .to(splitExit.chars, {
            opacity: 0,
            y: -15,
            scale: 0.8,
            duration: 0.15,
            stagger: {
                amount: 0.3,
                from: "random"
            }
        }, 0)
        .to(image, { 
            rotate: -90,
            duration: 0.5
        }, 0.5)
        .to(image, {
            scale: 8,
            duration: 1.0,
            ease: "power1.in"
        }, ">-=0.2")
        .to(image, {
            opacity: 0,
            duration: 0.3
        }, ">-0.4")
        // Fade IN the welcome screen container and trigger its content animation
        .to(welcomeScreen, {
            opacity: 1,
            visibility: "visible",
            pointerEvents: "auto", // So buttons can be clicked
            duration: 0.5,         // How long the screen container takes to fade in
            onStart: () => {
                if (welcomeContentTl && !welcomeContentTl.isActive()) {
                    welcomeContentTl.play(0); // Play the content animation from its start
                    console.log("Welcome screen container revealed, playing content timeline.");
                }
            },
            onComplete: () => {
                // Lock scrolling when the welcome screen container's animation in tl completes
                gsap.set(document.body, { overflow: "hidden" });
                console.log("Welcome screen container animation complete in main TL. Scrolling locked.");
            }
        }, ">"); // Starts after image fades out
        // Note: Welcome title, subtitle, and buttons are now animated by welcomeContentTl, not here.

    // --- Button Event Listeners for Welcome Screen ---
    const hoverToClickDuration = 7000; // Updated to 7 seconds for hover-to-click
    let stayButtonTimeoutId = null;
    let acceptButtonTimeoutId = null;

    function resetButtonState(button, timeoutId) {
        const buttonId = button.id || 'unknown'; // Get button ID for logging
        if (timeoutId) {
            console.log(`[${buttonId}] Clearing timeout ID: ${timeoutId}`);
            clearTimeout(timeoutId);
        }
        // The CSS animation for the border pauses automatically when hover is lost.
        // If there's a specific class to remove for animation, do it here.
    }

    acceptButton.addEventListener("mouseenter", () => {
        resetButtonState(acceptButton, acceptButtonTimeoutId); // Clear any existing timeout
        console.log("[accept-button] Mouse enter. Setting timeout.");
        acceptButtonTimeoutId = setTimeout(() => {
            // Check screen visibility *inside* timeout callback
            if (welcomeScreen.style.opacity === "1" && welcomeScreen.style.visibility === "visible") {
                 console.log("[accept-button] Timeout Fired! Executing click.");
                 acceptButton.click(); // Programmatic click
            } else {
                 console.log("[accept-button] Timeout Fired, but screen not visible. Click skipped.");
            }
        }, hoverToClickDuration);
        console.log(`[accept-button] Timeout ID set: ${acceptButtonTimeoutId}`);
    });

    acceptButton.addEventListener("mouseleave", () => {
        console.log("[accept-button] Mouse leave. Clearing timeout.");
        resetButtonState(acceptButton, acceptButtonTimeoutId);
        acceptButtonTimeoutId = null; // Ensure ID is nullified
    });

    acceptButton.addEventListener("click", () => {
        console.log("[accept-button] Click event triggered.");
        resetButtonState(acceptButton, acceptButtonTimeoutId); // Clear timeout on any click
        acceptButtonTimeoutId = null;

        // Animate button border to complete quickly
        if (acceptButtonRect) {
            gsap.to(acceptButtonRect, {
                strokeDashoffset: 0,
                duration: 0.25, // Fast duration
                ease: "power1.inOut"
            });
        }

        // Stop the gradient animation when leaving welcome screen
        if (gradientAnimation && gradientAnimation.isActive()) {
            gradientAnimation.pause();
        }
        const exitWelcomeTl = gsap.timeline();
        exitWelcomeTl
            .to([welcomeTitle, welcomeSubtitle, stayButton, acceptButton], {
                opacity: 0,
                y: -30, 
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.in"
            })
            .to(welcomeScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    gsap.set(welcomeScreen, { visibility: "hidden", pointerEvents: "none" });
                    // Ensure scrolling remains locked when entering light exploration
                    gsap.set(document.body, { overflow: "hidden" }); 
                    if (lightContainer) { 
                        gsap.to(lightContainer, {
                            opacity: 1,
                            visibility: "visible",
                            pointerEvents: "auto",
                            duration: 0.5 
                        });
                         console.log("'Accept Invite' clicked. Light exploration active. Scrolling remains locked.");
                    } else {
                        console.error("Light container not found for 'Accept Invite' action.");
                    }
                }
            }, "-=0.2");
    });

    stayButton.addEventListener("mouseenter", () => {
        resetButtonState(stayButton, stayButtonTimeoutId); // Clear any existing timeout
        console.log("[stay-button] Mouse enter. Setting timeout.");
        stayButtonTimeoutId = setTimeout(() => {
            // Check screen visibility *inside* timeout callback
            if (welcomeScreen.style.opacity === "1" && welcomeScreen.style.visibility === "visible") {
                console.log("[stay-button] Timeout Fired! Executing click.");
                stayButton.click(); // Programmatic click
            } else {
                console.log("[stay-button] Timeout Fired, but screen not visible. Click skipped.");
            }
        }, hoverToClickDuration);
        console.log(`[stay-button] Timeout ID set: ${stayButtonTimeoutId}`);
    });

    stayButton.addEventListener("mouseleave", () => {
        console.log("[stay-button] Mouse leave. Clearing timeout.");
        resetButtonState(stayButton, stayButtonTimeoutId);
        stayButtonTimeoutId = null; // Ensure ID is nullified
    });

    stayButton.addEventListener("click", () => {
        console.log("[stay-button] Click event triggered.");
        resetButtonState(stayButton, stayButtonTimeoutId); // Clear timeout on any click
        stayButtonTimeoutId = null;

        // Animate button border to complete quickly
        if (stayButtonRect) {
            gsap.to(stayButtonRect, {
                strokeDashoffset: 0,
                duration: 0.25, // Fast duration
                ease: "power1.inOut"
            });
        }

        // Stop the gradient animation when leaving welcome screen
        if (gradientAnimation && gradientAnimation.isActive()) {
            gradientAnimation.pause();
        }
        const exitWelcomeTl = gsap.timeline();
        exitWelcomeTl
            .to([welcomeTitle, welcomeSubtitle, stayButton, acceptButton], {
                opacity: 0,
                y: -30, 
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.in"
            })
            .to(welcomeScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    gsap.set(welcomeScreen, { visibility: "hidden", pointerEvents: "none" });
                    // gsap.set(document.body, { overflow: "auto" }); // Old behavior
                    // console.log("'Stay' button clicked. Welcome screen hidden. Scrolling enabled."); // Old log

                    // Animate in the Stay Page
                    if (stayPageContainer) {
                        gsap.to(stayPageContainer, {
                            opacity: 1,
                            visibility: "visible",
                            pointerEvents: "auto",
                            duration: 0.8,
                            ease: "power2.out",
                            onStart: () => {
                                gsap.set(document.body, { overflow: "hidden" }); // Keep body scroll locked
                                console.log("'Stay' button clicked. Welcome screen hidden. Showing portfolio.");
                            },
                            onComplete: () => {
                                // Animate in sections of the stay page
                                gsap.to(staySections, {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    stagger: 0.2,
                                    ease: "power3.out",
                                    delay: 0.2 // Slight delay after container fades in
                                });
                                console.log("Portfolio page visible and section animations triggered.");
                            }
                        });
                    } else {
                        console.error("Stay page container not found!");
                        gsap.set(document.body, { overflow: "auto" }); // Fallback to enabling scroll
                    }
                }
            }, "-=0.2");
    });

    // --- Text Hover Effects (Original Invitation Text) ---
    textElements.forEach(p => {
        const splitHover = new SplitText(p, { type: "chars" });
        const hoverTL = gsap.timeline({ paused: true });

        hoverTL.to(splitHover.chars, {
            y: -10,
            opacity: 0.8,
            color: "#961e2c",
            stagger: {
                each: 0.05,
                from: "start"
            },
            duration: 0.4,
            ease: "power1.out"
        });

        p.addEventListener("mouseenter", () => hoverTL.play());
        p.addEventListener("mouseleave", () => hoverTL.reverse());
    });

    // --- Light Explore Effect --- 
    if (lightContainer && lightImage) { 
        const chapterTitlesContainer = document.querySelector('.chapter-titles-container');
        const chapterTitles = gsap.utils.toArray('.chapter-title'); // Get all chapter titles
        const maskSize = 400; 
        const halfMaskSize = maskSize / 2;

        // Store listener functions to remove them later
        let mouseMoveHandler, mouseLeaveHandler, mouseEnterHandler;

        // Set initial state for the light image and chapter container mask
        gsap.set(lightImage, { opacity: 0 }); 
        if (chapterTitlesContainer) {
            gsap.set(chapterTitlesContainer, { maskPosition: `-9999px -9999px`, pointerEvents: 'auto' }); // Allow clicks on text
        }

        mouseEnterHandler = (e) => {
            // Fade in the image when mouse enters
            gsap.to(lightImage, { opacity: 1, duration: 0.5, ease: "power2.out" });
            // Update mask position immediately on enter as well
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const maskPos = `${mouseX - halfMaskSize}px ${mouseY - halfMaskSize}px`;
            gsap.set(lightImage, { maskPosition: maskPos });
            if (chapterTitlesContainer) {
                gsap.set(chapterTitlesContainer, { maskPosition: maskPos });
            }
        };

        mouseMoveHandler = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const maskPos = `${mouseX - halfMaskSize}px ${mouseY - halfMaskSize}px`;
            // Only update mask position on move for both image and text container
            gsap.set(lightImage, { maskPosition: maskPos });
            if (chapterTitlesContainer) {
                gsap.set(chapterTitlesContainer, { maskPosition: maskPos });
            }
        };

        mouseLeaveHandler = () => {
            // Fade out the image and reset mask when mouse leaves
            gsap.to(lightImage, { 
                opacity: 0, 
                duration: 0.3, 
                ease: "power2.in",
                onComplete: () => {
                    // Reset mask position after fade out completes for both
                     const resetPos = `-9999px -9999px`;
                     gsap.set(lightImage, { maskPosition: resetPos });
                     if (chapterTitlesContainer) {
                        gsap.set(chapterTitlesContainer, { maskPosition: resetPos });
                     }
                }
            });
        };

        // Add initial event listeners
        lightContainer.addEventListener("mouseenter", mouseEnterHandler);
        lightContainer.addEventListener("mousemove", mouseMoveHandler);
        lightContainer.addEventListener("mouseleave", mouseLeaveHandler);

        // Add click listeners to chapter titles
        chapterTitles.forEach(title => {
            title.addEventListener('click', () => {
                console.log(`Chapter clicked: ${title.id}`);
                
                // Add clicked style
                title.classList.add('chapter-clicked');
                
                // Remove mouse tracking listeners immediately
                lightContainer.removeEventListener("mouseenter", mouseEnterHandler);
                lightContainer.removeEventListener("mousemove", mouseMoveHandler);
                lightContainer.removeEventListener("mouseleave", mouseLeaveHandler);

                // Disable further clicks on titles
                if (chapterTitlesContainer) {
                     gsap.set(chapterTitlesContainer, { pointerEvents: 'none' });
                }

                // Fade out the entire light exploration container
                gsap.to(lightContainer, { 
                    opacity: 0, 
                    duration: 1.8, // Increased duration
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(lightContainer, { visibility: 'hidden' });
                        console.log(`Light effect faded out. Ready to show story for ${title.id}`);
                        // --- Placeholder for showing story content --- 
                        // Example: showStory(title.id);

                        // Change body cursor to indicate questioning state
                        document.body.style.cursor = 'help';
                    }
                });
            });
        });

    } 

}); 