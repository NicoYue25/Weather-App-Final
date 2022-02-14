//Current Date ex Wednesday January 5, 2022
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getUTCDate();
  let year = now.getUTCFullYear();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = days[now.getUTCDay()];

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
  let month = months[now.getUTCMonth()];
  let formattedDate = `<br>${weekday} ${month} ${date}, ${year}`;

  return formattedDate;
}

//Current Time ex. 14:57
function formatTime(timestamp) {
  let time = new Date(timestamp);
  let hour = time.getUTCHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = time.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let formattedTime = `${hour}:${minutes}`;

  return formattedTime;
}

//Forecast Days
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return days[day];
}

//Access to openweathermap via city name
function defaultCity(city) {
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentInfo);
  fLink.classList.remove("activeUnit");
  cLink.classList.add("activeUnit");
}

//Access to openweathermap via city name (search option)
function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#location").value;
  defaultCity(city);
}

//Access to openweathermap via lon/Lat coords (My Location option)
function showPosition(position) {
  let apiUrl = `${apiEndpoint}lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentInfo);
  fLink.classList.remove("activeUnit");
  cLink.classList.add("activeUnit");
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

//Access to openwathermap daily forecast
function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//Current weather data in ºC
function displayCurrentInfo(response) {
  document.querySelector("#city").innerHTML = response.data.name.toUpperCase();
  document.querySelector("#current-date").innerHTML = formatDate(
    (response.data.dt + response.data.timezone) * 1000
  );
  document.querySelector("#current-time").innerHTML = formatTime(
    (response.data.dt + response.data.timezone) * 1000
  );

  document
    .querySelector("#current-icon")
    .setAttribute(
      "src",
      `images/WeatherIcons/${response.data.weather[0].icon}.png`
    );

  document
    .querySelector("#weatherPic")
    .setAttribute("src", `images/Pics/${response.data.weather[0].icon}.svg`);

  //temp
  celsiusCurrentTemp = response.data.main.temp;
  celsiusFeelsLike = response.data.main.feels_like;
  document.querySelector("#description").innerHTML =
    `${response.data.weather[0].description}`.toUpperCase();
  document.querySelector("#temp").innerHTML = `${Math.round(
    celsiusCurrentTemp
  )}`;
  document.querySelector("#feels-like-temp").innerHTML = `${Math.round(
    celsiusFeelsLike
  )}`;

  //Additional weather info
  let timeZone = response.data.timezone;

  let sunrise = response.data.sys.sunrise;
  let sunriseDate = new Date((sunrise + timeZone) * 1000);
  let uHours = sunriseDate.getUTCHours();
  let uMinutes = `0${sunriseDate.getUTCMinutes()}`;
  document.querySelector("#sunrise").innerHTML = `${uHours}:${uMinutes.substr(
    -2
  )}`;

  let sunset = response.data.sys.sunset;
  let sunsetDate = new Date((sunset + timeZone) * 1000);
  let dHours = sunsetDate.getUTCHours();
  let dMinutes = `0${sunsetDate.getUTCMinutes()}`;
  document.querySelector("#sunset").innerHTML = `${dHours}:${dMinutes.substr(
    -2
  )}`;

  document.querySelector("#humidity").innerHTML = `${Math.round(
    response.data.main.humidity
  )}%`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    (response.data.wind.speed * 60 * 60) / 1000
  )} km/h`;

  getForecast(response.data.coord);
}

function convertTempF(event) {
  event.preventDefault();
  cLink.classList.remove("activeUnit");
  fLink.classList.add("activeUnit");

  cLink.addEventListener("click", convertTempC);
  fLink.removeEventListener("click", convertTempF);

  let currentTempF = (celsiusCurrentTemp * 9) / 5 + 32;
  document.querySelector("#temp").innerHTML = Math.round(currentTempF);

  let currentFeelF = (celsiusFeelsLike * 9) / 5 + 32;
  document.querySelector("#feels-like-temp").innerHTML =
    Math.round(currentFeelF);

  document.querySelector("#unitCF").innerHTML = "°F";

  let forecastMax = document.querySelectorAll(".high");
  forecastMax.forEach(function (forecast) {
    let currentTemp = forecast.innerHTML;
    forecast.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll(".low");
  forecastMin.forEach(function (forecast) {
    let currentTemp = forecast.innerHTML;
    forecast.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });
}

function convertTempC(event) {
  event.preventDefault();
  fLink.classList.remove("activeUnit");
  cLink.classList.add("activeUnit");

  fLink.addEventListener("click", convertTempF);
  cLink.removeEventListener("click", convertTempC);

  document.querySelector("#temp").innerHTML = Math.round(celsiusCurrentTemp);
  document.querySelector("#feels-like-temp").innerHTML =
    Math.round(celsiusFeelsLike);
  document.querySelector("#unitCF").innerHTML = "°C";

  let forecastMax = document.querySelectorAll(".high");
  forecastMax.forEach(function (forecast) {
    let currentTemp = forecast.innerHTML;
    forecast.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let forecastMin = document.querySelectorAll(".low");
  forecastMin.forEach(function (forecast) {
    let currentTemp = forecast.innerHTML;
    forecast.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <div class="col icons forecastBackground">
      <img src="images/WeatherIcons/${forecastDay.weather[0].icon}.png"/>
      </div>
              <div class="col info forecastBackground">
                <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
                <hr class="stylingHr" />
                <span class="high">${Math.round(
                  forecastDay.temp.max
                )}</span>º | <span class="low">${Math.round(
          forecastDay.temp.min
        )}</span>º
                <br />
                <i class="fa-solid fa-droplet"></i> ${forecastDay.humidity}%
              </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

let apiKey = `0db5aea5f51b643e130f4d71ecc51fa1`;
let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;

let celsiusCurrentTemp = null;
let celsiusFeelsLike = null;

document.querySelector("#search-form").addEventListener("submit", searchCity);
document
  .querySelector("#my-location")
  .addEventListener("click", getCurrentPosition);

let fLink = document.querySelector("#temp-F");
fLink.addEventListener("click", convertTempF);

let cLink = document.querySelector("#temp-C");
cLink.addEventListener("click", convertTempC);

defaultCity("Toronto");
