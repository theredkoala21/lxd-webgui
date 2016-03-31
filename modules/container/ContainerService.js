'use strict';

angular.module('myApp.container')
    .factory('ContainerServices', ['$http', '$q', '$timeout', 'SettingServices',
        function ($http, $q, $timeout, SettingServices) {
            var obj = {};

            obj.isOperationFinished = function (operationID) {
                return $http.get(SettingServices.getLxdApiUrl() + '/operations' + operationID);
            }

            // Get a container
            obj.getByName = function (containerName) {
                return $http.get(SettingServices.getLxdApiUrl() + '/containers/' + containerName);
            }

            // Get a container
            obj.getByUrl = function (containerUrl, callback) {
                $http.get(SettingServices.getLxdUrl() + containerUrl).success(function (data) {
                    callback(data);
                });
            }


            // Get all containers
            obj.getAll = function () {
                return $http.get(SettingServices.getLxdApiUrl() + '/containers').then(function (data) {
                    // {"type":"sync","status":"Success","status_code":200,
                    // "metadata":["/1.0/containers/hacking"]}
                    data = data.data;

                    if (data.status != "Success") {
                        return $q.reject("Error");
                    }


                    var promises = data.metadata.map(function (containerUrl) {
                        return $http.get(SettingServices.getLxdUrl() + containerUrl).then(function (resp) {
                            return resp.data.metadata;
                        });
                    });

                    return $q.all(promises);
                });
            }


            // Create container:
            obj.create = function (containerName, imageFingerprint, profileName, ephemeralState) {
                var containerData = {
                  name: containerName,
                  profiles: [ profileName ],
                  ephemeral: ephemeralState,
                  source: {
                      type: "image",
                      fingerprint: imageFingerprint,
                  }
                };
                return $http.post(SettingServices.getLxdApiUrl() + '/containers', containerData);
            }

            obj.createFromAlias = function (containerData, imageData) {
                containerData.source = {
                    type: "image",
                    alias: "ubuntu/16.04"
                };
                return $http.post(SettingServices.getLxdApiUrl() + '/containers', containerData);
            }


            // Modify container:
            obj.modify = function (containerName, containerData, callback) {
                delete containerData['name'];
                delete containerData['status'];

                $http.put(SettingServices.getLxdApiUrl() + '/containers/' + containerName, containerData).success(function (data) {
                    callback(data);
                });
            }


            // Rename  a container
            obj.rename = function (containerName, containerData) {
                return $http.post(SettingServices.getLxdApiUrl() + '/containers/' + containerName, containerData);
            }


            // Delete a container
            obj.delete = function (containerName) {
                return $http.delete(SettingServices.getLxdApiUrl() + '/containers/' + containerName).then(function (data) {
                    return data;
                });
            }


            /** State **/
            obj.getState = function (containerName) {
                return $http.get(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/state');
            }

            obj.changeState = function (containerName, state) {
                var data =
                {
                    "action": state,        // State change action (stop, start, restart, freeze or unfreeze)
                    "timeout": 30,          // A timeout after which the state change is considered as failed
                    "force": true,          // Force the state change (currently only valid for stop and restart where it means killing the container)
                    "stateful": false        // Whether to store or restore runtime state before stopping or startiong (only valid for stop and start, defaults to false)
                }

                return $http.put(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/state', data);
            }

            /** Snapshot **/

            obj.getSnapshots = function(containerName) {
              return $http.get(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/snapshots').then(function (data) {
                  data = data.data;

                  if (data.status != "Success") {
                      return $q.reject("Error");
                  }


                  var promises = data.metadata.map(function (containerUrl) {
                      return $http.get(SettingServices.getLxdUrl() + containerUrl).then(function (resp) {
                          return resp.data.metadata;
                      });
                  });

                  return $q.all(promises);
              });

            }

            obj.createSnapshot = function(containerName, snapshotData) {
              return $http.post(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/snapshots', snapshotData);
            }

            obj.restoreSnapshot = function(containerName, snapshotName) {
              var data = {
                restore: snapshotName,
              }
              return $http.put(SettingServices.getLxdApiUrl() + '/containers/' + containerName, data);
            }

            return obj;
        }])
;
