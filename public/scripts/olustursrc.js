const rutbe=document.getElementById('rutbe').value
const headerDiv=document.querySelectorAll( '.downbar-header')
const headers = document.querySelectorAll('.downbar-header');

    headers.forEach(header => {
        header.addEventListener('click', function(e) {
            
            if (e.target.closest('.check-ekle-wrapper')) {
                return;
            }
            const contentDiv = this.nextElementSibling; 
            // Başlığın içindeki oku buluyoruz
            const icon = this.querySelector('.arrow');
            if (contentDiv.style.display === 'block') {
                contentDiv.style.display = 'none';
                icon.classList.remove('rotate'); 
            } 
            // Kapalıysa aç
            else {
                contentDiv.style.display = 'block';
                icon.classList.add('rotate'); 
            }
        });
    });
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