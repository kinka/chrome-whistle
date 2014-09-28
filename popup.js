document.addEventListener('DOMContentLoaded', function () {
	var $ = function(selector) {return document.querySelector(selector);},
		$$ = function(selector) {return document.querySelectorAll(selector);};
	
	var switcher = $('.switcher'),
		online = $('.online'),
		local = $('.local');
	switcher.checked = localStorage['doBlock'] ? true:false;
	switcher.addEventListener('change', function() {
		console.log(this.checked, localStorage['doBlock'])

		sendConfig({doBlock: switcher.checked, online: online.value, local: local.value});
	});
	
	
	online.oninput = onChange.bind(online);
	local.oninput = onChange.bind(local);
	online.value = localStorage['online'] || "www.logger.im/static/";
	local.value = localStorage['local'] || "http://127.0.0.1:888";

	function onChange() {
		if (switcher.checked)
			switcher.checked = false;
	}
	
	sendConfig({doBlock: switcher.checked, online: online.value, local: local.value});
	function sendConfig(config) {
		chrome.extension.sendRequest(config,
			function(response) {
				localStorage['doBlock'] = config.doBlock;
				localStorage['online'] = config.online;
				localStorage['local'] = config.local;
				console.log(response);
				chrome.tabs.reload();
		});
	}
});
