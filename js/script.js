// API Key Vars

const weatherKey = '632b6159be10915c53139465f83c756e';
const weatherDayMax = 5;

var currentLocation = 
{
    lat: 0,
    lon: 0
}

// Event listener to take the inputted text value from the search bar

var locationInputEl = document.querySelector('#location-text')

function locationSave(location) {
    
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