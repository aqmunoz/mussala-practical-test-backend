const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Peripheral = new Schema({
  uid: {
    type: Number,
    unique: true
  },
  vendor: {
    type: String    
  },
  createdAt: {
    type: Date
  },
  status:{
    type: String
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: 'Gateway'
  }
}, {
  collection: 'peripheral'
})

module.exports = mongoose.model('Peripheral', Peripheral)