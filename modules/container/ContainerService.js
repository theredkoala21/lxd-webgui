'use strict';

angular.module('myApp.container')
  .factory('ContainerServices', ['$http', '$q', '$timeout',
    function ($http, $q, $timeout) {
      var obj = {};

        obj.isOperationFinished = function(operationID) {
          return $http.get('https://localhost:9000/1.0/operations' + operationID);
        }

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
        obj.getAll = function() {
                return $http.get('https://localhost:9000/1.0/containers').then(function (data) {
                  // {"type":"sync","status":"Success","status_code":200,
                  // "metadata":["/1.0/containers/hacking"]}
                  data = data.data;

                  if (data.status != "Success") {
                    return $q.reject("Error");
                  }


                  var promises = data.metadata.map(function(containerUrl) {
                      return $http.get('https://localhost:9000' + containerUrl).then(function(resp) {
                          return resp.data.metadata;
                      });
                  });

                  return $q.all(promises);
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
              delete containerData['name'];
              delete containerData['status'];

              $http.put('https://localhost:9000/1.0/containers/' + containerName, containerData).success(function(data) {
                callback(data);
              });
            }


            // rename  container:
            obj.rename = function(containerName, containerData) {
              return $http.post('https://localhost:9000/1.0/containers/' + containerName, containerData);
            }


            obj.delete = function(containerName, callback) {
              $http.delete('https://localhost:9000/1.0/containers/' + containerName).success(function(data) {
                callback(data);
              });
            }



            /** State **/
            obj.getState = function(containerName) {
              return $http.get('https://localhost:9000/1.0/containers/' + containerName + '/state');
            }

            obj.changeState = function(containerName, state) {
              var data =
              {
                "action": state,        // State change action (stop, start, restart, freeze or unfreeze)
                "timeout": 30,          // A timeout after which the state change is considered as failed
                "force": true,          // Force the state change (currently only valid for stop and restart where it means killing the container)
                "stateful": false        // Whether to store or restore runtime state before stopping or startiong (only valid for stop and start, defaults to false)
              }

              return $http.put('https://localhost:9000/1.0/containers/' + containerName + '/state', data);
            }

            return obj;
      }])
;
