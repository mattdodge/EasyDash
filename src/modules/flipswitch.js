console.log('Loading Flip Switch Module');

EasyDash.availablePods.FlipSwitchPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({}, {
			onOn : function(flipSwitchPod) {
				console.log('on');
			},
			onOff : function(flipSwitchPod) {
				console.log('off');
			},
			listening : false
		},
		this.constructor.__super__.defaults);
	},
	
	podPostwork : function(pod) {
		var me = this,
		idString = me.get("podId");
		
		var podDiv = $('<div/>'),
			podTitle = $('<div/>')
				.addClass('flip-switch-title')
				.html(me.get("podTitle"));
		
		$(pod).append(podTitle).append(podDiv);
		
		switchObj = $(podDiv).toggleSwitch({
			onChange : function(on) {
				if (! me.get("listening"))
					return;
					
				if (on) me.get("onOn")(me);
				else me.get("onOff")(me);
			}
		});
		
		me.set("switchObj",switchObj);
		
		css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = 
			"#"+idString+" .toggle{position:relative;display:block;height:30px;margin:5px;}" +
			"#"+idString+" .toggle .label{display:block;float:left;width:40px;overflow:hidden;padding:2px;font-weight:bold;border-style:solid;border-width:1px;text-align:center;text-transform:uppercase;margin:0;text-shadow:0 1px 1px #fff;text-decoration:none;box-shadow:inset 0 0 1px #888;font-size:12px;}" +
			"#"+idString+" .toggle .label.off{-webkit-border-top-left-radius:0;-webkit-border-top-right-radius:2px;-webkit-border-bottom-right-radius:2px;-webkit-border-bottom-left-radius:0;-moz-border-radius-topleft:0;-moz-border-radius-topright:2px;-moz-border-radius-bottomright:2px;-moz-border-radius-bottomleft:0;border-top-left-radius:0;border-top-right-radius:2px;border-bottom-right-radius:2px;border-bottom-left-radius:0;border-color:#b86051;background-color:#df7e6d;color:#8f5247;text-shadow:0 1px 1px #e69d90;}" +
			"#"+idString+" .toggle .label.on{-webkit-border-top-left-radius:2px;-webkit-border-top-right-radius:0;-webkit-border-bottom-right-radius:0;-webkit-border-bottom-left-radius:2px;-moz-border-radius-topleft:2px;-moz-border-radius-topright:0;-moz-border-radius-bottomright:0;-moz-border-radius-bottomleft:2px;border-top-left-radius:2px;border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:2px;border-color:#8baf5d;background-color:#a2c76d;color:#60783f;text-shadow:0 1px 1px #bdd797;}" +
			"#"+idString+" .toggle .label.switch{-webkit-border-top-left-radius:2px;-webkit-border-top-right-radius:2px;-webkit-border-bottom-right-radius:2px;-webkit-border-bottom-left-radius:2px;-moz-border-radius-topleft:2px;-moz-border-radius-topright:2px;-moz-border-radius-bottomright:2px;-moz-border-radius-bottomleft:2px;border-top-left-radius:2px;border-top-right-radius:2px;border-bottom-right-radius:2px;border-bottom-left-radius:2px;float:none;border-color:#bbbbbb;color:#cfcfcf;letter-spacing:2px;background-color:#f0f0f0;position:absolute;left:0;top:0;width:42px;height:20px;margin:-1px;text-shadow:none;box-shadow:0 0 1px #d9d9d9;background-image:linear-gradient(bottom, #ececec 4%, #f9f9f9 52%);background-image:-o-linear-gradient(bottom, #ececec 4%, #f9f9f9 52%);background-image:-moz-linear-gradient(bottom, #ececec 4%, #f9f9f9 52%);background-image:-webkit-linear-gradient(bottom, #ececec 4%, #f9f9f9 52%);background-image:-ms-linear-gradient(bottom, #ececec 4%, #f9f9f9 52%);background-image:-webkit-gradient(linear, left bottom, left top, color-stop(0.04, #ececec), color-stop(0.52, #f9f9f9));}" +
			"#"+idString+" .toggle .label.switch.value-on{border-left-width:0;}" +
			"#"+idString+" .toggle .label.switch.value-off{border-right-width:0;}";
			
		document.head.appendChild(css);
	},
	
	translateData : function(data) {
		return data["data"][0];
	},
	
	updateDashPod : function(data) {
		var me = this,
			switchObj = me.get("switchObj"),
			dataResult = parseInt(data);
			
		if (isNaN(dataResult) || dataResult == 0) {
			switchObj.toggleSwitch('turnOff');
		} else {
			switchObj.toggleSwitch('turnOn');
		}
		
		me.set("listening",true);
	}
	
});