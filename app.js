'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngTable',
  'ui.select',
  'ui.bootstrap',
  'ngSanitize',

  'autoActive',

  'myApp.container',
  'myApp.image',
  'myApp.remoteimage',
  'myApp.network',
  'myApp.operation',
  'myApp.terminal',
  'myApp.setting',
  'myApp.profile'
]).

config(['$routeProvider', '$httpProvider', '$locationProvider', 'SettingServicesProvider', function($routeProvider, $httpProvider, $locationProvider, SettingServicesProvider) {
  $httpProvider.defaults.withCredentials = SettingServicesProvider.$get().getMyCfg()["xhr_with_credentials"];
  $routeProvider.otherwise({redirectTo: '/settings'});

  $locationProvider.hashPrefix('');
}]);


// To highlight current menu entry
// Source: http://stackoverflow.com/questions/12592472/how-to-highlight-a-current-menu-item
angular.module('autoActive', [])
        .directive('autoActive', ['$location', function ($location) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element) {
                function setActive() {
                    var path = $location.path();
                    if (path) {
                        angular.forEach(element.find('li'), function (li) {
                            var anchor = li.querySelector('a');
                            if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                                angular.element(li).addClass('active');
                            } else {
                                angular.element(li).removeClass('active');
                            }
                        });
                    }
                }

                setActive();

                scope.$on('$locationChangeSuccess', setActive);
            }
        }
    }]);
