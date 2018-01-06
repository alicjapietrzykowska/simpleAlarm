// (function(){

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
let nap = false;
let called = false;
let checkedDays = [];

//add "0" to input time if it has only one digit
function addZero(i){
	return (i.toString()).padStart(2, '0');
}

//for analog clock
function setupClock(date) {
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

//make the clock work
function startTime (){
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	setupClock(date);
	hours = addZero(hours);
	minutes = addZero(minutes);
	seconds = addZero(seconds);
	let time = hours + ":" + minutes + ":" + seconds;
	document.getElementById("currentTime").innerHTML = time + " " + getDate();
	window.setTimeout(startTime, 500);
	return time;
}

//change alarmTime when user chose to snooze
function snooze(chosenHour, chosenMinute){
	chosenMinute = parseFloat(chosenMinute) + napTimeValue;
	if (chosenMinute > 59){
		chosenHour = parseFloat(chosenHour) + 1;
		chosenMinute = chosenMinute - 60;
	}
	chosenHour = addZero(chosenHour);
	inputHour.value = chosenHour;
	chosenMinute = addZero(chosenMinute);
	inputMinute.value = chosenMinute;
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
	}
	let alarmTime = chosenHour + ":" + chosenMinute + ":" + alarmSecond;
	document.getElementById("alarmTime").innerHTML = chosenHour + ":" + chosenMinute;
	return alarmTime;
}

//Current date
function getDate (){
	let formatter = new Intl.DateTimeFormat( 'pl', {
		weekday: 'long',
	});
	let day = formatter.format( new Date());
	return day;
}

//select few days by buttons
function selectFewDays (selectedBtn) {
	//select all days with the same dataset as button
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
function checkDay () {
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

function lookForAlarm () {
	let currentDay = getDate();
	let currentTime = startTime();
	let chosenAlarmTime = setAlarm();
	if (checkedDays.includes(currentDay)){
		if (currentTime === chosenAlarmTime){
			alarm();
		}
	}
}

//start alarm if current time === set alarm
function waitForAlarm (){
	setAlarmBtn.style.backgroundColor = '#6d60a5';
	setAlarmBtn.innerHTML = "Zatrzymaj budzik";
	hideArrows(arrows);
	inputs.forEach(input => {
		input.disabled = true;
	});
	checkDay();
	called = setInterval (function(){
		lookForAlarm();
	}, 500);
};

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
	clearInterval(called);
	checkedDays.length = 0;
	setAlarmBtn.style.backgroundColor = '#392D75';
	showArrows(arrows);
	inputs.forEach(input => {
		input.disabled = false;
	});
	setAlarmBtn.innerHTML = "Ustaw budzik";
	called = false;
	return;
};

//initiating nap
function napTime() {
	nap = true;
	console.log(nap);
	//turn off music
	audio.pause();
	audio.currentTime = 0;
	//change icon
	alarmSign.innerHTML = "Drzemka";
	alarmIcon.classList.add("fa-bed");
	alarmIcon.classList.remove("fa-bell");
	//restart alarm
	waitForAlarm();
}

//stopping the alarm
function stopAlarm() {
	alarmDiv.style.display = "none";
	setAlarmDiv.style.display = "block";
	audio.pause();
	audio.currentTime = 0;
	stopWaiting();
}


//initiating alarm
function alarm (){
	const napButtons = document.querySelectorAll('button[data-nap]');
	const stopBtn = document.getElementById("stopBtn");
	//change screen
	alarmDiv.style.display = "flex";
	setAlarmDiv.style.display = "none";
	alarmIcon.classList.add("fa-bell");
	alarmIcon.classList.remove("fa-bed");
	alarmSign.innerHTML = "Budzik";
	//start music
	audio.play();
	//listen if user chose to snooze
	napButtons.forEach(button => {
		button.addEventListener("click", () =>{
			napTimeValue = parseFloat(button.dataset.nap);
			napTime();
		})
	})
	//listen if user chose to stop the alarm
	stopBtn.addEventListener("click", stopAlarm);	
}

function initialEventListeners() {
	//listen to setAlarmBtn to start main functions
	setAlarmBtn.addEventListener("click", function(){
		if (called){
			stopWaiting();
		} else {
			waitForAlarm();
		}
	});

	// select all content in input
	const setAlarmInputs = document.querySelectorAll('.chooseAlarmTime input');
	setAlarmInputs.forEach(input => 
		input.addEventListener('click', function(){
			this.select();
		})
	);

	//prevent input from setting number greater than 23, slice it to two digits
	inputHour.addEventListener('input', function () {
		//prevent input other than digits
		this.value = this.value.replace(/[^0-9]/g, '');
		if (this.value > 23){
			this.value = this.value[0];
		}
		if (this.value.length >= 2){
			this.value = this.value.slice(0,2);
		}
	});

	//prevent input from setting number greater than 59, slice it to two digits
	inputMinute.addEventListener('input', function () {
		//prevent input other than digits
		this.value = this.value.replace(/[^0-9]/g, '');
		if (this.value > 59){
			this.value = this.value[0];
		}
		if (this.value.length >= 2){
			this.value = this.value.slice(0,2);
		}
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
		if (inputMinute.value == 00){
			inputMinute.value = "59";
		} else {
			inputMinute.value = parseFloat(inputMinute.value) - 1;
			inputMinute.value = addZero(inputMinute.value);
		}
	});	

	//check day to set the alarm
	const allWeek = document.querySelector("#allWeek");
	const weekdays = document.querySelector("#weekdays");
	const weekend = document.querySelector("#weekend");
	allWeek.addEventListener('click', () => selectFewDays(allWeek));
	weekdays.addEventListener('click', () => selectFewDays(weekdays));
	weekend.addEventListener('click', () => selectFewDays(weekend));
};


window.addEventListener('load', ()=> {
	initialEventListeners()
	startTime();
})


// }());