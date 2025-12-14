document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch("/change-password", {
      method: "POST",
      headers: { "x-csrf-token": formData.get("_csrf") },
      body: formData
    });

    const data = await res.json();
    const sonuc = document.getElementById("sonuc");

    if (data.success) {
      sonuc.innerHTML = `<p style="color:green">${data.message}</p>`;
      form.reset();
    } else {
      sonuc.innerHTML = `<p style="color:red">${data.error}</p>`;
    }
  } catch (err) {
    console.error("İstek hatası:", err);
  }
});