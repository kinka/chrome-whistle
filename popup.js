document.addEventListener('DOMContentLoaded', function () {
	var switcher = document.querySelector('#switcher')
	switcher.checked = localStorage['doBlock'] ? true:false;
	switcher.addEventListener('change', function() {
		console.log(this.checked, localStorage['doBlock'])
		var _doBlock = this.checked;
		chrome.extension.sendRequest({doBlock: this.checked},
			function(response) {
				localStorage['doBlock'] = _doBlock;
				console.log(response);
				chrome.tabs.reload();
			});
	});
});
