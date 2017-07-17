
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
var second = "00";

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

inputHour.addEventListener("input", setAlarm);
inputMinute.addEventListener("input", setAlarm);


function setAlarm (){
	var currentTime = startTime();
	var formattedHour = inputHour.value || "0";
	var formattedMinute = inputMinute.value || "0";
	formattedHour = checkTime(formattedHour);
	formattedMinute = checkTime(formattedMinute);
	var alarm = (formattedHour || "00") + ":" + (formattedMinute || "00") + ":" + "00";
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