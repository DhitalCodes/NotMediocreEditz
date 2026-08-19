/**
 * NOT MEDIOCRE EDITZ — Interactive Behaviors
 * Premium interactions with mathematical precision
 */

(function () {
    "use strict";

    // ===== Mobile Menu =====
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mobileMenu.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.style.overflow = isOpen ? "hidden" : "";
        });

        mobileMenu.querySelectorAll("a[href^='#']").forEach(function (link) {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
            });
        });
    }

    // ===== Portfolio Filtering =====
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const portfolioCards = Array.from(document.querySelectorAll(".portfolio-card"));

    function applyFilter(filterValue) {
        let visibleIndex = 0;

        portfolioCards.forEach(function (card) {
            const category = card.getAttribute("data-category");
            const shouldShow = category === filterValue;

            if (shouldShow) {
                card.classList.remove("is-hidden");
                // Reset stagger delay based on visible position
                card.style.setProperty("--delay", (visibleIndex * 80) + "ms");
                card.classList.remove("in-view");
                visibleIndex++;
            } else {
                card.classList.add("is-hidden");
            }
        });

        // Trigger refresh for scroll animations
        setTimeout(function () {
            document.dispatchEvent(new Event("sections:refresh"));
        }, 50);
    }

    if (filterButtons.length > 0) {
        // Initialize with first button or active button
        const initiallyActive = filterButtons.find(function (button) {
            return button.classList.contains("active");
        }) || filterButtons[0];

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
        initiallyActive.classList.add("active");
        applyFilter(initiallyActive.getAttribute("data-filter"));

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                filterButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });
                button.classList.add("active");
                applyFilter(button.getAttribute("data-filter"));
            });
        });
    }

    // ===== Media Modal =====
    const mediaModal = document.getElementById("mediaModal");
    const mediaModalContent = document.getElementById("mediaModalContent");
    const mediaModalClose = document.getElementById("mediaModalClose");
    let currentFocus = null;

    function openModalWithImage(src, altText) {
        if (!mediaModal || !mediaModalContent) return;

        currentFocus = document.activeElement;

        const image = document.createElement("img");
        image.src = src;
        image.alt = altText || "Portfolio thumbnail";
        image.style.opacity = "0";
        image.style.transition = "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)";

        mediaModalContent.innerHTML = "";
        mediaModalContent.appendChild(image);

        mediaModal.classList.add("open");
        mediaModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Fade in image after modal opens
        requestAnimationFrame(function () {
            image.style.opacity = "1";
        });

        // Focus management
        if (mediaModalClose) {
            setTimeout(function () {
                mediaModalClose.focus();
            }, 100);
        }
    }

    function openModalWithVideo(videoId) {
        if (!mediaModal || !mediaModalContent || !videoId) return;

        currentFocus = document.activeElement;

        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1";
        iframe.title = "Portfolio video";
        iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
        iframe.setAttribute("allowfullscreen", "true");
        iframe.style.opacity = "0";
        iframe.style.transition = "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)";

        mediaModalContent.innerHTML = "";
        mediaModalContent.appendChild(iframe);

        mediaModal.classList.add("open");
        mediaModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        requestAnimationFrame(function () {
            iframe.style.opacity = "1";
        });

        if (mediaModalClose) {
            setTimeout(function () {
                mediaModalClose.focus();
            }, 100);
        }
    }

    function closeMediaModal() {
        if (!mediaModal || !mediaModalContent) return;

        mediaModal.classList.remove("open");
        mediaModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Clear content after transition
        setTimeout(function () {
            mediaModalContent.innerHTML = "";
        }, 300);

        // Return focus
        if (currentFocus) {
            currentFocus.focus();
            currentFocus = null;
        }
    }

    if (mediaModalClose) {
        mediaModalClose.addEventListener("click", closeMediaModal);
    }

    if (mediaModal) {
        mediaModal.addEventListener("click", function (event) {
            if (event.target === mediaModal) {
                closeMediaModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && mediaModal.classList.contains("open")) {
            closeMediaModal();
        }
    });

    // ===== Portfolio Card Interactions =====
    portfolioCards.forEach(function (card) {
        const mediaType = card.getAttribute("data-type");
        const videoId = card.getAttribute("data-video");
        const imageSrc = card.getAttribute("data-image-src") || card.querySelector("img")?.getAttribute("src");
        const imageAlt = card.querySelector("img")?.getAttribute("alt") || "Portfolio item";

        const cardHitbox = card.querySelector(".card-hitbox");
        if (cardHitbox) {
            cardHitbox.addEventListener("click", function () {
                if (mediaType === "video") {
                    openModalWithVideo(videoId);
                } else {
                    openModalWithImage(imageSrc, imageAlt);
                }
            });
        }

        const playButton = card.querySelector(".portfolio-media-btn[data-action='play']");
        if (playButton) {
            playButton.addEventListener("click", function (event) {
                event.stopPropagation();
                openModalWithVideo(videoId);
            });
        }

        const zoomButton = card.querySelector(".thumb-zoom");
        if (zoomButton) {
            zoomButton.addEventListener("click", function (event) {
                event.stopPropagation();
                openModalWithImage(imageSrc, imageAlt);
            });
        }
    });

    // ===== Image Fallback Handling =====
    document.querySelectorAll("img[data-fallback]").forEach(function (image) {
        image.addEventListener("error", function onError() {
            const fallback = image.getAttribute("data-fallback");
            if (!fallback) return;
            image.removeEventListener("error", onError);
            image.src = fallback;
        });
    });

    // ===== Dynamic Year =====
    const yearNode = document.getElementById("year");
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    // ===== Magnetic Button Effect (subtle) =====
    const magneticButtons = document.querySelectorAll(".btn, .portfolio-media-btn, .thumb-zoom");

    magneticButtons.forEach(function (btn) {
        btn.addEventListener("mousemove", function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle magnetic pull (max 4px)
            const maxPull = 4;
            const pullX = (x / rect.width) * maxPull;
            const pullY = (y / rect.height) * maxPull;

            btn.style.transform = "translate(" + pullX + "px, " + pullY + "px)";
        });

        btn.addEventListener("mouseleave", function () {
            btn.style.transform = "";
        });
    });

    // ===== Scroll Parallax Layers =====
    const parallaxLayers = Array.from(document.querySelectorAll(".parallax-layer"));
    const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (parallaxLayers.length > 0 && allowMotion) {
        let tickingParallax = false;

        function updateParallaxLayers() {
            const scrollY = window.scrollY;

            parallaxLayers.forEach(function (layer) {
                const speed = Number(layer.getAttribute("data-speed")) || 0.08;
                layer.style.transform = "translate3d(0, " + (scrollY * speed) + "px, 0)";
            });

            tickingParallax = false;
        }

        window.addEventListener("scroll", function () {
            if (!tickingParallax) {
                requestAnimationFrame(updateParallaxLayers);
                tickingParallax = true;
            }
        });

        updateParallaxLayers();
    }

    // ===== Parallax Effect for Hero Card =====
    // Writes two CSS custom properties (`--tilt-x`, `--tilt-y`) so the card's
    // final transform is composed by CSS. This keeps the existing :hover
    // lift and the IO-driven reveal animation working alongside the tilt
    // without one overwriting the other. Pauses when offscreen or when the
    // user hasn't moved the mouse in a while.
    const heroCard = document.querySelector(".hero-card");
    if (heroCard && window.matchMedia("(min-width: 900px)").matches && allowMotion) {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let lastMoveAt = 0;
        let rafId = null;
        let visible = false;

        const TILT_MAX_DEG = 3;
        const IDLE_MS = 2500;

        document.addEventListener("mousemove", function (e) {
            targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            lastMoveAt = Date.now();
        });

        function tick() {
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;

            heroCard.style.setProperty("--tilt-x", (currentY * -TILT_MAX_DEG) + "deg");
            heroCard.style.setProperty("--tilt-y", (currentX * TILT_MAX_DEG) + "deg");

            // Pause the rAF loop when nothing is changing AND the card is offscreen
            // OR the user has been idle for a moment.
            const idle = (Date.now() - lastMoveAt) > IDLE_MS;
            const settled = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
            if ((idle || !visible) && settled) {
                rafId = null;
                return;
            }

            rafId = requestAnimationFrame(tick);
        }

        function ensureRunning() {
            if (rafId === null) {
                lastMoveAt = Date.now();
                rafId = requestAnimationFrame(tick);
            }
        }

        if ("IntersectionObserver" in window) {
            const heroObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    visible = entry.isIntersecting;
                    if (visible) ensureRunning();
                });
            }, { threshold: 0.1 });
            heroObserver.observe(heroCard);
        } else {
            visible = true;
            ensureRunning();
        }
    }
})();