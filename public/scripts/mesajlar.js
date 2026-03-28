
document.addEventListener("DOMContentLoaded", () => {
    const side = document.getElementById('side')
    
    async function kisileriGetir123() {
        try {   
            const cevap = await fetch('/getmessages'); 
            const veri = await cevap.json();
            veri.kisiler.forEach(element => {
               const namediv = document.createElement('div')
               const ppimg = document.createElement('img')
               namediv.innerText=element.atan.Ad;
               ppimg.src=element.atan.pp
                namediv.classList.add('sender')
                ppimg.classList.add('ppimg')
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