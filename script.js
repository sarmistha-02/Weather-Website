const cityInput=document.querySelector(".city-input");
const searchButton=document.querySelector(".search-btn");
const locationButton=document.querySelector(".location-btn");
const weatherCardsDiv=document.querySelector(".weather-cards");
const currentWeatherDiv=document.querySelector(".current-weather");
const API_KEY="4dfea902c2aa075a7f1b21518abfda28";

//Display of the weather cards
const createWeatherCard=(cityName,weatherItem,index)=>{ 
    //Current weather card
    if(index===0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp-273.15).toFixed(2)}°C</h4>
                    <h4>Min Temperature: ${(weatherItem.main.temp_min-273.15).toFixed(2)}°C</h4>
                    <h4>Max Temperature: ${(weatherItem.main.temp_max-273.15).toFixed(2)}°C</h4>
                    <h4>Feels like: ${(weatherItem.main.feels_like-273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    <h4>Pressure: ${weatherItem.main.pressure} hPa</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }
    //Next 5-days cards
    else{
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4 class="capital">${weatherItem.weather[0].description}</h4>
                <h4>Temp: ${(weatherItem.main.temp-273.15).toFixed(2)}°C</h4>
                <h4>Min Temp: ${(weatherItem.main.temp_min-273.15).toFixed(2)}°C</h4>
                <h4>Max Temp: ${(weatherItem.main.temp_max-273.15).toFixed(2)}°C</h4>
                <h4>Feels like: ${(weatherItem.main.feels_like-273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                <h4>Pressure: ${weatherItem.main.pressure} hPa</h4>
            </li>`;
    }
}

//Fetching the weather details of six days.
const getWeatherDetails=(cityName, lat, lon)=>{
    const weatherApiUrl=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(weatherApiUrl).then((value)=>{
        return value.json();
    }).then((value)=>{
        const uniqueForecastDays=[];
        const fiveDaysForecast=value.list.filter((forecast)=>{
            const forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        //Clearing previous content 
        cityInput.value="";
        weatherCardsDiv.innerHTML="";
        currentWeatherDiv.innerHTML="";
        // console.log(fiveDaysForecast);
        //Creating weather cards
        fiveDaysForecast.forEach((weatherItem,index)=>{
            if(index===0){
                currentWeatherDiv.insertAdjacentHTML('beforeend',createWeatherCard(cityName,weatherItem,index));
            }
            else{
                weatherCardsDiv.insertAdjacentHTML('beforeend',createWeatherCard(cityName,weatherItem,index));
            }
        });
    }).catch(()=>{
        alert("An error occurred while fetching the weather forecast!!!");
    });
}

//Fetching the latitude and longitude of the entered city
const getCityCoordinates=()=>{
    const cityName=cityInput.value.trim();
    if(!cityName)
        return;
    const geocodingApiUrl=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(geocodingApiUrl).then((value)=>{
        return value.json();
    }).then((value)=>{
            // console.log(value);
            if(!value.length)
                return alert(`No data found for ${cityName}`);
            const { name, lat, lon } = value[0];
            getWeatherDetails(name, lat, lon);
    }).catch(()=>{
        alert("An error occurred while fetching the data!!!");
    });
}

//Getting user's current location name and geographical co-ordinates
const getUserCoordinates=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
            const { latitude, longitude }=position.coords;
            const reverseGeocodingUrl=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(reverseGeocodingUrl).then((value)=>{
                return value.json();
            }).then((value)=>{
                    // console.log(value);
                    const { name } = value[0];
                    getWeatherDetails(name, latitude, longitude);
            }).catch(()=>{
                alert("An error occurred while fetching the data!!!");
            });
        },
        error=>{
            if(error.code===error.PERMISSION_DENIED){
                alert("Permission to access location denied. Please reset location permission to grant access again.");
            }
        }
    );

}

//Search for other cities
searchButton.addEventListener("click",getCityCoordinates);

//Search for current location
locationButton.addEventListener("click",getUserCoordinates)

//Search on pressing enter key
cityInput.addEventListener("keyup",e=>e.key==="Enter" && getCityCoordinates());