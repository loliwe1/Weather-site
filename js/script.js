'use strict'

window.addEventListener('DOMContentLoaded', function () {
    const temperature = document.querySelector('.temperature');
    const descriptionWeather = document.querySelector('.wearher_discription');
    const city = document.querySelector('.city');
    const cities = document.querySelector('#cities');
    const chooseCity = document.querySelector('.cities');
    const formCity = document.querySelector('form');
    const detailDate = document.querySelector('.details_date');
    const detailTime = document.querySelector('.details_time');
    const detailCoords = document.querySelector('.details_coords');
    const detailClouds = document.querySelector('.details_clouds');
    const detailWindSpeed = document.querySelector('.details_wind-speed');
    const detailWindDeg = document.querySelector('.details_wind-deg');
    const detailPressure = document.querySelector('.details_main-pressure');
    const detailHumidity = document.querySelector('.details_main-humidity');
    let cityId = 1496153; // Omsk id

    getTemperature();
    getCity();

    chooseCity.addEventListener('click', () => {
        formCity.classList.toggle('city_form');
    });

    cities.addEventListener('click', () => {
        cityId = cities.value;
        getTemperature();
    });

    async function getTemperature() {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=6d69f33007962728c2d73296d6bbdd69`);
        let result = await response.json();
        console.log(result);
        let { temp, humidity, pressure } = result.main;
        let weather = result.weather[0];
        let { description,main } = weather;
        const celsius = Math.floor(temp - 273.15);

        temperature.innerHTML = celsius;
        descriptionWeather.innerHTML = description;
        city.innerHTML = result.name;

        console.log(result.coord)

        skycons(main);
        getDetails(new Date(), `00:00:00`, `${result.coord.lat}, ${result.coord.lon}`, result.clouds.all, result.wind.speed, result.wind.deg, pressure, humidity);

    };

    async function getCity() {
        let response = await fetch('../json/city.list.json');
        let data = await response.json();

        for (let key in data) {
            if (data[key].country === 'RU') {
                let option = new Option(data[key].name, data[key].id);
                cities.append(option);
                if (data[key].id === 1496153) {
                    cities.value = 1496153;
                }
            }
        }
    };

    function getDetails(date = new Date(), time, coords, clouds, windSpeed, windDeg, pressure, humidity){
        detailDate.querySelector('span').innerHTML = date ;
        detailTime.querySelector('span').innerHTML = time ;
        detailCoords.querySelector('span').innerHTML = coords ;
        detailClouds.querySelector('span').innerHTML = clouds ;
        detailWindSpeed.querySelector('span').innerHTML = windSpeed ;
        detailWindDeg.querySelector('span').innerHTML = windDeg ;
        detailPressure.querySelector('span').innerHTML = pressure ;
        detailHumidity.querySelector('span').innerHTML = humidity ;  
    }

    function skycons(fallout) {
        var skycons = new Skycons({
            "color": "white"
        });
        if (fallout === 'Clear') {
            skycons.add("icon1", Skycons.CLEAR_DAY);
        }
        if (fallout === 'Clouds') {
            skycons.add("icon1", Skycons.CLOUDY);

        }
        if (fallout === 'Rain') {
            skycons.add("icon1", Skycons.RAIN);
        }
        if (fallout === 'Thunderstorm') {
            skycons.add("icon1", Skycons.SLEET);
        }
        if (fallout === 'Snow') {
            skycons.add("icon1", Skycons.SNOW);
        }
        if (fallout === 'Wind') {
            skycons.add("icon1", Skycons.WIND);
        }
        if (fallout === 'Fog') {
            skycons.add("icon1", Skycons.FOG);
        } else {
            skycons.add("icon1", Skycons.CLEAR_DAY);
        }

        skycons.play();
    }
});