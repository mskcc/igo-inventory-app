var express = require('express');
const InventoryController = require('../controllers/InventoryController');
var router = express.Router();

router.get('/inventory', InventoryController.getInventory);
router.post('/save', InventoryController.saveInventory);
router.post('/deleteItems', InventoryController.deleteItems);

module.exports = router;

