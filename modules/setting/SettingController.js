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
            }
        })
        ;
    }])


    .controller('settingListCtrl', [
	'$http', '$scope', '$routeParams', '$route', '$filter', '$location', '$uibModal', '$window', 'SettingServices', 'myconfig',
	function ($httpProvider, $scope, $routeParams, $route, $filter, $location, $uibModal, $window,
                                             SettingServices, myconfig)
    {
        $scope.myconfig = myconfig;
        $scope.test = {};
        $scope.testUrl = SettingServices.getLxdApiUrl();

        // Try to get config
        SettingServices.getConfig().then(function(data) {
            $scope.config = data.data.metadata;
        }, function(error) {
            $scope.errMsg = "Could not get config from server: " + SettingServices.getLxdUrl();
        });

        $scope.toggle_credentials = function() {
            $httpProvider.defaults.withCredentials = $scope.myconfig.xhr_with_credentials;
            $scope.save();
        };

        $scope.save = function() {
            SettingServices.setMyCfg($scope.myconfig);
            $route.reload();
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
    }]);
