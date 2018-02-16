$(document).ready(function () {

    var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
    }

    // Change hash for page-reload
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
    })

    $(".add-client-error").html('');

    $("#client-dropdown").on('change',
        function () {
            $('#Client-Search-Form').submit();
        });

    $("#ClientLogoUpload").on('change', function () {
        $('#client-logo-file-path').html('<img class="client-logo" src="' + window.URL.createObjectURL(this.files[0]) + '" alt="Client Logo"/>');
    });

    $('#Add-Client-Brand').on('click', function () {
        $.ajax({
            async: false,
            url: '/Admin/AddClientBrand',
            success: function (partialView) {
                //Assign guid value given to these elements by BeginCollectionItems 
                //to the BrandLogoHiddenName in order to match the entry with a logo image
                var $el = $(partialView);
                var guidValue = $el.find('.Brand-Code').prevObject[0].value;

                $el.find('.BrandLogoHiddenName').val(guidValue);
                $('#Client-Brands').append($el);
            }
        });
    });

    $('.phoneNumberMask').mask('000-000-0000');

    //Assign updated guid value on reload.
    var updateBrandLogoGuids = function() {
        $(".BrandListItem").each(function() {
            var guidIdFromBrandListItem = $(this).find('.Brand-Code')[0].id;
            var guidValue = guidIdFromBrandListItem.substring(guidIdFromBrandListItem.indexOf("_") + 1, guidIdFromBrandListItem.lastIndexOf("_") - 1);
            $(this).find('.BrandLogoHiddenName').val(guidValue);
        });
    }();

    $('#Client-Brands').on('change',
        'input[type=file]',
        function () {
            var $el = $(this).closest('div').next().find('.brand-logo-file-path');

            $el.html('<img class="brand-logo" src="' +
                window.URL.createObjectURL(this.files[0]) +
                '" alt="Brand Logo"/>');
        });

    //Client Letters
    $("#letter-upload").on('change', function () {
        if ($('#letter-upload').val() !== '') {
            $('#new-letter-name').val(this.files[0].name);
        }
    });

    $('#AddLetter').on('click', function (e) {
        if ($("#letter-upload").val() === "") {
            $("#upload-letter-error").html('Please select a letter to upload.');
            return false;
        };

        //$("#fmv-addon").toggleClass("fa-question fa-spinner fa-spin");

        var file = document.getElementById('letter-upload').files[0];
        if (window.FormData !== undefined) {
            var data = new FormData();
            var newLetterDescription = $("#new-letter-description").val();
            var newLetterName = $('#new-letter-name').val();
            var clientId = $('.client-id').val();
            data.append("file", file);
            $.ajax({
                type: "POST",
                url: "/Admin/NewClientLetter?clientId="+clientId+"&letterDescription="+newLetterDescription+"&fileName="+newLetterName,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.toString().indexOf("Error") === -1) {
                        $("#new-letter-description").val('');
                        $("letter-upload").val('');
                        $("#new-letter-name").val('');
                        $('.client-letter-container').append(result);
                        $('#addLetterModal').modal('toggle');
                        $('#no-client-letters').hide();
                    } else {
                        $("#upload-letter-error").html(result);
                    }
                },
                error: function (xhr, status, p3, p4) {
                    $("#upload-letter-error").html(xhr.responseText);
                }
            });
        } else {
            $("#upload-letter-error").html('Your browser does not support HTML 5 document uploads.');
            return false;
        }
    });

    $('.CancelNewLetter').on('click', function (e) {
        $("#new-letter-description").val('');
        $("#letter-upload").val('');
        $("#new-letter-name").val('');
        $("#upload-letter-error").html('');
    });

    $('.client-letter-container').on('click', '.edit-letter', function (e) {
        var letterId = $(this).data('id');
        var letterEditRow = "#edit-letter-" + letterId;
        var letterViewRow = "#view-letter-" + letterId;

        $(letterViewRow).hide();
        $(letterEditRow).fadeIn('fast');
    });

    $('.client-letter-container').on('click', '.delete-letter', function () {
        var letterId = $(this).data('id');
        if (confirm('Are you sure you want to delete this letter?')) {
            $.ajax({
                type: "POST",
                url: "/Admin/DeleteClientLetter",
                dataType: "json",
                data: {
                    letterId: letterId,
                },
                success: function (result) {
                    $("#letters-message").html(result);
                    $("#letters-message").removeClass("error");
                    $("#letter-row-"+letterId).remove();
                },
                error: function (xhr, status, p3, p4) {
                    $("#letters-message").html(xhr.responseText);
                    $("#letters-message").addClass("error");
                }
            });
        }
    });

    $('.client-letter-container').on('click', '.save-letter-changes', function (e) {
        var letterId = $(this).data('id');
        var letterDescription = $('#edit-letter-description-' + letterId).val();
        var letterEnabled = $('#edit-letter-enabled-' + letterId).is(':checked');
        var letterEditRow = "#edit-letter-" + letterId;
        var letterViewRow = "#view-letter-" + letterId;
        $('.save-icon').toggleClass("fa-check fa-spinner fa-spin")

        $.ajax({
            type: "POST",
            url: "/Admin/UpdateClientLetter",
            dataType: "json",
            data: {
                letterId: letterId,
                letterDescription: letterDescription,
                letterEnabled: letterEnabled
            },
            success: function (result) {
                $("#letters-message").html(result);
                $("#letters-message").removeClass("error");
                var letterDescriptionClass = ".letter-description-" + letterId;
                $(letterDescriptionClass).html(letterDescription);
                var letterEnabledClass = ".letter-enabled-" + letterId;
                if (letterEnabled) {
                    $(letterEnabledClass).html("<span class='fa fa-check-square-o '"+letterEnabledClass+"'></span>")
                } else {
                    $(letterEnabledClass).html("<span class='fa fa-square-o '" + letterEnabledClass + "'></span>")
                }
                $('.save-icon').toggleClass("fa-check fa-spinner fa-spin");
                $(letterEditRow).hide();
                $(letterViewRow).fadeIn('fast');
            },
            error: function (xhr, status, p3, p4) {
                $("#letters-message").html(xhr.responseText);
                $("#letters-message").addClass("error");
                $('.save-icon').toggleClass("fa-check fa-spinner fa-spin")
                $(letterEditRow).hide();
                $(letterViewRow).fadeIn('fast');
            }
        });
    });

    $('.client-letter-container').on('click', '.cancel-letter-changes', function (e) {
        var letterId = $(this).data('id');
        var letterEditRow = "#edit-letter-" + letterId;
        var letterViewRow = "#view-letter-" + letterId;
        $(letterEditRow).hide();
        $(letterViewRow).fadeIn('fast');
        $("#letters-message").html("");

    });

    $('#addLetterModal').on('shown.bs.modal',
        function () {
            $('body').removeClass('modal-open');
        }
    );

    $('#AddClientCancel').on('click', function (e) {
        $("#add-client-error").html('');
        $(".new-client-code").val('');
        $(".new-client-number").val('');
        $(".new-client-name").val('');
    });

    $('#AddClient').on('click', function (e) {
        $("#add-client-error").html('');
        if ($(".new-client-name").val() === "") {
            $("#add-client-error").html("Client Name is required.");
            return false;
        };
        if ($(".new-client-code").val() === "") {
            $("#add-client-error").html("Client Code is required.");
            return false;
        };
        if ($(".new-client-code").val().length > 3) {
            $("#add-client-error").html("Client Code must be 3 characters or less");
            return false;
        };
        if ($(".new-client-number").val() === "") {
            $("#add-client-error").html("Client Number is required.");
            return false;
        };
        $.ajax({
            type: "POST",
            url: "/Admin/NewClient",
            dataType: "json",
            data: {
                clientCode: $(".new-client-code").val(),
                clientNumber: $(".new-client-number").val(),
                clientName: $(".new-client-name").val()
            },
            success: function (result) {
                if (result.toString().indexOf("Error") === -1) {
                    $(".new-client-code").val('');
                    $(".new-client-number").val('');
                    $(".new-client-name").val('');
                    $('#addClientModal').modal('toggle');
                    var redirectUrl = "/Admin/ClientConfiguration?clientId=" + result
                    window.location.href = redirectUrl;
                } else {
                    $("#add-client-error").html(result);
                }
            },
            error: function (xhr, status, p3, p4) {
                $("#add-client-error").html(xhr.responseText);
            }
        });
    });

    $('#UpdateClient').on('click',
        function (e) {
            var errorExists = false;
            $('.validationError').attr('hidden', true);

            if ($('#BillingValue').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#invoicing-tab"]').tab('show');
                $('#ValidationBillingValue').attr('hidden', false);
                errorExists = true;
            }

            if ($('#SetupFee').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#invoicing-tab"]').tab('show');
                $('#ValidationSetupFee').attr('hidden', false);
                errorExists = true;
            }

            if ($('#BillingEmailAddresses').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#invoicing-tab"]').tab('show');
                $('#ValidationBillingEmailAddresses').attr('hidden', false);
                errorExists = true;
            }

            if ($('#OldestCarYear').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#preprocessing-tab"]').tab('show');
                $('#ValidationOldestCarYear').attr('hidden', false);
                errorExists = true;
            }

            if ($('#MinimumFMV').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#preprocessing-tab"]').tab('show');
                $('#ValidationMinimumFMV').attr('hidden', false);
                errorExists = true;
            }

            if ($('#FileDelimiter').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#preprocessing-tab"]').tab('show');
                $('#ValidationFileDelimiter').attr('hidden', false);
                errorExists = true;
            }
            if ($('#ClientDocumentFilePath').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#misc-tab"]').tab('show');
                $('#ValidationClientDocumentFilePath').attr('hidden', false);
                errorExists = true;
            }

            if ($('#ClaimFollowUpWaitingForCall').val() === '' || $('#ClaimFollowUpWaitingForCall').val() <= 0) {
                deactivateTabs();
                $('.nav-tabs a[href="#turnAroundTime-tab"]').tab('show');
                $('#ValidationClaimFollowUpWaitingForCall').attr('hidden', false);
                errorExists = true;
            }

            if ($('#ClaimFollowUpWaitingForDocument').val() === '' || $('#ClaimFollowUpWaitingForDocument').val() <= 0) {
                deactivateTabs();
                $('.nav-tabs a[href="#turnAroundTime-tab"]').tab('show');
                $('#ValidationClaimFollowUpWaitingForDocument').attr('hidden', false);
                errorExists = true;
            }

            if ($('#ClaimFollowUpSentLetter').val() === '' || $('#ClaimFollowUpSentLetter').val() <= 0) {
                deactivateTabs();
                $('.nav-tabs a[href="#turnAroundTime-tab"]').tab('show');
                $('#ValidationClaimFollowUpSentLetter').attr('hidden', false);
                errorExists = true;
            }

            if ($('#EscalationThresholds').val() === '') {
                deactivateTabs();
                $('.nav-tabs a[href="#misc-tab"]').tab('show');
                $('#ValidationEscalationThresholds').attr('hidden', false);
                errorExists = true;
            }

            if (errorExists) {
                return false;
            }

            return true;
        });
});;

function deactivateTabs() {
    $('.nav-tabs li.active').removeClass('active');
    $('.tab-content div.active').removeClass('active');
};