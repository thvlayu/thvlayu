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
        
        // Set initial background image
        heroSection.style.backgroundImage = `url('${bgImages[0]}')`;  // Start with bg0
        heroSection.style.backgroundSize = "cover";
        heroSection.style.backgroundPosition = "center";
        heroSection.style.position = "relative";
        heroSection.style.marginTop = "1.5rem";
        heroSection.style.transition = "background-image 2.5s ease-in-out";
        
        // Create background slideshow
        function changeBackground() {
            currentImageIndex = (currentImageIndex + 1) % bgImages.length;
            
            // Create a new div for the next image to enable crossfade
            const nextImageDiv = document.createElement('div');
            nextImageDiv.className = 'hero-bg-transition';
            nextImageDiv.style.backgroundImage = `url('${bgImages[currentImageIndex]}')`;  
            nextImageDiv.style.position = 'absolute';
            nextImageDiv.style.top = '0';
            nextImageDiv.style.left = '0';
            nextImageDiv.style.width = '100%';
            nextImageDiv.style.height = '100%';
            nextImageDiv.style.backgroundSize = 'cover';
            nextImageDiv.style.backgroundPosition = 'center';
            nextImageDiv.style.opacity = '0';
            nextImageDiv.style.transition = 'opacity 1.5s ease-in-out';
            nextImageDiv.style.zIndex = '0';
            
            // Add the new div to hero section
            heroSection.appendChild(nextImageDiv);
            
            // Fade in the new image
            setTimeout(() => {
                nextImageDiv.style.opacity = '1';
            }, 50);
            
            // After transition completes, set the main background and remove the transition div
            setTimeout(() => {
                heroSection.style.backgroundImage = `url('${bgImages[currentImageIndex]}')`;
                heroSection.removeChild(nextImageDiv);
            }, 1600);
        }
        
        // Change background every 7 seconds
        setInterval(changeBackground, 7000);
    }
    
    // Add overlay to hero section with reduced blur for better performance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.position = "relative";
        heroContent.style.zIndex = "2";
    }
    
    // Typing animation for personal notes
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

    // Fade in animation for newsletter
    const newsletterElements = document.querySelectorAll('.newsletter-content h3, .newsletter-content p');
    newsletterElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 500 + 500);
    });
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
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
    
    // Create close button for mobile menu
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
    const hamburgerBtn = document.querySelector('.mobile-menu-btn');
    
    function toggleMenu() {
        document.body.classList.toggle('menu-open');
        mobileMenuContent.classList.toggle('menu-open');
        overlay.classList.toggle('visible');
        hamburgerBtn.classList.toggle('menu-open');
    }
    
    hamburgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    
    // Animate stats
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
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
    
    // Fetch real trending topics from Google Trends API (mock implementation)
    async function fetchTrendingTopics() {
        // In a real implementation, you would use the Google Trends API
        // This is a mock implementation with sample data
        const mockTrends = [
            "Generative AI",
            "Quantum Computing",
            "Neural Interfaces",
            "Post-Capitalism",
            "Climate Adaptation",
            "Digital Minimalism",
            "Web4 Concepts",
            "Biohacking"
        ];
        
        const topicsContainer = document.getElementById('trending-topics');
        topicsContainer.innerHTML = '';
        
        // Shuffle and take first 5
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
    
    // Mock data for news items
    // Limit news items to 3 per category
const mockNewsData = [
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
    
    // Function to render news items
    function renderNewsItems(items) {
        const newsGrid = document.querySelector('.news-grid');
        newsGrid.innerHTML = '';
        
        items.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            // Determine category color
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
    
    // Filter news items
    function filterNews() {
        const categoryFilter = document.getElementById('category-filter').value;
        const timeFilter = document.getElementById('time-filter').value;
        
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
    
    // Set up filter event listeners
    document.getElementById('category-filter').addEventListener('change', filterNews);
    document.getElementById('time-filter').addEventListener('change', filterNews);
    
    // Load more button functionality
    document.querySelector('.load-more').addEventListener('click', function() {
        // In a real app, this would fetch more data from an API
        const currentCount = document.querySelectorAll('.news-item').length;
        const newItems = mockNewsData.slice(currentCount, currentCount + 3);
        
        if (newItems.length > 0) {
            const newsGrid = document.querySelector('.news-grid');
            
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
            
            if (currentCount + newItems.length >= mockNewsData.length) {
                this.style.display = 'none';
            }
        } else {
            this.style.display = 'none';
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const feedback = document.getElementById('feedback').value;
        
        // Simple validation
        if (!email) {
            formMessage.textContent = 'Please enter your email address.';
            formMessage.className = 'form-message error';
            return;
        }
        
        // Simulate successful submission
        formMessage.textContent = 'Thank you for tuning in. Your frequency has been noted.';
        formMessage.className = 'form-message success';
        
        // Reset form
        newsletterForm.reset();
        
        // Log the data (in real implementation, send to server)
        console.log('Newsletter submission:', { email, feedback });
    });
});