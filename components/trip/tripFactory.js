// Factory that returns an object with the appropriate data
//
// $http - angular Dependency so I can make an ajax call
//
// returns an object with the data
function tripFactory($http, $q, coordFactory, calculateDistanceFactory, profileFactory) {
  var trip = {
    miles: 0,
    minutes: 0,
    startTime: 0,
    endTime: 0,
    posted: false,
    user_id: 0,
    status: 'inactive'
  }
  
  // returns an array of positions
  
  trip.positions = function () {
    return coordFactory.getAllCoordinates();
  }

  var postTripURL = 'https://driveoff.herokuapp.com/trips';
  
  
  var getCurrentTime = function () {
    var d = new Date();
    return d.getTime();
  }

  //processes the miles and minutes for the trip
  //
  // returns nothing
  var processTrip = function() {
    trip.status = 'finished';
    //get positions from local storage
    
    var positions = trip.positions;

    console.log(trip.positions);
    
    //calculate miles from all locations
    var len = positions.length;
    

    for (var i = 1; i < len; i++ ){
      trip.miles+= Math.round(calculateDistanceFactory.getDistance(positions[i-1].latitude, positions[i-1].longitude, positions[i].latitude, positions[i].longitude) * 100) / 100;
    }
    console.log(trip.miles);
    // calculate minutes from start and end time (60,000 mSeconds in a Minute)
    trip.minutes = Math.round( (trip.endTime - trip.startTime)/60000  * 100 ) / 100;
    console.log(trip.minutes);
    // set user id
    trip.user_id = profileFactory.id;
    console.log(trip.user_id);
    console.log(positions);
  
    return $http.post(postTripURL, trip, { 
      transformRequest: angular.identity,
      headers: {'Access-Control-Allow-Origin': '*'
    }}).success(function(data) {
      if (!data.error){
        trip.posted = true;
      }
    });
  }
  
  // gets the location and adds it to the array
  //
  // returns nothing
  trip.checkLocation = function(){
    coordFactory.getCurrentPosition(function(){});
  }
  
  // checks if the reps have already been fetched; if not, fetches them
  //
  // returns the promise
  trip.endTrip = function() {
    $('body').removeClass('dark black-background');
    
    trip.endTime = getCurrentTime();
    trip.checkLocation(function(){});
    processTrip();
  }
  
  
  // begins the trip by getting the original location
  //
  // returns nothing
  trip.beginTrip = function(){
    $('body').addClass('dark black-background');
    
    trip.status = 'driving safely...';
    trip.startTime = getCurrentTime();
    trip.checkLocation();
  }
  
  
  trip.sleep = function () {
    return setTimeout(function(){ }, 3000);
  }

  return trip;
}