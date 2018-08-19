"use strict";

let input = document.getElementById('field');
let btnGo = document.getElementById('go');
let btnLoc = document.getElementById('location');
let btnClear = document.getElementById('clear');
let inputData;
let responseData;

const API_ENDPOINT = 'http://api.nestoria.co.uk/';

/////////////////////////////////////////////////

let checkStatus = function(response) {
  if (response.status !== 200) {
    return Promise.reject(new Error(response.statusText));
  }
  return Promise.resolve(response);
};

let parseJson = function (response) {
  return response.json();
};

/////////////////////////////////////////////////

function getInputValue() {
  inputData = input.value;
  input.value = '';
}

function getCity(event) {
  event.preventDefault();
  getInputValue();
  getRequest(API_ENDPOINT, inputData);
}

function getRequest(requestUrl, requestData) {
  fetch(`${requestUrl}api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=${requestData}`, {
    method: 'get',
  })
    .then(checkStatus)
    .then(parseJson)
    .then(function(data) {
      responseData = data;
      console.log('This is JSON data - ', responseData);
      // addLocalStorage(inputData, responseData.response);

      let responseObj = responseData.response;

      console.log(inputData);
      let resultOutput = {
        'location': inputData,
        'houses': responseData.response.listings
      };
      console.log(resultOutput);

      getResults(responseObj.listings);
    })
    .catch(function(err) {
      console.log('This is ERROR - ', err);
    });
  return responseData;
}

// input.addEventListener('keyup', getInputValue);
btnGo.addEventListener('click', getCity);




function getResults(requestObj) {
  for(let resultKey in requestObj) {
    let requestOutput = requestObj[resultKey];
    console.log(requestOutput);
  }
}




//LocalStorage section ////////////////////////////////

function addLocalStorage(key, value) {
  let dataStr = JSON.stringify(value);
  try {
    localStorage.setItem(key, dataStr);
  } catch (state) {
    if (state == QUOTA_EXCEEDED_ERR) {
      alert('sorry, but localStorage limit is exceeded');
    }
  }
}

function setStorage() {
  getInputValue();
  addLocalStorage(inputData, 'some value');
  return false;
}

btnLoc.addEventListener('click', setStorage);
btnClear.addEventListener('click', function() {localStorage.clear()});

