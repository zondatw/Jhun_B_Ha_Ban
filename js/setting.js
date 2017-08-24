
var default_value = {
	"off_work_time": ["17", "30"],
	"ahead_of_time": 6,
	"youtube_url": "https://www.youtube.com/watch?v=9jK-NcRmVcw"
}

function setAlarm() {
	chrome.runtime.sendMessage(setTime(), function(response) {
			console.log(response);
	});
}

function setTime() {
	let off_work_time = document.getElementById("off_work_time").value.split(":");
	let ahead_of_time = document.getElementById("ahead_of_time").value;
	let youtube_url = document.getElementById("youtube_url").value;
	
	if (off_work_time.length == 1 && off_work_time[0] == "") {
		off_work_time = default_value.off_work_time;
	}
	
	if (ahead_of_time == "") {
		ahead_of_time = default_value.ahead_of_time;
	}
	
	if (youtube_url == "") {
		youtube_url = default_value.youtube_url;
	}
	
	chrome.storage.sync.set({
		"off_work_time": {"hours" : off_work_time[0], 
						   "minute": off_work_time[1]},
		"ahead_of_time": ahead_of_time,
		"youtube_url": youtube_url
		}, 
		function() {
			console.log("Time settings saved");
		}
	);
	
	let send_message = {
		"Status": "Set",
		"Value": {
			'off_work_time': off_work_time,
			"ahead_of_time": ahead_of_time,
			"youtube_url": youtube_url
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

function getAheadOfTime() {
	let ahead_of_time;
	chrome.storage.sync.get(
		"ahead_of_time", 
		function(items) {
			if (items.ahead_of_time == undefined) {
				ahead_of_time = default_value.ahead_of_time;
			}
			else {
				ahead_of_time = items.ahead_of_time;
			}
			document.getElementById("ahead_of_time").value = ahead_of_time;
		}
	);
}

function getURL() {
	let url;
	chrome.storage.sync.get(
		"youtube_url", 
		function(items) {
			if (items.youtube_url == undefined) {
				url = default_value.youtube_url;
			}
			else {
				url = items.youtube_url;
			}
			document.getElementById("youtube_url").value = url;
		}
	);
}

function init() {
	getTime();
	getAheadOfTime();
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




