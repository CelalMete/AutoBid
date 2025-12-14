document.addEventListener('DOMContentLoaded', () => {
    // CSRF Token'ı al
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';

    async function odemeYap(siparisNo, durum) {
        console.log("İşlem başlatılıyor...", siparisNo, durum);

        try {
            const res = await fetch('/api/mock-callback', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken // CSRF header ismi backend'e göre değişebilir (CSRF-Token vs.)
                },
                body: JSON.stringify({ merchant_oid: siparisNo, status: durum })
            });
            
            if (res.ok) {
                alert(durum === 'success' ? "Ödeme Başarılı!" : "Ödeme Başarısız!");
                window.location.href = "/cuzdanim"; 
            } else {
                alert("Sunucu hatası: " + res.status);
            }
        } catch (err) {
            console.error("Hata:", err);
        }
    }

    // Başarılı Butonu
    const successBtn = document.getElementById('1');
    if (successBtn) {
        successBtn.addEventListener('click', function() {
            // 'this' tıklanan butondur, data-oid verisini buradan okuyoruz
            const oid = this.getAttribute('data-oid');
            odemeYap(oid, 'success');
        });
    }

    // Hatalı Butonu
    const failBtn = document.getElementById('2');
    if (failBtn) {
        failBtn.addEventListener('click', function() {
            const oid = this.getAttribute('data-oid');
            odemeYap(oid, 'fail');
        });
    }
});