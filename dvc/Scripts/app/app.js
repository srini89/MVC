$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    toggleCpFields();

    $("#SelectedRoles_2__Selected").on("click", function () {
        toggleCpFields();
    });

    $(".reassign-all-client").change(function () {
        $(".reassign-all-user").empty();
        $.ajax({
            type: 'POST',
            url: '/Admin/GetFilteredUsers',
            dataType: 'json',
            data: { assigneeId: $(".assignee-id").val(), clientIdFilter: $(".reassign-all-client").val() },
            success: function (users) {
                if (users.length > 0) {
                    $('#reassign-all-no-users').hide();
                    $.each(users, function (i, user) {
                        $(".reassign-all-user").append('<option value="' + user.value + '">' + user.text + '</option>');
                    });
                } else {
                    $('#reassign-all-no-users').show();
                }
            },
            error: function (ex) {
                alert('Failed to retrieve filtered users.' + ex);
            }
        });
        return false;
    })

    $(".reassign-client").change(function () {
        $(".reassign-user").empty();
        $.ajax({
            type: 'POST',
            url: '/Admin/GetFilteredUsers',
            dataType: 'json',
            data: { assigneeId: $(".assignee-id").val(), clientIdFilter: $(".reassign-client").val() },
            success: function (users) {
                if (users.length > 0) {
                    $('#reassign-no-users').hide();
                    $.each(users, function (i, user) {
                        $(".reassign-user").append('<option value="' + user.value + '">' + user.text + '</option>');
                    });
                } else {
                    $('#reassign-no-users').show();
                }
            },
            error: function (ex) {
                alert('Failed to retrieve filtered users.' + ex);
            }
        });
        return false;
    })

});

function toggleCpFields()
{
    if ($('#SelectedRoles_2__Selected').is(":checked")) {
        $("#cp-settings").show();
    }
    else {
        //uncheck clients and enabled checkboxes.
        $('#cp-settings').find('input[type=checkbox]:checked').removeAttr('checked');
        $("#cp-settings").hide();
    }
}

(function () {
    "use strict";

    var module = angular.module("app", []);

    $(document).on('invalid-form.validate', 'form', function () {
        var button = $(this).find('input[type="submit"], button[type="submit"]');
        setTimeout(function () {
              button.removeAttr('disabled');
        }, 1);
    });
    $(document).on('submit', 'form', function () {
        var button = $(this).find('input[type="submit"], button[type="submit"]');
        setTimeout(function () {
            if (button.prop('id') !== "generate-letter-button") {
                button.prop('disabled', 'disabled');
            }
        }, 0);
    });
})();