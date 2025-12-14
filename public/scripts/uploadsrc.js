document.addEventListener("DOMContentLoaded", () => {

const csrfToken = document.getElementById("csrfToken").value;
const anaKategoriler = document.getElementById('anaKategoriler');
 

const wrapper = document.getElementById('altKategorilerWrapper');
const rutbe = document.getElementById("anal").dataset.rutbe;

document.querySelectorAll('#anaKategoriler .btn').forEach(btn => {

  const plusBtn = document.createElement('div');
  
  plusBtn.textContent = '+';
  plusBtn.style.cssText = `
    background: #007bff;
    color: white;
    padding: 4px 8px;
    font-size: 18px;
    border-radius: 3px;
    cursor: pointer;float:left;
    margin-top: 0px;
    text-align: center;
    width: 23px;
  `;

plusBtn.addEventListener('click', async () => {
  if (btn.querySelector('.alt-kategori-ekle')) return;
  const satir = document.createElement('div');
  satir.className = "alt-kategori-ekle";
  satir.style.marginTop = "8px";

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `${btn.dataset.kategori} için alt kategori`;
  input.style.marginRight = '5px';
  input.style.padding = '5px';
  input.style.width = '140px';
 
  const ekleBtn = document.createElement('button');
  ekleBtn.classList.add(rutbe)
 
  ekleBtn.textContent = 'Ekle';
  ekleBtn.style.cssText = `
    padding: 5px 10px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  `;



ekleBtn.addEventListener('click', async () => {
    // İşlem başladığını belirtelim
    console.log("Toplu yükleme başladı...");
    
    // Ana kategori (Örn: "Otomobil") butonun dataset'inden geliyor varsayıyoruz.
    // Eğer sabitse direkt "Otomobil" de yazabilirsin.
    const anaKategoriAdi = btn.dataset.kategori || "Otomobil"; 

    // 1. DÖNGÜ: Markaları Gez (for...of kullanıyoruz ki await çalışsın)
    for (const item of lst) {
        const markaAdi = item.brand;

        try {
            // --- ADIM 1: Markayı Ekle (Kategori: Otomobil, Alt: Marka) ---
            console.log(`Ekleniyor: ${markaAdi}`);
            
            const resMarka = await fetch('/altkategoriekle', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    "x-csrf-token": csrfToken 
                },
                body: JSON.stringify({ 
                    ustKategori: anaKategoriAdi, // Örn: Otomobil
                    altKategori: markaAdi        // Örn: Abarth
                })
            });

            if (!resMarka.ok) console.error(`${markaAdi} eklenirken hata oluştu.`);

            // --- ADIM 2: Modelleri Ekle (Kategori: Marka, Alt: Model) ---
            if (item.models && item.models.length > 0) {
                for (const model of item.models) {
                    const modelAdi = model.title;
                    
                    // Burayı çok hızlı yapıp sunucuyu yormamak için isteğe bağlı minik bir gecikme koyulabilir
                    // await new Promise(r => setTimeout(r, 50)); 

                    const resModel = await fetch('/altkategoriekle', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            "x-csrf-token": csrfToken 
                        },
                        body: JSON.stringify({ 
                            ustKategori: markaAdi, // Örn: Abarth
                            altKategori: modelAdi  // Örn: 500
                        })
                    });
                    
                    if (!resModel.ok) console.error(`-- ${modelAdi} eklenirken hata.`);
                }
            }

        } catch (err) {
            console.error("Bir hata oluştu:", err);
        }
    }

    alert('Tüm liste işlendi!');
    
 
    
});

 

  satir.appendChild(input);
  satir.appendChild(ekleBtn);

  btn.insertAdjacentElement("afterend", satir);
});
  btn.appendChild(plusBtn);
});

let anaKategori = null;

function temizleSonrakiKutular(seviye) {
  wrapper.querySelectorAll('.alt-kutu').forEach(div => {
    if (parseInt(div.dataset.seviye) >= seviye) {
      div.remove();
    }
  });
  const devamBtn = document.getElementById('devamButonu');
  if (devamBtn) devamBtn.remove();
}


function olusturKutu(seviye, kategoriler) {
  temizleSonrakiKutular(seviye);

  const kutu = document.createElement('div');
  kutu.className = 'alt-kutu';
  kutu.dataset.seviye = seviye;

  kategoriler.forEach(kat => {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.display = 'flex';
    wrapperDiv.style.alignItems = 'center';
    wrapperDiv.style.marginBottom = '8px';
    wrapperDiv.style.gap = '8px';

    const btn = document.createElement('div');
    btn.className = 'btn alt-kategori';
    btn.textContent = kat;
    btn.dataset.kategori = kat;
    btn.dataset.seviye = seviye;

    btn.addEventListener('click', () => {
     
      const ayniSeviyeButonlar = kutu.querySelectorAll('.alt-kategori');
      ayniSeviyeButonlar.forEach(b => b.classList.remove('aktif'));
      btn.classList.add('aktif');
    });

    const plus = document.createElement('div');
    
    plus.textContent = '+';
    plus.style.cursor = 'pointer';
    plus.style.fontSize = '15px';
    plus.style.padding = '3px 3px';
    plus.style.backgroundColor = '#007bff';
    plus.style.color = 'white';
    plus.style.borderRadius = '4px';
    plus.style.height = '20px';
   plus.addEventListener('click', () => {
  if (wrapperDiv.nextElementSibling?.classList.contains('alt-kategori-ekle')) return;

  const satir = document.createElement('div');
  satir.className = "alt-kategori-ekle";
  satir.style.marginTop = "8px";

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `${kat} için alt kategori`;
  input.style.marginRight = '5px';
  input.style.padding = '5px';

  const ekle = document.createElement('button');
  ekle.textContent = 'Ekle';
  ekle.style.cssText = `
    padding: 5px 10px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  `;

  async function kategoriEkle() {
    const yeniAlt = input.value.trim();
    if (!yeniAlt) return;

    const res = await fetch('/altkategoriekle', {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' ,
    "x-csrf-token": csrfToken},
      
      body: JSON.stringify({ ustKategori: kat, altKategori: yeniAlt })
    });
    console.log(yeniAlt)
    
    if (res.ok) {
      alert('Alt kategori eklendi');
      satir.remove();

      const yeniAltlar = await fetchAltKategoriler(kat);
      olusturKutu(parseInt(btn.dataset.seviye) + 1, yeniAltlar);
      console.log(yeniAltlar)
    } else {
      alert('Hata oldu');
    }
  }

  ekle.addEventListener('click', kategoriEkle);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') kategoriEkle();
  });

  satir.appendChild(input);
  satir.appendChild(ekle);

  // 🔥 buton satırının hemen altına ekle
  wrapperDiv.insertAdjacentElement("afterend", satir);
});

    wrapperDiv.appendChild(btn);
    wrapperDiv.appendChild(plus);
    kutu.appendChild(wrapperDiv);
  });

  wrapper.appendChild(kutu);
}

anaKategoriler.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const kategori = btn.dataset.kategori;
  anaKategori = kategori;

  document.querySelectorAll('#anaKategoriler .btn').forEach(k => {
    k.classList.add('kucuk');
    k.classList.remove('aktif');
  });
  btn.classList.add('aktif');

  wrapper.innerHTML = '';

  const altlar = await fetchAltKategoriler(kategori);
  if (altlar.length > 0) {
    olusturKutu(1, altlar);
  }
});

wrapper.addEventListener('click', async (e) => {
  const li = e.target.closest('.alt-kategori');
  if (!li) return;

  const kategori = li.dataset.kategori;
  const seviye = parseInt(li.dataset.seviye);

  li.classList.add('aktif');

  const altlar = await fetchAltKategoriler(kategori);

  if (altlar.length > 0) {
    olusturKutu(seviye + 1, altlar);
  } else {
    temizleSonrakiKutular(seviye + 1);

    // Devam butonu varsa ekleme
    if (!document.getElementById('devamButonu')) {
      const btn = document.createElement('button');
      btn.textContent = 'Devam Et';
      btn.id = 'devamButonu';
      btn.style.marginTop = '20px';
      btn.style.padding = '10px 20px';
      btn.style.backgroundColor = '#007bff';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.borderRadius = '5px';
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', () => {
        const secilenler = [];

        // Ana kategori seçili olmalı
        const anaAktif = document.querySelector('#anaKategoriler .btn.aktif');
        if (anaAktif) {
          secilenler.push(anaAktif.dataset.kategori);
        }

       
        wrapper.querySelectorAll('.alt-kutu').forEach(div => {
          const aktif = div.querySelector('.alt-kategori.aktif');
          if (aktif) {
            secilenler.push(aktif.dataset.kategori);
          }
        });

        const params = new URLSearchParams();
        secilenler.forEach((k, i) => {
          params.append(`secilen${i}`, k);
        });

        window.location.href = `/yeni-ilan-olustur?${params.toString()}`;
      });

      wrapper.appendChild(btn);
    }
  }
});

async function fetchAltKategoriler(kategori) {
  const response = await fetch(`/altkategoriler?kategori=${encodeURIComponent(kategori)}`);
  if (!response.ok) {
    alert('Alt kategoriler alınamadı');
    return [];
  }
  return await response.json();
}
})
