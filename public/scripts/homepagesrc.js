
    
const anaKategoriRadios = document.querySelectorAll('#anaKategoriler input[type="radio"]');
const altKategorilerWrapper = document.getElementById('altKategorilerWrapper');
const ilerleDiv = document.getElementById('ilerleDiv');
const ilerleBtn = document.getElementById('ilerleBtn');
const from = document.getElementById('dropdownToggle5')
const to = document.getElementById('dropdownToggle6')
const VINinput =document.getElementById('vinLotInput')
let secilenler = [];

anaKategoriRadios.forEach(radio => {
  radio.addEventListener('change', async () => {
    if (!radio.checked) return;

    const kategori = radio.value;
    secilenler = [kategori];

    document.getElementById('dropdownToggle1').textContent = 'Kategori 1';
   
    document.getElementById('dropdownToggle2').textContent = 'Alt Kategori';
   
    
    
    const altlar = await fetchKategoriler(kategori);
   
    if (altlar.length > 0) {
      olusturKutu(1, altlar);
     
    } else {
      ilerleDiv.style.display = 'block';
    }
  });
});
function createYearDropdown(dropdownId, toggleId, startYear = 1970, endYear = new Date().getFullYear()) {
  const menu = document.getElementById(dropdownId);
  const toggle = document.getElementById(toggleId);
  for (let y = endYear; y >= startYear; y--) {
    const li = document.createElement('li');
    li.className = 'alt-kategori-item';
    li.textContent = y;
    li.style.padding = '6px 12px';
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      menu.querySelectorAll('li').forEach(item => item.classList.remove('aktif'));
      li.classList.add('aktif');
      toggle.textContent = y;
      dropdown.classList.remove('active');
    });
    menu.appendChild(li);
  }
}

createYearDropdown('dropdownMenu5', 'dropdownToggle5', 2000); // Yıl From
createYearDropdown('dropdownMenu6', 'dropdownToggle6', 2000); // Yıl To


function olusturKutu(seviye, kategoriler,ana) {
    const toggle = document.getElementById('dropdownToggle1');
    const menu = document.getElementById('dropdownMenu1');
    menu.innerHTML = '';

    kategoriler.forEach(kat => {
       
        const kategoriAd = kat.altKategori || kat;
        const kategoriPath = kat.kategori || kategoriAd;

        const li = document.createElement('li');
        li.className = 'alt-kategori-item';
        li.textContent = kategoriAd;
        li.dataset.kategori = kategoriAd;
        li.dataset.path = kategoriPath;
        li.dataset.seviye = seviye;
        li.style.padding = '6px 12px';
        li.style.cursor = 'pointer';

        li.addEventListener('click', async () => {
             menu.querySelectorAll('li').forEach(item => item.classList.remove('aktif'));
            li.classList.add('aktif');
            toggle.textContent = kategoriAd;
            
            // Seçilenler dizisini güncelle (Örn: [arac, otomobil, sedan])
            secilenler = secilenler.slice(0, seviye);
            secilenler[seviye] = kategoriAd;
            
            toggle.textContent = kategoriAd;
            dropdownMenu1.parentElement.classList.remove('active');
            
            document.getElementById('dropdownMenu2').innerHTML = '';
            document.getElementById('dropdownToggle2').textContent = 'Marka Seç';
            
            const markalar = await fetchKategoriler(kategoriAd);
            
            if (markalar.length > 0) {
                
                olusturKutu2(seviye + 1, markalar,kategoriAd);
            } else {
                ilerleDiv.style.display = 'block';
            }
        });

        menu.appendChild(li);
    });
}

function olusturKutu2(seviye, markalar,ana) {
    const toggle2 = document.getElementById('dropdownToggle2');
    const menu2 = document.getElementById('dropdownMenu2');
    menu2.innerHTML = '';

    markalar.forEach(marka => {
        
        const markaAdi = marka.altKategori || marka.markaAdi || marka; 
        
        const li = document.createElement('li');
        li.className = 'alt-kategori-item';
        li.textContent = markaAdi;
        li.dataset.kategori = markaAdi;
        li.dataset.marka = markaAdi;
        li.dataset.seviye = seviye;

        li.style.padding = '6px 12px';
        li.style.cursor = 'pointer';

        li.addEventListener('click', async () => {
            menu2.querySelectorAll('li').forEach(item => item.classList.remove('aktif'));
            li.classList.add('aktif');
            toggle2.textContent = markaAdi;
            
           
            secilenler = secilenler.slice(0, seviye);
            secilenler[seviye] = markaAdi;

            toggle2.textContent = markaAdi;
            dropdownMenu2.parentElement.classList.remove('active');
            
            const seriler = await fetchKategoriler(ana);

            if (seriler.length > 0) {
               
                ilerleDiv.style.display = 'block';
            } else {
               
                ilerleDiv.style.display = 'block';
            }
        });

        menu2.appendChild(li);
    });
}

ilerleBtn.addEventListener('click', () => {
    const vinVar = VINinput && VINinput.value.trim() !== ''; 
    const secimVar = secilenler && secilenler.length > 0;
    if (vinVar && secimVar) {
        alert("Hata: Lütfen arama yapmak için SADECE BİR yöntem seçin.\nYa araç özelliklerini seçin ya da VIN numarası girin, ikisini aynı anda yapamazsınız.");
        return; 
    }

    if (!vinVar && !secimVar) {
        alert("Hata: Lütfen ilerlemek için bir seçim yapın veya VIN numarası girin.");
        return; 
    }
    if (secimVar) {
        const params = new URLSearchParams();
        const anahtarEslestirmesi = ['category', 'marka', 'model', 'package'];
        
        secilenler.forEach((deger, index) => {
            if (deger && anahtarEslestirmesi[index]) {
                params.append(anahtarEslestirmesi[index], deger);
            }
        });

        window.location.href = `/arama?${params.toString()}`;
    }
    
    else if (vinVar) {
        const params = new URLSearchParams();
        params.append('vin', VINinput.value.trim()); 
        
        window.location.href = `/arama?${params.toString()}`;
      
    }
});

async function fetchKategoriler(parentPath) {
     try {
         const res = await fetch(`/api/kategoriler/cocuk/${encodeURIComponent(parentPath)}`);
         if (!res.ok) throw new Error('Alt kategoriler alınamadı');
         return await res.json();
     } catch (e) {
         alert('Kategori Hatası: ' + e.message);
         return [];
     }
}



document.querySelectorAll('.dropdown-toggle1').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = toggle.parentElement;
    const isActive = dropdown.classList.contains('active');
    
    document.querySelectorAll('.dropdown1').forEach(d => d.classList.remove('active'));
    if (!isActive) dropdown.classList.add('active');
  });
});

// Sayfanın herhangi bir yerine tıklanınca dropdown kapansın
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown1').forEach(d => d.classList.remove('active'));
});

