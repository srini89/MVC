$(document).ready(function () {

    $(".acc-trade-in-value").hide();
    $(".acc-loan-value").hide();
    $(".acc-retail-value").show();

    $("#accValueType").change(function () {

        if ($(".accessoryValueType option:selected").text() === "Retail") {
            $(".acc-trade-in-value").hide();
            $(".acc-loan-value").hide();
            $(".acc-retail-value").show();
            $("#submitAccessories").attr("disabled", false);
        } else if ($(".accessoryValueType option:selected").text() === "Trade-In") {
            $(".acc-trade-in-value").show();
            $(".acc-loan-value").hide();
            $(".acc-retail-value").hide();
            $("#submitAccessories").attr("disabled", false);
        } else if ($(".accessoryValueType option:selected").text() === "Loan") {
            $(".acc-trade-in-value").hide();
            $(".acc-loan-value").show();
            $(".acc-retail-value").hide();
            $("#submitAccessories").attr("disabled", false);
        } else {
            $(".acc-trade-in-value").hide();
            $(".acc-loan-value").hide();
            $(".acc-retail-value").hide();
            $("#submitAccessories").attr("disabled", true);
        };

    });
});