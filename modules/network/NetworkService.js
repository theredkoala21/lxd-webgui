'use strict';

angular.module('myApp.network')
    .factory('NetworkServices', ['$http', '$q',
        function ($http, $q) {
            var obj = {};

            // Get a container
            obj.getByName = function (networkName) {
                return $http.get('https://localhost:9000/1.0/networks/' + networkName);
            }

            // Get a network
            obj.get = function (networkName, callback) {
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
            obj.getAll = function () {
                return $http.get('https://localhost:9000/1.0/networks').then(function (data) {
                    // {"type":"sync","status":"Success","status_code":200,
                    // "metadata":["/1.0/networks/hacking"]}
                    data = data.data;

                    if (data.status != "Success") {
                        return $q.reject("Error");
                    }

                    var promises = data.metadata.map(function (networkUrl) {
                        return $http.get('https://localhost:9000' + networkUrl).then(function (resp) {
                            return resp.data.metadata;
                        });
                    });

                    return $q.all(promises);
                });
            }


            // Create network:
            obj.create = function (networkData, callback) {
                $http.post('https://localhost:9000/1.0/networks').success(function (data) {
                    callback(data);
                });
            }

            // Modify network:
            obj.modify = function (networkName, networkData, callback) {
                $http.put('https://localhost:9000/1.0/networks/' + networkName).success(function (data) {
                    callback(data);
                });
            }

            return obj;
        }])
;
