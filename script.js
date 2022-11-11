// open weather API key: 124d9ff31504e87b00d39357ef138efa

// API calls:

    // CITY ONLY:
    // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

    // CITY, COUNTRY:
    // https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid={API key}

    // CITY, STATE, COUNTRY:
    // https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

// user can click F / C buttons to set their preference to either 'imperial' or 'metric':
function storeUnitPreference(preference) {
    localStorage.setItem('units', preference);
}

    // for testing purposes:
    storeUnitPreference('imperial');

// retrieve the data from the openweather API:
async function getData(city, country, state) {
    const key = '124d9ff31504e87b00d39357ef138efa';
    let units = localStorage.getItem('units');
    if (!units) {
        units = 'imperial';
    }

    let req;

    if (city && !country && !state) {
        req = new Request(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`);
    } else if (city && country && !state) {
        req = new Request(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${key}&units=${units}`);
    } else if (city && country && state) {
        req = new Request(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${key}&units=${units}`);
    }
    const response = await fetch(req);
    const json = await response.json();
    if (json.cod !== 200) {
        throw new Error('Failed to retrieve weather data.');
    }
    return json;    
}


    // this code will be inside a form-submit function:
    // london example for testing purposes only:

    const londonData = getData('london');
    londonData
        .then(apiData => processData(apiData))
        .catch(msg => { console.error(msg) });

function processData(apiData) {
    console.log(apiData);

    const displayData = {
        'place': apiData.name.toLowerCase(),
        'weather': apiData.weather[0].main.toLowerCase(),
        'description': apiData.weather[0].description.toLowerCase(),
        'temp': Math.round(apiData.main.temp),
        'high': Math.round(apiData.main.temp_max),
        'low': Math.round(apiData.main.temp_min)
    }
    
    console.log(displayData);
    showWeatherReport(displayData);
}

// DOM-related javascript:

function hideForm() {
    const search = document.querySelector('.search');
    search.classList.add('hide');
}

function setBgColor(weather) {
    const main = document.querySelector('.main');
    
    // add logic to check for 'atmosphere'-type conditions:

    if (weather !== 'clear') {
        main.style.backgroundColor = `var(--${weather})`;
    } 
    
    // add logic to check time if weather is clear and then set the bg-color to either clear-day or clear-night depending on the time:
    // else if (weather === 'clear') {

    // }
}

function showWeatherReport(displayData) {

    hideForm();

    setBgColor(displayData.weather);

    const placeDiv = document.querySelector('.place');
    const descriptionDiv = document.querySelector('.description');
    const tempDiv = document.querySelector('.temp');
    const highTempSpan = document.querySelector('.high-temp');
    const lowTempSpan = document.querySelector('.low-temp');

    placeDiv.textContent = displayData.place;

    descriptionDiv.textContent = displayData.description;

    const units = localStorage.getItem('units');
    if (units === 'imperial') {
        tempDiv.textContent = `${displayData.temp} F`;
        highTempSpan.textContent = `high: ${displayData.high}`;
        lowTempSpan.textContent = `low: ${displayData.low}`;
    } else if (units === 'metric') {
        tempDiv.textContent = `current temperature: ${displayData.temp} C`;
        highTempSpan.textContent = `high: ${displayData.high}`;
        lowTempSpan.textContent = `low: ${displayData.low}`;
    }
}