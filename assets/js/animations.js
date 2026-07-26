(function () {
    "use strict";

    const revealTargets = Array.from(document.querySelectorAll(".reveal-up"));

    if (!("IntersectionObserver" in window)) {
        revealTargets.forEach(function (el) {
            el.classList.add("in-view");
        });
        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealTargets.forEach(function (target) {
        observer.observe(target);
    });

    document.addEventListener("sections:refresh", function () {
        revealTargets
            .filter(function (el) {
                return !el.classList.contains("in-view") && !el.classList.contains("is-hidden");
            })
            .forEach(function (el) {
                observer.observe(el);
            });
    });
})();
