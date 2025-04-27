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

        // --- START: Revised Slideshow Logic ---

        let currentImageIndex = 0;
        const bgDivs = []; // Array to hold references to the background divs

        // Basic styling for the hero section
        heroSection.style.position = "relative"; // Needed for absolute positioning of children
        heroSection.style.marginTop = "1.5rem";
        heroSection.style.overflow = "hidden"; // Hide parts of bg divs that might peek out

        // Create and append background divs for each image
        bgImages.forEach((imgSrc, index) => {
            const bgDiv = document.createElement('div');
            bgDiv.className = 'hero-bg-slide'; // Use a class for styling
            bgDiv.style.backgroundImage = `url('${imgSrc}')`;
            bgDiv.style.position = 'absolute';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.width = '100%';
            bgDiv.style.height = '100%';
            bgDiv.style.backgroundSize = 'cover';
            bgDiv.style.backgroundPosition = 'center';
            bgDiv.style.opacity = (index === 0) ? '1' : '0'; // First image visible, others hidden
            bgDiv.style.transition = 'opacity 1.5s ease-in-out'; // Transition opacity
            bgDiv.style.zIndex = '0'; // Behind hero content

            heroSection.appendChild(bgDiv);
            bgDivs.push(bgDiv); // Store reference
        });

        // Create background slideshow function
        function changeBackground() {
            const previousImageIndex = currentImageIndex;
            currentImageIndex = (currentImageIndex + 1) % bgImages.length;

            // Fade out the previous image
            bgDivs[previousImageIndex].style.opacity = '0';

            // Fade in the current image
            bgDivs[currentImageIndex].style.opacity = '1';
        }

        // Change background every 7 seconds
        setInterval(changeBackground, 7000);

        // --- END: Revised Slideshow Logic ---
    }

    // Ensure hero content is above the background layers
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.position = "relative"; // Make z-index apply
        heroContent.style.zIndex = "1";        // Ensure it's above the z-index: 0 backgrounds
    }

    // Typing animation for personal notes (Keep as is)
    const noteContent = document.querySelector('.note-content p');
    if (noteContent) {
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

    // Fade in animation for newsletter (Keep as is)
    const newsletterElements = document.querySelectorAll('.newsletter-content h3, .newsletter-content p');
    newsletterElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 500 + 500);
    });

    // Mobile menu functionality (Keep as is)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    // Check if mobileMenuBtn exists before proceeding
    if (mobileMenuBtn) {
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

    // Animate stats (Keep as is)
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

    // Fetch real trending topics from Google Trends API (mock implementation) (Keep as is)
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


    // Mock data for news items (Keep as is)
    const mockNewsData = [ /* ... your news data ... */ ];
     mockNewsData = [
        {
            id: 1,
            title: "The Ethics of Artificial Consciousness",
            excerpt: "Philosophers and AI researchers debate what consciousness might mean for machine intelligence.",
            category: "philosophy",
            date: new Date().toISOString().split('T')[0],
            source: "Philosophy Today"
        },
        {
            id: 2,
            title: "Next-Gen UI Paradigms Emerging",
            excerpt: "Radical new interface designs challenge our traditional WIMP models of interaction.",
            category: "design",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            source: "Design Systems"
        },
        {
            id: 3,
            title: "Breakthrough in Room-Temperature Superconductors",
            excerpt: "New material shows superconducting properties at temperatures previously thought impossible.",
            category: "science",
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            source: "Science Advances"
        },
        {
            id: 4,
            title: "The Decentralized Web Gains Momentum",
            excerpt: "Fediverse and blockchain-based platforms see unprecedented growth as users seek alternatives.",
            category: "tech",
            date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
            source: "Tech Futures"
        },
        {
            id: 5,
            title: "Biological Computers Make First Calculations",
            excerpt: "Researchers demonstrate successful computation using living neurons in vitro.",
            category: "science",
            date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
            source: "Nature BioTech"
        },
        {
            id: 6,
            title: "New Minimalist Design Language Emerges",
            excerpt: "Designers embrace radical simplicity in reaction to information overload.",
            category: "design",
            date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
            source: "Aesthetic Journal"
        }
    ];


    // Function to render news items (Keep as is, added checks)
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

    // Filter news items (Keep as is, added checks)
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
    }

    // Initialize with all news items
    renderNewsItems(mockNewsData);

    // Set up filter event listeners (Keep as is, added checks)
    const categoryFilterEl = document.getElementById('category-filter');
    const timeFilterEl = document.getElementById('time-filter');
    if (categoryFilterEl) categoryFilterEl.addEventListener('change', filterNews);
    if (timeFilterEl) timeFilterEl.addEventListener('change', filterNews);

    // Load more button functionality (Keep as is, added checks)
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const newsGrid = document.querySelector('.news-grid');
            if (!newsGrid) return; // Add check

            const currentCount = newsGrid.querySelectorAll('.news-item').length;
            const newItems = mockNewsData.slice(currentCount, currentCount + 3); // Ensure mockNewsData is accessible

            if (newItems.length > 0) {
                newItems.forEach(item => {
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

                if (newsGrid.querySelectorAll('.news-item').length >= mockNewsData.length) {
                    this.style.display = 'none';
                }
            } else {
                this.style.display = 'none';
            }
        });
         // Hide button initially if not enough items
         if (newsGrid.querySelectorAll('.news-item').length >= mockNewsData.length) {
            loadMoreBtn.style.display = 'none';
        }
    }


    // Newsletter form submission (Keep as is, added checks)
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');

    if (newsletterForm && formMessage) { // Add check
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailEl = document.getElementById('email');
            const feedbackEl = document.getElementById('feedback');
            if (!emailEl) return; // Add check

            const email = emailEl.value;
            const feedback = feedbackEl ? feedbackEl.value : ''; // Check if feedback exists

            if (!email) {
                formMessage.textContent = 'Please enter your email address.';
                formMessage.className = 'form-message error visible'; // Ensure visibility
                return;
            }

            formMessage.textContent = 'Thank you for tuning in. Your frequency has been noted.';
            formMessage.className = 'form-message success visible'; // Ensure visibility

            newsletterForm.reset();

            // Remove message after a delay
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);


            console.log('Newsletter submission:', { email, feedback });
        });
    }

});
