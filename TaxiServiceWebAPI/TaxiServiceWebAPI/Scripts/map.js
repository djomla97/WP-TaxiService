/*
 * Author: Mladen Milosevic
 * Date: 23.06.2018
 */


var globLong = 19.837059974670407;
var globLat = 45.251929952692876;

var map;
var clickedMarkerLayer, startMarkerLayer;




$(document).ready(function () {

    $('#map').data('loaded', false);

    $('#addRideButton').click(function () {

        if (!$('#addRideFormDiv').find('div#mapDiv').length) {
            mapDiv = $('#mapDiv').detach();
            $('#addRideFormDiv').append(mapDiv);
        }

        $('#map').data('loaded', true);
        $('#map').data('location', 'addRide');
        setMapSize(520, 700);
        loadMap();        
    });

    $('#addNewDriverButton').click(function () {
        if (!$('#register-new-driver-form-view').find('div#mapDiv').length) {
            mapDiv = $('#mapDiv').detach();
            $('#register-new-driver-form-view').append(mapDiv);
        }

        $('#map').data('loaded', true);
        $('#map').data('location', 'addNewDriver');
        setMapSize(520, 700);
        loadMap();
    });

    $('#orderRideButton').click(function () {
        if (!$('#orderRideFormDiv').find('div#mapDiv').length) {
            mapDiv = $('#mapDiv').detach();
            $('#orderRideFormDiv').append(mapDiv);
        }

        $('#map').data('loaded', true);
        $('#map').data('location', 'orderRide');
        setMapSize(520, 700);
        loadMap();
    });
    
});


// layers je niz, u njega stavljam layere sa koordinatama koji se ucitavaju na mapu
function loadMap() {

    if ($('#map').data('loaded'))
        $('#map').empty();

    setTimeout(function () {

        map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([globLong, globLat]),
                zoom: 14
            })
        });     

        map.on('click', function (evt) {
            let lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            let clickedLon = lonlat[0];
            let clickedLat = lonlat[1];
            console.log('Lon: ' + clickedLon);
            console.log('Lat: ' + clickedLat);

            map.removeLayer(clickedMarkerLayer);
            let clickedPosition = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([clickedLon, clickedLat]))
            });

            clickedPosition.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    color: '#0f7ac6',
                    crossOrigin: 'anonymous',
                    src: '/Content/images/dot.png'
                }))
            }));

            clickedMarkerLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [clickedPosition]
                })
            });

            map.addLayer(clickedMarkerLayer);

            // input menjam u zavisnosti od clicka
            $.get(`https://nominatim.openstreetmap.org/reverse.php?format=json&lat=${clickedLat}&lon=${clickedLon}`, function (response) {

                let street = '';
                if (typeof response.address.road !== 'undefined')
                    street = response.address.road;
                if (typeof response.address.house_number !== 'undefined')
                    street = street + ` ${response.address.house_number}`;

                let city = response.address.city;
                let zipcode = response.address.postcode;

                // input fields change
                if ($('#map').data('location') === 'addRide') {
                    // postavi add ride input
                    $('#addRideStreet').val(street);
                    $('#addRideCity').val(city);
                    $('#addRideZipCode').val(zipcode);
                    $('#addRideX').val(response.lat);
                    $('#addRideY').val(response.lon);
                } else if ($('#map').data('location') === 'addNewDriver') {
                    $('#addDriverStreet').val(street);
                    $('#addDriverCity').val(city);
                    $('#addDriverZipCode').val(zipcode);
                    $('#addNewDriverX').val(response.lat);
                    $('#addNewDriverY').val(response.lon);
                } else if ($('#map').data('location') === 'orderRide') {
                    $('#orderRideStreet').val(street);
                    $('#orderRideCity').val(city);
                    $('#orderRideZipCode').val(zipcode);
                    $('#orderRideX').val(response.lat);
                    $('#orderRideY').val(response.lon);
                } else if ($('#map').data('location') === 'successRideModal') {
                    $('#successStreet').val(street);
                    $('#successCity').val(city);
                    $('#successZipCode').val(zipcode);
                    $('#successX').val(response.lat);
                    $('#successY').val(response.lon);
                } else if ($('#map').data('location') === 'editOrderRide') {
                    $('#editOrderRideStreet').val(street);
                    $('#editOrderRideCity').val(city);
                    $('#editOrderRideZipCode').val(zipcode);
                    $('#editOrderRideX').val(response.lat);
                    $('#editOrderRideY').val(response.lon);
                } else if ($('#map').data('location') === 'editDriver') {
                    $('#saveChangesButton').prop('disabled', false);
                    $('#editStreet').val(street);
                    $('#editCity').val(city);
                    $('#editZipCode').val(zipcode);
                    $('#editDriverX').val(response.lat);
                    $('#editDriverY').val(response.lon);
                }
                

                
            });

        });

    }, 1000);

}

function setMapSize(width, height) {
    console.log('changing map size');
    $('#map').css('width', width);
    $('#map').css('height', height);
}
