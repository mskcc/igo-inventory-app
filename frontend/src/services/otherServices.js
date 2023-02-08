import axios from 'axios';
import { BACKEND } from '../configs/config';

// // Check for authorization error
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response) {
//       error.payload = error.response.data;
//       if (error.response.status === 401) {
//         // Automatically redirect client to the login page
//         window.location.href = `${AUTH_URL}/${HOME_PAGE_PATH}`;
//       }
//     }
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

// SORT ORDER

const parseResp = (resp) => {
  const data = resp.data || {};
  const contents = data.data || {};
  return contents;
};

export function getRuns() {
  return axios
    .get(`${BACKEND}/api/otherinventory/inventory`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Inventory: ' + error.response.data.message);
      throw 'Unable to get Get Inventory: ' + error.response.data.message;
    });
}

export function saveTable(data) {
  return axios
    .post(`${BACKEND}/api/otherinventory/save`, { data })
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to save Inventory: ' + error.response.data.message);
      throw 'Unable to save Inventory: ' + error.response.data.message;
    });
}

export function deleteItems(items) {
  console.log(items);
  
  return axios
    .post(`${BACKEND}/api/otherinventory/deleteItems`, { items })
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Inventory: ' + error.response.data.message);
      throw 'Unable to get Get Inventory: ' + error.response.data.message;
    });
}

export function removeOneFromInventory(sku) {
  return axios
    .post(`${BACKEND}/api/otherinventory/remove?sku=${sku}`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to remove from Inventory: ' + error.response.data.message);
      throw 'Unable to remove from Inventory: ' + error.response.data.message;
    });
}

export function deleteInventory() {
  return axios
    .post(`${BACKEND}/api/otherinventory/deleteAll`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to delete Inventory: ' + error.response.data.message);
      throw 'Unable to delete Inventory: ' + error.response.data.message;
    });
}
