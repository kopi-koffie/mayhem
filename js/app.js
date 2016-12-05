angular.module('starter', ['ui.router','starter.controllers','firebase','mayhem'])
.run(function($mayhem,$rootScope){
  mayhem = new $mayhem(firebase.database().ref(), null); // databaseUrl = firebase.database().ref()

  // initialize airport list
  firebase.database().ref('airports').on('value', function(snapshot) {
    $rootScope.airports = snapshot.val();
  });

  // initialize flight list
  firebase.database().ref('flights').on('value', function(snapshot) {
      $rootScope.flights = snapshot.val();
  });

  // initialize route list
  firebase.database().ref('routes').on('value', function(snapshot) {
      $rootScope.routes = snapshot.val();
  });

  // initialize schedule list
  firebase.database().ref('schedule').on('value', function(snapshot) {
      $rootScope.schedule = snapshot.val();
  });

  // initialize aircrafts list
  firebase.database().ref('aircrafts').on('value', function(snapshot) {
      $rootScope.aircrafts = snapshot.val();
  });

})

.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('airports', {
    url: '/airports',
    views:{
      'view' : {
          templateUrl: 'partial/airports.html',
          controller: 'AirportCtrl'
      }
    },
  })
  .state('dashboard', {
    url: '/dashboard',
    views:{
      'view' : {
          templateUrl: 'partial/dashboard.html',
          controller: 'DashboardCtrl'
      }
    },
  })
  .state('flights', {
    url: '/flights',
    views:{
      'view' : {
          templateUrl: 'partial/flights.html',
          controller: 'FlightCtrl'
      }
    },
  })
  .state('routes', {
    url: '/routes',
    views:{
      'view' : {
          templateUrl: 'partial/routes.html',
          controller: 'RouteCtrl'
      }
    },
  })
  .state('schedule', {
    url: '/schedule',
    views:{
      'view' : {
          templateUrl: 'partial/schedule.html',
          controller: 'ScheduleCtrl'
      }
    },
  })

  .state('aircrafts', {
    url: '/aircrafts',
    views:{
      'view' : {
          templateUrl: 'partial/aircrafts.html',
          controller: 'AirCraftCtrl'
      }
    },
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dashboard');

}]);
