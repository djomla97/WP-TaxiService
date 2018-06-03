/*
 * Author: Mladen Milosevic
 * Date: 01.06.2018
 * Description: Kao 'real-time' validacija unosa
 */

$(document).ready(function () {

    $('#username-found').hide();
    $('#email-found').hide();

    // Username validacija
    $('#username').on('input', function () {

        let username = $(this).val();
        
        $.ajax({
            method: "POST",
            url: "api/validate/Username",
            contentType: 'application/json',
            data: JSON.stringify(username)
        }).done(function (response) {

            //console.log("Response: " + response);

            if (response === "Found") {
                $('#username-check').show();
                $('#username-check').addClass('not-available');
                $('#username-check').text('Username is taken.');
            } else {         
                $('#username-check').hide();
                $('#username-check').text('');
                $('#username-check').removeClass('not-available');
            }

        });
    });

    // Email validacija
    $('#email').on('input', function () {

        let email = $(this).val();

        $.ajax({
            method: "POST",
            url: "api/validate/email",
            contentType: 'application/json',
            data: JSON.stringify(email)
        }).done(function (response) {

            //console.log("Response: " + response);

            if (response === "Found") {
                $('#email-check').show();
                $('#email-check').addClass('not-available');
                $('#email-check').text('Email is not available.');
            } else {      
                $('#email-check').hide();
                $('#email-check').text('');
                $('#email-check').removeClass('not-available');
            }

        });
    });

    // Edit email validacija
    $('#editEmail').on('input', function () {

        let email = $(this).val();

        if (email !== $('#info-email')) {

            $.ajax({
                method: "POST",
                url: "api/validate/email",
                contentType: 'application/json',
                data: JSON.stringify(email)
            }).done(function (response) {

                //console.log("Response: " + response);

                if (response === "Found") {
                    $('#email-form p').show();
                    $('#email-form p').addClass('not-available');
                    $('#email-form p').text('Email is not available.');
                } else {
                    $('#email-form p').hide();
                    $('#email-form p').text('');
                    $('#email-form p').removeClass('not-available');
                }

            });
        }
    });

    // Edit username validacija
    $('#editUsername').on('input', function () {

        let username = $(this).val();
        console.log(username);

        if (username !== $('#info-username')) {

            $.ajax({
                method: "POST",
                url: "api/validate/username",
                contentType: 'application/json',
                data: JSON.stringify(username)
            }).done(function (response) {

                //console.log("Response: " + response);

                if (response === "Found") {
                    $('#email-form p').show();
                    $('#email-form p').addClass('not-available');
                    $('#email-form p').text('Username is not available.');
                } else {
                    $('#email-form p').hide();
                    $('#email-form p').text('');
                    $('#email-form p').removeClass('not-available');
                }

            });
        }
    });



});