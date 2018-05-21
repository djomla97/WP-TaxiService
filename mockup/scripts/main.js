/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

/*jshint esversion: 6 */

function addNewUser() {

    let username = $('#username').val();
    let password = $('#password').val();

    let user = {
        'Username': username,
        'Password': password
    };

    console.log(JSON.stringify(user));
    
    $.ajax({
        type: 'POST',
        url: 'http://localhost:58775/api/values',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(user),
    }).done(function( msg ) {
        alert( "Data Saved: " + msg );
    });

    console.log(username + " " + password);
    
}