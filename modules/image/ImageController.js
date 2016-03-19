'use strict';

angular.module('myApp.image', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/images', {
                title: 'Images',
                templateUrl: 'modules/image/images.html',
                controller: 'imageListCtrl',
                resolve: {
                  images: function(ImageServices, $route) {
                    return ImageServices.getAll();
                  }
                }
            })
            .when('/image-view/:imageID', {
                title: 'Images',
                templateUrl: 'modules/image/image-view.html',
                controller: 'imageViewCtrl',
                resolve : {
                    image: function(ImageServices, $route) {
                        return ImageServices.getByFingerprint($route.current.params.imageID)
                    }
                }
            })
            ;
        }])


    .controller('imageViewCtrl', function ($scope, $routeParams, $filter, $location, image, ImageServices) {
      $scope.image = image.data.metadata;
    })
    .controller('imageListCtrl', function ($scope, $routeParams, $filter, $location,
      ImageServices, images)
    {
        $scope.images = images;
    })
;
