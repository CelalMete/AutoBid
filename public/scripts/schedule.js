document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentItems = document.querySelectorAll(".content-item");

    // Başlangıçta tüm içerikleri gizle ve ilk elemanı göster
    function initializePage() {
        // Tüm içerikleri gizle
        contentItems.forEach(item => item.classList.remove("active"));
        
        navLinks.forEach(link => link.classList.remove("active"));
        
        // İlk linki ve ilk içeriği aktif yap
        if (navLinks.length > 0) {
            navLinks[0].classList.add("active");
        }
        if (contentItems.length > 0) {
            contentItems[0].classList.add("active");
        }
    }

    // Sayfa yüklendiğinde bu fonksiyonu çalıştır
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