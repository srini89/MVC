$(document).ready(function () {
    $('#FollowUpActionDate').attr("min", GetToday());

    $('#form0').keypress(keypressHandler);
});

function countChar(val) {
    var len = val.value.length;
    var charsLeft = 75 - len + " characters remaining";
    $("#charCounter").text(charsLeft);

};

function UpdateFailure() {
    var selectedOption = $('#SelectedTrigger :selected').text();
    var followUpActionDate = $('#FollowUpActionDate').val();
    $('#TriggerDrowndownValidation').css('display', 'none');
    $('#FollowUpActionDateValidation').css('display', 'none');

    if (selectedOption === 'Select One') {
        $('#assignFollowUpSubmit').removeAttr('disabled');
        $('#TriggerDrowndownValidation').css('display', 'inline');
    };

    if (followUpActionDate < GetToday()) {
        $('#assignFollowUpSubmit').removeAttr('disabled');
        $('#FollowUpActionDateValidation').css('display', 'inline');
    };
};

function keypressHandler(e) {
    if (e.which === 13) {
        e.preventDefault(); //stops default action: submitting form
        $(this).blur();
        $('#assignFollowUpSubmit').focus().click();//give your submit an ID
    }
};

function GetToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return today = yyyy + '-' + mm + '-' + dd;
};