
var h1 = document.querySelector("h1");
h1.style.color = "blue";

	var date = new Date();

var inputHour = document.getElementById('setHour');
var inputMinute = document.getElementById('setMinute');
var alarmSecond = "00";

var nap = false;

var days = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piatek','Sobota'];
currentDay = days[date.getDay()];

window.onload = startTime();

function startTime (){
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	var currentTime = hours + ":" + minutes + ":" + seconds;
	document.getElementById("currentTime").innerHTML = currentTime + " " + currentDay;
	window.setTimeout(startTime, 500);
	return currentTime;
}

inputHour.addEventListener("input", setAlarm);
inputMinute.addEventListener("input", setAlarm);

function setAlarm (){
	var formattedHour = inputHour.value || "0";
	var formattedMinute = inputMinute.value || "0";
	formattedHour = checkTime(formattedHour);
	formattedHour = formattedHour || "00";
	formattedMinute = formattedMinute || "00";

	if (nap === true){
		formattedMinute = parseFloat(formattedMinute) + 5;
		if (formattedMinute > 59){
			formattedHour = parseFloat(formattedHour) + 1;
			formattedMinute = String(formattedMinute).charAt(1);
		}
		inputHour.value = formattedHour;
		inputMinute.value = formattedMinute;

		nap = false;
	}
	formattedMinute = checkTime(formattedMinute);
	var alarmTime = formattedHour + ":" + formattedMinute + ":" + alarmSecond;
	document.getElementById("alarmTime").innerHTML = alarmTime;
	return alarmTime;
}

var audio = document.getElementById("music");
var napBtn = document.getElementById("napBtn");
var stopBtn = document.getElementById("stopBtn");
var imgAlarm = document.getElementById("imgAlarm");

// setInterval (function(){ 
// 	if (startTime() === setAlarm() ){
// 		alarm();
// 	}
// }, 1000); 


napBtn.addEventListener("click", napTime);

function alarm (){
	imgAlarm.style.display = "block";
	audio.play();
	napBtn.addEventListener("click", napTime);
	stopBtn.addEventListener("click", stopAlarm);	
}

function napTime(minute) {
	audio.pause();
	audio.currentTime = 0;
	imgAlarm.style.display = "none";
	nap = true;
}

function stopAlarm() {
	audio.pause();
	audio.currentTime = 0;
	imgAlarm.style.display = "none";
}


function checkTime(i){
	if (i < 10){
		return "0" + i;
	} else {
		return i;
	}
}

inputHour.oninput = function () {
	if (this.value > 23){
		this.value = this.value[0];
	}
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
}

inputMinute.oninput = function () {
	if (this.value > 59){
		this.value = this.value[0];
	}
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
}


document.querySelector("#setHour").addEventListener("keypress", function (evt) {
    if (evt.which > 57 || evt.which > 93)
    {
        evt.preventDefault();
    }
});

document.querySelector("#setMinute").addEventListener("keypress", function (evt) {
    if (evt.which > 57 || evt.which > 93)
    {
        evt.preventDefault();
    }
});

var allDays = document.querySelector("fieldset");

allDays.addEventListener("click", checkDay);

function checkDay (evt){
	if (evt.target.name === "day"){
		if (evt.target.checked){
			if (evt.target.value === currentDay){
				alarmDays.innerHTML = evt.target.value;
			}
		}
	}
}
var alarmDays = document.querySelector("#alarmDays");

setInterval (function(){ 
	if (startTime() === setAlarm()){
		alarm();
	}
}, 1000); 