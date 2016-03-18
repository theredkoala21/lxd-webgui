'use strict';

angular.module('myApp.network')
        .factory('NetworkServices', ['$http',
            function ($http) {
              var obj = {};

                // Get a network
                obj.get =  function (networkName, callback) {
                        $http.get('https://localhost:9000/1.0/networks/' + networkName).success(function (data) {
                            callback(data);
                        });
                    }

                    // Get a network
                obj.getByUrl = function (networkUrl, callback) {
                        $http.get('https://localhost:9000' + networkUrl).success(function (data) {
                            callback(data);
                        });
                    }


                    // Get all networks
                obj.getAll = function(callback) {
                        $http.get('https://localhost:9000/1.0/networks').success(function (data) {
                          // {"type":"sync","status":"Success","status_code":200,
                          // "metadata":["/1.0/networks/hacking"]}

                          if (data.status != "Success") {
                            console.log("Err");
                          }

                          var networks = [];
                          for(var n=0; n < data.metadata.length; n++) {
                            var c = data.metadata[n];

                            obj.getByUrl(c, function(data2) {
                              networks.push(data2.metadata);
                            });

                          }

                            callback(networks);
                        });
                    }


                    // Create network:
                    obj.create = function(networkData, callback) {
                      $http.post('https://localhost:9000/1.0/networks').success(function(data) {
                        callback(data);
                      });
                    }

                    // Modify network:
                    obj.modify = function(networkName, networkData, callback) {
                      $http.put('https://localhost:9000/1.0/networks/' + networkName).success(function(data) {
                        callback(data);
                      });
                    }

                    return obj;
            }])
;
