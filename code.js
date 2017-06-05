
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
	}else{
		return i;
	}

}

var inputHour = document.getElementById('setHour');
var inputMinute = document.getElementById('setMinute');

inputHour.addEventListener("input", setAlarm);
inputMinute.addEventListener("input", setAlarm);

function setAlarm (){
	var currentTime = startTime();
	var setHour = document.getElementById('setHour').value;
	var formattedHour = ("0" + setHour).slice(-2);
	var setMinute = document.getElementById('setMinute').value;
	var formattedMinute = ("0" + setMinute).slice(-2);
	var second = "00";
	formattedHour = checkTime();

	var alarm = (formattedHour || "00") + ":" + (formattedMinute || "00") + ":" + second;
	document.getElementById("alarmTime").innerHTML = alarm;
	return alarm;
}

setInterval (function(){
	if (startTime() === setAlarm()){
			document.getElementById("imgAlarm").style.display = "block";
	}
}, 1000);

