console.log('Loading Card Count Module');

EasyDash.availablePods.CardCount = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({}, 
			this.constructor.__super__.defaults,
		{
			animationDuration : 500,
			refreshInterval : 5000,
			topFormat : this.topFormat,
			bottomFormat : this.bottomFormat
		});
	},
	
	topFormat : function(str) {
		return str;
	},
	
	bottomFormat : function(str) {
		return str;
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		var totalCount = $('<span/>')
			.addClass('social-count');
			
		var diffCount = $('<span/>')
			.addClass('social-count-delta');
			
		var clickText = $('<span/>')
			.addClass('click-text')
			.html('<b>Click</b> for real-time chart');
			
		$(pod).append(totalCount).append(diffCount).append(clickText);
			
		me.set("totalCount",totalCount);
		me.set("diffCount",diffCount);

		me.set("currentCount",null);
		
		me.set("animationInterval", setInterval(function() {
			if (me.get("countTo")) {
			// should we have started counting?
				
				if (me.get("currentCount") + me.get("countIncrement") >= me.get("countTo")) {
					$(me.get("totalCount")).html(me.get("topFormat")(me.get("countTo")));
					me.set("currentCount", me.get("countTo"));
				} else {
					$(me.get("totalCount")).html(me.get("topFormat")(me.get("currentCount") + me.get("countIncrement")));
					me.set("currentCount", me.get("currentCount") + me.get("countIncrement"));
				}
			}
		}, me.get("animationDuration")));
	},
	
	translateData : function(data) {
		return data;
	},
	
	updateDashPod : function(data) {
		var me = this,
			diffCount = me.get("diffCount");
		
		diffCount.html(me.get("bottomFormat")(data["bottom"]));
		diffCount.removeClass("social-count-delta-positive");
		diffCount.removeClass("social-count-delta-negative");
		diffCount.addClass(data["bottomClass"]);
		
		me.drawCount(parseInt(data["top"]));
	},
	
	drawCount : function(newCount) {
		var me = this,
			countDiv = $(me.get("totalCount")),
			oldCount = me.get("currentCount");
			
		if (oldCount == null) {
		// there was nothing before
		// put the first count and then start the animation function
			countDiv.html(me.get("topFormat")(newCount));
			me.set("currentCount", newCount);
			me.set("countTo", newCount);
			me.set("countIncrement", 0);
			
			return;
		}
		
		var numAnimations = (me.get("refreshInterval") / me.get("animationDuration")).toFixed(0),
			differenceToAnimate = newCount - oldCount,
			changePerAnimation = differenceToAnimate/numAnimations;
	
		me.set("countTo", newCount);
		me.set("countIncrement", changePerAnimation);
	}
	
});