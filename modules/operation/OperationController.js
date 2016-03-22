'use strict';

angular.module('myApp.operation', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/operations', {
            title: 'Operations',
            templateUrl: 'modules/operation/operations.html',
            controller: 'operationListCtrl',
            resolve: {
                operations: function (OperationServices, $route) {
                    return OperationServices.getAll();
                }
            }
        })
        .when('/operation-view/:operationID', {
            title: 'Operations',
            templateUrl: 'modules/operation/operation-view.html',
            controller: 'operationViewCtrl',
            resolve: {
                operation: function (OperationServices, $route) {
                    return OperationServices.getByFingerprint($route.current.params.operationID)
                }
            }
        })
        ;
    }])

    .controller('operationHeaderCtrl', function ($scope, $routeParams, $filter, $location,
      OperationServices) {

        OperationServices.getAll().then(function(data) {
          $scope.operations = data;
        });
    })

    .controller('operationViewCtrl', function ($scope, $routeParams, $filter, $location, operation, OperationServices) {
        $scope.operation = operation.data.metadata;
    })

    .controller('operationListCtrl', function ($scope, $routeParams, $filter, $location,
                                           OperationServices, operations) {
        $scope.operations = operations;
    })
;
