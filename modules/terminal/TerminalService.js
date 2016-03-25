'use strict';

angular.module('myApp.remoteimage')
    .factory('TerminalServices', ['$http', '$q', 'SettingServices',
        function ($http, $q, SettingServices) {
            var obj = {};

            obj.getTerminal = function(containerName) {
              var data = {
                  "command": ["bash"],
                  "environment": {
                    "HOME": "/root",
                    "TERM": "xterm",
                    "USER": "root"
                  },
                  "wait-for-websocket": true,
                  "interactive": true
              }

              return $http.post(SettingServices.getLxdApiUrl() + '/containers/' + containerName + "/exec", data).then(function(data) {
                var op = data.data.operation;

                /*$http.get('https://localhost:9000' + op).then(function(data) {

                  return data;
                });*/

                return data;
              });
            }

            return obj;
        }])
;
