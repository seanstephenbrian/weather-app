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

function processData(apiData) {
    console.log(apiData);

    const icon = apiData.weather[0].icon;
    const dayOrNight = icon.slice(-1);
    let time;
    if (dayOrNight === 'd') {
        time = 'day';
    } else if (dayOrNight === 'n') {
        time = 'night';
    }

    const displayData = {
        'place': apiData.name.toLowerCase(),
        'weather': apiData.weather[0].main.toLowerCase(),
        'description': apiData.weather[0].description.toLowerCase(),
        'id': apiData.weather[0].id,
        'temp': Math.round(apiData.main.temp),
        'high': Math.round(apiData.main.temp_max),
        'low': Math.round(apiData.main.temp_min),
        'time': time
    }
    
    console.log(displayData);
    showWeatherReport(displayData);
}

// DOM-related javascript:

function hideForm() {
    const search = document.querySelector('.search');
    search.classList.add('hide');
}

function setHeaderImg(time) {
    const header = document.querySelector('header');
    header.classList.remove('night', 'day');
    header.classList.add(time);
    if (time === 'day') {
        header.style.backgroundImage = `url(img/day.jpg)`;
    } else if (time === 'night') {
        header.style.backgroundImage = `url(img/night.jpg)`;
    }
}

function setBgColor(weather, time, id) {
    const main = document.querySelector('.main');
    if (weather === 'clear') {
        if (time === 'night') {
            main.style.backgroundColor = 'var(--clear-night)';
        } else if (time === 'day') {
            main.style.backgroundColor = 'var(--clear-day)';
        }
    } else if (weather === 'rain') {
        // light rain, moderate rain, light intensity shower rain, shower rain, ragged shower rain:
        if (id === 500 || id === 501 || id === 520 || id === 521 || id === 531 ) {
            main.style.backgroundColor = 'var(--rain)';
        } else {
            main.style.backgroundColor = 'var(--heavy-rain)';
        }
    } else if (weather === 'clouds') {
        // few clouds, scattered clouds:
        if (id === 801 || id === 802) {
            main.style.backgroundColor = 'var(--few-clouds)';
        } else {
            main.style.backgroundColor = 'var(--clouds)';
        }
    } else if (id > 700 && id < 800) {
        // mist, fog:
        if (id === 701 || id === 741) {
            main.style.backgroundColor = 'var(--atmosphere)';
        // dust, sand:
        } else if (id === 731 || id === 751 || id === 761) {
            main.style.backgroundColor = 'var(--thunderstorm)';
        // smoke, haze, ash:
        } else if (id === 711 || id === 721 || id === 762) {
            main.style.backgroundColor = 'var(--clouds)';
        // squall:
        } else if (id === 771) {
            main.style.backgroundColor = 'var(--heavy-rain)';
        // tornado:
        } else if (id === 781) {
            main.style.backgroundColor = 'var(--clear-night)';
        }
    } else {
        main.style.backgroundColor = `var(--${weather})`;
    }
    
    main.classList.remove('day', 'night');
    main.classList.add(time);

}

function setFooterColors(time) {
    const footer = document.querySelector('footer');
    footer.classList.remove('day', 'night');
    footer.classList.add(time);
}

function showWeatherReport(displayData) {

    hideForm();

    setHeaderImg(displayData.time);

    setBgColor(displayData.weather, displayData.time, displayData.id);

    setFooterColors(displayData.time);

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



// this code will be inside a form-submit function:
    // london example for testing purposes only:

    const testData = getData('chicago');
    testData
        .then(apiData => processData(apiData))
        .catch(msg => { console.error(msg) });