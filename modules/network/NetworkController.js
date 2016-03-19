'use strict';

angular.module('myApp.network', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/networks', {
                title: 'Networks',
                templateUrl: 'modules/network/networks.html',
                controller: 'networkListCtrl',
                resolve: {
                  networks: function(NetworkServices) {
                    return NetworkServices.getAll();
                  }
                }
            })
            .when('/network-view/:networkName', {
                title: 'Networks',
                templateUrl: 'modules/network/network-view.html',
                controller: 'networkViewCtrl',
                resolve : {
                    network: function(NetworkServices, $route) {
                        return NetworkServices.getByName($route.current.params.networkName)
                    }
                }
            })
            ;
        }])


    .controller('networkViewCtrl', function ($scope, $routeParams, $filter, $location, network, NetworkServices) {
      $scope.network = network.data.metadata;

    })

    .controller('networkListCtrl', function ($scope, $routeParams, $filter, $location,
      NetworkServices, networks)
    {
      $scope.networks = networks;
    })
;
