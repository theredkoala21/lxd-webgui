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


    .controller('operationHeaderCtrl', function ($scope, $routeParams, $filter, $location, $interval,
      OperationServices) {

        $interval(
          function() { $scope.refresh(); }, 3000
        );

        $scope.refresh = function() {
          OperationServices.getAll().then(function(data) {
            var res = [];

            if (data instanceof Array && ! _.isEmpty(data)) {
              data.forEach(function(d) {
                if (d.class != "websocket") {
                  res.push(d);
                }
              });
            }

            $scope.operations = res;
          });
        }
    })


    .controller('operationViewCtrl', function ($scope, $routeParams, $filter, $location, operation, OperationServices) {
        $scope.operation = operation.data.metadata;
    })

    .controller('operationListCtrl', function ($scope, $routeParams, $filter, $location,
                                           OperationServices, operations) {
        $scope.operations = operations;
    })
;
