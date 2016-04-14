'use strict';

angular.module('myApp.container', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containers', {
            title: 'Containers',
            templateUrl: 'modules/container/containers.html',
            controller: 'containerListCtrl',
            resolve: {
                containers: function (ContainerServices) {
                    return ContainerServices.getAll();
                }
            }
        })
        .when('/container-create', {
            title: 'Containers',
            templateUrl: 'modules/container/container-create.html',
            controller: 'containerCreateCtrl',
            resolve: {
                images: function (ImageServices, $route) {
                    return ImageServices.getAll();
                },
                profiles: function(ProfileServices) {
                    return ProfileServices.getAll();
                },
            }
        })
        .when('/container-view/:containerName', {
            title: 'Container',
            templateUrl: 'modules/container/container-view.html',
            controller: 'containerViewCtrl',
            resolve: {
                containerState: function (ContainerServices, $route) {
                    return ContainerServices.getState($route.current.params.containerName)
                },
                container: function (ContainerServices, $route) {
                    return ContainerServices.getByName($route.current.params.containerName)
                }
            }
        })
        .when('/container-snapshots/:containerName', {
            title: 'Container',
            templateUrl: 'modules/container/container-snapshots.html',
            controller: 'containerSnapshotCtrl',
            resolve: {
                snapshots: function (ContainerServices, $route) {
                  return ContainerServices.getSnapshots($route.current.params.containerName)
                },
                container: function(ContainerServices, $route) {
                  return ContainerServices.getByName($route.current.params.containerName)
                }
            }
        })
        .when('/container-edit/:containerName', {
            title: 'Container',
            templateUrl: 'modules/container/container-edit.html',
            controller: 'containerViewCtrl',
            resolve: {
                containerState: function (ContainerServices, $route) {
                    return ContainerServices.getState($route.current.params.containerName)
                },
                container: function (ContainerServices, $route) {
                    return ContainerServices.getByName($route.current.params.containerName)
                }
            }
        })
        ;
    }])


    .controller('containerViewCtrl', function ($scope, $routeParams, $filter, $location, $uibModal, $route,
                                               containerState, container, ContainerServices) {
        $scope.container = container.data.metadata;
        $scope.container.state = containerState.data.metadata;

        $scope.changeState = function (container, state) {
            ContainerServices.changeState(container.name, state);
        }

        $scope.openEditNameDialog = function (container) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/container/modalEditName.html',
                controller: 'genericContainerModalCtrl',
                size: 'sm',
                resolve: {
                    container: function () {
                        return angular.copy($scope.container);
                    }
                }
            });

            modalInstance.result.then(function (newContainer) {
                var newName = {name: newContainer.name};
                // rename
                ContainerServices.rename(container.name, newName).then(function (data) {
                    // Move to main because location has changed
                    $location.url("/containers/");
                });
            }, function () {
                // Nothing
            });
        }
    })


    .controller('genericContainerModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       container, ContainerServices) {
        $scope.container = container;

        $scope.ok = function () {
            $uibModalInstance.close($scope.container);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('containerListCtrl', function ($scope, $routeParams, $filter, $location, $uibModal, $interval,
                                               ContainerServices, TerminalServices, SettingServices, containers) {
        $scope.containers = containers;

        $scope.changeState = function (container, state) {
            ContainerServices.changeState(container.name, state).then(function(data) {
              var operationUrl = data.data.operation;
              var refreshInterval;

              // Try until operation is finished
              refreshInterval = $interval(
                function() {
                  ContainerServices.isOperationFinished(operationUrl).then(function(data) {
                    // I dont really care if the operation is still runnging
                  }, function(error) {
                    // Operation returned 404, so its finished
                    $interval.cancel(refreshInterval);
                    ContainerServices.getByName(container.name).then(function(data) {

                      //_.findWhere($scope.containers, { name: container.name}) = data.data.metadata;
                      for(var n=0; n<$scope.containers.length; n++) {
                        if ($scope.containers[n].name == container.name) {
                          $scope.containers[n] = data.data.metadata;
                        }
                      }
                    });
                  });
                }, 1000
              );

            });
        }


        $scope.delete = function (container) {
          // Create modal
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/container/modalDelContainer.html',
              controller: 'genericContainerModalCtrl',
              size: 'sm',
              resolve: {
                container: function () {
                    return container;
                }
              }
          });

          // Handle modal answer
          modalInstance.result.then(function (container) {
             ContainerServices.delete(container.name);
          }, function () {
            // Nothing
          });
        }


        $scope.showTerminal = function(container) {
          if (container.isTerminalShown) {
            container.terminal.destroy();
            container.isTerminalShown = false;
            return;
          }

          container.isTerminalShown = true;

          TerminalServices.getTerminal2(container.name).then(function(term) {
            container.terminal = term;
            term.open(document.getElementById('console' + container.name));
          });
        }
    })


    .controller('containerCreateCtrl', function ($scope, $routeParams, $filter, $location,
                                                 ContainerServices, ImageServices, profiles, images) {
        $scope.containerName = "";

        $scope.selectedImage = null;
        $scope.images = images;

        $scope.profiles = profiles;
        $scope.selected = {
          profile: _.findWhere(profiles, { name: "default"} ),
          ephemeral: false,
        }


        $scope.setImage = function (image) {
            $scope.selectedImage = image;
        }

        $scope.createContainer = function (isValid) {
          $scope.isSubmitted = true;

          if (isValid) {
            ContainerServices.create(
                $scope.containerName,
                $scope.selected.image.fingerprint,
                $scope.selected.profile.name,
                $scope.selected.ephemeral)
                .then(function(data) {
                  window.location = "#/containers";
                }, function(error) {
                  var errorMsg = error.error;
                  console.log("Error: " + errorMsg);
                });
          }

        }
    })



    .controller('containerSnapshotCtrl', function ($scope, $routeParams, $filter, $location, $uibModal,
                                                 ContainerServices, snapshots, container) {
        $scope.snapshots = snapshots;
        $scope.container = container.data.metadata;

        $scope.restore = function(snapshot) {
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/container/modalSnapshotRestore.html',
              controller: 'containerSnapshotRestoreModalCtrl',
              size: 'md',
              resolve: {
                  container: function () {
                      return $scope.container;
                  },
                  snapshot: function() {
                    return snapshot;
                  }
              }
          });

          modalInstance.result.then(function (snapshotData) {
              ContainerServices.restoreSnapshot($scope.container.name, snapshot.name).then(function(data) {

              });
          }, function () {
              // Nothing
          });
        }

        $scope.delete = function(snapshot) {

        }

        $scope.createSnapshot = function() {
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/container/modalSnapshotCreate.html',
              controller: 'containerSnapshotCreateModalCtrl',
              size: 'md',
              resolve: {
                  container: function () {
                      return $scope.container;
                  }
              }
          });

          modalInstance.result.then(function (snapshotData) {
              ContainerServices.createSnapshot($scope.container.name, snapshotData).then(function (data) {
                  ContainerServices.getSnapshots().then(function(data) {
                    $scope.snapshots = data;
                  });
              });
          }, function () {
              // Nothing
          });

        }
    })


    .controller('containerSnapshotCreateModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       container, ContainerServices) {
        $scope.container = container;

        $scope.snapshotData = {
          name: "",
          stateful: true
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.snapshotData);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('containerSnapshotRestoreModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       container, snapshot, ContainerServices) {
        $scope.container = container;
        $scope.snapshot = snapshot;

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

;
