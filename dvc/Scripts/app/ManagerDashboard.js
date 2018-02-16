$(document).ready(function() {
    $('#Manager-Dashboard-Yesterday').on('click', function () {
        var d1 = moment();
        var d2 = moment();

        $('#StartDate').val(d1.subtract(1, 'd').format('YYYY-MM-DD'));
        $('#EndDate').val(d2.subtract(1, 'd').format('YYYY-MM-DD'));
        $('#Date-Range-Form').submit();
    });
    $('#Manager-Dashboard-SevenDays').on('click', function () {
        var d1 = moment();
        var d2 = moment();

        $('#StartDate').val(d1.subtract(7, 'd').format('YYYY-MM-DD'));
        $('#EndDate').val(d2.subtract(1, 'd').format('YYYY-MM-DD'));
        $('#Date-Range-Form').submit();
    });
    $('#Manager-Dashboard-ThirtyDays').on('click', function () {
        var d1 = moment();
        var d2 = moment();

        $('#StartDate').val(d1.subtract(30, 'd').format('YYYY-MM-DD'));
        $('#EndDate').val(d2.subtract(1, 'd').format('YYYY-MM-DD'));
        $('#Date-Range-Form').submit();
    });
});