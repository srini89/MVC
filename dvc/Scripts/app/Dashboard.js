$(document).ready(function () {
    var weeklyChecks = [];
    var monthlyChecks = [];
    var dashboardData = {};
    var currentPendingClaims = {};
    var yesterdayClosedClaims = {};
    var moneyCollectedToday = {};
    var moneyCollectedYesterday = {};
    var totalFuturePendingClaims = [];
    var totalFuturePendingClaimsDataArray = []
    var moneyCollectedYTD;
    var mcDuck;

    //On load
    $.get('/Home/GetDashboardData', function (response) {
        mcDuck = response.mcDuck;
        dashboardData = response;
        openClaims = response.openClaims;
        weeklyChecks = response.weeklyChecks;
        monthlyChecks = response.monthlyChecks;
        currentPendingClaims = response.currentPendingClaims;
        totalFuturePendingClaims = response.totalFuturePendingClaims;
        yesterdayClosedClaims = response.yesterdayClosedClaims;
        moneyCollectedToday = response.moneyCollectedToday;
        moneyCollectedYesterday = response.moneyCollectedYesterday;
        moneyCollectedPastWeek = response.moneyCollectedPastWeek;
        moneyCollectedYTD = response.moneyCollectedYTD.toLocaleString('en-us', { style: 'currency', currency: 'USD' });
    }).done(function () {
        constructPage();
    });

    $('#Users').on('change', '#userDropdown', function () {
        var selected = $('#userDropdown').find(':selected').val();
        console.log('change', selected);
        var url = $('#Users').data('request-url');
        url += '?userId=' + selected;
        $('#Users').empty();
        $('#inventory').empty();
        $('#productivity').empty();
        $('.greeting').remove();
        $.get(url, function (response) {
            mcDuck = response.mcDuck;
            dashboardData = response;
            openClaims = response.openClaims;
            weeklyChecks = response.weeklyChecks;
            monthlyChecks = response.monthlyChecks;
            currentPendingClaims = response.currentPendingClaims;
            totalFuturePendingClaims = response.totalFuturePendingClaims;
            yesterdayClosedClaims = response.yesterdayClosedClaims;
            moneyCollectedToday = response.moneyCollectedToday;
            moneyCollectedYesterday = response.moneyCollectedYesterday;
            moneyCollectedPastWeek = response.moneyCollectedPastWeek;
            moneyCollectedYTD = response.moneyCollectedYTD.toLocaleString('en-us', { style: 'currency', currency: 'USD' });
            }).done(function () {
                constructPage();
            });
    });

    function enablePopOverAndAddData() {
        //Current pending claims
        google.charts.setOnLoadCallback(drawOpenClaimsPieChart);
        google.charts.setOnLoadCallback(drawCurrentPendingClaimsPieChart);
        google.charts.setOnLoadCallback(drawClaimsClosedYesterdayPieChart);
        google.charts.setOnLoadCallback(drawMoneyCollectedTodayPieChart);
        google.charts.setOnLoadCallback(drawMoneyCollectedYesterdayPieChart);
        google.charts.setOnLoadCallback(drawMoneyCollectedPastWeekPieChart);

        $('#openClaims').hover(function () {
            if (openClaims.totalOpenClaims === 0) {
                $('#openClaims').attr('data-content', "<h3>You don't have any open claims.</h3>");
            } else {
                $('#openClaims').attr('data-content', $('#openclaimspopcontainer').html());
            }
        });

        $('#pendingClaims').hover(function () {
            if (currentPendingClaims.totalNumberOfPendingClaims === 0) {
                $('#pendingClaims').attr('data-content', "<h3>No pending claims at this time.</h3>");
            } else {
                $('#pendingClaims').attr('data-content', $('#pendingclaimspopcontainer').html());
            }
        });

        $('#closedClaims').hover(function () {
            if (yesterdayClosedClaims.totalClaimsClosedYesterday === 0) {
                $('#closedClaims').attr('data-content', "<h3>You did not close any claims yesterday.</h3>");
            } else {
                $('#closedClaims').attr('data-content', $('#closedclaimspopcontainer').html());
            }
        });

        $('#collectedToday').hover(function () {
            if (moneyCollectedToday.total === 0 && mcDuck === true) {
                $('#collectedToday').attr('data-content', '<h3>You have not collected money today.</h3><br/><img style="height: 183px; width: 240px;" id="McDuck" class="img-responsive" src="/Images/McDuck3.jpg" />');
            } else {
                $('#collectedToday').attr('data-content', $('#collectedtodaypopcontainer').html());
            }
        });

        $('#collectedYesterday').hover(function () {
            if (moneyCollectedYesterday.total === 0 && mcDuck === true) {
                $('#collectedYesterday').attr('data-content', '<h3>You did not collect any money yesterday.</h3><br/><img style="height: 183px; width: 240px;" id="McDuck" class="img-responsive" src="/Images/McDuck.jpg" />');
            } else {
                $('#collectedYesterday').attr('data-content', $('#collectedyesterdaypopcontainer').html());
            }
        });

        $('#collectedPastWeek').hover(function () {
            if (moneyCollectedPastWeek === 0 && mcDuck === true) {
                $('#collectedPastWeek').attr('data-content', '<h3>You did not collect any money in the past week.</h3><br/><img style="height: 183px; width: 240px;" id="McDuck" class="img-responsive" src="/Images/McDuck2.png" />');
            } else {
                $('#collectedPastWeek').attr('data-content', $('#collectedpastweekpopcontainer').html());
            }
        });

        $('[data-toggle="popover"]').popover({ html: true, placement: 'top' });
    }

    //Inventory
    function addTotalOpenClaims(data) {
        $('#inventory').append('<a id="openClaims" class="pieChartPopOver" href="#" data-toggle="popover" title="Open Claims" data-trigger="hover">' +
                                '<div class="dvcStats">Open Claims <span class="dashboardInteger">' + data.openClaims.totalOpenClaims + '</span></div></a>');

        $('#inventory').append('<div id="openclaimspopcontainer" style="display:none; margin-left: 15px;"><div id="openClaimsPopOver"></div></div>');

    }
    function addTotaPendingClaims(data) {
        $('#inventory').append('<a id="pendingClaims" class="pieChartPopOver" href="#" data-toggle="popover" title="Pending Claims" data-trigger="hover">' +
                                '<div class="dvcStats">Pending Claims <span class="dashboardInteger">' + data.currentPendingClaims.totalNumberOfPendingClaims + '</span></div></a>');

        $('#inventory').append('<div id="pendingclaimspopcontainer" style="display:none; margin-left: 15px;"><div id="pendingClaimsPopOver"></div></div>');

    }
    function addTotalVinsWaitingForReview(data) {
        $('#inventory').append('<div class="dvcStats">Vins Waiting For Review <span class="dashboardInteger">' + data.totalVinsWaitingForReview + '</span></div>');
    }

    function addTotalClaimsCreatedYesterday(data) {
        $('#inventory').append('<div class="dvcStats">Claims Created Yesterday <span class="dashboardInteger">' + data.totalClaimsCreatedYesterday + '</span></div>');
    }
    //Productivity
    function addTotalClaimsClosedYesterday(data) {
        $('#productivity').append('<a id="closedClaims" class="pieChartPopOver" href="#" data-toggle="popover" title="Claims Closed Yesterday" data-trigger="hover">' +
                                '<div class="dvcStats">Closed Claims Yesterday <span class="dashboardInteger">' + data.yesterdayClosedClaims.totalClaimsClosedYesterday + '</span></div></a>');

        $('#productivity').append('<div id="closedclaimspopcontainer" style="display:none; margin-left: 15px;"><div id="closedClaimsPopOver"></div></div>');
    }
    function addTotalMoneyCollectedToday(data) {
        $('#productivity').append('<a id="collectedToday" class="pieChartPopOver" href="#" data-toggle="popover" title="Money Collected Today" data-trigger="hover">' +
                                '<div class="dvcStats">Money Collected Today <span class="dashboardMoney">' + data.moneyCollectedToday.total.toLocaleString('en-us', { style: 'currency', currency: 'USD' }) + '</span></div>');

        $('#productivity').append('<div id="collectedtodaypopcontainer" style="display:none; margin-left: 15px;"><div id="collectedTodayPopOver"></div></div>');
    }
    function addTotalMoneyCollectedYesterday(data) {
        $('#productivity').append('<a id="collectedYesterday" class="pieChartPopOver" href="#" data-toggle="popover" title="Money Collected Yesterday" data-trigger="hover">' +
                                '<div class="dvcStats">Money Collected Yesterday <span class="dashboardMoney">' + data.moneyCollectedYesterday.total.toLocaleString('en-us', { style: 'currency', currency: 'USD' }) + '</span></div>');

        $('#productivity').append('<div id="collectedyesterdaypopcontainer" style="display:none; margin-left: 15px;"><div id="collectedYesterdayPopOver"></div></div>');
    }
    function addTotalMoneyCollectedPastWeek(data) {
        $('#productivity').append('<a id="collectedPastWeek" class="pieChartPopOver" href="#" data-toggle="popover" title="Money Collected Last Five Days" data-trigger="hover">' +
                                '<div class="dvcStats">Money Collected Last Five Days <span class="dashboardMoney">' + data.moneyCollectedPastWeek.toLocaleString('en-us', { style: 'currency', currency: 'USD' }) + '</span></div>');

        $('#productivity').append('<div id="collectedpastweekpopcontainer" style="display:none; margin-left: 15px;"><div id="collectedPastWeekPopOver"></div></div>');
    }

    //#region Google Charts
    //#region totalFuturePendingClaimsChart 
    function drawTotalFuturePendingClaimsChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Pending')
        data.addColumn('number', 'Pending Payment')

        for (var item of totalFuturePendingClaims) {
            totalFuturePendingClaimsDataArray = [moment(item.dateClaimMovesToInvestigate).format('MM/DD'), item.numberOfPendingClaims, item.numberOfPendingPaymentClaims];
            data.addRow(totalFuturePendingClaimsDataArray);
        }

        var options = {
            title: 'Weekly Pending Claims by Status',
            focusTarget: 'category',
            hAxis: {
                title: 'Date',
                viewWindow: {
                    min: [7, 30, 0],
                    max: [17, 30, 0]
                },
                textStyle: {
                    fontSize: 14,
                    color: '#053061',
                    bold: true,
                    italic: false
                },
                titleTextStyle: {
                    fontSize: 18,
                    color: '#053061',
                    bold: true,
                    italic: false
                }
            },
            vAxis: {
                title: 'Number of Claims',
                textStyle: {
                    fontSize: 18,
                    color: '#67001f',
                    bold: false,
                    italic: false
                },
                titleTextStyle: {
                    fontSize: 18,
                    color: '#67001f',
                    bold: true,
                    italic: false
                },
                minValue: 0
            },
            tooltip: { trigger: 'focus' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            }
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
    //#endregion totalFuturePendingClaimsChart

    //#region monthlyClaimsChart 
    function drawMonthlyAmountChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Month');
        data.addColumn('number', 'Amount Collected')

        for (var item of monthlyChecks) {
            monthlyClaimsDataArray = [item.monthName, item.amountCollected];
            data.addRow(monthlyClaimsDataArray);
        }

        var options = {
            title: 'Amount Collected YTD: ' + moneyCollectedYTD,
            focusTarget: 'category',
            hAxis: {
                title: 'Month',
                viewWindow: {
                    min: [7, 30, 0],
                    max: [17, 30, 0]
                },
                textStyle: {
                    fontSize: 14,
                    color: '#053061',
                    bold: true,
                    italic: false
                },
                titleTextStyle: {
                    fontSize: 18,
                    color: '#053061',
                    bold: true,
                    italic: false
                }
            },
            vAxis: {
                title: 'Amount Collected',
                textStyle: {
                    fontSize: 18,
                    color: '#67001f',
                    bold: false,
                    italic: false
                },
                titleTextStyle: {
                    fontSize: 18,
                    color: '#67001f',
                    bold: true,
                    italic: false
                }
            },
            series: { 0: { color: 'green' } },
            tooltip: { trigger: 'focus' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            }
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
        chart.draw(data, options);
    }
    //#endregion monthlyClaimsChart

    //#region openClaimsPieChart 
    function drawOpenClaimsPieChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Work Queue');
        data.addColumn('number', 'Percentage');

        data.addRows([
            ['New', openClaims.newQueueCount],
            ['Investigation', openClaims.investigateQueueCount],
            ['Negotiate', openClaims.followUpNegotiateQueueCount],
            ['Checks Received', openClaims.checksInQueueCount]
        ]);

        var options = {
            tooltip: { trigger: 'none' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            }
        }

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('openClaimsPopOver'));
        chart.draw(data, options);
    }
    //#endregion openClaimsPieChart

    //#region currentPendingClaimsPieChart 
    function drawCurrentPendingClaimsPieChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Pending State');
        data.addColumn('number', 'Percentage');

        data.addRows([
            ["Pending Repair Estimate", currentPendingClaims.newPendingDocumentClaims],
            ["Pending Call or Document", currentPendingClaims.pendingClaims],
            ["Pending Payment", currentPendingClaims.pendingPaymentClaims]
        ]);

        var options = {
            tooltip: { trigger: 'none' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            }
        }

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('pendingClaimsPopOver'));
        chart.draw(data, options);
    }
    //#endregion currentPendingClaimsChart

    //#region claimsClosedYesterdayPieChart 
    function drawClaimsClosedYesterdayPieChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Closed Status');
        data.addColumn('number', 'Percentage');

        data.addRows([
            ["With Payment", yesterdayClosedClaims.claimsClosedWithPayment],
            ["Minimal Damage", yesterdayClosedClaims.claimsClosedMinimalDamage],
            ["No 3rd Party", yesterdayClosedClaims.claimsClosedNoThirdParty],
            ["Mileage Too High", yesterdayClosedClaims.claimsClosedMileageTooHigh],
            ["Outside of Statute", yesterdayClosedClaims.claimsClosedStatuteOfLimitations],
            ["Lack of Evidence", yesterdayClosedClaims.claimsClosedLackOfEvidence],
            ["Claim Denied", yesterdayClosedClaims.claimsClosedClaimDenied],
            ['DV Paid to Lessee', yesterdayClosedClaims.claimsClosedDvPaidToLessee],
            ['Liability Limits Reached', yesterdayClosedClaims.claimsClosedLiabilityLimitsReached],
            ['Insurance Unresponsive', yesterdayClosedClaims.claimsClosedInsuranceUnresponsive],
            ['No Coverage at Accident Date', yesterdayClosedClaims.claimsClosedNoCoverageAtAccidentDate],
            ['Still in Arbitration', yesterdayClosedClaims.claimsClosedStillInArbitration],
            ['Vehicle Redeemed', yesterdayClosedClaims.claimsClosedVehicleRedeemed]
        ]);

        var options = {
            tooltip: { trigger: 'none' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            }
        }

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('closedClaimsPopOver'));
        chart.draw(data, options);
    }
    //#endregion claimsClosedYesterdayPieChart


    //#region moneyCollectedTodayPieChart 
    function drawMoneyCollectedTodayPieChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Payment Type');
        data.addColumn('number', 'Count');

        data.addRows([
            ["Partial Payment", moneyCollectedToday.partial],
            ["Full Payment", moneyCollectedToday.full]
        ]);

        var options = {
            tooltip: { trigger: 'none' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            },
            colors: ['green', 'darkgreen']
        }

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('collectedTodayPopOver'));
        chart.draw(data, options);
    }
    //#endregion moneyCollectedTodayPieChart

    //#region moneyCollectedYesterdayPieChart 
    function drawMoneyCollectedYesterdayPieChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Payment Type');
        data.addColumn('number', 'Count');

        data.addRows([
            ["Partial Payment", moneyCollectedYesterday.partial],
            ["Full Payment", moneyCollectedYesterday.full]
        ]);

        var options = {
            tooltip: { trigger: 'none' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            },
            colors: ['green', 'darkgreen']
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('collectedYesterdayPopOver'));
        chart.draw(data, options);
    }
    //#endregion moneyCollectedYesterdayPieChart

    //#region moneyCollectedPastWeekPieChart 
    function drawMoneyCollectedPastWeekPieChart() {
        //// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Count');
        data.addColumn('number', 'Amount Collected')

        for (var item of weeklyChecks) {
            weeklyClaimsDataArray = [new Date(item.collectedDate).toDateString(), item.amountCollected];
            data.addRow(weeklyClaimsDataArray);
        }

        var options = {
            tooltip: { trigger: 'none' },
            pieSliceText: 'none',
            legend: {
                position: 'labeled',
                labeledValueText: 'value',
            },
            colors: ['#6bb300', '#008000', '#006600', '#004d00', '#4d8000']
        }

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('collectedPastWeekPopOver'));
        chart.draw(data, options);
    }
    //#endregion moneyCollectedPastWeekPieChart
    //#endregion Google Charts

    function constructPage() {
        addTotalClaimsClosedYesterday(dashboardData);
        addTotalOpenClaims(dashboardData);
        addTotaPendingClaims(dashboardData);
        addTotalVinsWaitingForReview(dashboardData);
        addTotalClaimsCreatedYesterday(dashboardData);
        addTotalMoneyCollectedToday(dashboardData);
        addTotalMoneyCollectedYesterday(dashboardData);
        addTotalMoneyCollectedPastWeek(dashboardData);

        $('.jumbotron').prepend('<h2 class="text-center greeting"><b>Hello, ' + dashboardData.assigneeName + '</b></h2>');

        if (dashboardData.isManager) {
            var s = $('<select />', { id: 'userDropdown' });
            $('<option />', { text: 'Select an operator...' }).appendTo(s);
            $('<option />', { value: 9999, text: 'Team' }).appendTo(s);
            for (var i = 0; i < dashboardData.assignees.length; i++) {
                $('<option />', { value: dashboardData.assignees[i].id, text: dashboardData.assignees[i].name }).appendTo(s);
            }

            s.appendTo('#Users');
        }
        // Load the Visualization API and the corechart package.
        google.charts.load('current', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawTotalFuturePendingClaimsChart);
        google.charts.setOnLoadCallback(drawMonthlyAmountChart);

        enablePopOverAndAddData();
    }
});