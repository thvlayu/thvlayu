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

        function startSlideshowIfReady() {
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImages) {
                console.log("All background images preloaded. Starting slideshow.");
                // Now that all images are loaded, start the interval timer
                setInterval(changeBackground, 7000);
                 // Optional: Ensure the first image div is definitely visible now
                 if (bgDivs.length > 0) {
                    bgDivs[0].style.opacity = '1';
                 }
            }
        }

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

        // Slideshow function (remains the same)
        function changeBackground() {
            const previousImageIndex = currentImageIndex;
            currentImageIndex = (currentImageIndex + 1) % bgImages.length; // Use bgImages.length directly

            // Ensure divs exist before trying to style them
            if (bgDivs[previousImageIndex]) {
                 bgDivs[previousImageIndex].style.opacity = '0';
            }
            if (bgDivs[currentImageIndex]) {
                bgDivs[currentImageIndex].style.opacity = '1';
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
            <div class="mobile-logo">
                <img src="Assets/Notebook logo.jpg" alt="thvlayu logo" style="width: 40px; height: 40px; border-radius: 4px; margin-right: 10px;">
                <div>
                    <h3>thvlayu</h3>
                    <span>be delusional and do anything you want</span>
                </div>
            </div>
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

    animateValue("news-count", 0, 127, 2000);
    animateValue("update-frequency", 0, 24, 2000);


    // Fetch trending topics...
    async function fetchTrendingTopics() {
        const mockTrends = [
            "Generative AI", "Quantum Computing", "Neural Interfaces",
            "Post-Capitalism", "Climate Adaptation", "Digital Minimalism",
            "Web4 Concepts", "Biohacking"
        ];
        const topicsContainer = document.getElementById('trending-topics');
        if (!topicsContainer) return; // Add check

        topicsContainer.innerHTML = '';
        const shuffled = mockTrends.sort(() => 0.5 - Math.random());
        const selectedTrends = shuffled.slice(0, 5);

        selectedTrends.forEach(trend => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = trend;
            topicsContainer.appendChild(tag);
        });
    }
    fetchTrendingTopics();


    // Mock news data...
    let mockNewsData = [ // Use let if it might be reassigned, otherwise const
        { id: 1, title: "The Ethics of Artificial Consciousness", excerpt: "...", category: "philosophy", date: new Date().toISOString().split('T')[0], source: "Philosophy Today" },
        { id: 2, title: "Next-Gen UI Paradigms Emerging", excerpt: "...", category: "design", date: new Date(Date.now() - 86400000).toISOString().split('T')[0], source: "Design Systems" },
        { id: 3, title: "Breakthrough in Room-Temperature Superconductors", excerpt: "...", category: "science", date: new Date(Date.now() - 172800000).toISOString().split('T')[0], source: "Science Advances" },
        { id: 4, title: "The Decentralized Web Gains Momentum", excerpt: "...", category: "tech", date: new Date(Date.now() - 259200000).toISOString().split('T')[0], source: "Tech Futures" },
        { id: 5, title: "Biological Computers Make First Calculations", excerpt: "...", category: "science", date: new Date(Date.now() - 345600000).toISOString().split('T')[0], source: "Nature BioTech" },
        { id: 6, title: "New Minimalist Design Language Emerges", excerpt: "...", category: "design", date: new Date(Date.now() - 432000000).toISOString().split('T')[0], source: "Aesthetic Journal" }
        // ... add full excerpts back if needed
    ];


    // Render news items...
    function renderNewsItems(items) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return; // Add check
        newsGrid.innerHTML = '';

        items.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            let categoryClass = item.category;

            newsItem.innerHTML = `
                <div class="news-image">
                    <div class="news-category ${categoryClass}">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
                </div>
                <div class="news-content">
                    <h4>${item.title}</h4>
                    <p>${item.excerpt}</p>
                    <div class="news-meta">
                        <span>${item.source}</span>
                        <span>${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            newsGrid.appendChild(newsItem);
        });
    }


    // Filter news...
    function filterNews() {
        const categoryFilterEl = document.getElementById('category-filter');
        const timeFilterEl = document.getElementById('time-filter');
        if (!categoryFilterEl || !timeFilterEl) return; // Add check

        const categoryFilter = categoryFilterEl.value;
        const timeFilter = timeFilterEl.value;

        let filteredItems = [...mockNewsData];

        // Apply category filter
        if (categoryFilter !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        }

        // Apply time filter
        const now = new Date();
        if (timeFilter === 'today') {
            const today = now.toISOString().split('T')[0];
            filteredItems = filteredItems.filter(item => item.date === today);
        } else if (timeFilter === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredItems = filteredItems.filter(item => new Date(item.date) >= oneWeekAgo);
        } else if (timeFilter === 'month') {
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredItems = filteredItems.filter(item => new Date(item.date) >= oneMonthAgo);
        }

        renderNewsItems(filteredItems);

         // Also update visibility of 'Load More' button after filtering
        const loadMoreBtn = document.querySelector('.load-more');
        const newsGrid = document.querySelector('.news-grid');
        if (loadMoreBtn && newsGrid) {
             if (newsGrid.querySelectorAll('.news-item').length >= filteredItems.length) { // Compare with filtered length potentially
                 loadMoreBtn.style.display = 'none';
             } else {
                 loadMoreBtn.style.display = 'inline-block'; // Or 'block' depending on styling
             }
        }
    }
     // Initialize news and filters
    renderNewsItems(mockNewsData);
    const categoryFilterEl = document.getElementById('category-filter');
    const timeFilterEl = document.getElementById('time-filter');
    if (categoryFilterEl) categoryFilterEl.addEventListener('change', filterNews);
    if (timeFilterEl) timeFilterEl.addEventListener('change', filterNews);
     filterNews(); // Call initially to set button state correctly


    // Load more button...
    const loadMoreBtn = document.querySelector('.load-more');
     if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const newsGrid = document.querySelector('.news-grid');
            if (!newsGrid) return;

            const currentCount = newsGrid.querySelectorAll('.news-item').length;
            // Determine the correct source based on current filters
            const categoryFilterVal = categoryFilterEl ? categoryFilterEl.value : 'all';
            const timeFilterVal = timeFilterEl ? timeFilterEl.value : 'all';

            // Re-filter to get the full list matching current criteria
            let sourceItems = [...mockNewsData];
            if (categoryFilterVal !== 'all') {
                 sourceItems = sourceItems.filter(item => item.category === categoryFilterVal);
            }
             const now = new Date();
            if (timeFilterVal === 'today') { /* filter logic */ sourceItems = sourceItems.filter(item => item.date === now.toISOString().split('T')[0]); }
            else if (timeFilterVal === 'week') { /* filter logic */ const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); sourceItems = sourceItems.filter(item => new Date(item.date) >= weekAgo); }
            else if (timeFilterVal === 'month') { /* filter logic */ const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); sourceItems = sourceItems.filter(item => new Date(item.date) >= monthAgo); }


            const itemsToAdd = 3; // How many to add per click
            const newItems = sourceItems.slice(currentCount, currentCount + itemsToAdd);

            if (newItems.length > 0) {
                // Use renderNewsItems logic partially or duplicate item creation
                 newItems.forEach(item => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item';
                    let categoryClass = item.category;
                    newsItem.innerHTML = `
                        <div class="news-image"><div class="news-category ${categoryClass}">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div></div>
                        <div class="news-content"><h4>${item.title}</h4><p>${item.excerpt}</p><div class="news-meta"><span>${item.source}</span><span>${new Date(item.date).toLocaleDateString()}</span></div></div>`;
                    newsGrid.appendChild(newsItem);
                });

                // Hide button if no more items left in the *filtered* list
                if (newsGrid.querySelectorAll('.news-item').length >= sourceItems.length) {
                    this.style.display = 'none';
                }
            } else {
                this.style.display = 'none'; // Hide if no new items found
            }
        });
        // Initial check is now done within filterNews() call
    }


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

}); // End of DOMContentLoaded
