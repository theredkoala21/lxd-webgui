'use strict';

angular.module('myApp.network', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/networks', {
            title: 'Networks',
            templateUrl: 'modules/network/networks.html',
            controller: 'networkListCtrl',
            resolve: {
                networks: function (NetworkServices) {
                    return NetworkServices.getAll();
                }
            }
        })
        .when('/network-view/:networkName', {
            title: 'Networks',
            templateUrl: 'modules/network/network-view.html',
            controller: 'networkViewCtrl',
            resolve: {
                network: function (NetworkServices, $route) {
                    return NetworkServices.getByName($route.current.params.networkName)
                }
            }
        })
        ;
    }])


    .controller('networkViewCtrl', function ($scope, $routeParams, $filter, $location, network, NetworkServices) {
        $scope.network = network.data.metadata;

        // Should be in service?
        if ($scope.network.used_by.length > 0) {
            $scope.network.usedBy = [];

            for(var n=0; n<$scope.network.used_by.length; n++) {
                NetworkServices.getByUrl($scope.network.used_by[n]).then(function(data) {
                    $scope.network.usedBy.push(data.data.metadata);
                })
            }

        }

    })

    .controller('networkListCtrl', function ($scope, $routeParams, $filter, $location,
                                             NetworkServices, networks) {
        $scope.networks = networks;
    })
;
