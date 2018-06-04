/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

/*
 * TODO: maybe email validation for a '.' after '@'       
 */

$(document).ready(function () {

    // sakrijemo na pocetku div-ove
    $('#home-customer-view').css('display', 'none');
    $('#goBackToInfoButton').css('display', 'none');
    $('#saveChangesButton').css('display', 'none');
    $('#edit-message-alert').css('display', 'none');
    $('#register-message-alert').css('display', 'none');

    // ako klikne na login
    $('#loginButton').click(function (e) {
        e.preventDefault();
        tryLoginUser();
    });

    // kad klikne na logout, odjavi i ocisti cookies?
    $('#logoutButton').click(function (e) {
        e.preventDefault();

        // logika za logout ovde ide
        $('#user-info').empty();
        $('#edit-form').empty();

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
        $('#edit-message-alert').hide();
        $('#user-info').empty();
        $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {

            updateUserInformation(user);

            console.log('Updated user info on modal.');

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
            console.log('Modal opened successfully.');
        });

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
        $('#edit-message-alert').hide();

        $('#closeModalButton').removeClass('btn-primary');
        $('#closeModalButton').addClass('btn-secondary');

        // update edit form
        updateEditForm();
        
        // prikazemo edit formu
        $('#edit-form').show();
    });

    // Back to info - modal 
    $('#goBackToInfoButton').click(function () {
        event.preventDefault();

        // podesi modal na View user info
        $('#edit-form').hide();
        $('#modalTitle').text('User information');
        $('#editInfoButton').show();
        $('#goBackToInfoButton').hide();
        $('#saveChangesButton').hide();
        $('#closeModalButton').removeClass('btn-secondary');
        $('#closeModalButton').addClass('btn-primary');
        $('#edit-message-alert').hide();
        $('#user-info').show();
    });

    // Save changes from edit-form
    $('#saveChangesButton').click(function () {
        tryEditUser();
    });



}); // on ready


/* Helper funkcije */

// Pokusava editovanje informacija korisnika ako je sve u formi dobro
function tryEditUser() {
    $.when(checkEmail($('#editEmail').val()), checkUsername($('#editUsername').val())).done(function (emailFound, usernameFound) {

        let canEditUser = true;
        let foundEmail = emailFound[0];
        let foundUsername = usernameFound[0];

        // provera da li je prazno
        $('#edit-form input').each(function () {
            // preskoci new password, optional je
            if ($(this).attr('id') == 'editPassword')
                return true;

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
            console.log('Info email:' + $('#info-email').text());
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
            if (!$('#editUsername').val())
                addValidationError('editUsername', 'found-check', 'This field cannot be left empty.');
            else
                removeValidationError('editUsername', 'found-check');
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
            editedUser.Gender = $('input[name=editRadioGender]:checked').val();
            editedUser.Password = $('#editPassword').val();

            $.ajax({                                
                method: 'PUT',
                url: '/api/users/' + $('#info-username').text(),
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(editedUser)
            }).success(function (user) {

                $('#edit-message-alert').show();
                $('#edit-message-alert').text('User information was edited successfully.');
                $('#edit-message-alert').delay(3000).slideUp(500);

                updateUserInformation(user);
            });

        } else {
            console.log('Cannot update');
        }


    });

}

// helper funkcija za validaciju login forme i login akcije
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
    loginUser.username = $('#loginUsername').val();
    loginUser.password = $('#loginPassword').val();

    let canLoginUser = true;
    // hack sa klasom
    $('#login-form p').each(function () {
        if ($(this).hasClass('found-check')) {
            canLoginUser = false;
        }
    });

    if (canLoginUser) {
        // poziv za login
        $.post('/api/users/login', loginUser, function (loggedIn) {
            // restart login/register vrednosti
            $('#loginUsername').val('');
            $('#loginPassword').val('');
            $('#register-form input').each(function () {
                $(this).val('');
            });

            console.log('Logged in: ' + loggedIn);

            if (loggedIn !== false) {

                // uzmemo tog korisnika i update UI
                $.get(`/api/users/${loginUser.username}`, function (user) {
                    console.log('Username: ' + user.Username);

                    $('#hello-message').text(`Hello, ${user.FirstName} ${user.LastName}`);
                    $('#loggedIn-username').text(`${user.Username}`);

                    // obrisemo postojece informacije za modal
                    $('#editInfoButton').show();
                    $('#goBackToInfoButton').hide();
                    $('#saveChangesButton').hide();

                    $('#closeModalButton').addClass('btn-primary');
                    $('#closeModalButton').removeClass('btn-secondary');

                    // better safe than sure
                    $('#user-info').empty();
                    $('#edit-form').empty();

                    // abra kadabra
                    $('#login-register-view').slideUp(300);
                    $('#login-register-view').hide();

                    $('#home-customer-view').show();

                });

            } else {
                $('p.login-fail').css('text-weight', 'bold');
                $('p.login-fail').css('color', 'red');
                $('p.login-fail').text('Username and password do not match. Try again.');
            }

        });

    }
}

// helper funkcija za validaciju register forme i registera
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
                url: "/api/users",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(newUser)

            }).done(function (data) {
                // ispraznimo sve
                $('#register-form input').each(function () {
                    $(this).val('');
                });
                // kazemo da moze da se loguje
                $('#register-message-alert').text('Success! You can now log in to your account.');
                $('#register-message-alert').show();
                $('#register-message-alert').delay(3000).slideUp(500);
            });

        } else {
            console.log('Ne moze da doda korisnika.'); // debug
        }

    });

}

// deffered
function checkEmail(email) {
    return $.ajax({
        method: "GET",
        url: "api/validate/email?email=" + email
    });
}

// deffered
function checkUsername(username) {
    return $.ajax({
        method: "GET",
        url: "api/validate/username?username=" + username
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

function updateUserInformation(user) {
    // update UI
    $('#hello-message').text(`Hello, ${user.FirstName} ${user.LastName}`);
    $('#loggedIn-username').text(user.Username);

    $('#user-info').empty();
    // update informacija editovanog korisnika
    $('#user-info').append(`<span class="user-key">Username</span>: <p id="info-username">${user.Username}</p>`);
    $('#user-info').append(`<span class="user-key">First name</span>: <p id="info-firstname">${user.FirstName}</p>`);
    $('#user-info').append(`<span class="user-key">Last name</span>: <p id="info-lastname">${user.LastName}</p>`);
    $('#user-info').append(`<span class="user-key">Email</span>: <p id="info-email">${user.Email}</p>`);
    $('#user-info').append(`<span class="user-key">JMBG</span>: <p id="info-jmbg">${user.JMBG}</p>`);
    $('#user-info').append(`<span class="user-key">Phone</span>: <p id="info-phone">${user.ContactPhone}</p>`);
    $('#user-info').append(`<span class="user-key">Gender</span>: <p id="info-gender">${user.Gender}</p>`);

    if (user.Role == 'Dispatcher' || user.Role == 'Driver') {
        $('#user-info').append(`<span class="user-key">Role</span>: <p id="info-gender">${user.Role}</p>`);
    }

}

function updateEditForm() {
    $('#edit-form').empty();
    // bar radi :)
    // https://img.devrant.com/devrant/rant/r_115445_YcizR.jpg
    $('#user-info span').each(function () {
        if (($(this).text().indexOf('Role') >= 0))
            return true;

        if (($(this).text().indexOf('Gender') >= 0)) {
            if ($(this).next().text() === "Male") {
                $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label class="radio-inline user-key"><input type="radio" name="editRadioGender" value="Male" checked/> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" /> Female </label></div></div>`);
            } else {
                $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label class="radio-inline user-key"><input type="radio" name="editRadioGender" value="Male" /> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" checked/> Female </label></div></div>`);
            }
        } else {
            $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label id="edit-form-label" class="user-key">${$(this).text()}</label><input type="text" class="form-control" id="edit${$(this).text().replace(/ /g, '')}" value="${$(this).next().text()}" /><p class="found-p" id="edit${$(this).text().replace(/ /g, '')}-check" ></p></div></div>`);
        }
    });
    // za Password
    $('#edit-form').append(`<hr><div class="form-group"><div class="col-sm-12"><input type="text" class="form-control" id="editPassword" placeholder="New password (optional)" /></div></div>`);



}