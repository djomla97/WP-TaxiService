/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

$(document).ready(function () {

    // sakrijemo sve div-ove koji nam ne trebaju kad se stranica ucita
    $('#home-view').hide();
    $('#profileModal').hide();
    $('#addRideButtonDiv').hide();
    $('#orderRideButtonDiv').hide();
    $('#orderRidesTableDiv').hide();
    $('#seeRidesButtonDiv').hide();
    $('#no-rides-message').hide();
    $('#commentRideModal').hide(); 
    $('#editOrderRideModal').hide();
    $('#rideModal').hide();
    $('#seeAllRidesButtonDiv').hide();
    $('#seeDispatcherRidesButtonDiv').hide();
    $('#addRideFormDiv').hide();

    // pokusaj ulogovati korisnika iz cookie
    let loggedInUsername = getCookie('loggedInCookie');

    if (loggedInUsername !== null) {
        loginFromCookie(loggedInUsername);
    } else {
        $('#login-register-view').show();
    }

    // ako klikne na login
    $('#loginButton').click(function (e) {
        e.preventDefault();
        removeValidationErrors('register');
        tryLoginUser();
    });

    // kad klikne na logout, odjavi i ocisti cookies?
    $('#logoutButton').click(function (e) {
        e.preventDefault();

        // neka logika za logout ???
        eraseCookie('loggedInCookie');
        console.log('Cookie cleared.');
        $('#user-info').empty();
        $('#edit-form').empty();
        $('#order-rides-table-body').empty();
        $('#rides-table-body').empty();
        $('#orderRideMark').off('click');
        $('#addRideFormDiv').hide();

        $('#login-register-view').show();
        $('#login-register-view').slideDown(500);
        $('#home-view').hide();
    });

    // Klikom na register radimo validaciju i saljemo korisnika
    $('#registerButton').click(function () {
        event.preventDefault();
        removeValidationErrors('login');
        $('p.login-fail').hide();
        tryAddUser();
    });

    /* USER INFORMATION MODAL */
    // otvanje modala
    $('#checkProfileButton').click(function () {
        $('#edit-message-alert').hide();
        $('#user-info').empty();
        $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {

            updateUserInformation(user);

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

    });

    // kad kliknemo na edit u modalu
    $('#editInfoButton').click(function () {
        event.preventDefault();

        // promenimo modal na edit
        $('#user-info').hide();
        $('#modalTitle').html('<i class="fas fa-address-card"></i>  Edit profile');
        $('#editInfoButton').hide();
        $('#goBackToInfoButton').show();
        $('#saveChangesButton').show();
        $('#edit-message-alert').hide();

        $('#closeModalButton').removeClass('btn-primary');
        $('#closeModalButton').addClass('btn-secondary');

        // update edit form
        updateEditForm();

        // ne dozvoli izmenu ako nije nista izmenjeno
        $('#saveChangesButton').prop('disabled', true);

        // dodamo event listener na promene u input
        $('form#edit-form :input').on('input', function () {
            $('#saveChangesButton').prop('disabled', false);
        });

        // prikazemo edit formu
        $('#edit-form').show();
    });

    // Back to info - modal 
    $('#goBackToInfoButton').click(function () {
        event.preventDefault();

        // podesi modal na View user info
        $('#edit-form').hide();
        $('#modalTitle').html('<i class="fas fa-address-card"></i>  User information');
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
        event.preventDefault();
        if (!$('#saveChangesButton').prop('disabled'))
            tryEditUser();
    });

    // see rides button click
    $('#seeRidesButton').click(function () {
        clearForm('order-ride-form');
        $('#orderRideFormDiv').fadeOut('500', function () {            
            $('#ridesTableDiv').fadeIn('500');
            $('#seeRidesButtonDiv').hide();
            $('#orderRideButtonDiv').show();
            $('#addRideFormDiv').hide();
            // provera sadrzaja tabela
            checkRidesTables();
        });
    });

    /* ORDER RIDE */
    // order ride button click
    $('#orderRideButton').click(function () {
        $('#orderRidesTableDiv').fadeOut('500', function () {
            $('#ridesTableDiv').hide();
            $('#orderRideFormDiv').fadeIn('500');
            $('#orderRideButtonDiv').hide();
            $('#seeRidesButtonDiv').show();
            $('#no-rides-message').hide();
            $('#addRideFormDiv').hide();
        });
    });

    // submit ride form
    $('#submitRideButton').click(function () {
        event.preventDefault();
        orderRide();
    });

    $('#closeCommentRideModal').click(function () {
        event.preventDefault();
        $('textarea#rideCommentText').val('');
        $(this).next().attr('id', 'confirmCancel');
    });

    /* DISPATCHER BUTTONS */
    /* Dispatcher see all rides in system option */
    $('#seeAllRidesButton').click(function (e) {
        e.preventDefault();
        console.log('Getting all rides in the system ...');
        $('#no-rides-message').hide();
        $('#addRideButtonDiv').show();
        $('#addRideFormDiv').hide();
        showAllRides();
    });

    $('#seeDispatcherRidesButton').click(function (e) {
        e.preventDefault();
        console.log('Showing all dispatcher rides');
        $('#no-rides-message > h3').text('We\'re getting your rides ready. Please be patient.');
        $('#order-rides-table-body').empty();
        $('#rides-table-body').empty();
        $('#seeDispatcherRidesButtonDiv').hide();
        $('#seeAllRidesButtonDiv').show();
        $('#addRideButtonDiv').show();
        $('#addRideFormDiv').hide();
        let user = { Username: $('#loggedIn-username').text()};
        updateAllRidesTable(user);
        checkRidesTables();
    });

    /* Add new ride for dispatcher */
    $('#addRideButton').click(function (e) {
        e.preventDefault();

        $('#orderRidesTableDiv').fadeOut('500', function () {

            // fill select options
            $.get('/api/drivers/free', function (freeDrivers) {
                $('#addFreeDriverSelect').empty();
                console.log('Getting free drivers for select menu');
                //freeDrivers = null //debug
                if (freeDrivers != null) {
                    if (freeDrivers.length > 0) {
                        freeDrivers.forEach(function (driver) {
                            $('#addFreeDriverSelect').append(`<option value="${driver.Username}">${driver.FirstName} ${driver.LastName} (${driver.Username})</option>`);
                        });
                    } else {
                        $('#addFreeDriverSelect').append(`<option>No free drivers</option>`);
                        $('#addFreeDriverSelect').prop('disabled', true);
                    }
                } else {
                    $('#addFreeDriverSelect').append(`<option>No free drivers</option>`);
                    $('#addFreeDriverSelect').prop('disabled', true);
                }

                $('#ridesTableDiv').hide();
                $('#addRideFormDiv').fadeIn('500');
                $('#seeDispatcherRidesButtonDiv').show();
                $('#seeAllRidesButtonDiv').show();
                $('#addRideButtonDiv').hide();
                $('#no-rides-message').hide();
            });

           
        });
    });

    /* Submit new ride from dispatcher */
    $('#submitAddRideButton').click(function (e) {
        e.preventDefault();
        console.log('Trying to add new ride ...');
        addNewRide();

    });

}); // on ready

/* HELPER FUNKCIJE */

// Register & register validation
function tryAddUser() {
    // ... promises, promises :)
    $.when(checkEmail($('#email').val()), checkUsername($('#username').val())).done(function (emailFound, usernameFound) {

        let canAddUser = true;
        let checkedRadioButtons = 0;

        // Email check
        if (emailFound[0] === "Found") {
            addValidationError('email', 'not-available', 'Email is not available.');
        } else {

            removeValidationError('email', 'not-available');

            // email validacija '@'
            if (!($('#email').val().indexOf('@') >= 0))
                addValidationError('email', 'empty-check', 'You must have a @ in the email address.');
            else
                removeValidationError('email', 'empty-check');

            // email validacija '.'
            if (!($('#email').val().indexOf('.') >= ($('#email').val().indexOf('@'))))
                addValidationError('email', 'empty-check', 'You must have a dot (.) after @ in the email address.');
            else
                removeValidationError('email', 'empty-check');

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

        // provera inputa
        $('#register-form input').each(function () {

            // radio button
            if ($(this).attr('name') == 'radioGender') {
                if ($(this).is(':checked')) {
                    checkedRadioButtons++;
                }
            }

            // JMBG moze imati samo brojeve
            if ($(this).attr('id') == 'jmbg') {
                if (!$('#jmbg').val().match(/^[\d]+$/g))
                    addValidationError('jmbg', 'empty-check', 'JMBG can only have numbers');
                else
                    removeValidationError('jmbg', 'empty-check');
            }

            // Phone moze imati samo brojeve i opciono na pocetku '+'
            if ($(this).attr('id') == 'phone') {
                if (!$('#phone').val().match(/^\+?[\d]+$/g))
                    addValidationError('phone', 'empty-check', 'Phone can only have numbers and an optional starting (+)');
                else
                    removeValidationError('phone', 'empty-check');
            }

            // text input        
            if (!$(this).val()) {

                $(this).next().show();
                $(this).next().addClass('empty-check');
                $(this).next().text('This field cannot be left empty.');

            } else {

                if (!$(this).next().hasClass('not-available')) {
                    if (!$(this).attr('id') == 'jmbg' || !$(this).attr('id') == 'phone') {
                        $(this).next().hide();
                        $(this).next().text('');
                        $(this).next().removeClass('empty-check');
                    }
                }
            }
        });

        // radio button provera
        if (checkedRadioButtons === 0)
            addValidationError('radiogender', 'empty-check', 'Please select a gender.');
        else
            removeValidationError('radiogender', 'empty-check');

        // hack sa klasom
        $('#register-form p').each(function () {
            if ($(this).hasClass('empty-check') || $(this).hasClass('not-available')) {
                canAddUser = false;
            }
        });

        // sure thing
        if (emailFound[0] === "Found" || usernameFound[0] === "Found")
            canAddUser = false;

        // ako moze, neka doda
        if (canAddUser) {

            // novi korisnik
            let newUser = {};            
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
                clearForm('register-form');
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

// helper for logged in user
function loginFromCookie(username) {
    // uzmemo tog korisnika i update UI
    $.get(`/api/users/${username}`, function (user) {

        console.log('User login from cookie');

        $('#fullName').text(`${user.FirstName} ${user.LastName}`);
        $('#loggedIn-username').text(`${user.Username}`);
        $('#orderRideMark').off('click');
        // svaki korisnik drugaciji view ima
        if (user.Role == 'Dispatcher') {
            $('#addRideButtonDiv').show();
            $('#orderRideButtonDiv').hide();
            $('#seeRidesButtonDiv').hide();
            $('#orderRidesTableDiv').hide();
            $('#orderRideFormDiv').hide();
            $('#seeAllRidesButtonDiv').show();
        } else if (user.Role == 'Driver') {
            $('#addRideButtonDiv').hide();
            $('#orderRideButtonDiv').hide();
            $('#orderRidesTableDiv').hide();
            $('#orderRideFormDiv').hide();
            $('#seeRidesButtonDiv').hide();
            $('#seeAllRidesButtonDiv').hide();
            $('#seeDispatcherRidesButtonDiv').hide();
        } else {
            $('#addRideButtonDiv').hide();
            $('#seeRidesButtonDiv').hide();
            $('#orderRideButtonDiv').show();
            $('#orderRidesTableDiv').hide();
            $('#ridesTableDiv').hide();
            $('#orderRideFormDiv').hide();
            $('#seeAllRidesButtonDiv').hide();
            $('#seeDispatcherRidesButtonDiv').hide();
        }

        // update UI size based on role
        updateUISize(user.Role);

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

        $('#home-view').show();

        // sklonimo onaj login-fail
        $('p.login-fail').hide();

        console.log(user.Role);
        // ako je korisnik, onda ima Ordered rides
        if (user.Role == 'Customer') {

            // update Ordered rides from web api
            $.get(`/api/rides/ordered/${user.Username}`, function (orderedRides) {
                if (orderedRides !== null) {
                    if (orderedRides.length > 0) {
                        orderedRides.forEach(function (ride) {
                            updateOrderTable(ride);
                        });
                    }
                } else {
                    $('#orderRidesTableDiv').hide();
                }
                updateMark(user.Role);
                checkRidesTables();
            });

            updateAllRidesTable(user);

        } else if (user.Role == 'Dispatcher') {
            updateAllRidesTable(user);
            updateMark(user.Role);
            checkRidesTables();   
        } else if (user.Role == 'Driver') {
            updateAllRidesTable(user);
            updateMark(user.Role);
            checkRidesTables();
        }
    });
}

// helper funkcija za validaciju login forme i login akcije
function tryLoginUser() {

    // napravimo dummy usera
    let loginUser = {};
    $('#orderRideMark').off('click');
    // username
    if (!$('#loginUsername').val())
        addValidationError('loginusername', 'empty-check', 'You must enter a username');
    else
        removeValidationError('loginusername', 'empty-check');

    // password
    if (!$('#loginPassword').val())
        addValidationError('loginpassword', 'empty-check', 'You must enter a password');
    else
        removeValidationError('loginpassword', 'empty-check');

    // dummy user za login
    loginUser.username = $('#loginUsername').val();
    loginUser.password = $('#loginPassword').val();

    let canLoginUser = true;
    // hack sa klasom
    $('#login-form p').each(function () {
        if ($(this).hasClass('empty-check')) {
            canLoginUser = false;
        }
    });

    if (canLoginUser) {
        // poziv za login
        $.post('/api/users/login', loginUser, function (loggedIn) {
            // restart login/register vrednosti i ciscenje div-ova
            clearForm('login-form');
            clearForm('register-form');
            $('#orderRideButtonDiv').hide();
            $('#seeRidesButtonDiv').hide();
            $('#orderRidesTableDiv').hide();
            $('#orderRideFormDiv').hide();
            $('#addRideButtonDiv').hide();

            if (loggedIn !== false) {

                // uzmemo tog korisnika i update UI
                $.get(`/api/users/${loginUser.username}`, function (user) {

                    console.log('Setting cookie');
                    setCookie('loggedInCookie', loginUser.username, 1);
                    console.log('Cookie set')

                    $('#fullName').text(`${user.FirstName} ${user.LastName}`);
                    $('#loggedIn-username').text(`${user.Username}`);

                    console.log(user.Role);
                    // svaki korisnik drugaciji view ima
                    if (user.Role == 'Dispatcher') {
                        $('#addRideButtonDiv').show();
                        $('#orderRideButtonDiv').hide();
                        $('#seeRidesButtonDiv').hide();
                        $('#orderRidesTableDiv').hide();
                        $('#orderRideFormDiv').hide();
                        $('#seeAllRidesButtonDiv').show();
                        $('#seeDispatcherRidesButtonDiv').hide();
                    } else if (user.Role == 'Driver') {
                        $('#addRideButtonDiv').hide();
                        $('#orderRideButtonDiv').hide();
                        $('#orderRidesTableDiv').hide();
                        $('#orderRideFormDiv').hide();
                        $('#seeRidesButtonDiv').hide();
                        $('#seeAllRidesButtonDiv').hide();
                    } else {
                        $('#addRideButtonDiv').hide();
                        $('#seeRidesButtonDiv').hide();
                        $('#orderRideButtonDiv').show();
                        $('#orderRidesTableDiv').show();
                        $('#orderRideFormDiv').hide();
                        $('#seeAllRidesButtonDiv').hide();
                        $('#seeDispatcherRidesButtonDiv').hide();
                    }

                    // update UI size based on role
                    updateUISize(user.Role);

                    $('#no-rides-message > h3').text('We\'re getting your rides ready. Please be patient.');
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

                    $('#home-view').show();

                    // sklonimo onaj login-fail
                    $('p.login-fail').hide();

                    // ako je korisnik, onda ima Ordered rides
                    if (user.Role == 'Customer') {
                        // update Ordered rides from web api
                        $.get(`/api/rides/ordered/${user.Username}`, function (orderedRides) {
                            if (orderedRides !== null) {
                                if (orderedRides.length > 0) {
                                    orderedRides.forEach(function (ride) {
                                        updateOrderTable(ride);
                                    });
                                }
                            } else {
                                $('#orderRidesTableDiv').hide();
                            }
                            updateMark(user.Role);
                            checkRidesTables();
                        });

                        updateAllRidesTable(user);

                    } else if (user.Role == 'Dispatcher') {
                        updateAllRidesTable(user);
                        updateMark(user.Role);
                        checkRidesTables();
                    } else if (user.Role == 'Driver') {
                        updateAllRidesTable(user);
                        updateMark(user.Role);
                        checkRidesTables();
                    }
                });
            } else {
                $('p.login-fail').css('text-weight', 'bold');
                $('p.login-fail').css('color', 'red');
                $('p.login-fail').text('Username and password do not match. Try again.');
                $('p.login-fail').show();
            }
        });
    }
}

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
                $(this).next().addClass('empty-check');
                $(this).next().text('This field cannot be left empty.');
            } else {
                if (!$(this).next().hasClass('not-available')) {
                    $(this).next().hide();
                    $(this).next().text('');
                    $(this).next().removeClass('empty-check');
                }
            }

            // JMBG moze imati samo brojeve
            if ($(this).attr('id') == 'editJMBG') {
                if ($('#editJMBG').val().match(/^[\d]+$/g) == null)
                    addValidationError('editJMBG', 'empty-check', 'JMBG can only have numbers');
                else
                    removeValidationError('editJMBG', 'empty-check');
            }

            // Phone moze imati samo brojeve i opciono na pocetku '+'
            if ($(this).attr('id') == 'editPhone') {
                if (!$('#editPhone').val().match(/^\+?[\d]+$/g))
                    addValidationError('editPhone', 'empty-check', 'Phone can only have numbers and an optional starting (+)');
                else
                    removeValidationError('editPhone', 'empty-check');
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

            // email validacija '@'
            if (!($('#editEmail').val().indexOf('@') >= 0))
                addValidationError('editEmail', 'empty-check', 'You must have a @ in the email address.');
            else
                removeValidationError('editEmail', 'empty-check');

            // email validacija '.'
            if (!($('#editEmail').val().indexOf('.') >= ($('#editEmail').val().indexOf('@'))))
                addValidationError('editEmail', 'empty-check', 'You must have a dot (.) after @ in the email address.');
            else
                removeValidationError('editEmail', 'empty-check');
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
                addValidationError('editUsername', 'empty-check', 'This field cannot be left empty.');
            else
                removeValidationError('editUsername', 'empty-check');
        }

        // hack sa klasom
        $('#edit-form p').each(function () {
            if ($(this).hasClass('empty-check') || $(this).hasClass('not-available')) {
                canEditUser = false;
            }
        });

        // sure thing
        if (foundEmail === "Found" || foundUsername === "Found")
            canEditUser = false;

        if (canEditUser) {
            let editedUser;

            if ($('#info-role').text() == 'Driver') {

                editedUser = {
                    Username: $('#editUsername').val(),
                    FirstName: $('#editFirstname').val(),
                    LastName: $('#editLastname').val(),
                    Email: $('#editEmail').val(),
                    ContactPhone: $('#editPhone').val(),
                    JMBG: $('#editJMBG').val(),
                    Gender: $('input[name=editRadioGender]:checked').val(),
                    Password: $('#editPassword').val(),
                    DriverLocation: {
                        X: 0.0,
                        Y: 0.0,
                        LocationAddress: {
                            City: $('#editCity').val(),
                            Street: $('#editStreet').val(),
                            ZipCode: $('#editZipcode').val()
                        }
                    }
                };
            } else {

                editedUser = {
                    Username: $('#editUsername').val(),
                    FirstName: $('#editFirstname').val(),
                    LastName: $('#editLastname').val(),
                    Email: $('#editEmail').val(),
                    ContactPhone: $('#editPhone').val(),
                    JMBG: $('#editJMBG').val(),
                    Gender: $('input[name=editRadioGender]:checked').val(),
                    Password: $('#editPassword').val()
                };
            }

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
                eraseCookie('loggedInCookie');
                setCookie('loggedInCookie', user.Username, 1);
            });

        } else {
            console.log('Cannot update');
        }
    });
}

// Order ride for customer
function orderRide() {
    let canOrderRide = true;
    let checkedRadioButtons = false;

    $('form#order-ride-form input').each(function () {

        // ZipCode moze imati samo brojeve
        if ($(this).attr('id') == 'orderRideZipCode') {
            if (!$('#orderRideZipCode').val().match(/^[\d]+$/g))
                addValidationError('orderRideZipCode', 'empty-check', 'Zip code can only have numbers');
            else
                removeValidationError('orderRideZipCode', 'empty-check');

            if (!$(this).val()) {
                $(this).next().show();
                $(this).next().addClass('empty-check');
                $(this).next().text('This field cannot be left empty.');
            }

            return true;
        }

        // text input        
        if (!$(this).val()) {
            $(this).next().show();
            $(this).next().addClass('empty-check');
            $(this).next().text('This field cannot be left empty.');
        } else {
            $(this).next().hide();
            $(this).next().text('');
            $(this).next().removeClass('empty-check');
        }
    });

    // hack sa klasom
    $('#order-ride-form p').each(function () {
        if ($(this).hasClass('empty-check')) {
            canOrderRide = false;
        }
    });

    if (canOrderRide) {

        // uzmemo podatke o korisniku
        $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {

            // trenutno vreme - na API ovo
            //let date = new Date();
            //let jsonDate = date.toJSON();

            // voznja
            let newOrderRide = {
                RideCustomer: {
                    Username: user.Username,
                    Password: user.Password,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Email: user.Email,
                    ContactPhone: user.ContactPhone,
                    JMBG: user.JMBG,
                    Gender: user.Gender,
                    Rides: user.Rides
                },
                RideVehicle: {
                    VehicleType: $('#orderCarType').val()
                },
                StartLocation: {
                    X: 0.0,
                    Y: 0.0,
                    LocationAddress: {
                        City: $('#orderRideCity').val(),
                        Street: $('#orderRideStreet').val(),
                        ZipCode: $('#orderRideZipCode').val()
                    }
                }
            };

            // posaljemo voznju
            $.ajax({
                method: 'POST',
                url: '/api/rides',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(newOrderRide)
            }).success(function (id) {
                // ocistimo formu
                clearForm('order-ride-form');
                $('#orderCarType').prop('selectedIndex', 0);

                // zatrazimo nazad voznju sa dodeljenim ID
                $.get(`/api/rides?id=${id}`, function (ride) {

                    // update table
                    updateOrderTable(ride);
                    $('#orderRidesTableDiv').show();

                    // update view
                    $('#seeRidesButton').trigger('click');

                    showSnackbar('Ordered ride ' + id + ' successfully.');
                });
            });
        });
    } else {
        console.log('Can\'t order ride.');
    }
}

// Add new ride from dispatcher
function addNewRide() {
    let canAddRide = true;

    $('form#add-ride-form input').each(function () {

        // ZipCode moze imati samo brojeve
        if ($(this).attr('id') == 'addRideZipCode') {
            if (!$('#addRideZipCode').val().match(/^[\d]+$/g))
                addValidationError('addRideZipCode', 'empty-check', 'Zip code can only have numbers');
            else
                removeValidationError('addRideZipCode', 'empty-check');

            if (!$(this).val()) {
                $(this).next().show();
                $(this).next().addClass('empty-check');
                $(this).next().text('This field cannot be left empty.');
            }

            return true;
        }

        // text input        
        if (!$(this).val()) {
            $(this).next().show();
            $(this).next().addClass('empty-check');
            $(this).next().text('This field cannot be left empty.');
        } else {
            $(this).next().hide();
            $(this).next().text('');
            $(this).next().removeClass('empty-check');
        }
    });

    // hack sa klasom
    $('#add-ride-form p').each(function () {
        if ($(this).hasClass('empty-check')) {
            canAddRide = false;
        }
    });

    // mozda nema vozaca slobodnog?
    if ($('#addFreeDriverSelect').prop('disabled')) {
        canAddRide = false;
        showSnackbar('Sorry, you need a free driver to add a new ride');
    }

    if (canAddRide) {

        // uzmemo podatke o korisniku
        $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {

            // voznja
            let newRide = {
                RideDispatcher: {
                    Username: user.Username,
                    Password: user.Password,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Email: user.Email,
                    ContactPhone: user.ContactPhone,
                    JMBG: user.JMBG,
                    Gender: user.Gender,
                    Rides: user.Rides
                },
                RideDriver: {
                    Username: $('#addFreeDriverSelect').val()
                },
                RideVehicle: {
                    VehicleType: $('#addCarType').val()
                },
                StartLocation: {
                    X: 0.0,
                    Y: 0.0,
                    LocationAddress: {
                        City: $('#addRideCity').val(),
                        Street: $('#addRideStreet').val(),
                        ZipCode: $('#addRideZipCode').val()
                    }
                }
            };

            // posaljemo voznju
            $.ajax({
                method: 'POST',
                url: '/api/rides',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(newRide)
            }).success(function (id) {
                // ocistimo formu
                clearForm('order-ride-form');
                $('#addCarType').prop('selectedIndex', 0);

                // zatrazimo nazad voznju sa dodeljenim ID
                $.get(`/api/rides?id=${id}`, function (ride) {

                    // update table
                    updateAllRidesTable(user);

                    // update view
                    $('#seeDispatcherRidesButton').trigger('click');

                    showSnackbar('Added ride ' + id + ' successfully.');
                });
            });
        });

    } else {
        console.log('Cannot add ride');
    }


}

// update order table
function updateOrderTable(orderRide, userRole) {

    // Microsoft Edge ne podrzava ES6 za default parametre
    if (typeof userRole === "undefined") {
        userRole = 'Customer';
    }

    // uklonimo ako vec postoji ta voznja - ovo je posle dobro za edit
    $('#order-rides-table-body tr').each(function () {
        if ($(this).attr('id') == orderRide.ID) {
            $(this).remove();
            return true;
        }
    });

    // da datum bude lepsi
    let dt = new Date(Date.parse(orderRide.DateAndTime));
    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    let formatedDate = dt.toLocaleString("en-GB", options);

    // da status bude lepsi
    let status;
    if (orderRide.StatusOfRide == 'CREATED_ONWAIT')
        status = 'Created - on wait';

    if (userRole == 'Customer') {
        $('#order-rides-table-body').append(`<tr id="${orderRide.ID}"><th scope="row">${orderRide.ID}</th><td>${orderRide.StartLocation.LocationAddress.Street}, ${orderRide.StartLocation.LocationAddress.City} ${orderRide.StartLocation.LocationAddress.ZipCode}</td>
                            <td>${formatedDate}</td>
                            <td>${orderRide.RideVehicle.VehicleType}</td>
                            <td>${status}</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button id="editOrder${orderRide.ID}" type="button" class="btn btn-primary"><i class="fas fa-edit"></i></button>
                                    <button id="cancelOrder${orderRide.ID}" name="cancelOrderButton" type="button" class="btn btn-danger"><i class="fas fa-times-circle"></i></button>
                                </div>
                            </td>
                        </tr>`);
        addButtonListeners(orderRide);
    } else {
        $('#order-rides-table-body').append(`<tr id="${orderRide.ID}"><th scope="row">${orderRide.ID}</th><td>${orderRide.StartLocation.LocationAddress.Street}, ${orderRide.StartLocation.LocationAddress.City} ${orderRide.StartLocation.LocationAddress.ZipCode}</td>
                            <td>${formatedDate}</td>
                            <td>${orderRide.RideVehicle.VehicleType}</td>
                            <td>${status}</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button id="appointRide${orderRide.ID}" type="button" class="btn btn-primary"><i class="fas fa-user-plus"></i></button>
                                    
                                </div>
                            </td>
                        </tr>`);
    }    
}

// update all rides table
function updateAllRidesTable(user) {
   
    console.log('Trying to get user rides');
    // update other rides if user has any
    $.get(`/api/rides/${user.Username}`, function (rides) {
        console.log('Got rides from API for ' + user.Username);
        console.log(rides);
        if (rides !== null) {
            console.log('DEBUG - rides length: ' + rides.length);
            if (rides.length > 0) {
                rides.forEach(function (ride) {

                    // uklonimo ako vec postoji ta voznja - ovo je posle dobro za edit
                    $('#rides-table-body tr').each(function () {
                        if ($(this).attr('id') == ride.ID) {
                            $(this).remove();
                            return true;
                        }
                    });

                    // da datum bude lepsi
                    let dt = new Date(Date.parse(ride.DateAndTime));
                    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                    let formatedDate = dt.toLocaleString("en-GB", options);

                    // da status bude lepsi
                    let status;
                    switch (ride.StatusOfRide) {
                        case 'FORMED': status = 'Formed'; break;
                        case 'PROCESSED': status = 'Processed'; break;
                        case 'ACCEPTED': status = 'Accepted'; break;
                        case 'CANCELED': status = 'Canceled'; break;
                        case 'FAILED': status = 'Failed'; break;
                        case 'SUCCESSFUL': status = 'Successful'; break;
                        default: status = 'Created - on wait'; break;
                    }

                    let destination;
                    if (ride.Destination == null) {
                        destination = 'Not set';
                    } else {
                        destination = `${ride.Destination.LocationAddress.Street}, ${ride.Destination.LocationAddress.City} ${ride.Destination.LocationAddress.ZipCode}`;
                    }

                    let description;
                    if (ride.RideComment.Description == null)
                        description = 'No comment';
                    else
                        description = `${ride.RideComment.Description}`;

                    let rating;
                    console.log('DEBUG - ride rating: ' + ride.RideComment.RideMark);
                    if (description == 'No comment' )
                        rating = 'Not rated';
                    else
                        rating = `${ride.RideComment.RideMark}/5`;

                    $('#rides-table-body').append(`<tr id="${ride.ID}"><th scope="row">${ride.ID}</th><td>${ride.StartLocation.LocationAddress.Street}, ${ride.StartLocation.LocationAddress.City} ${ride.StartLocation.LocationAddress.ZipCode}</td>
                            <td>${destination}</td>
                            <td>${status}</td>
                            <td>${description}</td>
                            <td>${formatedDate}</td>
                            <td>${rating}</td>
                            
                            <td>
                                <div class="btn-group" role="group">
                                    <button id="showDetail${ride.ID}" type="button" class="btn btn-primary"><i class="fas fa-info-circle"></i></button>                                    
                                </div>
                            </td>
                        </tr>`);

                    // add one button event listener
                    $(`#showDetail${ride.ID}`).on('click', function () {
                        console.log('Getting info on ride with ID: ' + ride.ID);
                        $.get(`/api/rides?id=${ride.ID}`, function (ride) {
                            updateDetailRideInfo(ride);
                            $('#rideModal').modal('show');
                        });
                    });

                });
            } else {
                $('#no-rides-message > h3').text('Oops, you don\'t have any done or in progress rides');
            }
        } else {
            $('#no-rides-message > h3').text('Oops, you don\'t have any done or in progress rides');
            $('#ridesTableDiv').hide();
        }
        updateMark(user.Role);
        checkRidesTables();
    });
}

// show all rides for dispatcher 
function showAllRides() {
    $('#no-rides-message').hide();

    $.get('/api/rides', function (rides) {
        $('#no-rides-message').hide();
        if (rides !== null) {
            if (rides.length > 0) {
                $('#ridesTableDiv > h3').text('Rides:');
                rides.forEach(function (ride) {

                    if (ride.StatusOfRide == 'CREATED_ONWAIT') {
                        updateOrderTable(ride, 'Dispatcher');
                        return true;
                    }

                    // uklonimo ako vec postoji ta voznja - ovo je posle dobro za edit
                    $('#rides-table-body tr').each(function () {
                        if ($(this).attr('id') == ride.ID) {
                            $(this).remove();
                            return true;
                        }
                    });

                    // da datum bude lepsi
                    let dt = new Date(Date.parse(ride.DateAndTime));
                    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                    let formatedDate = dt.toLocaleString("en-GB", options);

                    // da status bude lepsi
                    let status;
                    switch (ride.StatusOfRide) {
                        case 'FORMED': status = 'Formed'; break;
                        case 'PROCESSED': status = 'Processed'; break;
                        case 'ACCEPTED': status = 'Accepted'; break;
                        case 'CANCELED': status = 'Canceled'; break;
                        case 'FAILED': status = 'Failed'; break;
                        case 'SUCCESSFUL': status = 'Successful'; break;
                        default: status = 'Created - on wait'; break;
                    }

                    let destination;
                    if (ride.Destination == null) {
                        destination = 'Not set';
                    } else {
                        destination = `${ride.Destination.LocationAddress.Street}, ${ride.Destination.LocationAddress.City} ${ride.Destination.LocationAddress.ZipCode}`;
                    }

                    let description;
                    if (ride.RideComment.Description == null)
                        description = 'No comment';
                    else
                        description = `${ride.RideComment.Description}`;

                    let rating;
                    if (description == 'No comment' || ride.RideComment.RideMark == 'undefined')
                        rating = 'Not rated';
                    else
                        rating = `${ride.RideComment.RideMark}/5`;

                    $('#rides-table-body').append(`<tr id="${ride.ID}"><th scope="row">${ride.ID}</th><td>${ride.StartLocation.LocationAddress.Street}, ${ride.StartLocation.LocationAddress.City} ${ride.StartLocation.LocationAddress.ZipCode}</td>
                            <td>${destination}</td>
                            <td>${status}</td>
                            <td>${description}</td>
                            <td>${formatedDate}</td>
                            <td>${rating}</td>
                            
                            <td>
                                <div class="btn-group" role="group">
                                    <button id="showDetail${ride.ID}" type="button" class="btn btn-primary"><i class="fas fa-info-circle"></i></button>                                    
                                </div>
                            </td>
                        </tr>`);

                    // add one button event listener
                    $(`#showDetail${ride.ID}`).on('click', function () {
                        console.log('Getting info on ride with ID: ' + ride.ID);
                        $.get(`/api/rides?id=${ride.ID}`, function (ride) {
                            console.log('Ride status: ' + ride.StatusOfRide);
                            updateDetailRideInfo(ride);
                            $('#rideModal').modal('show');
                        });
                    });
                    $('#no-rides-message').hide();
                    checkRidesTables();
                });
            }
        } else {
            console.log('There are no rides in the system right now.');
            $('#no-rides-message > h3').text('Oops, there are no rides right now');
            $('#ridesTableDiv').hide();
        }
        updateMark('Dispatcher');
        
    });
    $('#seeAllRidesButtonDiv').hide();
    $('#seeDispatcherRidesButtonDiv').show();
}

// dry
function updateDetailRideInfo(ride) {
    console.log('Updating ride information: ' + ride.ID);

    $('#ride-info').empty();

    // da datum bude lepsi
    let dt = new Date(Date.parse(ride.DateAndTime));
    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    let formatedDate = dt.toLocaleString("en-GB", options);

    // da datum bude lepsi
    dt = new Date(Date.parse(ride.RideComment.DateAndTime));
    let commentDate = dt.toLocaleString("en-GB", options);

    // da status bude lepsi
    let status;
    switch (ride.StatusOfRide) {
        case 'FORMED': status = 'Formed'; break;
        case 'PROCESSED': status = 'Processed'; break;
        case 'ACCEPTED': status = 'Accepted'; break;
        case 'CANCELED': status = 'Canceled'; break;
        case 'FAILED': status = 'Failed'; break;
        case 'SUCCESSFUL': status = 'Successful'; break;
        default: status = 'Created - on wait'; break;
    }

    let destination;
    if (ride.Destination == null) {
        destination = 'Not set';
    } else {
        destination = `${ride.Destination.LocationAddress.Street}, ${ride.Destination.LocationAddress.City} ${ride.Destination.LocationAddress.ZipCode}`;
    }

    let start;
    if (ride.StartLocation.LocationAddress !== null) {
        start = ride.StartLocation.LocationAddress.Street + ', ' + ride.StartLocation.LocationAddress.City + ' ' + ride.StartLocation.LocationAddress.ZipCode;
    } else {
        start = 'Not set';
    }

    let rideCustomer;
    if (ride.RideCustomer == null || ride.RideCustomer.Username == null) {
        rideCustomer = 'Not set';
    } else {
        rideCustomer = `${ride.RideCustomer.FirstName} ${ride.RideCustomer.LastName} (${ride.RideCustomer.Username})`;
    }

    let rideDriver;
    if (ride.RideDriver == null || ride.RideDispatcher.Username == null) {
        rideDriver = 'Not set';
    } else {
        rideDriver = `${ride.RideDriver.FirstName} ${ride.RideDriver.LastName} (${ride.RideDriver.Username})`;
    }

    let rideDispatcher;
    if (ride.RideDispatcher == null || ride.RideDispatcher.Username == null) {
        rideDispatcher = 'Not set';
    } else {
        rideDispatcher = `${ride.RideDispatcher.FirstName} ${ride.RideDispatcher.LastName} (${ride.RideDispatcher.Username})`;
    }

    let rideComment;
    if (ride.RideComment != null && ride.RideComment.Description != null && ride.RideComment.CommentUser != null) {
        rideComment = `<blockquote class="blockquote text-center">
                            <p class="mb-0">"${ride.RideComment.Description}"</p>
                            <footer class="blockquote-footer">${ride.RideComment.CommentUser.FirstName} ${ride.RideComment.CommentUser.LastName} (${ride.RideComment.CommentUser.Role}) on <cite>${commentDate}</cite></footer>
                        </blockquote>`;
    } else {
        rideComment = 'No comment';
    }

    $('#ride-info').append(`<span class="user-key">Ride ID</span>: <p>${ride.ID}</p>`);
    $('#ride-info').append(`<span class="user-key">Date &amp; Time</span>: <p>${formatedDate}</p>`);
    $('#ride-info').append(`<span class="user-key">Start Location</span>: <p>${start}</p>`);
    $('#ride-info').append(`<span class="user-key">Destination</span>: <p>${destination}</p>`);
    $('#ride-info').append(`<span class="user-key">Status of ride</span>: <p>${status}</p>`);
    $('#ride-info').append(`<span class="user-key">Fare</span>: <p>${ride.Fare.toFixed(2)} €</p>`);
    $('#ride-info').append(`<span class="user-key">Vehicle</span>: <p>${ride.RideVehicle.VehicleType}</p>`);
    console.log('Number of stars: ' + ride.RideComment.RideMark);
    if (ride.StatusOfRide != 'CREATED_ONWAIT' && ride.StatusOfRide != 'FORMED') {
        switch (ride.RideComment.RideMark) {
            case 0: $('#ride-info').append(`<span class="user-key">Rating</span>:<br><i class="far fa-star icon-b"></i><i class="far fa-star icon-b"></i><i class="far fa-star icon-b"><i class="far fa-star icon-b"><i class="far fa-star icon-b"></i>`); break;
            case 1: $('#ride-info').append(`<span class="user-key">Rating</span>:<br><i class="fas fa-star icon-d"></i><i class="far fa-star icon-b"></i><i class="far fa-star icon-b"><i class="far fa-star icon-b"><i class="far fa-star icon-b"></i>`); break;
            case 2: $('#ride-info').append(`<span class="user-key">Rating</span>:<br><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"></i><i class="far fa-star icon-b"><i class="far fa-star icon-b"><i class="far fa-star icon-b"></i>`); break;
            case 3: $('#ride-info').append(`<span class="user-key">Rating</span>:<br><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"><i class="far fa-star icon-b"><i class="far fa-star icon-b"></i>`); break;
            case 4: $('#ride-info').append(`<span class="user-key">Rating</span>:<br><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"><i class="fas fa-star icon-d"><i class="far fa-star icon-b"></i>`); break;
            case 5: $('#ride-info').append(`<span class="user-key">Rating</span>:<br><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"></i><i class="fas fa-star icon-d"><i class="fas fa-star icon-d"><i class="fas fa-star icon-d"></i>`); break;
        }
    } else {
        $('#ride-info').append(`<span class="user-key">Rating</span>:<br><p>Rating not set</p>`);
    }
    $('#ride-info').append(`<hr><span class="user-key">Customer</span>: <p>${rideCustomer}</p>`);
    $('#ride-info').append(`<span class="user-key">Driver</span>: <p>${rideDriver}</p>`);
    $('#ride-info').append(`<span class="user-key">Dispatcher</span>: <p>${rideDispatcher}</p><hr>`);
    $('#ride-info').append(`<p>${rideComment}</p>`);  
    
}

// adds listeners to buttons for edit and delete
function addButtonListeners(orderRide) {

    $(`#editOrder${orderRide.ID}`).click(function () {
        // update edit formu za order ride
        $('#editOrderID').text(orderRide.ID);
        $('#editOrderRideUser').attr('placeholder', `${$('#fullName').text()}`);
        $('#editOrderRideStreet').val(orderRide.StartLocation.LocationAddress.Street);
        $('#editOrderRideCity').val(orderRide.StartLocation.LocationAddress.City);
        $('#editOrderRideZipCode').val(orderRide.StartLocation.LocationAddress.ZipCode);
        if (orderRide.RideVehicle.VehicleType == 'Passenger')
            $('#editOrderCarType').prop('selectedIndex', 0);
        else
            $('#editOrderCarType').prop('selectedIndex', 1);

        $('#confirmEditOrderRide').attr('id', `confirmEditOrderRide${orderRide.ID}`);
        $(`#confirmEditOrderRide${orderRide.ID}`).on('click', function () {
            let canEditOrderRide = true;

            $('form#edit-order-ride-form input').each(function () {

                // ZipCode moze imati samo brojeve
                if ($(this).attr('id') == 'editOrderRideZipCode') {
                    if (!$('#editOrderRideZipCode').val().match(/^[\d]+$/g))
                        addValidationError('editOrderRideZipCode', 'empty-check', 'Zip code can only have numbers');
                    else
                        removeValidationError('editOrderRideZipCode', 'empty-check');

                    if (!$(this).val()) {
                        $(this).next().show();
                        $(this).next().addClass('empty-check');
                        $(this).next().text('This field cannot be left empty.');
                    }

                    return true;
                }

                // text input        
                if (!$(this).val()) {
                    $(this).next().show();
                    $(this).next().addClass('empty-check');
                    $(this).next().text('This field cannot be left empty.');
                } else {
                    $(this).next().hide();
                    $(this).next().text('');
                    $(this).next().removeClass('empty-check');
                }


            });

            // hack sa klasom
            $('#edit-order-ride-form p').each(function () {
                if ($(this).hasClass('empty-check')) {
                    canEditOrderRide = false;
                }
            });

            if (canEditOrderRide) {

                // uzmemo podatke o korisniku
                $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {

                    // trenutno vreme promenim, al mozda ne treba? 
                    //let date = new Date();
                    //let jsonDate = date.toJSON();

                    // voznja
                    let editedRide = {
                        RideCustomer: {
                            Username: user.Username,
                            Password: user.Password,
                            FirstName: user.FirstName,
                            LastName: user.LastName,
                            Email: user.Email,
                            ContactPhone: user.ContactPhone,
                            JMBG: user.JMBG,
                            Gender: user.Gender,
                            Rides: user.Rides
                        },
                        RideVehicle: {
                            VehicleType: $('#editOrderCarType').val()
                        },
                        StartLocation: {
                            X: 0.0,
                            Y: 0.0,
                            LocationAddress: {
                                City: $('#editOrderRideCity').val(),
                                Street: $('#editOrderRideStreet').val(),
                                ZipCode: $('#editOrderRideZipCode').val()
                            }
                        }
                    };

                    // posaljemo izmenjenu voznju
                    $.ajax({
                        method: 'PUT',
                        url: `/api/rides/${orderRide.ID}`,
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(editedRide)
                    }).success(function (ride) {
                        if (ride != null) {
                            // ocistimo formu
                            clearForm('edit-order-ride-form');
                            $('#orderCarType').prop('selectedIndex', 0);

                            // update table i hide modala
                            updateOrderTable(ride);
                            $('#editOrderRideModal').modal('hide');
                            // inform user
                            showSnackbar('Edited ride ' + ride.ID + ' successfully.');
                            // remove event listener for click on this element
                            $(`#confirmEditOrderRide${orderRide.ID}`).off('click');
                            $(`#confirmEditOrderRide${orderRide.ID}`).attr('id', 'confirmEditOrderRide');
                            $('confirmEditOrderRide').off('click');

                        } else {
                            $('#editOrderRideModal').modal('hide');
                            showSnackbar('There was an error proccesing your edit request');
                        }

                    });
                });
            } else {
                console.log('no');
            }

        });

        $('#editOrderRideModal').modal('show');
    });

    // event listener za cancelOrder button svake voznje
    $(`#cancelOrder${orderRide.ID}`).click(function () {
        let orderID = $(this).attr('id').replace(/\D/g, '');

        $('#confirmCancel').attr('id', `confirmCancel${orderRide.ID}`);
        $(`#confirmCancel${orderRide.ID}`).on('click', function () {
            let comment = $('textarea#rideCommentText').val();
            let canCancelRide = true;
            if (comment == null || !comment)
                canCancelRide = false;

            if (canCancelRide) {
                $.ajax({
                    method: 'POST',
                    url: `/api/rides/cancel/${orderRide.ID}`,
                    contentType: 'application/json',
                    data: JSON.stringify(comment)
                }).success(function (response) {

                    // odmah update tabelu
                    $('#order-rides-table-body tr').each(function () {
                        if ($(this).attr('id') == orderRide.ID) {
                            $(this).remove();
                            return true;
                        }
                    });
                    checkRidesTables();
                    $('#commentRideModal').modal('hide');
                    $('textarea#rideCommentText').val('');
                    // inform user with snackbar
                    showSnackbar(response);
                    removeValidationError('rideCommentText', 'found-check');
                    // reset confirmCancel button id
                    // remove event listener for click on this element
                    $(`#confirmCancel${orderRide.ID}`).off('click');
                    $(`#confirmCancel${orderRide.ID}`).attr('id', 'confirmCancel');
                    $('confirmCancel').off('click');

                    $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {
                        updateAllRidesTable(user);    
                    });

                });
            } else {
                console.log('Cant do. Need a comment.');
                addValidationError('rideCommentText', 'found-check', 'You must enter some feedback for us');
            }
        });

        $('#commentRideModal').modal('show');

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

// dodaje validation form na jedan input
function addValidationError(checkName, className, message) {
    $(`#${checkName}-check`).show();
    $(`#${checkName}-check`).addClass(className);
    $(`#${checkName}-check`).text(message);
}

// uklanja validation error sa jednog inputa
function removeValidationError(checkName, className) {
    $(`#${checkName}-check`).hide();
    $(`#${checkName}-check`).text('');
    $(`#${checkName}-check`).removeClass(className);
}

// uklanja svaki validation check error u odredjenoj formi
function removeValidationErrors(formName) {
    $(`#${formName}-form input`).each(function () {
        if ($(this).attr('id')) {
            removeValidationError($(this).attr('id').toLowerCase(), 'empty-check');
            removeValidationError($(this).attr('id').toLowerCase(), 'not-available');
        } else {
            removeValidationError($(this).attr('name').toLowerCase(), 'empty-check');
            removeValidationError($(this).attr('name').toLowerCase(), 'not-available');
        }
    });
}

// dry
function updateUserInformation(user) {
    // update UI
    $('#fullName').text(`${user.FirstName} ${user.LastName}`);
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
        $('#user-info').append(`<hr /><span class="user-key">Role</span>: <p id="info-role">${user.Role}</p>`);
    }

    if (user.Role == 'Driver') {
        $('#user-info').append('<hr /><h4 class="info-location">Location</h4>');
        $('#user-info').append(`<span class="user-key">City</span>: <p id="info-location-city">${user.DriverLocation.LocationAddress.City}</p>`);
        $('#user-info').append(`<span class="user-key">Street</span>: <p id="info-location-street">${user.DriverLocation.LocationAddress.Street}</p>`);
        $('#user-info').append(`<span class="user-key">Zip code</span>: <p id="info-location-zipcode">${user.DriverLocation.LocationAddress.ZipCode}</p>`);
    }
}

// dry
function updateEditForm() {
    $('#edit-form').empty();
    // bar radi :)
    // https://img.devrant.com/devrant/rant/r_115445_YcizR.jpg
    $('#user-info span').each(function () {
        if (($(this).text().indexOf('Role') >= 0))
            return true;

        if (($(this).text().indexOf('Gender') >= 0)) {
            if ($(this).next().text() === "Male") {
                $('#edit-form').append(`<div class="form-group"><div class="col-sm-12 center-text"><label class="radio-inline user-key"><input type="radio" name="editRadioGender" value="Male" checked/> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" /> Female </label></div></div>`);
            } else {
                $('#edit-form').append(`<div class="form-group"><div class="col-sm-12 center-text"><label class="radio-inline user-key"><input type="radio" name="editRadioGender" value="Male" /> Male </label> <label class="radio-inline"><input type="radio" name="editRadioGender" value="Female" checked/> Female </label></div></div>`);
            }
        } else {
            if (($(this).text().indexOf('City') >= 0))
                $('#edit-form').append(`<hr /><div class="form-group"><div class="col-sm-12"><label id="edit-form-label" class="user-key">${$(this).text()}</label><input type="text" class="form-control" id="edit${$(this).text().replace(/ /g, '')}" value="${$(this).next().text()}" autocomplete="off" /><p class="found-p" id="edit${$(this).text().replace(/ /g, '')}-check" ></p></div></div>`);
            else
                $('#edit-form').append(`<div class="form-group"><div class="col-sm-12"><label id="edit-form-label" class="user-key">${$(this).text()}</label><input type="text" class="form-control" id="edit${$(this).text().replace(/ /g, '')}" value="${$(this).next().text()}" autocomplete="off" /><p class="found-p" id="edit${$(this).text().replace(/ /g, '')}-check" ></p></div></div>`);
        }
    });

    // za Password
    $('#edit-form').append(`<hr /><div class="form-group"><div class="col-sm-12"><input type="password" class="form-control" id="editPassword" placeholder="New password (optional)" /></div></div>`);
}

function updateUISize(role) {
    // change UI size based on role
    if (role == 'Dispatcher') {
        $('#addRideButtonDiv').removeClass('col-sm-4');
        $('#addRideButtonDiv').addClass('col-sm-3');
        $('#addRideButtonDiv').removeClass('col-md-4');
        $('#addRideButtonDiv').addClass('col-md-3');

        $('#seeAllRidesButtonDiv').removeClass('col-sm-4');
        $('#seeAllRidesButtonDiv').addClass('col-sm-3');
        $('#seeAllRidesButtonDiv').removeClass('col-md-4');
        $('#seeAllRidesButtonDiv').addClass('col-md-3');

        $('#logoutButtonDiv').removeClass('col-sm-4');
        $('#logoutButtonDiv').addClass('col-sm-3');
        $('#logoutButtonDiv').removeClass('col-md-4');
        $('#logoutButtonDiv').addClass('col-md-3');

        $('#viewProfileButtonDiv').removeClass('col-sm-4');
        $('#viewProfileButtonDiv').addClass('col-sm-3');
        $('#viewProfileButtonDiv').removeClass('col-md-4');
        $('#viewProfileButtonDiv').addClass('col-md-3');
        console.log('Updated UI for dispatcher');
    } else if (role == 'Driver') {
        $('#addRideButtonDiv').addClass('col-sm-4');
        $('#addRideButtonDiv').removeClass('col-sm-3');
        $('#addRideButtonDiv').addClass('col-md-4');
        $('#addRideButtonDiv').removeClass('col-md-3');

        $('#seeAllRidesButtonDiv').addClass('col-sm-4');
        $('#seeAllRidesButtonDiv').removeClass('col-sm-3');
        $('#seeAllRidesButtonDiv').addClass('col-md-4');
        $('#seeAllRidesButtonDiv').removeClass('col-md-3');

        $('#logoutButtonDiv').addClass('col-sm-4');
        $('#logoutButtonDiv').removeClass('col-sm-3');
        $('#logoutButtonDiv').addClass('col-md-4');
        $('#logoutButtonDiv').removeClass('col-md-3');

        $('#viewProfileButtonDiv').addClass('col-sm-4');
        $('#viewProfileButtonDiv').removeClass('col-sm-3');
        $('#viewProfileButtonDiv').addClass('col-md-4');
        $('#viewProfileButtonDiv').removeClass('col-md-3');

        $('#seeDispatcherRidesButtonDiv').hide();
        console.log('Updated UI for driver');
    } else if (role == 'Customer') {
        $('#addRideButtonDiv').addClass('col-sm-4');
        $('#addRideButtonDiv').removeClass('col-sm-3');
        $('#addRideButtonDiv').addClass('col-md-4');
        $('#addRideButtonDiv').removeClass('col-md-3');

        $('#seeAllRidesButtonDiv').addClass('col-sm-4');
        $('#seeAllRidesButtonDiv').removeClass('col-sm-3');
        $('#seeAllRidesButtonDiv').addClass('col-md-4');
        $('#seeAllRidesButtonDiv').removeClass('col-md-3');

        $('#logoutButtonDiv').addClass('col-sm-4');
        $('#logoutButtonDiv').removeClass('col-sm-3');
        $('#logoutButtonDiv').addClass('col-md-4');
        $('#logoutButtonDiv').removeClass('col-md-3');

        $('#viewProfileButtonDiv').addClass('col-sm-4');
        $('#viewProfileButtonDiv').removeClass('col-sm-3');
        $('#viewProfileButtonDiv').addClass('col-md-4');
        $('#viewProfileButtonDiv').removeClass('col-md-3');

        $('#seeDispatcherRidesButtonDiv').hide();
        console.log('Updated UI for customer');
    }
}

function clearForm(formID) {
    $(`form#${formID} input`).each(function () {
        $(this).val('');
    });
}

function checkRidesTables() { 
    $('#no-rides-message').hide();
    console.log('DEBUG: Checking tables for rides');

    if ($('#order-rides-table-body tr').length !== 0) 
        $('#orderRidesTableDiv').fadeIn('500');
    else
        $('#orderRidesTableDiv').hide();
    
    if ($('#rides-table-body tr').length !== 0) 
        $('#ridesTableDiv').fadeIn('500');
    else
        $('#ridesTableDiv').hide();

    if ($('#order-rides-table-body tr').length == 0 && $('#rides-table-body tr').length == 0) {
        $('#orderRidesTableDiv').hide();
        $('#ridesTableDiv').hide();
        $('#no-rides-message').show();
    }
}

function showSnackbar(message) {
    $('#snackbar').html(message);
    $('#snackbar').addClass("show");
    setTimeout(function () { $('#snackbar').removeClass('show'); }, 3000);
}

function updateMark(role) {
    if (role == 'Customer') {
        $('#orderRideMark').text('ordering a ride');
        $('#orderRideMark').unbind('click').click(function () {
            event.preventDefault();
            $('#orderRideButton').trigger('click');
        });
    } else if (role == 'Dispatcher') {
        $('#orderRideMark').text('adding a ride');
        $('#orderRideMark').unbind('click').click(function () {
            event.preventDefault();
            $('#addRideButton').trigger('click');
        });
    } else if (role == 'Driver') {
        $('#orderRideMark').text('checking out some trip requests');
        $('#orderRideMark').unbind('click').click(function (e) {
            e.preventDefault();
            console.log('Checking out some trips ...');
        });
    }
}

/* Cookie logika */
// Source: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}