'use strict';

angular.module('myApp.setting', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/settings', {
            title: 'Settings',
            templateUrl: 'modules/setting/settings.html',
            controller: 'settingListCtrl',
            resolve: {
              myconfig: function(SettingServices, $route) {
                return SettingServices.getMyCfg();
              },
              config: function(SettingServices, $route) {
                return SettingServices.getConfig();
              }
            }
        })
        ;
    }])


    .controller('settingListCtrl', function ($scope, $routeParams, $filter, $location, $uibModal, $window,
                                             SettingServices, myconfig, config)
    {
      $scope.myconfig = myconfig;
      $scope.config = config.data.metadata;
      $scope.test = {};
      $scope.testUrl = SettingServices.getLxdApiUrl();

      $scope.save = function() {
        SettingServices.setMyCfg($scope.myconfig);
      }

      $scope.testLxd = function() {
        SettingServices.testLxd().then(function(data) {
          $scope.test.lxd = "Success";
        }, function(error) {
          $scope.test.lxd = "Fail";
        })
      }

      $scope.testLxdAuth = function() {
        SettingServices.testLxdAuth().then(function(data) {
          $scope.test.lxdAuth = "Auth Success";
        }, function(error) {
          $scope.test.lxdAuth = "Auth Fail";
        })
      }

      $scope.openTab = function() {
        $window.open($scope.testUrl, '_blank');
      }
    })

;
