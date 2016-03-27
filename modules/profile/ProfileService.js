'use strict';

angular.module('myApp.profile')
        .factory('ProfileServices', ['$http', '$q', 'SettingServices',
            function ($http, $q, SettingServices) {
              var obj = {};

                // Get a Profile
                obj.getByFingerprint =  function (profileFingerprint) {
                  return $http.get(SettingServices.getLxdApiUrl() + '/profiles/' + profileFingerprint)
                  .then(function(data) {
                    //data.data = data.data.metadata;
                    return data;
                  });
                }

                // Get a profile
                obj.get = function (profileName) {
                    return $http.get(SettingServices.getLxdApiUrl() + '/profiles/' + profileName);
                }

                // Get a profile
                obj.getByUrl = function (profileUrl) {
                    return $http.get(SettingServices.getLxdUrl() + profileUrl);
                }

                // Get all profiles
                obj.getAll = function() {
                    return $http.get(SettingServices.getLxdApiUrl() + '/profiles').then(function (data) {
                      data = data.data;

                      if (data.status != "Success") {
                        return $q.reject("Error");
                      }

                      var promises = data.metadata.map(function(profileUrl) {
                          return $http.get(SettingServices.getLxdUrl() + profileUrl).then(function(resp) {
                              return resp.data.metadata;
                          });
                      });

                      return $q.all(promises);
                    });
                }


                // Modify profile:
                obj.modify = function(profileName, profileData, callback) {
                  $http.put(SettingServices.getLxdApiUrl() + '/profiles/' + profileName).success(function(data) {
                    callback(data);
                  });
                }

                obj.delete = function(container) {
                  return $http.delete(SettingServices.getLxdApiUrl() + '/profiles/' + container.fingerprint);
                }


                return obj;
            }])
;
