const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    kullaniciAdi: { type: String  },
    rutbe: {type: String,default:"user"},
    Ad: { type: String, required: true},
    Soyad: { type: String, required: true},
    pp : String,
    email: { type: String, required: true, match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Geçersiz e-posta adresi'] },
    sifre1: { type: String, required: true },
    kayitTarihi: { type: Date, default: Date.now },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ilan" }],
    bio:{type:String,default:''}
});

module.exports = mongoose.model("user", userSchema);
