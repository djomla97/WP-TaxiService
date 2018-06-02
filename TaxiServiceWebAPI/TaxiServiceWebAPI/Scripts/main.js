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

        // logika za logout ovde ide

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

    // ... promises, promises :)
    $.when(checkEmail(), checkUsername()).done(function (emailFound, usernameFound) {

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
        if (checkedRadioButtons === 0) 
            addValidationError('radio', 'found-check', 'Please select a gender.');
         else 
            removeValidationError('radio', 'found-check');
        

        // Email check
        if (emailFound[0] === "Found") {
            addValidationError('email', 'not-available', 'Email is not available.');
        } else {

            removeValidationError('email', 'not-available');

            if (!($('#email').val().indexOf('@') >= 0)) 
                addValidationError('email', 'found-check', 'You must have a @ in the email address.');
            else 
                removeValidationError('email', 'found-check');
        }

        // Username check
        if (usernameFound[0] === "Found")
            addValidationError('username', 'not-available', 'Username is taken.');
        else
            removeValidationError('username', 'not-available');

        
        // hack sa klasom
        $('#register-form p').each(function () {
            if ($(this).hasClass('found-check') || $(this).hasClass('not-available')) {
                canAddUser = false;
            }
        });

        // sure thing
        if (emailFound[0] == "Found" || usernameFound[0] == "Found")
            canAddUser = false;

        // ako moze, neka doda aj'
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

// dry
function removeValidationError(checkName, className) {

    $(`#${checkName}-check`).hide();
    $(`#${checkName}-check`).text('');
    $(`#${checkName}-check`).removeClass(className);

}

// dry
function addValidationError(checkName, className, message) {

    $(`#${checkName}-check`).show();
    $(`#${checkName}-check`).addClass(className);
    $(`#${checkName}-check`).text(message);

}