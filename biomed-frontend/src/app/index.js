angular.module('biomed-frontend', [
    'templates',
    'ui.router',
    'ngResource',
    'angular-loading-bar',
    'wu.masonry',
    'mm.foundation'
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
                        'sort': '-postedOn',
                    }).$promise;
                }
            },
            controller: function($scope, posts, $timeout, $sce, $location, $anchorScroll) {
                $scope.posts = [];

                angular.forEach(posts, function(post) {
                    if (post.previewHtml) {
                        post.previewHtml = $sce.trustAsHtml(post.previewHtml);
                    }

                    $scope.posts.push(post);
                });

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
