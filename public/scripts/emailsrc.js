const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

async function verifyCode() {
    let code = document.getElementById("verificationCode").value;

    try {
        let response = await fetch("http://localhost:3000/verify-code", {
            method: "POST",
            
            headers: { "Content-Type": "application/json","x-csrf-token": csrfToken },
            body: JSON.stringify({ code })
        });

        let result = await response.json();

        if (result.success) {
           location.replace = "/home";
        } else {
            document.getElementById("verifyMessage").textContent = result.message || "Kod doğrulanamadı.";
        }
    } catch (err) {
        console.error("Sunucu hatası:", err);
        document.getElementById("verifyMessage").textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
}
document.getElementById("btn").addEventListener("click", verifyCode);