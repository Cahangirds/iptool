// Search functionality
document.querySelector('.search-btn').addEventListener('click', function() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Add loading animation
        this.innerHTML = '<div class="loading"></div>';
        
        // Simulate search delay
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-search"></i>';
            alert('Axtarış nəticələri: "' + query + '" üçün məqalələr tapıldı');
        }, 1000);
    }
});

// Enter key for search
document.querySelector('.search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.querySelector('.search-btn').click();
    }
});

// Category filtering
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Simulate filtering animation
        const cards = document.querySelectorAll('.blog-card');
        cards.forEach(card => {
            card.style.opacity = '0.3';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 200);
        });
    });
});

// Card hover effects
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Pagination
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!this.classList.contains('active')) {
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            
            if (this.innerHTML.includes('chevron')) {
                // Handle prev/next buttons
                const currentActive = document.querySelector('.page-btn.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
            } else {
                this.classList.add('active');
            }
            
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});

// Add some dynamic effects on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.blog-header');
    
    if (scrolled > 100) {
        header.style.backgroundColor = 'rgba(15, 15, 35, 0.98)';
    } else {
        header.style.backgroundColor = 'rgba(15, 15, 35, 0.95)';
    }
});

// Advanced search functionality
function advancedSearch(query, category = 'all') {
    const articles = document.querySelectorAll('.blog-card');
    let results = [];
    
    articles.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
            results.push(card);
        }
    });
    
    return results;
}

// Filter articles by category
function filterByCategory(category) {
    const articles = document.querySelectorAll('.blog-card');
    
    articles.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
            
            if (title.includes(category.toLowerCase()) || excerpt.includes(category.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Lazy loading for images (if needed in future)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('IP Tools Blog yükləndi');
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Share functionality (if needed)
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback for browsers without Web Share API
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Link kopyalandı!');
    }
}

// Dark/Light theme toggle (if needed)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    
    const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}