
const butonlar = document.querySelectorAll('.odeme-btn');
butonlar.forEach(btn => {
    btn.addEventListener('click', async () => {
        const miktar = Number(btn.dataset.deposit);

        console.log(`Seçilen Miktar: ${miktar} TL`); // Kontrol için log

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/odeme-baslat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    "x-csrf-token": csrfToken 
                },
                body: JSON.stringify({ miktar: miktar }) 
            });

            const data = await response.json();

            if (data.success) {
                if (data.redirectUrl) {
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
});