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

    const navFilterLinks = document.querySelectorAll('.has-submenu .submenu a[data-filter]');

    navFilterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterName = link.getAttribute('data-filter');
            const filterValue = link.getAttribute('data-value');

            if (filterName && filterValue) {
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
  if (scrollTop < 0) {
    scrollTop = 0;
  }

  if (scrollTop < headerHeight) {
      header.classList.remove('nav-hidden');
  } 
  else {
      if (scrollTop > lastScrollTop) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
  }
  lastScrollTop = scrollTop;
});
    const a= document.getElementById('hamburg');
        const nav= document.getElementById('navbar');

    const bottom =document.getElementById('nav-bottom')
 const b=document.getElementById('content')
a.addEventListener('click', ()=>{  
  if (a.classList.contains('aktif')) {
    nav.classList.add('nav-pasif');
    nav.classList.remove('nav-aktif')
       a.classList.remove('aktif');
        a.classList.add('pasif');
     bottom.classList.add('bottom-pasif')
    bottom.classList.remove('nav-bottom')
   b.classList.add('content-pasif');
   b.classList.remove('content')
    } else {    
      bottom.classList.remove('bottom-pasif')
    bottom.classList.add('nav-bottom')
   b.classList.remove('content-pasif');
   b.classList.add('content')
       nav.classList.remove('nav-pasif');
    nav.classList.add('nav-aktif')
        a.classList.remove('pasif');
        a.classList.add('aktif');

    }
});

});