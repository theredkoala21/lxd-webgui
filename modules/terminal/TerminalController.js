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

     TerminalServices.getTerminal($scope.containerName).then(function(data) {
       $scope.container = {};

        var operationId = data.data.metadata.id;
        var secret = data.data.metadata.metadata.fds[0];

        var wssurl = SettingServices.getLxdWsUrl + "/1.0/operations/"
          + operationId
          + "/websocket?secret="
          + secret;

        var sock = new WebSocket(wssurl);
        sock.onopen = function (e) {
                   var term = new Terminal({
                       cols: 160,
                       rows: 32,
                       useStyle: true,
                       screenKeys: false,
                       cursorBlink: false
                   });

                   //term.open(document.getElementById('console'));
                   term.open(document.getElementById('console'));

                   term.on('data', function (data) {
                       sock.send(new Blob([data]));
                   });

                   sock.onmessage = function (msg) {
                       if (msg.data instanceof Blob) {
                           var reader = new FileReader();
                           reader.addEventListener('loadend', function () {
                               term.write(reader.result);
                           });
                           reader.readAsBinaryString(msg.data);
                       } else {
                           term.write(msg.data);
                       }

                   };

                   sock.onclose = function (msg) {
                       console.log('WebSocket closed');
                       term.destroy();
                   };
                   sock.onerror = function (err) {
                       console.error(err);
                   };
               };
        })
    })
;
