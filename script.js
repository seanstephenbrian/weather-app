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

const londonData = getData('london');
londonData
    .then(data => processData(data))
    .catch(msg => { console.error(msg) });

function processData(data) {
    console.log(data);
    const name = data.name.toLowerCase();
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const highTemp = data.main.temp_max;
    const lowTemp = data.main.temp_min;
    console.log(name, description, temp, highTemp, lowTemp);
}