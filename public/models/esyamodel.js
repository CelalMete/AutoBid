const mongoose = require("mongoose");

const EsyaIlanSchema = new mongoose.Schema({
  slide: { type: Boolean, default: false },
  Baslik: String,
  kategori: String,
  secilen2: String,
  secilen3: String,
  IlanKapak: String,
  IlanSahibi: String,
  aciklama: String,
  Ekspertiz: String,
  yapimYili: Date,
  resimler: [String],
  yuklenmeTarihi: { type: Date, default: Date.now },
  teklif: { type: Number, default: 0 },
  fiyat: Number,

  // 🔹 Eşya kategorisine özel alanlar
  cisimadi: String,
  marka: String,
  model: String,
  yapimyili: String,
  renk: String,
  garanti: Boolean,
  durum: String,

  bitisTarihi: { type: Date, required: true },
});

EsyaIlanSchema.pre('save',function(next){
    if(this.isModified("Baslik")){
        this.slug=slugify(this.Baslik,{
            lower:true,
            strict:true});
        }
        next();
    })
module.exports = mongoose.model("EsyaIlan", EsyaIlanSchema);         