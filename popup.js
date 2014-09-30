document.addEventListener('DOMContentLoaded', function () {
	var $ = function(selector, parent) {return (parent || document).querySelector(selector);},
		$$ = function(selector, parent) {return (parent || document).querySelectorAll(selector);};
	
	$('#launch_app').onclick = function() {
		chrome.management.getAll(function(data) {
			var id = "";
			var whistleProxy = data.filter(function(e) {
				return e.name.toLowerCase().indexOf("whistle-proxy") != -1;
			});
			if (whistleProxy && whistleProxy[0]) {
				whistleProxy = whistleProxy[0];
				id = whistleProxy.id;
			}
			
			try {
				chrome.management.launchApp(id);
			} catch (e) {
				alert('LaunchApp Failed...');
			}
		});
		
	}
	
	if (!localStorage['rules'])
		localStorage['rules'] = JSON.stringify({});
	var rulesConfig = JSON.parse(localStorage['rules']) || {}; 
	
// 	sendConfig({doBlock: switcher.checked, online: online.value, local: local.value});
	function sendConfig(config) {
		if (!config.id) {
			console.warn('no rule id');
			return;
		}
		var rule = rulesConfig[config.id] || {};
		rule['doBlock'] = config.doBlock;
		rule['online'] = config.online;
		rule['local'] = config.local;
		rulesConfig[config.id] = rule;
		localStorage['rules'] = JSON.stringify(rulesConfig);
		
		chrome.extension.sendRequest(config,
			function(response) {
				console.log("response", response);
				chrome.tabs.reload();
		});
	}
	
	// rules operation
	var rulesForm = $('#rules_form');
	var ruleTpl = $("#rule0").innerHTML;
	
	for (var i=0; i<5; i++) {
		var rule = document.createElement("legend");
		rule.innerHTML = ruleTpl;
		rule.id = "rule" + (i+1);
		rulesForm.appendChild(rule);
	}
	
	var legends = [].splice.call($$("legend", rulesForm), 0);
	legends.forEach(function(rule) {
		var switcher = $('.switcher', rule),
			online = $('.online', rule),
			local = $('.local', rule);
		switcher.checked = rulesConfig[rule.id]['doBlock'] ? true:false;
		switcher.onchange = onChange.bind(switcher);
		
		online.oninput = onChange.bind(online);
		local.oninput = onChange.bind(local);
		online.value = rulesConfig[rule.id]['online'] || "";
		local.value = rulesConfig[rule.id]['local'] || "";
		function onChange(e) {
			if (e.target == local || e.target == online) {
				if (switcher.checked)
					switcher.checked = false;
				return;
			}
			// for switcher
			if (switcher.checked && (!online.value || !local.value))
				return;
				
			sendConfig({
				id: rule.id, 
				doBlock: switcher.checked, online: online.value, local: local.value
			});
		}
		
	});
	
});
