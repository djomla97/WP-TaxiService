/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

$(document).ready(function () {

    // sakrijemo na pocetku div-ove
    $('#home-customer-view').css('display', 'none');

    // ako klikne na login
    $('#loginButton').click(function (e) {
        e.preventDefault();

        // ovde ide provera za login
        $.get('/api/users', function (data) {
            console.log(data);
        });

        $('#login-register-view').slideUp(300);
        $('#login-register-view').hide(1);

        $('#home-customer-view').show();
    });

    // kad klikne na logout, odjavi i ocisti cookies?
    $('#logoutButton').click(function (e) {
        e.preventDefault();

        // logika za logout

        $('#login-register-view').show(1);
        $('#login-register-view').slideDown(500);

        $('#home-customer-view').hide(1);

    });

    // Klikom na register radimo validaciju i saljemo korisnika
    $('#registerButton').click(function () {
        event.preventDefault();

        tryAddUser();

    });


}); // on ready


// helper funkcija za validaciju
function tryAddUser() {

    // promises, promises .. :)
    $.when(checkEmail(), checkUsername()).done(function (emailFound, usernameFound) {
        //console.log(emailFound[0]); //debug
        //console.log(usernameFound[0]); //debug

        let canAddUser = true;
        let checkedRadioButtons = 0;

        // provera inputa
        $('#register-form input').each(function () {

            // radio button
            if ($(this).attr('id').indexOf('radio') >= 0) {
                if ($(this).is(':checked')) {
                    checkedRadioButtons++;
                }
            }

            // text input        
            if (!$(this).val()) {

                $(this).next().show();
                $(this).next().addClass('found-check');
                $(this).next().text('This field cannot be left empty.');

            } else {

                if (!$(this).next().hasClass('not-available')) {

                    $(this).next().hide();
                    $(this).next().text('');
                    $(this).next().removeClass('found-check');
                }
            }
        });

        // radio button provera
        if (checkedRadioButtons === 0) {
            $('#radio-check').show();
            $('#radio-check').addClass('found-check');
            $('#radio-check').text('Please select a gender.');

        } else {
            $('#radio-check').hide();
            $('#radio-check').text('');
            $('#radio-check').removeClass('found-check');
        }

        // EMAIL
        if (emailFound[0] === "Found") {
            $('#email-check').show();
            $('#email-check').addClass('not-available');
            $('#email-check').text('Email is not available.');

        } else {

            $('#email-check').hide();
            $('#email-check').text('');
            $('#email-check').removeClass('not-available');

            if (!($('#email').val().indexOf('@') >= 0)) {
                $('#email-check').show();
                $('#email-check').addClass('found-check');
                $('#email-check').text('You must have a @ in the email address.');
            } else {
                $('#email-check').hide();
                $('#email-check').text('');
                $('#email-check').removeClass('found-check');
            }
        }

        // USERNAME
        if (usernameFound[0] === "Found") {
            $('#username-check').show();
            $('#username-check').addClass('not-available');
            $('#username-check').text('Username is taken.');
        } else {
            $('#username-check').hide();
            $('#username-check').text('');
            $('#username-check').removeClass('not-available');
        }

        // sure thing
        if (emailFound[0] == "Found" || usernameFound[0] == "Found") {
            canAddUser = false;
        }

        // hack sa klasom
        $('#register-form p').each(function () {
            if ($(this).hasClass('found-check') || $(this).hasClass('not-available')) {
                canAddUser = false;
            }
        });

        if (canAddUser) {

            var newUser = {};

            // novi korisnik
            newUser.Username = $('#username').val();
            newUser.Password = $('#password').val();
            newUser.FirstName = $('#firstName').val();
            newUser.LastName = $('#lastName').val();
            newUser.Email = $('#email').val();
            newUser.ContactPhone = $('#phone').val();
            newUser.JMBG = $('#jmbg').val();
            newUser.Gender = $('input[name=radioGender]:checked').val();

            // Ajax za dodavanje korisnika
            $.ajax({
                method: "POST",
                url: "/api/users",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(newUser)

            }).done(function (data) {
                console.log("Data: " + data);

            });

        } else {
            console.log('Ne moze da doda korisnika.'); // debug
        }

    });

}

// deffered
function checkEmail() {
    return $.ajax({
        method: "POST",
        url: "api/validate/email",
        contentType: 'application/json',
        data: JSON.stringify($('#email').val())
    });
}

// deffered
function checkUsername() {
    return $.ajax({
        method: "POST",
        url: "api/validate/Username",
        contentType: 'application/json',
        data: JSON.stringify($('#username').val())
    });
}
