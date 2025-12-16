const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const IlanStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    if (!req.uploadTimestamp) {
        req.uploadTimestamp = Date.now();
    }
    const kategoriArray = [req.body.tur, req.body.secilen2, req.body.secilen3]
      .filter(Boolean)
      .map(s => s.trim().toLowerCase().replace(/\s+/g, '-')); // Temizle
    const klasorAdi = `${req.uploadTimestamp}-${kategoriArray.join('-')}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '').split('.')[0];
    const fileName = `${Date.now()}-${sanitizedName}`;

    return {

      folder: `ilanlar/${klasorAdi}`, 
      public_id: fileName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});
const ProfileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'autobid_profil', // Profil fotoları buraya gidecek
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    
    // Dosya ismini belirliyoruz (public_id)
    public_id: (req, file) => {
      // Eğer oturum yoksa "anonim" diye kaydeder (Hata vermemesi için)
      if (!req.session || !req.session.userId) {
          return `anonim_${Date.now()}`;
      }
      
      // SENİN İSTEDİĞİN FORMAT: "userId_avatar"
      // Örn: "654a3b..._avatar"
      // Aynı kullanıcı yeni resim yüklerse eskisi otomatik silinir/üzerine yazılır!
      return `${req.session.userId}_avatar`; 
    }
  }
});
const IlanUpload = multer({
  storage: IlanStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error("Sadece görsel dosyaları yükleyebilirsiniz"));
  }
});
const profileUpload = multer({
  storage: ProfileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error("Sadece görsel dosyaları yükleyebilirsiniz"));
  }
});

module.exports = {IlanUpload,profileUpload};