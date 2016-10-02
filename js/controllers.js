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
        arrival :  $scope.flight.arrival
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
          mayhem.get('flights').then(function(result){
            $scope.flights = result;
          });

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
                  //date : new Date(date.year(),date.month(),date.date()),
                  date : moment(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
                  flight_number :  copiedEventObject.title,
                  flight : copiedEventObject.flight
                };
                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                // $('#schedule_calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // open modal
                $scope.open('sm');
              },
            events : function(start, end, timezone, callback) {
                $.ajax({
                  url: 'https://project-109588683016713089.firebaseio.com/schedule.json',
                  data: {
                        start: moment(1,"DD").format('YYYY-MM-DD'),
                        end: moment().endOf("month").format('YYYY-MM-DD')
                  },
                  success: function(doc) {
                      var events = [];

                      $.each(doc,function(index,element) {
                      events.push({
                              title: element.title,
                              aircraft : element.aircraft,
                              arrival : element.arrival,
                              //departure : element.departure,
                              departure : moment(element.start).hour(element.departure.split(":")[0]).minute(element.departure.split(":")[1]),
                              destination : element.destination,
                              origin : element.origin,
                              start : element.start,
                              flight_number : element.flight_number
                          });
                      });
                      callback(events);
                      $('#schedule_calendar').fullCalendar('render');

                  }
                });
            },
            eventClick : function(event,jsEvent,view){
              console.log(view);
              console.log(event);
              $scope.schedule.date = new Date(event.start.year(),event.start.month(),event.start.date());


              // open modal
              $scope.open('sm');

            },
            eventDrop : function(){ //Triggered when dragging stops and the event has moved to a different day/time.

            }
    });


    $scope.showTimePicker = function($event){
      currentElement = $event.currentTarget;
      $(currentElement).datetimepicker({
          format: 'HH : mm'
      });
      $(currentElement).data("DateTimePicker").show();
    };

    $scope.showDatePicker = function($event){
      currentElement = $event.currentTarget;
      $(currentElement).datetimepicker({
          format: 'MM / DD / YYYY'
      });
      $(currentElement).data("DateTimePicker").show();

    };


    // oepn modal
    $scope.animationsEnabled = true;
    $scope.open = function (size) {
       modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'schedule_modal.html',
            size: size,
            scope : $scope,
            controller : 'ScheduleCtrl',
            resolve: {
              schedule: function () {
                return $scope.schedule;
            }
            }
        });

       modalInstance.opened.then(function () {
         console.log($('.dateInput').is(':visible'));
         $('.dateInput').datetimepicker({
             format: 'HH : mm'
         });

       });
    };

    $scope.add = function(){
      console.log( "hh: " +$scope.schedule.flight.departure.split(":")[0]);
      console.log($scope.schedule.flight.departure.split(":")[1]);
      var _departure = moment($scope.schedule.date).hour($scope.schedule.flight.departure.split(":")[0]).minute($scope.schedule.flight.departure.split(":")[1]).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      var _arrival = moment($scope.schedule.date).hour($scope.schedule.flight.arrival .split(":")[0]).minute($scope.schedule.flight.arrival .split(":")[1]).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      firebase.database().ref('schedule/').push({
          flight_number : $scope.schedule.flight.flight_number,
          destination : $scope.schedule.flight.destination ,
          origin :  $scope.schedule.flight.origin,
          //departure : $scope.schedule.flight.departure,
          departure :  _departure ,
          //arrival : $scope.schedule.flight.arrival,
          arrival : _arrival,
          aircraft :  $scope.schedule.aircraft.aircraft_number,
          title: $scope.schedule.flight.flight_number,
          start: $scope.schedule.date
        }).then(function(data){
            $('#schedule_calendar').fullCalendar( 'render' );
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
