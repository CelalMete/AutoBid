const mongoose = require('mongoose');
const ozellikSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true 
    }, 
    
    title: { 
        type: String, 
        required: true 
    },

    required: {
        type: Boolean,
        default: false
    }
}, { _id: false });
const kategoriSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    checktype:{
        type:Boolean,
        default:false,
        },
    level: {
        type: Number,
        required: true,
        min: 1
    },
    id:String,
    parent: {
        type: String,
        default: null
    },

    checkboxes: [ozellikSchema] 

});


module.exports = mongoose.model('Kategori', kategoriSchema);
