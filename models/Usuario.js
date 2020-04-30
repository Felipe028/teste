const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Usuario = new Schema({
  nome:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  senha:{
    type: String,
    required: true
  },
  eAdmin:{// "= 0" é usuario e "= 1" é admin
    type: Number,
    default: 0
  }
})

mongoose.model("usuarios", Usuario)
