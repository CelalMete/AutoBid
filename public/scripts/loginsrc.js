// Elemanları tek yerde topla
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
  tus: document.getElementById("tus"),
  kayit: document.getElementById("kayit"),
  orospucocugu: document.getElementById("orospucocugu"),
  vis: document.getElementById("visib"),
  vis2: document.getElementById("visib2"),
  vis3: document.getElementById("visib3"),
  sifre: document.getElementById("i3"),
  sifre2: document.getElementById("i6"),
  sifre3: document.getElementById("i4"),
  soyadGiris: document.getElementById("i8"),
  soyadKayit: document.getElementById("i7"),
};

// Tekrarı azaltmak için yardımcı fonksiyon
function toggleAktifInaktif(...items) {
  items.forEach((x) => {
    if (x) {
      x.classList.toggle("inaktif");
      x.classList.toggle("aktif");
    }
  });
}
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// Şifre görünür/gizli yapma
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

setupPasswordToggle(el.vis, el.sifre);
setupPasswordToggle(el.vis2, el.sifre2);
setupPasswordToggle(el.vis3, el.sifre3);

// Kayıt butonu
el.kayit?.addEventListener("click", () => {
  if (el.kayit.classList.contains("aktif")) {
    registerUser();
  } else {
    toggleAktifInaktif(
      el.kayit,
      el.tus,
      el.yeni,
      el.d1,
      el.d3,
      el.orospucocugu,
      el.main,
      el.d2,
      el.di1,
      el.di2,
      el.di3,
      el.di4,
      el.di7
    );
  }
});

// Giriş butonu
el.tus?.addEventListener("click", () => {
  if (el.kayit.classList.contains("aktif")) {
    toggleAktifInaktif(
      el.kayit,
      el.tus,
      el.yeni,
      el.d1,
      el.d3,
      el.orospucocugu,
      el.main,
      el.d2,
      el.di1,
      el.di2,
      el.di3,
      el.di4,
      el.di7
    );
  }
});

// Kullanıcı kayıt
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
      headers: { "Content-Type": "application/json" ,"CSRF-Token": csrfToken },
      
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

// Kullanıcı giriş
async function fut4Lower() {
  const Ad = document.getElementById("i1").value;
  const sifre = el.sifre.value;
  const Soyad = el.soyadGiris.value;

  try {
    console.log(Ad+sifre+Soyad)
    const response = await fetch("/auth", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" , "CSRF-Token": csrfToken },
     
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
document.getElementById("kayit").addEventListener("click", registerUser);
document.getElementById("tus").addEventListener("click", fut4Lower);