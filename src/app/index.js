angular.module('biomed-frontend', [
    'templates',
    'ui.router',
    'ngResource',
    'angular-loading-bar'
])
.factory('Posts', function($resource) {
	return $resource('/api/:id',
		{ id: '@id' }
	);
})
.config(function($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    	.state('site', {
    		abstract: true,
    		templateUrl: 'app/layout.html'
    	})
        .state('site.list', {
            url: '/',
            templateUrl: 'app/list.html',
            resolve: {
                posts: function(Posts) {
                    return Posts.query();
                }
            },
            controller: function($scope, posts, $timeout) {
                $scope.posts = posts;
            }
        })
        .state('site.details', {
            url: '/posts/:id',
            templateUrl: 'app/details.html',
            resolve: {
                post: function(Posts, $stateParams) {
                    return Posts.get($stateParams);
                }
            },
            controller: function($scope, post) {
            	post.$promise.then(function() {
            		$scope.post = post;
            		$scope.images = post.images;
            	});
            }
        });
});
