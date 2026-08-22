/**
 * NOT MEDIOCRE EDITZ — Interactive Behaviors
 * Premium interactions with mathematical precision
 */

(function () {
    "use strict";

    // ===== Reduced Motion Preference =====
    const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ===== Background Region Isolation (inert) =====
    const BG_ALL = [".site-header", "#main", ".site-footer"];
    const BG_MENU = ["#main", ".site-footer"];

    function setRegionInert(selectors, inert) {
        selectors.forEach(function (selector) {
            const el = document.querySelector(selector);
            if (el) {
                if (inert) {
                    el.setAttribute("inert", "");
                } else {
                    el.removeAttribute("inert");
                }
            }
        });
    }

    // ===== Mobile Menu =====
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mobileMenu.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.style.overflow = isOpen ? "hidden" : "";
            setRegionInert(BG_MENU, isOpen);
        });

        mobileMenu.querySelectorAll("a[href^='#']").forEach(function (link) {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
                setRegionInert(BG_MENU, false);
            });
        });
    }

    // ===== Portfolio Filtering =====
    // Filtering applies to the main Work grid only (#portfolioGrid).
    // The "Also offering" thumbnail strip reuses .portfolio-card markup
    // but must never be filtered/hidden, so it stays out of this list.
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const portfolioCards = Array.from(document.querySelectorAll("#portfolioGrid .portfolio-card"));
    const allPortfolioCards = Array.from(document.querySelectorAll(".portfolio-card"));
    const portfolioGrid = document.getElementById("portfolioGrid");

    const FILTER_FADE_MS = 220;
    let activeFilter = null;
    let filterTimer = null;
    let filterInitialized = false;

    function applyFilter(filterValue, animate) {
        if (animate && filterValue === activeFilter && filterInitialized) return;

        const outgoing = portfolioCards.filter(function (card) {
            return card.getAttribute("data-category") !== filterValue &&
                   !card.classList.contains("is-hidden");
        });

        if (filterTimer) {
            clearTimeout(filterTimer);
            filterTimer = null;
        }

        if (!animate) {
            // Initial load: hide non-matching cards immediately and let the
            // scroll observer reveal the matching ones naturally.
            let visibleIndex = 0;
            portfolioCards.forEach(function (card) {
                const shouldShow = card.getAttribute("data-category") === filterValue;
                card.classList.remove("is-fading");
                card.classList.remove("in-view");
                card.classList.toggle("is-hidden", !shouldShow);
                card.style.setProperty("--delay", shouldShow ? (visibleIndex * 80) + "ms" : "0ms");
                if (shouldShow) visibleIndex++;
            });
            document.dispatchEvent(new Event("sections:refresh"));
            return;
        }

        // Phase 1 — ease the outgoing cards out.
        outgoing.forEach(function (card) {
            card.style.setProperty("--delay", "0ms");
            card.classList.add("is-fading");
        });

        // Phase 2 — swap visibility and ease the incoming cards back in.
        filterTimer = setTimeout(function () {
            let visibleIndex = 0;
            portfolioCards.forEach(function (card) {
                const shouldShow = card.getAttribute("data-category") === filterValue;
                card.classList.remove("is-fading");
                card.style.setProperty("--delay", shouldShow ? (visibleIndex * 80) + "ms" : "0ms");
                card.classList.toggle("is-hidden", !shouldShow);
                card.classList.remove("in-view");
                if (shouldShow) visibleIndex++;
            });

            // Force a reflow so the entrance transition starts from the
            // hidden state instead of popping in.
            if (portfolioGrid) void portfolioGrid.offsetWidth;

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    portfolioCards.forEach(function (card) {
                        if (!card.classList.contains("is-hidden")) {
                            card.classList.add("in-view");
                        }
                    });
                });
            });

            document.dispatchEvent(new Event("sections:refresh"));
        }, FILTER_FADE_MS);
    }

    if (filterButtons.length > 0) {
        // Initialize with first button or active button
        const initiallyActive = filterButtons.find(function (button) {
            return button.classList.contains("active");
        }) || filterButtons[0];

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });
        initiallyActive.classList.add("active");
        initiallyActive.setAttribute("aria-pressed", "true");
        activeFilter = initiallyActive.getAttribute("data-filter");
        applyFilter(activeFilter, false);
        filterInitialized = true;

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                filterButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-pressed", "false");
                });
                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");
                activeFilter = button.getAttribute("data-filter");
                applyFilter(activeFilter, true);
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
        setRegionInert(BG_ALL, true);

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

    function openModalWithVideo(videoId, title) {
        if (!mediaModal || !mediaModalContent || !videoId) return;

        currentFocus = document.activeElement;

        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1";
        iframe.title = title || "Portfolio video";
        iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
        iframe.setAttribute("allowfullscreen", "true");
        iframe.style.opacity = "0";
        iframe.style.transition = "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)";

        mediaModalContent.innerHTML = "";
        mediaModalContent.appendChild(iframe);

        mediaModal.classList.add("open");
        mediaModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        setRegionInert(BG_ALL, true);

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
        setRegionInert(BG_ALL, false);

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
        if (event.key === "Escape") {
            if (mediaModal.classList.contains("open")) {
                closeMediaModal();
            } else if (mobileMenu && mobileMenu.classList.contains("open")) {
                mobileMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
                setRegionInert(BG_MENU, false);
                menuToggle.focus();
            }
        }
    });

    // ===== Modal Focus Trap =====
    if (mediaModal) {
        mediaModal.addEventListener("keydown", function (event) {
            if (event.key !== "Tab") return;

            const focusables = mediaModal.querySelectorAll(
                'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
            );
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    // ===== Portfolio Card Interactions =====
    allPortfolioCards.forEach(function (card) {
        const mediaType = card.getAttribute("data-type");
        const videoId = card.getAttribute("data-video");
        const imageSrc = card.getAttribute("data-image-src") || card.querySelector("img")?.getAttribute("src");
        const imageAlt = card.querySelector("img")?.getAttribute("alt") || "Portfolio item";
        const titleEl = card.querySelector(".card-title");
        const cardTitle = titleEl ? titleEl.textContent.trim() : "";

        const cardHitbox = card.querySelector(".card-hitbox");
        if (cardHitbox) {
            cardHitbox.addEventListener("click", function () {
                if (mediaType === "video") {
                    openModalWithVideo(videoId, cardTitle);
                } else {
                    openModalWithImage(imageSrc, imageAlt);
                }
            });
        }

        const playButton = card.querySelector(".portfolio-media-btn[data-action='play']");
        if (playButton) {
            playButton.addEventListener("click", function (event) {
                event.stopPropagation();
                openModalWithVideo(videoId, cardTitle);
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

    // ===== Hover Preview Clips (video cards) =====
    // On hover/focus, a muted autoplaying YouTube embed fades in over the
    // thumbnail to give a taste of pacing without a click. Only enabled on
    // devices that actually have hover (touch devices keep the static
    // thumbnail) and only when the user hasn't asked for reduced motion.
    // The iframe is pointer-events: none and sits under the card hitbox,
    // so a click still opens the in-page modal.
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hoverCapable && allowMotion) {
        const videoCards = allPortfolioCards.filter(function (card) {
            return card.getAttribute("data-type") === "video";
        });

        videoCards.forEach(function (card) {
            const videoId = card.getAttribute("data-video");
            if (!videoId) return;

            let previewFrame = null;

            function getPreviewFrame() {
                if (!previewFrame) {
                    previewFrame = document.createElement("iframe");
                    previewFrame.className = "card-preview";
                    previewFrame.title = "Video preview";
                    previewFrame.setAttribute("tabindex", "-1");
                    previewFrame.setAttribute("aria-hidden", "true");
                    previewFrame.setAttribute("allow", "autoplay; encrypted-media");
                    previewFrame.src = "https://www.youtube.com/embed/" + videoId +
                        "?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=" + videoId;
                }
                return previewFrame;
            }

            function showPreview() {
                if (!card.querySelector(".card-preview")) {
                    card.appendChild(getPreviewFrame());
                    card.classList.add("is-previewing");
                }
            }

            function hidePreview() {
                card.classList.remove("is-previewing");
                if (previewFrame) {
                    previewFrame.remove();
                }
            }

            card.addEventListener("mouseenter", showPreview);
            card.addEventListener("mouseleave", hidePreview);
            card.addEventListener("focusin", showPreview);
            card.addEventListener("focusout", hidePreview);
        });
    }

    // ===== Dynamic Year =====
    const yearNode = document.getElementById("year");
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    // ===== Magnetic Button Effect (subtle) =====
    const magneticButtons = document.querySelectorAll(".btn, .portfolio-media-btn, .thumb-zoom");

    if (magneticButtons.length > 0 && allowMotion) {
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
    }

    // ===== Scroll Parallax Layers =====
    // Scroll position is eased toward the target each frame so the layers
    // glide smoothly instead of jittering 1:1 with the scrollbar.
    const parallaxLayers = Array.from(document.querySelectorAll(".parallax-layer"));

    if (parallaxLayers.length > 0 && allowMotion) {
        let targetScroll = window.scrollY;
        let currentScroll = window.scrollY;
        let parallaxRaf = null;

        function tickParallax() {
            currentScroll += (targetScroll - currentScroll) * 0.12;

            parallaxLayers.forEach(function (layer) {
                const speed = Number(layer.getAttribute("data-speed")) || 0.08;
                layer.style.transform = "translate3d(0, " + (currentScroll * speed) + "px, 0)";
            });

            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                parallaxRaf = requestAnimationFrame(tickParallax);
            } else {
                parallaxRaf = null;
            }
        }

        window.addEventListener("scroll", function () {
            targetScroll = window.scrollY;
            if (parallaxRaf === null) {
                parallaxRaf = requestAnimationFrame(tickParallax);
            }
        }, { passive: true });

        tickParallax();
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

    // ===== Hero Showreel =====
    // Fades the hero <video> in over the poster photo only once it is
    // actually playable. Removes the element entirely for reduced-motion
    // users or if the showreel file is missing (leaving the photo frame).
    const heroVideo = document.querySelector(".hero-video");

    if (heroVideo) {
        if (!allowMotion) {
            heroVideo.remove();
        } else {
            heroVideo.setAttribute("autoplay", "");

            function heroVideoReady() {
                heroVideo.classList.add("is-ready");
            }

            function heroVideoFailed() {
                heroVideo.remove();
            }

            heroVideo.addEventListener("canplay", heroVideoReady);
            heroVideo.addEventListener("error", heroVideoFailed);

            const playPromise = heroVideo.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(heroVideoFailed);
            }
        }
    }
})();