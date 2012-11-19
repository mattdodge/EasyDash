console.log('Loading Word Cloud Module');

EasyDash.availablePods.WordCloudPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({
			canvasHeight: 200,
			canvasWidth: 200
		},
		this.constructor.__super__.defaults);
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		var cloudCanvas = $('<canvas/>')
			.attr('width', me.get("canvasWidth"))
			.attr('height', me.get("canvasHeight"));
			
		$(pod).append(cloudCanvas);
		
		me.set("canvas",cloudCanvas);
	},
	
	updateDashPod : function(data) {
		var me = this,
			canvas = me.get("canvas");
		
		canvas.wordCloud($.extend(true, {
			wordList: data
		}, me.get("wordCloudParams")));
	}
	
});