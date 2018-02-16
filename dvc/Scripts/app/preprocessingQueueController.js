(function () {

    "use strict";

    angular.module("app")
        .controller("preprocessingQueueController", preprocessingQueueController);

    function preprocessingQueueController($scope, $window, $http) {

        var vm = this;
        var enabledAssignees = [];
        var filterClients = [];

        $scope.loadPoliceReport = function (id) {
            $http({
                method: "POST",
                url: "/PreProcessing/LoadPoliceReport",
                data: { id: id }
            })
                .then(function (response) {
                    //success
                    $("#policereport").html(response.data);
                }, function (error) {
                    console.log("Error: ", error);
                    vm.errorMessage = "failed to load data: " + error;
                })
        };

        vm.errorMessage = "";
        vm.isBusy = true;
        vm.queueFilter = "MyCurrent";
        vm.queueFilterLabel = "My Current";
        vm.preprocessingItems = [];

        $scope.filterCriteria = {
            availableOptions: [
            {
                name: "MyCurrent",
                label: "My Current"
            }, {
                name: "TeamCurrent",
                label: "Team Current"
            }],
            selectedValue: {
                name: vm.queueFilter,
                label: vm.queueFilterLabel
            }
        };
        $scope.filterClientsPreprocessing = {
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

        function setFilterDefaults() {
            $scope.filterCriteria.selectedValue.name = vm.queueFilter;
            $scope.filterCriteria.selectedValue.label = vm.queueFilterLabel;
            $scope.filterClientsPreprocessing.selectedValue.name = "All Clients";
            $scope.filterClientsPreprocessing.selectedValue.value = "0";
        }

        $scope.filterChanged = function (filterValue, clientFilter) {
            vm.isBusy = true;
            $http({
                method: "POST",
                url: "/PreProcessing/ViewPreprocessingItemsFiltered",
                data: { filterValue: filterValue, clientIdFilter: clientFilter }
            })
                .then(function (response) {
                    //success
                    angular.copy(response.data, vm.preprocessingItems);
                    //failure
                }, function (error) {
                    console.log("Error: ", error);
                    vm.errorMessage = "failed to load data: " + error;
                }).finally(function () {
                    vm.isBusy = false;
                });
        };

        //On load
        $http.get("/Preprocessing/IsManager")
			.then(function (response) {
			    //success
			    if (response.data.toLowerCase() === "true") {
			        vm.queueFilter = "TeamCurrent";
			        vm.queueFilterLabel = "Team Current";
			        setFilterDefaults();
			    }
			}, function (error) {
			    //failure
			    vm.errorMessage = "failed to determine Security Role: " + error;
			});

        $http.get("/Preprocessing/ViewPreprocessingItems")
			.then(function (response) {
			    //success;
			    angular.copy(response.data, vm.preprocessingItems);
			}, function (error) {
			    //failure
			    vm.errorMessage = "failed to load data: " + error;
			}).finally(function () {
			    vm.isBusy = false;
			});
        $http.get("/Preprocessing/GetEnabledAssignees")
            .then(function (response) {
                //success
                angular.copy(response.data, enabledAssignees);
                for (var i = 0; i < enabledAssignees.length; i++) {
                    $scope.filterCriteria.availableOptions.push({ "name": enabledAssignees[i].name, "label": enabledAssignees[i].name })
                }
            }, function (error) {
            	//failure
            	vm.errorMessage = "failed to load data: " + error;
            });

        $http.get("/Claim/GetFilterClients")
            .then(function (response) {
                //success
                angular.copy(response.data, filterClients);
                for (var i = 0; i < filterClients.length; i++) {
                    $scope.filterClientsPreprocessing.availableOptions.push({ "name": filterClients[i].name, "value": filterClients[i].id })
                }
            }, function (error) {
                //failure)
                vm.errorMessage = "failed to retrieve Client Filter: " + error;
            });
    }
})();