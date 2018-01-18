(function(){
"use strict";

//switch between clock views
const setAlarmDiv = document.getElementById('setAlarmDiv');
const alarmDiv = document.getElementById('alarmDiv');

//alarm time variables 
const inputs = document.querySelectorAll('input');
const inputHour = document.getElementById("setHour");
const inputMinute = document.getElementById("setMinute");
const arrows = document.querySelectorAll(".arrow");
const allDays = document.getElementsByName("day");
const setAlarmBtn = document.getElementById("setAlarmBtn");

//alarm view variables
const alarmSign = document.querySelector('.alarmSign');
const alarmIcon = document.querySelector('#alarmDiv span');
const audio = document.getElementById("music");

//Default status of values
let chosenAlarmTime;
let currentTime;
let nap = false;
let napTimeValue = 0;
let called = 0;
let checkedDays = [];

//add "0" to input time if it has only one digit
function addZero(i){
	return (i.toString()).padStart(2, '0');
}

//run analog clock
function setupClock() {
	//get date object
	let date = new Date();
	//variables for analog clock
	const secondsHand = document.querySelector('.seconds'),
		minutesHand = document.querySelector('.minutes'),
		hoursHand = document.querySelector('.hours');
	let secs = date.getSeconds(), 
		mins = (date.getMinutes() + date.getSeconds()/60) * 60 , 
		hours = (date.getHours() + (date.getMinutes() + date.getSeconds()/60)/60) * 3600;
	secondsHand.style.animationDelay = '-' + secs + 's';
	minutesHand.style.animationDelay = '-' + mins + 's';
	hoursHand.style.animationDelay = '-' + hours + 's';
}

//update current clock time every second
function startTime (){
	//get new  Date object every second
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	hours = addZero(hours);
	minutes = addZero(minutes);
	seconds = addZero(seconds);
	currentTime = hours + ":" + minutes + ":" + seconds;
	document.getElementById("currentTime").innerHTML = currentTime + " " + getDate();
}

//change alarm time when user choose to snooze
function snooze(napHour, napMinute){
	//add nap minutes to current alarm minute
	napMinute = parseFloat(napMinute) + napTimeValue;
	if (napMinute > 59 || napMinute === 0){
		napHour = parseFloat(napHour) + 1;
		napMinute = napMinute - 60;
	}
	napHour = addZero(napHour);
	inputHour.value = napHour;
	napMinute = addZero(napMinute);
	inputMinute.value = napMinute;
	nap = false;
}

//set and format alarm time
function setAlarm (){
	const alarmSecond = "00";
	let chosenHour = inputHour.value,
		chosenMinute = inputMinute.value;
	// set nap if was chosen
	if (nap === true){
		snooze(chosenHour, chosenMinute);	
		chosenHour = inputHour.value;
		chosenMinute = inputMinute.value;
	}
	let alarmTime = chosenHour + ":" + chosenMinute + ":" + alarmSecond;
	document.getElementById("alarmTime").innerHTML = chosenHour + ":" + chosenMinute;
	return alarmTime;
}

//get current date
function getDate (){
	//use Internationalization API to format date
	let formatter = new Intl.DateTimeFormat( 'pl', {
		weekday: 'long',
	});
	//get current day and format it with Internationalization API
	let day = formatter.format( new Date());
	return day;
}

//select few days by buttons
function selectFewDays (selectedBtn) {
	//select all days with the same dataset as clicked button
	let selectedDataset = selectedBtn.dataset.days;
	let selectedDays;
	if (selectedDataset === "alldays") selectedDays = allDays;
	else selectedDays = document.querySelectorAll(`input[data-days="${selectedDataset}"]`);
	if (selectedBtn.checked){
		//uncheck already checked days
		inputs.forEach(input => {
			if (input === selectedBtn) return;
			input.checked = false
		});
	//check selected days
		selectedDays.forEach(day => day.checked = true);	
	} else {
	//uncheck selected days
		selectedDays.forEach(day => day.checked = false);
	}	
}

//find checked days and add to array
function getCheckedDays() {
	allDays.forEach(day => {
		if (day.checked) {
			if (checkedDays.includes(day.value)){
				return;
			}
			checkedDays.push(day.value);
		} else {
			if (checkedDays.includes(day.value)){
				checkedDays.splice(checkedDays.indexOf(day), 1)
			}
		}
	})
}

//hide arrows while waiting for alarm
function hideArrows (arrows) {
	arrows.forEach(arrow => {
		arrow.style.opacity = "0";
		arrow.setAttribute("aria-hidden", "true");
		arrow.disabled = true;
		arrow.style.cursor = "default";
	});
}

//wait for alarm to ring
function waitForAlarm(){
	//prevent from changing alarm time and days
	setAlarmBtn.style.backgroundColor = '#6d60a5';
	setAlarmBtn.innerHTML = "Zatrzymaj budzik";
	hideArrows(arrows);
	inputs.forEach(input => {
		input.disabled = true;
	});
	//check if alarm should ring
	detectAlarm();
};

//initiating nap
function napTime (e) {
	let target = e.target;
	napTimeValue = parseFloat(target.dataset.nap);
	nap = true;
	//turn off music
	audio.pause();
	audio.currentTime = 0;
	//change icon
	alarmSign.innerHTML = "Drzemka";
	alarmIcon.classList.add("fa-bed");
	alarmIcon.classList.remove("fa-bell");
	waitForAlarm();
}

//show arrows when the alarm has been cancelled
function showArrows (arrows) {
	arrows.forEach(arrow => {
		arrow.style.opacity = "1";
		arrow.removeAttribute("aria-hidden");
		arrow.disabled = false;
		arrow.style.cursor = "pointer";
	});
}

//stop alarm if user turned it off by button
function stopWaiting(){
	checkedDays.length = 0;
	setAlarmBtn.style.backgroundColor = '#392D75';
	showArrows(arrows);
	inputs.forEach(input => {
		input.disabled = false;
	});
	setAlarmBtn.innerHTML = "Ustaw budzik";
	clearInterval(called);
	called = 0;
	return;
}

//stop the alarm
function stopAlarm() {
	alarmDiv.style.display = "none";
	setAlarmDiv.style.display = "block";
	audio.pause();
	audio.currentTime = 0;
	stopWaiting();
}

//initiating alarm
function alarm (){
	//change screen
	alarmDiv.style.display = "flex";
	setAlarmDiv.style.display = "none";
	alarmIcon.classList.add("fa-bell");
	alarmIcon.classList.remove("fa-bed");
	alarmSign.innerHTML = "Budzik";
	//start music
	audio.play();
}

function detectAlarm () {
	//get alarm time
	chosenAlarmTime = setAlarm();
	//check every second if alarm should ring
	called = setInterval (function(){
		let currentDay = getDate();
		if (checkedDays.includes(currentDay)){
			if (currentTime === chosenAlarmTime){
				clearInterval(called);
				called = 0;
				alarm();
			}
		}
	}, 500);
}

function initialEventListeners() {
	//listen to setAlarmBtn to start main functions
	setAlarmBtn.addEventListener("click", function(){
		if (called){
			stopWaiting();
		} else {
			let alert = document.querySelector('.alert');
			alert.style.display = "none";
			//get chosen days
			getCheckedDays();
			if (checkedDays.length === 0) {
				alert.style.display = "block";
				return;
			}
			waitForAlarm();
		}
	});

	//listen if user chose to snooze
	const napButtons = document.querySelectorAll('button[data-nap]');
	napButtons.forEach(button => {
		button.addEventListener("click", napTime);
	});

	//listen if user chose to stop the alarm
	const stopBtn = document.getElementById("stopBtn");
	stopBtn.addEventListener("click", stopAlarm);	

	//Inputs' event listeners
	// select all content in input
	const setAlarmInputs = document.querySelectorAll('.chooseAlarmTime input');
	setAlarmInputs.forEach(input => 
		input.addEventListener('click', function(){
			this.select();
		})
	);

	function modifyInputValue (input, max) {
		//prevent input other than digits
		input.value = input.value.replace(/[^0-9]/g, '');
		if (input.value > max){
			input.value = input.value[0];
		}
		if (input.value.length >= 2){
			input.value = input.value.slice(0,2);
		}
	}

	//prevent input from setting number greater than 23, slice it to two digits
	inputHour.addEventListener('input', function() { 
		modifyInputValue(this, 23);
	});	

	//prevent input from setting number greater than 59, slice it to two digits
	inputMinute.addEventListener('input', function() { 
		modifyInputValue(this, 59);
	});

	//add 0 to value if needed
	window.addEventListener('click', function(){
		inputHour.value = addZero(inputHour.value);
		inputMinute.value = addZero(inputMinute.value);
	});	

	//functions for arrows
	const increaseHour = document.querySelector("#increaseHour");
	const increaseMinute = document.querySelector("#increaseMinute");
	const reduceHour = document.querySelector("#reduceHour");
	const reduceMinute = document.querySelector("#reduceMinute");

	increaseHour.addEventListener("click", () => {
		if (inputHour.value == 23){
			inputHour.value = "00";
		} else {
			inputHour.value = parseFloat(inputHour.value) + 1;
			inputHour.value = addZero(inputHour.value);
		}
	});

	increaseMinute.addEventListener("click", () => {
		if (inputMinute.value == 59){
			inputMinute.value = "00";
		} else {
			inputMinute.value = parseFloat(inputMinute.value) + 1;
			inputMinute.value = addZero(inputMinute.value);
		}
	});

	reduceHour.addEventListener("click", () => {
		if (inputHour.value == 0){
			inputHour.value = "23";
		} else {
			inputHour.value = parseFloat(inputHour.value) - 1;
			inputHour.value = addZero(inputHour.value);
		}
	});

	reduceMinute.addEventListener("click", () => {
		if (inputMinute.value == 0){
			inputMinute.value = "59";
		} else {
			inputMinute.value = parseFloat(inputMinute.value) - 1;
			inputMinute.value = addZero(inputMinute.value);
		}
	});	

	//check day to set the alarm
	const week = document.querySelector("#week");
	const weekdays = document.querySelector("#weekdays");
	const weekend = document.querySelector("#weekend");
	week.addEventListener('click', () => selectFewDays(week));
	weekdays.addEventListener('click', () => selectFewDays(weekdays));
	weekend.addEventListener('click', () => selectFewDays(weekend));
};


window.addEventListener('load', ()=> {
	initialEventListeners()
	setupClock();
	window.setInterval(startTime, 500);
})


}());