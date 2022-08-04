var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var InventorySchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  amountOrdered: { type: Number, default: 0 },
  amountAvailable: { type: Number, default: 0 },
  orderStatus: { type: String, default: '' },
  notes: { type: String, default: '' },
  discrepancies: { type: String, default: '' },
  minimum: { type: Number, default: null },
  maximum: { type: Number, default: null },
});

InventorySchema.static('findOrCreateItem', function (newItem) {
  return new Promise((resolve, reject) => {
    if (newItem._id) {
      this.findById(ObjectId(newItem._id)).exec(function (err, item) {
        if (err || !item) {
          reject('Could not retrieve item.');
        } else {
          resolve(item);
        }
      });
    } else {
      resolve(new this(newItem));
    }
  });
});

module.exports = mongoose.model('Inventory', InventorySchema);
