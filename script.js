// Basic script
console.log("Script loaded!");

gsap.registerPlugin(ScrollTrigger, SplitText);

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {

    const container = document.querySelector(".invitation-container");
    const image = document.querySelector(".invitation-image");
    const textElements = gsap.utils.toArray(".invitation-text p");

    // Ensure elements exist before animating
    if (!container || !image || textElements.length === 0) {
        console.error("Required elements for animation not found!");
        return;
    }

    // --- Entrance Animation --- 
    // Use SplitText for entrance
    const splitEntrance = new SplitText(textElements, { type: "chars, words" });

    // Set initial states
    gsap.set(image, { opacity: 0, scale: 0.9 });
    gsap.set(splitEntrance.chars, { opacity: 0, y: 20 });

    // Animate image first
    gsap.to(image, { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5, 
        ease: "power2.out" 
    });

    // Staggered animation for characters
    gsap.to(splitEntrance.chars, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power2.out", 
        stagger: 0.03,
        delay: 0.5
    });

    // --- ScrollTrigger Animation --- 
    // Use a separate SplitText instance for the exit animation within ScrollTrigger
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

    // Add animations to the timeline
    tl
        // 1. Staggered fade out for the text characters
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
        // 2. Rotate the image to horizontal (with a delay after text exit)
        .to(image, { 
            rotate: -90,
            duration: 0.5
        }, 0.5)
        // 3. Scale up the image significantly to simulate zooming in
        .to(image, {
            scale: 15,
            duration: 1.0,
            ease: "power1.in"
        }, ">-=0.2")
        // 4. (Optional) Fade out image during the end of the zoom to reveal content
        .to(image, {
            opacity: 0,
            duration: 0.3
        }, ">-0.3");

    // --- Text Hover Effects ---
    textElements.forEach(p => {
        const splitHover = new SplitText(p, { type: "chars" });
        const hoverTL = gsap.timeline({ paused: true });

        hoverTL.to(splitHover.chars, {
            y: -10,
            opacity: 0.8,
            color: "#961e2c", // Example hover color
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

}); 