'use strict';

angular.module('myApp.setting')
    .factory('SettingServices', ['$http', '$q', '$timeout',
        function ($http, $q, $timeout) {
            var obj = {};

            obj.getMyCfg = function() {
              var cfg = JSON.parse(localStorage.getItem('lxdcfg'));

              if (cfg == null) {
                // this is the default config
                cfg = {
                  lxdurl: 'localhost:9000',
                  xhr_with_credentials: true
                }

                obj.setMyCfg(cfg);
              }

              return cfg;
            }

            obj.setMyCfg = function(config) {
              localStorage.setItem('lxdcfg', JSON.stringify(config));
            }


            obj.getLxdUrl = function() {
              return 'https://' + obj.getMyCfg().lxdurl;
            }

            obj.getLxdApiUrl = function() {
              return 'https://' + obj.getMyCfg().lxdurl + '/1.0';
            }

            obj.getLxdWsUrl = function() {
              return 'wss://' + obj.getMyCfg().lxdurl;
            }


            obj.testLxd = function() {
              return $http.get(obj.getLxdApiUrl());
            }

            obj.testLxdAuth = function() {
              return $http.get(obj.getLxdApiUrl() + '/certificates');
            }


            obj.getConfig = function() {
                return $http.get(obj.getLxdUrl() + '/1.0');
            }

            return obj;
        }])
;
