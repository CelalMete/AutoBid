document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".submenu-toggle").forEach(btn => {
  btn.addEventListener("click", function() {
    // Tüm sub menüleri kapat
    document.querySelectorAll(".submenu").forEach(menu => {
      if (menu !== this.nextElementSibling) {
        menu.style.display = "none";
      }
    });

    // Tıklananı aç/kapat
    let submenu = this.nextElementSibling;
    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
  });
});

 
    const DayBtn = document.getElementById('dropdownToggleDays');
  const DayMenu = document.getElementById('dropdownMenuDays');
      const howBtn = document.getElementById('dropdownTogglehow');
  const howMenu = document.getElementById('dropdownMenuhow');
    const ContBtn = document.getElementById('dropdownToggleContact');
  const ContMenu = document.getElementById('dropdownMenuContact');

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", async function () {
  const query = this.value.trim();

  if (query.length === 0) {
    searchResults.innerHTML = "";
    return;
  }

  const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();

  searchResults.innerHTML = data
    .map(
      (item) => `
      <div class="result-item"><a href="/ilan/${item._id}" class="d"> ${item.Baslik}</a>
       
      </div>`
    )
    .join("");
});

    DayBtn.addEventListener('click', () => {
      DayMenu.classList.toggle('show');
    });
    howBtn.addEventListener('click', () => {
      howMenu.classList.toggle('show');
    });
    ContBtn.addEventListener('click', () => {
      ContMenu.classList.toggle('show');
      
    });
   

    // Menü dışına tıklanırsa kapat
    window.addEventListener('click', (e) => {
      
    if (!e.target.matches('#dropdownToggleDays')) {
        if (DayMenu.classList.contains('show')) {
          DayMenu.classList.remove('show');
    }}
    if (!e.target.matches('#dropdownToggleContact')) {
        if (ContMenu.classList.contains('show')) {
          ContMenu.classList.remove('show');
    }}
   if (!e.target.matches('#dropdownTogglehow')) {
        if (howMenu.classList.contains('show')) {
          howMenu.classList.remove('show');
    }}
});

    // Sadece data-filter niteliği olan linkleri seç
    const navFilterLinks = document.querySelectorAll('.has-submenu .submenu a[data-filter]');

    // Her bir linke tıklama olay dinleyicisi ekle
    navFilterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Varsayılan link davranışını engelle

            // Linkin data-filter ve data-value değerlerini al
            const filterName = link.getAttribute('data-filter');
            const filterValue = link.getAttribute('data-value');

            if (filterName && filterValue) {
                // Yeni bir URL nesnesi oluştur. Temel yol '/arama' olacak.
                const url = new URL(window.location.origin + '/arama');
                
                // URL'ye filtre parametresini ekle
                url.searchParams.set(filterName, filterValue);

                // Kullanıcıyı yeni URL'ye yönlendir
                window.location.href = url.toString();
            }
        });
    });
window.addEventListener("click", (e) => {
  if (
    !e.target.closest("#searchInput") &&
    !e.target.closest("#searchResults")
  ) {
    searchResults.innerHTML = "";
  }
});

let lastScrollTop = 0;
const header = document.querySelector('header');
const headerHeight = 140; // Body padding-top değerinle aynı olsun

window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Negatif scroll hatasını önle (Mobil için)
  if (scrollTop < 0) {
    scrollTop = 0;
  }

  // --- DÜZELTME BURADA ---
  // Eğer sayfanın en tepesindeysek (ilk 140px içinde), menüyü ASLA gizleme.
  if (scrollTop < headerHeight) {
      header.classList.remove('nav-hidden');
  } 
  else {
      // 140px'den fazla aşağı indiysek normal mantığı çalıştır
      if (scrollTop > lastScrollTop) {
        // AŞAĞI İNİYOR -> Gizle
        header.classList.add('nav-hidden');
      } else {
        // YUKARI ÇIKIYOR -> Göster
        header.classList.remove('nav-hidden');
      }
  }

  lastScrollTop = scrollTop;
});
    
});