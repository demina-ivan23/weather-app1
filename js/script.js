"7dd0cd7a02bf44ed937131143232910"
let weater = {
  apiKey: window.localStorage.getItem('apiKey')
}
const fetchCity = (request) => {
  const ukrainianCities = [
    { id: 1, name: "Kyiv" },
    { id: 2, name: "Kharkiv" },
    { id: 3, name: "Dnipro" },
    { id: 4, name: "Odesa" },
    { id: 5, name: "Lviv" },
    { id: 6, name: "Donetsk" },
    { id: 7, name: "Zaporizhzhia" },
    { id: 8, name: "Kirovograd" },
    { id: 9, name: "Mykolaiv" },
    { id: 10, name: "Sumy" },
    { id: 11, name: "Luhansk" },
    { id: 12, name: "Vinnytsia" },
    { id: 13, name: "Poltava" },
    { id: 14, name: "Chernihiv" },
    { id: 15, name: "Cherkasy" },
    { id: 16, name: "Kherson" },
    { id: 17, name: "Zhytomyr" },
    { id: 18, name: "Ternopil" },
    { id: 19, name: "Rivne" },
    { id: 20, name: "Ivanofrankivsk" },
    { id: 21, name: "Uzhhorod" },
    { id: 22, name: "Lutsk" },
  ];
  const matchingItems = [];

  for (let item of ukrainianCities) {
    if (item.name.includes(request)) {
      matchingItems.push(item);
      console.log('Match found');
    }
  }

  return matchingItems;
}
const fillCityList = (list) => {
  const listContainer = document.getElementsByClassName('city-list')[0]
  listContainer.innerHTML = ""
  for (let item of list) {
    const newCityItem = document.createElement("div");
    newCityItem.classList = "city-item"
    newCityItem.innerText = item.name

    newCityItem.addEventListener('click', () => {
      //   window.localStorage("city", city)
      console.log('You have clicked on ' + item.name)


      window.localStorage.setItem('city', JSON.stringify(item));
    })
    listContainer.appendChild(newCityItem);
  }
}

const searchForCity = () => {
  const searchButton = document.getElementById('city-search-button')
  const typedCity = document.getElementById("cityRequestName")
  searchButton.addEventListener('click', function () {
    console.log('searching began')
    fillCityList(fetchCity(typedCity.value))

  })
}

const getCity = () => {
  let city = window.localStorage.getItem("city");
  console.log(JSON.parse(city))
  if (city === null) {
    console.log('city is null')
    document.getElementById('askCity').classList.remove('hidden');
    console.log(document.getElementById('askCity'))
    searchForCity();
  }
}

const getWeatherData = (object) => {

  fetch("https://api.weatherapi.com/v1/forecast.json?key=" + weater.apiKey + "&q=" + object.name + "&days=14")
    .then(response => {
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse the JSON response and return it as a JavaScript object
      return response.json();
    })
    .then(data => {
      // Now 'data' contains the JavaScript object
      console.log(data);
      const currentWeatherData = {
        location: {
          name: data.location.name,
          country: data.location.country,
          localtime: data.location.localtime,
          localtime_epoch: data.location.localtime_epoch,
          region: data.location.region
        },
        current: {
          condition: {
            text: data.current.condition.text,
            icon: data.current.condition.icon
          },
          uv: data.current.uv,
          last_updated_epoch: data.current.last_updated_epoch,
          last_updated: data.current.last_updated,
          temp_c: data.current.temp_c,
          feelslike_c: data.current.feelslike_c,
          is_day: data.current.is_day,
          wind_kph: data.current.wind_kph,
          humidity: data.current.humidity
        },
        
      }
      console.log(currentWeatherData.location.name)
      function removeSubstring(inputString, substringToRemove) {
        // Use the replace method to replace the substring with an empty string
        const modifiedString = inputString.replace(substringToRemove, '');
        
        return modifiedString;
      }
      function getDayOfWeekFromDate(dateString) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
        return daysOfWeek[dayOfWeek];
      }
      document.querySelector('.currentTemperature').innerText = currentWeatherData.current.temp_c + "C";
      document.querySelector('.currentConditionText').innerText = currentWeatherData.current.condition.text
      document.querySelector('.weatherCityName').innerText = currentWeatherData.location.name
      document.querySelector('.temperatureFeelslike').innerText = currentWeatherData.current.temp_c + "c, feels like " + currentWeatherData.current.feelslike_c + "c";
      document.querySelector('.currentDayOfWeek').innerText = getDayOfWeekFromDate(currentWeatherData.current.last_updated); 
      document.querySelector('.currentConditionIconImg').src = currentWeatherData.current.condition.icon;
      document.querySelector('.currentHumidity').innerText = "Currenr humidity: " + currentWeatherData.current.humidity + "%";
      document.querySelector('.currentUV').innerText = "Current UV: " + currentWeatherData.current.uv;
      document.querySelector('.currentWindspeed').innerText = "Current windspeed: " + currentWeatherData.current.wind_kph + " kph";
      let forecast = [];
      for (let i = 0; i < 7; i++) {
        forecast[i] = data.forecast.forecastday[i]
        console.log(forecast[i].date);
        if(forecast[i] === forecast[0]){
          document.querySelector('#forecastDay' + i + ' .forecastDate').innerText = 'Today';
        }
        else{

          document.querySelector('#forecastDay' + i + ' .forecastDate').innerText = getDayOfWeekFromDate(forecast[i].date);
        }
        document.querySelector('#forecastDay' + i + ' .forecastHumidity').innerText = " " + forecast[i].day.avghumidity + '%';
        document.querySelector('#forecastDay' + i + ' .forecastConditionIcon').src = forecast[i].day.condition.icon;
        document.querySelector('#forecastDay' + i + ' .forecastMaxMinTemperature').innerText = forecast[i].day.maxtemp_c + 'C/ ' + forecast[i].day.mintemp_c + 'C ';
      }
      document.querySelector('.dayForecastUV').innerText = "Avg. UV: " + forecast[0].day.uv;
      document.querySelector('.dayForecastAverageHumidity').innerText = "Avg. humidity: " + forecast[0].day.avghumidity + '%';
      document.querySelector('.dayForecastMaxWind').innerText = "Max wind: " + forecast[0].day.maxwind_kph + " kph";
      document.querySelector('.dayForecastSunrise').innerText = 'Sunrise at ' + forecast[0].astro.sunrise;
      document.querySelector('.dayForecastSunset').innerText =  'Sunset at ' + forecast[0].astro.sunset;
      for (let i = 0; i < 24; i++) {
        document.querySelector('#horizontalScrollingItem' + i + ' .dayForecastHour').innerText = removeSubstring(forecast[0].hour[i].time, forecast[0].date)
        document.querySelector('#horizontalScrollingItem' + i + ' .dayForecastConditionIcon').src = forecast[0].hour[i].condition.icon;
        document.querySelector('#horizontalScrollingItem' + i + ' .dayForecastTemperature').innerText = forecast[0].hour[i].temp_c  + 'C';
        document.querySelector('#horizontalScrollingItem' + i + ' .dayForecastHumidity').innerText = forecast[0].hour[i].humidity + '%'
      }
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
const getApiKey = () => {
  document.querySelector('.apiKeySubmit').addEventListener('click', () => {
    let apiKeyInput = document.querySelector('.apiKeyInput').value
    apiKeyInput = apiKeyInput.trim();
    if (apiKeyInput === ''){
    alert('Please type your api key into the input field');
    }
    else{
      window.localStorage.setItem('apiKey', apiKeyInput)
      location.reload();
    }
  })
  let apiKey = window.localStorage.getItem('apiKey');
  if(apiKey === null){
    document.querySelector('.requestApiKey').classList.remove('hidden');
  }
}
(() => {
  getApiKey();
  getCity();
  let city = JSON.parse(window.localStorage.getItem("city"));
  window.setInterval(getWeatherData(city), 300000);
})()

