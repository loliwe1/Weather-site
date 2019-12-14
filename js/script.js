'use strict'

window.addEventListener('DOMContentLoaded', function () {

    const temperature = document.querySelector('.temperature');
    const descriptionWeather = document.querySelector('.wearher_discription');
    const city = document.querySelector('.city')

    getTemperature();

    async function getTemperature() {
        let response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Omsk,ru&appid=6d69f33007962728c2d73296d6bbdd69');
        let result = await response.json();

        let { temp } = result.main;
        let weather = result.weather[0];
        let {description, main } = weather;
        const celsius = Math.floor(temp - 273.15);

        skycons(main);

        temperature.innerHTML = celsius;
        descriptionWeather.innerHTML = description;
        city.innerHTML = result.name;

        
       
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
        }

        else {
            skycons.add("icon1", Skycons.CLEAR_DAY);
        }

        skycons.play();
    }

});