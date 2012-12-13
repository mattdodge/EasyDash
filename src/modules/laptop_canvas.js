EasyDash.availablePods.LaptopCanvasPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({}, 
			this.constructor.__super__.defaults,
		{});
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		var canvas = $('<div/>')
			.css('height','100%')
			.css('overflow','auto');
		$(pod).append(canvas);
		me.set("canvas",canvas);
	},
	
	updateDashPod : function(data) {
		var me = this,
			canvas = me.get("canvas");
		
		if ("text" in data) {
			canvas.html(data["text"]);
		}
		
		if ("backgroundColor" in data) {
			canvas.css('background-color', data["backgroundColor"]);
		}
	}
});