document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.getElementById("dropdownToggles");
const menus = document.getElementById("dropdownMenus");
const kategoriTxt = document.querySelector(".kategori1");
const filtrelerData = downbarContainer.dataset.filtre;

    const anaKategori = document.getElementById('ustler').value;
    console.log("Ana Kategori:", anaKategori); 

    document.querySelectorAll('.dropdown-toggle1').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = toggle.parentElement;
            const isActive = dropdown.classList.contains('active');
            
            document.querySelectorAll('.dropdown1').forEach(d => d.classList.remove('active'));
            if (!isActive) dropdown.classList.add('active');
        });
    });
let downbarData=[]
downbarData = JSON.parse(filtrelerData);
const HİYERARŞİ_SIRASI = [
    'category',  
    'marka',     
    'model',    
    'package'    
];
const container = document.getElementById("downbarContainer");

    if (downbarData && downbarData.length) {
        downbarData.forEach(bar => {
            
            const downbar = document.createElement("div");
            downbar.classList.add("downbar");

            const header = document.createElement("div");
            header.classList.add("downbar-header");
            header.textContent = bar.name;

            const content = document.createElement("div");
            content.classList.add("downbar-content");
            content.id = bar.name;
             
            bar.checkboxes.forEach(item => {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = bar.name;
                checkbox.value = item.title;
                label.appendChild(checkbox);
                label.append(" " + item.title);
                content.appendChild(label);
            });

            header.addEventListener("click", () => {
                content.style.display = content.style.display === "block" ? "none" : "block";
            });

            downbar.appendChild(header);
            downbar.appendChild(content);
            container.appendChild(downbar);
        });
    }
    function populateInputsFromURL() {
        const url = new URL(window.location.href);
        
        
        const minYear = url.searchParams.get("minYil");
        const maxYear = url.searchParams.get("maxYil");

     
        if (minYear) document.getElementById("yearMin").value = minYear;
        if (maxYear) document.getElementById("yearMax").value = maxYear;
    }


menus.querySelectorAll(".sirala-item").forEach(item => {
    item.addEventListener("click", () => {
        menus.querySelectorAll(".sirala-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        menus.classList.remove("show");
        const url = new URL(window.location.href);
        if (item.id === "2") {
            url.searchParams.set("sirala", "ucuz"); 
        } else {       
            url.searchParams.set("sirala", "pahali"); 
        }
        
        window.location.href = url.toString(); 
        
    });
});
function applySortingFromURL() {
    const url = new URL(window.location.href);
    const sirala = url.searchParams.get("sirala"); 

    const kategoriTxt = document.querySelector(".kategori1");
    const items = document.querySelectorAll(".sirala-item");

    items.forEach(item => item.classList.remove("active"));

    if (sirala === "ucuz") {
        kategoriTxt.textContent = "Ucuzdan Pahalıya";
        
        document.getElementById("2").classList.add("active");
    } else {
        kategoriTxt.textContent = "Pahalıdan Ucuza";
        document.getElementById("1").classList.add("active");
    }
}

// Menü aç/kapa
toggles.addEventListener("click", () => {
  menus.classList.toggle("show");
});

window.addEventListener("click", e => {
  if (!toggles.contains(e.target) && !menus.contains(e.target)) {
    menus.classList.remove("show");
  }
});

    function checkCheckboxesFromURL() {
        const selections = {};
        const url = new URL(window.location.href);

        if (downbarData) { 
             downbarData.forEach(bar => {
                if (url.searchParams.has(bar.id)) {
                    selections[bar.id] = url.searchParams.getAll(bar.id);
                }
            });
        }
       
        for (const paramName in selections) {
            selections[paramName].forEach(value => {
                const container = document.getElementById(paramName);
                if (container) {
                    const checkbox = container.querySelector(`input[type="checkbox"][value="${value}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                }
            });
        }
    }
    
    function getSelectionsFromURL() {
    const url = new URL(window.location.href);
    const selections = [];
    
    HİYERARŞİ_SIRASI.forEach(key => {
        if (url.searchParams.has(key)) {
            selections.push({ key: key, value: url.searchParams.get(key) });
        }
    });
    return selections; 
}

function renderBreadcrumb() {
    const container = document.getElementById("breadcrumbContainer");
    container.innerHTML = "";
    const selections = getSelectionsFromURL();

    selections.forEach((sel, index) => {
        const span = document.createElement("span");
        span.textContent = sel.value;
        span.dataset.key = sel.key; 
        span.className = "breadcrumb-item";
        span.style.cursor = "pointer";
        span.style.position = "relative"; 
        span.addEventListener("click", () => {
            const url = new URL(window.location.href);
            const clickedKey = span.dataset.key; 
            const hierarchyIndex = HİYERARŞİ_SIRASI.indexOf(clickedKey);

            if (hierarchyIndex !== -1) {
                for (let i = hierarchyIndex + 1; i < HİYERARŞİ_SIRASI.length; i++) {
                    const keyToDelete = HİYERARŞİ_SIRASI[i];
                    url.searchParams.delete(keyToDelete);
                }
                
                // Sayfayı yenile
                window.location.href = url.toString();
            }
        });

        container.appendChild(span);

        // Araya Ok İşareti Ekle
        if (index < selections.length - 1) {
            const sep = document.createElement("span");
            sep.className = "sep";
            sep.textContent = " > ";
            sep.style.margin = "0 5px";
            container.appendChild(sep);
        }
    });
}
    const items = document.querySelectorAll(".alt-kategori-item");
    items.forEach(item => {
        item.addEventListener("click", () => {
            const yeniKategori = item.dataset.alt;
            ekleVeYonlendir(yeniKategori);
            
        });
    });

    document.getElementById("searchButton").addEventListener("click", () => {
        const url = new URL(window.location.href);

    

        const minYear = document.getElementById("yearMin").value;
        const maxYear = document.getElementById("yearMax").value;


        if (minYear) url.searchParams.set("minYil", minYear);
        else url.searchParams.delete("minYil");

        if (maxYear) url.searchParams.set("maxYil", maxYear);
        else url.searchParams.delete("maxYil");

        const downbars = document.querySelectorAll("#downbarContainer .downbar-content");
        downbars.forEach(container => {
            const paramName = container.id;
            url.searchParams.delete(paramName);
            container.querySelectorAll("input[type='checkbox']:checked").forEach(cb => {
                url.searchParams.append(paramName, cb.value);
            });
        });

        window.location.href = url.toString();
    });


function ekleVeYonlendir(yeniKategori) {
    const url = new URL(window.location.href);
    const mevcutSecimler = getSelectionsFromURL();
    
    let nextIndex = mevcutSecimler.length; 
    const yeniAnahtar = HİYERARŞİ_SIRASI[nextIndex]; 
    
    if (!yeniAnahtar) {
        console.error("Hata: Hiyerarşi sınırı aşıldı veya anahtar tanımlı değil.");
        return;
    }
    url.searchParams.set(yeniAnahtar, yeniKategori);
    for (let i = nextIndex + 1; i < HİYERARŞİ_SIRASI.length; i++) {
        url.searchParams.delete(HİYERARŞİ_SIRASI[i]);
    }

    window.location.href = url.toString();
}



        applySortingFromURL()
  populateInputsFromURL();
    checkCheckboxesFromURL();
    renderBreadcrumb();
    })