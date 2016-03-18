'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngTable',
  'ui.select',
  'ngSanitize',
  'myApp.version',
  'myApp.container',
  'myApp.image',
  'myApp.network',

  'myApp.weakness',
  'myApp.localweakness',
  'myApp.topic'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
