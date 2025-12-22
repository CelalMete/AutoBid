// --- ELEMENT SEÇİMLERİ ---
const el = {
  di1: document.getElementById("di1"),
  di2: document.getElementById("di2"),
  di3: document.getElementById("di3"),
  di4: document.getElementById("di4"),
  di7: document.getElementById("di7"),
  d1: document.getElementById("d1"),
  d2: document.getElementById("d2"),
  d3: document.getElementById("d3"),
  main: document.getElementById("main"),
  yeni: document.getElementById("yeni"),
  tus: document.getElementById("tus"), // Giriş Yap butonu
  kayit: document.getElementById("kayit"), // Kaydol butonu
  orospucocugu: document.getElementById("orospucocugu"), // Overlay/Kaydıraç
  vis: document.getElementById("visib"),
  vis2: document.getElementById("visib2"),
  vis3: document.getElementById("visib3"),
  sifre: document.getElementById("i3"),
  sifre2: document.getElementById("i6"),
  sifre3: document.getElementById("i4"),
  soyadGiris: document.getElementById("i8"),
  soyadKayit: document.getElementById("i7"),
};

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// --- YARDIMCI FONKSİYONLAR ---

// Class değiştirme fonksiyonu (Görünürlük ayarları için)
function toggleAktifInaktif(...items) {
  items.forEach((x) => {
    if (x) {
      x.classList.toggle("inaktif");
      x.classList.toggle("aktif");
    }
  });
}

// Şifre Göster/Gizle Ayarı
function setupPasswordToggle(button, input) {
  if (!button || !input) return;
  button.addEventListener("click", () => {
    button.classList.toggle("aktif");
    button.innerText = button.classList.contains("aktif")
      ? "visibility"
      : "visibility_off";
    input.type = button.classList.contains("aktif") ? "text" : "password";
  });
}

// Şifre ikonlarını başlat
setupPasswordToggle(el.vis, el.sifre);
setupPasswordToggle(el.vis2, el.sifre2);
setupPasswordToggle(el.vis3, el.sifre3);

// --- ANA TIKLAMA MANTIĞI (DÜZELTİLEN KISIM) ---

// 1. KAYIT BUTONU (Register)
el.kayit?.addEventListener("click", () => {
  // Eğer buton zaten 'aktif' ise (yani şu an Kayıt formundayız), SUBMIT yap.
  if (el.kayit.classList.contains("aktif")) {
    registerUser();
  } else {
    // Eğer 'inaktif' ise, KAYIT EKRANINA GEÇİŞ yap.
    // DİKKAT: el.d2 ve el.d3 listeden çıkarıldı ki butonlar kaybolmasın.
    toggleAktifInaktif(
      el.kayit, // Butonun kendi durumu değişsin (Submit moduna geçsin)
      el.tus,   // Diğer butonun durumu değişsin
      el.yeni,  // Kayıt formu açılsın
      el.d1,    // Giriş formu kapansın
      el.orospucocugu, // Overlay kaysın
      el.main,
      el.di1, el.di2, el.di3, el.di4, el.di7 // Inputlar açılsın/kapansın
    );
  }
});

// 2. GİRİŞ BUTONU (Login)
el.tus?.addEventListener("click", () => {
  // Eğer Kayıt butonu 'aktif' ise, şu an Kayıt ekranındayız demektir.
  // Bu durumda Giriş tuşu "GERİ DÖN" işlevi görmeli.
  if (el.kayit.classList.contains("aktif")) {
    toggleAktifInaktif(
      el.kayit, // Eski haline dönsün
      el.tus,   // Eski haline dönsün
      el.yeni,  // Kayıt formu kapansın
      el.d1,    // Giriş formu açılsın
      el.orospucocugu, // Overlay geri kaysın
      el.main,
      el.di1, el.di2, el.di3, el.di4, el.di7
    );
  } else {
    // Eğer normal Giriş ekranındaysak, LOGIN yap.
    fut4Lower();
  }
});


// --- SUNUCU İŞLEMLERİ (FETCH) ---

// Kullanıcı Kayıt Fonksiyonu
async function registerUser() {
  const Soyad = el.soyadKayit.value;
  const Ad = document.getElementById("i5").value;
  const email = document.getElementById("i2").value;
  const sifre1 = el.sifre2.value;
  const sifre2 = el.sifre3.value;

  try {
    const response = await fetch("/register", {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken 
      },
      body: JSON.stringify({ Ad, Soyad, email, sifre1, sifre2 }),
    });
    const result = await response.json();

    if (result.success) {
      window.location.href = "/verify-code";
    } else {
      alert("Hata: " + result.message);
    }
  } catch (err) {
    alert("Sunucu hatası: " + err.message);
  }
}

// Kullanıcı Giriş Fonksiyonu
async function fut4Lower() {
  const Ad = document.getElementById("i1").value;
  const sifre = el.sifre.value;
  const Soyad = el.soyadGiris.value;

  try {
    const response = await fetch("/auth", {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken 
      },
      body: JSON.stringify({ Ad, Soyad, sifre }),
    });
    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem("userId", result.userId);
      window.location.href = "/";
    } else {
      alert("Hata: " + result.message);
    }
  } catch (err) {
    alert("Sunucu hatası: " + err.message);
  }
}