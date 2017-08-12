
var default_value = {
	"off_work_time": ["17", "30"],
	"final_countdown_url": "https://www.youtube.com/watch?v=9jK-NcRmVcw"
}

function setAlarm() {
	chrome.runtime.sendMessage(setTime(), function(response) {
			console.log(response);
	});
}

function setTime() {
	let off_work_time = document.getElementById("off_work_time").value.split(":");
	
	if (off_work_time.length == 1 && off_work_time[0] == "") {
		off_work_time = default_value.off_work_time;
	}
	
	chrome.storage.sync.set({
		"off_work_time": {"hours" : off_work_time[0], 
						   "minute": off_work_time[1]}
		}, 
		function() {
			console.log("Time settings saved");
		}
	);
	
	let send_message = {
		"Status": "Set",
		"Value": {
			'off_work_time': off_work_time
		}
	}
	return send_message
}

function loadTimeToHtml(time_info) {
	let time_format;
	chrome.storage.sync.get(
		time_info.name, 
		function(items) {
			let time_format;
			try {
				time_format = items[time_info.name]["hours"] + ":" + 
							  items[time_info.name]["minute"] + ":00";
				
			}
			catch (err) {
				time_format = time_info.default_time;
			}
			document.getElementById(time_info.name).value = time_format;
		}
	);
}

function getTime() {
	let time_infos = [
		{
			"name": "off_work_time",
			"default_time": "17:30:00"
		}
	]
	time_infos.forEach(loadTimeToHtml);
}

function init() {
	getTime();
	getURL();
}

window.addEventListener("load", init);

document.addEventListener("DOMContentLoaded", function() {
    var save = document.getElementById("save");
    // onClick"s logic below:
    save.addEventListener("click", function() {
		setAlarm();
    });
});




