
document.addEventListener("DOMContentLoaded", () => {
    const side = document.getElementById('side')
    
    async function kisileriGetir123() {
        try {   
            const cevap = await fetch('/getmessages'); 
            const veri = await cevap.json();
            veri.kisiler.forEach(element => {
                const person=document.createElement('div')
               const namediv = document.createElement('div')
               const ppimg = document.createElement('img')
               person.classList.add('personblock')
               namediv.innerText=element.atan.Ad;
               ppimg.src=element.atan.pp
                namediv.classList.add('sender')
                ppimg.classList.add('ppimg')
                side.appendChild(person)
                person.appendChild(ppimg)
               person.appendChild(namediv)
                
            });
            console.log(veri)
        } catch (hata) {
            console.log("HATA ÇIKTI:", hata);

        }
    }
    
    kisileriGetir123();
});