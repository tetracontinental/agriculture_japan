// Agriculture Japan Website - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeInteractiveElements();
    initializeSearch();
    initializePrintFunction();
});

// Navigation Management
function initializeNavigation() {
    // Set active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'main.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'main.html')) {
            link.classList.add('active');
        }
    });

    // Mobile navigation toggle
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    header.querySelector('.header-content').appendChild(mobileMenuBtn);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('mobile-open');
    });

    // Add mobile styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block !important;
            }
            
            nav {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #2c5530;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            nav.mobile-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            nav ul {
                flex-direction: column;
                padding: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Animation and Visual Effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate stat numbers
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
                
                // Animate progress bars
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.grid-item, .content-card, .stat-card, section, table, .chart-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Number Animation
function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('ja-JP');
    }, 16);
}

// Progress Bar Animation
function animateProgressBar(progressBar) {
    const progressFill = progressBar.querySelector('.progress-fill');
    if (progressFill) {
        const targetWidth = progressFill.dataset.width || '75%';
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = targetWidth;
        }, 200);
    }
}

// Interactive Elements
function initializeInteractiveElements() {
    // Table sorting
    initializeTableSorting();
    
    // Collapsible sections
    initializeCollapsibleSections();
    
    // Chart hover effects
    initializeChartInteractions();
    
    // Copy to clipboard functionality
    initializeCopyToClipboard();
}

// Table Sorting
function initializeTableSorting() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (index === 0) return; // Skip first column (usually labels)
            
            header.style.cursor = 'pointer';
            header.innerHTML += ' <span class="sort-indicator">↕</span>';
            
            header.addEventListener('click', () => {
                sortTable(table, index);
            });
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody') || table;
    const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // Skip header
    
    const isNumeric = rows.every(row => {
        const cell = row.cells[columnIndex];
        return cell && !isNaN(parseFloat(cell.textContent.replace(/[^\d.-]/g, '')));
    });
    
    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent.trim();
        const bVal = b.cells[columnIndex].textContent.trim();
        
        if (isNumeric) {
            return parseFloat(aVal.replace(/[^\d.-]/g, '')) - parseFloat(bVal.replace(/[^\d.-]/g, ''));
        } else {
            return aVal.localeCompare(bVal, 'ja-JP');
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Collapsible Sections
function initializeCollapsibleSections() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const header = section.querySelector('h2, h3');
        if (header) {
            header.style.cursor = 'pointer';
            header.innerHTML += ' <span class="collapse-indicator">−</span>';
            
            header.addEventListener('click', () => {
                const content = section.querySelector('*:not(h2):not(h3)');
                const indicator = header.querySelector('.collapse-indicator');
                
                if (content.style.display === 'none') {
                    content.style.display = '';
                    indicator.textContent = '−';
                } else {
                    content.style.display = 'none';
                    indicator.textContent = '+';
                }
            });
        }
    });
}

// Chart Interactions
function initializeChartInteractions() {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.02)';
            container.style.transition = 'transform 0.3s ease';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1)';
        });
    });
}

// Copy to Clipboard
function initializeCopyToClipboard() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 データをコピー';
        copyBtn.className = 'btn btn-secondary copy-btn';
        copyBtn.style.marginTop = '1rem';
        
        copyBtn.addEventListener('click', () => {
            const tableText = tableToText(table);
            navigator.clipboard.writeText(tableText).then(() => {
                copyBtn.textContent = '✅ コピー完了!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 データをコピー';
                }, 2000);
            });
        });
        
        table.parentNode.insertBefore(copyBtn, table.nextSibling);
    });
}

function tableToText(table) {
    const rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        return cells.map(cell => cell.textContent.trim()).join('\t');
    }).join('\n');
}

// Search Functionality
function initializeSearch() {
    // Create search box
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <div class="search-container" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: none;
        ">
            <input type="text" id="searchInput" placeholder="検索..." style="
                width: 250px;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 1rem;
            ">
            <button id="searchBtn" class="btn" style="margin-left: 0.5rem;">検索</button>
            <button id="closeSearch" style="
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
            ">×</button>
            <div id="searchResults" style="
                max-height: 300px;
                overflow-y: auto;
                margin-top: 1rem;
                display: none;
            "></div>
        </div>
    `;
    
    document.body.appendChild(searchContainer);
    
    // Search toggle button
    const searchToggle = document.createElement('button');
    searchToggle.innerHTML = '🔍';
    searchToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(searchToggle);
    
    // Search event listeners
    const searchContainer_ = document.querySelector('.search-container');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const closeSearch = document.getElementById('closeSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchToggle.addEventListener('click', () => {
        searchContainer_.style.display = 'block';
        searchInput.focus();
    });
    
    closeSearch.addEventListener('click', () => {
        searchContainer_.style.display = 'none';
        clearSearchHighlights();
    });
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        clearSearchHighlights();
        const results = searchInPage(query);
        displaySearchResults(results);
    }
    
    function searchInPage(query) {
        const results = [];
        const elements = document.querySelectorAll('p, li, td, h1, h2, h3, h4');
        
        elements.forEach((element, index) => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                results.push({
                    element: element,
                    text: element.textContent.substring(0, 100) + '...',
                    index: index
                });
                
                // Highlight found text
                const regex = new RegExp(`(${query})`, 'gi');
                element.innerHTML = element.textContent.replace(regex, '<mark style="background: yellow;">$1</mark>');
            }
        });
        
        return results;
    }
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
        } else {
            searchResults.innerHTML = results.map((result, index) => `
                <div style="
                    padding: 0.5rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                " onclick="scrollToResult(${result.index})">
                    <small>結果 ${index + 1}</small><br>
                    ${result.text}
                </div>
            `).join('');
        }
        searchResults.style.display = 'block';
    }
    
    window.scrollToResult = function(index) {
        const elements = document.querySelectorAll('p, li, td, h1, h2, h3, h4');
        elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        elements[index].style.background = 'lightblue';
        setTimeout(() => {
            elements[index].style.background = '';
        }, 2000);
    };
    
    function clearSearchHighlights() {
        const highlights = document.querySelectorAll('mark');
        highlights.forEach(mark => {
            const parent = mark.parentNode;
            parent.textContent = parent.textContent;
        });
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
    }
}

// Print Functionality
function initializePrintFunction() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨️ 印刷';
    printBtn.className = 'btn btn-secondary';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    `;
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    document.body.appendChild(printBtn);
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'メインコンテンツにスキップ';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #4CAF50;
        color: white;
        padding: 8px;
        z-index: 1000;
        text-decoration: none;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`ページ読み込み時間: ${Math.round(loadTime)}ms`);
        
        // Add performance indicator
        if (loadTime > 3000) {
            console.warn('ページの読み込みが遅くなっています');
        }
    });
    
    // Monitor scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Lazy load images if any
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight + 100) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }, 100);
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send error reports in production
});

// Initialize all features
initializeAccessibility();
initializePerformanceMonitoring();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeAnimations,
        animateNumber,
        searchInPage
    };
}