'use strict';

angular.module('myApp.operation')
        .factory('OperationServices', ['$http', '$q', 'SettingServices',
            function ($http, $q, SettingServices) {
              var obj = {};

                // Get a operation
                obj.get = function (operationName) {
                    return $http.get(SettingServices.getLxdApiUrl() + '/operations/' + operationName);
                }

                // Get all operations
                obj.getAll = function() {
                    return $http.get(SettingServices.getLxdApiUrl() + '/operations').then(function (data) {
                      data = data.data;

                      if (data.status != "Success") {
                        return $q.reject("Error");
                      }

                      if ( ! _.isEmpty(data.metadata.running)) {

                        var promises = data.metadata.running.map(function(operationUrl) {
                            return $http.get(SettingServices.getLxdUrl() + operationUrl).then(function(resp) {
                                return resp.data.metadata;
                            });
                        });

                        return $q.all(promises);
                      }


                      if ( ! _.isEmpty(data.metadata.failure)) {

                        var promises = data.metadata.failure.map(function(operationUrl) {
                            return $http.get(SettingServices.getLxdUrl() + operationUrl).then(function(resp) {
                                return resp.data.metadata;
                            });
                        });

                        return $q.all(promises);
                      }


                    });
                }

                return obj;
            }])
;
