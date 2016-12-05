angular.module('starter.controllers', ['ui.bootstrap','ngTouch','ngAnimate','angularMoment','ngMaterial','ngAnimate','ngAria'])

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
        format: 'ddd, DD MMM YYYY'
    });
    $(currentElement).data("DateTimePicker").show();

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

.controller('ScheduleCtrl', ['$scope','$firebase','$uibModal','$mdDialog',function($scope,$firebase,$uibModal, $mdDialog) {
          //moment.tz.setDefault('Universal');
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
            				stick: false // maintain when user navigates (see docs on the renderEvent method)
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
                    snap : false
            			});

    		    });

            $('#external-events div.btn-group li.external-event').each(function() {
  	             // store data so the calendar knows to render an event upon drop
            			$(this).data('event', {
            				title: $.trim($(this).text()), // use the element's text as the event title
            				stick: false // maintain when user navigates (see docs on the renderEvent method)
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
         $('#schedule_calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            dragRevertDuration: 0,
            drop: function(date, jsEvent, ui, resourceId) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                // $(this) holds the DOM element that has been dropped.
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                //Keep in mind that the target object (first argument) will be modified, and will also be returned from $.extend().
                //If, however, you want to preserve both of the original objects, you can do so by passing an empty object as the target:
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = false;
                $scope.selected_schedule= {
                  start : moment.utc(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
                  flight_number :  copiedEventObject.title,
                  flight : {
                    flight_number : copiedEventObject.flight.flight_number,
                    destination : copiedEventObject.flight.destination,
                    origin : copiedEventObject.flight.origin,
                    arrival : moment.utc(date).hour(copiedEventObject.flight.arrival.split(':')[0].trim()).minute(copiedEventObject.flight.arrival.split(':')[1].trim()).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
                    departure : moment.utc(date).hour(copiedEventObject.flight.departure.split(':')[0].trim()).minute(copiedEventObject.flight.departure.split(':')[1].trim()).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
                  }
                };

                $scope.display_date = new Date(moment.utc(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ')),

                $('#schedule_calendar').fullCalendar('removeEvents', copiedEventObject._id);
                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                //$('#schedule_calendar').fullCalendar('renderEvent', copiedEventObject,false);


              },
              eventReceive :function(event,jsEvent) //This function is triggered after the drop callback has been called and after the new event has already been rendered on the calendar.
              {
                  $('#schedule_calendar').fullCalendar('updateEvent', event);
                  $scope.showTabDialog(jsEvent, $scope.selected_schedule);
              },
            events : function(start, end, timezone, callback) {
                $.ajax({
                  //url: 'https://project-109588683016713089.firebaseio.com/schedule.json',
                  url: config.databaseURL + '/schedule.json',
                  data: {
                        start: moment().startOf("month").format('YYYY-MM-DD'),
                        end: moment().endOf("month").format('YYYY-MM-DD')
                  },
                  success: function(doc) {
                      var events = [];

                      $.each(doc,function(index,element) {
                      events.push({
                              id: index,
                              title: element.title,
                              aircraft : element.aircraft,
                              start : moment.unix(element.start),
                              flight : element.flight
                          });
                      });
                      callback(events);
                      $('#schedule_calendar').fullCalendar('render');

                  }
                });
            },
            eventClick : function(event,jsEvent,view){
              $scope.selected_schedule = {};
              mayhem.get('schedule/' + event.id).then(function(result){
                $scope.selected_schedule = result;
                $scope.selected_schedule.id = event.id;
                $scope.selected_schedule.start = moment(event.start).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
                $scope.selected_schedule.flight = event.flight;
                $scope.selected_schedule.flight.departure = moment.unix(event.flight.departure).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
                $scope.selected_schedule.flight.arrival = moment.unix(event.flight.arrival).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
                console.log($scope.selected_schedule.flight);
              });

              $scope.display_date = new Date(moment(event.start).utc());

              // open modal
              $scope.showTabDialog(jsEvent,$scope.selected_schedule);

            },
            eventDrop : function(event, delta, revertFunc, jsEvent, ui, view){ //Triggered when dragging stops and the event has moved to a different day/time.
              var _departure = moment.utc(event.flight.departure);
              var _arrival =  moment.utc(event.flight.arrival);

              $scope.selected_schedule = {};
              $scope.selected_schedule.id = event.id;
              $scope.selected_schedule.start = moment.utc(event.start).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
              $scope.selected_schedule.flight = event.flight;
              $scope.selected_schedule.flight.departure = moment.unix(event.flight.departure).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
              $scope.selected_schedule.flight.arrival =  moment.unix(event.flight.arrival).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
              $scope.selected_schedule.aircraft = event.aircraft;

              $scope.display_date = new Date(moment.utc(event.start).format('ddd, DD MMM YYYY HH:mm:ss ZZ'));

              if (!confirm("Are you sure about this change?")) {
                  revertFunc();
              }
              else{
                // open modal
                $scope.showTabDialog(jsEvent, $scope.selected_schedule);
              }
            },
            eventMouseover : function(event, jsEvent, view)
            {

            },
            eventDragStop: function( event, jsEvent, ui, view ) {

                //if(isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {
                    $('#calendar').fullCalendar('removeEvents', event._id);
                    var el = $( "<div class='fc-event'>" ).appendTo( '#external-events-listing' ).text( event.title );
                    el.draggable({
                      zIndex: 999,
                      revert: true,
                      revertDuration: 0
                    });
                    el.data('event', { title: event.title, id :event.id, stick: true });
              //  }
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
          format: 'ddd, DD MMM YYYY ZZ'
      }).on("dp.change", function (e) {
            console.log(e.date);
            $scope.selected_schedule.start = moment.utc(e.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
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
         $('.dateInput').datetimepicker({
             format: 'HH : mm'
         });

       });
    };

    $scope.add = function(){
      var schedule_id = $scope.selected_schedule.id;
      var _departure = moment.utc($scope.selected_schedule.flight.departure);
      var _arrival =  moment.utc($scope.selected_schedule.flight.arrival);

      $scope.selected_schedule.start = moment.utc($scope.display_date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      $scope.selected_schedule.flight.departure = moment.utc($scope.display_date).hour(_departure.hour()).minute(_departure.minute()).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      $scope.selected_schedule.flight.arrival =  moment.utc($scope.display_date).hour(_arrival.hour()).minute(_arrival.minute()).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      var reqObject = {
        flight : {
          flight_number : $scope.selected_schedule.flight.flight_number,
          destination : $scope.selected_schedule.flight.destination ,
          origin :  $scope.selected_schedule.flight.origin,
          departure : moment($scope.selected_schedule.flight.departure).unix() ,
          arrival : moment($scope.selected_schedule.flight.arrival).unix()
        },
          aircraft :  $scope.selected_schedule.aircraft,
          title: $scope.selected_schedule.flight.flight_number,
          start: moment($scope.selected_schedule.start).unix()
        };
      if(schedule_id)
      {
        firebase.database().ref('schedule/' +  schedule_id).set(reqObject).then(function(data){
              $scope.refreshCalendar();
              $mdDialog.cancel();

          });
      }
      else
      {
            firebase.database().ref('schedule/').push(reqObject).then(function(data){
                  $scope.refreshCalendar();
                  $mdDialog.cancel();

              });
      }
    };

    // close modal
    $scope.cancel = function () {
      $mdDialog.cancel();
    }
    $scope.refreshCalendar =  function() {
        $('#schedule_calendar').fullCalendar( 'refetchEvents')
      };

    $scope.showConfirmDialog = function(ev)
    {
      var confirm = $mdDialog.confirm()
          .title('Would you like to change the departure date?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });

    };

    $scope.showTabDialog = function(ev,schedule) {
        $mdDialog.show({
          controller: DialogController,
          scope : $scope,
          templateUrl: 'schedule_modal.html',
          parent: angular.element(document.body),
          targetEvent: null,
          clickOutsideToClose:true,
          bindToController : true,
          preserveScope : true,
          fullscreen : true,
          locals: {
            selected_schedule: schedule
            }
        }).then(function() {

            }, function() {

            });

          function DialogController($scope, $mdDialog, selected_schedule) {
                    $scope.selected_schedule = selected_schedule;
                    $scope.closeDialog = function() {
                      $mdDialog.hide();
                    }
                  }
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
