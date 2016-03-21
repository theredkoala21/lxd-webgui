'use strict';

angular.module('myApp.remoteimage')
    .factory('RemoteimageServices', ['$http', '$q',
        function ($http, $q) {
            var obj = {};

            obj.downloadRemoteimageList = function () {
                return $http.get("/data/ubuntudata.json").then(function (data) {
                    console.log("B");

                    var results = [];

                    data = data.data;

                    // Inefficient implementation of parsing the strem data
                    for (var product in data.products) {
                        var productData = data.products[product];

                        //console.log("A: " + productData.arch);

                        for (var shortdesc in productData) {
                            var shortData = productData[shortdesc];

                            for (var version in shortData) {
                                var versionData = shortData[version];

                                for (var item in versionData.items) {
                                    if (item == "lxd.tar.xz") {
                                        var itemData = versionData.items[item];

                                        var entry = {
                                            arch: productData.arch,
                                            release_title: productData.release_title,
                                            release_codename: productData.release_codename,
                                            release: productData.release,
                                            version: productData.version,
                                            product: product,
                                            size: itemData.size,
                                            path: itemData.path,
                                            sha256: itemData.sha256,
                                            pubname: versionData.pubname,
                                            combined_sha256: itemData.combined_sha256,
                                        }

                                        results.push(entry);
                                    }
                                }
                            }
                        }
                    }

                    data = results;

                    return data;
                })

            }


            return obj;
        }])
;
