document.addEventListener('DOMContentLoaded', async function () {
    //#region html elements 
    const locationInput = document.getElementById('locationInput');
    const searchButton = document.getElementById('searchButton');
    const locationElement = document.querySelector('#location');
    const firstContainer = document.querySelector('.First-Container');
    const secondContainer = document.querySelector('.Second-Container');
    const returnContainer = document.getElementById('returnContainer');
    const cityTitleElement = document.querySelector('.card-title');
    const dateElement = document.querySelector('.date');
    const descriptionElement = document.querySelector('.description');
    const temperatureElement = document.querySelector('.temperature');
    const image = document.querySelector('.card-img-top');
    const mapElement = document.querySelector('.Map');
    //#endregion
    secondContainer.hidden = true;
    mapElement.hidden=true;
    returnContainer.hidden=true;

    let map;

    //#region function that convert date to day of the week
    function getDayOfWeek(dateString) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(dateString);
        return daysOfWeek[date.getDay()];
    }
    //#endregion

    //#region  function capitilize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //#endregion

    //#region  function that perform search by City name
    async function performSearch(location) {
        try {
            // connect to my api
            const locationResponse = await fetch(`/api/location?location=${location}`);
            // console log the lat and lon that converted from city name
            const locationData = await locationResponse.json();
            console.log("Location Data:", locationData);
            if (!locationData.error) {
                locationElement.textContent = location;
                //connect to my api that get city-image
                const locationImageResponse = await fetch(`/api/city-image?location=${location}`);
                const locationImageData = await locationImageResponse.json();
                const imageURL = locationImageData.imageURL;
                image.innerHTML = `<img src="${imageURL}" alt="${location}" style=width:250px;height:250px;>`
                // connect to my api that get the weather for 5 day 
                const weatherResponse = await fetch(`/api/weather?location=${location}`);
                const weatherData = await weatherResponse.json();
                console.log("Weather Data:", weatherData);
                if (!weatherData.error) {
                    //connect to my api that get current weather
                    const currentWeatherResponse = await fetch(`/api/currentweather?lat=${locationData.coordinates.lat}&lon=${locationData.coordinates.lon}`);
                    const currentWeatherData = await currentWeatherResponse.json();
                    console.log("Current Weather Data:", currentWeatherData);
                    if (!currentWeatherData.error) {
                        cityTitleElement.innerHTML = `${capitalizeFirstLetter(location)}`
                        dateElement.innerHTML = new Date().toLocaleDateString();
                        descriptionElement.innerHTML = currentWeatherData.currentWeather.description;
                        temperatureElement.innerHTML = `${currentWeatherData.currentWeather.temperature}°C`;
                    } else {
                        throw new Error(currentWeatherData.error);
                    }
                    //adding information from API array to html
                    const forecastContainer = document.querySelector('.forecast-container');
                    forecastContainer.innerHTML = '';
                    if (weatherData.forecast && weatherData.forecast.length > 0) {
                        weatherData.forecast.forEach(entry => {
                            const forecastEntry = document.createElement('div');
                            forecastEntry.classList.add('forecast-entry');
                            forecastEntry.innerHTML = `
                                <div class="row">
                                    <div class="col">${getDayOfWeek(entry.date)}</div>
                                    <div class="col">${entry.date}</div>
                                    <div class="col">${entry.temperature} °C</div>
                                    <div class="col">${entry.description}</div>
                                </div>
                            `;
                            forecastContainer.appendChild(forecastEntry);
                        });
                    } else {
                        const noForecastMessage = document.createElement('div');
                        noForecastMessage.textContent = 'Forecast data is not available.';
                        forecastContainer.appendChild(noForecastMessage);
                    }
                    firstContainer.hidden = true;
                    secondContainer.hidden = false;
                    mapElement.hidden=false;
                    returnContainer.hidden=false;
                    const lon = locationData.coordinates.lon;
                    const lat = locationData.coordinates.lat;
                    updateMap(lon, lat);
                } else {
                    throw new Error(weatherData.error);
                }
            } else {
                throw new Error(locationData.error);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    }
    //#endregion

    //#region function that if map exists update it
    function updateMap(lon, lat) {
        if (!map) {
            map = L.map('map').setView([lat, lon], 10); 
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        } else {
            map.setView([lat, lon], 10); 
        }
    }
    //#endregion

    //#region Eventlisteners like click keypress

    //on click to button search perform action taht call function performSearch to get information avout weather in City
    searchButton.addEventListener('click', function () {
        const location = locationInput.value.trim();
        if (!location) {
            alert('Choose a City!');
            return;
        }
        performSearch(location);
    });

    // you can just press enter instead of click to button search
    locationInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const location = locationInput.value.trim();
            if (!location) {
                alert('Choose a City!');
                return;
            }
            performSearch(location);
        }
    });

    //on button click perform action that hide map and card with info and show the form to write city name
    returnContainer.addEventListener('click', function () {
        locationInput.value=''
        firstContainer.hidden = false;
        secondContainer.hidden = true;
        mapElement.hidden=true;
        returnContainer.hidden=true;
    });
    //#endregion
  
    //#region Map create and map function on click
    map = L.map('map').setView([0, 0], 2); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

   //on map click performs new location and call function performSearch to get new information about weather of new City
    map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        alert('Wait please it can take some time');
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                const cityName = data.address.city;
                locationInput.value = cityName;
                alert(`Your current City is ${locationInput.value}`);
                performSearch(cityName);
            })
            .catch(error => {
                console.error('Error retrieving city:', error);
                alert('An error occurred while retrieving the city. Please try again.');
            });
    });
    //#endregion
});
