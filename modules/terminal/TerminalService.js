'use strict';

angular.module('myApp.remoteimage')
    .factory('TerminalServices', ['$http', '$q', 'SettingServices',
        function ($http, $q, SettingServices) {
            var obj = {};


            obj.getJavascriptTerminal = function() {
              var term = new Terminal({
                  cols: 120,
                  rows: 25,
                  useStyle: true,
                  screenKeys: true,
                  cursorBlink: false
              });

              return term;
            }


            obj.getTerminal = function(containerName, geometry) {
              var data = {
                  "command": ["bash"],
                  "environment": {
                    "HOME": "/root",
                    "TERM": "xterm",
                    "USER": "root"
                  },
                  "wait-for-websocket": true,
                  "interactive": true,
                  "width": geometry.cols,
                  "height": geometry.rows
              }

              return $http.post(SettingServices.getLxdApiUrl() + '/containers/' + containerName + "/exec", data).then(function(data) {
                var op = data.data.operation;

                // Necessary?
                /*$http.get('https://localhost:9000' + op).then(function(data) {

                  return data;
                });*/

                return data;
              });
            }


            obj.getTerminal2 = function(containerName, term, geometry) {
              return obj.getTerminal(containerName, geometry).then(function(data) {
                 var operationId = data.data.metadata.id;
                 var secret = data.data.metadata.metadata.fds[0];

                 var wssurl = SettingServices.getLxdWsUrl() + "/1.0/operations/"
                   + operationId
                   + "/websocket?secret="
                   + secret;

                 var sock = new WebSocket(wssurl);

                 term.on('data', function (data) {
                     sock.send(new Blob([data]));
                 });


                 sock.onopen = function (e) {
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

                return term;
               })
            }

            return obj;
        }])
;
