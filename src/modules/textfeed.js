console.log('Loading Text Feed Module');

EasyDash.availablePods.TextFeedPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({},
		{
			"imgWidth" : 50,
			"titleClassName" : "textPodTitle",
			"textItemClassName" : "textPodItem",
			"imgClassName" : "textPodImg",
			"headerClassName" : "textPodHeader",
			"footerClassName" : "textPodFooter",
			"bodyClassName" : "textPodBody"
		},
		this.constructor.__super__.defaults);
	},
	
	podPostwork : function(pod) {
		this.set("textFeedTitle",
			$('<div/>')
			.html(this.get("podTitle"))
			.addClass(this.get("titleClassName"))
		);
		
		$(pod).append(this.get("textFeedTitle"));
		
		this.set("textFeed", 
			$('<div/>')
			.css("overflow", "auto")
			.height(this.get("podHeight") - this.get("textFeedTitle").height())
		);
		
		$(pod).append(this.get("textFeed"));
	},
	
	updateDashPod : function(data) {
		var me = this;
		
		$(me.get("textFeed")).empty();
		
		_.each(data["data"], function(textItem) {
			var textDiv = $('<div/>')
				.addClass(me.get("textItemClassName"))
			
			textDiv.append($('<img/>')
				.attr("src", textItem["img"])
				.addClass(me.get("imgClassName"))
				.attr("width", me.get("imgWidth"))
			);
			
			textDiv.append($('<div/>')
				.addClass(me.get("headerClassName"))
				.html(textItem["header"])
			);
			
			textDiv.append($('<div/>')
				.addClass(me.get("bodyClassName"))
				.html(textItem["text"])
			);
			
			textDiv.append($('<div/>')
				.addClass(me.get("footerClassName"))
				.html(textItem["footer"])
			);
			
			textDiv.append($('<div/>')
				.css('clear','both')
				.height(0)
			);
			
			$(me.get("textFeed")).append(textDiv);
		});
	}
	
});