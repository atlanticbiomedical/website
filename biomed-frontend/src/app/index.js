angular.module('biomed-frontend', [
    'templates',
    'ui.router',
    'ngResource',
    'angular-loading-bar',
    'wu.masonry',
    'mm.foundation',
    'infinite-scroll'
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
            controller: function($scope, $timeout, $sce, $location, $anchorScroll, Posts) {
                $scope.posts = [];

                var deferred = false;
                var more = true;
                var filter = undefined;

                var loadNextPage = function() {
                    if (more && (!deferred || deferred.$resolved)) {
                        var query = {
                            'status': 'posted',
                            'sort': '-postedOn',
                            'limit': 10,
                            'skip': $scope.posts.length
                        };

                        if ($scope.filter) {
                            query['tags'] = $scope.filter;
                        }

                        deferred = Posts.query(query, function(posts) {
                            more = posts.length > 0;

                            angular.forEach(posts, function(post) {
                                if (post.previewHtml) {
                                    post.previewHtml = $sce.trustAsHtml(post.previewHtml);
                                }

                                $scope.posts.push(post);
                            });
                        });
                    }
                }

                $scope.showMore = function(post) {
                    return post.details || post.gallery.length > 0;
                }

                $scope.addMoreItems = function() {
                    loadNextPage();
                }

                $scope.filterByTag = function(tag) {
                    $scope.filter = tag;
                    $scope.posts = [];
                    loadNextPage();
                }

                $scope.resetFilter = function() {
                    $scope.filter = undefined;
                    $scope.posts = [];
                    loadNextPage();
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
                    }).$promise;
                }
            },
            controller: function($scope, post, $sce) {
                if (post.detailsHtml) {
                    post.detailsHtml = $sce.trustAsHtml(post.detailsHtml);
                }

                $scope.post = post;
           		$scope.gallery = post.gallery;
            }
        });
})



$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {
        $('#return-to-top').fadeIn(200);
    } else {
        $('#return-to-top').fadeOut(200);
    }
});
$('#return-to-top').click(function() {
    $('body,html').animate({
        scrollTop : 0
    }, 500);
});
