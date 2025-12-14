const mongoose = require("mongoose");

const KonutIlanSchema = new mongoose.Schema({

    Baslik: String,
    
    IlanKapak:String,
    IlanSahibi: String,
    aciklama: String,
    Ekspertiz:String,
   resimler: [String],
    yapimYili:Date,
    yuklenmeTarihi: { type: Date, default: Date.now },
   teklif:{type :Number,default:0},
    bitisTarihi: {
    type: Date,
    required: true   
  },
    fiyat:Number,
    kategori:String,
    secilen2:String,
    secilen3:String,
    brutm:Number,
    otopark:String,
    mutfak:String,
    netm:Number,
    balkon:String,
    asansor:String,
    esyali:String,
    isitma:String,
    oda:String,
    binayas:Number,
  
});


module.exports = mongoose.model("KonutIlan", KonutIlanSchema);         