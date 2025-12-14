const mongoose = require("mongoose");

const TeklifSchema = new mongoose.Schema({
   ilanId: mongoose.Schema.Types.ObjectId,
    kullanici: mongoose.Schema.Types.ObjectId,
    fiyat: Number,
    tarih: Date
});

module.exports = mongoose.model("Teklif", TeklifSchema);         