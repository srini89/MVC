$(document).ready(function () {
    showOrHideClosedReason();
    highlightFinishedClientFiles();
    hideDuplicateClaimAudits();
    if ($(".clientFilterDropDown").val() !== "0" && $('.brandDropDown option').length >= 2) {
        if ($('.brandDropDown option').length == 2 && $('.brandDropDown').find("option:first-child").val() == 0) {
            $('.brandDropDownContainer').hide();
        } else {
            $('.brandDropDownContainer').show();
        }
    }
    $('#ExportToExcel').on('click', function () {
        $('#ReportTable').tableExport({ type: 'excel', escape: 'false', ignoreColumn: [0] });
    });

    $('#ClosedTypeDropdown').on('change', function () {
        showOrHideClosedReason();
    });

    $('.claimsPerUser').on('click',
        function() {
            var perUserAssignee = $(this).find('.perUserAssignee').text().trim();

            $('#ReportTable tbody tr').each(function() {
                var rowAssignee = $(this).find('.assigneeName').text().trim();
                if (rowAssignee == perUserAssignee || perUserAssignee == 'Total') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            var auditsLastUpdatedByThisAssignee = [];

            $('#ProductivityReportTable tbody tr').each(function () {
                //filter out duplicate claimIds
                var thisRowLastUpdatedBy = $(this).find('.assigneeName').text().trim();
                var thisRowClaimId = $(this).find('.claimId').text().trim();

                if (thisRowLastUpdatedBy === perUserAssignee &
                    !auditsLastUpdatedByThisAssignee.includes(thisRowClaimId)) {
                    $(this).show();
                    auditsLastUpdatedByThisAssignee.push(thisRowClaimId);
                } else {
                    $(this).hide();
                };

            });
    });

    $('.billingPeriod').datepicker({
        autoclose: true,
        startView: 1,
        minViewMode: 1,
        format: 'mm/yyyy'
    });

    $('#ShowAll').on('click',
        function() {
            $('#ProductivityReportTable tbody tr').show();
            hideDuplicateClaimAudits();
        });

    $(".clientFilterDropDown").on("change", function () {
        toggleBrandDropDown();
    });
});

function toggleBrandDropDown() {
    $('.brandDropDown').empty();
    var clientId = $('.clientFilterDropDown').find(':selected').val();
    if (clientId == "0") {
        $('.brandDropDownContainer').hide();
    } else {
        //get the brands for this client
        $.ajax({
            url: '/ManagerReports/GetBrands',
            type: 'Get',
            data: {
                clientId: clientId
            },
            success: function (data) {

                if (data.length > 1) {
                    $('.brandDropDown').append(new Option("All Brands", "0"));
                    for (var i = 0; i < data.length; i++) {
                        var opt = new Option(data[i].legalName, data[i].id);
                        $('.brandDropDown').append(opt);
                    }
                    $('.brandDropDownContainer').show();
                } else {
                    $('.brandDropDownContainer').hide();
                }
            }
        });
    }
}

function showOrHideClosedReason() {
    if ($('#ClosedTypeDropdown').find(':selected').val() == 'ClosedWithRecovery') {
        $('#ClosedReasonDropdown').find('select').val('');
        $('#ClosedReasonDropdown').hide();
    } else {
        $('#ClosedReasonDropdown').show();
    }
};

function highlightFinishedClientFiles() {
    $('.InternalVinTrackingReportTable > tbody  > tr').each(function () {

        var thisOpenClaimsValue = $(this).find('.OpenClaims').html().trim();
        var thisPreprocessingValue = $(this).find('.PreprocessingQueue').html().trim();

        if (thisOpenClaimsValue === "0" && thisPreprocessingValue === "0") {
            $(this).closest('tr').addClass('text-gray');
        }
    });
};

function hideDuplicateClaimAudits() {
    $('#ProductivityReportTable tbody  tr').each(function () {
        var thisClaimId = $(this).find('.claimId').text().trim();
        var previousRow = $(this).prev();
        var previousClaimId;

        if (previousRow != null) {
            previousClaimId = previousRow.find('.claimId').text().trim();
        };

        if (thisClaimId === previousClaimId) {
            $(this).hide();
        }
    });
};


