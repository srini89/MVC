$(document).ready(function() {
    $('#CancelReopenClaim').on('click',
        function() {
            ResetReopenClaimForm();
        });
});

function ResetReopenClaimForm() {
    console.log('Reseting form...');
    $('#ClaimsToReopenTextArea').empty();
    $('#ReopenClaimForm')[0].reset();
};

