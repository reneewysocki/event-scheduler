 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyD1ShP9tvQ2PkdQNcTqIGbwsO01W4tb2_A",
     authDomain: "train-scheduler-1e7b5.firebaseapp.com",
     databaseURL: "https://train-scheduler-1e7b5.firebaseio.com",
     projectId: "train-scheduler-1e7b5",
     storageBucket: "train-scheduler-1e7b5.appspot.com",
     messagingSenderId: "465644469659"
   };

  firebase.initializeApp(config);

  var database = firebase.database();


 // GLOBAL VARIABLES 
 var trainName = "";
 var destination = "";
 var firstTrain = "";
 var frequency = "";
var nextTrain = "";
var tMinutesTillTrain = "";

// Current time
var currentDate = moment();
//console.log("CURRENT TIME:" + moment(currentTime).format('MMMM Do YYYY, h:mm:ss a'));


$('#currentTime').append("<b>" + (currentDate).format("MMMM Do YYYY, h:mm:ss a") + "</b>");


  $('#newTrainBtn').on('click', function(event){
    
    event.preventDef0ault();
    trainName = $('#trainNameInput').val().trim();
    destination = $('#destInput').val().trim();
    firstTrain = $('#firstTrainInput').val().trim();
    frequency = $('#freqInput').val().trim();

    if(trainName === "" | destination === "" | firstTrain === "" | frequency === "") return;

    var newTrain = {
	    name: trainName,
	 	dest: destination,
	  	first: firstTrain,
	 	freq: frequency
    };
    


 //Uploads train data to the database
	database.ref().push(newTrain);
  
    //clears form
	$('#trainNameInput').val("");
	$('#destInput').val("");
	$('#firstTrainInput').val("");
    $('#freqInput').val("");
    
  });

  database.ref().on("child_added", function(childSnapshot){

    var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().dest;
	var firstTrain = childSnapshot.val().first;
	var frequency = childSnapshot.val().freq;
	var trainData = [
	 	trainName,
		destination,
	 	firstTrain,
	 	frequency
	 ];
	// Train info
	console.log(trainName);
	console.log(destination);
	console.log(firstTrain);
	console.log(frequency);

	//First time
	var firstTimeConverted = moment(firstTrain, "hh:mm A").subtract(1, "years");
	console.log(firstTimeConverted);

	// Current time
	var currentTime = moment();
	console.log("CURRENT TIME:" + moment(currentTime).format("HH:mm"));

	// Difference between times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	// Mins until train
	var tMinutesTillTrain = frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	 // Next train
	 var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	 console.log("NEXT TRAIN: " + nextTrain);

	$("#trainTable > tbody").append("<tr><td><a href='#' data-train='"+ trainData + "'>-</a></td><td>" + trainName + "</td><td>" + destination  + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    
    //removes information from database
    $("a").on("click", function () {
        var train = $(this).attr("data-train").split(",");

		var deleteRef = database.ref().orderByChild('name').equalTo(train[0]);
		deleteRef.on('child_added', function(snapshot) {
            snapshot.ref.remove();
            location.reload();
        });
    })
  });

  
