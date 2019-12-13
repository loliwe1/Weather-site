'use strict'

window.addEventListener('load', function(){
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