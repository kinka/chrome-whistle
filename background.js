var wr = chrome.webRequest;
var maps = {};
var cb = function(details) {
	var url = details.url;
	var dstUrl = "http://127.0.0.1/static/";
	var matched = "";
	for (var online in maps) {
		matched = url.match(new RegExp(online+"(.*)", "i"));
// 		console.log(url, matched, maps[online], online);
		if (!matched) continue;
		
		console.log(maps[online]+'/' + matched[1])
		return {redirectUrl: maps[online]+'/' + matched[1]};
	};
}
var filter = {urls: ["<all_urls>"]};
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request);
	maps[request.online] = request.local;
	if (request.doBlock)	
		chrome.webRequest.onBeforeRequest.addListener(cb, filter, ["blocking"]);
	else
		chrome.webRequest.onBeforeRequest.removeListener(cb);
	sendResponse();
})
