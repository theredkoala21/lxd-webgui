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
     var container = {};

     // get JS terminal emulator
     container.terminal = TerminalServices.getJavascriptTerminal();
     container.terminal.open(document.getElementById('console'));

     var initialGeometry = container.terminal.proposeGeometry();
     console.log("Rows: " + initialGeometry.rows + " Cols: " + initialGeometry.cols);

     TerminalServices.getTerminal2($scope.containerName, container.terminal, initialGeometry).then(function(term) {
         container.terminal.fit();
     });

    })
;
