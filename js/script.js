// API Key Vars

const weatherDayMax = 5;

// Local storage array

let recentSearchData = []

// Loads the recent local storage data.
function loadRecent() {
    var localData = JSON.parse(localStorage.getItem("recentSearch"))
    if (localData !== null) {
        recentSearchData = localData
    }
}

// Saves the current array to localstorage.
function saveRecent() {
    let lastFive = recentSearchData.splice(-5)
    localStorage.setItem('recentSearch', JSON.stringify(lastFive))
    renderList();
}

// Event listener to take the inputted text value from the search bar
const recentListEl = document.getElementsByClassName('recent')

// Renders the list in HTMl.
function renderList() {
    // Retrieves JSON.
    loadRecent()
    // Clears HTML of any list items.
    recentListEl[0].innerHTML = ""
    // Splits the array to 5 only.
    console.log(recentSearchData)

    for (i = 0; i < recentSearchData.length; i++) {   
        var listEl = document.createElement('li')
        listEl.textContent = recentSearchData[i];
        recentListEl[0].appendChild(listEl)
    }
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
    // Populates the HTML.
    currentWeatherEl[0].innerHTML = currWeather
    var current = "current"
    // Rotates the wind arrow.
    windArrow(data.wind.deg, current)
}
// Query selector for 5 Day Forecast section
var fiveDayEl = document.querySelector('.forecast-weather')
// Generates the 5 day forecast.
function fiveDayForecast(data) {
    // Clears previous HTML ready to re-populate.
    fiveDayEl.innerHTML = ""

    // Checks for the date to see if matches.
    for (i = 0; 0 < data.list.length; i++) {

        // Avoids errors.
        if (data.list[i] === undefined) {
            return;
        } else {
            // Takes the date and time and splits them.
            let date = data.list[i].dt_txt.split(' ')
            // Checks to see if the date matches. Will generate the HTML if it does.
            if (date[1] === "12:00:00") {

                let dayContent = 

                `
                <section class="weather-container">            
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
                        <p>Temp</p>
                        <p>${data.list[i].main.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                    <div class="wind child">
                        <p>N</p>
                        <p class="wind-arrow tag-${[i]}">&#8595</p>
                        <p>${data.list[i].wind.speed} m/s</p>
                        <p><i>Wind direction & Speed</i><p>
                    </div>
                </div>
                `
                // Creates a div to populate the HTML with.
                var newDay = document.createElement('div')
                newDay.innerHTML = dayContent
                // Adds it the HTML.
                fiveDayEl.appendChild(newDay)
                // Rotates the wind arrow.
                windArrow(data.list[i].wind.deg, [i])
            }
        }
    }
}
// Sets the angle for the wind arrow.
function windArrow(deg, tag) {
    var wind = document.querySelector(`.tag-${tag}`)
    wind.style.transform = `rotate(${deg}deg)`
}

// Searches the API for a location matching the parsed value.
function locationSearch(location) {

    let locationValue = location
    
    recentSearchData.push(locationValue)
    console.log(recentSearchData)

    saveRecent();

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
// Gets the current weather when parsed the lat and lon from openweather API. Works on a promise, waiting for a response.
function weatherCurrent(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            currentWeather(data)
        });
}
// Gets the weather for the next 5 dats when parsed the lat and lon from openweather API. Works on a promise, waiting for a response.
function weatherFiveDay(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            fiveDayForecast(data)
        });
}

// Used for taking the input value and then parsing the locationSearch function.

const locationInputEl = document.querySelector('#location-text')

// Grabs the location entered into the search box, checks to see if a location is entered and one that is valid.
function newSearch (event) {
    event.preventDefault()
    const location = locationInputEl.value
    if (location === "") {
        invalidHeader = document.querySelector('.invalid-loc')
        invalidHeader.innerText = "Please select a correct location!"
        setTimeout(() => {
            invalidHeader.innerText = ""
        }, 2000)
        return;
    } else {
        locationSearch(location)
    }
}

recentListEl[0].addEventListener("click", (event) => {
    locationSearch(event.target.innerText)
})

renderList()