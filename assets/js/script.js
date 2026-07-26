(function () {
    "use strict";

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mobileMenu.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mobileMenu.querySelectorAll("a[href^='#']").forEach(function (link) {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const portfolioCards = Array.from(document.querySelectorAll(".portfolio-card"));

    function applyFilter(filterValue) {
        portfolioCards.forEach(function (card) {
            const category = card.getAttribute("data-category");
            card.classList.toggle("is-hidden", category !== filterValue);
        });
        document.dispatchEvent(new Event("sections:refresh"));
    }

    if (filterButtons.length > 0) {
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

    const mediaModal = document.getElementById("mediaModal");
    const mediaModalContent = document.getElementById("mediaModalContent");
    const mediaModalClose = document.getElementById("mediaModalClose");

    function openModalWithImage(src, altText) {
        if (!mediaModal || !mediaModalContent) {
            return;
        }

        const image = document.createElement("img");
        image.src = src;
        image.alt = altText || "Portfolio thumbnail";
        mediaModalContent.innerHTML = "";
        mediaModalContent.appendChild(image);
        mediaModal.classList.add("open");
        mediaModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function openModalWithVideo(videoId) {
        if (!mediaModal || !mediaModalContent || !videoId) {
            return;
        }

        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";
        iframe.title = "Portfolio video";
        iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
        iframe.setAttribute("allowfullscreen", "true");

        mediaModalContent.innerHTML = "";
        mediaModalContent.appendChild(iframe);
        mediaModal.classList.add("open");
        mediaModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeMediaModal() {
        if (!mediaModal || !mediaModalContent) {
            return;
        }
        mediaModal.classList.remove("open");
        mediaModal.setAttribute("aria-hidden", "true");
        mediaModalContent.innerHTML = "";
        document.body.style.overflow = "";
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
            closeMediaModal();
        }
    });

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

    document.querySelectorAll("img[data-fallback]").forEach(function (image) {
        image.addEventListener("error", function onError() {
            const fallback = image.getAttribute("data-fallback");
            if (!fallback) {
                return;
            }
            image.removeEventListener("error", onError);
            image.src = fallback;
        });
    });

    const brandLogo = document.getElementById("brandLogo");
    const brandTextWrap = document.getElementById("brandTextWrap");

    if (brandLogo && brandTextWrap) {
        brandLogo.addEventListener("error", function () {
            brandLogo.classList.add("is-hidden");
            brandTextWrap.classList.remove("is-hidden");
        });

        brandLogo.addEventListener("load", function () {
            brandTextWrap.classList.add("is-hidden");
        });
    }

    const resumeDownload = document.getElementById("resumeDownload");
    const resumeHint = document.getElementById("resumeHint");

    if (resumeDownload && resumeHint) {
        const resumeUrl = resumeDownload.getAttribute("href");
        if (resumeUrl && window.location.protocol.indexOf("http") === 0) {
            fetch(resumeUrl, { method: "HEAD" })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Resume missing");
                    }
                })
                .catch(function () {
                    resumeDownload.classList.add("is-hidden");
                    resumeHint.textContent = "Resume download will be enabled after assets/documents/resume.pdf is added.";
                });
        }
    }

    const yearNode = document.getElementById("year");
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }
})();
