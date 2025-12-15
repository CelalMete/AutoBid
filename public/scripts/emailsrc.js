document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('btn');
            
            // Eğer buton sayfada yoksa kodu çalıştırma (Hata almamak için)
            if (!btn) return;

            btn.addEventListener('click', async (e) => {
                e.preventDefault(); // Sayfanın yenilenmesini engeller

                console.log("🖱️ Butona basıldı!");

                const codeInput = document.getElementById('verificationCode');
                const messageP = document.getElementById('verifyMessage');
                const code = codeInput.value;

                // Meta etiketinden CSRF Token'ı çekiyoruz
                const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
                const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

                if (!code) {
                    messageP.innerText = "Lütfen kodu girin!";
                    messageP.style.color = "red";
                    return;
                }

                // Butonu kilitle (Çift tıklamayı önle)
                btn.disabled = true;
                btn.innerText = "Kontrol ediliyor...";
                messageP.innerText = "Bekleyiniz...";
                messageP.style.color = "blue";

                try {
                    const response = await fetch('/verify-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': csrfToken // Token'ı header olarak ekle
                        },
                        body: JSON.stringify({ code: code })
                    });

                    const data = await response.json();

                    console.log("Sunucu Cevabı:", data);

                    if (data.success) {
                        messageP.style.color = "green";
                        messageP.innerText = "✅ Başarılı! Yönlendiriliyorsunuz...";
                        
                        setTimeout(() => {
                            window.location.href = '/'; // Ana sayfaya git
                        }, 1500);
                    } else {
                        messageP.style.color = "red";
                        messageP.innerText = "❌ " + (data.message || "Hatalı kod!");
                        btn.disabled = false;
                        btn.innerText = "Doğrula";
                    }
                } catch (error) {
                    console.error('Hata:', error);
                    messageP.style.color = "red";
                    messageP.innerText = "⚠️ Sunucu hatası!";
                    btn.disabled = false;
                    btn.innerText = "Doğrula";
                }
            });
        });