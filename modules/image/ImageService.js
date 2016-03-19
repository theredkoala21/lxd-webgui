'use strict';

angular.module('myApp.image')
        .factory('ImageServices', ['$http', '$q',
            function ($http, $q) {
              var obj = {};

                // Get a Image
                obj.getByFingerprint =  function (imageFingerprint) {
                  return $http.get('https://localhost:9000/1.0/images/' + imageFingerprint)
                  .then(function(data) {
                    //data.data = data.data.metadata;
                    return data;
                  });
                }

                // Get a image
                obj.get = function (imageName) {
                    return $http.get('https://localhost:9000/1.0/images/' + imageName);
                }

                // Get a image
                obj.getByUrl = function (imageUrl) {
                    return $http.get('https://localhost:9000' + imageUrl);
                }

                // Get all images
                obj.getAll = function() {
                    return $http.get('https://localhost:9000/1.0/images').then(function (data) {
                      data = data.data;

                      if (data.status != "Success") {
                        return $q.reject("Error");
                      }

                      var promises = data.metadata.map(function(imageUrl) {
                          return $http.get('https://localhost:9000' + imageUrl).then(function(resp) {
                              return resp.data.metadata;
                          });
                      });

                      return $q.all(promises);
                    });
                }


                // Modify image:
                obj.modify = function(imageName, imageData, callback) {
                  $http.put('https://localhost:9000/1.0/images/' + imageName).success(function(data) {
                    callback(data);
                  });
                }

                return obj;
            }])
;
