var addUpdateClaimCheck = function () {
    var file = document.getElementById('CheckUpload').files[0];
    if (file !== null) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            data.append("file", file);

            $.ajax({
                type: "POST",
                url: "/Claim/UpdateClaimCheck?checkId=" + $("#CheckId").val() + "&claimId=" + $("#ClaimId").val() + "&checkNumber=" + $("#CheckNumber").val() + "&checkAmount=" + $("#CheckAmount").val(),
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    alert('Check has been updated.');
                    //if it doesn't include doctype, it means it returned a partial view (_ViewDocument), otherwise, it's the entire claim view so reload.
                    if (!result.substr(0, 20).includes("DOCTYPE")) {
                        $('#modal-container').modal('toggle');
                        $('#dvCheckResults').html(result);
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

$('#UpdateCheck').on('click',
    function() {
        addUpdateClaimCheck();
    }
);