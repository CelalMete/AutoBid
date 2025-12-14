// /scripts/kate.js

document.addEventListener('DOMContentLoaded', function() {
    const kategoriContainer = document.querySelector('.kategori-secim-alani');
    const resultInput = document.getElementById('parentPath');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    // Form ve inputları DOMContentLoaded içinde tanımlayın
    const eklemeFormu = document.getElementById('kateInput'); 
    const yeniKategoriInput = document.getElementById('yeniKategoriAd'); 
    
    // NOT: ekleButonu değişkeni submit olayında kullanılmadığı için kaldırıldı.

    // --- FETCH FONKSİYONU (Aynı Kalır) ---
    async function fetchChildren(parentPath) {
        const url = `/api/kategoriler/cocuk/${parentPath}`;
        try {
        
            const response = await fetch(url, { headers: { 'X-CSRF-Token': csrfToken } });
      
            if (!response.ok) throw new Error('Veri yükleme hatası.');
            return response.json(); 
        } catch (error) {
  
            console.error(`Alt kategori çekme hatası (${parentPath}):`, error);
            return [];
        }
    }

    // --- DİNAMİK DROPDOWN OLUŞTURMA FONKSİYONU (Aynı Kalır) ---
    function populateDropdown(kategoriler, currentLevel) {
        const nextLevel = currentLevel + 1;
        let nextLevelContainer = document.querySelector(`[data-level="${nextLevel}"]`);
        
        if (!nextLevelContainer) {
             nextLevelContainer = document.createElement('div');
             nextLevelContainer.className = 'level-dropdown';
             nextLevelContainer.dataset.level = nextLevel;
             kategoriContainer.appendChild(nextLevelContainer);
        } else {
             nextLevelContainer.innerHTML = '';
        }

        const ddlId = `ddl${nextLevel}`;
        const ddId = `dd${nextLevel}`;
        
        // İçeriği oluştur
        nextLevelContainer.innerHTML = `
            <div class="${ddId}" id="${ddId}">Kategori Seç (Seviye ${nextLevel})</div>
            <ul class="ddl${nextLevel}" id="${ddlId}"></ul>
        `;
        
        const ddl = document.getElementById(ddlId);
        const ddToggle = document.getElementById(ddId);
        
        if (kategoriler.length === 0) {
            ddl.style.display = 'none';
            return;
        }
        
        ddl.style.display = 'block'; 
        kategoriler.forEach(k => {
            const li = document.createElement('li');
            li.dataset.path = k.path;
            li.textContent = k.name;
            ddl.appendChild(li);
        });
    }


    // --- TEMEL TIKLAMA İŞLEYİCİSİ (Aynı Kalır) ---
    async function handleDropdownClick(e) {
        if (e.target.tagName !== 'LI') return;
        
        const secilenLi = e.target;
        const secilenPath = secilenLi.dataset.path;
        const currentLevelDiv = secilenLi.closest('.level-dropdown');
        const currentLevel = parseInt(currentLevelDiv.dataset.level);
        const nextLevel = currentLevel + 1;
        
        // Input Güncelleme
        currentLevelDiv.querySelector(`.dd${currentLevel}`).textContent = secilenLi.textContent;
        resultInput.value = secilenPath; 
        resultInput.dataset.level = nextLevel; 
        
        e.target.closest('ul').classList.remove('aktif'); 

        // Temizlik
        let i = nextLevel;
        let nextContainer = document.querySelector(`[data-level="${i}"]`);
        while(nextContainer) {
            nextContainer.remove();
            i++;
            nextContainer = document.querySelector(`[data-level="${i}"]`);
        }

        // Veri Çekme ve Doldurma
        const altKategoriler = await fetchChildren(secilenPath);
        populateDropdown(altKategoriler, currentLevel); 
    }
    
    
    // --- YENİ KATEGORİ EKLEME MANTIĞI (GÜNCELLENMİŞ POST) ---
    eklemeFormu.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const yeniAd = yeniKategoriInput.value.trim();
        const parentPath = resultInput.value; 
        const newLevel = parseInt(resultInput.dataset.level || 1); 
        
        if (!yeniAd) {
            alert('Lütfen eklenecek kategori adını girin.');
            return;
        }

        const isRoot = (newLevel === 1 || parentPath === '');
        
        const data = {
            name: yeniAd,
            level: isRoot ? 1 : newLevel,
            parentPath: isRoot ? null : parentPath,
            formFields: []
        };
        
        // 1. API'ye Gönder
        const response = await fetch('/admin/api/kategori-ekle', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken 
            },
            body: JSON.stringify(data )
        });

        // 2. Yanıtı Al ve Duruma Göre Mesaj Göster
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Başarılı 200 veya 201 yanıtı
            alert('✅ BAŞARILI: ' + result.message);
            // Ekranı yenile
            window.location.reload(); 
        } else {
            // Hata (400, 500) yanıtı
            alert('❌ HATA: ' + (result.message || 'Bilinmeyen bir hata oluştu.'));
        }
    });

    // --- OLAY DİNLEYİCİLERİ ---
    kategoriContainer.addEventListener('click', handleDropdownClick);
    
    // Toggle mantığı buraya taşınabilir veya HTML'e bırakılabilir.
    kategoriContainer.addEventListener('click', function(e) {
        // Toggle mantığı...
        if (e.target.classList.contains('dd1') || e.target.classList.contains('dd2') || e.target.classList.contains('dd3')) {
            const ul = e.target.closest('.level-dropdown').querySelector('ul');
            if (ul) {
                document.querySelectorAll('.kategori-secim-alani ul').forEach(list => {
                    if (list !== ul) {
                        list.classList.remove('aktif');
                    }
                });
                ul.classList.toggle('aktif');
            }
        }
    });
});