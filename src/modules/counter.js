console.log('Loading Counter Module');

EasyDash.availablePods.CounterPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({}, {
			animationDuration : 215,
			minDigits : 0,
			digitsImg: 'EasyDash/img/digits.png',
			fw : 53,
			tfh : 39,
			bfh : 64,
			boff : 390
		},
		this.constructor.__super__.defaults);
	},
	
	podPostwork : function(pod) {
		var me = this,
		idString = me.get("podId")+'-counter';
		
		var podDiv = $('<div/>')
			.addClass('flip-counter')
			.attr('id',idString);
			
		var podLabel = $('<div/>')
			.addClass('counter-label')
			.html(me.get("podTitle"));
			
		$(pod).append(podDiv).append(podLabel);
		
		fw = me.get("fw"),
		tfh = me.get("tfh"),
		bfh = me.get("bfh"),
		boff = me.get("boff");
		
		var countObj = new flipCounter(podDiv.attr('id'), {
			auto: false,
			pace: 2000,
			minDigits : me.get("minDigits"),
			fW : fw, 
			tFH : tfh,
			bFH : bfh,
			bOffset : boff
		});

		
		
		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = 
			"#"+idString+" ul.cd{float:left;list-style-type:none;margin:0;padding:0}" +
			"#"+idString+" li{background:url('" + me.get("digitsImg") + "') 0 0 no-repeat}" +
			"#"+idString+" li.t{background-position:0 0;width:" + fw + "px;height:" + tfh + "px}" +
			"#"+idString+" li.b{background-position:0 0;width:" + fw + "px;height:" + bfh + "px}" +
			"#"+idString+" li.s{background-position:-" + fw + "px -" + (bfh * 10 + boff) + "px;width:" + (fw * 14 / 53) + "px;height:" + (tfh + bfh) + "px}";
			
		document.head.appendChild(css);
		
		me.set("countObj", countObj);
		me.set("currentCount",0);
	},
	
	translateData : function(data) {
		return data["data"][0];
	},
	
	updateDashPod : function(data) {
		var me = this,
			curCount = me.get("currentCount"),
			countObj = me.get("countObj");
		
		if (curCount == 0) {
			countObj.setValue(data["count"]);
		} else {
			countObj.incrementTo(
				parseInt(data["count"]),
				me.get("refreshInterval")/1000,
				me.get("animationDuration")
			);
		}
		
		me.set("currentCount", curCount + data["count"]);
	}
	
});