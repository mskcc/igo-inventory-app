var express = require('express');
var inventoryController = require('./inventory');

var app = express();

app.use('/inventory/', inventoryController);

module.exports = app;
