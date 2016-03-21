'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngTable',
  'ui.select',
  'ui.bootstrap',
  'ngSanitize',

  'myApp.container',
  'myApp.image',
  'myApp.remoteimage',
  'myApp.network',
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
