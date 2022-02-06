//Date ex Wednesday January 5, 2022
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
  let formattedDate = `${weekday} ${month} ${date}, ${year}`;

  return formattedDate;
}

//Time ex. 14:57
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

//Access to openweathermap via city name
function defaultCity(city) {
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentInfo);
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
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

//Current weather data in ºC
function displayCurrentInfo(response) {
  console.log(response.data);
  document.querySelector("#city").innerHTML = response.data.name.toUpperCase();
  document.querySelector("#current-date").innerHTML = formatDate(
    (response.data.dt + response.data.timezone) * 1000
  );
  document.querySelector("#current-time").innerHTML = formatTime(
    (response.data.dt + response.data.timezone) * 1000
  );

  //Temps
  document.querySelector("#description").innerHTML =
    `${response.data.weather[0].description}`.toUpperCase();
  document.querySelector("#temp").innerHTML = `${Math.round(
    response.data.main.temp
  )}ºC`;
  document.querySelector("#feels-like-temp").innerHTML = `${Math.round(
    response.data.main.feels_like
  )}ºC`;

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
}

let inputtedCity = document.querySelector("#search-form");
inputtedCity.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector("#my-location");
currentLocationButton.addEventListener("click", getCurrentPosition);

let apiKey = `0db5aea5f51b643e130f4d71ecc51fa1`;
let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;

defaultCity("Toronto");