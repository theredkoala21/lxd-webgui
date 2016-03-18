'use strict';

angular.module('myApp.network', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/networks', {
                title: 'Networks',
                templateUrl: 'modules/network/networks.html',
                controller: 'networkListCtrl',
            })
            .when('/network-view/:networkID', {
                title: 'Networks',
                templateUrl: 'modules/network/network-view.html',
                controller: 'networkViewCtrl',
                resolve : {
                    topics: function(TopicServices, $route) {
                        return TopicServices.getTopics();
                    },
                    network: function(NetworkServices, $route) {
                        return NetworkServices.getDirect($route.current.params.networkID)
                    }
                }
            })
            ;
        }])


    .controller('networkViewCtrl', function ($scope, $routeParams, $filter, $location, topics, network, NetworkServices) {
        var networkID = $routeParams.networkID;

    })

    .controller('networkListCtrl', function ($scope, $routeParams, $filter, $location, NetworkServices) {
      $scope.networks = [];
        NetworkServices.getAll(function(data) {
          $scope.networks = data;
        });
    })
;
