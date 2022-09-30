//------------------------------------------getting the dom nodes
let form = $('#submit-form');
let searchInput = $('#search');
let displayMsg = $('#display-msg');
//-----------------------------------------variables
let countryObj;
let countryList = [];
let city;
let apiKey = '9d958ab6b111a198ae00aab196b2c850';
//-----------------------------------------functions
function search(event) {
  //prevent refresh
  event.preventDefault();
  let inputCountry = event.target[0].value.trim();
  let inputCity = event.target[1].value.trim();
  if (inputCountry === '' || inputCity === '') {
    alert('Please fill out all the required forms');
  } else {
    for (let i = 0; i < countryObj.length; i++) {
      if (
        inputCountry.toLowerCase().includes(countryObj[i].Name.toLowerCase())
      ) {
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity},${countryObj[i].Code}&appid=${apiKey}`;

        getWeather(apiUrl);
      } else if (
        inputCountry.length < 3 &&
        countryObj[i].Code.toLowerCase() === inputCountry.toLowerCase()
      ) {
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity},${countryObj[i].Code}&appid=${apiKey}`;

        getWeather(apiUrl);
      }
    }
  }
}
//fetch the api
function getWeather(apiUrl) {
  fetch(apiUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then((data) => {
      saveHistory(data);
      displayWeather(data);
    })
    .catch((error) => {
      displayUserMsg(error + ' City/Country Not Found!');
    });
}
// saves the recent search history, saves up to 10 result
function saveHistory(data) {
  let historyArray = [];
  let searchHistory = { name: data.city.name, country: data.city.country };
  //pushes search if localstorage is empty/null
  if (localStorage.getItem('search-history') === null) {
    historyArray.push(searchHistory);
    localStorage.setItem('search-history', JSON.stringify(historyArray));
    displaySearchHistory();
  } else {
    historyArray = JSON.parse(localStorage.getItem('search-history'));
    //finds if search history already exists in the localStorage, if so, it does nothing. if not it will push to localStorage
    if (!historyArray.find(matchObj)) {
      //check if localStorage already has 10 items, if not then simply push to localStorage. If more than 10 then it removes the first search history in the array and pushes new one.
      if (historyArray.length < 10) {
        console.log('less than limit of 10, pushing to array');
        historyArray.push(searchHistory);
        localStorage.setItem('search-history', JSON.stringify(historyArray));
        displayUserMsg('Found!');
        displaySearchHistory();
        return;
      } else {
        console.log('limit of 10 hit, removing first element of array');
        historyArray.shift();
        historyArray.push(searchHistory);
        localStorage.setItem('search-history', JSON.stringify(historyArray));
        displayUserMsg('Found!');
        displaySearchHistory();
        return;
      }
    } else {
      displayUserMsg('Already Exist in Search History');
    }
    //check if search history matching function
    function matchObj(element) {
      if (
        element.name === searchHistory.name &&
        element.country === searchHistory.country
      ) {
        return true;
      }
      return false;
    }
  }
}
function displayWeather() {}
function displaySearchHistory() {}
//displays error message on screen
function displayUserMsg(msg) {
  displayMsg.text(msg);
}

//----------------------------------------autocomplete
//country codes and it's names
$.getJSON(
  'https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json',
  function (result) {
    countryObj = result;
    for (let i = 0; i < result.length; i++) {
      countryList.push(result[i].Code + ' - ' + result[i].Name);
    }
  }
);
//autocomplete takes 2 obj params, 1: for source of list to populate 2:settings
$('#search-country').autocomplete(
  { source: countryList },
  //minLength is for number of char that is required to pop out the autocomplete
  // autofocus is for auto selecting the first result that pops up
  { minLength: 2, autoFocus: true }
);
//------------------------------------eventlisteners
form.on('submit', search);

/*
need:
-5 days
-city
-temp
-wind
-himidity
-icon of weather
*/
