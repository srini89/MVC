$(function () {
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });


    function boldVIN() {
        var docText = $('#vinLabel').html();
        var modifiedText = "";
        if (docText.length > 8) {
            modifiedText = docText.substr(0, docText.length - 8) + '<b>' + docText.substr(docText.length - 8, 8) + '</b>';
        }
        else {
            modifiedText = '<b>' + docText + '</b>';
        }
        $('#vinLabel').html(modifiedText);
    }

    boldVIN();

    var originalFormData;

    $(document).ready(function () {

        $('.phoneNumberMask').mask('000-000-0000');

        calculate17c();
        calculateAvgComparables();
        calculatePercentDiminishedValue();

        if ($("#Claim_DiminishedValue_ActualDiminishedValue").val() < 0) {
            $('#Claim_DiminishedValue_ActualDiminishedValue').css('background-color', '#f7c442');
        } else {
            $('#Claim_DiminishedValue_ActualDiminishedValue').css('background-color', '#eee');
        };
        originalFormData = $('form#updateClaimForm').serialize();
    });

    // Diminished Value Functions //
    function calculate17c() {
        var fm = $("#Claim_DiminishedValue_FairMarketValue").val();
        var ac = $("#Claim_DiminishedValue_ArbitraryCap").val();
        var dm = $("#Claim_DiminishedValue_DamageMultiplier").val();
        var dom = $("#Claim_DiminishedValue_DipOnMileage").val();
        var total = fm * 1 * ac * .01 * 1 * dm * 1 * dom * 1;
        $("#Claim_DiminishedValue_SeventeenCDiminishedValue").val(total.toFixed(2));
        CalculateDVClaimAmount();
    }

    //TODO: Make sure this works
    function calculateAvgComparables() {
        var fm = $("#Claim_DiminishedValue_FairMarketValue").val();


        //calculate average Undamaged Values
        var undamagedValueCount = 0;
        var avgUndamagedValues = 0;
        $('#DiminishedValueUndamagedValues input[type="text"]').each(function () {
            undamagedValueCount++;
            avgUndamagedValues += parseFloat(this.value);
        });

        avgUndamagedValues /= undamagedValueCount;

        //calculate average Post Repair Values
        var postRepairValueCount = 0;
        var avgPostRepairValues = 0;
        $('#DiminishedValuePostRepairValues input[type="text"]').each(function () {
            postRepairValueCount++;
            avgPostRepairValues += parseFloat(this.value);
        });

        avgPostRepairValues /= postRepairValueCount;

        var dimValue = avgUndamagedValues - avgPostRepairValues;
        $(".Claim_DiminishedValue_ActualDiminishedValue").val(dimValue.toFixed(2).toString());

        CalculateDVClaimAmount();
    }

    function calculatePercent() {
        var amt = $("#Claim_DiminishedValue_DiminishedPercentValue").val();
        var fm = $("#PercentFairMarketValue").val();

        if ($.trim(amt) === '') {
            amt = fm;
        }
        var dimPercent = (((amt * 1) / fm * 1) * 100).toFixed(2);
        $("#Claim_DiminishedValue_DiminishedPercent").val(dimPercent.toString());
    }

    function calculatePercentDiminishedValue() {
        var percentValue = $("#Claim_DiminishedValue_DiminishedPercent").val();

        if ($.trim(percentValue) === '') {
            percentValue = 10;
            $("#Claim_DiminishedValue_DiminishedPercent").val(percentValue);
        };

        var fairMarketValue = $("#PercentFairMarketValue").val();

        var diminishedValue = (fairMarketValue  * (percentValue * .01)).toFixed(2);

        $("#Claim_DiminishedValue_DiminishedPercentValue").val(diminishedValue.toString());
    }

    $(document).on('change', '#Claim_DiminishedValue_FairMarketValue', function () {
        //Set other model field for display
        $("#fmv-addon").toggleClass("fa-question fa-spinner fa-spin");
        var amt = $("#Claim_DiminishedValue_FairMarketValue").val();
        $("#Claim_DiminishedValue_FairMarketValue2").val(amt);
        $("#PercentFairMarketValue").val(amt);
        $("#FirstDVCVNadaValue_Value").val(amt);

        //Recalculate all 3 calculations
        calculate17c();
        calculateAvgComparables();
        calculatePercentDiminishedValue();
        $("#fmv-addon").toggleClass("fa-spinner fa-spin fa-question");
    });

    $(document).on('change', '#Claim_DiminishedValue_ArbitraryCap', function () {
        calculate17c();
    });

    $(document).on('change', '#Claim_DiminishedValue_DamageMultiplier', function () {
        calculate17c();
    });

    $(document).on('change', '#Claim_DiminishedValue_DipOnMileage', function () {
        calculate17c();
    });

    $(document).on('change', '#cv1', function () {
        calculateAvgComparables();
    });

    $(document).on('change', '#cv2', function () {
        calculateAvgComparables();
    });

    $(document).on('change', '#Claim_DiminishedValue_DiminishedPercentValue', function () {
        calculatePercent();
    });

    $(document).on('change', '#Claim_DiminishedValue_DiminishedPercent', function () {
        calculatePercentDiminishedValue();
    });

    function CalculateDVClaimAmount() {
        var value = $(Claim_DiminishedValue_CalculationType).filter(':checked').val();
        var result = 0;
        if (value === "1") {  //17C
            result = $("#Claim_DiminishedValue_SeventeenCDiminishedValue").val();
            $(".Claim_DiminishedValue_DiminishedValueClaimAmount").val(result.toString());
        }
        else if (value === "2") { // Comparables/Actual
            result = $("#Claim_DiminishedValue_ActualDiminishedValue").val();
            $(".Claim_DiminishedValue_DiminishedValueClaimAmount").val(result.toString());

        }
        else if (value === "3") { //Percent
            result = $("#Claim_DiminishedValue_DiminishedPercentValue").val();
            $(".Claim_DiminishedValue_DiminishedValueClaimAmount").val(result.toString());
        }
    }

    $(document).on('click', '#Claim_DiminishedValue_CalculationType', function () {
        var value = $(Claim_DiminishedValue_CalculationType).filter(':checked').val();
        if (value === "1") {  //17C
            if ($("#collapse-seventeenC").prop("title") === "Expand 17C section") {
                $("#collapse-seventeenC").prop("title", "Collapse 17C section");
                $("#seventeenC-body").fadeIn("fast");
                $("#seventeenC-expandcollapse-icon").toggleClass("fa-chevron-down fa-chevron-right");
            }
        }
        else if (value === "2") { //Actual 
            if ($("#collapse-actual-dv").prop("title") === "Expand Actual Diminished Value section") {
                $("#collapse-actual-dv").prop("title", "Collapse Actual Diminished Value section");
                $("#actual-dv-body").fadeIn("fast");
                $("#actual-dv-expandcollapse-icon").toggleClass("fa-chevron-down fa-chevron-right");
            }
        }

        CalculateDVClaimAmount();
    });

    $("#AddUndamagedVehicle").on("click", function () {
        var claimId = $("#Claim_Id").val();
        var value = $("#UndamagedVehicle_Value").val();
        var resource = $("#UndamagedVehicle_Resource").val();


        //Generate Document from DB
        $.ajax({
            url: '/Claim/AddUndamagedVehicle',
            type: 'Post',

            data: {
                value: value,
                resource: resource,
                claimId: claimId
            },
            success: function (result) {
                $("#DiminishedValueUndamagedRows").append(result);
                calculateActualDiminishedValue(claimId);
                $('#addUndamagedValueModal').modal("toggle");
                $("#UndamagedVehicle_Value").val("");
            }
        });
    });

    $("#AddPostRepairVehicle").on("click", function () {
        var claimId = $("#Claim_Id").val();
        var value = $("#PostRepairVehicle_Value").val();
        var resource = $("#PostRepairVehicle_Resource").val();

        $.ajax({
            url: '/Claim/AddPostRepairVehicle',
            type: 'Post',

            data: {
                value: value,
                resource: resource,
                claimId: claimId
            },
            success: function (result) {
                $("#DiminishedValuePostRepairRows").append(result);
                calculateActualDiminishedValue(claimId);
                $("#addPostRepairValueModal").modal("toggle");
                $("#PostRepairVehicle_Value").val("");
            }
        });

    });

    function calculateActualDiminishedValue(claimId) {

        $.ajax({
            url: '/Claim/GetActualDiminishedValue',
            type: 'Get',
            data: {
                claimId: claimId
            },
            success: function (result) {
                $("#Claim_DiminishedValue_ActualDiminishedValue").val(result);
                console.log("Actual DV: ", result);
                if ($("#Claim_DiminishedValue_ActualDiminishedValue").val() < 0) {
                    $('#Claim_DiminishedValue_ActualDiminishedValue').css('background-color', '#f7c442');
                } else {
                    $('#Claim_DiminishedValue_ActualDiminishedValue').css('background-color', '#eee');
                };
            }
        }).done(
        function () {
            CalculateDVClaimAmount();
        });
    }

    $("#actual-dv-body").on("click", ".deleteDiminishedValueComparableVehicle", function () {

        var row = $(this).closest('.row');

        if (confirm('Are you sure you want to delete this comparable?')) {
            //delete from DB
            var dvcvId = $(this).data('id');
            var claimId = $("#Claim_Id").val();
            $.ajax({
                url: '/Claim/DeleteDiminishedValueComparableVehicle',
                type: 'Post',
                dataType: "json",
                data: {
                    Id: dvcvId
                },
                success: function (result) {
                    //delete from UI                    
                    row.remove();
                    calculateActualDiminishedValue(claimId);
                }
            });
        }
    });

    $('#FirstDVCVCarfaxValue_Value').on('change', function () {

        var claimId = $('#Claim_Id').val();
        var carfaxAmount = $('#FirstDVCVCarfaxValue_Value').val();

        if (!carfaxAmount) {
            carfaxAmount = 0;
        }

        $.ajax({
            url: '/Claim/SaveCarfaxPostRepairValue',
            data: {
                carfaxValue: carfaxAmount,
                claimId: claimId
            },
            success: function () {
                calculateActualDiminishedValue(claimId);
            }

        });

    });

    $('#Claim_Vehicle_LeaseReturnMileage').change(function () {
        //toggle mileage addon
        $("#mileage-addon").toggleClass("fa-question fa-spinner fa-spin");
        //now click the Update Claim button to submit form.
        $("#UpdateClaim").click();
    });

    $('#Claim_Accident_Mileage').change(function () {
        //toggle mileage addon
        $("#accident-mileage-addon").toggleClass("fa-question fa-spinner fa-spin");
        //now click the Update Claim button to submit form.
        $("#UpdateClaim").click();
    });

    $(document).on('click', '#Claim_DiminishedValue_TypeofDiminishedValue', function () {
        $("#dvtype-addon").toggleClass("fa-question fa-spinner fa-spin");
        $("#UpdateClaim").click();
    });

    $("#collapse-seventeenC").on("click", function () {
        if ($("#collapse-seventeenC").prop("title") === "Collapse 17C section") {
            $("#collapse-seventeenC").prop("title", "Expand 17C section");
            $("#seventeenC-body").fadeOut("fast");
        } else {
            $("#collapse-seventeenC").prop("title", "Collapse 17C section");
            $("#seventeenC-body").fadeIn("fast");
        }
        $("#seventeenC-expandcollapse-icon").toggleClass("fa-chevron-down fa-chevron-right");
    });

    $("#collapse-actual-dv").on("click", function () {
        if ($("#collapse-actual-dv").prop("title") === "Collapse Actual Diminished Value section") {
            $("#collapse-actual-dv").prop("title", "Expand Actual Diminished Value section");
            $("#actual-dv-body").fadeOut("fast");
        } else {
            $("#collapse-actual-dv").prop("title", "Collapse Actual Diminished Value section");
            $("#actual-dv-body").fadeIn("fast");
        }
        $("#actual-dv-expandcollapse-icon").toggleClass("fa-chevron-down fa-chevron-right");
    });

    $("#collapse-percent-dv").on("click", function () {
        if ($("#collapse-percent-dv").prop("title") === "Collapse Percent Diminished Value section") {
            $("#collapse-percent-dv").prop("title", "Expand Percent Diminished Value section");
            $("#percent-dv-body").fadeOut("fast");
        } else {
            $("#collapse-percent-dv").prop("title", "Collapse Percent Diminished Value section");
            $("#percent-dv-body").fadeIn("fast");
        }
        $("#percent-dv-expandcollapse-icon").toggleClass("fa-chevron-down fa-chevron-right");
    });

    // End Diminished Value Functions //


    $('#modal-container').on('hidden.bs.modal', function () {
        $(this).removeData('bs.modal');
        $('#modal-container .modal-content').empty();
    });

    //Generate Document
    $("#GenerateDocument").on("click", function () {
        var contactId = $("#Document_ContactId").val();
        var claimId = $("#Claim_Id").val();
        var documentType = $("#Document_DocumentType").val();

        //Generate Document from DB
        $.ajax({
            url: 'GenerateDocument/Claim',
            type: 'Post',

            data: {
                DocumentType: documentType,
                ClaimId: claimId,
                ContactId: contactId

            }


        }).done(function (response) {
        });
        $('#generateDocument').modal('toggle');

        //add to view?

        var response = "<div class='col-sm-6'><div class='col-sm-2'><img src='../images/document.png' class='img-rounded' alt='Document' width='40' height='40'></div><div class='col-sm-6'>"
            + " Document Type" // @doc.DocumentTypeName 
            + "<br />"
            + "Uploaded: " + "TODAY"//@doc.UploadedDate.ToShortDateString()
            + " <br />"
            + "username" //@doc.UploadedUser
            + "</div></div>"


        $("#documentRows").append(response);
        //delete from UI
        //var tr = $(this).closest('tr');
        //tr.remove();
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

    //Look up Statute Of Limitations
    $("#Claim_Accident_State").change(function () {
        $.ajax({
            url: '/Claim/GetStatuteOfLimitations',
            type: 'GET',
            dataType: "json",
            data: {
                state: $("#Claim_Accident_State").val()
            }
        }).done(function (response) {
            $("#Claim_Accident_StatuteOfLimitations").val(response);
        });
    });

    $('#dvNoteResults').on('click', '#EditNote', function () {

        var id = $(this).data('id');
        var content = $(this).data('content');
        $("#UpdatedNote_Content").val(content);
        $("#UpdatedNote_Id").val(id);

        $('#editNoteModal').modal('toggle');

    });

    //Delete Contact
    $(".deleteContact").on("click", function () {

        if (confirm('Are you sure you want to delete this contact?')) {

            //delete from DB
            var contactId = $(this).data('contactid');
            var claimid = $(this).data('claimid');
            $.ajax({
                url: 'DeleteContact/Claim',
                type: 'Post',
                dataType: "json",
                data: {
                    contactId: contactId, claimid: claimid
                }
            }).done(function (response) {
            });

            //delete from UI
            //var tr = $(this).closest('tr');
            //tr.remove();
        }
    });

    $('#dvDocumentResults').on('click', '#DeleteDocument', function () {

        if (confirm('Are you sure you want to delete this Document?')) {


            var docId = $(this).data('docid');
            var claimId = $(this).data('claimid');

            var jqxhr = $.post("/Claim/DeleteDocument?docId=" + docId + "&claimId=" + claimId, function (response) {
                $("#dvDocumentResults").html(response);
                alert("Document has been deleted.");
            })
        }
    });

    $('#dvCheckResults').on('click', '#DeleteCheck', function () {

        if (confirm('Are you sure you want to delete this Check?')) {


            var docId = $(this).data('docid');
            var claimId = $(this).data('claimid');

            var jqxhr = $.post("/Claim/DeleteDocument?docId=" + docId + "&claimId=" + claimId,
                function (response) {
                    $("#dvCheckResults").html(response);

                    UpdateAmountCollected();

                    location.href = "/Claim/ViewClaim/" + claimId;
                });
        }
    });

    $("#FileUpload").on('change', function () {
        $('#file-name').html(this.files[0].name);
    });

    $("#CheckUpload").on('change', function () {
        $('#check-file-name').html(this.files[0].name);
    });

    $('#dvDocumentResults').on('click', '#EditDocumentType', function () {

        var id = $(this).data('id');
        var documentType = $(this).data('documenttype');
        var otherTypeDescription = $(this).data('othertypedescription').trim();
        $("#editDocumentTypeModal").find("#Document_DocumentType").val(documentType);
        $("#Document_Id").val(id);
        $("#editDocumentTypeModal").find("#Document_OtherTypeDescription").val(otherTypeDescription);
        if (otherTypeDescription !== "") {
            $(".edit-other-description").show();
        }

        $('#editDocumentTypeModal').modal('toggle');

    });

    $(document).on('click', 'a[href^="#"]', function (ev) {
        var targetId = $(ev.target).attr('href'),
          $target = $(targetId);

        $target.parents('.collapse').addClass('in').css({ height: '' });
    });

    //Hide-Open all button
    $("#ExpandAll").on("click", function () {
        togglePanels();
    });

    function togglePanels() {
        if ($("#ExpandAll").val() === "Expand All") {
            $('#collapseDetails').collapse("show");
            $('#collapseAccident').collapse("show");
            $('#collapseDiminishedValue').collapse("show");
            $('#collapseContacts').collapse("show");
            $('#collapseAttachments').collapse("show");
            $('#collapseVehicle').collapse("show");
            $('#collapseVehicleTitle').collapse("show");
            $('#collapseNotes').collapse("show");
            $('#collapseHistory').collapse("show");
            $('#ExpandAll').val("Collapse All");
            $('#ExpandAll').prop("title","Collapse all panels");
            $('#ExpandAll').find('i').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-right');
            
            
        }
        else // collapse all divs
        {
            $('#collapseDetails').collapse("hide");
            $('#collapseAccident').collapse("hide");
            $('#collapseDiminishedValue').collapse("hide");
            $('#collapseContacts').collapse("hide");
            $('#collapseAttachments').collapse("hide");
            $('#collapseVehicle').collapse("hide");
            $('#collapseVehicleTitle').collapse("hide");
            $('#collapseNotes').collapse("hide");
            $('#collapseHistory').collapse("hide");
            $('#ExpandAll').val("Expand All");     
            $('#ExpandAll').prop("title", "Expand all panels");
            $('#ExpandAll').find('i').toggleClass('glyphicon-chevron-right').toggleClass('glyphicon-chevron-down');

        }
    }

    //Check for changes and go to the work queue
    $("#ExitClaim").on("click", function () {
        var claimId = $(this).data('claimid');
        exitClaim(claimId);
    });

    function checkIfFormChanged() {
        var currentFormData = $('form#updateClaimForm').serialize();
        var formChanged = false;

        if (originalFormData !== currentFormData) {
            formChanged = true;
        }

        return formChanged;
    }

    function exitClaim(claimId) {
        if (checkIfFormChanged() && confirm('Save changes before returning to the work queue?')) {
            $('#ExitClaim').toggle('click');
        } else {
            $("#updateClaimForm").submit(function (e) {
                //do not submit the form and go to server. We're not saving changes.  Just go back to where they came from.
                e.preventDefault();
            });
            if ($(".return-url").val() !== "") {
                window.location.href = $(".return-url").val();
            }
            else {
                if (document.referrer && document.referrer.toLowerCase().indexOf("viewclaim") === -1 && document.referrer.toLowerCase().indexOf("updateclaim") === -1) {
                    window.location.href = document.referrer;
                } else {
                    window.location.href = '/';
                }
            }
        }
    }

    //pop open the image into a new window
    $("#pop").on("click", function () {
        $('#imagepreview').attr('src', $('#imageresource').attr('src'));
        $('#imagemodal').modal('show');
    });

    $(".faxFormButtonEnabled").hide();
    
    function toggleFaxButton()
    {
        if ($(".faxDocumentForm input:checkbox:checked").length > 0) {
            $(".faxFormButtonEnabled").show();
            $(".faxFormButtonDisabled").hide();
        }
        else {
            $(".faxFormButtonEnabled").hide();
            $(".faxFormButtonDisabled").show();
        }
    }
    
    $("#documentSection").on("change", ".faxDocumentForm input[type='checkbox']", function () { toggleFaxButton(); });

    //Populate fax screen with selected documents.
    $(".faxFormButtonEnabled").on("click", function ()
    {
        var docList = "";
        $("#documentTable tr").each(
            function (i ,row)
            {
                var $row = $(row),
                    $docType = $row.find(".docType"),
                    $checkedBoxes = $row.find("input:checked");
                $checkedBoxes.each(function (i, checkbox) {

                    docList += '<p>' + $docType.text() + '</p>';

                });
            }
        );

        $("#selectedDocumentsToFax").html(docList);

    });

    $('.AdditionalFileUpload input[type="file"]').first().on('change',
        function () {
            if ($(this).val() !== "") {
                $('#AddDocument').prop("disabled", false);
            } else {
                $('#AddDocument').prop("disabled", true);
            };
        });

    $('#AddDocument').on('click', function (e) {

        //Only the first document is required. It will skip any that do not have a file attached.
        if ($('.AdditionalFileUpload input[type="file"]').first().val() === "") {
            alert("Please select a document to upload.");
            return false;
        };

        return true;
    });

    $('#AddFileInputField').on('click',
        function () {
            //var d = new Date();
            var claimId = $('#Id').val();
            $.ajax({
                type: "GET",
                url: "/Claim/GetAdditionalDocumentFileInput?claimId=" + claimId,
                contentType: false,
                processData: false,
                //data: claimId,
                success: function (result) {
                    $('#FileUploadArea').append(result);
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] === "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                    alert(err);
                }
            });
        });

    //if it is the first partial view that is loaded, remove the delete button
    if ($('.AdditionalFileUpload').length === 1) {
        $('.DeleteFileInput').remove();
    };

    $('#FileUploadArea').on('click', '.DeleteFileInput',
        function (e) {
            var inputToRemove = e.target.closest('.AdditionalFileUpload');

            inputToRemove.remove();
        });

    $('#FileUploadArea').on('change', 'input[type="file"]',
        function () {
            var $el = $(this).nextAll('.AttachedFileName');
            
            $el.val($(this)[0].name);
        });

    $('#addDocumentModal').on('click',
        function (e) {
            if (e.target !== this)
                return;
            AddDocumentResetForm();
        });

    $('.CancelAddDocument').on('click',
        function () {
            AddDocumentResetForm();
        });

    $('#AddCheck').on('click', function (e) {

        //#region CheckValidation 
        if ($("#CheckUpload").val() === "") {
            alert("Please select a check to upload.");
            return;
        }

        if ($("#Document_Check_Number").val() === "") {
            alert("Please enter a check number.");
            return;
        }

        if ($("#Document_Check_Amount").val() !== $("#Document_Check_ConfirmAmount").val()) {
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
                claimId: $("#Id").val(),
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
                        url: "/Claim/AddCheck?id=" + $("#Id").val() + "&checkNumber=" + $("#Document_Check_Number").val() + "&checkAmount=" + $("#Document_Check_Amount").val(),
                        contentType: false,
                        processData: false,
                        data: data,
                        success: function (result) {
                            alert('Check was added to claim.');
                            //if it doesn't include doctype, it means it returned a partial view (_ViewChecks), otherwise, it's the entire claim view so reload.
                            if (!result.substr(0, 20).includes("DOCTYPE")) {

                                //clear inputs
                                $('#CheckUpload').val('');
                                $('#check-file-name').val('');
                                $('#Document_Check_Number').val('');
                                $('#Document_Check_Amount').val('');
                                $('#Document_Check_ConfirmAmount').val('');

                                //Visually update claim state to ChecksIn
                                $('#ViewClaimState').html('Checks In');

                                //close modal
                                $('#addCheckModal').modal('toggle');
                                $('#dvCheckResults').html(result);

                                UpdateAmountCollected();
                            }
                            else {
                                location.reload()
                            }
                        },
                        error: function (xhr, status, p3, p4) {
                            var err = "Error " + " " + status + " " + p3 + " " + p4;
                            if (xhr.responseText && xhr.responseText[0] === "{")
                                err = JSON.parse(xhr.responseText).Message;
                            console.log(err);
                            alert(err);
                        }
                    });
                } else {
                    alert("This browser doesn't support HTML5 file uploads!");
                }
            }
        }       

    });

    $('#DisplayStateChange').change(function () {
        if (this.checked)
            $('.state-history-item-container').show('fast');
        else
            $('.state-history-item-container').fadeOut('slow');

    });
    $('#DisplayNotes').change(function () {
        if (this.checked)
            $('.note-history-item-container').fadeIn('fast');
        else
            $('.note-history-item-container').fadeOut('slow');

    });
    $('#DisplayDocuments').change(function () {
        if (this.checked)
            $('.doc-history-item-container').fadeIn('fast');
        else
            $('.doc-history-item-container').fadeOut('slow');

    });
    $('#DisplayClaimReviews').change(function () {
        if (this.checked)
            $('.review-history-item-container').fadeIn('fast');
        else
            $('.review-history-item-container').fadeOut('slow');

    });

    $('#Document_DocumentType').on('change', function () {
        if (this.value === "10" || this.value === "16") {
            $('.other-description').show();
        } else {
            $('.other-description').hide();
        }
    });
    $('.edit-document-type').on('change', function () {
        if (this.value === "10" || this.value === "16") {
            $('.edit-other-description').show();
        } else {
            $('.edit-other-description').hide();
        }
    });
    $('#FileUploadArea').on('change',
        '.document-type',
        function () {
            var $el = $(this).parent().parent().find('.other-description')

            if (this.value === "10" || this.value === "16") {
                $el.show();
            } else {
                $el.hide();
            }
        });

    $('#addNoteModal').on('shown.bs.modal',
        function () {
            $('body').removeClass('modal-open');
        }
    );
    
    (function() {
        var draggable = $('#addNoteModal')[0];
        var anchor = $('#DragWithModalHeader')[0];

        var dragDrop = DragDrop.bind(draggable,
            {
                anchor: anchor
            }
        );
    }());

    $('#editNoteModal').on('shown.bs.modal',
        function () {
            $('body').removeClass('modal-open');
        }
    );

    (function () {
        var draggable = $('#editNoteModal')[0];
        var anchor = $('#EditNoteModalHeader')[0];

        var dragDrop = DragDrop.bind(draggable,
            {
                anchor: anchor
            }
        );
    }());
});

function AddDocumentResetForm() {
    $('#AddDocument').prop("disabled", true);

    $('input[type="file"]').val("");

    $('.AdditionalFileUpload').not(':first').remove();

    $('#AddDocumentForm').trigger('reset');
}

function UpdateAmountCollected()
{
    var amountCollected = 0;

    $('.checkAmount').each(function() {
        amountCollected += parseFloat($(this).text());
    });

    $('#AmountCollected').val(amountCollected.toFixed(2));
};