const axios = require('axios');
const https = require('https');

const { logger } = require('../helpers/winston');

const LIMS_AUTH = {
  username: process.env.LIMS_USER,
  password: process.env.LIMS_PASSWORD,
};
const LIMS_URL = process.env.LIMS_URL;

const AXIOS_TIMEOUT = parseInt(process.env.AXIOS_TIMEOUT);

// LIMS is authorized. Avoids certificate verification & "unable to verify the first certificate in nodejs" errors
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosConfig = {
  timeout: AXIOS_TIMEOUT,
  httpsAgent: agent,
};

/**
 *
 * Get Runs from LIMS
 */
exports.getRuns = () => {
  const url = `${LIMS_URL}/planRuns?user=status_board`;
  logger.log('info', `Sending request to ${url}`);
  return axios
    .get(url, {
      auth: { ...LIMS_AUTH },
      ...axiosConfig,
    })
    .then((resp) => {
      logger.log('info', `Successfully retrieved response from ${url}`);
      return resp;
    })
    .catch((error) => {
      logger.log('info', `Error retrieving response from ${url}`);
      throw error;
    })
    .then((resp) => {
      return resp;
    });
};
