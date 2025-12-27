
const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
require("dotenv").config();
const { IlanUpload, profileUpload } = require('./cloudinary');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
 app.use(express.static('public'));

app.use(express.json()); 

const csrf = require("csurf");
const cookieParser = require("cookie-parser");
app.use(cookieParser()); 
const csurf = require("csurf");
app.use(csrf({ cookie: true }));
const csrfProtection = csurf({ cookie: true });
const nodemailer = require("nodemailer");
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const axios = require('axios');
const cron = require('node-cron');
/*const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 200, // 15 dakikada max 200 istek
  message: "Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.",
  standardHeaders: true, // Rate limit bilgilerini header’a ekler
  legacyHeaders: false,
});/*

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 500, // 5 dakikada max 5 deneme
  message: "Çok fazla giriş denemesi. Lütfen 5 dakika sonra tekrar deneyin.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);
// Sadece auth rotasına uygula
app.use("/auth", authLimiter);
/*const ilanLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 1000000000000000, // 10 dakikada en fazla 3 ilan
  message: "Çok fazla ilan oluşturmaya çalıştınız. Lütfen 10 dakika bekleyin.",
  standardHeaders: true,
  legacyHeaders: false,
});*/
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],

      // JS dosyaları
      "script-src": ["'self'"],

      // CSS dosyaları (Google Fonts + FontAwesome)
      "style-src": [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://cdnjs.cloudflare.com" 
      ],

      // Font dosyaları
      "font-src": ["'self'", "https://fonts.gstatic.com","https://fonts.googleapis.com",

        "https://cdnjs.cloudflare.com" 
        ],
      "img-src": ["'self'", "data:", "https://bid.cars", "blob:", "https://res.cloudinary.com"],

      // Media, frame vs. gerekmedikçe kapat
      "object-src": ["'none'"],
      "frame-ancestors": ["'none'"],

      // Formlar sadece kendine post atsın
      "form-action": ["'self'"]
    },
  })
);


// Ek güvenlik başlıkları

const server = http.createServer(app);

const io = socketIo(server);

app.set('socketio', io);

app.use(session({
  secret: 'gizliAnahtar',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,   
      httpOnly: true,  
      maxAge: 1000 * 60 * 60 * 24 
  }
}));

const Konut = require('./public/models/Konutmodel');
const Arac = require('./public/models/Aracmodel');
const Is = require('./public/models/ismodel');
const Esya = require('./public/models/esyamodel');
const Teklif = require('./public/models/teklif');
const durum = require('./public/models/durum')
const Marka = require('./public/models/markalar')
const Kategori = require('./public/models/kategori');

const Kullanici = require('./public/models/user');
const cors = require("cors");

const fsExtra = require('fs-extra');
const kategori = require('./public/models/kategori');
const { body } = require('express-validator');
const { Resend } = require('resend'); 
const resend = new Resend(process.env.RESEND_API_KEY);



app.use(cors({
    origin: "http://localhost:3000", // veya frontend'in adresi
    credentials: true
}));

// VERİTABANI BAĞLANTISI
const dbURL = process.env.MONGO_URI;

console.log("-------------------------------------------------");
console.log("🌍 SRV BAĞLANTISI DENENİYOR...");

mongoose.connect(dbURL, {
    serverSelectionTimeoutMS: 5000, 
    family: 4 
})
.then(() => {
    console.log("✅✅✅ BAĞLANTI BAŞARILI! (SRV Çalıştı) 🚀");
})
.catch((err) => {
    console.error("❌❌❌ BAĞLANTI HATASI! (IP İznini kontrol ettin mi?)");
    console.error(err);
});




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));


const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login');
  }
  next();
};
function isAdmin1(req, res, next) {
  if (!req.session.user.rutbe) {
    return res.status(401).json({ message: "Giriş yapmanız gerekiyor." });
  }

  if (req.session.user.rutbe !== "admin") {
    return res.status(403).json({ message: `Bu sayfaya erişim yetkiniz yok. ${req.session.user.rutbe} ` });
  }

  next(); // Admin ise route'a devam et
};
function isAdmin2(req, res, next) {
  if (!req.session.user.rutbe) {
    return res.status(401).json({ message: "Giriş yapmanız gerekiyor." });
  }

  if (req.session.user.rutbe !== "admin" || req.session.user.rutbe !== "seller") {
    return res.status(403).json({ message: "Bu sayfaya erişim yetkiniz yok." });
  }

  next(); // Admin ise route'a devam et
};

app.post('/auth', csrfProtection, async (req, res) => {
  const { Ad, Soyad, sifre } = req.body;
  try {
    let user = await Kullanici.findOne({ Ad, Soyad, sifre1: sifre });
    if (user) {
      req.session.user = user;
      req.session.userId = user.id;
      return res.json({ success: true, userId: user.id });
    } else {
      return res.json({ success: false, message: 'Kayıtlı değilsin' });
    }
  } catch (error) {
    console.error('Kayıt / Giriş hatası:', error);
    return res.json({ success: false, message: 'Sunucu hatası' });
  }
});

let verificationCodes = {};

const sendEmail = async (req, res) => {
    
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', 
            
            to: 'alici@ornek.com', 
            
            subject: 'Hoşgeldin! Doğrulama Kodun',
            html: '<p>Merhaba, kodun: <strong>12345</strong></p>'
        });

        console.log("Mail gitti:", data);
        res.status(200).json({ message: "Mail başarıyla gönderildi" });

    } catch (error) {
        console.error("Hata:", error);
        res.status(400).json({ error: error.message });
    }
};

app.post('/register', async (req, res) => {
    const { Ad, Soyad, email, sifre1, sifre2 } = req.body;

    if (!Ad || !Soyad || !email || !sifre1 || !sifre2) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar doldurulmalıdır' });
    }

    if (sifre1 !== sifre2) {
        return res.status(400).json({ success: false, message: 'Şifreler uyuşmuyor' });
    }

    try {
        const existingUser = await Kullanici.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Bu kullanıcı zaten kayıtlı' });
        }

        req.session.user1 = { Ad, Soyad, email, sifre1 };

        let verificationCode = Math.floor(100000 + Math.random() * 900000);
        verificationCodes[email] = verificationCode;
        req.session.verificationCode=verificationCodes[email]
        console.log(email)
        console.log(verificationCode)
        sendEmail(email,verificationCode)
        return res.json({ success: true });

    } catch (error) {
        console.error("Register Rotası Hatası:", error);
        return res.status(500).json({ success: false, message: "İşlem başarısız", error: error.message });
    }
});
app.get('/verify-code', csrfProtection, (req, res) => {
  res.render('email', { csrfToken: req.csrfToken() });
});

app.post('/verify-code', csrfProtection, async(req, res) => {
    const { code } = req.body;
    if (!req.session.user1) {
        return res.status(400).json({ success: false, message: "Oturum süresi dolmuş." });
    }

    const email = req.session.user1.email;

    if (verificationCodes[email] == code) {
        delete verificationCodes[email];

        const newUser = new Kullanici({
            Ad: req.session.user1.Ad,
            rutbe: 'admin',
            Soyad: req.session.user1.Soyad,
            sifre1: req.session.user1.sifre1,
            email: req.session.user1.email,
            pp: 'gecici'
        });

        await newUser.save();

        req.session.user = newUser;
        req.session.userId = newUser.id;

        return res.json({ success: true }); 

    } else {
        return res.status(400).json({ success: false, message: "Geçersiz kod!" });
    }
});

cron.schedule('* * * * *', async () => {
    console.log('⏳ Süresi dolan ilanlar kontrol ediliyor...');

    try {
        const suAn = new Date();

        const sonuc = await Arac.updateMany(
            { 
                sell: 'aktif', 
               bitisTarihi: { $lt: suAn }
            },
            { 
                $set: { sell: 'pasif',durum:'vehicle-Payment'} 
            }
        );

        if (sonuc.modifiedCount > 0) {
            console.log(`✅ ${sonuc.modifiedCount} adet ilanın süresi doldu ve pasife çekildi.`);
            
        }

    } catch (error) {
        console.error('Cron Job Hatası:', error);
    }
});

app.get('/login', csrfProtection,(req, res) => {
  res.render('login',{csrfToken: req.csrfToken() });
});
app.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await Kullanici.findById(req.session.userId);
    const now = new Date();
    const araclar =await Arac.find({ }).lean()
    tumIlanlar = araclar.sort(() => Math.random() - 0.5);

    const rastgeleIlanlar = tumIlanlar.slice(0, 30);
    const AnakategoriList = await Marka.find({kategori:"arac"})
    const enYuksekTeklifler = await Promise.all(
      rastgeleIlanlar.map(async (ilan) => {
        const teklif = await Teklif.findOne({ ilanId: ilan._id })
          .sort({ fiyat: -1 })
          .populate('kullanici', 'kullaniciAdi')
          .lean();
        return { ilanId: ilan._id.toString(), teklif };
      })
    );

    const tekliflerObjesi = {};
    enYuksekTeklifler.forEach(({ ilanId, teklif }) => {
      tekliflerObjesi[ilanId] = teklif;
    });

    res.render('Layout', {
      user,AnakategoriList,
      ilanlar: rastgeleIlanlar,
      teklifler: tekliflerObjesi,
      title: 'Home',
      content: 'Homepage',
      extraStyles: '/styles/home.css',
      metaDescription: 'İlan ekleyin ve satışa başlayın.'
    });

  } catch (err) {
    console.error("Hata:", err);
    res.status(500).send("Sunucu hatası");
  }
});



async function sendEmail2(toEmail, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"BidCars" <${process.env.EMAIL}>`,
      to: toEmail,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ E-posta gönderildi: ${toEmail}`);
    return { success: true, info }; // ✅ BAŞARILI SONUÇ DÖN
  } catch (err) {
    console.error("📩 E-posta gönderme hatası:", err);
    return { success: false, error: err }; // ❌ HATA DÖN
  }
}


app.put("/ilan/durum-guncelle/:id", csrfProtection, async (req, res) => {
  try {
   
   const ilan= await Arac.findById(req.params.id)
    
    if (!ilan) return res.status(404).json({ message: "İlan bulunamadı" });

    const kategori = ilan.alttur;
    let durumDoc;
    if (ilan.durum === "non") {
     
      durumDoc = await durum.findOne({ kategori, key: ilan.durum });
    } else {
    
      durumDoc = await durum.findOne({ kategori, key: ilan.durum });
    }
    
console.log("Bulunan durumDoc:", durumDoc);
    if (!durumDoc) {
      return res.status(400).json({ message: `Geçerli bir sonraki adım yok. ${ilan.durum}${ilan.kategori} ` });
    }

    ilan.durum = durumDoc.next;
    await ilan.save();

    const lang = req.user?.lang || "tr";
    const mesaj = durumDoc.message[lang];
    const subject = durumDoc.subject[lang];

    const alici = await Kullanici.findById(ilan.alici);
    if (alici?.email) {
      await sendEmail2(alici.email, subject, mesaj);
    }

    res.json({ success: true, yeniDurum: durumDoc.next, mesaj });
  } catch (err) {
    console.error("Durum güncelleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});






app.get('/how-it-works',async(req, res) => {
   const user = await Kullanici.findById(req.session.userId);
      return res.render('Layout', {
          user,
          title: 'Before Purchase',
          content:'how',
          extraStyles: '/styles/how.css',
          metaDescription: 'İlan ekleyin ve satışa başlayın.'
  })
}
)

app.post("/change-password", csrfProtection, async (req, res, next) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser) {
      return res.status(401).json({ error: "Giriş yapmalısınız." });
    }

    const { Ad, Soyad, sifre1, YeniSifre, YeniSifre2 } = req.body;

    // Kullanıcıyı DB'den çek
    const user = await Kullanici.findById(sessionUser._id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // Ad ve soyad kontrolü
    if (user.Ad !== Ad || user.Soyad !== Soyad) {
      return res.status(400).json({ error: "Ad veya soyad yanlış." });
    }

    // Mevcut şifre kontrolü
    const sifreDogru = await bcrypt.compare(sifre1, user.sifre1);
    if (!sifreDogru) {
      return res.status(400).json({ error: "Mevcut şifre hatalı." });
    }

    // Yeni şifreler aynı mı
    if (YeniSifre !== YeniSifre2) {
      return res.status(400).json({ error: "Yeni şifreler uyuşmuyor." });
    }

    // Yeni şifreyi kaydet
    user.sifre1 = await bcrypt.hash(YeniSifre, 10);
    await user.save();

    res.json({ success: true, message: "Şifre başarıyla değiştirildi." });
  } catch (err) {
    console.error("Şifre değiştirme hatası:", err);
    next(err);
  }
});

// Güvenli hata handler (detayları kullanıcıya gösterme)

app.get('/SSS',async(req, res) => {
   const user = await Kullanici.findById(req.session.userId);
      return res.render('Layout', {
          user,
          title: 'SSS',
          content:'SSS',
          extraStyles: '/styles/SSS.css',
          metaDescription: 'Sıkça sorduğunuz sorular.'
  })
}
)
app.get('/Schedule',async(req, res) => {
   const user = await Kullanici.findById(req.session.userId);
      return res.render('Layout', {
          user,
          title: 'After Purchase',
          content:'schedule',
          extraStyles: '/styles/schedule.css',
          metaDescription: 'İlan ekleyin ve satışa başlayın.'
  })
}
)
app.get('/yeni-ilan-olustur', csrfProtection, async(req, res) => {
    
    const secilen1 = req.query.secilen0 || null; 
    const secilen2 = req.query.secilen1 || null;
    const secilen3=req.query.secilen2||null;
    const user = await Kullanici.findById(req.session.userId);
    
    const filtreKriteri = secilen1; 
    
    let filtreler;
    let txtinput;
    try {

        if (filtreKriteri) {

             filtreler = await Kategori.find({ checktype:false, parent: filtreKriteri }).lean();
              txtinput = await Kategori.find({ checktype:true,parent: filtreKriteri}).lean();
        } else {
             filtreler = [];
            }
    } catch (error) {
        console.error("Kategori filtreleme hatası:", error);
        filtreler = [];
    }

    return res.render('Layout', {
        csrfToken: req.csrfToken(),
        filtreler: filtreler, 
        user, txtinput,
        secilen1,secilen2,secilen3,
        title: 'İlan Ver',
        content:'olustur',
        extraStyles: '/styles/addchap.css',
        metaDescription: 'İlan ekleyin ve satışa başlayın.'
    });
});
app.get('/shipping/:kategori/:section', isAdmin1, csrfProtection, async (req, res) => {
  try {
    const user = await Kullanici.findById(req.session.userId);
    const section = req.params.section || 'vehicle-Payment';
    const kategori = req.params.kategori || 'Otomobil';

    let items = [];

    if (kategori === 'Otomobil') {
      items = await Arac.find({ durum: section }).lean();
    }
    const lang = req.user?.lang || "tr";
     const durumlar = await durum.find({ kategori }).lean();
    res.render('Layout', {
      user,durumlar,
      section,lang,
      kategori,
      csrfToken: req.csrfToken(),
      content: 'shippingInfo',
      extraStyles: 'profile.css',
      title: 'Shipping',
      items,
      metaDescription: 'Profil bölümleri'
    });

  } catch (err) {
    console.error("Shipping route hatası:", err);
    res.status(500).send('Bir hata oluştu.');
  }
});





app.get('/kategoriekle' ,csrfProtection,async(req, res) => {
    const user = await Kullanici.findById(req.session.userId);
    const ana = await Kategori.find({ level: 1 });
  res.render('kategori',{user,ana,csrfToken: req.csrfToken() ,} )
})


app.get('/markaekle' ,csrfProtection,async(req, res) => {
    const user = await Kullanici.findById(req.session.userId);
    const ana = await Kategori.find({ level: 1 });
    const alt = await Kategori.find({ level: 2 });
    const marka = await Kategori.find({})
  res.render('marka',{user,csrfToken: req.csrfToken() ,ana,alt,marka} )
})
 
app.post('/dd', async (req, res, next) => {
    
    const { p, ad ,checktype} = req.body; 
    
    if (!ad || !p||!checktype) {
        return res.status(400).json({ success: false, message: 'Downbar Adı veya Parent Yolu eksik.' });
    }
    const downid = ad.toLowerCase().replace(/\s+/g, '_');
    const nameToSave = ad; 

    try {
        await new Kategori({
            name: nameToSave,   
            id: downid,  
            parent: p,  
            checktype,
            level: 2   
        }).save();
 
        return res.status(201).json({ 
            success: true, 
            message: `${nameToSave} downbar filtresi başarıyla eklendi.`,
            redirectUrl: '/markaekle' 
        });
        
    } catch (error) {
        console.error("Downbar ekleme kaydı sırasında hata:", error); 
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Bu downbar ID\'si (slug) zaten mevcut.' });
        } 
        return res.status(500).json({ success: false, message: 'Sunucu Hatası: Kayıt yapılamadı.' });
    }
});
app.post('/de', async (req, res, next) => {
  
    const { pp, ad } = req.body; 
    
    if (!ad || !pp) {
        return res.status(400).json({ success: false, message: 'Downbar Adı veya Parent Yolu eksik.' });
    }

    const checkboxId = ad.toLowerCase().replace(/\s+/g, '_');
    const yeniCheckbox = {
        id: checkboxId,
        title: ad,
        required: false 
    };

    try {
        const updatedCategory = await Kategori.findOneAndUpdate(
            { id: pp }, 
            { $push: { checkboxes: yeniCheckbox } }, 
            { new: true } 
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Hedef kategori bulunamadı.' });
        }

        return res.status(201).json({ 
            success: true, 
            message: `${ad} özelliği başarıyla eklendi.`,
            redirectUrl: '/markaekle' 
        });
        
    } catch (error) {
        console.error("Checkbox ekleme hatası:", error); 
        return res.status(500).json({ success: false, message: 'Sunucu Hatası: Kayıt yapılamadı.' });
    }
});
app.post(
  '/yeni-ilan-olustur',
  csrfProtection,
  (req, res, next) => {
    IlanUpload.fields([
      { name: "IlanKapak", maxCount: 1 },
      { name: "sayfalar", maxCount: 20 }
    ])(req, res, function (err) {
      if (err) {
        return res.status(400).json({ redirectUrl: null, error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const user = req.session.user;

      
      const kapakDosya = req.files?.IlanKapak?.[0];
      const sayfaDosyalari = req.files?.sayfalar || [];
      const IlanKapak = kapakDosya ? kapakDosya.path : null;
      const resimler = sayfaDosyalari.map(file => file.path);

      // 3. Tarih İşlemleri
      const suAn = new Date();
      const bitisTarihi = new Date(suAn);
      bitisTarihi.setMonth(bitisTarihi.getMonth() + 1);
      const {secilen1, secilen2, secilen3,
        Baslik, km, yakit_tipi,
        hp, agir_hasar, motor_hacmi, kapi_sayisi,
        renk, garanti, kasa_tipi, VIN, LOT
      } = req.body;

      await new Arac({
        bitisTarihi,
        IlanSahibi: user._id,
        alttur: secilen1,
        marka: secilen2,
        model: secilen3,
        Baslik, yakit_tipi, kapi_sayisi,
        hp, km, motor_hacmi,
        renk, garanti, kasa_tipi, agir_hasar,
        IlanKapak, // Direkt https://... linki
        resimler,  // Linklerden oluşan dizi
        VIN, LOT
      }).save();

      res.json({ redirectUrl: '/' });

    } catch (error) {
      console.error("İlan kaydetme hatası:", error);
      res.status(500).json({ success: false, message: `Bir hata oluştu: ${error.message}` });
    }
  }
);


app.get('/upload',csrfProtection, async (req, res) => {
  const user = await Kullanici.findById(req.session.userId);
  const AnakategoriList = await Marka.find({kategori:"arac"})

  res.render('Layout', {
    AL:AnakategoriList,
    csrfToken: req.csrfToken() ,
    content: 'upload',
    extraStyles: '/styles/left.css',
      
    user,
    title: 'İlan Ver',
    metaDescription: 'İlan ekleyin ve satışa başlayın.'
  });
});




app.get("/ilan/:ilanId", csrfProtection, async (req, res) => {
  try {
    const kullanici = await Kullanici.findById(req.session.userId);
    const ilanId = req.params.ilanId;

    const enYuksekTeklifDoc = await Teklif.findOne({ ilanId }).sort({ fiyat: -1 });
    const enYuksekTeklif = enYuksekTeklifDoc ? enYuksekTeklifDoc.fiyat : null;
    const ilan =await Arac.findById(ilanId)

    if (!ilan) {
      return res.status(404).send("İlan bulunamadı.");
    }
    const filtreler = await Kategori.find({parent:ilan.alttur})
    const filtrelerJSON = JSON.stringify(filtreler);
    const ilansahibi = await Kullanici.findById(ilan.IlanSahibi);
    const dd= await Marka.find({})
    const tur = await Marka.findOne({altKategori: ilan.alttur });
    if (!tur) {
      return res.status(404).send(`Kategori bulunamadı.${ilan}//${ilan.alttur}`);
    }

    const gun = ilan.yuklenmeTarihi.toLocaleDateString("tr-TR");
    const saat = ilan.yuklenmeTarihi.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    let kazananUser = null;
    let durum = 'devam'
    if (ilan.bitisTarihi && new Date() > ilan.bitisTarihi && enYuksekTeklif) {
      kazananUser = await Kullanici.findById(enYuksekTeklifDoc.kullanici);
      durum = 'bitti'
    }

    res.render("Layout", {
      enYuksekTeklif,dd,
      ilansahibi,
      csrfToken: req.csrfToken(),
      user: kullanici,
      ilan,
      Anakategori: tur.parentPath,
      gun,filtreler:filtrelerJSON,
      saat,enYuksekTeklifDoc,
      tur,durum,
      kazananUser, 
      content: "manga",
      extraStyles: "/styles/manga.css",
      title: "manga",
      
    });
  } catch (err) {
    console.error("Okuma hatası:", err);
    res.status(500).send(`Okuma sırasında hata oluştu ${err}`);
  }
});


io.on('connection', (socket) => {
  console.log('✅ Bir kullanıcı bağlandı.');

  socket.on('teklifGonder', async (data) => {
    try {
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

      const { ilanId, teklif, kullanici } = data;
      const oncekiEnYuksekTeklif = await Teklif.findOne({ ilanId })
      .sort({ fiyat: -1 });
      console.log("📥 Sunucuya gelen data:", data);
       if (oncekiEnYuksekTeklif && teklif <= oncekiEnYuksekTeklif.fiyat) {
      console.log("⬇️ Yeni teklif, önceki tekliften düşük veya eşit. Reddedildi.");
       socket.emit("teklifReddedildi", {
        mesaj: `Yeni teklif, mevcut tekliften düşük (${oncekiEnYuksekTeklif.fiyat} ₺). Lütfen daha yüksek bir teklif girin.`
      });
      return; 
    }
      if (!ilanId || !teklif || !kullanici) {
       
        console.warn("Eksik teklif verisi:", data);
        return;
      }

      console.log(`Yeni teklif geldi: ${teklif} ₺, ilan: ${ilanId}, kullanıcı: ${kullanici}`);

      
      const teklif1 = await Teklif.create({
        ilanId,
        kullanici,
        fiyat: teklif,
        tarih: new Date()
      });

      io.emit('teklifGuncelle', {
        ilanId,
        teklif,
        kullanici
      });
    } catch (err) {
      console.error("❌ Teklif işlemi sırasında hata:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Kullanıcı ayrıldı.');
  });
});
app.get('/altkategoriler',csrfProtection, async (req, res) => {
  try {
    const { kategori } = req.query;  
    
    const altlar = await Marka.find({ kategori: kategori });
 
    res.json(altlar.map(x => x.altKategori));


  } catch (err) {
    console.error("Kategori hatası:", err);
    res.status(500).send("Kategori verisi alınamadı");
  }
});


app.get("/search",csrfProtection, async (req, res) => {
  //searchbar
  const query = req.query.q;
  if (!query) return res.json([]);
  
  const araclar = await Arac.find({ Baslik: { $regex: query, $options: "i" } })
      .limit(5)
      .select("Baslik")
      .lean()
      .then(results => results.map(r => ({ ...r, kategori: "Araç" })))

  // Hepsini tek diziye topla, maksimum 5 tane gönder
  const allResults = araclar.slice(0, 7); // toplamda 5 sonuç göster
 
  res.json(allResults);
});


app.get('/arama', csrfProtection, async (req, res) => {
    const HİYERARŞİ_SIRASI = ['category', 'marka', 'model', 'package'];
    const secilenler = [];
    const filtre = {}; 
    let ilanlar = [];

   const formatValue = (value) => {
        if (!value) return null;
        let cleaned = value.trim(); 
        
        if (cleaned.length === 0) return null;
        return cleaned.split(' ').map(word => {
          if (word.includes('-')) {
                return word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('-');
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    };

    let sonSecilenDeger = null;

    if (req.query.vin) {
        filtre.VIN = req.query.vin.trim(); 
        secilenler.push({ key: 'VIN', value: req.query.vin });
    }
    HİYERARŞİ_SIRASI.forEach(key => {
        if (req.query[key]) {
            const formattedValue = formatValue(req.query[key]);
            if (formattedValue) {
                secilenler.push({ key: key, value: formattedValue });
                sonSecilenDeger = formattedValue;
            }
            if (key === 'category') filtre.alttur = formattedValue;
            if (key === 'marka') filtre.marka = formattedValue;
            if (key === 'model') filtre.model = formattedValue;
            if (key === 'package') filtre.paket = formattedValue;
        }
    });

    try {
        const user = await Kullanici.findById(req.session.userId);
        const anaKategori = req.query.category;

        let altKategoriler = [];

        if (sonSecilenDeger) {
            altKategoriler = await Marka.find({ kategori: sonSecilenDeger });
        } else {
            
            altKategoriler = await Marka.find({ kategori: "arac" });
        }

        const filtreler = await Kategori.find({ parent: `${anaKategori}` });

        const sirala = req.query.sirala;
        let sortOption = sirala === "pahali" ? { fiyat: -1 } : sirala === "ucuz" ? { fiyat: 1 } : {};

        const standartFiltreler = ['yakit_tipi', 'hp', 'renk', 'kimden', 'vites', 'agir_hasar', 'Tipi', 'cekis', 'garanti', 'motor_hacmi'];
        standartFiltreler.forEach(f => {
            if (req.query[f]) filtre[f] = req.query[f];
        });

        if (req.query.minYil || req.query.maxYil) {
            filtre.yapimYili = {};
            if (req.query.minYil) filtre.yapimYili.$gte = new Date(`${req.query.minYil}-01-01`);
            if (req.query.maxYil) filtre.yapimYili.$lte = new Date(`${req.query.maxYil}-12-31`);
        }

        Object.keys(req.query).forEach(key => {
            // 'vin' parametresini de processedKey içine ekleyelim ki tekrar filtreye girmesin
            const isProcessedKey = HİYERARŞİ_SIRASI.includes(key) || key === 'vin' || key.includes('min') || key.includes('max') || key === 'sirala' || standartFiltreler.includes(key);

            if (!isProcessedKey) {
                let value = req.query[key];
                if (Array.isArray(value)) {
                    filtre[key] = { $in: value };
                } else if (typeof value === 'string' && value.includes(',')) {
                    filtre[key] = { $in: value.split(',') };
                } else {
                    filtre[key] = value;
                }
            }
        });

        ilanlar = await Arac.find(filtre).sort(sortOption).lean();

        const filtrelerJSON = JSON.stringify(filtreler);

        res.render('Layout', {
            user,
            csrfToken: req.csrfToken(),
            anaKategori,
            filtre,
            content: 'filter',
            extraStyles: 'profile.css',
            metaDescription: 'Arama Sonuçları.',
            ilanlar,
            filtreler: filtrelerJSON,
            altKategoriler,
            secilenler,
            title: 'Arama Sonuçları'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Bir hata oluştu: ' + error.message);
    }
});



app.get('/checkout-success', (req, res) => {
  const sessionId = req.query.session_id;
  res.render('checkout-success', { sessionId });
});


app.get('/profile/:section', csrfProtection, async (req, res) => {
  
  try {
      const user = await Kullanici.findById(req.session.userId);
      const section = req.params.section || 'personal-information';
      
      let prof = 'profpersonal';
      let items = []; 
      let sectionTitle = ''; 

      if (section === 'Personal-Information') {
        prof = 'profpersonal';
      }

      if (section === 'profwatchlist' || section === 'archived') {
        prof = 'profWatchlist';
        const watchlistIds = user.watchlist || [];
        const araclar = await Arac.find({ _id: { $in: watchlistIds } }).lean();
        const now = new Date();

        if (section === 'profwatchlist') {
          items.push(...araclar.filter(ilan => !ilan.bitisTarihi || ilan.bitisTarihi > now));
          sectionTitle = "İzleme Listem (Devam Edenler)";
        }

        if (section === 'archived') {
          items.push(...araclar.filter(ilan => ilan.bitisTarihi && ilan.bitisTarihi <= now));
          sectionTitle = "İzleme Listem (Geçmiş)";
        }
      }

      if (section === 'change-password') {
          prof = 'password';
      }
      if (section === 'shipping') {
          prof = 'shipping';
      }

      if (user.rutbe === "admin" && section === 'adminPanel') {
          prof = 'adminPanel';
      } 
      else if (section === 'current-bids' || section === 'won-bids' || section === 'lost-bids') {
        prof = 'profWatchlist';
        const userBids = await Teklif.find({ kullanici: user._id }).lean();
        const ilanIds = [...new Set(userBids.map(b => b.ilanId.toString()))];

        if (section === 'current-bids') sectionTitle = "Devam Eden Tekliflerim";
        if (section === 'won-bids') sectionTitle = "Kazandıklarım";
        if (section === 'lost-bids') sectionTitle = "Kaybettiklerim";

        const ilanArac = await Arac.find({ _id: { $in: ilanIds } }).lean();
        const now = new Date();

        for (const ilan of ilanArac) {
          const userBidForIlan = userBids
            .filter(b => b.ilanId.toString() === ilan._id.toString())
            .sort((a, b) => b.fiyat - a.fiyat)[0]; 

          if (!userBidForIlan) continue; 

          const bitmis = ilan.bitisTarihi && ilan.bitisTarihi < now;

          if (section === 'current-bids' && !bitmis) {
          items.push(ilan);
        }
          else if (bitmis) {
            
            const highestBid = await Teklif.find({ ilanId: ilan._id }).sort({ fiyat: -1 }).limit(1).lean();
            const winnerId = highestBid[0]?.kullanici.toString();

            if (section === 'won-bids' && winnerId === user._id.toString()) {
               items.push(ilan);
            } 
            else if (section === 'lost-bids' && winnerId !== user._id.toString()) {
               items.push(ilan);
            }
          }
        }
      }

      res.render('Layout', {
        user,
        section, 
        csrfToken: req.csrfToken(),
        content: 'profile',
        extraStyles: 'profile.css',
        title: 'Profile',
        prof: prof,
        items,
        sectionTitle,
        metaDescription: 'Profil bölümleri'
      });

  } catch (error) {
      console.error("Profil Hatası:", error);
      res.redirect('/'); // veya hata sayfasına
  }
});


app.post("/watchlist/ekle/:ilanId",csrfProtection, async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Giriş yapmalısınız" });
    }

    const user = await Kullanici.findById(req.session.userId);
    const ilanId = req.params.ilanId;

    if (!user.watchlist.includes(ilanId)) {
      user.watchlist.push(ilanId);
      await user.save();
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Zaten watchlist’te var" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

app.post('/altkategoriekle',csrfProtection, async (req, res) => {
  
  const { ustKategori, altKategori } = req.body;
  try {
    await Marka.create({ kategori: ustKategori, altKategori });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB hatası' });
  }
});
// App.js dosyanın içinde:

// 1. Önce Middleware'i (Bekçiyi) bir değişkene al
const resimYukleyici = profileUpload.single('pp');

app.post('/pp', (req, res) => {
    
    console.log("-----------------------------------------");
    console.log("📡 İSTEK GELDİ: /pp rotası tetiklendi");

    resimYukleyici(req, res, async function (err) {
        
        if (err) {
            console.error("🚨 MULTER/YÜKLEME HATASI:", err);
            
            return res.status(500).json({ 
                message: 'Yükleme Hatası', 
                error: err.message, // Hatanın asıl sebebi burada!
                code: err.code 
            });
        }

        // B) EĞER HATA YOKSA İÇERİ GİR
        console.log("✅ Dosya Multer'den geçti. Dosya:", req.file);

        // Session Kontrolü
        if (!req.session || !req.session.userId) {
            console.error("❌ OTURUM YOK: req.session.userId boş!");
            return res.status(401).json({ message: 'Oturum süreniz dolmuş, lütfen tekrar giriş yapın.' });
        }

        if (!req.file) {
            console.error("❌ DOSYA YOK: req.file undefined");
            return res.status(400).json({ message: 'Dosya sunucuya ulaşmadı (Frontend hatası olabilir)' });
        }

        try {
            const userId = req.session.userId;
            const newPpPath = req.file.path; // Cloudinary Linki

            // Veritabanı Kayıt
            const guncelUser = await Kullanici.findByIdAndUpdate(userId, { pp: newPpPath }, { new: true });
            
            // Session Güncelle
            req.session.user = guncelUser;

            console.log("🎉 İŞLEM BAŞARILI! Yeni link:", newPpPath);
            res.json({ message: 'Başarılı', newPp: newPpPath });

        } catch (dbError) {
            console.error("❌ VERİTABANI HATASI:", dbError);
            res.status(500).json({ message: 'Veritabanı hatası' });
        }
    });
});
app.post("/profil/bio",csrfProtection,  async (req, res) => {
  console.log("Bio endpoint tetiklendi!", req.body);
  const { bio } = req.body;
  const userId = req.session.userId;

  const user = await Kullanici.findByIdAndUpdate(userId, { bio }, { new: true });
 res.json({ bio: user.bio });
});
app.get('/api/kategoriler/cocuk/:parentPath', async (req, res) => {
    const parentPath = req.params.parentPath;
    console.log(parentPath)
    try {
        const altKategoriler = await Marka.find({ kategori: parentPath })
               console.log(altKategoriler)                     
        res.json(altKategoriler); 

    } catch (error) {
        console.error(`Alt kategori çekme hatası (${parentPath}):`, error);
        res.status(500).json([]);
    }
});

app.get('/api/kategoriler/yan/:parentPath', async (req, res) => {
    const parentPath = req.params.parentPath;
    const ana =  await Marka.find({ altKategori: parentPath })
    
    try {
        const altKategoriler = await Marka.find({ kategori: ana.altKategori })
               console.log(altKategoriler)                     
        res.json(altKategoriler); 

    } catch (error) {
        console.error(`Alt kategori çekme hatası (${parentPath}):`, error);
        res.status(500).json([]);
    }
});
app.post('/admin/api/kategori-ekle', async (req, res) => {
    const { name, level, parentPath, formFields } = req.body; 
    if (!name || !level) {
        return res.status(400).json({ success: false, message: 'Ad ve Seviye zorunludur.' });
    }
    const nameSlug = name.replace(/\s/g, '_');
    const targetLevel = parseInt(level);
  
    if (targetLevel >= 4) {
        if (!parentPath) {
            return res.status(400).json({ success: false, message: 'Form alanı eklemek için Üst Yol (parentPath) zorunludur.' });
        }
        try {
           const parentCategory = await Kategori.findOne({ path: parentPath });

            if (!parentCategory) {
                return res.status(404).json({ success: false, message: 'Üst kategori bulunamadı. Yeni form alanı eklenemedi.' });
            }

            // Yeni Form Alanı Objesini Oluştur (Varsayılan olarak TEXT inputu)
            const yeniFormAlani = {
                id: nameSlug,         
                title: name,          
                type: 'text',        
                options: [],
                required: false
            };

           
            const existingField = parentCategory.formFields.find(field => field.id === nameSlug);
            if (existingField) {
                 return res.status(400).json({ success: false, message: `"${name}" zaten bu kategoride form alanı olarak tanımlanmış.` });
            }
            
           
            await Kategori.updateOne(
                { path: parentPath },
                { $push: { "formFields": yeniFormAlani } }
            );

            // Başarılı yanıt gönder
            return res.status(200).json({ 
                success: true, 
                message: `"${parentCategory.name}" kategorisine yeni form alanı ("${name}") başarıyla eklendi.` 
            });

        } catch (error) {
            console.error("Form alanı ekleme hatası:", error);
            return res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + error.message });
        }
    }

   
    let newPath;
    let isRoot = (parentPath === null || parentPath === '');
    
    if (isRoot) {
        newPath = nameSlug; 
    } else {
        // Alt seviyeler için: parentPath/yeni_isim
        // NOT: JavaScript kısmından / gönderildiğini varsayarak düzelttim
        newPath = `${parentPath}*${nameSlug}`; 
    }

    try {
        const existingCategory = await Kategori.findOne({ path: newPath });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: `Bu kategori yolu (${newPath}) zaten mevcut.` });
        }
        
        const yeniKategori = new Kategori({
            path: newPath,
            name: name,
            level: targetLevel,
            parentPath: isRoot ? null : parentPath,
            formFields: (formFields && formFields.length > 0) ? formFields : [] 
        });

        await yeniKategori.save();

        res.status(201).json({ 
            success: true, 
            message: `${name} kategorisi (Level ${targetLevel}) başarıyla eklendi.`, 
            path: newPath 
        });

    } catch (error) {
        console.error("Kategori ekleme hatası:", error);
        return res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + error.message });
    }
});
app.get('/api/kategoriler/marka', async (req, res) => {})
app.get('/api/markalar/kategori/:altKategori', async (req, res) => {
const altkategoriarray = req.params.altKategori;
  try {  

  
    const altKategoriler = await Marka.find({ kategori: altkategoriarray })
   
        res.json(altKategoriler); 
      
        
    } catch (error) {
        console.error(`purna ):`, error);
        res.status(500).json([]);
    }
})
app.post('/admin/markaekle', async (req, res) => {
    
    const { altKategori: yeniMarkaAdi, kategori: fullPath } = req.body; 

    if (!yeniMarkaAdi || !fullPath) {
        return res.status(400).json({ success: false, message: 'Marka Adı ve Kategori Yolu zorunludur.' });
    }
    
    const pathSegments = fullPath.split('*');
    
   
   const altKategoriAd = pathSegments[pathSegments.length - 1];
    
    const markaAdi = yeniMarkaAdi; 

    try {
        const existingMarka = await Marka.findOne({ 
            kategori: altKategoriAd, 
            altKategori: markaAdi
        });

        if (existingMarka) {
             return res.status(400).json({ success: false, message: `${markaAdi} markası bu kategoride zaten mevcut.` });
        }
        
        const yeniMarka = new Marka({
            kategori: altKategoriAd, 
            altKategori: markaAdi 
        });
        
        await yeniMarka.save();

        return res.status(201).json({ 
            success: true, 
            message: `${markaAdi} markası başarıyla eklendi.`, 
        });

    } catch (error) {
        console.error("Marka ekleme hatası:", error);
        return res.status(500).json({ success: false, message: 'Veritabanı hatası.' });
    }
});
// SERVER
server.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor");
});
