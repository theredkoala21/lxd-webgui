'use strict';

angular.module('myApp.image', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/images', {
                title: 'Images',
                templateUrl: 'modules/image/images.html',
                controller: 'imageListCtrl',
            })
            .when('/image-view/:imageID', {
                title: 'Images',
                templateUrl: 'modules/image/image-view.html',
                controller: 'imageViewCtrl',
                resolve : {
                    topics: function(TopicServices, $route) {
                        return TopicServices.getTopics();
                    },
                    image: function(ImageServices, $route) {
                        return ImageServices.getDirect($route.current.params.imageID)
                    }
                }
            })
            ;
        }])


    .controller('imageViewCtrl', function ($scope, $routeParams, $filter, $location, topics, image, ImageServices) {
        var imageID = $routeParams.imageID;

    })

    .controller('imageListCtrl', function ($scope, $routeParams, $filter, $location, ImageServices) {
      $scope.images = [];
        ImageServices.getAll(function(data) {
          $scope.images = data;
        });
    })
;
