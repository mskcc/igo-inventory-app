var express = require('express');
const OtherInventoryController = require('../controllers/OtherInventoryController');
var router = express.Router();

router.get('/inventory', OtherInventoryController.getInventory);
router.post('/save', OtherInventoryController.saveInventory);
router.post('/deleteItems', OtherInventoryController.deleteItems);
router.post('/remove', OtherInventoryController.remove);
router.post('/deleteAll', OtherInventoryController.deleteAll);

module.exports = router;

