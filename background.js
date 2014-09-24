/*chrome.browserAction.onClicked.addListener(function(tab) {
	console.log(tab);
});

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://2think.sinaapp.com/pt", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON解析器不会执行攻击者设计的脚本.
    var resp = JSON.parse(xhr.responseText);
    console.log(resp)
  }
}
xhr.send();
*/
var wr = chrome.webRequest;
var cb = function(details) {
	var url = details.url;
	var dstUrl = "http://127.0.0.1/static/";
	var matched = "";
	var srcUrl = "2think.sinaapp.com".replace(".", "\.") + "/static/(.*)".replace("/", "\/");
	if (matched = url.match(new RegExp(srcUrl, "i"))) {
		console.log(matched[1]);
		dstUrl += matched[1];
		return {redirectUrl: dstUrl};
	}
}
var filter = {urls: ["<all_urls>"]};
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request.doBlock)
	if (request.doBlock)	
		chrome.webRequest.onBeforeRequest.addListener(cb, filter, ["blocking"]);
	else
		chrome.webRequest.onBeforeRequest.removeListener(cb);
	sendResponse();
})
