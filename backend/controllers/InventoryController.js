const { body, param, query, validationResult } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
// const { authenticateRequest } = require('../middlewares/jwt-cookie');
const Cache = require('../helpers/cache');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new Cache(ttl); // Create a new cache service instance
const { logger } = require('../helpers/winston');
const InventoryModel = require('../models/InventoryModel');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const columns = [
  { columnHeader: 'Product Name', data: 'name', readOnly: true },
  { columnHeader: 'SKU', data: 'sku', readOnly: true },
  { columnHeader: '#Available', data: 'amountAvailable', type: 'numeric', readOnly: true },
  { columnHeader: 'Order Status', data: 'orderStatus', readOnly: true },
  { columnHeader: 'Min', data: 'minimum', readOnly: true },
  { columnHeader: 'Max', data: 'maximum', readOnly: false },
  { columnHeader: 'Notes', data: 'notes', readOnly: false },
  { columnHeader: 'Location', data: 'discrepancies', readOnly: false },
];
/**
 * Returns runs
 *
 * @type {*[]}
 */
exports.getInventory = [
  // authenticateRequest,

  function (req, res) {
    // logger.log('info', 'Retrieving Inventory');

    InventoryModel.find({})
      .sort('name')
      .lean()
      .then((result) =>
        apiResponse.successResponseWithData(res, 'success', {
          rows: result,
          columns: columns,
        })
      )
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err.message);
      });
  },
];

exports.deleteItems = [
  // authenticateRequest,
  // body('items').isJSON().withMessage('items must be valid JSON.'),
  function (req, res) {
    logger.log('info', 'Deleting from Inventory');

    let items = req.body.items;

    InventoryModel.deleteMany({ sku: { $in: items } })

      .then(() => {
        InventoryModel.find({})
          .sort('name')
          .lean()
          .then((result) =>
            apiResponse.successResponseWithData(res, 'success', {
              rows: result,
              columns: columns,
            })
          )
          .catch((err) => {
            return apiResponse.ErrorResponse(res, err.message);
          });
      })

      .catch((err) => {
        return apiResponse.errorResponse(res, err.message);
      });
  },
];

exports.remove = [
  // authenticateRequest,
  // body('items').isJSON().withMessage('items must be valid JSON.'),
  function (req, res) {
    logger.log('info', 'Deleting from Inventory');

    let sku = req.query.sku;

    InventoryModel.updateOne({ sku: sku }, { $inc: { amountAvailable: -1 } })
      .then(() => {
        InventoryModel.find({})
          .sort('name')
          .lean()
          .then((result) =>
            apiResponse.successResponseWithData(res, 'success', {
              rows: result,
              columns: columns,
            })
          )
          .catch((err) => {
            return apiResponse.ErrorResponse(res, err.message);
          });
      })

      .catch((err) => {
        return apiResponse.errorResponse(res, err.message);
      });
  },
];

exports.deleteAll = [
  // authenticateRequest,
  // body('items').isJSON().withMessage('items must be valid JSON.'),
  function (req, res) {
    logger.log('info', 'Deleting from Inventory');

    InventoryModel.deleteMany()
      .then(() => {
        return apiResponse.successResponseWithData(res, 'success', {
          columns: columns,
        });
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err.message);
      });
  },
];

exports.saveInventory = [
  // authenticateRequest,
  body('inventory').isJSON().withMessage('inventory must be valid JSON.'),
  function (req, res) {
    logger.log('info', 'Saving Inventory');
    let inventory = JSON.parse(req.body.data);

    inventory = inventory.filter((item) => item.sku && item.sku !== '');
    inventory.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key === 'amountAvailable' && !!!element[key]) {
          element[key] = 0;
        }
        if (element[key] === '') {
          delete element[key];
        }
      });
    });

    var mongoOps = [];
    inventory.forEach((item) => {
      mongoOps.push({
        updateOne: {
          filter: { sku: item.sku },
          update: {
            $set: {
              sku: item.sku,
              name: item.name,
              amountAvailable: item.amountAvailable,
              orderStatus: item.orderStatus,
              notes: item.notes,
              discrepancies: item.discrepancies,
              minimum: item.minimum,
              maximum: item.maximum,
            },
            $setOnInsert: { item },
          },
          upsert: true,
        },
      });
    });

    InventoryModel.bulkWrite(mongoOps)

      .then((result) => {
        InventoryModel.find({})
          .sort('name')
          .lean()
          .then((result) =>
            apiResponse.successResponseWithData(res, 'success', {
              rows: result,
              columns: columns,
            })
          )
          .catch((err) => {
            return apiResponse.errorResponseWithData(res, err.message, {
              rows: inventory,
              columns: columns,
            });
          });
      })

      .catch((err) => {
        return apiResponse.errorResponse(res, err.message);
      });
  },
];
