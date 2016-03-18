'use strict';

angular.module('myApp.container')
        .factory('ContainerServices', ['$http', '$q', '$timeout',
            function ($http, $q, $timeout) {
              var obj = {};

                // Get a container
                obj.getByName =  function (containerName) {
                  return $http.get('https://localhost:9000/1.0/containers/' + containerName);
                }

                // Get a container
                obj.getByUrl = function (containerUrl, callback) {
                  $http.get('https://localhost:9000' + containerUrl).success(function (data) {
                    callback(data);
                  });
                }


                // Get all containers
                obj.getAll = function(callback) {
                        $http.get('https://localhost:9000/1.0/containers').success(function (data) {
                          // {"type":"sync","status":"Success","status_code":200,
                          // "metadata":["/1.0/containers/hacking"]}

                          if (data.status != "Success") {
                            console.log("Err");
                          }

                          var containers = [];
                          for(var n=0; n < data.metadata.length; n++) {
                            var c = data.metadata[n];

                            obj.getByUrl(c, function(data2) {
                              containers.push(data2.metadata);
                            });

                          }

                            callback(containers);
                        });
                    }


                    // Create container:
                    obj.create = function(containerData, callback) {
                      $http.post('https://localhost:9000/1.0/containers').success(function(data) {
                        callback(data);
                      });
                    }

                    // Modify container:
                    obj.modify = function(containerName, containerData, callback) {
                      $http.put('https://localhost:9000/1.0/containers/' + containerName).success(function(data) {
                        callback(data);
                      });
                    }



                    /** State **/
                    obj.getState = function(containerName) {
                      return $http.get('https://localhost:9000/1.0/containers/' + containerName + '/state');
                    }

                    return obj;

            }])
;
