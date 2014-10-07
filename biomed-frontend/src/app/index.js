angular.module('biomed-frontend', [
    'templates',
    'ui.router',
    'ngResource',
    'angular-loading-bar',
    'wu.masonry'

])
.factory('Posts', function($resource) {
	return $resource('/api/v1/posts/:_id',
		{ '_id': '@_id' }
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
                    return Posts.query({
                        'status': 'posted',
                        'sort': '-createdOn',
                    });
                }
            },
            controller: function($scope, posts, $timeout) {
                $scope.posts = posts;

                $scope.showMore = function(post) {
                    return post.details || post.gallery.length > 0;
                }
            }
        })
        .state('site.details', {
            url: '/posts/:_id',
            templateUrl: 'app/details.html',
            resolve: {
                post: function(Posts, $stateParams) {
                    return Posts.get({
                        '_id': $stateParams._id
                    });
                }
            },
            controller: function($scope, post) {
            	post.$promise.then(function() {
            		$scope.post = post;
            		$scope.gallery = post.gallery;
            	});
            }
        });
});
