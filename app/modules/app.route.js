angular.module("avanadeApp").config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/", {
        controller: "DashboardController",
        templateUrl : "modules/dashboard/views/main.html"
    });
}]);