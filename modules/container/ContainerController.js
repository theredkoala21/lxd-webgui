'use strict';

angular.module('myApp.container', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containers', {
            title: 'Containers',
            templateUrl: 'modules/container/containers.html',
            controller: 'containerListCtrl',
            resolve: {
                containers: function (ContainerServices) {
                    return ContainerServices.getAll();
                }
            }
        })
        .when('/container-create', {
            title: 'Containers',
            templateUrl: 'modules/container/container-create.html',
            controller: 'containerCreateCtrl',
            resolve: {
                images: function (ImageServices, $route) {
                    return ImageServices.getAll();
                }
            }
        })
        .when('/container-view/:containerName', {
            title: 'Container',
            templateUrl: 'modules/container/container-view.html',
            controller: 'containerViewCtrl',
            resolve: {
                containerState: function (ContainerServices, $route) {
                    return ContainerServices.getState($route.current.params.containerName)
                },
                container: function (ContainerServices, $route) {
                    return ContainerServices.getByName($route.current.params.containerName)
                }
            }
        })
        .when('/container-edit/:containerName', {
            title: 'Container',
            templateUrl: 'modules/container/container-edit.html',
            controller: 'containerViewCtrl',
            resolve: {
                containerState: function (ContainerServices, $route) {
                    return ContainerServices.getState($route.current.params.containerName)
                },
                container: function (ContainerServices, $route) {
                    return ContainerServices.getByName($route.current.params.containerName)
                }
            }
        })
        ;
    }])


    .controller('containerViewCtrl', function ($scope, $routeParams, $filter, $location, $uibModal, $route,
                                               containerState, container, ContainerServices) {
        $scope.container = container.data.metadata;
        $scope.container.state = containerState.data.metadata;

        $scope.changeState = function (container, state) {
            ContainerServices.changeState(container.name, state);
        }

        $scope.openEditNameDialog = function (container) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/container/modalEditName.html',
                controller: 'genericContainerModalCtrl',
                size: 'sm',
                resolve: {
                    container: function () {
                        return angular.copy($scope.container);
                    }
                }
            });

            modalInstance.result.then(function (newContainer) {
                var newName = {name: newContainer.name};
                // rename
                ContainerServices.rename(container.name, newName).success(function (data) {
                    // Move to main because location has changed
                    $location.url("/containers/");
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    })


    .controller('genericContainerModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       container, ContainerServices) {
        $scope.container = container;

        $scope.ok = function () {
            $uibModalInstance.close($scope.container);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('containerListCtrl', function ($scope, $routeParams, $filter, $location,
                                               ContainerServices, containers) {
        $scope.containers = containers;

        $scope.changeState = function (container, state) {
            ContainerServices.changeState(container.name, state);
        }

        $scope.delete = function (container, state) {
            alert("Not yet implemented");
            //ContainerServices.delete(container.name, state);
        }
    })


    .controller('containerCreateCtrl', function ($scope, $routeParams, $filter, $location,
                                                 ContainerServices, ImageServices, images) {
        $scope.container = {};
        $scope.selectedImage = {};
        $scope.images = images;

        $scope.setImage = function (image) {
            $scope.selectedImage = image;
        }

        $scope.createContainer = function () {
            ContainerServices.create($scope.container, $scope.selectedImage);
        }
    })
;
