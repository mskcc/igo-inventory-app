const { body, param, query, validationResult } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');
// const { authenticateRequest } = require('../middlewares/jwt-cookie');
const { getRuns } = require('../services/services');
const Cache = require('../helpers/cache');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new Cache(ttl); // Create a new cache service instance
const { logger } = require('../helpers/winston');
const InventoryModel = require('../models/InventoryModel');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const columns = [
  { columnHeader: 'Product Name', data: 'name', edit: 'admin' },
  { columnHeader: 'SKU', data: 'sku', edit: 'admin' },
  { columnHeader: '#Available', data: 'amountAvailable', type: 'numeric', edit: 'all' },
  { columnHeader: '#Ordered', data: 'amountOrdered', type: 'numeric', edit: 'all' },
  { columnHeader: 'Order Status', data: 'orderStatus', edit: 'admin' },
];
/**
 * Returns runs
 *
 * @type {*[]}
 */
exports.getInventory = [
  // authenticateRequest,

  function (req, res) {
    logger.log('info', 'Retrieving Inventory');

    InventoryModel.find({})
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

exports.saveInventory = [
  // authenticateRequest,
  body('inventory').isJSON().withMessage('inventory must be valid JSON.'),
  function (req, res) {
    logger.log('info', 'Saving Inventory');
    let inventory = JSON.parse(req.body.data);

    inventory = inventory.filter((item) => item.sku && item.sku !== '');

    var mongoOps = [];
    inventory.forEach((item) => {
      mongoOps.push({
        updateOne: {
          filter: { sku: item.sku },
          update: {
            $set: {
              amountOrdered: item.amountOrdered,
              name: item.name,
              amountAvailable: item.amountAvailable,
              orderStatus: item.orderStatus,
            },
            $setOnInsert: { item },
          },
          upsert: true,
        },
      });
    });

    InventoryModel.bulkWrite(mongoOps)

      .then(() => {
        InventoryModel.find({})
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

exports.deleteItems = [
  // authenticateRequest,
  // body('items').isJSON().withMessage('items must be valid JSON.'),
  function (req, res) {
    logger.log('info', 'Deleting from Inventory');

    let items = req.body.items;

    InventoryModel.deleteMany({ sku: { $in: items } })

      .then(() => {
        InventoryModel.find({})
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
