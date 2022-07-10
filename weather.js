const todayTemp = document.getElementById('todayTemp');
const todayDesc = document.getElementById('todayDesc');
const todayWeatherIcon = document.getElementById('todayWeatherIcon');
const city = document.getElementById('city');
const country = document.getElementById('country');
const weatherItem = document.getElementById('weather-item');
const hourlyForecast = document.getElementById('hourly-forecast');
const futureForecast = document.getElementById('future-forecast');
const weathImageBase = "http://openweathermap.org/img/wn/";

const APIKey = 'bec6effb3cf245d9a94b9705d546986c';

// init the local date time
document.getElementById('todayWeekDate').innerHTML = moment().format('dddd');
document.getElementById('todayDateTime').innerHTML = moment().format('h:mm a');
document.getElementById('todayDate').innerHTML = moment().format('Do MMMM');

//check if broswer supports geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "Location not available"
};

//set user's position
function setPosition(position) {
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    getWeather(latitude, longitude);
};

function showError() {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "Location not available"
};

//search button change
var btn = document.getElementById('btn');
btn.addEventListener("click", function () {
    this.style.color = "green";
    let searchCity = document.getElementById('searchCity').value;
    getWeather("", "", searchCity);
})

//get current info from API
function getWeather(latitude = "", longitude = "", cityName = "") {
    let api = `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${APIKey}`;
    if (cityName != "" || cityName != "undefined") {
        api = api + "&q=" + cityName;
    } 
    if (latitude != "" || latitude != "undefined" || longitude != "" || latitude != "undefined") {
        api = api + "&lat=" + latitude + "&lon=" + longitude;
    }
    fetch(api).then((response) => {
        let data = response.json();
        return data;
    })
        .then(function (data) {
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            displayCurrentWeather(data);
            getForecastWeather(longitude, latitude);
        });
}

function displayCurrentWeather(data) {
    city.innerHTML = data.name;
    country.innerHTML = data.sys.country;
    todayDesc.innerHTML = data.weather[0].description;
    const weatherIcon = weathImageBase + data.weather[0].icon + ".png";
    todayWeatherIcon.src = weatherIcon;
    let temp_f = data.main.temp;
    let temp_c = Math.floor((temp_f - 32) / 1.8);
    todayTemp.innerHTML = temp_c + "&#176; C";
    humidity.innerHTML = data.main.humidity + "%";
    pressure.innerHTML = data.main.pressure;
    windspeed.innerHTML = data.wind.speed;
    let sunrise = data.sys.sunrise;
    let sunset = data.sys.sunset;
    sunriseTime.innerHTML = moment(sunrise * 1000).format('h:mm a');
    sunsetTime.innerHTML = moment(sunset * 1000).format('h:mm a');
}

var todayWeekDate = document.getElementById('todayWeekDate');
todayWeekDate.addEventListener("mouseover", function () {
    this.innerText = "Today";
});

//get today forecast from API
function getForecastWeather(longitude, latitude) {
    let api = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely&appid=${APIKey}`;
    fetch(api).then((response) => {
        let data = response.json();
        return data;
    })
        .then(function (data) {
            let WeatherHourlyList = data.hourly;
            let WeatherDailyList = data.daily;
            displayTodayForecastWeather(WeatherHourlyList);
            displayNextFiveDaysWeather(WeatherDailyList);
        });
}

// loop though all weatherlist and pick the recent 3 time slot weathers after now
function displayTodayForecastWeather(list) {
    let counter = 1;
    list.forEach(el => {
        // convert unit timestamp to datetime
        dateTime = new Date(el.dt * 1000);
        if (counter <= 3) {
            document.getElementById('todayTemp' + counter).innerHTML = el.temp + "&#176; C";
            document.getElementById('todayWeatherIcon' + counter).src = weathImageBase + el.weather[0].icon + ".png";
            document.getElementById('todayTime' + counter).innerHTML = moment(dateTime.getTime()).format('h:mm a');
            counter++;
        }
    });
}

function displayNextFiveDaysWeather(list) {
    let counter = 1;
    list.forEach(function (el, i) {
        if (i == 0) {
            return;
        }
        // convert unit timestamp to datetime
        dateTime = new Date(el.dt * 1000);
        if (counter <= 5) {
            document.getElementById('futureDay' + counter).innerHTML = moment(dateTime.getTime()).format('dddd');
            document.getElementById('futureDate' + counter).innerHTML = moment(dateTime.getTime()).format('D/M');
            document.getElementById('futureDayIcon' + counter).src = weathImageBase + el.weather[0].icon + ".png";
            document.getElementById('futureDayTemp' + counter).innerHTML = "Day" + "  " + el.temp.day + "&#176; C";
            document.getElementById('futureNightTemp' + counter).innerHTML = "Night" + "  " + el.temp.night + "&#176; C";
            counter++;
        }
    });
}