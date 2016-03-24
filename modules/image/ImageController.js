'use strict';

angular.module('myApp.image', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/images', {
            title: 'Images',
            templateUrl: 'modules/image/images.html',
            controller: 'imageListCtrl',
            resolve: {
                images: function (ImageServices, $route) {
                    return ImageServices.getAll();
                }
            }
        })
        .when('/image-view/:imageID', {
            title: 'Images',
            templateUrl: 'modules/image/image-view.html',
            controller: 'imageViewCtrl',
            resolve: {
                image: function (ImageServices, $route) {
                    return ImageServices.getByFingerprint($route.current.params.imageID)
                }
            }
        })
        .when('/image-add-remote', {
            title: 'Images',
            templateUrl: 'modules/image/image-add-remote.html',
            controller: 'imageAddRemoteCtrl',
            resolve: {}
        })
        ;
    }])


    .controller('imageViewCtrl', function ($scope, $routeParams, $filter, $location, image, ImageServices) {
        $scope.image = image.data.metadata;
    })

    .controller('imageListCtrl', function ($scope, $routeParams, $filter, $location,
                                           ImageServices, images) {
        $scope.images = images;

        console.log("A: " + JSON.stringify(images));
    })

    .controller('imageAddRemoteCtrl', function ($scope, $routeParams, $filter, $location, ImageServices) {
        $scope.addRemoteImage = function () {
            ImageServices.addRemoteImage($scope.url);
        }

        $scope.addSourceImage = function () {
            ImageServices.addSourceImage2();
        }
    })
;
