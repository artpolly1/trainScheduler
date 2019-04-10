// Initialize Firebase

var config = {
    apiKey: "AIzaSyBTC3-uNHnnz-mukITqfZMUEKKUPvSiXJs",
    authDomain: "train-schedule-5d5cb.firebaseapp.com",
    databaseURL: "https://train-schedule-5d5cb.firebaseio.com",
    projectId: "train-schedule-5d5cb",
    storageBucket: "train-schedule-5d5cb.appspot.com",
    messagingSenderId: "491958052372"
  };

  firebase.initializeApp(config);

  //Create database variable to create reference to firebase.database().
 var database = firebase.database();

 var tMinutesTillTrain = 0; // this varible is varible is for countdown until the next train

//update current time on scheduler
function displayRealTime() {
    setInterval(function() {
        $('#time').html(moment().format ('hh:mm A'))

    }, 1000);
} 
displayRealTime();


//varible for the scheduler's table 
var tRow = '';
var getKey = '';



 //Click event for the submit button. When user clicks Submit button to add a train to the schedule...
 $("#submitButton").on("click", function() {

	// Prevent form from submitting
	event.preventDefault();

	//Grab the values that the user enters in the text boxes in the "Add train" section. Store the values in variables.
	var trainName = $("#inputTrainName").val().trim();
	var destination = $("#inputDestination").val().trim();
	var trainTime = $("#inputTrainTime").val().trim();
     var trainFrequency = $("#frequencyInMinutes").val().trim();
    

    //Print the values that the user enters in the text boxes to the console for debugging purposes.
	console.log(trainName);
	console.log(destination);
	console.log(trainTime);
    console.log(trainFrequency);

    //validate input fields

    if(trainName === '' || destination === ''|| trainTime === '' || trainFrequency === '') {
        $('#improperTimeInput').empty();
        $('#missingInformation').html('All fields required to add train to schedule.');
    }

    else if(trainName === null || destination === null || trainTime === null || trainFrequency === null) {
        $('#improperTimeInput').empty();
        $('notAnumber').empty();
        $('#missingInformation').html('All fields required to add train to schedule.');
    }

    //borrowed the following else if statments for  for an online user. However, I can explain what they mean and do
    else if (trainTime.length !== 5 || trainTime.substring(2,3)!== ":") {
        $('#improperTimeInput').empty();
        $('notAnumber').empty();
        $('#missingInformation').html('All fields required to add train to schedule.');
    }

    else if (isNaN(trainFrequency)) {
        $('#improperTimeInput').empty();
        $('notAnumber').empty();
        $('#missingInformation').html('All fields required to add train to schedule.');
    }

    else { 

        //Moment JS math 

    var convertedTime = moment(trainTime, 'hh:mm').subtract(1, 'years');
    console.log(convertedTime);
//CURRENT TIME
    var currentTime = moment();
    console.log(currentTime);
//Time difference 
var timeDifference = moment().diff(moment(convertedTime), 'minutes');
console.log('Diffrence intime: ' + timeDifference);

//Time apart
var timeRemainder = timeDifference %trainFrequency;
console.log(timeRemainder);

//minutes until train 
var tMinutesTillTrain = trainFrequency - timeRemainder;
console.log('minutes till train ' + tMinutesTillTrain);

//next train 
var nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('hh:mm A');
console.log('Arrival Time: ' + moment(nextTrain).format('hh:mm'));

//create local temporary object for holding train data 
var addTrain = {
    trainName: trainName,
    destination: destination,
    trainTime: trainTime,
    trainFrequency: trainFrequency,
    nextTrain: nextTrain,
    tMinutesTillTrain: tMinutesTillTrain,
    currentTime: currentTime.format('hh:mm A')
};

//save and upload train data to firebase
database.ref().push(addTrain);

console.log("train name in database: " + addTrain.trainName);
		console.log("destination in database: " + addTrain.destination);
		console.log("first train time in database: " + addTrain.trainTime);
		console.log("train frequency in database: " + addTrain.trainFrequency);
		console.log("next train in database: " + addTrain.nextTrain);
		console.log("minutes away in database: " + addTrain.tMinutesTillTrain);
		console.log("current time in database: " + addTrain.currentTime);

        //add modal (not alert box)
        $('.addModal').html('<p>' + addTrain.trainName + 'was successfully added to the current schedule.');
        $('#trainAdded').modal();

        //remove text from input boxes after user presses add button 
        $('#inputTrainName').val('');
        $('#inputDestination').val('');
        $('inputTrainTime').val('');
        $('frequencyInMinutes').val('');
    }   
 });


 //update page in realtime 

 database.ref().on('child_added', function(childSnapshot, prevChildKey){
     console.log(childSnapshot);
     console.log(prevChildKey);

     //set varibles for form input field values. They have to reflect the field values stroed in Firebase
     var trainName = childSnapshot.val().trainName;
     var destination = childSnapshot.val().destination;
     var trainTime = childSnapshot.val().trainTime;
     var trainFrequency = childSnapshot.val.trainFrequency;
     var nextTrain =  childSnapshot.val().nextTrain;
     var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;
     var currentTime = childSnapshot.val().currentTime;

     //train info 
     console.log(trainName);
     console.log(destination);
     console.log(trainTime);
     console.log(trainFrequency);
     console.log(nextTrain);
     console.log(tMinutesTillTrain);
     console.log(currentTime);

     //update schedule table 
     var tRow = $('<tr>');
     var nameTd = $('<td>').text(trainName);
     let destTd = $('<td>').text(destination);
     let timeTd = $('<td>').text(trainTime);
     let freqTd = $('<td>').text(trainFrequency);
     let tMinutesTillTrainTd = $('<td>').text(tMinutesTillTrain);

     tRow.append(nameTd, destTd, timeTd, freqTd, tMinutesTillTrainTd);

     $('#scheduleUpdate').append(tRow);
    //  $('#scheduleUpdate').append(nameTd);
    //  $('#scheduleUpdate').append(destTd);
    //  $('#scheduleUpdate').append(freqTd);
    //  $('#scheduleUpdate').append(timeTd);
    //  $('#scheduleUpdate').append(tMinutesTillTrainTd);
     







 });