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

function createForecastGrid(response) {
  let dailyData = response.data.daily;
  console.log(dailyData[0].temp.day);
  let forecastHTML = ``;
  let forecastGrid = document.querySelector(".weekly-forecast-grid");
  for (let i = 0; i < 7; i++) {
    let forecastIcon = dailyData[i].weather[0].icon;
    let forecastDesc = dailyData[i].weather[0].description;
    let forecastTemp = dailyData[i].temp.day;
    forecastHTML += `<div class="grid${i}">${eval(
      "day" + i
    )}</div></br><div class="gridResponse">${forecastTemp}ºC</div></br><img class="forecast-icon" src="https://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="forecast icon"/><div class="forecast-description">${forecastDesc}</div>`;
  }
  forecastGrid.innerHTML = forecastHTML;
}

function changeCityCurrent(response) {
  currentCity = document.querySelector("#current-city");
  let cityInputCurrent = response.data[0].name;
  currentCity.innerHTML = cityInputCurrent;
  changeTempEtc();
}

function changeCityAndTempCurrent() {
  // gets city name from lat lon and runs fn changeCityCurrent
  axios
    .get(
      `${reverseGeoUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`
    )
    .then(changeCityCurrent);
  //runs fn getTempData
  getTempData();
}
function findCurrentLatLon(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  changeCityAndTempCurrent();
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
/* I don`t think I need this function any more
function changeAirQual() {
  axios
    .get(`${apiAirQualUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(changeAirQualDesc);
}*/

function changeCity() {
  currentCity = document.querySelector("#current-city");
  let cityInput = document.querySelector("#city-input");
  currentCity.innerHTML = `${cityInput.value}`;
  return cityInput.value;
}

function changeTempEtc(response) {
  responseTemp = response.data.current.temp;
  currentTempMain.innerHTML = Math.round(responseTemp);
  currentTempHeader.innerHTML = ` ${Math.round(responseTemp)}`;
  realFeelHeader.innerHTML = Math.round(response.data.current.feels_like);

  //changes temp units
  if (units === "metric") {
    currentUnits.innerHTML = "ºC";
  } else currentUnits.innerHTML = "ºF";

  //changes wind speed
  if (units === "metric") {
    windSpeed.innerHTML = `Wind Speed: ${Math.round(
      response.data.current.wind_speed
    )}m/s`;
  } else
    windSpeed.innerHTML = `Wind Speed: ${Math.round(
      response.data.current.wind_speed
    )}mph`;

  //changes humidity
  humidity.innerHTML = `Humidity: ${response.data.current.humidity}%`;
  //changes description
  currentDescr.innerHTML = response.data.current.weather[0].description;

  //changes icon and alt
  currentIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute(
    "alt",
    `${response.data.current.weather[0].description}`
  );

  //gets air qual data and runs changeAirQualDesc
  axios
    .get(`${apiAirQualUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(changeAirQualDesc);

  // loads 7 day forecast
  createForecastGrid(response);
}

function getTempData() {
  axios
    .get(
      `${oneCallUrl}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`
    )
    .then(changeTempEtc);
}
function defineLatLon(response) {
  lat = response.data[0].lat;
  lon = response.data[0].lon;

  //run api to get tempdata etc
  getTempData();
}

function changeCityAndTemp(event) {
  event.preventDefault();
  // runs fn changeCity
  changeCity();
  let chosenCity = changeCity();
  axios.get(`${geoUrl}?q=${chosenCity}&appid=${apiKey}`).then(defineLatLon);
}

function loadMirafloresData() {
  lat = -12.11788;
  lon = -77.033043;
  getTempData();
}

//defining forecast days
let now = new Date();
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

let day0 = days[now.getDay()];
let day1 = days[(now.getDay() + 1) % 7];
let day2 = days[(now.getDay() + 2) % 7];
let day3 = days[(now.getDay() + 3) % 7];
let day4 = days[(now.getDay() + 4) % 7];
let day5 = days[(now.getDay() + 5) % 7];
let day6 = days[(now.getDay() + 6) % 7];

//getting weather data from API
let geoUrl = "https://api.openweathermap.org/geo/1.0/direct";
let reverseGeoUrl = "http://api.openweathermap.org/geo/1.0/reverse";
let oneCallUrl = "https://api.openweathermap.org/data/3.0/onecall";
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

window.addEventListener("load", displayTimeAndDate(), loadMirafloresData());

let chosenCity = document.querySelector("#change-city");
chosenCity.addEventListener("submit", changeCityAndTemp);

let geoButton = document.querySelector("#geo-button");
geoButton.addEventListener("click", getCurrentPosition);

let fahrenheitTemp = document.querySelector("#fahrenheit-link");
fahrenheitTemp.addEventListener("click", convToF);

let celsiusTemp = document.querySelector("#celsius-link");
celsiusTemp.addEventListener("click", convToC);
