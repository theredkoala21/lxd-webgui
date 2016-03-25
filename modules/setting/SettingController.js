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


    .controller('settingListCtrl', function ($scope, $routeParams, $filter, $location, $uibModal,
                                             SettingServices, myconfig, config)
    {
      $scope.myconfig = myconfig;
      $scope.config = config.data.metadata;

      $scope.save = function() {
        SettingServices.setMyCfg($scope.myconfig);
      }
    })

;
