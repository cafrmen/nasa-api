const whatDateIsToday = document.getElementById('today');
const apodImage = document.getElementById('apodImg');
const apodTitle = document.getElementById('apodTitle');
const apodInfo = document.getElementById('apodInfo');
const domDonkiReport = document.getElementById('test');
const asteroidName = document.getElementById('name');
const asteroidDiameter = document.getElementById('diameter');
const asteroidHazardous = document.getElementById('hazardous');
const asteroidSpeed = document.getElementById('kmSeconds');
const asteroidDistance = document.getElementById('missKm');


// current date for NeoWs API
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const currentDate = `${year}-${month}-${day}`;

whatDateIsToday.textContent = date;

// the Api and Api Url info
const nasaApiKey = 'Xqt6ZbilW49UfGA7xNEC6wTnuSdA0XGCnitavxya';
const nasaApodUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;
const nasaDonkiReportUrl = `https://api.nasa.gov/DONKI/notifications?startDate=yyy-MM-dd&endDate=yyyy-MM-dd&type=report&api_key=${nasaApiKey}`;
const nasaAsteroidUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${currentDate}&end_date=${currentDate}&api_key=${nasaApiKey}`;

// fetch APOD --- Astronomy Picture of the Day
async function nasaApod () {
    const response = await fetch(nasaApodUrl);
    const apodData = await response.json();

    apodImage.src = apodData.hdurl;
    apodTitle.textContent = apodData.title;
    apodInfo.textContent = apodData.explanation
    return apodData;
}
nasaApod();

const markdownParser = (text) => {
    const toHTML = text.replace(/^### (.*$)/gim, '<h3>$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1>$1</h1>');
     // using trim method to remove whitespace
    domDonkiReport.innerHTML = toHTML.trim();
};

// fetch DONKI --- Space Weather DB of Notifications, Knowledge and Information
async function nasaDonkiReport () {
    const response = await fetch(nasaDonkiReportUrl);
    const donkiReport = await response.json();

    let reportMessage = donkiReport[0].messageBody;
    markdownParser(reportMessage);
}
nasaDonkiReport();

// fetch NeoWs --- Near Earth Object Web Service --- Asteroids
async function nasaAsteroids () {
    const response = await fetch(nasaAsteroidUrl);
    const asteroidData = await response.json();

    let randomAsteroid = Math.floor(Math.random() * asteroidData.element_count);
    let currentDate = Object.keys(asteroidData.near_earth_objects);

    let name = asteroidData.near_earth_objects[`${currentDate}`][randomAsteroid].name;
    let minDiam = (asteroidData.near_earth_objects[`${currentDate}`][randomAsteroid]
                    .estimated_diameter.kilometers.estimated_diameter_min).toFixed(4);
    let maxDiam = (asteroidData.near_earth_objects[`${currentDate}`][randomAsteroid]
                    .estimated_diameter.kilometers.estimated_diameter_max).toFixed(4);
    let danger = asteroidData.near_earth_objects[`${currentDate}`][randomAsteroid]
                    .is_potentially_hazardous_asteroid;
    let speed = asteroidData.near_earth_objects[`${currentDate}`][randomAsteroid]
                    .close_approach_data[0].relative_velocity.kilometers_per_second;
    let distance = asteroidData.near_earth_objects[`${currentDate}`][randomAsteroid]
                    .close_approach_data[0].miss_distance.kilometers;

    asteroidName.textContent = `Name: ${name}`;
    asteroidDiameter.textContent = `Estimated diameter: ${minDiam} km - ${maxDiam} km`;
    asteroidHazardous.textContent = `Is potentially hazardous asteroid: ${danger}`;
    asteroidSpeed.textContent = `Relative speed: ${speed} km/s`;
    asteroidDistance.textContent = `Missing distance: ${distance} km`;
}
nasaAsteroids();