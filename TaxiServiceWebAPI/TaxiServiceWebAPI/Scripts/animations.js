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

});



