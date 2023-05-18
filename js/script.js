// API Key Vars

const weatherKey = '632b6159be10915c53139465f83c756e';
const weatherDayMax = 5;

// Event listener to take the inputted text value from the search bar

var locationInputEl = document.querySelector('#location-text')

function newSearch (event) {
    event.preventDefault()
    if (locationInputEl.value === "") {
        invalidHeader = document.querySelector('.invalid-loc')
        invalidHeader.innerText = "Please select a correct location!"
        setTimeout(() => {
            invalidHeader.innerText = ""
        }, 2000)
        return;
    } else {
        // Save value to local storage
        locationSearch(locationInputEl.value)
    }
}

function locationSearch(location) {

    var apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${weatherKey}`

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            var currentLat = data[0].lat;
            var currentLon = data[0].lon;
            weatherCurrent(currentLat, currentLon);
            weatherFiveDay(currentLat, currentLon);
        })
}
// Gets the current weather when parsed the lat and lon from openweather API.
function weatherCurrent(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            currentWeather(data)
        })
}
// Gets the weather for the next 5 dats when parsed the lat and lon from openweather API
function weatherFiveDay(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
    console.log(apiURL);
    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        fiveDayForecast(data)
    });
}

// Gets the currentWeatherEl
var currentWeatherEl = document.getElementsByClassName('current-weather')

// Generates the HTML for the current weather with the data parsed.
function currentWeather(data) {
    // Creates a template literal that uses the parsed data to create the HTML 
    const currWeather = 
    `
    <div class="name">
        <h3>${data.name}</h3>
        <p>${dayjs().format('DD/MM/YY')}</p>
    </div>

    <div class="current-display">

        <div class="conditions child">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Icon of ${data.weather[0].description}">
            <p>${data.weather[0].description}</p>
        </div>

        <div class="temp child">
            <p>${data.main.temp}°C</p>
            <p>Current Temp</p>
            <p>${data.main.humidity}%</p>
            <p>Current Humidity</p>
        </div>

        <div class="temp child">
            <p>${data.main.temp_max}°C</p>
            <p>Temp. Max</p>
            <p>${data.main.temp_min}°C</p>
            <p>Temp. Min</p>
        </div>
        <div class="wind child">
            <p>N</p>
            <p class="wind-arrow tag-current">&#8595</p>
            <p>${data.wind.speed} m/s</p>
        </div>
    </div>
    `
    // Populates
    currentWeatherEl[0].innerHTML = currWeather
    var current = "current"

    windArrow(data.wind.deg, current)
}

var fiveDayEl = document.querySelector('.forecast-weather')

function fiveDayForecast(data) {
    // Date, icon, temp, wind and humidity
    console.log(fiveDayEl)
    fiveDayEl.innerHTML = ""

    console.log(data)
    for (i = 0; 0 < data.list.length; i++) {
        if (data.list[i] === undefined) {
            return;
        } else {
            let date = data.list[i].dt_txt.split(' ')

            if (date[1] === "12:00:00") {

                let dayContent = 

                `
                <section class="weather-container"            
                    <div class="name">
                        <h3>${data.city.name}</h3>
                        <p>${date[0]}</p>
                    </div>
                <div class="forecast-content">
                    <div class="conditions child">
                        <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="Icon of ${data.list[i].weather[0].description}">
                        <p>${data.list[i].weather[0].description}</p>
                    </div>
                    <div class="temp child">
                        <p>${data.list[i].main.temp}°C</p>
                        <p>Max Temp</p>
                        <p>${data.list[i].main.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                    <div class="wind child">
                        <p>N</p>
                        <p class="wind-arrow tag-${[i]}">&#8595</p>
                        <p>${data.list[i].wind.speed} m/s</p>
                    </div>
                </div>
                `

                var newDay = document.createElement('div')
                newDay.innerHTML = dayContent

                fiveDayEl.appendChild(newDay)
                windArrow(data.list[i].wind.deg, [i])
            }
        }
    }
}

function windArrow(deg, tag) {
    var wind = document.querySelector(`.tag-${tag}`)
    wind.style.transform = `rotate(${deg}deg)`
}


var liEle = document.querySelectorAll('li')

liEle.forEach((element) => {
    element.addEventListener("click", (event) => {
        locationSearch(event.target.innerText)
    })
}) 

// THEN Search for it via the API,
// IF a result is found, I THEN retrieve the lat and lon co-ords

// WHEN I search for a location.
// It is saved to local storage and displayed on a recent search list.

// WHEN I get the co-ords
// I then INPUT these into the Weather API search query to get my weather location for that position.

// WHEN I have my weather for my location.
// I can THEN display the current weather in a div element.
// I can THEN display then generate the next 5 days in a dive element.