'use strict'

window.addEventListener('DOMContentLoaded', function(){

const temperature = document.querySelector('.temperature');
const descriptionWeather = document.querySelector('.wearher_discription');

async function getTemperature() {
    let response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Omsk,ru&appid=6d69f33007962728c2d73296d6bbdd69');
    let result = await response.json();
    console.log(result);

    let  {temp} = result.main;
    let  {description} = result.weather[0];
    const celsius = Math.floor(temp - 273.15);

    temperature.innerHTML = celsius;
    descriptionWeather.innerHTML = description;
};

getTemperature();





    //Skycons---------------------------------------------------------
    var skycons = new Skycons({"color": "white"});
    // on Android, a nasty hack is needed: {"resizeClear": true}
  
    // you can add a canvas by it's ID...
    skycons.add("icon1", Skycons.PARTLY_CLOUDY_DAY);
  
    // ...or by the canvas DOM element itself.
    skycons.add(document.getElementById("icon2"), Skycons.RAIN);
  
    // if you're using the Forecast API, you can also supply
    // strings: "partly-cloudy-day" or "rain".
  
    // start animation!
    skycons.play();
});