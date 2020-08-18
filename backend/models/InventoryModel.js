var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InventorySchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  amountOrdered: { type: Number, default: 0 },
  amountAvailable: { type: Number, default: 0 },
  orderStatus: { type: String, default: '' },
});

module.exports = mongoose.model('Inventory', InventorySchema);
