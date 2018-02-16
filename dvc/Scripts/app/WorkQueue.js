$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();

    $('#NewQueueCollapse').on('click', function () {
        $('#NewQueue').toggleClass('active');
        $('#NewQueue').toggleClass('verticalLine');
        $('#NewQueueCollapse').toggleClass('pull-right');
    });

    $('#InvestigationQueueCollapse').on('click', function () {
        $('#InvestigationQueue').toggleClass('active');
        $('#InvestigationQueue').toggleClass('verticalLine');
        $('#InvestigationQueueCollapse').toggleClass('pull-right');
    });

    $('#NegotiateQueueCollapse').on('click', function () {
        $('#NegotiateQueue').toggleClass('active');
        $('#NegotiateQueue').toggleClass('verticalLine');
        $('#NegotiateQueueCollapse').toggleClass('pull-right');
    });

    $('#ChecksQueueCollapse').on('click', function () {
        $('#ChecksQueue').toggleClass('active');
        $('#ChecksQueueCollapse').toggleClass('pull-right');
    });

});