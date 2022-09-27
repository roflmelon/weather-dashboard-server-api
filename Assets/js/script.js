import cityList from './city.list.json' assert { type: 'json' };
let form = $('#submit-form');
let searchInput = $('#search');

function search(event) {
  event.preventDefault();
  let input = event.target[0].value;
  console.log(input);

  console.log(cityList);
  //   console.log(country);
  let apiKey = '9d958ab6b111a198ae00aab196b2c850';
  let apiUrl =
    'api.openweathermap.org/data/2.5/forecast?id={city ID}&appid={API key}';
}
//----------------------------------------auto suggest
$('#search').autocomplete(
  { source: ['hello world'] },
  { minLength: 2, autoFocus: true }
);
form.on('submit', search);

/*
need:
-5 days
-city
-temp
-wind
-himidity
-icon of weather
-localstorage of 10 history
*/
