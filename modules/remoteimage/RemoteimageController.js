'use strict';

angular.module('myApp.remoteimage', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/remoteimages', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimage/remoteimages.html',
            controller: 'remoteimageListCtrl',
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


    .controller('remoteimageListCtrl', function ($scope, $routeParams, $filter, $location, $uibModal,
                                                RemoteimageServices, ImageServices)
    {
        $scope.remoteimages = [];
        $scope.filter = {
          search: '',
        };

        $scope.architectures = [
          'amd64', // x86_64
          'x86_64',

          'i386', // i686
          'i686',

          'armhf',
          'arm64',
          'ppc64el',

          'armv7l',
          'ppc',
          's390x'
        ];

        $scope.reload = function() {
          RemoteimageServices.getByFilter($scope.filter).then(function(data) {
            $scope.remoteimages = data[0].concat(data[1]);
            $scope.errorMsg = "";
          }, function(error) {
            $scope.errorMsg = "Connection error. Could not retrieve data.";
          })
        }

        $scope.reload();


        $scope.showError = function(data) {
          // Create modal
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/remoteimage/modalErrImage.html',
              controller: 'errorModalCtrl',
              size: 'lg',
              resolve: {
                  data: function () {
                      return data;
                  }
              }
          });
        }


        $scope.addRemoteimage = function(remoteimage) {
            // Create modal
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/remoteimage/modalAddRemoteimage.html',
                controller: 'genericRemoteimageModalCtrl',
                size: 'lg',
                resolve: {
                    remoteimage: function () {
                        return remoteimage;
                    }
                }
            });

            // Handle modal answer
            modalInstance.result.then(function (remoteimage) {
               ImageServices.addSourceImageRepo(remoteimage).then(function(data) {
                 if (data.data.metadata.status == "Failure") {
                   $scope.showError(data.data.metadata);
                 }
               });
            }, function () {
              // Cancel, so do nothing
            });
          }
    })


    .controller('genericRemoteimageModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       remoteimage)
    {
        $scope.remoteimage = remoteimage;

        $scope.ok = function () {
            $uibModalInstance.close($scope.remoteimage);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('errorModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       data)
    {
        $scope.data = data;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
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
