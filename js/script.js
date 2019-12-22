'use strict'

window.addEventListener('DOMContentLoaded', function () {
    const temperature = document.querySelector('.temperature');
    const descriptionWeather = document.querySelector('.wearher_discription');
    const mainWeather = document.querySelector('.weather');
    const city = document.querySelector('.city');
    const cities = document.querySelector('#cities');
    const chooseCity = document.querySelector('.cities');
    const formCity = document.querySelector('form');
    const detailsItems = document.querySelector('.details_items')
    const detailDate = document.querySelector('.details_date');
    const detailTime = document.querySelector('.details_time');
    const detailTemp = document.querySelector('.details_temp');
    const detailTempMax = document.querySelector('.details_temp-max');
    const detailTempMin = document.querySelector('.details_temp-min');
    const detailCoords = document.querySelector('.details_coords');
    const detailClouds = document.querySelector('.details_clouds');
    const detailWindSpeed = document.querySelector('.details_wind-speed');
    const detailWindDeg = document.querySelector('.details_wind-deg');
    const detailPressure = document.querySelector('.details_main-pressure');
    const detailHumidity = document.querySelector('.details_main-humidity');
    const detailCity = document.querySelector('.details_city');
    const detailsShow = document.querySelector('.details_a');
    const detailsHide = document.querySelector('.hide_a');
    const modalWindow = document.querySelector('.modal_window');
    const modalButtonYes = document.querySelector('.modal_button-yes');
    const modalButtonChangeCity = document.querySelector('.modal_button-canhgeCity');
    const cityList = document.querySelector('.city_list');
    const selectCityButton = document.querySelector('.select_city');
    const canselButton = document.querySelector('.cancel_select');
    const canvasChart = document.querySelector('#canvas');
    const tempTable = document.querySelector('.temp_table');
    const tempTr = document.querySelectorAll('.temp_tr');
    const detailsItem = document.querySelectorAll('.details-item');
    const detailsNavItem = document.querySelectorAll('.details-nav-item');
    const detailsNav = document.querySelector('.details-nav');
    const buttonScrollTop = document.querySelector('.scroll_top-button');

    let cityId = localStorage.getItem('cityId');

    getModalWindow();
    window.addEventListener('load', getCity());
    window.addEventListener('scroll', scrollToTop);
    chooseCity.addEventListener('click', showCities);
    modalButtonChangeCity.addEventListener('click', showCities);
    modalButtonChangeCity.addEventListener('click', showCities);
    detailsShow.addEventListener('click', showDetails);
    detailsHide.addEventListener('click', showDetails);
    selectCityButton.addEventListener('click', selectCity);
    canselButton.addEventListener('click', canselSelect);
    buttonScrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 9,
            behavior: 'smooth'
        });
    });

    getTemperatureIn24Hours();

    async function getTemperature() {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=6d69f33007962728c2d73296d6bbdd69`);
        if(!response.ok){
            alert("Ошибка HTTP: " + response.status);
        }
        let result = await response.json();
        
        let { temp, temp_min, temp_max, humidity, pressure } = result.main;
        let weather = result.weather[0];
        let { description,main } = weather;
        const celsius = Math.floor(temp - 273.15);
        temp_max = Math.floor(temp_max - 273.15);
        temp_min = Math.floor(temp_min - 273.15);

        temperature.innerHTML = celsius;
        descriptionWeather.innerHTML = description;
        city.innerHTML = result.name;
        skycons(main);
        getDetails(result.name, getDate(), getTime(), celsius, temp_max, temp_min, `${result.coord.lat}, ${result.coord.lon}`, result.clouds.all, result.wind.speed, result.wind.deg, pressure, humidity);
        temperature.addEventListener('click', () => changeTempUnit(celsius));
    };

    

    async function getTemperatureIn24Hours(){
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=6d69f33007962728c2d73296d6bbdd69`);
        let result = await response.json();
        let timeTemp = result.list;
        let map = new Map();

        for(let temp of timeTemp) {
            map.set(temp.dt_txt, temp.main.temp)
        }
        let obj = Object.fromEntries(map.entries());
        let entries = Object.entries(obj);
       
    //    drawGrids();
       drawAxis();
       markingAxis(entries);
       drawChart(entries);

       createTemperatureTable (result);
        
    }

    async function getCity() {
        let response = await fetch('../json/city.list.json');
        let data = await response.json();

        for (let key in data) {
            if (data[key].country === 'RU') {

                if(data[key].id === 2017370 || data[key].name === '-'){
                    continue;
                }

                let option = new Option(data[key].name, data[key].id);
                cities.append(option);

                if (data[key].id === 1496153) {
                    cities.value = 1496153;
                }

            }
        }
    };

    function getDetails(city, date = new Date(), time, temp, tempMax, tempMin, coords, clouds, windSpeed, windDeg, pressure, humidity){
        detailCity.querySelector('span').innerHTML = city;
        detailDate.querySelector('span').innerHTML = date ;
        detailTemp.querySelector('span').innerHTML = temp + '&#176C';
        detailTempMax.querySelector('span').innerHTML = tempMax + '&#176C';
        detailTempMin.querySelector('span').innerHTML = tempMin + '&#176C';
        detailCoords.querySelector('span').innerHTML = coords + ' (широта, долгота)' ;
        detailClouds.querySelector('span').innerHTML = clouds + ' %';
        detailWindSpeed.querySelector('span').innerHTML = windSpeed + ' метра/сек';
        detailWindDeg.querySelector('span').innerHTML = windDeg + ' градусов' ;
        detailPressure.querySelector('span').innerHTML = Math.floor(pressure * 0.75006375541921) + ' мм рт.ст.' ;
        detailHumidity.querySelector('span').innerHTML = humidity + ' %' ;  
    }

    function showDetails(){
        mainWeather.classList.toggle('display_none');
        detailsItems.classList.toggle('display_none');
        detailsShow.classList.toggle('display_none');
        detailsHide.classList.toggle('display_none');
        

        if(!detailsItems.classList.contains('display_none')) {
            setTimeout(function() {
                window.scrollBy({
                    top: 330,
                    behavior: 'smooth'
                });
            },0);
        }
    };

    function getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let newDate = `${day}.${month + 1}.${year}`;

        return newDate;
    };

    function getTime(){
        let date = new Date();
        let hours = date.getUTCHours();
        let mins = date.getUTCMinutes();
        let seconds = date.getUTCSeconds();

        if(mins < 10){
            mins = '0' + mins;
        }

        if(seconds < 10) {
            seconds = '0' + seconds;
        }

        if(hours == 24) {
            hours = '00';
        }

        let timer =  `${hours}:${mins}:${seconds}`;

        setTimeout(function(){
            detailTime.querySelector('span').innerHTML = timer;
        getTime()
        }, 1000);
    };
    
    function changeTempUnit(cels) {
        temperature.classList.toggle('t_fahrenheit');
        temperature.classList.toggle('t_celsius');
        const fahrenheit = Math.floor((cels * 1.8) + 32);

        if(temperature.classList.contains('t_fahrenheit')){
            temperature.innerHTML = fahrenheit;
        }else {
            temperature.innerHTML = cels;
        }

    }

    function getModalWindow() {
        if(!cityId) {
            modalWindow.style.display = 'block';
            localStorage.setItem('cityId', 1496153);
            cityId = localStorage.getItem('cityId');
            modalButtonYes.addEventListener('click', function() {
                getTemperature();
                modalWindow.style.display = 'none';
            });

        }else {
            getTemperature();
        }

    }

    function selectCity(){
        localStorage.setItem('cityId', cities.value);
        cityId = localStorage.getItem('cityId');
        getTemperature();
        getTemperatureIn24Hours();
        cityList.style.opacity = '0';
        cityList.style.height = '0';
        cityList.style.width = '0';
        cityList.style.left = '50%';
        modalWindow.style.display = 'none';
    };

    function canselSelect(){
        cityList.style.opacity = '0';
        cityList.style.height = '0';
        cityList.style.width = '0';
        cityList.style.left = '50%';
    };

    function showCities() {
        cityList.style.opacity = '1';
        cityList.style.height = '550px';
        cityList.style.width = '90%';
        cityList.style.left = '50%';
    };



    function scrollToTop() {
        if(window.pageYOffset >= 250) {
            buttonScrollTop.style.opacity = 1;
        }else {
            buttonScrollTop.style.opacity = 0;
        }
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

// canvas chart -----------------------------------------------------------------
    let canvas = document.querySelector('#canvas');
    canvas.width = 1200;
    canvas.height = 800;
    let ctx = canvas.getContext('2d');
    let count = 10;

    // let xGrid = 10;
    // let yGrid = 10;

    // function clearCanvas() {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    // }

    // function drawGrids() {
    //     for(let i = 0; i<= canvas.height; i++) {
    //         ctx.moveTo(0, yGrid);
    //         ctx.lineTo(canvas.width, yGrid);
    //         yGrid += count;

    //     };
    //     for(let i = 0; i<= canvas.width; i++) {
    //         ctx.moveTo(xGrid, 0);
    //         ctx.lineTo(xGrid, canvas.height);
    //         xGrid += count;
    //     };
    //     ctx.strokeStyle = 'grey';
    //     ctx.stroke();

    // }

    // function clearChart() {
    //     ctx.clearChart(0,0,canvas.width,canvas.height)
    //     ctx.stroke();
    // }
    
    function blocks(count) {
        return 10*count;
    }

    function drawAxis() {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(blocks(10), blocks(10));
        ctx.lineTo(blocks(10), canvas.height - blocks(10));
        ctx.lineTo(canvas.width - blocks(10), canvas.height - blocks(10));
        ctx.stroke();
    }

    function markingAxis(entries) {
        let entriesMark = entries;
        let countY = 0;
        let countX = 10;
        ctx.beginPath();
        ctx.font = '20px "Oswald", sans-serif'
        for(let i = 10; i<=80; i+=10){
            ctx.fillText(`-${countY}`,blocks(4), canvas.height - blocks(i));
            countY+=5;
        }
        for(let i = 0; i<=9; i++){
            ctx.fillText(` ${entriesMark[i][0].slice(11,16)}`, blocks(countX), canvas.height - blocks(7));
            countX+=10;
        }
        ctx.stroke();
    }

    function drawChart(entries){
        count = 10;
        let entriesChart = entries;
        let arrTemp = [];
        arrTemp = entriesChart.map((value) => Math.floor(value[1] - 273.15));
        ctx.beginPath();
        ctx.moveTo(blocks(10), blocks(70));
        ctx.strokeStyle = "blue";
        ctx.lineWidth = '6';

        for(let i = 0; i<=9; i++) {
            if(arrTemp[i] < 0) arrTemp[i] = arrTemp[i]* -1;
            ctx.fillText(`-${arrTemp[i]}`, blocks(count), blocks(70) - blocks(2*arrTemp[i] + 2) );
            ctx.lineTo(blocks(count), blocks(70) - blocks(2*arrTemp[i]) );
            ctx.arc(blocks(count), blocks(70) - blocks(2*arrTemp[i]), 5, 0, Math.PI*2, true);
            count+=10
        };

        ctx.stroke();
    }


// 5 days temperature table-------------------------------------------------

function createTemperatureTable (result) {
    let list = result.list;

    for (let i = 0; i < list.length; i++) {
        tempTr[i].innerHTML = `<th>${list[i].dt_txt.slice(0,10)}</th>
        <th>${list[i].dt_txt.slice(11)}</th>
        <th>${Math.floor(list[i].main.temp - 273.15)}&#176C <img src="https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png" alt="weatherIcon"></th>
        <th>Скорость: ${list[i].wind.speed} метра/сек<br>Направление: ${list[i].wind.deg} градусов</th>
        <th>${list[i].clouds.all}%</th>`
    }
}

// details tabs ----------------------------------------
    let activeTab = 0;
    function showDetailTabs (activeTab){
        for(let i = 0; i < detailsItem.length; i++) {
            detailsItem[i].classList.add('display_none');
            detailsNavItem[i].classList.remove('details-nav-item-active');

        };
       
        detailsItem[activeTab].classList.remove('display_none');
        detailsNavItem[activeTab].classList.add('details-nav-item-active');


    };

    detailsNav.addEventListener('click', event => {
        let target = event.target;
        event.preventDefault();

        for(let i = 0; i< detailsNavItem.length; i++) {
            if(target.classList.contains('details-nav-item') && target === detailsNavItem[i] ) {
                showDetailTabs(i)
            }
        }
    });

    showDetailTabs(activeTab);

});



