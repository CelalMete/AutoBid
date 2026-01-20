const rutbe=document.getElementById('rutbe').value
function createDownbars(data) {
    const container = document.getElementById('downbarContainer');
    container.innerHTML = ''; 
    data.forEach(f => {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('downbar');
        wrapperDiv.id = f.id; 
        
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('downbar-header');
        if(rutbe=='admin'){
        const ekleWrapper = document.createElement('div');
        ekleWrapper.classList.add('check-ekle-wrapper');
        const ekleLabel = document.createElement('label');
        ekleLabel.textContent = 'checkbox ekle';
        const ekleInput = document.createElement('input');
        ekleInput.type = 'text';
        ekleInput.classList.add('checkNameInput');
        ekleInput.placeholder = 'Yeni özellik adı';
        const ekleBtn = document.createElement('button');
        ekleBtn.type = 'button';
        ekleBtn.classList.add('checkEkleBtn');
        ekleBtn.textContent = 'Ekle';
        
        ekleWrapper.appendChild(ekleLabel);
        ekleWrapper.appendChild(ekleInput);
        ekleWrapper.appendChild(ekleBtn);
 headerDiv.appendChild(ekleWrapper);}
        const titleSpan = document.createElement('span');
        titleSpan.textContent = f.name;
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-chevron-down', 'arrow');

       
        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(icon);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('downbar-content');

        if (f.checkboxes && Array.isArray(f.checkboxes)) {
            f.checkboxes.forEach(ch => {
                const chLabel = document.createElement('label');
                const chInput = document.createElement('input');
                chInput.type = 'checkbox';
                chInput.name = f.id; 
                chInput.value = ch.title; 

                chLabel.appendChild(chInput);
                chLabel.appendChild(document.createTextNode(' ' + ch.title));
                contentDiv.appendChild(chLabel);
            });
        }
        headerDiv.addEventListener('click', (e) => {
            if (e.target.closest('.check-ekle-wrapper')) {
                return; 
            }

            contentDiv.classList.toggle('active'); 
            icon.classList.toggle('rotate'); 
            if (contentDiv.style.display === 'block') {
                contentDiv.style.display = 'none';
            } else {
                contentDiv.style.display = 'block';
            }
        });

        wrapperDiv.appendChild(headerDiv);
        wrapperDiv.appendChild(contentDiv);
        container.appendChild(wrapperDiv);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const container = document.getElementById('downbarContainer');

    const rawData = container.dataset.filtre;
    if (rawData) {
        const filtrelerData = JSON.parse(rawData);
        createDownbars(filtrelerData);
    }

    // Ana Form Submit
    document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const kategoriSelect = document.getElementById('secilen1'); // ID'yi kontrol et
    formData.append('secilen1', kategoriSelect.value); 
    
    // Örnek: Marka (secilen2)
    const markaSelect = document.getElementById('secilen2'); 
    const Yil = document.getElementById('Yili'); 
    formData.append('secilen2', markaSelect.value);
    const modelSelect = document.getElementById('secilen3'); 
    formData.append('secilen3', modelSelect.value);
    const Baslik=Yil.value+" "+ kategoriSelect.value+" "+markaSelect.value+" ,"+modelSelect.value;
    formData.append('Baslik', Baslik);
        try {
            const response = await fetch('/yeni-ilan-olustur', {
                method: 'POST',
                headers: { "x-csrf-token": csrfToken },
                body: formData 
            });
            if (!response.ok) {
                const text = await response.text();
                console.error("Sunucudan gelen hata:", text);
                throw new Error("İlan kaydı başarısız oldu.");
            }
            const data = await response.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                alert("İlan başarıyla kaydedildi.");
            }
        } catch (err) {
            console.error("Hata:", err);
            alert("Hata: " + err.message);
        }
    });

    // Kategori Ekleme (En üstteki)
    async function kategoriEkle() {
        const ad = document.getElementById('downName').value;
        const checktype = document.getElementById('checktype').checked;
        const s2 = document.getElementById('secilen2').value; // p değişkeni
        
        try {
            await fetch('/dd', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    "x-csrf-token": csrfToken 
                },
                body: JSON.stringify({ p: s2, ad, checktype })
            });
            // Buraya reload veya alert eklenebilir
        } catch(err) { console.error(err); }
    } 

    // --- DÜZELTİLEN KISIM: Checkbox Ekleme İşlemi ---
    container.addEventListener('click', async function(e) {
        // 1. Sadece "Ekle" butonuna basılınca çalış
        if (e.target.classList.contains('checkEkleBtn')) {
            e.preventDefault(); 
            
            const btn = e.target;

            // 2. Inputtaki değeri bul
            const wrapper = btn.closest('.check-ekle-wrapper');
            const input = wrapper.querySelector('.checkNameInput');
            const yeniOzellikAdi = input.value.trim();

            // 3. Kategori ID'sini bul
            const downbar = btn.closest('.downbar');
            const parentPath = downbar.id; 

            console.log("Kategori:", parentPath, "Değer:", yeniOzellikAdi);

            if (!yeniOzellikAdi) {
                alert("Lütfen bir isim yazın.");
                return;
            }
            try {
                const response = await fetch('/de', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        "x-csrf-token": csrfToken 
                    },
                    body: JSON.stringify({
                        pp: parentPath,  
                        ad: yeniOzellikAdi,    
                        FinalValue: true 
                    })
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || "Hata oluştu");
                }
                const data = await response.json();
                if (data.success) {
                    alert("Eklendi!");
                    window.location.reload(); 
                } else {
                    alert("Hata: " + data.message);
                }

            } catch (err) {
                console.error("Fetch Hatası:", err);
                alert("İşlem başarısız: " + err.message);
            }
        }
    });

    // Checkbox Tekli Seçim Mantığı
    container.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const tiklananKutu = e.target;
            if (tiklananKutu.checked) {
                const grupAdi = tiklananKutu.name;
                const gruptakiKutular = document.querySelectorAll(`input[name="${grupAdi}"]`);
                gruptakiKutular.forEach(kutu => {
                    if (kutu !== tiklananKutu) {
                        kutu.checked = false;
                    }
                });
            }
        }
    });

    const but = document.getElementById('but');
    if(but) but.addEventListener('click', kategoriEkle);
});