const API_KEY = '0150897d050996ab8625856479d79023                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   '; // Get free API key from openweathermap.org
const API_BASE = 'https://api.openweathermap.org/data/2.5';

const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('errorMessage'),
    weatherData: document.getElementById('weatherData'),
    recentSearches: document.getElementById('recentSearches'),
    cityName: document.getElementById('cityName'),
    date: document.getElementById('date'),
    weatherIcon: document.getElementById('weatherIcon'),
    temperature: document.getElementById('temperature'),
    weatherDescription: document.getElementById('weatherDescription'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    uvIndex: document.getElementById('uvIndex'),
    forecast: document.getElementById('forecast')
};

let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

function init() {
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.locationBtn.addEventListener('click', getUserLocation);
    
    displayRecentSearches();
    
    if (recentCities.length > 0) {
        getWeatherByCity(recentCities[0]);
    } else {
        getUserLocation();
    }
}

function handleSearch() {
    const city = elements.cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
        elements.cityInput.value = '';
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                showError('Unable to get your location. Please search manually.');
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

async function getWeatherByCity(city) {
    showLoading();
    try {
        const currentWeather = await fetch(
            `${API_BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!currentWeather.ok) {
            throw new Error('City not found');
        }
        
        const currentData = await currentWeather.json();
        const { lat, lon } = currentData.coord;
        
        const [forecastResponse, uvResponse] = await Promise.all([
            fetch(`${API_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${API_BASE}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ]);
        
        const forecastData = await forecastResponse.json();
        const uvData = await uvResponse.json();
        
        displayWeather(currentData, forecastData, uvData);
        addToRecentSearches(city);
        updateBackground(currentData.weather[0].main.toLowerCase());
    } catch (error) {
        showError('City not found. Please try again.');
    }
}

async function getWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const [currentResponse, forecastResponse, uvResponse] = await Promise.all([
            fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${API_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${API_BASE}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ]);
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        const uvData = await uvResponse.json();
        
        displayWeather(currentData, forecastData, uvData);
        addToRecentSearches(currentData.name);
        updateBackground(currentData.weather[0].main.toLowerCase());
    } catch (error) {
        showError('Unable to fetch weather data. Please try again.');
    }
}

function displayWeather(current, forecast, uv) {
    elements.cityName.textContent = `${current.name}, ${current.sys.country}`;
    elements.date.textContent = formatDate(new Date());
    
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
    elements.weatherIcon.alt = current.weather[0].description;
    
    elements.temperature.textContent = `${Math.round(current.main.temp)}°C`;
    elements.weatherDescription.textContent = current.weather[0].description;
    
    elements.feelsLike.textContent = `${Math.round(current.main.feels_like)}°C`;
    elements.humidity.textContent = `${current.main.humidity}%`;
    elements.windSpeed.textContent = `${current.wind.speed} m/s`;
    elements.pressure.textContent = `${current.main.pressure} hPa`;
    elements.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    elements.uvIndex.textContent = uv.value ? uv.value.toFixed(1) : 'N/A';
    
    displayForecast(forecast);
    
    hideLoading();
    elements.weatherData.classList.remove('hidden');
}

function displayForecast(forecast) {
    const dailyForecasts = {};
    
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = item;
        }
    });
    
    const forecastItems = Object.values(dailyForecasts).slice(0, 5);
    
    elements.forecast.innerHTML = forecastItems.map(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return `
            <div class="forecast-item">
                <div class="day">${day}</div>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" 
                     alt="${item.weather[0].description}">
                <div class="temp">${Math.round(item.main.temp)}°C</div>
                <div class="description">${item.weather[0].description}</div>
            </div>
        `;
    }).join('');
}

function addToRecentSearches(city) {
    recentCities = recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
    recentCities.unshift(city);
    recentCities = recentCities.slice(0, 5);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    displayRecentSearches();
}

function displayRecentSearches() {
    if (recentCities.length === 0) {
        elements.recentSearches.innerHTML = '';
        return;
    }
    
    elements.recentSearches.innerHTML = recentCities.map(city => 
        `<span class="recent-city" onclick="getWeatherByCity('${city}')">${city}</span>`
    ).join('');
}

function updateBackground(weather) {
    document.body.className = '';
    
    const weatherClasses = {
        'clear': 'clear-sky',
        'clouds': 'clouds',
        'rain': 'rain',
        'drizzle': 'drizzle',
        'thunderstorm': 'thunderstorm',
        'snow': 'snow',
        'mist': 'mist',
        'fog': 'fog',
        'haze': 'haze'
    };
    
    document.body.classList.add(weatherClasses[weather] || '');
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.error.classList.add('hidden');
    elements.weatherData.classList.add('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.error.classList.remove('hidden');
    elements.loading.classList.add('hidden');
    elements.weatherData.classList.add('hidden');
}

init();
