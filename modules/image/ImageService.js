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


                obj.addRemoteImage = function(url) {
                    var data = {
                        "public": true,
                        "source": {
                            "type": "url",
                            "url": url
                        }
                    };

                    $http.post('https://localhost:9000/1.0/images', data).then(function(data) {
                        var opUrl = data.data.operation;
                        $http.get('https://localhost:9000' + opUrl);
                    });
                }


                obj.addSourceImageRepo = function(remoteimage) {
                    var data = {
                    "public": true,                         //# Whether the image can be downloaded by untrusted users (defaults to false)
//                    "auto_update": true,                    //# Whether the image should be auto-updated (optional; defaults to false)
                    "source": {
                        "type": "image",
                        "mode": "pull",                     //# Only pull is supported for now
                        "server": remoteimage.sourceUrl,  //# Remote server (pull mode only)
                        "protocol": remoteimage.sourceProto,                  //# Protocol (one of lxd or simplestreams, defaults to lxd)
                        "fingerprint": remoteimage.fingerprint,            //# Fingerprint of the image (must be set if alias isn't)
//                        "alias": "ubuntu/devel",            //# Name of the alias (must be set if fingerprint isn't)
                        }
                    }

                    console.log("A :" + JSON.stringify(remoteimage));

                    $http.post('https://localhost:9000/1.0/images', data).then(function(data) {
                        var opUrl = data.data.operation;
                        $http.get('https://localhost:9000' + opUrl);
                    });
                }


                obj.addSourceImage = function(fingerprint) {
                    var data = {
                    "public": true,                         //# Whether the image can be downloaded by untrusted users (defaults to false)
//                    "auto_update": true,                    //# Whether the image should be auto-updated (optional; defaults to false)
                    "source": {
                        "type": "image",
                        "mode": "pull",                     //# Only pull is supported for now
                        "server": "https://cloud-images.ubuntu.com/releases",  //# Remote server (pull mode only)
                        "protocol": "simplestreams",                  //# Protocol (one of lxd or simplestreams, defaults to lxd)
                        "fingerprint": fingerprint,            //# Fingerprint of the image (must be set if alias isn't)
//                        "alias": "ubuntu/devel",            //# Name of the alias (must be set if fingerprint isn't)
                        }
                    }

                    $http.post('https://localhost:9000/1.0/images', data).then(function(data) {
                        var opUrl = data.data.operation;
                        $http.get('https://localhost:9000' + opUrl);
                    });
                }



                obj.addSourceImage2 = function(fingerprint) {
                  console.log("New2");
                    var data = {
                    "public": true,                         //# Whether the image can be downloaded by untrusted users (defaults to false)
//                    "auto_update": true,                    //# Whether the image should be auto-updated (optional; defaults to false)
                    "source": {
                        "type": "image",
                        "mode": "pull",                     //# Only pull is supported for now
                        "server": "https://images.linuxcontainers.org/",  //# Remote server (pull mode only)
                        "protocol": "lxd",                  //# Protocol (one of lxd or simplestreams, defaults to lxd)
                        "fingerprint": "76c57848218b",            //# Fingerprint of the image (must be set if alias isn't)
                        //"alias": "ubuntu/devel",            //# Name of the alias (must be set if fingerprint isn't)
                        }
                    }

                    $http.post('https://localhost:9000/1.0/images', data).then(function(data) {
                        var opUrl = data.data.operation;
                        $http.get('https://localhost:9000' + opUrl);
                    });
                }


                return obj;
            }])
;
