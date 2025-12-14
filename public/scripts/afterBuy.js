

document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    document.querySelectorAll(".sendMessage").forEach(btn => {
        btn.addEventListener("click", async () => {
            const ilanId = btn.dataset.ilanId;
            
            // Butonun bulunduğu kapsayıcıyı (.infos2) bul
            const container = btn.closest('.infos2');
            // O kapsayıcının içindeki file inputu bul
            const fileInput = container.querySelector('.fileInput');
            
            // FormData oluştur (Dosya yüklemek için şart)
            const formData = new FormData();
            
            // Eğer kullanıcı bir dosya seçtiyse ekle
            if (fileInput && fileInput.files.length > 0) {
                formData.append('photo', fileInput.files[0]);
            }

            // Butonu devre dışı bırak (Çift tıklamayı önle)
            btn.disabled = true;
            btn.textContent = "İşleniyor...";

            try {
                // Not: FormData kullanırken 'Content-Type' header'ını biz ayarlamayız, tarayıcı otomatik ayarlar.
                // Sadece CSRF token'ı ekliyoruz.
                const res = await fetch(`/ilan/durum-guncelle/${ilanId}`, {
                    method: "PUT",
                    headers: {
                        "CSRF-Token": csrfToken
                    },
                    body: formData
                });

                const data = await res.json();

                if (data.success) {
                    alert("İşlem Başarılı!\nYeni Durum: " + data.yeniDurum);
                    location.reload(); // Sayfayı yenile
                } else {
                    alert("Hata: " + data.message);
                    btn.disabled = false;
                    btn.textContent = "Next Thingy";
                }
            } catch (err) {
                console.error("Fetch hatası:", err);
                alert("Bir hata oluştu.");
                btn.disabled = false;
                btn.textContent = "Next Thingy";
            }
        });
    });
});