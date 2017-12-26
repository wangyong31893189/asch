angular.module('asch').controller('secpasssettingCtrl', function ($scope, $rootScope, apiService, ipCookie, $window, $http, userService, postSerivice, $translate) {
    // local argument
    $rootScope.secpasssetting = false;
    // Close
    $scope.Close = function () {
        $rootScope.isBodyMask = false;
        $rootScope.secpasssetting = false;
    };

    // 两方重制create
	$scope.createTrsPsd = function() {
		return AschJS.signature.createSignature(userService.secret, $scope.secondpassword);
	}

	$scope.createTrsLok = function() {
		var lockHeight = Number($scope.block_number);
		return AschJS.transaction.createLock(lockHeight, userService.secret, $scope.secondpassword);
    }
    
    // 设置二级密码
    $scope.setPassWord = function () {
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		if (!$scope.secondpassword || !$scope.confirmPassword) {
			return toastError($translate.instant('ERR_NO_SECND_PASSWORD'));;
		}
		var secondPwd = $scope.secondpassword.trim();
		var confirmPwd = $scope.confirmPassword.trim();
		if (secondPwd != confirmPwd) {
			toastError($translate.instant('ERR_TWO_INPUTS_NOT_EQUAL'));
		} else if (!reg.test(secondPwd)) {
			toastError($translate.instant('ERR_PASSWORD_INVALID_FORMAT'));
		} else if (reg.test(secondPwd) && reg.test(confirmPwd) && secondPwd == confirmPwd) {
			postSerivice.retryPost($scope.createTrsPsd, function(err, res) {
				if (err === null) {
					if (res.success == true) {
						$scope.passwordsure = true;
						toast($translate.instant('INF_SECND_PASSWORD_SET_SUCCESS'));
					} else {
						toastError(res.error);
					}
				} else if(err === 'adjust'){
					toastError($translate.instant('ADJUST_TIME_YOURSELF'));
				} else {
					toastError($translate.instant('ERR_SERVER_ERROR'));
				}
			})
		}
	}

});