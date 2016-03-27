'use strict';

angular.module('myApp.profile', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/profiles', {
            title: 'Profiles',
            templateUrl: 'modules/profile/profiles.html',
            controller: 'profileListCtrl',
            resolve: {
                profiles: function (ProfileServices, $route) {
                    return ProfileServices.getAll();
                }
            }
        })
        .when('/profile-view/:profileID', {
            title: 'Profiles',
            templateUrl: 'modules/profile/profile-view.html',
            controller: 'profileViewCtrl',
            resolve: {
                profile: function (ProfileServices, $route) {
                    return ProfileServices.getByFingerprint($route.current.params.profileID)
                }
            }
        })
        .when('/profile-add-remote', {
            title: 'Profiles',
            templateUrl: 'modules/profile/profile-add-remote.html',
            controller: 'profileAddRemoteCtrl',
            resolve: {}
        })
        ;
    }])


    .controller('profileViewCtrl', function ($scope, $routeParams, $filter, $location, profile, ProfileServices) {
        $scope.profile = profile.data.metadata;
    })

    .controller('profileListCtrl', function ($scope, $routeParams, $filter, $location, $uibModal,
                                           ProfileServices, profiles) {
        $scope.profiles = profiles;

        $scope.delete = function(profile) {

          // Create modal
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/profile/modalDelProfile.html',
              controller: 'genericProfileModalCtrl',
              size: 'md',
              resolve: {
                profile: function () {
                    return profile;
                }
              }
          });

          // Handle modal answer
          modalInstance.result.then(function (container) {
            ProfileServices.delete(container).then(function(data) {
              ProfileServices.getAll().then(function(data) {
                $scope.profiles = data;
              })
            });
          }, function () {
            // Nothing
          });
      }
    })


    .controller('genericProfileModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       profile, ProfileServices) {
        $scope.profile = profile;

        $scope.ok = function () {
            $uibModalInstance.close($scope.profile);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('profileAddRemoteCtrl', function ($scope, $routeParams, $filter, $location, ProfileServices) {
        $scope.addRemoteProfile = function () {
            ProfileServices.addRemoteProfile($scope.url);
        }

        $scope.addSourceProfile = function () {
            ProfileServices.addSourceProfile2();
        }
    })
;
