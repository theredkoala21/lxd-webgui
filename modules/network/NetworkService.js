'use strict';

angular.module('myApp.network')
    .factory('NetworkServices', ['$http', '$q', 'SettingServices',
        function ($http, $q, SettingServices) {
            var obj = {};

            // Get a container
            obj.getByName = function (networkName) {
                return $http.get(SettingServices.getLxdApiUrl() + '/networks/' + networkName);
            }

            // Get a network
            obj.get = function (networkName, callback) {
                $http.get(SettingServices.getLxdApiUrl() + '/networks/' + networkName).success(function (data) {
                    callback(data);
                });
            }

            // Get a network
            obj.getByUrl = function (networkUrl) {
                return $http.get(SettingServices.getLxdUrl() + networkUrl);
            }


            // Get all networks
            obj.getAll = function () {
                return $http.get(SettingServices.getLxdApiUrl() + '/networks').then(function (data) {
                    // {"type":"sync","status":"Success","status_code":200,
                    // "metadata":["/1.0/networks/hacking"]}
                    data = data.data;

                    if (data.status != "Success") {
                        return $q.reject("Error");
                    }

                    var promises = data.metadata.map(function (networkUrl) {
                        return $http.get(SettingServices.getLxdUrl() + '/' + networkUrl).then(function (resp) {
                            data = resp.data.metadata;
                            return data;
                        });
                    });

                    return $q.all(promises);
                });
            }


            // Create network:
            obj.create = function (networkData, callback) {
                $http.post(SettingServices.getLxdApiUrl() + '/networks').success(function (data) {
                    callback(data);
                });
            }

            // Modify network:
            obj.modify = function (networkName, networkData, callback) {
                $http.put(SettingServices.getLxdApiUrl() + '/networks/' + networkName).success(function (data) {
                    callback(data);
                });
            }

            return obj;
        }])
;
