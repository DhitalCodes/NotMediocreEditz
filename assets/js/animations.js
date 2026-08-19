/**
 * NOT MEDIOCRE EDITZ — Scroll Animations
 * Uses IntersectionObserver with mathematical thresholds
 */

(function () {
    "use strict";

    // Configuration based on visual perception research
    const CONFIG = {
        threshold: 0.15,        // 15% visibility triggers animation
        rootMargin: "0px 0px -50px 0px",
        staggerBase: 80,        // Base delay in ms (follows golden ratio progression)
        staggerRatio: 1.3       // Approximation of sqrt(phi) for natural feel
    };

    const revealTargets = Array.from(document.querySelectorAll(".reveal-up"));

    // Fallback for browsers without IntersectionObserver
    if (!("IntersectionObserver" in window)) {
        revealTargets.forEach(function (el) {
            el.classList.add("in-view");
        });
        return;
    }

    // Create observer with precise timing
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                // Add small delay based on element position for natural stagger
                const rect = entry.target.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const position = rect.top / viewportHeight;
                const delay = Math.min(position * 200, 400);

                entry.target.style.transitionDelay = delay + "ms";
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        }
    );

    // Observe all targets
    revealTargets.forEach(function (target) {
        observer.observe(target);
    });

    // Refresh observer when content changes (e.g., after filter)
    document.addEventListener("sections:refresh", function () {
        revealTargets
            .filter(function (el) {
                return !el.classList.contains("in-view") && !el.classList.contains("is-hidden");
            })
            .forEach(function (el) {
                observer.observe(el);
            });
    });

    // Header scroll effect
    const header = document.querySelector(".site-header");
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        lastScroll = scrollY;
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Smooth scroll for anchor links with offset calculation
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#top" || targetId === "#main") return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
})();