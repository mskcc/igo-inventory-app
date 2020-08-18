var express = require('express');
const InventoryController = require('../controllers/InventoryController');
var router = express.Router();

router.get('/inventory', InventoryController.getInventory);
router.post('/save', InventoryController.saveInventory);

module.exports = router;

