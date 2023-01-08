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

function changeTempEtc(response) {
  console.log(response.data.current.temp);
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
}
function getTempData() {
  axios
    .get(`${oneCallUrl}?lat=48.8&lon=2.32&appid=${apiKey}&units=${units}`)
    .then(changeTempEtc);
}

function defineLatLon(response) {
  lat = response.data[0].lat;
  lon = response.data[0].lon;
  console.log(lat);
  console.log(lon);
  //run api to get tempdata etc
  getTempData();
}

//changes city name in header and runs defineLatLon
function changeCity(event) {
  event.preventDefault();
  currentCity = document.querySelector("#current-city");
  let cityInput = document.querySelector("#city-input");
  currentCity.innerHTML = `${cityInput.value}`;
  chosenCity = cityInput.value;
  axios.get(`${geoUrl}?q=${chosenCity}&appid=${apiKey}`).then(defineLatLon);
}

//getting weather data from API
let geoUrl = "http://api.openweathermap.org/geo/1.0/direct";
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

// runs changeCity when the button is clicked
let chosenCity = document.querySelector("#change-city");
chosenCity.addEventListener("submit", changeCity);
