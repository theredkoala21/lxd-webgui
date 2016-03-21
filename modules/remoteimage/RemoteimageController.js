'use strict';

angular.module('myApp.remoteimage', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/remoteimages', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimage/remoteimages.html',
            controller: 'remoteimageListCtrl',
            resolve: {
                remoteimages: function (RemoteimageServices, $route) {
                    return RemoteimageServices.downloadRemoteimageList();
                }
            }
        })
        .when('/remoteimage-view/:imageID', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimage/image-view.html',
            controller: 'remoteimageViewCtrl',
            resolve: {
                image: function (RemoteimageServices, $route) {
                    return RemoteimageServices.getByFingerprint($route.current.params.imageID)
                }
            }
        })
        .when('/remoteimage-add', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimage/image-add-remote.html',
            controller: 'remoteimageAddRemoteCtrl',
            resolve: {}
        })
        ;
    }])


    .controller('remoteimageViewCtrl', function ($scope, $routeParams, $filter, $location,
                                                 remoteimages, RemoteimageServices, ImageServices) {
        $scope.remoteimages = remoteimages.data;

    })

    .controller('remoteimageListCtrl', function ($scope, $routeParams, $filter, $location,
                                                RemoteimageServices, remoteimages, ImageServices) {
        $scope.remoteimages = remoteimages;


        $scope.addRemoteimage = function (remoteimage) {
            console.log("URL: " + remoteimage.url);
            //console.log("Fingerprint: " + remoteimage.combined_sha256 + "AA");
            //ImageServices.addRemoteImage(remoteimage.url);
            ImageServices.addSourceImage(remoteimage.combined_sha256);
        }
    })

    .controller('remoteimageAddRemoteCtrl', function ($scope, $routeParams, $filter, $location, RemoteimageServices) {
        $scope.addRemoteImage = function () {
            RemoteimageServices.addRemoteImage($scope.url);
        }

        $scope.addSourceImage = function () {
            RemoteimageServices.addSourceImage();
        }
    })
;
