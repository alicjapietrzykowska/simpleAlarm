
var h1 = document.querySelector("h1");
h1.style.color = "blue";

function startTime (){
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	var currentTime = hours + ":" + minutes + ":" + seconds;
	console.log(currentTime);
	document.getElementById("currentTime").innerHTML = currentTime;
	setTimeout(startTime, 500);
	return currentTime;
}

function checkTime(i){
	if (i < 10){
		return "0" + i;
	} else {
		return i;
	}
}

var inputHour = document.getElementById('setHour');
var inputMinute = document.getElementById('setMinute');

inputHour.oninput = function () {
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
}

inputMinute.oninput = function () {
	if (this.value.length >= 2){
		this.value = this.value.slice(0,2);
	}
}

inputHour.addEventListener("input", setAlarm);
inputMinute.addEventListener("input", setAlarm);


function setAlarm (){
	var currentTime = startTime();
	var formattedHour = inputHour.value || "0";
	var formattedMinute = inputMinute.value || "0";
	var second = "00";
	if (formattedHour > 24){
		formattedHour = formattedHour.length[0];
	}
	if (formattedMinute > 60){
		formattedMinute = formattedMinute.length[0];
	}
	formattedHour = checkTime(formattedHour);
	formattedMinute = checkTime(formattedMinute);
	var alarm = (formattedHour || "00") + ":" + (formattedMinute || "00") + ":" + second;
	document.getElementById("alarmTime").innerHTML = alarm;
	return alarm;
}

setInterval (function(){ 
	if (startTime() === setAlarm() ){
			document.getElementById("imgAlarm").style.display = "block";
	} else {
		document.getElementById("imgAlarm").style.display = "none";
	}
}, 1000); 

document.querySelector("input").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});