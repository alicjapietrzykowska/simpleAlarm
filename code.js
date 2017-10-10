
var h1 = document.querySelector("h1");
h1.style.color = "blue";

var date = new Date();

var alarmDays = document.querySelector("#alarmDays");
var inputHour = document.getElementById("setHour");
var inputMinute = document.getElementById("setMinute");
var alarmSecond = "00";

var nap = false;

var days = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piatek','Sobota'];

currentDay = days[date.getDay()];

//After load a page start clock
window.onload = startTime();

//Function to make clock work
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
	// set nap if nap === true
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

//lister if user choose to have nap
napBtn.addEventListener("click", napTime);

//what comes after startTime === setAlarm
function alarm (){
	imgAlarm.style.display = "block";
	audio.play();
	napBtn.addEventListener("click", napTime);
	stopBtn.addEventListener("click", stopAlarm);	
}

//what comes if user choose to nap for some time
function napTime(minute) {
	audio.pause();
	audio.currentTime = 0;
	imgAlarm.style.display = "none";
	nap = true;
}

//what comes if user choose to stop alarm
function stopAlarm() {
	audio.pause();
	audio.currentTime = 0;
	imgAlarm.style.display = "none";
}

//function to add "0" to inputted time if it has only one digit
function checkTime(i){
	if (i < 10){
		return "0" + i;
	} else {
		return i;
	}
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


var allDays = document.getElementsByName("day");
var alarmDays = document.getElementById("alarmDays");
var alarmDaysToRemove = document.getElementById("alarmDaysToRemove");


var checkedDays = [];

for (var i of allDays){
	i.addEventListener("click", checkDay);
}


function checkDay(){
		if (this.checked){
			checkedDays.push(this);
		} 
		else {
			for (var i = 0; i < checkedDays.length; i++){
				if (checkedDays[i].checked === false){
					checkedDays.splice(i, 1);
				}else {
					continue;
				}
			}
		}
};

//start alarm if current time === set alarm
setInterval (function(){ 
	for (var i=0; i < checkedDays.length; i++){
		if (checkedDays[i].value === currentDay){
			if (startTime() === setAlarm()){
				alarm();
			}
		}
	}
}, 1000); 