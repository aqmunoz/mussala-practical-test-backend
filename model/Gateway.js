const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Gateway = new Schema({
  name: {
    type: String
  },
  serial: {
    type: Number,
    unique: true,
    required: true
  },
  address: {
    type: String
  },
  peripherals:[{
    type: Schema.Types.ObjectId,
    ref: 'Peripheral'
  }]  
}, {
  collection: 'gateways'
})

module.exports = mongoose.model('Gateway', Gateway)