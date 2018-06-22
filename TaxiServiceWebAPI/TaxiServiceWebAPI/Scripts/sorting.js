/*
 * Author: Mladen Milosevic
 * Date: 21.06.2018
 */

$(document).ready(function () {
    $('#dateTimeSort').click(function () {
        sortTable(5, 'rides-table');
    });

    $('#dateTimeSortOrdered').click(function () {
        sortTable(2, 'order-rides-table');
    });

    $('#ratingSort').click(function () {
        sortTable(6, 'rides-table');
    });

});


function sortTable(n, tableId) {
    let table = document.getElementById(tableId);
    let rows, shouldSwitch;
    let switchCount = 0;
    let i, x, y;

    let switching = true;
    let dir = 'asc';

    while (switching) {
        switching = false;
        rows = table.getElementsByTagName('TR');
        
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName('TD')[n];
            y = rows[i + 1].getElementsByTagName('TD')[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //console.log(x.innerHTML.toLowerCase() + 'is bigger than ' + y.innerHTML.toLowerCase())
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {           
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

}
