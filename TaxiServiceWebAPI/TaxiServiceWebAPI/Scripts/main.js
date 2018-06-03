/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

/*
 * TODO: Implement api/edit for user and maybe email validation for a '.' after '@'
 *       
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

        $('#login-register-view').show();
        $('#login-register-view').slideDown(500);

        $('#home-customer-view').hide();

    });

    // Klikom na register radimo validaciju i saljemo korisnika
    $('#registerButton').click(function () {
        event.preventDefault();

        tryAddUser();

    });

    // otvanje modala
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
        if (!$('#edit-form').html()) {
            // https://img.devrant.com/devrant/rant/r_115445_YcizR.jpg
            $('#user-info span').each(function () {
                if (($(this).text().indexOf('Gender') >= 0)) {
                    if ($(this).next().text() === "Male") {
                        $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label class="radio-inline"><input type="radio" name="editRadioGender" value="Male" checked/> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" /> Female </label></div></div>`);
                    } else {
                        $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label class="radio-inline"><input type="radio" name="editRadioGender" value="Male" /> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" checked/> Female </label></div></div>`);
                    }
                } else {
                    $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label>${$(this).text()}</label><input type="text" class="form-control" id="edit${$(this).text().replace(/ /g, '')}" value="${$(this).next().text()}" /><p class="found-p" id="edit${$(this).text().replace(/ /g, '')}-check" ></p></div></div>`);
                }

            });
        }

        // prikazemo edit formu
        $('#edit-form').show();
    });

    // Back to info - modal 
    $('#goBackToInfoButton').click(function () {
        event.preventDefault();

        // podesi modal na View user info
        $('#edit-form').hide();
        $('#modal-title').text('User information');
        $('#editInfoButton').show();
        $('#goBackToInfoButton').hide();
        $('#saveChangesButton').hide();
        $('#closeModalButton').removeClass('btn-secondary');
        $('#closeModalButton').addClass('btn-primary');
        $('#user-info').show();
    });

    // Save changes from edit-form
    $('#saveChangesButton').click(function () {
        tryEditUser();
    });



}); // on ready

function tryEditUser() {

    $.when(checkEmail($('#editEmail').val()), checkUsername($('#editUsername').val())).done(function (emailFound, usernameFound) {

        let canEditUser = true;
        let foundEmail = emailFound[0];
        let foundUsername = usernameFound[0];

        // provera da li je prazno
        $('#edit-form input').each(function () {
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

        // Email check
        if (emailFound[0] === "Found") {
            if ($('#editEmail').val() === $('#info-email').text()) {
                removeValidationError('editEmail', 'not-available');
                foundEmail = 'Old one';
            } else {
                addValidationError('editEmail', 'not-available', 'Email is not available.');
            }
        } else {

            removeValidationError('editEmail', 'not-available');

            console.log($('#editEmail').val());

            if (!($('#editEmail').val().indexOf('@') >= 0))
                addValidationError('editEmail', 'found-check', 'You must have a @ in the email address.');
            else
                removeValidationError('editEmail', 'found-check');
        }

        // Username check
        if (usernameFound[0] === "Found") {
            if ($('#editUsername').val() == $('#info-username').text()) {
                removeValidationError('editUsername', 'not-available');
                foundUsername = 'Old one';
            } else {
                addValidationError('editUsername', 'not-available', 'Username is taken.');
            }

        } else {
            if (!$('#username').val())
                addValidationError('editUsername', 'not-available', 'This field cannot be left empty.');
            else
                removeValidationError('editUsername', 'not-available');
        }

        // hack sa klasom
        $('#edit-form p').each(function () {
            if ($(this).hasClass('found-check') || $(this).hasClass('not-available')) {
                canEditUser = false;
            }
        });

        // sure thing
        if (foundEmail === "Found" || foundUsername === "Found")
            canEditUser = false;

        if (canEditUser) {
            let editedUser = {};

            editedUser.Username = $('#editUsername').val();
            editedUser.FirstName = $('#editFirstname').val();
            editedUser.LastName = $('#editLastname').val();
            editedUser.Email = $('#editEmail').val();
            editedUser.ContactPhone = $('#editPhone').val();
            editedUser.JMBG = $('#editJMBG').val();
            editedUser.Gender = $('#edit').val();

            console.log(JSON.stringify(editedUser));

        } else {
            console.log('Ne moze');
        }


    });

}


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
                $('#user-info').append(`<span class="user-key">Username</span>: <p id="info-username">${user.Username}</p>`);
                $('#user-info').append(`<span class="user-key">First name</span>: <p id="info-firstname">${user.FirstName}</p>`);
                $('#user-info').append(`<span class="user-key">Last name</span>: <p id="info-lastname">${user.LastName}</p>`);
                $('#user-info').append(`<span class="user-key">Email</span>: <p id="info-email">${user.Email}</p>`);
                $('#user-info').append(`<span class="user-key">JMBG</span>: <p id="info-jmbg">${user.JMBG}</p>`);
                $('#user-info').append(`<span class="user-key">Phone</span>: <p id="info-phone">${user.ContactPhone}</p>`);
                $('#user-info').append(`<span class="user-key">Gender</span>: <p id="info-gender">${user.Gender}</p>`);

                // abra kadabra
                $('#login-register-view').slideUp(300);
                $('#login-register-view').hide(1);

                $('#home-customer-view').show();

            } else {
                $('p.login-fail').css('text-weight', 'bold');
                $('p.login-fail').css('color', 'red');
                $('p.login-fail').text('Username and password do not match. Try again.');
            }
        });
    }
}

// helper funkcija za validaciju registracije
function tryAddUser() {

    // ... promises, promises :)
    $.when(checkEmail($('#email').val()), checkUsername($('#username').val())).done(function (emailFound, usernameFound) {

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

            let newUser = {};

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
function checkEmail(email) {
    return $.ajax({
        method: "POST",
        url: "api/validate/email",
        contentType: 'application/json',
        data: JSON.stringify(email)
    });
}

// deffered
function checkUsername(username) {
    return $.ajax({
        method: "POST",
        url: "api/validate/Username",
        contentType: 'application/json',
        data: JSON.stringify(username)
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