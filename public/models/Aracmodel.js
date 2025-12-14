const mongoose = require("mongoose");

const AracIlanSchema = new mongoose.Schema({
    slide:{type:Boolean,default:false},

    Baslik: String,
    VIN:String,
    LOT:String,
    IlanKapak:String,
    Ekspertiz:String,
    IlanSahibi: String,
    yapimYili:Date,
    durum:String,
    alıcı: mongoose.Schema.Types.ObjectId,
    
    resimler: [String],
    yuklenmeTarihi: { type: Date, default: Date.now },
   teklif:{type :Number,default:0},
   vites:String,
    durum:String,
    sell:{ type:String, default: 'Aktif' },
    FastBuyPrice:Number,
    tur:String,
    alttur:String,
    marka:String,
    model:String,
    seri:String,
    km:Number,
    kapi_sayisi:String,
    kasa_tipi:String,
    hp:String,
    cekis:String,
    motor_hacmi:String ,
    renk:String ,
    yakit_tipi:String,
    garanti:String ,
    kimden:String,
    agir_hasar: String,
    alici:String,
    bitisTarihi: {
    type: Date,
     
  }
});
AracIlanSchema.index({ durum: 1, bitisTarihi: 1 });

module.exports = mongoose.model("AracIlan", AracIlanSchema);         