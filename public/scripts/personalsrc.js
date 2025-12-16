document.addEventListener('DOMContentLoaded', function() {
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");


    document.getElementById('uploadBtn').addEventListener('click', async () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
    
        if (!file) {
            alert('Lütfen bir dosya seçin.');
            return;
        }
    
        const formData = new FormData();
        formData.append('pp', file);
    
        try {
            const response = await fetch('/pp', {
                method: 'POST',
              headers: {"X-CSRF-Token": csrfToken , 
        "Content-Type": "application/json"
      },
                body: formData
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Hata:', error);
        }
    });
    async function change() {
        const btn = document.getElementById('btn1')
        
    }
    function openModal() {
  document.getElementById("ppModal").style.display = "block";
}

function closeModal() {
  document.getElementById("ppModal").style.display = "none";
}

 const duzenleBtn = document.getElementById("bioDuzenleBtn");
  const formAlani = document.getElementById("bioFormAlani");
  const bioAlani = document.getElementById("bioAlani");
  const bioTextarea = document.getElementById("bioTextarea");

  duzenleBtn.addEventListener("click", () => {
    bioAlani.style.display = "none";
    formAlani.style.display = "block";
  });

  document.getElementById("bioIptalBtn").addEventListener("click", () => {
    formAlani.style.display = "none";
    bioAlani.style.display = "block";
  });

  document.getElementById("bioKaydetBtn").addEventListener("click", async () => {
    const yeniBio = bioTextarea.value;

    const res = await fetch("/profil/bio", {
      method: "POST",
      
      headers: {"X-CSRF-Token": csrfToken , 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bio: yeniBio })
    });

    if (res.ok) {
      const sonuc = await res.json();
      document.getElementById("bioMetin").innerText = sonuc.bio;
      formAlani.style.display = "none";
      bioAlani.style.display = "block";
    }
  });


document.getElementById("close").addEventListener("click", closeModal);
document.getElementById("open").addEventListener("click", openModal);
});