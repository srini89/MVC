$('document').ready(function() {
    $('#Id_DiminishedValueReport\\&Letter').change(function() {
        if (this.checked) {
            $('#Id_17cDVCLetterReport').prop('checked', false);
        }
    });

    $('#Id_17cDVCLetterReport').change(function () {
        if (this.checked) {
            $('#Id_DiminishedValueReport\\&Letter').prop('checked', false);
        };
    });

    $('#Id_GeneratedRepairEstimate').change(function () {
        if (this.checked) {
            $("#GenerateLetter :checkbox").not($('#Id_GeneratedRepairEstimate')).prop("checked", false);
        };
    });

    $('#GenerateLetter :checkbox').not($('#Id_GeneratedRepairEstimate')).change(function () {
        if ($('#Id_GeneratedRepairEstimate').is(":checked")) {
            $('#Id_GeneratedRepairEstimate').prop('checked', false);
        };
    }).change();
});

function showSpinner() {
    $('#generate-letter-button').toggleClass("fa fa-spinner spin");
    $('#generate-letter-button').attr("disabled", "disabled");

}

function generateLetterError() {
    $('#generate-letter-button').toggleClass("fa fa-spinner spin");
    $('#generate-letter-button').removeAttr('disabled');
}

function generateClaimSubmitError (exception) {
    generateLetterError();
    alert("Error generating document: Response from server: '" + exception + "'");
}

function validateLetter(model) {
    showSpinner();
    var errorMessage = [];
    //var selectedLetter = $('#SelectedDocumentType option:selected').text();
    var defaultErrorMessage = 'Unable to generate letter.' + '\n'
    //#region Diminished Value Report & Letter
    if ($('#Id_DiminishedValueReport\\&Letter').prop('checked')) {

        if (model.RequiredFields.DiminishedValueAmount === 0 || model.RequiredFields.DiminishedValueAmount === null) {
            errorMessage.push('No Diminished Value Amount.');
        };
        if (model.RequiredFields.FairMarketValue === 0 || model.RequiredFields.FairMarketValue === null) {
            errorMessage.push('No Fair Market Value.');
        };
        if (model.RequiredFields.PostRepairValue === 0 || model.RequiredFields.PostRepairValue === null) {
            errorMessage.push('No Post Repair Value.');
        };
        if (model.RequiredFields.RepairEstimate === 0 || model.RequiredFields.RepairEstimate === null) {
            errorMessage.push('No Repair Estimate.');
        };
        if (model.RequiredFields.ActualDiminishedValue < 0) {
            errorMessage.push('Actual Diminished Value is negative.');
        }
        //Actual Diminished Value radio button
        if ($('input[name="Claim.DiminishedValue.CalculationType"]:checked').val() !== '2') {
            errorMessage.push('Actual Diminished Value calculation type not selected.');
        };
    };
    //#endregion Diminished Value Report & Letter

    //#region Repair Estimate
    if ($('#Id_GeneratedRepairEstimate').prop('checked')) {

        if (!model.RequiredFields.InsuredFirstName) {
            errorMessage.push('No Insured First Name.');
        };
        if (!model.RequiredFields.InsuredLastName) {
            errorMessage.push('No Insured Last Name.');
        };
    };
    //#endregion Repair Estimate

    //#region 17c DVC Letter and Report
    if ($('#Id_17cDVCLetterReport').prop('checked')) {

        if (!model.RequiredFields.InsuredFirstName) {
            errorMessage.push('No Insured First Name.');
        };
        if (!model.RequiredFields.InsuredLastName) {
            errorMessage.push('No Insured Last Name.');
        };
        if (model.RequiredFields.DiminishedValueAmount === 0 || model.RequiredFields.DiminishedValueAmount === null) {
            errorMessage.push('No Diminished Value Amount.');
        };
        if (model.RequiredFields.RepairEstimate === 0 || model.RequiredFields.RepairEstimate === null) {
            errorMessage.push('No Repair Estimate.')
        };
        if (model.RequiredFields.FairMarketValue === 0 || model.RequiredFields.FairMarketValue === null) {
            errorMessage.push('No Fair Market Value.');
        };
        if (model.RequiredFields.ArbitraryCap === 0 || model.RequiredFields.ArbitraryCap === null) {
            errorMessage.push('Invalid Arbitrary Cap.');
        };
        if (model.RequiredFields.DamageMultiplier === 0 || model.RequiredFields.DamageMultiplier === null) {
            errorMessage.push('Invalid Damage Multiplier');
        };
        if (model.RequiredFields.Mileage === 0 || model.RequiredFields.Mileage === null) {
            errorMessage.push('Invalid Mileage.');
        };
        //Check if all damage locations are false.
        var allDamageLocationFalse = true;
        for (var location in model.RequiredFields.LocationOfDamage) {
            if (model.RequiredFields.LocationOfDamage[location] === true) {
                allDamageLocationFalse = false;
                break;
            };
        };
        if (allDamageLocationFalse) {
            errorMessage.push('No damage location selected.');
        };
        //17c radio button
        if ($('input[name="Claim.DiminishedValue.CalculationType"]:checked').val() !== '1') {
            errorMessage.push('17c calculation type not selected.');
        };
    };
    //#endregion 17c DVC Letter and Report

    //#region NoticetoInspectLetter
    if ($('#Id_NoticetoInspectLetter').prop('checked')) {

        if (!model.RequiredFields.AuctionName) {
            errorMessage.push('Auction Name Required.');
        };
        if (!model.RequiredFields.AuctionAddress) {
            errorMessage.push('AuctionAddress Required');
        };
        if (!model.RequiredFields.AuctionCity) {
            errorMessage.push('AuctionCity Required.');
        };
        if (!model.RequiredFields.AuctionState) {
            errorMessage.push('Auction State Required.');
        };
        if (!model.RequiredFields.AuctionZip) {
            errorMessage.push('Auction Zip Code Required.');
        };
        if (!model.RequiredFields.StockNumber) {
            errorMessage.push('Stock Number Required.');
        };
    };
    //#endregion NoticetoInspectLetter


    //#region Motor Vehicle Sale
    if ($('#Id_MotorVehicleSale').prop('checked')) {

        if (!model.RequiredFields.LeaseStartDate) {
            errorMessage.push('No Lease Start Date.');
        };
        if (!model.RequiredFields.LeaseEndDate && !model.RequiredFields.RepoDate) {
            errorMessage.push('No Lease End or Repo Date. One of these must be filled in.');
        };
        if (!model.RequiredFields.SaleDate) {
            errorMessage.push('No Sale Date.');
        };
        if (!model.RequiredFields.AuctionName) {
            errorMessage.push('No Auction Name.');
        };
        if (model.RequiredFields.SalePrice === 0 || model.RequiredFields.SalePrice === null) {
            errorMessage.push('No Sale Price.');
        };
        if (!model.RequiredFields.InsuranceCarrier) {
            errorMessage.push('No Insurance Carrier.');
        };
        if (model.RequiredFields.Mileage === 0 || model.RequiredFields.Mileage === null) {
            errorMessage.push('Invalid Mileage.');
        };
    };
    //#endregion Motor Vehicle Sale

    if (errorMessage.length !== 0) {
        alert(defaultErrorMessage + errorMessage.join('\n'));
        generateLetterError();
        return false;
    };
    
    return true;
};