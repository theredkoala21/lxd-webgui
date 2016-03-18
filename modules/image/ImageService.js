'use strict';

angular.module('myApp.image')
        .factory('ImageServices', ['$http',
            function ($http) {
              var obj = {};

                // Get a container
                obj.get =  function (containerName, callback) {
                        $http.get('https://localhost:9000/1.0/containers/' + containerName).success(function (data) {
                            callback(data);
                        });
                    }

                    // Get a container
                obj.getByUrl = function (containerUrl, callback) {
                  // {"type":"sync","status":"Success","status_code":200,
                  // "metadata":{"aliases":[],"architecture":"x86_64","cached":true,"filename":"ubuntu-14.04-server-cloudimg-amd64-lxd.tar.xz","fingerprint":"75182b1241be475a64e68a518ce853e800e9b50397d2f152816c24f038c94d6e","properties":{"aliases":"14.04,default,lts,t,trusty","architecture":"amd64","description":"ubuntu 14.04 LTS amd64 (release) (20160314)","label":"release","os":"ubuntu","release":"trusty","serial":"20160314","version":"14.04"},"public":false,"size":123911460,"auto_update":true,"update_source":{"server":"https://cloud-images.ubuntu.com/releases","protocol":"simplestreams","certificate":"","alias":"14.04"},"created_at":"2016-03-14T00:00:00Z","expires_at":"2019-04-17T00:00:00Z","last_used_at":"2016-03-16T10:10:00.438346311Z","uploaded_at":"2016-03-16T09:43:18Z"}}

                        $http.get('https://localhost:9000' + containerUrl).success(function (data) {
                            callback(data);
                        });
                    }


                    // Get all containers
                obj.getAll = function(callback) {
                        $http.get('https://localhost:9000/1.0/images').success(function (data) {

                          if (data.status != "Success") {
                            console.log("Err");
                          }

                          var images = [];
                          for(var n=0; n < data.metadata.length; n++) {
                            var c = data.metadata[n];

                            obj.getByUrl(c, function(data2) {
                              images.push(data2.metadata);
                            });

                          }

                            callback(images);
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

                    return obj;
            }])
;
