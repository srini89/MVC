$(function () {
 
    $('#create').on('click', '.phoneNumberMask', function () {
        $('.phoneNumberMask').mask('000-000-0000');
    });
   
    //contact is a claims department, We don't need to save first and last name 
    $("#Contact_ClaimsDepartment").on("click", function () {
        if ($("#Contact_ClaimsDepartment").is(":checked")) {
            $("#Contact_FirstName").prop("disabled", true);
            $("#Contact_LastName").prop("disabled", true);
            $("#Contact_FirstName").val("");
            $("#Contact_LastName").val("");
        }
        else {
            $("#Contact_FirstName").prop("disabled", false);
            $("#Contact_LastName").prop("disabled", false);
        }
    });

    $("#CloseNoClaim").on("click", function () {
        $("#create").empty();
    });

    $("#CloseClaim").on("click", function () {
        $("#create").empty();
    });

    $("#policereport").on("click", "#ClosePoliceReport", function () {
        var clientVehicleId = $(this).data('clientvehicleid');

        $("#policereport").empty();
        $("#create").empty();
        var jqxhr = $.post("/Preprocessing/ReleaseLock?clientVehicleId=" + clientVehicleId, function (response) {
            console.log("Lock released for clientVehicle " + clientVehicleId);
        })

    });
});