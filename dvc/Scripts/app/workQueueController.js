(function () {

    "use strict";

    angular.module("app")
        .controller("workQueueController", workQueueController);

    function workQueueController($scope, $window, $http) {

        var vm = this;

        $scope.viewClaimDetail = function (url, claimId) {
            $window.location.href = ".." + url + "/" + claimId;
        };
        vm.workQueueErrorMessage = "";
        vm.newClaimsErrorMessage = "";
        vm.investigationErrorMessage = "";
        vm.negotiateErrorMessage = "";
        vm.checksReceivedErrorMessage = "";
        vm.enabledAssigneesErrorMessage = "";
        vm.filterClientsErrorMessage = "";
        vm.loggedOnAssigneeId = "";
        vm.isNewClaimsBusy = true;
        vm.isInvestigationClaimsBusy = true;
        vm.isNegotiateClaimsBusy = true;
        vm.isChecksReceivedClaimsBusy = true;
        vm.queueFilter = "MyCurrent";
        vm.queueFilterLabel = "My Current";
        vm.newClaims = [];
        vm.investigationClaims = [];
        vm.negotiateClaims = [];
        vm.checksReceivedClaims = [];

        var enabledAssignees = [];
        var filterClients = [];

        var compareTriggerDates = function(response) {
            for (var claim of response.data) {
                var latestTrigger = {};
                latestTrigger.triggerDate = new Date("1900-01-01").toISOString().slice(0, 19).replace('T', ' ');

                for (var state of claim.claimWorkflowStates) {
                    var triggerDate = new Date(state.triggerDate).toISOString().slice(0, 19).replace('T', ' ')
                    if (triggerDate > latestTrigger.triggerDate) {
                        latestTrigger = state;
                    }
                }
                claim.claimWorkflowStates = [];
                claim.claimWorkflowStates[0] = latestTrigger;
            }
        }

        function setFilterDefaults() {
            $scope.filterCriteriaNew.selectedValue.name = vm.queueFilter;
            $scope.filterCriteriaNew.selectedValue.label = vm.queueFilterLabel;

            $scope.filterCriteriaInvestigation.selectedValue.name = vm.queueFilter;
            $scope.filterCriteriaInvestigation.selectedValue.label = vm.queueFilterLabel;

            $scope.filterCriteriaNegotiate.selectedValue.name = vm.queueFilter;
            $scope.filterCriteriaNegotiate.selectedValue.label = vm.queueFilterLabel;

            $scope.filterCriteriaChecksReceived.selectedValue.name = vm.queueFilter;
            $scope.filterCriteriaChecksReceived.selectedValue.label = vm.queueFilterLabel;
            //
            $scope.filterClientsNew.selectedValue.name = "All Clients";
            $scope.filterClientsNew.selectedValue.value = "0";

            $scope.filterClientsInvestigation.selectedValue.name = "All Clients";
            $scope.filterClientsInvestigation.selectedValue.value = "0";

            $scope.filterClientsNegotiate.selectedValue.name = "All Clients";
            $scope.filterClientsNegotiate.selectedValue.value = "0";

            $scope.filterClientsChecksReceived.selectedValue.name = "All Clients";
            $scope.filterClientsChecksReceived.selectedValue.value = "0";

        }

        //#region NewClaim
        $scope.filterCriteriaNew = {
            availableOptions: [
            {
                name: "MyCurrent",
                label: "My Current"
            }, {
                name: "MyCurrentFuture",
                label: "My Current + Future"
            }, {
                name: "TeamCurrent",
                label: "Team Current"
            }, {
                name: "TeamCurrentFuture",
                label: "Team Current + Future"
            }],
            selectedValue: {
                name: vm.queueFilter,
                label: vm.queueFilter
            }
        };
        $scope.filterClientsNew = {
            availableOptions: [
            {
                name: "All Clients",
                value: "0"
            }],
            selectedValue: {
                name: "All Clients",
                value: "0"
            }
        };
        $scope.newClaimFilterChanged = function (filterValue, clientFilter) {
            vm.isNewClaimsBusy = true
            $http({
                method: "POST",
                url: "/Claim/ViewNewClaimsFiltered",
                data: {
                    filterValue: filterValue,
                    clientIdFilter: clientFilter
                }
            })
                .then(function (response) {
                    //success
                    angular.copy(response.data, vm.newClaims);
                    //failure
                }, function (error) {
                    console.log("Error: ", error);
                    vm.newClaimsErrorMessage = "failed to load data: " + error;
                }).finally(function () {
                    vm.isNewClaimsBusy = false;
                });
        };       
        //#endregion NewClaim

        //#region Investigation Claim
        $scope.filterCriteriaInvestigation = {
            availableOptions: [
            {
                name: "MyPhoneCalls",
                label: "My Phone Calls"
            }, {
                name: "MyIncomingDocuments",
                label: "My Incoming Documents"
            }, {
                name: "MyCurrent",
                label: "My Current"
            }, {
                name: "MyCurrentFuture",
                label: "My Current + Future"
            }, {
                name: "TeamCurrent",
                label: "Team Current"
            }, {
                name: "TeamCurrentFuture",
                label: "Team Current + Future"
            }],
            selectedValue: {
                name: vm.queueFilter,
                label: vm.queueFilter
            }
        };
        $scope.filterClientsInvestigation = {
            availableOptions: [
            {
                name: "All Clients",
                value: "0"
            }],
            selectedValue: {
                name: "All Clients",
                value: "0"
            }
        };
        $scope.investigationClaimFilterChanged = function (filterValue, clientFilter) {
            vm.isInvestigationClaimsBusy = true;
            $http({
                method: "POST",
                url: "/Claim/ViewInvestigationClaimsFiltered",
                data: { filterValue: filterValue, clientIdFilter: clientFilter }
            })
                .then(function (response) {
                    //success
                    angular.copy(response.data, vm.investigationClaims);
                    //failure
                }, function (error) {
                    console.log("Error: ", error);
                    vm.investigationErrorMessage = "failed to load data: " + error;
                }).finally(function () {
                    vm.isInvestigationClaimsBusy = false;
                });
        };

        //#endregion InvestigationClaim

        //#region Negotiation Claim
        $scope.filterCriteriaNegotiate = {
            availableOptions: [
            {
                name: "MyPhoneCalls",
                label: "My Phone Calls"
            }, {
                name: "MyIncomingDocuments",
                label: "My Incoming Documents"
            }, {
                name: "MyCurrent",
                label: "My Current"
            }, {
                name: "MyCurrentFuture",
                label: "My Current + Future"
            }, {
                name: "TeamCurrent",
                label: "Team Current"
            }, {
                name: "TeamCurrentFuture",
                label: "Team Current + Future"

            }],
            selectedValue: {
                name: vm.queueFilter,
                label: vm.queueFilter
            }
        };
        $scope.filterClientsNegotiate = {
            availableOptions: [
            {
                name: "All Clients",
                value: "0"
            }
            ],
            selectedValue: {
                name: "All Clients",
                value: "0"
            }
        };
        $scope.negotiateClaimFilterChanged = function (filterValue, clientFilter) {
            vm.isNegotiateClaimsBusy = true;
            $http({
                method: "POST",
                url: "/Claim/ViewNegotiateClaimsFiltered",
                data: { filterValue: filterValue, clientIdFilter: clientFilter }
            })
                .then(function (response) {
                    //success
                    angular.copy(response.data, vm.negotiateClaims);
                    //failure
                }, function (error) {
                    console.log("Error: ", error);
                    vm.negotiateErrorMessage = "failed to load data: " + error;
                }).finally(function () {
                    vm.isNegotiateClaimsBusy = false;
                });
        };
        //#endregion Negotiation Claim

        //#region Checks Received Claim
        $scope.filterCriteriaChecksReceived = {
            availableOptions: [
            {
                name: "MyCurrent",
                label: "My Current"
            }, {
                name: "MyCurrentFuture",
                label: "My Current + Future"
            }, {
                name: "TeamCurrent",
                label: "Team Current"
            }, {
                name: "TeamCurrentFuture",
                label: "Team Current + Future"

            }],
            selectedValue: {
                name: vm.queueFilter,
                label: vm.queueFilter
            }
        };
        $scope.filterClientsChecksReceived = {
            availableOptions: [
            {
                name: "All Clients",
                value: "0"
            }
            ],
            selectedValue: {
                name: "All Clients",
                value: "0"
            }
        };
        $scope.checksReceivedClaimFilterChanged = function (filterValue, clientFilter) {
            vm.isChecksReceivedClaimsBusy = true;
            $http({
                method: "POST",
                url: "/Claim/ViewChecksReceivedClaimsFiltered",
                data: { filterValue: filterValue, clientIdFilter: clientFilter }
            })
                .then(function (response) {
                    //success
                    angular.copy(response.data, vm.checksReceivedClaims);
                    //failure
                }, function (error) {
                    console.log("Error: ", error);
                    vm.checksReceivedErrorMessage = "failed to load data: " + error;
                }).finally(function () {
                    vm.isChecksReceivedClaimsBusy = false;
                });
        };
        //#endregion NegotiationChecks Received Claim

        //#region Initial Load

        $http.get("/Claim/IsManager")
			.then(function (response) {
			    //success
			    if (response.data.toLowerCase() === "true") {
			        vm.queueFilter = "TeamCurrent";
			        vm.queueFilterLabel = "Team Current";
			        setFilterDefaults();
			    }
			}, function (error) {
			    //failure
			    vm.newClaimsErrorMessage = "failed to determine Security Role: " + error;
			});

        $http.get("/Claim/ViewNewClaims")
			.then(function (response) {
			    //success
			    compareTriggerDates(response);
			    angular.copy(response.data, vm.newClaims);
			}, function (error) {
			    //failure
			    vm.newClaimsErrorMessage = "failed to load data: " + error;
			}).finally(function () {
			    vm.isNewClaimsBusy = false;
			});

        $http.get("/Claim/ViewInvestigationClaims")
			.then(function (response) {
                //success
                compareTriggerDates(response);
                angular.copy(response.data, vm.investigationClaims);
			}, function (error) {
                //failure
                vm.investigationErrorMessage = "failed to load data: " + error;
			}).finally(function () {
                vm.isInvestigationClaimsBusy = false;
			});

        $http.get("/Claim/ViewNegotiateClaims")
			.then(function (response) {
                //success
			    compareTriggerDates(response);
                angular.copy(response.data, vm.negotiateClaims);
			}, function (error) {
                //failure
                vm.negotiateErrorMessage = "failed to load data: " + error;
			}).finally(function () {
                vm.isNegotiateClaimsBusy = false;
			});

        $http.get("/Claim/ViewChecksReceivedClaims")
			.then(function (response) {
                //success
			    compareTriggerDates(response);
                angular.copy(response.data, vm.checksReceivedClaims);
			}, function (error) {
                //failure
                vm.checksReceivedErrorMessage = "failed to load data: " + error;
			}).finally(function () {
                vm.isChecksReceivedClaimsBusy = false;
			});

        $http.get("/Claim/GetEnabledAssignees")
            .then(function (response) {
                //success
                angular.copy(response.data, enabledAssignees);
                for (var i = 0; i < enabledAssignees.length; i++) {
                    $scope.filterCriteriaNew.availableOptions.push({ "name": enabledAssignees[i].name, "label": enabledAssignees[i].name })
                    $scope.filterCriteriaInvestigation.availableOptions.push({ "name": enabledAssignees[i].name, "label": enabledAssignees[i].name })
                    $scope.filterCriteriaNegotiate.availableOptions.push({ "name": enabledAssignees[i].name, "label": enabledAssignees[i].name })
                    $scope.filterCriteriaChecksReceived.availableOptions.push({ "name": enabledAssignees[i].name, "label": enabledAssignees[i].name })
                }
            }, function (error) {
                //failure)
                vm.workQueueErrorMessage = "failed to retrieve Enabled Assignees: " + error;
            });

        $http.get("/Claim/GetFilterClients")
            .then(function (response) {
                //success
                angular.copy(response.data, filterClients);
                for (var i = 0; i < filterClients.length; i++) {
                    $scope.filterClientsNew.availableOptions.push({ "name": filterClients[i].name, "value": filterClients[i].id })
                    $scope.filterClientsInvestigation.availableOptions.push({ "name": filterClients[i].name, "value": filterClients[i].id })
                    $scope.filterClientsNegotiate.availableOptions.push({ "name": filterClients[i].name, "value": filterClients[i].id })
                    $scope.filterClientsChecksReceived.availableOptions.push({ "name": filterClients[i].name, "value": filterClients[i].id })
                }
            }, function (error) {
                //failure)
                vm.workQueueErrorMessage = "failed to retrieve Client Filter: " + error;
            });


        $http.get("/Claim/GetLoggedOnAssigneeId")
            .then(function (response) {
                //success
                vm.loggedOnAssigneeId = response.data;
            }, function (error) {
                //failure
                vm.workQueueErrorMessage = "failed to determine logged on assignee id: " + error;
            });

    //#endregion Initial Load

    }
})();