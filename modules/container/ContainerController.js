'use strict';

angular.module('myApp.container', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/containers', {
                title: 'Containers',
                templateUrl: 'modules/container/containers.html',
                controller: 'containerListCtrl',
            })
            .when('/container-view/:containerName', {
                title: 'Container',
                templateUrl: 'modules/container/container-view.html',
                controller: 'containerViewCtrl',
                resolve : {
                    containerState: function(ContainerServices, $route) {
                      return ContainerServices.getState($route.current.params.containerName)
                    },
                    container: function(ContainerServices, $route) {
                        return ContainerServices.getByName($route.current.params.containerName)
                    }
                }
            })
            ;
        }])


    .controller('containerViewCtrl', function ($scope, $routeParams, $filter, $location,
      containerState, container, ContainerServices) {
        var containerID = $routeParams.containerID;

        $scope.container = container.data.metadata;

        $scope.container.state = containerState.data.metadata;
    })

    .controller('containerListCtrl', function ($scope, $routeParams, $filter, $location, ContainerServices) {
      $scope.containers = [];
        ContainerServices.getAll(function(data) {
          $scope.containers = data;
        });
    })
;
