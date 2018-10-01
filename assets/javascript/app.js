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
var currentTime = moment();
console.log("CURRENT TIME:" + moment(currentTime).format("HH:mm"));


$('#currentTime').append("<b>" + (currentTime).format("HH:mm") + "</b>");


  $('#newTrainBtn').on('click', function(event){
    
    event.preventDefault();
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
    
    // console.log(trainName);
	// console.log(destination);
	// console.log(firstTrain);
    // console.log(frequency);

 //Uploads train data to the database
	database.ref().push(newTrain);
  
	$('#trainNameInput').val("");
	$('#destInput').val("");
	$('#firstTrainInput').val("");
    $('#freqInput').val("");

    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination  + "</td><td>" + frequency + "</td></tr>");
    
  });

  database.ref().on("child_added", function(childSnapshot){
    //console.log(childSnapshot.val());

    trainName = childSnapshot.val().name;
	destination = childSnapshot.val().dest;
	firstTrain = childSnapshot.val().first;
    frequency = childSnapshot.val().freq;
    
    //First time
    var firstTimeConverted = moment(firstTrain, "hh:mm A").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current time
    currentTime = moment();

    
  });

  
