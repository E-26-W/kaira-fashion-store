document.addEventListener('DOMContentLoaded', () => {

    // ── Banner slider (.slider-track) ───────────────────────
    const track = document.querySelector('.slider-track');
    const wrapper = document.querySelector('.slider-wrapper');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let currentIndex = 0;
    const totalCards = cards.length;
    const gap = 30;

    function getCardsPerView() {
        const vw = window.innerWidth;
        if (vw <= 600) return 1;
        if (vw <= 900) return 2;
        return 3;
    }

    function setCardWidths() {
        const cardsPerView = getCardsPerView();
        const totalGap = gap * (cardsPerView - 1);
        const cardWidth = (wrapper.offsetWidth - totalGap) / cardsPerView;
        cards.forEach(card => {
            card.style.width = cardWidth + 'px';
            card.style.flexShrink = '0';
        });
        return cardWidth;
    }

    function updateSlider() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        currentIndex = Math.min(currentIndex, maxIndex);
        const cardWidth = setCardWidths();
        const moveAmount = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveAmount}px)`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    nextBtn.addEventListener('click', () => {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        if (currentIndex < maxIndex) { currentIndex++; updateSlider(); }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateSlider(); }
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // ── Generic product slider factory ──────────────────────
    // Finds a .product-section by the id of its .product-track,
    // wires up its prev/next buttons, and handles resize.
    function makeProductSlider(trackId) {
        const section = document.getElementById(trackId)?.closest('.product-section');
        if (!section) return;

        const prodTrack   = section.querySelector('.product-track');
        const prodWrapper = section.querySelector('.product-slider-overflow');
        const prodCards   = section.querySelectorAll('.product-card');
        const prevBtn     = section.querySelector('.prod-prev');
        const nextBtn     = section.querySelector('.prod-next');

        if (!prodTrack || !prodWrapper || !prodCards.length) return;

        let index = 0;
        const total = prodCards.length;
        const gap = 20;

        function getPerView() {
            const vw = window.innerWidth;
            if (vw <= 600) return 1;
            if (vw <= 900) return 2;
            return 4;
        }

        function setWidths() {
            const perView = getPerView();
            const totalGap = gap * (perView - 1);
            const cardWidth = (prodWrapper.offsetWidth - totalGap) / perView;
            prodCards.forEach(c => {
                c.style.width = cardWidth + 'px';
                c.style.flexShrink = '0';
            });
            return cardWidth;
        }

        function update() {
            const perView = getPerView();
            const maxIndex = Math.max(0, total - perView);
            index = Math.min(index, maxIndex);
            const cardWidth = setWidths();
            prodTrack.style.transform = `translateX(-${(cardWidth + gap) * index}px)`;
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index >= maxIndex;
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, total - getPerView());
            if (index < maxIndex) { index++; update(); }
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            if (index > 0) { index--; update(); }
        });

        window.addEventListener('resize', update);
        update();
    }

    // Wire up "Our New Arrivals" slider
    makeProductSlider('arrivals-track');

    // Wire up "Best Selling Items" slider
    makeProductSlider('bestselling-track');

    // Wire up "You May Also Like" slider
    makeProductSlider('mayalsolike-track');

    // ── Testimonial carousel ─────────────────────────────────
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const testimonialDots  = document.querySelectorAll('.t-dot');
    let activeTestimonial  = 0;

    function showTestimonial(index) {
        const total = testimonialItems.length;
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active', 'prev', 'next');
            if (i === index) {
                item.classList.add('active');
            } else if (i === (index - 1 + total) % total) {
                item.classList.add('prev');
            } else if (i === (index + 1) % total) {
                item.classList.add('next');
            }
        });
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        activeTestimonial = index;
    }

    testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(parseInt(dot.dataset.index));
        });
    });

    // Auto-advance every 4 seconds
    setInterval(() => {
        showTestimonial((activeTestimonial + 1) % testimonialItems.length);
    }, 4000);

    showTestimonial(0);

    // ── Search toggle ────────────────────────────────────────
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox    = document.getElementById('searchBox');
    const searchInput  = document.getElementById('searchInput');
    const searchClose  = document.getElementById('searchClose');

    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.add('open');
            searchInput.focus();
        });

        searchClose.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.remove('open');
            searchInput.value = '';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                searchBox.classList.remove('open');
                searchInput.value = '';
            }
        });

        // Close on Escape key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchBox.classList.remove('open');
                searchInput.value = '';
            }
        });
    }

    // ── Mobile menu toggle ───────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.KAIRA');
    const navIcons = document.querySelector('.KAIRA1');

    if (menuToggle && navMenu && navIcons) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open', isOpen);
            navIcons.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.K2')) {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                navIcons.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                navIcons.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    }

});
