/*
 * Author: Mladen Milosevic
 * Date: 22.06.2018
 */

$(document).ready(function () {

    // hide filter message
    $('#filter-message').hide();

    // inital values
    $('input[name="startDate"]').val('');
    $('input[name="startDate"]').attr('placeholder', 'Start date');
    $('input[name="endDate"]').val('');
    $('input[name="endDate"]').attr('placeholder', 'End date');

    // clear dates
    $('#clearDatesButton').click(function () {
        $('input[name="startDate"]').val('');
        $('input[name="startDate"]').attr('placeholder', 'Start date');
        $('input[name="endDate"]').val('');
        $('input[name="endDate"]').attr('placeholder', 'End date');
        filterRides();
    });

    // reset all filter values
    $('#resetFiltersButton').click(function () {
        $('input[name="startDate"]').val('');
        $('input[name="startDate"]').attr('placeholder', 'Start date');
        $('input[name="endDate"]').val('');
        $('input[name="endDate"]').attr('placeholder', 'End date');
        $('#minRatingFilter').val('0');
        $('#maxRatingFilter').val('5');
        $('#minFareFilter').val('');
        $('#maxFareFilter').val('');

        filterRides();
    });

    // start date picker
    $('input[name="startDate"]').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: false,
        "autoApply": false,
        locale: {
            format: "DD/MM/YYYY",
            cancelLabel: 'Clear',
            applyLabel: 'Apply'
        },
        startDate: "15/06/2018"
    }, function (start, end, label) {
        // da datum bude lepsi
        let dt = new Date(Date.parse(start));
        let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        let formatedStart = dt.toLocaleString("en-GB", options);

        console.log("A new start date selection was made: " + formatedStart);
        $('input[name="startDate"]').val(start.format('DD/MM/YYYY'));
        $('input[name="startDate"]').attr('placeholder', '');

        $('input[name="endDate"]').data('daterangepicker').minDate = this.startDate;

        if ($('input[name="endDate"]').val() && $('input[name="endDate"]').data('daterangepicker').startDate < $('input[name="endDate"]').data('daterangepicker').minDate) {
            $('input[name="endDate"]').data('daterangepicker').startDate = $('input[name="endDate"]').data('daterangepicker').minDate;
            $('input[name="endDate"]').val($('input[name="endDate"]').data('daterangepicker').startDate.format('DD/MM/YYYY'));
        }

        filterRides();
    });

    // end date picker
    $('input[name="endDate"]').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: false,
        "autoApply": false,
        locale: {
            format: "DD/MM/YYYY",
            cancelLabel: 'Clear',
            applyLabel: 'Apply'
        }
    }, function (start, end, label) {
        // da datum bude lepsi
        let dt = new Date(Date.parse(start));
        let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        let formatedEnd = dt.toLocaleString("en-GB", options);

        console.log("A new end date selection was made: " + formatedEnd);
        $('input[name="endDate"]').val(start.format('DD/MM/YYYY'));
        $('input[name="endDate"]').attr('placeholder', '');

        filterRides();
    });

    $('#minRatingFilter').change(filterRides);
    $('#maxRatingFilter').change(filterRides);
    $('#minFareFilter').change(filterRides);
    $('#maxFareFilter').change(filterRides);

});

// filter
function filterRides() {

    let filterOptions = {};

    if ($('input[name="startDate"]').val()) {
        let startDateInput = $('input[name="startDate"]').val();
        let switchedDateInput = `${startDateInput.split('/')[1]}/${startDateInput.split('/')[0]}/${startDateInput.split('/')[2]}`;
        let startDateFormated = new Date(switchedDateInput);
        filterOptions.startDate = startDateFormated;
    }

    if ($('input[name="endDate"]').val()) {
        let endDateInput = $('input[name="endDate"]').val();
        let switchedDateInput = `${endDateInput.split('/')[1]}/${endDateInput.split('/')[0]}/${endDateInput.split('/')[2]}`;
        let endDateFormated = new Date(switchedDateInput);
        filterOptions.endDate = endDateFormated;
    }

    if ($('#minRatingFilter').val())
        filterOptions.minRating = $('#minRatingFilter').val();

    if ($('#maxRatingFilter').val())
        filterOptions.maxRating = $('#maxRatingFilter').val();

    if ($('#minFareFilter').val())
        filterOptions.minFare = $('#minFareFilter').val();

    if ($('#maxFareFilter').val())
        filterOptions.maxFare = $('#maxFareFilter').val();

    if (!$('#seeAllRidesButton').data('clicked')) {
        $.ajax({
            method: 'PUT',
            url: `/api/rides/${$('#loggedIn-username').text()}/filter`,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(filterOptions)
        }).done(function (filteredRides) {
            if (filteredRides != null) {
                $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {
                    if (filteredRides.length > 0) {
                        $('#filter-message').hide();
                        updateRidesTables(filteredRides, user);
                    } else {
                        $('#ridesTableDiv').hide();
                        $('#orderRidesTableDiv').hide();
                        $('#filter-message').show();
                    }
                });
            } else {
                showSnackbar('Something went wrong with your request to filter rides');
            }
        });
    } else {
        $.ajax({
            method: 'PUT',
            url: `/api/rides/filter`,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(filterOptions)
        }).done(function (filteredRides) {
            if (filteredRides != null) {
                $.get(`/api/users/${$('#loggedIn-username').text()}`, function (user) {
                    if (filteredRides.length > 0) {
                        $('#filter-message').hide();
                        updateRidesTables(filteredRides, user);
                    } else {
                        $('#ridesTableDiv').hide();
                        $('#orderRidesTableDiv').hide();
                        $('#filter-message').show();
                    }
                });
            } else {
                showSnackbar('Something went wrong with your request to filter rides');
            }
        });
    }
}
