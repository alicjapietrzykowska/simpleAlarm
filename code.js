// (function(){

const setAlarmDiv = document.getElementById('setAlarmDiv');
const alarmDiv = document.getElementById('alarmDiv');

//alarm time variables 
const alarmDays = document.querySelector("#alarmDays");
const setAlarmInputs = document.querySelectorAll('.chooseAlarmTime input');
const inputHour = document.getElementById("setHour");
const inputMinute = document.getElementById("setMinute");
const setAlarmBtn = document.getElementById("setAlarmBtn");
const alarmSecond = "00";
const audio = document.getElementById("music");

//variables used to change alarm time by arrows
const arrows = document.querySelectorAll(".arrow");
const alarmSign = document.querySelector('.alarmSign');
const increaseHour = document.querySelector("#increaseHour");
const increaseMinute = document.querySelector("#increaseMinute");
const reduceHour = document.querySelector("#reduceHour");
const reduceMinute = document.querySelector("#reduceMinute");

//Nap buttons
const napButtons = document.querySelectorAll('button[data-nap]')

const napFive = document.getElementById("napFive");
const napThree = document.querySelector("#napThree");
const napTen = document.querySelector("#napTen");
const napFifteen = document.querySelector("#napFifteen");
const napTwenty = document.querySelector("#napTwenty");

const alarmIcon = document.querySelector('#alarmDiv span');
const stopBtn = document.getElementById("stopBtn");

//check day to set alarm
const allDays = document.getElementsByName("day");
const fewDays = document.getElementsByName("fewDays");
const weekendDays = document.querySelectorAll(".weekend");
const allWeekdays = document.querySelectorAll(".weekdays");
const allWeek = document.querySelector("#allWeek");
const weekdays = document.querySelector("#weekdays");
const weekend = document.querySelector("#weekend");
const inputs = document.querySelectorAll('input');

//variables for analog clock
const secondsHand = document.querySelector('.seconds');
const minutesHand = document.querySelector('.minutes');
const hoursHand = document.querySelector('.hours');

//Default status
let nap = false;
let checkedDays = [];
let date = new Date();
let called = false;

//prevent input from setting number greater than 23, slice it to two digit if more
inputHour.addEventListener('input', function () {
	if (this.value > 23){
		this.value = this.value[0];
	}
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
});

//prevent input from setting number greater than 59, slice it to two digit if more
inputMinute.addEventListener('input', function () {
	if (this.value > 59){
		this.value = this.value[0];
	}
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
});


setAlarmInputs.forEach(input => input.addEventListener('click', function(){
		this.select();
	}));

//function to prevent input other than digits to hours
inputHour.addEventListener("keypress", function (evt) {
    if (evt.which > 57 || evt.which > 93)
    {
        evt.preventDefault();
    }
});

setAlarmInputs.forEach(input => input.addEventListener('click', function(){
		this.select();
	}));

setAlarmInputs.forEach(input => input.addEventListener('input', function(){
		this.value = this.value.replace(/[^0-9]/g, '');
}));

//function to add "0" to input time if it has only one digit
function checkTime(i){
	if (i == 0 || i == "00"){
		return "00";
	}
	else if (i[0] == 0){
		i = i.slice(0,2);
		return i;
	} 
	else if (i < 10){
		return "0" + i;
	} 
	else {
		return i;
	}
}

//functions for arrows
increaseHour.addEventListener("click", function(){
	if (inputHour.value == 23){
		inputHour.value = "00";
	} else {
		inputHour.value = parseFloat(inputHour.value) + 1;
		inputHour.value = checkTime(inputHour.value);
	}
});

increaseMinute.addEventListener("click", function(){
	if (inputMinute.value == 59){
		inputMinute.value = "00";
	} else {
		inputMinute.value = parseFloat(inputMinute.value) + 1;
		inputMinute.value = checkTime(inputMinute.value);
	}
});

reduceHour.addEventListener("click", function(){
	if (inputHour.value == 0){
		inputHour.value = "23";
	} else {
		inputHour.value = parseFloat(inputHour.value) - 1;
		inputHour.value = checkTime(inputHour.value);
	}
});

reduceMinute.addEventListener("click", function(){
	if (inputMinute.value == 00){
		inputMinute.value = "59";
	} else {
		inputMinute.value = parseFloat(inputMinute.value) - 1;
		inputMinute.value = checkTime(inputMinute.value);
	}
});

//Function to make the clock work
function startTime (){
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	setupClock();
	hours = checkTime(hours);
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	let currentTime = hours + ":" + minutes + ":" + seconds;
	document.getElementById("currentTime").innerHTML = currentTime + " " + getDate();
	window.setTimeout(startTime, 500);
	return currentTime;
}

//After loading a page start clock
window.onload = startTime();

//function for analog clock
function setupClock() {
	let secs = date.getSeconds(), 
		mins = (date.getMinutes() + date.getSeconds()/60) * 60 , 
		hours = (date.getHours() + (date.getMinutes() + date.getSeconds()/60)/60) * 3600;
	secondsHand.style.animationDelay = '-' + secs + 's';
	minutesHand.style.animationDelay = '-' + mins + 's';
	hoursHand.style.animationDelay = '-' + hours + 's';
}

//set and format alarm time
function setAlarm (){
	let formattedHour = inputHour.value;
	let formattedMinute = inputMinute.value;

	formattedHour = checkTime(formattedHour);
	inputHour.value = formattedHour;
	// set nap if was chosen
	if (nap === true){
		formattedMinute = parseFloat(formattedMinute) + napTimeValue;
		if (formattedMinute > 59){
			formattedHour = parseFloat(formattedHour) + 1;
			formattedMinute = String(formattedMinute).charAt(1);
		}
		inputHour.value = formattedHour;
		inputMinute.value = formattedMinute;
		nap = false;
	}
	formattedMinute = checkTime(formattedMinute);
	inputMinute.value = formattedMinute;
	let alarmTime = formattedHour + ":" + formattedMinute + ":" + alarmSecond;
	document.getElementById("alarmTime").innerHTML = formattedHour + ":" + formattedMinute;
	return alarmTime;
}

//listen if user checked all week
allWeek.addEventListener('click', function(){
	//turn off other buttons
	if (allWeek.checked){
		if (weekdays.checked || weekend.checked) {
			weekdays.checked = false;
			weekend.checked = false;
			allDays.forEach(day => day.checked = false);
		}
	//check all days
		allDays.forEach(day => day.checked = true);	
	} else {
	//uncheck all days
		allDays.forEach(day => day.checked = false);
	}
});

//listen if user checked all weekdays
weekdays.addEventListener('click', function(){
	//turn off other buttons
	if (weekdays.checked){
		if (allWeek.checked || weekend.checked) {
			allWeek.checked = false;
			weekend.checked = false;
			allDays.forEach(day => day.checked = false);
		}
	//check weekdays
		allWeekdays.forEach(day => day.checked = true);	
	} else {
	//uncheck weekdays
		allWeekdays.forEach(day => day.checked = false);
	}
});

//listen if user checked all weekend
weekend.addEventListener('click', function(){
	//turn off other buttons
	if (weekend.checked){
		if (allWeek.checked || weekdays.checked) {
			allWeek.checked = false;
			weekdays.checked = false;
			allDays.forEach(day => day.checked = false);
		}
	//check weekend
		weekendDays.forEach(day => day.checked = true);	
	} else {
	//uncheck weekend
		weekendDays.forEach(day => day.checked = false);
	}
});

//Current date

function getDate (){
	let days = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piatek','Sobota'];
	return days[date.getDay()];
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

//listen to setAlarmBtn to start main functions
setAlarmBtn.addEventListener("click", function(){
	if (called){
		stopWaiting();
	} else {
		waitForAlarm();
	}
});


//start alarm if current time === set alarm
function waitForAlarm (){
	setAlarmBtn.style.backgroundColor = '#6d60a5';
	setAlarmBtn.innerHTML = "Zatrzymaj budzik";
	arrows.forEach(arrow => {
		arrow.style.opacity = "0";
		arrow.setAttribute("aria-hidden", "true");
		arrow.disabled = true;
		arrow.style.cursor = "default";
	});
	inputs.forEach(input => {
		input.disabled = true;
	});

	called = setInterval (function(){
		checkDay();
		if (checkedDays.includes(getDate())){
			if (startTime() === setAlarm()){
				alarm();
			}
		}
	}, 500);
};

//stop alarm if user turned it off by button
function stopWaiting(){
	clearInterval(called);
	checkedDays.length = 0;
	setAlarmBtn.style.backgroundColor = '#392D75';
	arrows.forEach(arrow => {
		arrow.style.opacity = "1";
		arrow.removeAttribute("aria-hidden");
		arrow.disabled = false;
		arrow.style.cursor = "pointer";
	});
	inputs.forEach(input => {
		input.disabled = false;
	});
	setAlarmBtn.innerHTML = "Ustaw budzik";
	called = false;
	return;
};

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
	//listen if user choose to snooze
	napButtons.forEach(button => {
		button.addEventListener("click", () =>{
			napTimeValue = parseFloat(button.dataset.nap);
			napTime();
		})
	})
	//listen if user choose to stop alarm
	stopBtn.addEventListener("click", stopAlarm);	
}

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

// }());