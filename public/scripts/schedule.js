document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentItems = document.querySelectorAll(".content-item");
    function initializePage() {
        contentItems.forEach(item => item.classList.remove("active"));
        navLinks.forEach(link => link.classList.remove("active"));
        if (navLinks.length > 0) {
            navLinks[0].classList.add("active");
        }
        if (contentItems.length > 0) {
            contentItems[0].classList.add("active");
        }
    }

    initializePage();

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            navLinks.forEach(item => item.classList.remove("active"));
            contentItems.forEach(item => item.classList.remove("active"));

            link.classList.add("active");

            const targetStep = link.getAttribute("data-step");
            const targetContent = document.getElementById(`step${targetStep}`);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
});