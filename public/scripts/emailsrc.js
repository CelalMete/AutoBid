// Sayfa tamamen yüklendiğinde çalışsın
document.addEventListener('DOMContentLoaded', () => {
    
    const btn = document.getElementById('btn');
    
    if (btn) {
        btn.addEventListener('click', async () => {
            const codeInput = document.getElementById('verificationCode');
            const messageP = document.getElementById('verifyMessage');
            const code = codeInput.value;

            // Meta etiketinden token'ı alıyoruz
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Kullanıcıya bilgi ver (Butona tekrar basamasın)
            messageP.innerText = "Kontrol ediliyor...";
            messageP.style.color = "blue";
            btn.disabled = true;

            try {
                const response = await fetch('/verify-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'CSRF-Token': csrfToken // Token'ı başlıkta gönderiyoruz
                    },
                    body: JSON.stringify({ code: code })
                });

                const data = await response.json();

                if (data.success) {
                    messageP.style.color = "green";
                    messageP.innerText = "Başarılı! Giriş yapılıyor...";
                    
                    // 1 saniye sonra ana sayfaya at
                    setTimeout(() => {
                        window.location.href = '/'; 
                    }, 1000);
                } else {
                    messageP.style.color = "red";
                    messageP.innerText = data.message || "Hatalı kod!";
                    btn.disabled = false; // Tekrar deneyebilsin
                }
            } catch (error) {
                console.error('Hata:', error);
                messageP.innerText = "Sunucu hatası!";
                btn.disabled = false;
            }
        });
    }
});