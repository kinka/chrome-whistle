var wr = chrome.webRequest;
var maps = {};
var cb = function(details) {
	var url = details.url;
	var dstUrl = "http://127.0.0.1/static/";
	var matched = "";
	for (var online in maps) {
		var pattern = new RegExp(online, "i");
		matched = url.match(pattern);
// 		console.log(url, matched, maps[online], online);
		if (!matched) continue;
		
		console.log(url.replace(pattern, maps[online]))
		return {redirectUrl: url.replace(pattern, maps[online])};
	};
}
var filter = {urls:[]}; // {urls: ["<all_urls>"]};
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request);
	maps = {};
	maps[request.online] = request.local;
	console.log(maps)
	var matched = request.online.match(new RegExp("(?:http://|^)(.*?)/","i"));
	if (matched && matched[1])
		filter.urls = ["*://" + matched[1]+"/*"];
	else
		return sendResponse("failed " + matched);
	console.log(filter.urls)
	if (request.doBlock)
		chrome.webRequest.onBeforeRequest.addListener(cb, filter, ["blocking"]);
	else
		chrome.webRequest.onBeforeRequest.removeListener(cb);
	sendResponse();
})
