function displayTimeAndDate() {
  let now = new Date();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  let hours = now.getHours();
  let mins = now.getMinutes();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  function displayHoursProperly() {
    if (hours < 10) hours = `0${hours}`;
  }
  displayHoursProperly();
  function displayMinsProperly() {
    if (mins < 10) mins = `0${mins}`;
  }
  displayMinsProperly();

  function displayCurrentTime() {
    let smallTime = document.querySelector("#small-time");
    let formattedDate = `${day}, ${month}, ${date}, ${hours}:${mins}, ${year}`;
    smallTime.innerHTML = formattedDate;
  }
  displayCurrentTime();
}

function findCurrentLatLon(position) {
  lat1 = position.coords.latitude;
  lon1 = position.coords.longitude;
  console.log(lat1);
  console.log(lon1);
}
function getCurrentPosition(event) {
  event.preventDefault;
  navigator.geolocation.getCurrentPosition(findCurrentLatLon);
}

function convToF(event) {
  event.preventDefault;
  if (responseTemp !== null) {
    responseTempF = Math.round(((responseTemp + 40) * 9) / 5 - 40);
    currentTempMain.innerHTML = responseTempF;
  } else {
    currentTempMain.innerHTML = Math.round(
      ((currentTempMain + 40) * 9) / 5 - 40
    );
  }
}

function convToC(event) {
  event.preventDefault;
  if (responseTemp !== null) {
    currentTempMain.innerHTML = Math.round(responseTemp);
  } else {
    currentTempMain.innerHTML = currentTempMain;
  }
}

function airQual(val) {
  if (val === 1) {
    return "Good";
  }
  if (val === 2) {
    return "Fair";
  }
  if (val === 3) {
    return "Moderate";
  }
  if (val === 4) {
    return "Poor";
  }
  if (val === 5) {
    return "Very Poor";
  }
}

function changeAirQualDesc(response) {
  let airQualityIndex = response.data.list[0].main.aqi;
  let airQualityIndex2 = airQual(airQualityIndex);
  newAirQuality.innerHTML = `Air Quality: ${airQualityIndex2}`;
}
function changeAirQual() {
  axios
    .get(`${apiAirQualUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(changeAirQualDesc);
}

function changeCity() {
  currentCity = document.querySelector("#current-city");
  let cityInput = document.querySelector("#city-input");
  currentCity.innerHTML = `${cityInput.value}`;
  return cityInput.value;
}

function changeTemp(response) {
  //changes temp fig
  responseTemp = response.data.main.temp;
  currentTempMain.innerHTML = Math.round(responseTemp);
  currentTempHeader.innerHTML = ` ${Math.round(responseTemp)}`;
  realFeelHeader.innerHTML = Math.round(response.data.main.feels_like);

  //changes temp units

  if (units === "metric") {
    currentUnits.innerHTML = "ºC";
  } else currentUnits.innerHTML = "ºF";

  //changes wind speed
  if (units === "metric") {
    windSpeed.innerHTML = `Wind Speed: ${Math.round(
      response.data.wind.speed
    )}m/s`;
  } else
    windSpeed.innerHTML = `Wind Speed: ${Math.round(
      response.data.wind.speed
    )}mph`;

  //changes humidity
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  //changes description
  currentDescr.innerHTML = response.data.weather[0].description;

  //changes icon and alt
  currentIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute("alt", `${response.data.weather[0].description}`);

  //finds lat and lon and runs changeAirQual
  lat = response.data.coord.lat;
  lon = response.data.coord.lon;
  changeAirQual();
}

function changeCityAndTemp(event) {
  event.preventDefault();
  // runs fn changeCity
  changeCity();
  let chosenCity = changeCity();

  //runs fn changeTemp (changes temp, wind speed, humidity, description, icon)
  axios
    .get(`${apiUrl}?q=${chosenCity}&appid=${apiKey}&units=${units}`)
    .then(changeTemp);
}
//getting weather data from API
let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
let apiAirQualUrl = "https://api.openweathermap.org/data/2.5/air_pollution";
let apiKey = "8f909eb8beff1d1a0ae8b2df17dab17d";
let units = "metric";

let currentTempMain = document.querySelector("#current-temp-main");
let currentTempHeader = document.querySelector("#current-temp-header");
let realFeelHeader = document.querySelector("#rFtemperature");
let newAirQuality = document.querySelector("#air-quality");
let currentUnits = document.querySelector("#current-units");
let windSpeed = document.querySelector("#wind-speed");
let humidity = document.querySelector("#humidity");
let currentIcon = document.querySelector("#icon");
let currentDescr = document.querySelector(".desc-of-weather");

let chosenCity = document.querySelector("#change-city");
chosenCity.addEventListener("submit", changeCityAndTemp);

let fahrenheitTemp = document.querySelector("#fahrenheit-link");
fahrenheitTemp.addEventListener("click", convToF);

let celsiusTemp = document.querySelector("#celsius-link");
celsiusTemp.addEventListener("click", convToC);

let geoButton = document.querySelector("#geo-button");
geoButton.addEventListener("click", getCurrentPosition);

let dt = Date.now();
console.log(dt);

// 5 day forecast
function forecastTemp(response) {
  let todayTemp = response.data.list[0].main.humidity; //today's forecast data
  console.log(todayTemp);
}
axios
  .get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=51.5&lon=0.127&cnt=7&appid=${apiKey}`
  )
  .then(forecastTemp);
