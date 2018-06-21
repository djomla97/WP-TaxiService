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


    /* ANIMATIONS FOR RATING STARS */

    // reset to 0 if mouse leaves div
    $('div#ratingStars').mouseleave(mouseLeaveHandler);

    // HOVER
    $('i#oneStar').hover(oneStarHover);
    $('i#twoStar').hover(twoStarHover);
    $('i#threeStar').hover(threeStarHover);
    $('i#fourStar').hover(fourStarHover);
    $('i#fiveStar').hover(fiveStarHover);

    // CLICK
    $('i#oneStar').click(oneStarClick);
    $('i#twoStar').click(twoStarClick);
    $('i#threeStar').click(threeStarClick);
    $('i#fourStar').click(fourStarClick);
    $('i#fiveStar').click(fiveStarClick);

    /* END - ANIMATION FOR RATING STARS*/

}); // end on ready

// state check
var rating = 0;
var clickedOnRating = false;
var clickedRating = null;

function mouseLeaveHandler() {
    // preuzme rating
    $('#ratingNumber').val(rating);

    if (!clickedOnRating) {
        $('div#ratingStars').children().each(function () {
            if ($(this).hasClass('icon-d')) {
                $(this).removeClass('fas');
                $(this).removeClass('icon-d');
                $(this).addClass('far');
                $(this).addClass('icon-b');
            }
        });
    } else {
        $('div#ratingStars').empty();
        $('div#ratingStars').append(clickedRating);
        restartRatingListeners();
    }
}

// 1
function oneStarHover() {
    // 1
    $(this).removeClass('far')
    $(this).removeClass('icon-b');
    $(this).addClass('fas');
    $(this).addClass('icon-d');

    // 2
    if ($(this).next().hasClass('icon-d')) {
        $(this).next().removeClass('fas');
        $(this).next().removeClass('icon-d');
        $(this).next().addClass('far');
        $(this).next().addClass('icon-b');
    }

    // 3
    if ($(this).next().next().hasClass('icon-d')) {
        $(this).next().next().removeClass('fas');
        $(this).next().next().removeClass('icon-d');
        $(this).next().next().addClass('far');
        $(this).next().next().addClass('icon-b');
    }

    // 4
    if ($(this).next().next().next().hasClass('icon-d')) {
        $(this).next().next().next().removeClass('fas');
        $(this).next().next().next().removeClass('icon-d');
        $(this).next().next().next().addClass('far');
        $(this).next().next().next().addClass('icon-b');
    }

    // 5
    if ($(this).next().next().next().next().hasClass('icon-d')) {
        $(this).next().next().next().next().removeClass('fas');
        $(this).next().next().next().next().removeClass('icon-d');
        $(this).next().next().next().next().addClass('far');
        $(this).next().next().next().next().addClass('icon-b');
    }
}

function oneStarClick() {

    rating = 1;
    clickedOnRating = true;
    clickedRating = `<i id="oneStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="twoStar" class="far fa-star fa-lg icon-b"></i>
                                <i id="threeStar" class="far fa-star fa-lg icon-b"></i>
                                <i id="fourStar" class="far fa-star fa-lg icon-b"></i>
                                <i id="fiveStar" class="far fa-star fa-lg icon-b"></i>`;

    $('div#ratingStars').empty();
    $('div#ratingStars').append(clickedRating);
    restartRatingListeners();
}

// 2
function twoStarHover() {
    // 2
    $(this).removeClass('far')
    $(this).removeClass('icon-b');
    $(this).addClass('fas');
    $(this).addClass('icon-d');

    // 1
    if (!$(this).prev().hasClass('icon-d')) {
        $(this).prev().removeClass('far');
        $(this).prev().removeClass('icon-b');
        $(this).prev().addClass('fas');
        $(this).prev().addClass('icon-d');
    }

    // 3
    if ($(this).next().hasClass('icon-d')) {
        $(this).next().removeClass('fas');
        $(this).next().removeClass('icon-d');
        $(this).next().addClass('far');
        $(this).next().addClass('icon-b');
    }

    // 4
    if ($(this).next().next().hasClass('icon-d')) {
        $(this).next().next().removeClass('fas');
        $(this).next().next().removeClass('icon-d');
        $(this).next().next().addClass('far');
        $(this).next().next().addClass('icon-b');
    }

    // 5
    if ($(this).next().next().next().hasClass('icon-d')) {
        $(this).next().next().next().removeClass('fas');
        $(this).next().next().next().removeClass('icon-d');
        $(this).next().next().next().addClass('far');
        $(this).next().next().next().addClass('icon-b');
    }
}

function twoStarClick() {

    rating = 2;
    clickedOnRating = true;
    clickedRating = `<i id="oneStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="twoStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="threeStar" class="far fa-star fa-lg icon-b"></i>
                                <i id="fourStar" class="far fa-star fa-lg icon-b"></i>
                                <i id="fiveStar" class="far fa-star fa-lg icon-b"></i>`;

    $('div#ratingStars').children().detach();
    $('div#ratingStars').append(clickedRating);
    restartRatingListeners();
}

// 3
function threeStarHover() {
    // 3
    $(this).removeClass('far')
    $(this).removeClass('icon-b');
    $(this).addClass('fas');
    $(this).addClass('icon-d');

    // 2
    if (!$(this).prev().hasClass('icon-d')) {
        $(this).prev().removeClass('far');
        $(this).prev().removeClass('icon-b');
        $(this).prev().addClass('fas');
        $(this).prev().addClass('icon-d');
    }

    // 1
    if (!$(this).prev().prev().hasClass('icon-d')) {
        $(this).prev().prev().removeClass('far');
        $(this).prev().prev().removeClass('icon-b');
        $(this).prev().prev().addClass('fas');
        $(this).prev().prev().addClass('icon-d');
    }

    // 4
    if ($(this).next().hasClass('icon-d')) {
        $(this).next().removeClass('fas');
        $(this).next().removeClass('icon-d');
        $(this).next().addClass('far');
        $(this).next().addClass('icon-b');
    }

    // 5
    if ($(this).next().next().hasClass('icon-d')) {
        $(this).next().next().removeClass('fas');
        $(this).next().next().removeClass('icon-d');
        $(this).next().next().addClass('far');
        $(this).next().next().addClass('icon-b');
    }
}

function threeStarClick() {
    rating = 3;
    clickedOnRating = true;
    clickedRating = `<i id="oneStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="twoStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="threeStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="fourStar" class="far fa-star fa-lg icon-b"></i>
                                <i id="fiveStar" class="far fa-star fa-lg icon-b"></i>`;

    $('div#ratingStars').children().detach();
    $('div#ratingStars').append(clickedRating);
    restartRatingListeners();
}

// 4
function fourStarHover() {
    // 4
    $(this).removeClass('far')
    $(this).removeClass('icon-b');
    $(this).addClass('fas');
    $(this).addClass('icon-d');

    // 3
    if (!$(this).prev().hasClass('icon-d')) {
        $(this).prev().removeClass('far');
        $(this).prev().removeClass('icon-b');
        $(this).prev().addClass('fas');
        $(this).prev().addClass('icon-d');
    }

    // 2
    if (!$(this).prev().prev().hasClass('icon-d')) {
        $(this).prev().prev().removeClass('far');
        $(this).prev().prev().removeClass('icon-b');
        $(this).prev().prev().addClass('fas');
        $(this).prev().prev().addClass('icon-d');
    }

    // 1
    if (!$(this).prev().prev().prev().hasClass('icon-d')) {
        $(this).prev().prev().prev().removeClass('far');
        $(this).prev().prev().prev().removeClass('icon-b');
        $(this).prev().prev().prev().addClass('fas');
        $(this).prev().prev().prev().addClass('icon-d');
    }

    // 5
    if ($(this).next().hasClass('icon-d')) {
        $(this).next().removeClass('fas');
        $(this).next().removeClass('icon-d');
        $(this).next().addClass('far');
        $(this).next().addClass('icon-b');
    }
}

function fourStarClick() {
    rating = 4;
    clickedOnRating = true;
    clickedRating = `<i id="oneStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="twoStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="threeStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="fourStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="fiveStar" class="far fa-star fa-lg icon-b"></i>`;

    $('div#ratingStars').children().detach();
    $('div#ratingStars').append(clickedRating);
    restartRatingListeners();
}

// 5
function fiveStarHover() {
    // 5
    $(this).removeClass('far')
    $(this).removeClass('icon-b');
    $(this).addClass('fas');
    $(this).addClass('icon-d');

    // 4
    if (!$(this).prev().hasClass('icon-d')) {
        $(this).prev().removeClass('far');
        $(this).prev().removeClass('icon-b');
        $(this).prev().addClass('fas');
        $(this).prev().addClass('icon-d');
    }

    // 3
    if (!$(this).prev().prev().hasClass('icon-d')) {
        $(this).prev().prev().removeClass('far');
        $(this).prev().prev().removeClass('icon-b');
        $(this).prev().prev().addClass('fas');
        $(this).prev().prev().addClass('icon-d');
    }

    // 2
    if (!$(this).prev().prev().prev().hasClass('icon-d')) {
        $(this).prev().prev().prev().removeClass('far');
        $(this).prev().prev().prev().removeClass('icon-b');
        $(this).prev().prev().prev().addClass('fas');
        $(this).prev().prev().prev().addClass('icon-d');
    }

    // 1
    if (!$(this).prev().prev().prev().prev().hasClass('icon-d')) {
        $(this).prev().prev().prev().prev().removeClass('far');
        $(this).prev().prev().prev().prev().removeClass('icon-b');
        $(this).prev().prev().prev().prev().addClass('fas');
        $(this).prev().prev().prev().prev().addClass('icon-d');
    }
}

function fiveStarClick() {
    rating = 5;
    clickedOnRating = true;
    clickedRating = `<i id="oneStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="twoStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="threeStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="fourStar" class="fas fa-star fa-lg icon-d"></i>
                                <i id="fiveStar" class="fas fa-star fa-lg icon-d"></i>`;

    $('div#ratingStars').children().detach();
    $('div#ratingStars').append(clickedRating);
    restartRatingListeners();
}

// reset listeners for rating hover and click
function restartRatingListeners() {
    $('i#oneStar').hover(oneStarHover);
    $('i#oneStar').click(oneStarClick);

    $('i#twoStar').hover(twoStarHover);
    $('i#twoStar').click(twoStarClick);

    $('i#threeStar').hover(threeStarHover);
    $('i#threeStar').click(threeStarClick);

    $('i#fourStar').hover(fourStarHover);
    $('i#fourStar').click(fourStarClick);

    $('i#fiveStar').hover(fiveStarHover);
    $('i#fiveStar').click(fiveStarClick);
}

function resetRating() {
    rating = 0;
    clickedOnRating = false;
    mouseLeaveHandler();
}