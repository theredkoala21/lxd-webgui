'use strict';

angular.module('myApp.image')
    .factory('ImageServices', ['$http', '$q', 'SettingServices',
        function ($http, $q, SettingServices) {
            var obj = {};

            // Get a Image
            obj.getByFingerprint =  function (imageFingerprint) {
                return $http.get(SettingServices.getLxdApiUrl() + '/images/' + imageFingerprint)
                    .then(function(data) {
                        //data.data = data.data.metadata;
                        return data;
                    });
            }

            // Get a image
            obj.get = function (imageName) {
                return $http.get(SettingServices.getLxdApiUrl() + '/images/' + imageName);
            }

            // Get a image
            obj.getByUrl = function (imageUrl) {
                return $http.get(SettingServices.getLxdUrl() + imageUrl);
            }

            // Get all images
            obj.getAll = function() {
                return $http.get(SettingServices.getLxdApiUrl() + '/images').then(function (data) {
                    data = data.data;

                    if (data.status != "Success") {
                        return $q.reject("Error");
                    }

                    var promises = data.metadata.map(function(imageUrl) {
                        return $http.get(SettingServices.getLxdUrl() + imageUrl).then(function(resp) {
                            return resp.data.metadata;
                        });
                    });

                    return $q.all(promises);
                });
            }


            // Modify image:
            obj.modify = function(imageName, imageData, callback) {
                $http.put(SettingServices.getLxdApiUrl() + '/images/' + imageName).success(function(data) {
                    callback(data);
                });
            }


            obj.delete = function(container) {
                return $http.delete(SettingServices.getLxdApiUrl() + '/images/' + container.fingerprint);
            }


            // Alias
            obj.renameAlias = function(origAlias, newAlias) {
                var postData = {
                    "name": newAlias.name,
                };

                // sync
                return $http.post(SettingServices.getLxdApiUrl() + '/images/aliases/' + origAlias.name, postData);
            }


            // Alias
            obj.addAlias = function(image, alias) {
                var postData = {
                    description: alias.description,
                    name: alias.name,
                    target: image.fingerprint,
                };

                // sync
                return $http.post(SettingServices.getLxdApiUrl() + '/images/aliases', postData);
            }


            // Alias
            obj.removeAlias = function(alias) {
                // sync
                return $http.delete(SettingServices.getLxdApiUrl() + '/images/aliases/' + alias.name);
            }


            obj.addRemoteImage = function(url) {
                var data = {
                    "public": true,
                    "source": {
                        "type": "url",
                        "url": url
                    }
                };

                $http.post(SettingServices.getLxdApiUrl() + '/images', data).then(function(data) {
                    var opUrl = data.data.operation;
                    $http.get(SettingServices.getLxdUrl() + opUrl);
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

                return $http.post(SettingServices.getLxdApiUrl() + '/images', data).then(function(data) {
                    var opUrl = data.data.operation;
                    return $http.get(SettingServices.getLxdUrl() + opUrl).then(function(data) {
                        return data;
                    });
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

                $http.post(SettingServices.getLxdApiUrl() + '/images', data).then(function(data) {
                    var opUrl = data.data.operation;
                    $http.get(SettingServices.getLxdUrl() + opUrl);
                });
            }



            obj.addSourceImage2 = function(fingerprint) {
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

                $http.post(SettingServices.getLxdApiUrl() + '/images', data).then(function(data) {
                    var opUrl = data.data.operation;
                    $http.get(SettingServices.getLxdUrl() + opUrl);
                });
            }


            return obj;
        }])
;
