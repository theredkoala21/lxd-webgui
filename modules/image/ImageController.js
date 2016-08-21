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


    .controller('imageViewCtrl', function ($scope, $routeParams, $filter, $location, $uibModal, $route,
                                           image, ImageServices) {
        $scope.image = image.data.metadata;

        $scope.openEditAliasDialog = function (alias) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/image/modalEditAlias.html',
                controller: 'editAliasModalCtrl',
                size: 'sm',
                resolve: {
                    alias: function() {
                        return alias;
                    },
                    image: function () {
                        return $scope.image;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                var origAlias = data.origAlias;
                var newAlias = data.newAlias;

                // rename
                ImageServices.renameAlias(origAlias, newAlias).then(function (data) {
                    if (data.status != "Success") {
                        console.log("Something went wrong");
                    }
                });


            }, function () {
                // Nothing
            });
        }


        $scope.openAddAliasDialog = function (alias) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/image/modalAddAlias.html',
                controller: 'addAliasModalCtrl',
                size: 'sm',
                resolve: {
                    image: function () {
                        return $scope.image;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                var image = data.image;
                var alias = data.alias;

                // add alias
                ImageServices.addAlias(image, alias).then(function (data) {
                    if (data.status != "Success") {
                        console.log("Something went wrong");
                    }
                    $route.reload();

                });
            }, function () {
                // Nothing
            });
        };


        $scope.removeAlias = function (alias) {
            ImageServices.removeAlias(alias).then(function (data) {
                if (data.status != "Success") {
                    console.log("Something went wrong");
                }
                $route.reload();
            });
        };
    })


    .controller('imageListCtrl', function ($scope, $routeParams, $interval, $filter, $location, $uibModal,
                                           ContainerServices, ImageServices, images) {
        $scope.images = images;

        $scope.delete = function(image) {
          // Create modal
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/image/modalDelImage.html',
              controller: 'genericImageModalCtrl',
              size: 'md',
              resolve: {
                image: function () {
                    return image;
                }
              }
          });

          // Handle modal answer
          modalInstance.result.then(function (container) {
            ImageServices.delete(container).then(function(data) {

              var operationUrl = data.data.operation;
              var refreshInterval;

              // Try until operation is finished
              refreshInterval = $interval(
                function() {
                  ContainerServices.isOperationFinished(operationUrl).then(function(data) {
                    // I dont really care if the operation is still runnging
                  }, function(error) {
                    $interval.cancel(refreshInterval);

                    // Operation returned 404, so its finished
                    ImageServices.getAll().then(function(data) {
                      $scope.images = data;
                    })
                  });
                }, 1000
              );
            });
          }, function () {
            // Do Nothing
          });
      }
    })


    .controller('genericImageModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       image, ImageServices) {
        $scope.image = image;

        $scope.ok = function () {
            $uibModalInstance.close($scope.image);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('addAliasModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                   image, ImageServices) {
        $scope.image = image;

        $scope.ok = function () {
            $uibModalInstance.close( { image: $scope.image, alias: $scope.alias} );
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('editAliasModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                image, alias, ImageServices) {
        $scope.image = image;
        $scope.alias = alias;
        $scope.origAlias = angular.copy(alias);

        $scope.ok = function () {
            $uibModalInstance.close( { origAlias: $scope.origAlias, newAlias: $scope.alias} );
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
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
