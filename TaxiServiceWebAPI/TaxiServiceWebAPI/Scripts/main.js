/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

/*
 * TODO: Implement Submit changes to profile, Go back to info page profile in modal
 *       and validation when changing information on user, so no empty, no missing chars like '@'
 */

$(document).ready(function () {

    // sakrijemo na pocetku div-ove
    $('#home-customer-view').css('display', 'none');
    $('#goBackToInfoButton').css('display', 'none');
    $('#saveChangesButton').css('display', 'none');

    // ako klikne na login
    $('#loginButton').click(function (e) {
        e.preventDefault();

        tryLoginUser();
  
    });

    // kad klikne na logout, odjavi i ocisti cookies?
    $('#logoutButton').click(function (e) {
        e.preventDefault();

        // logika za logout ovde ide
        $('#user-info').html('');
        $('#edit-form').html('');

        $('#login-register-view').show(1);
        $('#login-register-view').slideDown(500);

        $('#home-customer-view').hide(1);

    });

    // Klikom na register radimo validaciju i saljemo korisnika
    $('#registerButton').click(function () {
        event.preventDefault();

        tryAddUser();

    });

    // otvaranje modala
    $('#checkProfileButton').click(function () {

        // restartujemo modal, da ne prikazuje edit stranicu
        $('#editInfoButton').show();
        $('#goBackToInfoButton').hide();
        $('#saveChangesButton').hide();

        $('#closeModalButton').addClass('btn-primary');
        $('#closeModalButton').removeClass('btn-secondary');

        $('#edit-form').hide();
        $('#edit-form').empty();
        $('#user-info').show();
        
        // prikazemo modal
        $('#profileModal').modal('show');
    });

    // kad kliknemo na edit u modalu
    $('#editInfoButton').click(function () {
        event.preventDefault();

        // promenimo modal na edit
        $('#user-info').hide();
        $('#modalTitle').text('Edit profile');
        $('#editInfoButton').hide();
        $('#goBackToInfoButton').show();
        $('#saveChangesButton').show();

        $('#closeModalButton').removeClass('btn-primary');
        $('#closeModalButton').addClass('btn-secondary');

        // bar radi :)
        // https://img.devrant.com/devrant/rant/r_115445_YcizR.jpg
        $('#user-info span').each(function () {
            if (($(this).text().indexOf('Gender') >= 0)) {                
                if ($(this).next().text() === "Male") {
                    console.log('prodje gender');
                    $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label class="radio-inline"><input type="radio" name="editRadioGender" value="Male" checked/> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" /> Female </label></div></div>`);
                } else {
                    $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label class="radio-inline"><input type="radio" name="editRadioGender" value="Male" /> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" checked/> Female </label></div></div>`);
                } 
            } else {
                console.log('prodje text');
                $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label for"edit${$(this).text().replace(/ /g, '')}">${$(this).text()}</label><input type="text" class="form-control" id="edit${$(this).text().replace(/ /g, '')}" value="${$(this).next().text()}" /></div></div>`);
            }
        });

        // prikazemo edit formu
        $('#edit-form').show();
    });



}); // on ready


// helper funkcija za validaciju login
function tryLoginUser() {

    // napravimo dummy usera
    let loginUser = {};

    // username
    if (!$('#loginUsername').val())
        addValidationError('loginUsername', 'found-check', 'You must enter a username');
    else
        removeValidationError('loginUsername', 'found-check');

    // password
    if (!$('#loginPassword').val())
        addValidationError('loginPassword', 'found-check', 'You must enter a password');
    else
        removeValidationError('loginPassword', 'found-check');

    // dummy user za login
    loginUser.Username = $('#loginUsername').val();
    loginUser.Password = $('#loginPassword').val();

    let canLoginUser = true;
    // hack sa klasom
    $('#login-form p').each(function () {
        if ($(this).hasClass('found-check')) {
            canLoginUser = false;
        }
    });

    if (canLoginUser) {
        // poziv za login
        $.ajax({
            method: "POST",
            url: "/api/users/login",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(loginUser)

        }).done(function (user) {

            // restart login vrednosti
            $('#loginUsername').val('');
            $('#loginPassword').val('');

            if (user.Username !== null) {

                $('#hello-message h1').text(`Hello, ${user.FirstName} ${user.LastName}`);

                // obrisemo postojece informacije za modal
                $('#editInfoButton').show();
                $('#goBackToInfoButton').hide();
                $('#saveChangesButton').hide();

                $('#closeModalButton').addClass('btn-primary');
                $('#closeModalButton').removeClass('btn-secondary');

                $('#edit-form').hide();
                $('#user-info').show();

                // ne smeju drugi korisnici da dobiju informacije od prethodnog
                $('#user-info').empty();
                $('#edit-form').empty();

                // update informacija trenutnog korisnika
                $('#user-info').append(`<span class="user-key">Username</span>: <p>${user.Username}</p>`);
                $('#user-info').append(`<span class="user-key">First name</span>: <p>${user.FirstName}</p>`);
                $('#user-info').append(`<span class="user-key">Last name</span>: <p>${user.LastName}</p>`);
                $('#user-info').append(`<span class="user-key">Email</span>: <p>${user.Email}</p>`);
                $('#user-info').append(`<span class="user-key">JMBG</span>: <p>${user.JMBG}</p>`);
                $('#user-info').append(`<span class="user-key">Phone</span>: <p>${user.ContactPhone}</p>`);
                $('#user-info').append(`<span class="user-key">Gender</span>: <p>${user.Gender}</p>`);

                // abra kadabra
                $('#login-register-view').slideUp(300);
                $('#login-register-view').hide(1);

                $('#home-customer-view').show();

            } else {
                // ovde neki alert da su lose informacije unete
                console.log('Username is null'); // debug
            }

        });

    }

}

// helper funkcija za validaciju registracije
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
        if (usernameFound[0] === "Found") {
            addValidationError('username', 'not-available', 'Username is taken.');
        } else {
            if (!$('#username').val())
                addValidationError('username', 'not-available', 'This field cannot be left empty.');
            else
                removeValidationError('username', 'not-available');
        }
        
        // hack sa klasom
        $('#register-form p').each(function () {
            if ($(this).hasClass('found-check') || $(this).hasClass('not-available')) {
                canAddUser = false;
            }
        });

        // sure thing
        if (emailFound[0] === "Found" || usernameFound[0] === "Found")
            canAddUser = false;

        // ako moze, neka doda
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
                url: "/api/users/register",
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