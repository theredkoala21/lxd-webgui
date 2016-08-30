'use strict';

angular.module('myApp.remoteimage')
    .factory('RemoteimageServices', ['$http', '$q', '$cacheFactory',
        function ($http, $q, $cacheFactory) {
            var obj = {};

            obj.convertDate = function(dd) {
                var y = dd.substring(0, 4);
                var m = dd.substring(4, 6);
                var d = dd.substring(6, 8);

                var compatibleDate = y + "-" + m + "-" + d;
                var nativeTime = Date.parse(compatibleDate);

                return nativeTime;
            }


            // I'm not proud of this
            obj.downloadRemoteimageListImages = function() {
                var url = "https://images.linuxcontainers.org/";

                return $http.get("https://images.linuxcontainers.org/1.0/images", {withCredentials:false, cache: true}).then(function(data) {

                    var promises = data.data.metadata.map(function(imageUrl) {
                        return $http.get(url + imageUrl, {withCredentials: false, cache: true}).then(function(resp) {
                            resp.data.metadata.source = 'images';
                            resp.data.metadata.sourceUrl = url;
                            resp.data.metadata.sourceProto = 'lxd';
                            return resp.data.metadata;
                        });
                    });

                    return $q.all(promises).then(function(data) {
                        var ret = [];
                        var res = {};

                        // Create hashmap of all the returned linux distris
                        for(var n=0; n<data.length; n++) {
                            var i = data[n];

                            if (! res[i.properties.distribution]) {
                                res[i.properties.distribution] = {};
                            }
                            if (! res[i.properties.distribution][i.properties.release]) {
                                res[i.properties.distribution][i.properties.release] = {};
                            }
                            if (! res[i.properties.distribution][i.properties.release][i.properties.architecture]) {
                                res[i.properties.distribution][i.properties.release][i.properties.architecture] = {};
                            }

                            var dd = i.properties.build.split("_")[0];
                            var nativeDate = obj.convertDate(dd);

                            if (! res[i.properties.distribution][i.properties.release][i.properties.architecture].date) {
                                res[i.properties.distribution][i.properties.release][i.properties.architecture].date = nativeDate;
                                res[i.properties.distribution][i.properties.release][i.properties.architecture].data = i;
                            } else {
                                if (nativeDate > res[i.properties.distribution][i.properties.release][i.properties.architecture].date) {
                                    res[i.properties.distribution][i.properties.release][i.properties.architecture].date = nativeDate;
                                    res[i.properties.distribution][i.properties.release][i.properties.architecture].data = i;
                                }
                            }
                        }

                        // Extract the one's inserted
                        for(var distribution in res) {
                            for (var release in res[distribution]) {
                                for (var architecture in res[distribution][release]) {
                                    ret.push(res[distribution][release][architecture].data);
                                }
                            }
                        }

                        //return data;
                        return ret;
                    });
                });
            }


            obj.downloadRemoteimageListImages_bak = function() {
                return $http.get("/data/index-user.txt", {cache: true}).then(function(data) {
                    var baseUrl = "https://images.linuxcontainers.org/";
                    var baseImageName = "rootfs.tar.xz";

                    data = data.data;

                    var results = [];
                    var dataArr = data.split('\n');
                    dataArr.forEach(function(line) {
                        var entry = line.split(";");
                        if (entry.length == 6) {
                            var entryHash = {
                                source: 'images',
                                os: entry[0],
                                release: entry[1],
                                arch: entry[2],
                                unkown: entry[3],
                                date: entry[4],
                                path: entry[5],
                                url: baseUrl + entry[5] + baseImageName,
                                pubname: entry[0] + " " + entry[1] + " / " + entry[4],
                            }

                            results.push(entryHash);
                        }
                    });

                    return results;
                })
            }

            obj.downloadRemoteimageListUbuntu = function () {
                return $http.get("/data/ubuntudata.json", {cache: true}).then(function (data) {
                    var results = [];

                    var baseUrl = "https://cloud-images.ubuntu.com/releases/";

                    data = data.data;

                    // Inefficient implementation of parsing the strem data
                    for (var product in data.products) {
                        var productData = data.products[product];

                        //  "com.ubuntu.cloud:server:15.04:armhf": {
                        for (var shortdesc in productData) {
                            var shortData = productData[shortdesc];

                            var newestVersion = 0;
                            var newestVersionData = null;

                            //    "versions": {
                            for (var version in shortData) {
                                // "20150325": {
                                var versionData = shortData[version];

                                if (versionData.items == undefined) {
                                    continue;
                                }

                                //      "items": {
                                for (var item in versionData.items) {
                                    if (item == "lxd.tar.xz") {
                                        var dd = "";
                                        if (version.indexOf(".") > -1) {
                                            dd = version.split(".")[0];
                                        } else {
                                            dd = version;
                                        }


                                        var nativeTime = obj.convertDate(dd);
                                        /*
                                         var y = dd.substring(0, 4);
                                         var m = dd.substring(4, 6);
                                         var d = dd.substring(6, 8);

                                         var compatibleDate = y + "-" + m + "-" + d;
                                         var nativeTime = Date.parse(compatibleDate);
                                         */

                                        var itemData = versionData.items[item];

                                        var entry = {
                                            sourceUrl: baseUrl,
                                            sourceProto: 'simplestreams',
                                            source: 'ubuntu',
                                            os: "ubuntu",
                                            arch: productData.arch,
                                            release_title: productData.release_title,
                                            release_codename: productData.release_codename,
                                            release: productData.release,
                                            version: productData.version,
                                            product: product,
                                            size: itemData.size,
                                            path: itemData.path,
                                            url: baseUrl + itemData.path,
                                            sha256: itemData.sha256,
                                            pubname: versionData.pubname,
                                            combined_sha256: itemData.combined_sha256,

                                            // compatibility
                                            fingerprint: itemData.combined_sha256,
                                            architecture: productData.arch,
                                            properties: {
                                                description: "Ubuntu " + productData.release_title + " " + productData.release_codename + " (" + productData.release + ')',
                                            }
                                        }

                                        if (nativeTime > newestVersion) {
                                            newestVersion = nativeTime;
                                            newestVersionData = entry;
                                        }

                                        //results.push(entry);
                                    }
                                }

                            }

                            if (newestVersion > 0) {
                                results.push(newestVersionData);
                            }
                        }
                    }

                    data = results;

                    return data;
                })

            }


            obj.cacheData = {
                isCached: false,
            };


            obj.checkFilter = function(result, filter) {
                if (filter.search) {
                    if (result.properties.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1) {
                        if (filter.architecture) {
                            if (result.architecture == filter.architecture) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                } else {
                    if (filter.architecture) {
                        if (result.architecture == filter.architecture) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }

                return false;
            }


            obj.getByFilter = function(filter) {
                //return obj.getAll();

                return obj.getAll().then(function(data) {
                    if ( _.isEmpty(filter)) {
                        return data;
                    }

                    var d = $q.defer();

                    var results = [];

                    for(var n=0; n<2; n++) {
                        // wow this is fugly
                        data[n].forEach(function(result) {
                            if (obj.checkFilter(result, filter)) {
                                results.push(result);
                            }
                        });
                    }

                    d.resolve([ results ]);

                    return d.promise;
                });
            }


            obj.getAll = function() {
                if (obj.cacheData.isCached == true) {
                    console.log("cached");
                    return obj.cacheData.p;
                } else {
                    console.log("not cached");
                    var requests = [];

                    requests.push(obj.downloadRemoteimageListUbuntu());
                    requests.push(obj.downloadRemoteimageListImages());

                    var p =  $q.all(requests);

                    obj.cacheData.p = p;
                    obj.cacheData.isCached = true;

                    return p;
                }

            }

            return obj;
        }])
;
