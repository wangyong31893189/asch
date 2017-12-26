angular.module('asch').controller('personalCtrl', function ($scope, $rootScope, apiService, ipCookie, $window, $http, userService, postSerivice, $translate) {
    // local argument

    // Close
    $scope.Close = function () {
        $rootScope.isBodyMask = false;
        $rootScope.secpasssetting = false;
    };
});