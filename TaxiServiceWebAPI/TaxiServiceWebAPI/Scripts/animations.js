/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

$(document).ready(function () {

    // neka animacija .. nesto .. kao
    $('#login-form-view').hover(function (e) {
        e.preventDefault();

        $('#register-form-view').css('opacity', 0.5);
        $(this).css('opacity', 1);
    }, function (e) {
        e.preventDefault();

        $('#register-form-view').css('opacity', 1);

    });

    // animacija za focus 
    $('#register-form-view').hover(function (e) {
        e.preventDefault();

        $('#login-form-view').css('opacity', 0.5);
        $(this).css('opacity', 1);
    }, function (e) {
        e.preventDefault();

        $('#login-form-view').css('opacity', 1);

        });

    // Customer orders ride
    $('#orderRideButton').click(function () {
        $('#rides-table').fadeOut('600', function () {
            $('#order-ride-div').fadeIn('500');
            $('#orderRideButtonDiv').hide();
            $('#seeRidesDiv').show();
        });
    });

    // Customer goes back to rides
    $('#seeRidesButton').click(function () {
        $('#order-ride-div').fadeOut('600', function () {
            $('#rides-table').fadeIn('500');
            $('#seeRidesDiv').hide();
            $('#orderRideButtonDiv').show();
        });
    });

});



