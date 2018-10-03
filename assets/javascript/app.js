$(document).ready(function () {

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

    //current time
    var currentDate = moment();
    $('#currentTime').append("<b>" + (currentDate).format("h:mm A") + "</b>");


    // GLOBAL VARIABLES 
    var trainName = "";
    var destination = "";
    var firstTrain = "";
    var frequency = "";

    $('#newTrainBtn').on('click', function (event) {

        event.preventDefault();
        trainName = $('#trainNameInput').val().trim();
        destination = $('#destInput').val().trim();
        firstTrain = $('#firstTrainInput').val().trim();
        frequency = $('#freqInput').val().trim();

        if (trainName === "" | destination === "" | firstTrain === "" | frequency === "") return;

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

        sortTimes();


    });

    database.ref().on("child_added", function (childSnapshot) {

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

        $("#trainTable > tbody").append("<tr><td><a href='#' data-train='" + trainData + "'>x</a></td><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");

        sortTimes();

        //removes information from database
        $("a").on("click", function () {
            var train = $(this).attr("data-train").split(",");

            var deleteRef = database.ref().orderByChild('name').equalTo(train[0]);
            deleteRef.on('child_added', function (snapshot) {
                snapshot.ref.remove();
                location.reload();
            });

            sortTimes();
        });

        // Sorts table based on time away from show
        function sortTimes() {
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.getElementById("trainTable");
            switching = true;
            /*Make a loop that will continue until
            no switching has been done:*/
            while (switching) {
                //start by saying: no switching is done:
                switching = false;
                rows = table.rows;
                /*Loop through all table rows (except the
                first, which contains table headers):*/
                for (i = 1; i < (rows.length - 1); i++) {
                    //start by saying there should be no switching:
                    shouldSwitch = false;
                    /*Get the two elements you want to compare,
                    one from current row and one from the next:*/
                    x = rows[i].getElementsByTagName("TD")[5];
                    y = rows[i + 1].getElementsByTagName("TD")[5];
                    //check if the two rows should switch place:
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                if (shouldSwitch) {
                    /*If a switch has been marked, make the switch
                    and mark that a switch has been done:*/
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }
        }
    });

    var time = new Date().getTime();
    $(document.body).bind("mousemove keypress", function (e) {
        time = new Date().getTime();
    });

    function refresh() {
        if (new Date().getTime() - time >= 60000)
            window.location.reload(true);
        else
            setTimeout(refresh, 10000);
    }

    setTimeout(refresh, 10000);


});
