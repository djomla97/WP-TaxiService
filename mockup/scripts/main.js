/*
 * Author: Mladen Milosevic
 * Date: 18.05.2018
 */

/*jshint esversion: 6 */

$(document).ready(function (){
    // sakrijemo na pocetku div-ove
    $('#home-customer-view').css('display', 'none');

    // ako klikne na login
    $('#loginButton').click(function(e){
        e.preventDefault();

        // ovde ide provera za login
        $.get('http://localhost:58775/api/users', function(data){
            console.log(data);
        });
            
        $('#login-register-view').slideUp(300);
        $('#login-register-view').hide(1);

        $('#home-customer-view').show();
    });

    // kad klikne na logout, odjavi i ocisti cookies?
    $('#logoutButton').click(function(e){
        e.preventDefault();
        
        // logika za logout

        $('#login-register-view').show(1);
        $('#login-register-view').slideDown(500);

        $('#home-customer-view').hide(1);

    });

    $('#registerButton').click(function(){
        event.preventDefault();

        // logika za register
        let username = $('#username').val();
        let password = $('#password').val();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let email = $('#email').val();
        let phone = $('#phone').val();
        let pid = $('#pid').val();
        let gender = $('#radioGender').val();
        console.log(gender);

        /*
        $.post('http://localhost:58775/api/users', function(data){
            console.log('ok');
        });
        */

    });


    // neka animacija .. nesto .. kao
    $('#login-form-view').hover(function(e){
        e.preventDefault();

        $('#register-form-view').css('opacity', 0.5);
        $(this).css('opacity', 1);
    }, 
    function(e){
        e.preventDefault();

        $('#register-form-view').css('opacity', 1);

    });

    // animacija za focus 
    $('#register-form-view').hover(function(e){
        e.preventDefault();

        $('#login-form-view').css('opacity', 0.5);
        $(this).css('opacity', 1);
    }, 
    function(e){
        e.preventDefault();

        $('#login-form-view').css('opacity', 1);

    });
    

});



