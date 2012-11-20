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
	},
	
	showLoading : function(str) {
		if (!str) str = "Generating word cloud...";
		var me = this,
			canvas = me.get("canvas"),
			ctx = canvas[0].getContext('2d');
		
		// Store the current transformation matrix
		ctx.save();
		
		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Restore the transform
		ctx.restore();
		
		ctx.fillStyle = '#333';
		ctx.font = "italic bold 12px 'Lucida Grande', 'Lucida Sans Unicode', Helvetica, Arial, Verdana, sans-serif";
		ctx.textBaseline = 'bottom';
		ctx.fillText(str, 5, 25);
	}
	
});