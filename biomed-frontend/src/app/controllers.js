angular.module('biomed-frontend')
.controller('NavCtrl', function($scope, $modal) {

	$scope.showEmail = function() {
		var modalInstance = $modal.open({
			templateUrl: 'app/email.html',
			controller: 'EmailCtrl'			
		});
	}

})
.controller('EmailCtrl', function($scope, $http, $modalInstance) {

	$scope.model = {};

    $scope.send = function() {
    	console.log($scope.model);

        $http.post('/api/email', $scope.model)
            .success(function() {
            	$modalInstance.close();
            })
            .error(function() {
            	$modalInstance.close();
            });
    };

    $scope.close = function() {
    	$modalInstance.close();
    }

});
