var wr = chrome.webRequest;
var maps = {};
var cb = function(details) {
    var url = details.url;
    var dstUrl = "";
    var matched = "";
	var protoExp = new RegExp('(http://|https://)','i');
	
    for (var id in maps) {
		var online = maps[id].online.replace(protoExp, ''),
			local = maps[id].local;
        var pattern = new RegExp(online, "i");
        matched = url.match(pattern);
        if (!matched)
            continue;

		var protocol = local.match(protoExp);
		if (protocol)
			protocol = protocol[1];
		else
			protocol = "http://";

		local = local.replace(protoExp, '');
		url = url.replace(protoExp, '');
		dstUrl = protocol + url.replace(pattern, local);
		console.log(pattern, local, url, dstUrl)
        return {redirectUrl: dstUrl};
    }
}
var filter = {urls: []}; // {urls: ["<all_urls>"]};
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    maps[request.id] = {online: request.online, local: request.local};
	
	// update filter
	filter.urls = [];
	for (var id in maps) {
		var matched = maps[id].online.match(new RegExp("(?:http://|https://|^)(.*?)/", "i"));
		if (matched && matched[1]) {
			var host = matched[1];
			if (host.indexOf(':') != -1)
				host = host.substr(0, host.indexOf(':'));
			filter.urls.push("*://" + host + "/*");
		}
	}

    if (request.doBlock)
        chrome.webRequest.onBeforeRequest.addListener(cb, filter, ["blocking"]);
    else
        chrome.webRequest.onBeforeRequest.removeListener(cb);
	
    sendResponse({filter: filter});
});