const mongoose = require("mongoose");

const IsIlanSchema = new mongoose.Schema({
  slide: { type: Boolean, default: false },
  Baslik: String,
  fiyat: Number,
  yapimYili: Date,
  kategori: String,
  secilen2: String,
  secilen3: String,
  IlanKapak: String,
  IlanSahibi: String,
  Ekspertiz: String,
  aciklama: String,
  resimler: [String],
  yuklenmeTarihi: { type: Date, default: Date.now },
  teklif: { type: Number, default: 0 },
  bitisTarihi: { type: Date, required: true },

  // 🔹 İş kategorisine özel alanlar
  pozisyon: String,
  sektor: String,
  deneyim: String,
  calismasekli: String,
  maas: String,
  egitim: String,
  ilanveren: String,
});


module.exports = mongoose.model("IsIlan", IsIlanSchema);         