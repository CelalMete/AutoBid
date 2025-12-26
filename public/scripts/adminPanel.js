document.addEventListener("DOMContentLoaded", () => {
  // Butonları seç
  const toArac = document.getElementById("toArac");
  const toKonut = document.getElementById("toKonut");
  const toIs = document.getElementById("toIs");
  const toEsya = document.getElementById("toEsya");

  toArac.addEventListener("click", () => {
    window.location.href = "/shipping/Otomobil/vehicle-Payment";
  });

  toKonut.addEventListener("click", () => {
    window.location.href = "/shipping/konut/some-section"; 
    
  });

  toIs.addEventListener("click", () => {
    window.location.href = "/shipping/is/some-section";
  });

 
  toEsya.addEventListener("click", () => {
    window.location.href = "/shipping/esya/some-section";
  });
});
