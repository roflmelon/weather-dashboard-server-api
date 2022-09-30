//------------------------------------------getting the dom nodes
let form = $('#submit-form');
let searchInput = $('#search');
let displayMsg = $('#display-msg');
let todayDate = $('#today-date');
let firstDay = $('#first-day');
let secondDay = $('#second-day');
let thirdDay = $('#third-day');
let fourthDay = $('#fourth-day');
let fifthDay = $('#fifth-day');
//-----------------------------------------variables
let countryObj;
let countryList = [];
let city;
let apiKey = '9d958ab6b111a198ae00aab196b2c850';
let dateTime = luxon.DateTime;
//-----------------------------------------functions
function search(event) {
  //prevent refresh
  event.preventDefault();
  let inputCountry = event.target[0].value.trim();
  let inputCity = event.target[1].value.trim();
  if (inputCountry === '' || inputCity === '') {
    alert('Please fill out all the required forms');
    displayWeather();
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
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity},${countryObj[i].Code}&cnt=48&appid=${apiKey}`;

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
//displays weather
function displayWeather(data) {
  //3 hours per call, 8 calls per day, 40 calls per 5 days
  let date;
  let temp;
  let wind;
  let humidity;
  let icon;
  removeAllPrevious();
  displayToday(data);
  displayFiveDays(data);
}

function removeAllPrevious() {
  $('.card').remove();
}
function displayToday(data) {
  $('<div>')
    .addClass('card today-card')
    .css({ width: '100%', height: 'fit-content' })
    .appendTo('.today-container');
  $('<img>')
    .attr(
      'src',
      `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png`
    )
    .appendTo('.today-card');
  $('<div>').addClass('card-body today-card-body').appendTo('.today-card');
  $('<h5>')
    .addClass('card-title')
    .text(
      data.city.name +
        ': ' +
        dateTime.fromSeconds(data.list[0].dt).setLocale('en-CA').toFormat('DD')
    )
    .appendTo('.today-card-body');
  $('<ul>').addClass('list-elements').appendTo('.today-card-body');
  $('<li>')
    .text('Temperature: ' + Math.round(data.list[0].main.temp - 273.15) + '°C')
    .appendTo('.list-elements');
  $('<li>')
    .text('Wind Speed: ' + data.list[0].wind.speed + ' m/s')
    .appendTo('.list-elements');
  $('<li>')
    .text('Humidity: ' + data.list[0].main.humidity + '%')
    .appendTo('.list-elements');
}
function displayFiveDays(data) {
  for (let i = -1; i < data.list.length; i += 8) {
    if (i >= 0) {
      $('<div>')
        .addClass(`card week-card${i}`)
        .css({ width: '50%', height: 'fit-content' })
        .appendTo('.week-container');
      $('<img>')
        .attr(
          'src',
          `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
        )
        .appendTo(`.week-card${i}`);
      $('<div>')
        .addClass(`card-body week-card-body${i}`)
        .appendTo(`.week-card${i}`);
      $('<h5>')
        .addClass('card-title')
        .text(
          dateTime
            .fromSeconds(data.list[i].dt)
            .setLocale('en-CA')
            .toFormat('DD')
        )
        .appendTo(`.week-card-body${i}`);
      $('<ul>')
        .addClass(`list-elements week-elements${i}`)
        .appendTo(`.week-card-body${i}`);
      $('<li>')
        .text(
          'Temperature: ' + Math.round(data.list[i].main.temp - 273.15) + '°C'
        )
        .appendTo(`.week-elements${i}`);
      $('<li>')
        .text('Wind Speed: ' + data.list[i].wind.speed + ' m/s')
        .appendTo(`.week-elements${i}`);
      $('<li>')
        .text('Humidity: ' + data.list[i].main.humidity + '%')
        .appendTo(`.week-elements${i}`);
    }
  }
}
//display search history buttons
function displaySearchHistory() {
  let searchHistory = JSON.parse(localStorage.getItem('search-history'));
  $('.history-container').empty();
  if (searchHistory !== null) {
    for (let i = 0; i < searchHistory.length; i++) {
      $('<button>')
        .addClass('historyBtn')
        .attr('data-city', searchHistory[i].name)
        .attr('data-country', searchHistory[i].country)
        .text(searchHistory[i].country + ' - ' + searchHistory[i].name)
        .appendTo('.history-container');
    }
  }
}

$('.history-container').on('click', '.historyBtn', (event) => {
  let city = $(event.target).data('city');
  let country = $(event.target).data('country');
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&cnt=48&appid=${apiKey}`;
  getWeather(apiUrl);
});
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
//------------------------------------eventlisteners and invoking functions
displaySearchHistory();
form.on('submit', search);
