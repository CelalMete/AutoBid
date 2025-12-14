const mongoose = require('mongoose');

const markaSchema = new mongoose.Schema({
  kategori: String,
  altKategori: String,
});

module.exports = mongoose.model('Marka', markaSchema,'markalar');

