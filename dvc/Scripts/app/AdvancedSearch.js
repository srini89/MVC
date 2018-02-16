$(document).ready(function () {

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $(".advSrchCriteria").change(function () {

        $(".advSearchParams").children().remove();
        $(".advSearchButton").children().remove();

        if ($(".advSrchCriteria option:selected").text() == "Date Of Loss") {
            $(".advSearchParams").append($("#advSrchDateTemplate").html());
            $(".advSearchButton").append('<div class="col-lg-2"><input type="submit" value="Search" class="btn btn-default" /></div>');

        } else if ($(".advSrchCriteria option:selected").text() == "Claim Id") {
            $(".advSearchParams").append($("#advSrchNumberTemplate").html());
            $(".advSearchButton").append('<div class="col-lg-2"><input type="submit" value="Search" class="btn btn-default" /></div>');

        } else if ($(".advSrchCriteria option:selected").text() != "") {
            $(".advSearchParams").append($("#advSrchTextTemplate").html());
            $(".advSearchButton").append('<div class="col-lg-2"><input type="submit" value="Search" class="btn btn-default" /></div>');
        }
    });

    $(".advSrchAttachIcon").click(function (e) {
        e.stopPropagation();
    });

    $('#dvSearchResults').on('click', '#AddCheckDocument', function (e) {
        //e.preventDefault();
        e.stopPropagation();
        
        var id = $(this).data('id');
        $("#Document_ClaimId").val(id);

        $('#addCheckModal').modal('toggle');

    });

    $('#dvSearchResults').on('click', '#AddClaimDocument', function (e) {
      //  e.preventDefault();
        e.stopPropagation();
       
        var id = $(this).data('id');
        $("#Document_ClaimId").val(id);

        $('#addDocumentModal').modal('toggle');

    });

    $('#FirstDocumentInput').on('change',
        function () {
            if ($(this).val() !== "") {
                $('#AddDocumentButton').prop("disabled", false);
            } else {
                $('#AddDocumentButton').prop("disabled", true);
            }
        });

    $('#AddFileInputField').on('click',
        function () {
            var d = new Date();
            var newFileUploadHtml = '<div class="row AdditionalFileUpload"><div class="col-sm-8 col-sm-offset-3">' +
                '<input style="display:inline" type="file" name="FileUpload' + d.getTime() + '" />' +
                '<span class="btn btn-default fa fa-trash-o DeleteFileInput" aria-hidden="true"></span><br/></div></div>';
            $('#FileUploadArea').append(newFileUploadHtml);
        });

    $('#FileUploadArea').on('click', '.DeleteFileInput',
        function (e) {
            var inputToRemove = e.target.closest('.AdditionalFileUpload');

            inputToRemove.remove();
        });

    $('#addDocumentModal').on('click',
        function (e) {
            if (e.target !== this)
                return;
            AddDocumentResetForm();
        });

    $('.CancelAddDocument').on('click',
        function() {
            AddDocumentResetForm();
        });

    $('#AddCheck').on('click', function (e) {

        //#region CheckValidation 
        if ($("#CheckUpload").val() == "") {
            alert("Please select a check to upload.");
            return;
        }

        if ($("#Document_Check_Number").val() === "") {
            alert("Please enter a check number.");
            return;
        }

        if ($("#Document_Check_Amount").val() != $("#Document_Check_ConfirmAmount").val()) {
            alert("Check amounts do not match.");
            return;
        }
        else if ($("#Document_Check_Amount").val() === "") {
            alert("Please enter a check amount.");
            return;
        };

        var isCheckUnique = true;

        $.ajax({
            type: "POST",
            url: "/Claim/CheckForDuplicateChecks",
            data: {
                claimId: $("#Document_ClaimId").val(),
                checkNum: $("#Document_Check_Number").val(),
                checkAmount: $("#Document_Check_Amount").val()
            },
            success: function (result) {
                isCheckUnique = result;
                if (isCheckUnique) {
                    addCheckToClaim();
                }
                else {
                    var addNonUniqueCheck = confirm("A check with this number and amount already exists for this claim.\nPress OK to add check anyway or Cancel to abort.");
                    if (addNonUniqueCheck) {
                        addCheckToClaim();
                    }
                    else {
                        alert("Check was not added to the claim.");
                        $('#addCheckModal').modal('toggle');

                    };
                };
            },
            error: function (xhr, status, p3, p4) {
                var err = "Error " + " " + status + " " + p3 + " " + p4;
                if (xhr.responseText && xhr.responseText[0] === "{")
                    err = JSON.parse(xhr.responseText).Message;
                console.log(err);
                alert(err);
            }
        });
        //#endregion CheckValidation 

        var addCheckToClaim = function () {
            var file = document.getElementById('CheckUpload').files[0];
            if (file !== null) {
                if (window.FormData !== undefined) {


                    var data = new FormData();
                    data.append("file", file);

                    $.ajax({
                        type: "POST",
                        url: "/AdvancedSearch/AddCheckAdvancedSearch?id=" + $("#Document_ClaimId").val() + "&checkNumber=" + $("#Document_Check_Number").val() + "&checkAmount=" + $("#Document_Check_Amount").val(),
                        contentType: false,
                        processData: false,
                        data: data,
                        success: function (result) {
                            //clear inputs
                            $('#CheckUpload').val('');
                            $('#Document_Check_Number').val('');
                            $('#Document_Check_Amount').val('');
                            $('#Document_Check_ConfirmAmount').val('');

                            //close modal
                            $('#addCheckModal').modal('toggle');
                            alert('Check was added to the claim.');
                        },
                        error: function (xhr, status, p3, p4) {
                            var err = "Error " + " " + status + " " + p3 + " " + p4;
                            if (xhr.responseText && xhr.responseText[0] === "{")
                                err = JSON.parse(xhr.responseText).Message;
                            alert(err);
                        }
                    });
                } else {
                    alert("This browser doesn't support HTML5 file uploads!");
                }
            }
        };
    });

});

function AddDocumentResetForm() {
    $('input[type=submit]').prop('disabled', false);

    $('.AdditionalFileUpload').remove();

    $('#AddDocumentForm').trigger('reset');
}