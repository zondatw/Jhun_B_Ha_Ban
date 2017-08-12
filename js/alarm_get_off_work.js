var whenToRing = {
	"off_work_time": new Date().setHours(17, 30, 00)
};
var final_countdown_url = "https://www.youtube.com/watch?v=9jK-NcRmVcw";
var off_work_icon = "../icon/ready_get_off_work.png";
var minute_seconds = 60000;

function create_alarm() {
	chrome.alarms.clearAll();
	
	let now_time = new Date().getTime();
	if (now_time < whenToRing.off_work_time) {
		chrome.alarms.create(
			"OffWorkAlarm", 
			{when: whenToRing.off_work_time - 6 * minute_seconds, periodInMinutes: 24 * 60}
		);
		console.log("OffWorkAlarm Create~~~");
	}
	else {
		whenToRing.off_work_time += day_seconds;
		chrome.alarms.create(
			"OffWorkAlarm", 
			{when: whenToRing.off_work_time - 6 * minute_seconds, periodInMinutes: 24 * 60}
		);
		console.log("Tomorrow OffWorkAlarm Create~~~");
	}
}

function sleep(milliseconds) {
  let start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

function setAlarmTime(time_info) {
	let time_format;
	chrome.storage.sync.get(
		time_info.name, 
		function(items) {
			let time_format;
			try {
				time_format = new Date().setHours(
					items[time_info.name]["hours"],
					items[time_info.name]["minute"], 00);
				
			}
			catch (err) {
				time_format = time_info.default_time;
			}
			whenToRing[time_info.name] = time_format;
			create_alarm();
		}
	);
}

function getTime() {
	let time_infos = [
		{
			"name": "off_work_time",
			"default_time": new Date().setHours(17, 30, 00)
		}
	]
	time_infos.forEach(setAlarmTime);
}


function getURL() {
	let url;
	chrome.storage.sync.get(
		"final_countdown_url", 
		function(items) {
			let time_format;
			if (items.final_countdown_url != undefined) {
				final_countdown_url = items.final_countdown_url;
			}
			
		}
	);
}

function init() {
	getURL();
	chrome.storage.sync.get(
		"off_work_time", 
		function(items) {
			try {
				items["off_work_time"]["hours"];
				getTime();
			}
			catch(err) {
				console.log("First use~~");
				create_alarm();
			}
		}
	)
}

function timstampTotime(timestamp) {
	date = new Date(timestamp);
	datevalues = [
	   date.getFullYear(),
	   date.getMonth()+1,
	   date.getDate(),
	   date.getHours(),
	   date.getMinutes(),
	   date.getSeconds(),
	];
	return datevalues
}

function main() {
	console.log("Time to get off work start");
	init();
}


chrome.alarms.onAlarm.addListener(function(alarm) {
	let notify;
	if (alarm.name == "OffWorkAlarm") {
		notify = new Notification("準B哈班", {
			body: "準B哈班瞜~~~~~",
			icon: off_work_icon
		});
		chrome.tabs.create({url: final_countdown_url});
	}
	sleep(1000);
});


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.Status === "Set") {
			whenToRing.off_work_time = new Date()
				.setHours(
					request.Value.off_work_time[0], 
					request.Value.off_work_time[1], 0);
			create_alarm();
			sendResponse('sendMessage success!');
		}
});

main();