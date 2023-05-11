// API Key Vars

const weatherKey = '632b6159be10915c53139465f83c756e';
const weatherDayMax = 5;

// Event listener to take the inputted text value from the search bar

var locationInputEl = document.querySelector('#location-text')

function recentLoad(location) {
    
}

function recentSave() {
    
}

function searchButton (event) {
    event.preventDefault()
    if (locationInputEl.value === "") {
        invalidHeader = document.querySelector('.invalid-loc')
        invalidHeader.innerText = "Please select a correct location!"
        setTimeout(() => {
            invalidHeader.innerText = ""
        }, 2000)
        return;
    } else {
        locationSearch(locationInputEl.value)
    }
}

function locationSearch(location) {
    console.log(location)
    var apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${weatherKey}`
    console.log(apiURL)
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            var currentLat = data[0].lat;
            var currentLon = data[0].lon;
            weatherSearch(currentLat, currentLon);
        })
}

function weatherSearch(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}



// THEN Search for it via the API,
// IF a result is found, I THEN retrieve the lat and lon co-ords

// WHEN I search for a location.
// It is saved to local storage and displayed on a recent search list.

// WHEN I get the co-ords
// I then INPUT these into the Weather API search query to get my weather location for that position.

// WHEN I have my weather for my location.
// I can THEN display the current weather in a div element.
// I can THEN display then generate the next 5 days in a dive element.