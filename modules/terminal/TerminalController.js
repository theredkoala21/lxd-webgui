'use strict';

angular.module('myApp.terminal', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/terminal/:containerName', {
            title: 'Terminal',
            templateUrl: 'modules/terminal/terminal.html',
            controller: 'terminalPageCtrl',
        })
        ;
    }])


    .controller('terminalPageCtrl', function ($scope, $routeParams, $filter, $location,
                                                 TerminalServices, SettingServices) {
     $scope.containerName = $routeParams.containerName;

     TerminalServices.getTerminal2($scope.containerName).then(function(term) {
       term.open(document.getElementById('console'));
     });
    })
;
