const mongoose = require("mongoose");

const mesajSchema = new mongoose.Schema({
  from: {type: mongoose.Schema.Types.ObjectId, 
          ref: 'user',   
          required: true },
  to: {type: mongoose.Schema.Types.ObjectId, 
          ref: 'user',   
          required: true  },  
  date:Date,  
  message:String
});                     

module.exports = mongoose.model("mesaj", mesajSchema);

 