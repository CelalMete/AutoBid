// 1. Sinyal: Dosya HTML'e bağlı mı?
console.log("1 - JavaScript dosyası HTML'e başarıyla bağlandı!");

document.addEventListener("DOMContentLoaded", () => {
    console.log("2 - Sayfa yüklendi (DOMContentLoaded çalıştı)!");

    async function kisileriGetir123() {
        console.log("3 - kisileriGetir fonksiyonu tetiklendi, Fetch başlıyor...");
        try {   
            const cevap = await fetch('/getmessages'); 
            console.log("4 - Fetch mutfaktan döndü! Cevap durumu:", cevap.status);
            
            const veri = await cevap.json();
            console.log("5 - Gelen Veri:", veri);
            
        } catch (hata) {
            console.log("HATA ÇIKTI:", hata);
        }
    }
    
    kisileriGetir123();
});