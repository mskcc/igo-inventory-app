const winston = require('winston');
const { constants } = require('./constants');

/**
 * Configures winston logger for application
 */
const container = new winston.Container();
const { format } = winston;
const { combine, label, json, timestamp } = format;
container.add(constants.logger, {
  format: combine(
    label({ label: 'Sample-Sub' }), // Added to log lines, e.g. { ..., "label":"App-Template"}
    timestamp(),
    json()
  ),
  // "error" will always be logged to console

  transports: [new winston.transports.Console({ level: 'info' })],
});

exports.logger = container.get(constants.logger);
