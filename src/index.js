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

function changeAirQual(response) {
  let newAirQuality = document.querySelector("#air-quality");
  let airQualityIndex = response.data.list[0].main.aqi;
  let airQualityIndex2 = airQual(airQualityIndex);
  newAirQuality.innerHTML = `Air Quality: ${airQualityIndex2}`;
}

function changeCity() {
  currentCity = document.querySelector("#current-city");
  let cityInput = document.querySelector("#city-input");
  currentCity.innerHTML = `${cityInput.value}`;
  return cityInput.value;
}

function changeTemp(response) {
  //changes temp fig
  let currentTempMain = document.querySelector("#current-temp-main");
  currentTempMain.innerHTML = Math.round(response.data.main.temp);
  let currentTempHeader = document.querySelector("#current-temp-header");
  currentTempHeader.innerHTML = Math.round(response.data.main.temp);
  let realFeelHeader = document.querySelector("#rFtemperature");
  realFeelHeader.innerHTML = Math.round(response.data.main.feels_like);

  //changes temp units
  let currentUnits = document.querySelector("#current-units");
  if (units === "metric") {
    currentUnits.innerHTML = "ºC";
  } else currentUnits.innerHTML = "ºF";

  //changes wind speed
  let windSpeed = document.querySelector("#wind-speed");
  if (units === "metric") {
    windSpeed.innerHTML = `Wind Speed: ${Math.round(
      response.data.wind.speed
    )}m/s`;
  } else
    windSpeed.innerHTML = `Wind Speed: ${Math.round(
      response.data.wind.speed
    )}mph`;

  //changes humidity
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;

  //changes description
  let currentDescr = document.querySelector(".desc-of-weather");
  currentDescr.innerHTML = response.data.weather[0].description;

  //changes icon and alt
  let currentIcon = document.querySelector("#icon");
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute("alt", `${response.data.weather[0].description}`);

  //finds lat and lon and runs changeAirQual
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  axios
    .get(`${apiAirQualUrl}?lat=${lat}lon=${lon}&appid=${apiKey}`)
    .then(changeAirQual);
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
let apiAirQualUrl = "http://api.openweathermap.org/data/2.5/air_pollution";
let apiKey = "8f909eb8beff1d1a0ae8b2df17dab17d";
let units = "metric";

let chosenCity = document.querySelector("#change-city");
chosenCity.addEventListener("submit", changeCityAndTemp);
