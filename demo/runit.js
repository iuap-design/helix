function runitBtnClick() {
	var exeScripts = document.getElementById("runit").value;
	var runHistory = getRunHistory();
	var idx = runHistory.indexOf(exeScripts)
	if (idx != -1) {
		runHistory.splice(idx, 1);
	}
	runHistory.unshift(exeScripts)
	updateRunHistory(runHistory);

	document.getElementById("errorMsg").innerHTML = ""
	var callFun = new Function("vm", "return " + exeScripts)
	try {
		var val = callFun(vm);
		if (val)
			printMsg(val)
	} catch (e) {
		printMsg(e.stack)
	}
}

function printMsg(msg) {
	var _msg;
	if (msg) {
		if (msg.$$owner) {
			_msg = JSON.stringify(msg.$$owner)
		} else if (msg.$$model) {
			_msg = JSON.stringify(msg.$$model)
		} else if (typeof msg == "object") {
			_msg = JSON.stringify(msg.$$model)
		} else {
			_msg = msg;
		}
		if (_msg)
			document.getElementById("errorMsg").innerHTML = _msg + "".replace(/\n/ig, "<br>")
	}
}
$(function() {

	var runHistory = getRunHistory();
	if (typeof getCustomArray == "function") {
		runHistory = (getCustomArray());
	}
	var runHistoryDiv = $("#runHistory");
	var runitText = document.getElementById("runit");
	$.each(runHistory, function(i, x) {
		if (i == 0) {
			runitText.value = x;
		}
		runHistoryDiv.append("<p>" + x + "</p>")
	});
	runHistoryDiv.on("dblclick", "p", function() {
		var runHistory = getRunHistory();

		var idx = runHistory.indexOf($(this).html())
		runHistory.splice(idx, 1);
		updateRunHistory(runHistory)
		$(this).remove();

	})

	runHistoryDiv.on("click", "p", function() {
		runitText.value = $(this).html();
	})


})
var getRunHistory = function() {
	var __runit__ = localStorage["__runit__"];
	var runHistory = __runit__ ? JSON.parse(__runit__) : [];
	return runHistory;
}
var updateRunHistory = function(runHistory) {
	localStorage["__runit__"] = JSON.stringify(runHistory);

}