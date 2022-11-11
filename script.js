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
        .then(data => processData(data))
        .catch(msg => { console.error(msg) });

function processData(data) {
    console.log(data);
    const place = data.name.toLowerCase();
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const highTemp = data.main.temp_max;
    const lowTemp = data.main.temp_min;
    console.log(place, description, temp, highTemp, lowTemp);
    showWeatherReport(place, description, temp, highTemp, lowTemp);
}

// DOM-related javascript:

function showWeatherReport(place, description, temp, highTemp, lowTemp) {
    const placeDiv = document.querySelector('.place');
    const descriptionDiv = document.querySelector('.description');
    const tempDiv = document.querySelector('.temp');
    const highTempDiv = document.querySelector('.high-temp');
    const lowTempDiv = document.querySelector('.low-temp');

    placeDiv.textContent = place;

    descriptionDiv.textContent = description;

    const units = localStorage.getItem('units');
    if (units === 'imperial') {
        tempDiv.textContent = `${temp} F`;
        highTempDiv.textContent = `${highTemp} F`;
        lowTempDiv.textContent = `${lowTemp} F`;
    } else if (units === 'metric') {
        tempDiv.textContent = `${temp} C`;
        highTempDiv.textContent = `${highTemp} C`;
        lowTempDiv.textContent = `${lowTemp} C`;
    }
}