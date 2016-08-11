'use strict';

angular.module('chatApp', [
  'ngResource',
  'ngRoute',
  'btford.socket-io',
  'ngStorage'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .when('/chat', {
        templateUrl: '/views/partials/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: '/views/partials/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/chat'
      });


    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (!Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });
