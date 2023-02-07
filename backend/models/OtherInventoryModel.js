var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var OtherInventorySchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  amountAvailable: { type: Number, default: 0 },
  orderStatus: { type: String, default: '' },
  notes: { type: String, default: '' },
  discrepancies: { type: String, default: '' },
  minimum: { type: Number, default: null },
}, { collection: 'OtherInventory'});

OtherInventorySchema.static('findOrCreateItem', function (newItem) {
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

module.exports = mongoose.model('OtherInventory', OtherInventorySchema);
