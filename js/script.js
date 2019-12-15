'use strict'

window.addEventListener('DOMContentLoaded', function () {
    const temperature = document.querySelector('.temperature');
    const descriptionWeather = document.querySelector('.wearher_discription');
    const city = document.querySelector('.city');
    const cities = document.querySelector('#cities');
    const chooseCity = document.querySelector('.cities');
    const formCity = document.querySelector('form');
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
        let {
            temp
        } = result.main;
        let weather = result.weather[0];
        let {
            description,
            main
        } = weather;
        const celsius = Math.floor(temp - 273.15);

        skycons(main);

        temperature.innerHTML = celsius;
        descriptionWeather.innerHTML = description;
        city.innerHTML = result.name;
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