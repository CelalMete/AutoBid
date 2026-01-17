document.addEventListener("DOMContentLoaded", () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  console.log("payment.js başarıyla yüklendi🚀");

  // ✅ app-data elementini al
  const teklifForm = document.getElementById("teklifForm");
const plus = document.getElementById("plus-five");
const minus = document.getElementById("minus-five");
const enYuksekTeklifSpan = document.getElementById("enYuksekTeklif");
  const appData = document.getElementById("app-data");
console.log("📦 appData:", appData);

const ilanDataRaw = appData?.getAttribute("data-ilan-data");
console.log("📦 ilanDataRaw:", ilanDataRaw);

const ilanData = ilanDataRaw ? JSON.parse(ilanDataRaw) : null;
console.log("📦 ilanData:", ilanData);

const ilanId = ilanData?._id;
console.log("📦 ilanId:", ilanId);

const kullaniciId = appData?.getAttribute("data-kullanici-id") || "Anonim";
console.log("📦 kullaniciId:", kullaniciId);
  const appDataElement = document.getElementById("app-data");
  const ilanDataString = appDataElement.getAttribute("data-ilan-data");
  const filtrelerData = downbarContainer.dataset.filtre;
   const teklifInput = document.getElementById("teklifInput");
  const enYuksekTeklif = parseFloat(appDataElement.getAttribute("data-en-yuksek-teklif")) || 0;

  
let downbarData=[]
downbarData = JSON.parse(filtrelerData);
  const container = document.getElementById("downbarContainer");
  if (downbarData && downbarData.length) {
    downbarData.forEach((bar) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("info");

      const infoBas = document.createElement("div");
      infoBas.classList.add("info-bas");
      infoBas.textContent = bar.name;

      const text = document.createElement("div");
      text.classList.add("info-txt");
      let value = ilanData[bar.id];
      if (!value) value = "Belirtilmemiş";

      text.textContent = value;

      wrapper.appendChild(infoBas);
      wrapper.appendChild(text);
      container.appendChild(wrapper);
    });
  }

  function buyerFeeCopart(lotPrice) {
    const fees = [
      { max: 50, fee: 1 },
      { max: 100, fee: 1 },
      { max: 200, fee: 25 },
      { max: 300, fee: 60 },
      { max: 350, fee: 85 },
      { max: 400, fee: 100 },
      { max: 450, fee: 125 },
      { max: 500, fee: 135 },
      { max: 550, fee: 145 },
      { max: 600, fee: 155 },
      { max: 700, fee: 170 },
      { max: 800, fee: 195 },
      { max: 900, fee: 215 },
      { max: 1000, fee: 230 },
      { max: 1200, fee: 250 },
      { max: 1300, fee: 270 },
      { max: 1400, fee: 285 },
      { max: 1500, fee: 300 },
      { max: 1600, fee: 315 },
      { max: 1700, fee: 330 },
      { max: 1800, fee: 350 },
      { max: 2000, fee: 370 },
      { max: 2400, fee: 390 },
      { max: 2500, fee: 425 },
      { max: 3000, fee: 460 },
      { max: 3500, fee: 505 },
      { max: 4000, fee: 555 },
      { max: 4500, fee: 600 },
      { max: 5000, fee: 625 },
      { max: 5500, fee: 650 },
      { max: 6000, fee: 675 },
      { max: 6500, fee: 700 },
      { max: 7000, fee: 720 },
      { max: 7500, fee: 755 },
      { max: 8000, fee: 775 },
      { max: 8500, fee: 800 },
      { max: 9000, fee: 820 },
      { max: 10000, fee: 820 },
      { max: 10500, fee: 850 },
      { max: 11000, fee: 850 },
      { max: 11500, fee: 850 },
      { max: 12000, fee: 860 },
      { max: 12500, fee: 875 },
      { max: 15000, fee: 890 },
    ];
    for (let i = 0; i < fees.length; i++) {
      if (lotPrice < fees[i].max) {
        return fees[i].fee;
      }
    }
    return 0;
  }

  function hesaplamalariGuncelle(lotFiyati) {
    const lotElement = document.getElementById("lot");
    const subtotalElement = document.getElementById("subtotal");
    const auctionfeeElement = document.getElementById("auction-fees");
    const truckingElement = document.getElementById("trucking");
    const shippingElement = document.getElementById("shipping");
    const OurFeeElement = document.getElementById("our-fee");

    const auctionFees = buyerFeeCopart(parseFloat(lotFiyati));
    const truckingToPort = 340;
    const shipping = 1545;
    const bidCarsFee = 450;

    const subtotal = parseFloat(lotFiyati) + auctionFees + truckingToPort + shipping + bidCarsFee;

    const customElement = document.getElementById("custom-value");
    const taxElement = document.getElementById("tax");
    const vatElement = document.getElementById("vat");
    const agencyElement = document.getElementById("agency");
    const ClaerenceElement = document.getElementById("Claerence");
    const totalElement = document.getElementById("total");
    

    const Custom = subtotal;
    const tax = subtotal * (10 / 100);
    const vat = subtotal * (21 / 100);
    const agency = 500;
    
    const total = Custom + tax + vat + agency ;

    // ekrana yaz
    lotElement.textContent = "$" + lotFiyati;
    subtotalElement.textContent = "$" + subtotal.toFixed(2);
    shippingElement.textContent = "$" + shipping.toFixed(2);
    auctionfeeElement.textContent = "$" + auctionFees;
    truckingElement.textContent = "$" + truckingToPort;
    OurFeeElement.textContent = "$" + bidCarsFee;
    customElement.textContent = "$" + Custom;
    taxElement.textContent = "$" + tax.toFixed(2);
    vatElement.textContent = "$" + vat.toFixed(2);
    ClaerenceElement.textContent = "$" + (tax + vat + agency).toFixed(2);
    agencyElement.textContent = "$" + agency.toFixed(2);
    totalElement.textContent = "$" + total.toFixed(2);

    const priceInput = document.querySelector("#payment-form input[name='price1']");
    if (priceInput) {
      priceInput.value = total.toFixed(2);
    }
  }


  if (teklifInput) {
    teklifInput.addEventListener("input", function () {
      const girilenFiyat = parseFloat(this.value) || 0;
      hesaplamalariGuncelle(girilenFiyat);
    });
  }
const fastbuy=document.getElementById('fastbuy').innerText
  if (enYuksekTeklif > 0) {
    hesaplamalariGuncelle(enYuksekTeklif);
  }
  else{
    hesaplamalariGuncelle(fastbuy);
  }
      function watchlist() {
         fetch(`/watchlist/ekle/${ilanId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("İlan Watchlist'e eklendi!");
      } else {
        alert(data.message || "Hata oluştu.");
      }
    })
    .catch(() => alert("Sunucuya bağlanılamadı."));
  }

document.getElementById('addWatchlist').addEventListener("click", watchlist); 



console.log("payment.js başarıyla yüklendi 🚀");
  const tumSayaclar = document.querySelectorAll('.geri-sayim');

setInterval(updateCountdowns, 1000);
    updateCountdowns();

    function updateCountdowns() {
        const simdi = new Date().getTime();
        tumSayaclar.forEach(sayac => {
            const bitisTarihiStr = sayac.getAttribute('data-bitis');
            if (!bitisTarihiStr) return; 
            const bitis = new Date(bitisTarihiStr).getTime();
            const kalanSure = bitis - simdi; 
            if (kalanSure < 0) {
                sayac.innerHTML = "<span style='color:red; font-weight:bold;'>Süre Doldu</span>";
                return;
            }
            const saniye = Math.floor((kalanSure / 1000) % 60);
            const dakika = Math.floor((kalanSure / (1000 * 60)) % 60);
            const saat = Math.floor((kalanSure / (1000 * 60 * 60)) % 24);
            const gun = Math.floor(kalanSure / (1000 * 60 * 60 * 24));
            const ay = Math.floor(gun / 30);
            let gosterilecekMetin = "";
            if (ay >= 1) {
                gosterilecekMetin = `${ay} Ay Kaldı`;
            } 
            else if (gun >= 1) {
                gosterilecekMetin = `${gun} Gün ${saat} Saat`; 
            } 
            else if (saat >= 1) {
                gosterilecekMetin = `${saat} Saat ${dakika} Dk`;
            } 
            else {
               
                sayac.style.color = "#d9534f"; // Kırmızı tonu
                sayac.style.fontWeight = "bold";
                gosterilecekMetin = `${dakika} dk ${saniye} sn`;
            }

            sayac.innerText = gosterilecekMetin;
            document.getElementById('green').innerText=gosterilecekMetin;
        });
    }

let currentIndex = 0;
        const images = document.querySelectorAll(".thumbnail");
        const mainImage = document.getElementById("mainImage");
        const totalImages = images.length;
        
        function changeImage(imageSrc, index) {
            mainImage.src = imageSrc;
            currentIndex = index;
        }
        
        images.forEach((img,index)=>{
            img.addEventListener("click",function(){
                changeImage(img.src,index)
            })
        })
        document.querySelector(".prev-btn").addEventListener("click", () => {
            currentIndex = (currentIndex === 0) ? totalImages - 1 : currentIndex - 1;
            mainImage.src = images[currentIndex].src;
        });
        
        document.querySelector(".next-btn").addEventListener("click", () => {
            currentIndex = (currentIndex === totalImages - 1) ? 0 : currentIndex + 1;
            mainImage.src = images[currentIndex].src;
        });
     
const socket = io();


if (plus) {
  plus.addEventListener("click", () => {
  let mevcutDeger = parseInt(teklifInput.value) || 0;
  teklifInput.value = mevcutDeger + 100;
});

minus.addEventListener("click", () => {
  let mevcutDeger = parseInt(teklifInput.value) || 0;
  if (mevcutDeger >= 100) teklifInput.value = mevcutDeger - 100;
});

teklifForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const teklif = parseFloat(teklifInput.value);
console.log("📤 Gönderilen Teklif:", teklif, "ilanId:", ilanId, "kullanici:", kullaniciId);
  if (!teklif || teklif <= 0) return;
  socket.emit("teklifGonder", {
    ilanId: ilanId, 
    teklif: teklif,
    kullanici: kullaniciId 
  });
  teklifInput.value = "";
});

socket.on("teklifGuncelle", (data) => {
  if (data.ilanId !== ilanId) return;
  enYuksekTeklifSpan.textContent = data.teklif;
});

socket.on("teklifReddedildi", (data) => {
  alert(data.mesaj);
});
}


    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('modal-image');
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Tüm resim URL'lerini topla (Ana Resim ve Thumbnail'lar)
    const imageElements = Array.from(document.querySelectorAll('#mainImage, .thumbnail'));
    const imageUrls = imageElements.map(img => img.src);
 

    // Resimlere tıklama olayını ekle
    imageElements.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentIndex = index;
            openModal(img.src);
        });
    });

    // Modalı açma fonksiyonu
    function openModal(src) {
        modalImage.src = src;
        modal.style.display = 'flex'; // Modalı görünür yap
    }

    // Modalı kapatma fonksiyonu
    function closeModal() {
        modal.style.display = 'none';
    }

    // Kapatma butonuna tıklama
    closeBtn.addEventListener('click', closeModal);
    
    // Arka plana tıklama (İsteğe bağlı)
    document.getElementById('lightbox-backdrop').addEventListener('click', closeModal);

    // ESC tuşuyla kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Önceki resme geçiş
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
        modalImage.src = imageUrls[currentIndex];
    });

    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % imageUrls.length;
        modalImage.src = imageUrls[currentIndex];
    });
});

