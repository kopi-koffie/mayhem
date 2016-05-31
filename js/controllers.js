

angular.module('starter.controllers', [])

.controller('AirportCtrl', ['$scope','$firebaseObject','$firebase','$uibModal','$stateParams',function($scope,$firebaseObject,$firebase,$uibModal,$stateParams) {
  firebase.database().ref('airports').on('value', function(snapshot) {
      $scope.airports = snapshot.val();
  });
  $scope.animationsEnabled = true;
    $scope.open = function (size) {

      modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'airport_modal.html',
        size: size,
        controller : 'AirportCtrl'
      });

      modalInstance.result.then(function (selectedAirport) {
        firebase.database().ref('airports/' + $stateParams.airportId ).once('value', function(snapshot) {
               $scope.airport = snapshot.val();
         });
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.add = function(){
      console.log($scope.airport);
      firebase.database().ref('airports/' + $scope.airport.iata).set({
          name: $scope.airport.name,
          iata: $scope.airport.iata.toUpperCase(),
          icao: $scope.airport.icao.toUpperCase(),
        }).then(function(data){
            console.log(data);
            modalInstance.close($scope.airport);

        });
    }

    $scope.ok = function () {
      modalInstance.close($scope.airport);
    };

    $scope.cancel = function () {
      modalInstance.dismiss('cancel');
    };


}]);
