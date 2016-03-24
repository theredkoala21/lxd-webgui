'use strict';

angular.module('myApp.remoteimage')
    .factory('RemoteimageServices', ['$http', '$q', '$cacheFactory',
        function ($http, $q, $cacheFactory) {
            var obj = {};

            obj.downloadRemoteimageListImages = function() {
              var url = "https://images.linuxcontainers.org/";

              return $http.get("https://images.linuxcontainers.org/1.0/images", {cache: true}).then(function(data) {

                var promises = data.data.metadata.map(function(imageUrl) {
                    return $http.get(url + imageUrl, {cache: true}).then(function(resp) {
                      resp.data.metadata.source = 'images';
                      resp.data.metadata.sourceUrl = url;
                      resp.data.metadata.sourceProto = 'lxd';
                      return resp.data.metadata;
                    });
                });

                return $q.all(promises);
              })
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

                        for (var shortdesc in productData) {
                            var shortData = productData[shortdesc];

                            for (var version in shortData) {
                                var versionData = shortData[version];

                                for (var item in versionData.items) {
                                    if (item == "lxd.tar.xz") {
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
                                              description: productData.release_title + " " + productData.release_codename + " " + productData.release,
                                            }
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


            obj.cacheData = {
              isCached: false,
            };


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
                    if (filter.search) {
                       if (result.properties.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1) {
                         if (filter.architecture) {
                           if (result.architecture == filter.architecture) {
                             results.push(result);
                           }
                         } else {
                           results.push(result);
                         }
                       }
                    } else {
                      if (filter.architecture) {
                        if (result.architecture == filter.architecture) {
                          results.push(result);
                        }
                      } else {
                        results.push(result);
                      }
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
