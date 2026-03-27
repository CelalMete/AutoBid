
document.addEventListener("DOMContentLoaded", () => {
    const side = document.getElementById('side')
    
    async function kisileriGetir123() {
        try {   
            const cevap = await fetch('/getmessages'); 
            const veri = await cevap.json();
            veri.kisiler.forEach(element => {
               const namediv = document.createElement('div')
               const ppimg = document.createElement('img')
               ppimg.src=element.atan.pp

               namediv.innerText=element.atan.Ad;
                namediv.classList.add('name')
                side.appendChild(ppimg)
               side.appendChild(namediv)
            });
            console.log(veri)
        } catch (hata) {
            console.log("HATA ÇIKTI:", hata);

        }
    }
    
    kisileriGetir123();
});