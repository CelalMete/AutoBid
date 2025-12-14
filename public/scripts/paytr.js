document.getElementById('odemeYapBtn').addEventListener('click', async () => {
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        // Miktarı backend'e gönder
        const response = await fetch('/api/odeme-baslat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,
                    "x-csrf-token": csrfToken },
            body: JSON.stringify({ miktar: 500 }) 
        });

        const data = await response.json();

        if (data.success) {
            
            // --- YENİ KOD (MOCK / SAHTE ÖDEME İÇİN) ---
            if (data.redirectUrl) {
                // Backend bizi sahte ödeme sayfasına yönlendiriyor
                window.location.href = data.redirectUrl;
            }
        

        } else {
            alert("Hata: " + data.message);
        }

    } catch (err) {
        console.error("Ödeme hatası:", err);
        alert("Bir hata oluştu.");
    }
});