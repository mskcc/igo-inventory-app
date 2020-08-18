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
  console.log('what');

  return axios
    .get(`${BACKEND}/api/inventory/inventory`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Inventory: ' + error.message);
    });
}

export function saveTable(data) {
  return axios
    .post(`${BACKEND}/api/inventory/save`, { data })
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Inventory: ' + error.message);
    });
}

export function deleteItems(items) {
  return axios
    .post(`${BACKEND}/api/inventory/deleteItems`, { items })
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Inventory: ' + error.message);
    });
}
