var alarmDays = document.querySelector("#alarmDays");
var inputHour = document.getElementById("setHour");
var inputMinute = document.getElementById("setMinute");
var setAlarmBtn = document.getElementById("setAlarmBtn");
var alarmSecond = "00";

//variables to change alarm time by arrows
var arrows = document.getElementsByClassName("fa");
var increaseHour = document.querySelector("#increaseHour");
var increaseMinute = document.querySelector("#increaseMinute");
var reduceHour = document.querySelector("#reduceHour");
var reduceMinute = document.querySelector("#reduceMinute");

//Default nap status
var nap = false;
var napTimeValue = 5;

//Current date
var days = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piatek','Sobota'];
var date = new Date();
var currentDay = days[date.getDay()];

//listen to setAlarmBtn to start main functions
var called = false;
setAlarmBtn.addEventListener("click", function(){
	if (called){
		stopWaiting();
	} else {
		waitForAlarm();
	}
});

//functions for arrows


increaseHour.addEventListener("mousedown", function(){
	if (inputHour.value == 23){
		inputHour.value = "00";
	} else {
		inputHour.value = parseFloat(inputHour.value) + 1;
		inputHour.value = checkTime(inputHour.value);
	}
	// setAlarm();
});

increaseMinute.addEventListener("click", function(){
	if (inputMinute.value == 59){
		inputMinute.value = "00";
	} else {
		inputMinute.value = parseFloat(inputMinute.value) + 1;
		inputMinute.value = checkTime(inputMinute.value);
	}
	// setAlarm();
});

reduceHour.addEventListener("click", function(){
	if (inputHour.value == 0){
		inputHour.value = "23";
	} else {
		inputHour.value = parseFloat(inputHour.value) - 1;
		inputHour.value = checkTime(inputHour.value);
	}
	// setAlarm();
});

reduceMinute.addEventListener("click", function(){
	if (inputMinute.value == 00){
		inputMinute.value = "59";
	} else {
		inputMinute.value = parseFloat(inputMinute.value) - 1;
		inputMinute.value = checkTime(inputMinute.value);
	}
});


//function to add "0" to inputted time if it has only one digit
function checkTime(i){

	// else 
	if (i == 0 || i == 00){
		return "00";
	}else if (i[0] == 0){
		i = i.slice(0,2);
		return i;
	} 
	else if (i < 10){
		return "0" + i;
	} else {
		return i;
	}
}

//Function to make clock work
function startTime (){
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	hours = checkTime(hours);
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	var currentTime = hours + ":" + minutes + ":" + seconds;
	document.getElementById("currentTime").innerHTML = currentTime + " " + currentDay;
	window.setTimeout(startTime, 500);
	return currentTime;
}

//After load a page start clock
window.onload = startTime();

function setAlarm (){
	var formattedHour = inputHour.value;
	var formattedMinute = inputMinute.value;

	formattedHour = checkTime(formattedHour);
	inputHour.value = formattedHour;
	// set nap if nap === true
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
	var alarmTime = formattedHour + ":" + formattedMinute + ":" + alarmSecond;
	document.getElementById("alarmTime").innerHTML = formattedHour + ":" + formattedMinute;
	return alarmTime;
}

var audio = document.getElementById("music");
var napBtn = document.getElementById("napBtn");
var stopBtn = document.getElementById("stopBtn");
// var imgAlarm = document.getElementById("imgAlarm");

//lister if user choose to have nap
napBtn.addEventListener("click", napTime);

//what comes after startTime === setAlarm
function alarm (){
	// imgAlarm.style.display = "block";
	audio.play();
	napBtn.addEventListener("click", napTime);
	stopBtn.addEventListener("click", stopAlarm);	
}

//what comes if user choose to nap for some time
function napTime(minute) {
	audio.pause();
	audio.currentTime = 0;
	// imgAlarm.style.display = "none";
	nap = true;
}

//what comes if user choose to stop alarm
function stopAlarm() {
	audio.pause();
	audio.currentTime = 0;
	// imgAlarm.style.display = "none";
}


//prevent input from setting number greater than 23, slice it to two digit if more
inputHour.oninput = function () {
	if (this.value > 23){
		this.value = this.value[0];
	}
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
}

//prevent input from setting number greater than 59, slice it to two digit if more
inputMinute.oninput = function () {
	if (this.value > 59){
		this.value = this.value[0];
	}
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
}

//function to prevent input other than digits to hours
document.querySelector("#setHour").addEventListener("keypress", function (evt) {
    if (evt.which > 57 || evt.which > 93)
    {
        evt.preventDefault();
    }
});

//function to prevent input other than digits to minutes
document.querySelector("#setMinute").addEventListener("keypress", function (evt) {
    if (evt.which > 57 || evt.which > 93)
    {
        evt.preventDefault();
    }
});

//check day to set alarm
var allDays = document.getElementsByName("day");
var fewDays = document.getElementsByName("fewDays");
var weekendDays = document.querySelectorAll(".weekend");
var allWeekdays = document.querySelectorAll(".weekdays");
var allWeek = document.querySelector("#allWeek");
var weekdays = document.querySelector("#weekdays");
var weekend = document.querySelector("#weekend");

var checkedDays = [];

allWeek.addEventListener('click', function(){
	if (allWeek.checked){
		for (var i = 0; i < allDays.length; i++){
			allDays[i].checked = true;
		}	
	} else {
		for (var i = 0; i < allDays.length; i++){
			allDays[i].checked = false;
		}	
	}
})

weekdays.addEventListener('click', function(){
	if (weekdays.checked){
		for (var i = 0; i < (allDays.length-2); i++){
			allDays[i].checked = true;
		}	
	} else {
		for (var i = 0; i < (allDays.length-2); i++){
			allDays[i].checked = false;
		}	
	}
});

weekend.addEventListener('click', function(){
	if (weekend.checked){
		for (var i = 0; i < weekendDays.length; i++){
			weekendDays[i].checked = true;
		}	
	} else {
		for (var i = 0; i < weekendDays.length; i++){
			weekendDays[i].checked = false;
		}	
	}
});

function checkDay (){
	for (var i = 0; i < allDays.length; i++) {
		if (allDays[i].checked){
			if(checkedDays.includes(allDays[i])){
				continue;
			}
			checkedDays.push(allDays[i]);
		} else {
			if (checkedDays.includes(allDays[i])){
				checkedDays.splice(checkedDays.indexOf(allDays[i]), 1);
			}
		}
	}
};


//start alarm if current time === set alarm
function waitForAlarm (){
	console.log("klik!");
	setAlarmBtn.style.backgroundColor = '#6d60a5';
	setAlarmBtn.innerHTML = "Zatrzymaj budzik";
	inputHour.disabled = true;
	inputMinute.disabled = true;
	for (var i = 0; i< arrows.length; i++){
		arrows[i].style.opacity = "0";
		arrows[i].setAttribute("aria-hidden", "true");
		arrows[i].disabled = true;
		arrows[i].style.cursor = "default";
	};
	for (var i = 0; i < allDays.length; i++){
		allDays[i].disabled = true;
	};
	for (var i = 0; i < fewDays.length; i++){
		fewDays[i].disabled = true;
	};
	called = setInterval (function(){
		checkDay();
		for (var i=0; i < checkedDays.length; i++){
			if (checkedDays[i].value === currentDay){
				if (startTime() === setAlarm()){
					alarm();
				}
			}
		}
	}, 1000);
}

function stopWaiting(){
	console.log("stop!");
	clearInterval(called);
	checkedDays.length = 0;
	setAlarmBtn.style.backgroundColor = '#392D75';
	inputHour.disabled = false;
	inputMinute.disabled = false;
	for(var i = 0; i< arrows.length; i++){
		arrows[i].style.opacity = "1";
		arrows[i].removeAttribute("aria-hidden");
		arrows[i].disabled = false;
		arrows[i].style.cursor = "pointer";
	};
	for (var i = 0; i < allDays.length; i++){
		allDays[i].disabled = false;
	};
	for (var i = 0; i < fewDays.length; i++){
		fewDays[i].disabled = false;
	};
	setAlarmBtn.innerHTML = "Ustaw budzik";
	called = false;
	return;
}
