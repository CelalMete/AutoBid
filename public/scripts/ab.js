document.addEventListener("DOMContentLoaded", () => {

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  console.log("payment.js başarıyla yüklendi🚀");

  const teklifForm = document.getElementById("teklifForm");
  const mesaj=document.getElementById("mesajform")
const plus = document.getElementById("plus-five");
const minus = document.getElementById("minus-five");
const enYuksekTeklifSpan = document.getElementById("enYuksekTeklif");
  const appData = document.getElementById("app-data");
const ilanDataRaw = appData?.getAttribute("data-ilan-data");
const ilanData = ilanDataRaw ? JSON.parse(ilanDataRaw) : null;
const ilanId = ilanData?._id;
const kullaniciId = appData?.getAttribute("data-kullanici-id") || "Anonim";
  const filtrelerData = downbarContainer.dataset.filtre;
   const teklifInput = document.getElementById("teklifInput");
 function sendmessage(message) {
         fetch(`/sendmessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
       body: JSON.stringify({ message:message,ilanData:ilanData })
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
  mesaj.addEventListener('submit',(e)=>{
    e.preventDefault();
  const formData = new FormData(mesaj);
  const gidenBilgiler = Object.fromEntries(formData.entries());
  console.log('1')
 sendmessage(gidenBilgiler.mesaj)
 })


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

const fastbuy=document.getElementById('fastbuy').innerText
 
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

    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
        modalImage.src = imageUrls[currentIndex];
    });

    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % imageUrls.length;
        modalImage.src = imageUrls[currentIndex];
    });
    
    const inf =document.getElementById('info-cont')
    const teklif =document.getElementById('teklif')
    const sleft =document.getElementById('left')
    const sright =document.getElementById('right')
    sright.addEventListener('click', function() {
     teklif.style.display='none';
     inf.style.display='block';
    })
     sleft.addEventListener('click', function() {
     teklif.style.display='block';
     inf.style.display='none';
    })


});

