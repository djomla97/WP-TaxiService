/*
 * Author: Mladen Milosevic
 * Date: 23.06.2018
 */

var long = 19.837059974670407;
var lati = 45.251929952692876;

$(document).ready(function () {

    getLocation();
    $('#map').hide();

    var map;
    setTimeout(function () {

        map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([long, lati]),
                zoom: 14
            })
        });

        map.on('click', function (evt) {
            let lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            let clickedLon = lonlat[0];
            let clickedLat = lonlat[1];
            console.log('Lon: ' + lon);
            console.log('Lat: ' + lat);
        });

        

    }, 3000);

    
});

// source: https://www.w3schools.com/Html/html5_geolocation.asp
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('Geolocation is not supported by your browser');
    }
}

function showPosition(position) {
    long = position.coords.longitude;
    lati = position.coords.latitude;
}
