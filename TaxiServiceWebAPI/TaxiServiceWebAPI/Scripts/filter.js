/*
 * Author: Mladen Milosevic
 * Date: 22.06.2018
 */

$(document).ready(function () {

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

        if ($('input[name="endDate"]').data('daterangepicker').startDate < $('input[name="endDate"]').data('daterangepicker').minDate) {
            $('input[name="endDate"]').data('daterangepicker').startDate = $('input[name="endDate"]').data('daterangepicker').minDate;
            $('input[name="endDate"]').val($('input[name="endDate"]').data('daterangepicker').startDate.format('DD/MM/YYYY'));
        }

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
    });


});
