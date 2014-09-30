var wr = chrome.webRequest;
var maps = {};
var cb = function(details) {
    var url = details.url;
    var dstUrl = "";
    var matched = "";
    for (var id in maps) {
		var online = maps[id].online,
			local = maps[id].local;
        var pattern = new RegExp(online, "i");
        matched = url.match(pattern);
//         		console.log(url, matched, local, online);
        if (!matched)
            continue;

        // 		console.log(url.replace(pattern, local))
		dstUrl = url.replace(pattern, local).replace('https://', 'http://');
        return {redirectUrl: dstUrl};
    }
}
var filter = {urls: []}; // {urls: ["<all_urls>"]};
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log(request);
    maps[request.id] = {online: request.online, local: request.local};
    console.log(maps)
	
	// update filter
	filter.urls = [];
	for (var id in maps) {
		var matched = maps[id].online.match(new RegExp("(?:http://|^)(.*?)/", "i"));
		if (matched && matched[1])
			filter.urls.push("*://" + matched[1] + "/*");
	}

    console.log('filter', filter.urls)
    if (request.doBlock)
        chrome.webRequest.onBeforeRequest.addListener(cb, filter, ["blocking"]);
    else
        chrome.webRequest.onBeforeRequest.removeListener(cb);
	
    sendResponse('response from background.js');
});