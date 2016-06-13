angular.module('starter.controllers', ['ui.bootstrap','ngTouch','ngAnimate'])

.controller('AirportCtrl', ['$scope','$firebase','$uibModal','$stateParams',function($scope,$firebase,$uibModal,$stateParams) {

    firebase.database().ref('airports').on('value', function(snapshot) {
        $scope.airports = snapshot.val();
    });

    // oepn modal
    $scope.animationsEnabled = true;
    $scope.open = function (size) {
       modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'airport_modal.html',
            size: size,
            scope : $scope,
            controller : 'AirportCtrl'
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
            modalInstance.close();

        });
    };

    $scope.delete = function(airportId){
      firebase.database().ref('airports/' + airportId.toLowerCase()).remove().then(function(data){
            console.log(data);
            modalInstance.close();
        });
    };

    $scope.ok = function () {
      modalInstance.close($scope.airport);
    };

    $scope.cancel = function () {
      modalInstance.dismiss('cancel');
    };


}])

.controller('FlightCtrl', ['$scope','$firebase','$uibModal',function($scope,$firebase,$uibModal) {
  // firebase.database().ref('flights').on('value', function(snapshot) {
  //     $scope.flights = snapshot.val();
  // });
  console.log($scope.airports);

  // oepn modal
  $scope.animationsEnabled = true;
  $scope.open = function (size) {
     modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'flight_modal.html',
          size: size,
          scope : $scope,
          controller : 'FlightCtrl'
      });

      modalInstance.result.then(function () {
        //
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  };

  $scope.add = function(){
    console.log($scope.flight);
    firebase.database().ref('flights/' + $scope.flight.flight_number.replace(/\s+/g, '')).set({
        flight_number: $scope.flight.flight_number,
        origin: $scope.flight.selectedRoute.origin,
        destination: $scope.flight.selectedRoute.destination,
        departure : $scope.flight.departure,
        arrival : $scope.flight.arrival
      }).then(function(data){
          console.log(data);
          modalInstance.close();

      }),function(error){
        console.error(error);
      };
  };


  $scope.ok = function () {
    modalInstance.close($scope.airport);
  };

  $scope.cancel = function () {
    modalInstance.dismiss('cancel');
  };


}])

.controller('RouteCtrl', ['$scope','$firebase','$uibModal','$stateParams',function($scope,$firebase,$uibModal,$stateParams) {

    // oepn modal
    $scope.animationsEnabled = true;
    $scope.open = function (size) {
       modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'route_modal.html',
            size: size,
            scope : $scope,
            controller : 'RouteCtrl'
        });
    };

    $scope.add = function(){
      console.log($scope.route);

      firebase.database().ref('routes/'+ $scope.route.origin.icao + '-' + $scope.route.destination.icao).set({
          id :  $scope.route.origin.icao + '-' + $scope.route.destination.icao,
          origin: $scope.route.origin,
          destination: $scope.route.destination,
        }).then(function(data){
            console.log(data);
            modalInstance.close();

        });
    };

    $scope.delete = function(routeId){
      firebase.database().ref('routes/' + routeId).remove().then(function(data){
            console.log(data);
            modalInstance.close();
        });
    };

    $scope.ok = function () {
      modalInstance.close($scope.route);
    };

    $scope.cancel = function () {
      modalInstance.dismiss('cancel');
    };


}])

.controller('ScheduleCtrl', ['$scope','$firebase','$uibModal',function($scope,$firebase,$uibModal) {
          $('#external-events').on('DOMNodeInserted',function(){
            initializeExternalEvents();
          });
          var initializeExternalEvents = function()
          {
            /* initialize the external events
        		-----------------------------------------------------------------*/
            $('#external-events div.external-event').each(function() {

            			// store data so the calendar knows to render an event upon drop
            			$(this).data('event', {
            				title: $.trim($(this).text()), // use the element's text as the event title
            				stick: true // maintain when user navigates (see docs on the renderEvent method)
            			});

                  // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                  // it doesn't need to have a start or end
                  var eventObject = {
                      title: $.trim($(this).text()) // use the element's text as the event title
                  };

                  // store the Event Object in the DOM element so we can get to it later
                  $(this).data('eventObject', eventObject);

            			// make the event draggable using jQuery UI
            			$(this).draggable({
            				zIndex: 999,
            				revert: true,      // will cause the event to go back to its
            				revertDuration: 0  //  original position after the drag
            			});

    		    });

            $('#external-events div.btn-group li.external-event').each(function() {
  	             // store data so the calendar knows to render an event upon drop
            			$(this).data('event', {
            				title: $.trim($(this).text()), // use the element's text as the event title
            				stick: true // maintain when user navigates (see docs on the renderEvent method)
            			});

                  // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                  // it doesn't need to have a start or end
                  var eventObject = {
                      title: $.trim($(this).text()), // use the element's text as the event title
                      flight : $(this).data('flight')
                  };

                  // store the Event Object in the DOM element so we can get to it later
                  $(this).data('eventObject', eventObject);

            			// make the event draggable using jQuery UI
            			$(this).draggable({
            				zIndex: 999,
            				revert: true,      // will cause the event to go back to its
            				revertDuration: 0,  //  original position after the drag
                    helper : "clone",
                    snap : true
            			});

    		    });

          };

        /* initialize the calendar
         -----------------------------------------------------------------*/

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $('#schedule_calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function(date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
                console.log(copiedEventObject);
                $scope.schedule= {
                  date : new Date(date.year(),date.month(),date.date()),
                  flight_number :  copiedEventObject.title,
                  flight : copiedEventObject.flight
                };
                console.log($scope.schedule.flight);

                // open modal
                $scope.open('sm');


                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            },
            events: [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, 1)
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d-5),
                    end: new Date(y, m, d-2)
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: new Date(y, m, d-3, 16, 0),
                    allDay: false
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: new Date(y, m, d+4, 16, 0),
                    allDay: false
                },
                {
                    title: 'Meeting',
                    start: new Date(y, m, d, 10, 30),
                    allDay: false
                },
                {
                    title: 'Lunch',
                    start: new Date(y, m, d, 12, 0),
                    end: new Date(y, m, d, 14, 0),
                    allDay: false
                },
                {
                    title: 'Birthday Party',
                    start: new Date(y, m, d+1, 19, 0),
                    end: new Date(y, m, d+1, 22, 30),
                    allDay: false
                },
                {
                    title: 'Click for Google',
                    start: new Date(y, m, 28),
                    end: new Date(y, m, 29),
                    url: 'http://google.com/'
                }
            ]

    });

    // oepn modal
    $scope.animationsEnabled = true;
    $scope.open = function (size) {
       modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'schedule_modal.html',
            size: size,
            scope : $scope,
            controller : 'ScheduleCtrl'
        });
    };

    $scope.add = function(){
      console.log($scope.schedule);

      firebase.database().ref('schedule/'+ $scope.aircraft.aircraft_number).set({
          id :  $scope.aircraft.aircraft_number,
          flight_number : $scope.schedule.flight.flight_number,
          destination : $scope.schedule.flight.destination.iata ,
          origin :  $scope.schedule.flight.origin.iata,
          departure :  $scope.schedule.flight.departure ,
          arrival : $scope.schedule.flight.arrival,
          aircraft :  $scope.aircraft
        }).then(function(data){
            console.log(data);
            modalInstance.close();

        });
    };

    // close modal
    $scope.cancel = function () {
      modalInstance.dismiss('cancel');
    };
}])


.controller('DashboardCtrl', ['$scope','$firebase','$uibModal',function($scope,$firebase,$uibModal) {
}])

.controller('AirCraftCtrl', ['$scope','$firebase','$uibModal',function($scope,$firebase,$uibModal) {



  // oepn modal
  $scope.animationsEnabled = true;
  $scope.open = function (size) {
     modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'aircraft_modal.html',
          size: size,
          scope : $scope,
          controller : 'AirCraftCtrl'
      });
  };

  $scope.add = function(){
    console.log($scope.aircraft);

    firebase.database().ref('aircrafts/'+ $scope.aircraft.aircraft_number).set({
        aircraft_number :  $scope.aircraft.aircraft_number
      }).then(function(data){
          console.log(data);
          modalInstance.close();

      });
  };

  // close modal
  $scope.cancel = function () {
    modalInstance.dismiss('cancel');
  };

}])
;
