var express = require('express');
var inventoryController = require('./inventory');
var otherInventoryController = require('./otherInventory');

var app = express();

app.use('/inventory/', inventoryController);
app.use('/otherinventory/', otherInventoryController);

module.exports = app;
