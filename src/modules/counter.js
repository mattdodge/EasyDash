console.log('Loading Counter Module');

EasyDash.availablePods.CounterPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({}, {
			animationDuration : 215,
			minDigits : 0
		},
		this.constructor.__super__.defaults);
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		var podDiv = $('<div/>')
			.addClass('flip-counter')
			.attr('id',me.get("podId")+'-counter');
			
		var podLabel = $('<div/>')
			.addClass('counter-label')
			.html(me.get("podTitle"));
			
		$(pod).append(podDiv).append(podLabel);
			
		var countObj = new flipCounter(podDiv.attr('id'), {
			auto: false,
			pace: 2000,
			minDigits : me.get("minDigits"),
//			fW : 36, // was 53
//			tFH : 26, // was 39
//			bFH : 43, // was 64
//			bOffset : 265 // was 390
			fW : 53, // was 53
			tFH : 39, // was 39
			bFH : 64, // was 64
			bOffset : 390 // was 390
		});

		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = 
			".flip-counter ul.cd{float:left;list-style-type:none;margin:0;padding:0}" +
			".flip-counter li{background:url('EasyDash/img/digits.png') 0 0 no-repeat}" +
//			".flip-counter li.t{background-position:0 0;width:36px;height:26px}" +
//			".flip-counter li.b{background-position:0 0;width:36px;height:43px}" +
//			".flip-counter li.s{background-position:-37px -719px;width:10px;height:69px}";
			".flip-counter li.t{background-position:0 0;width:53px;height:39px}" +
			".flip-counter li.b{background-position:0 0;width:53px;height:64px}" +
			".flip-counter li.s{background-position:-53px -1030px;width:14px;height:103px}";
			
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
		
		countObj.incrementTo(
			parseInt(data["count"]),
//			12345,
			me.get("refreshInterval")/1000,
			me.get("animationDuration")
		);
		
		me.set("currentCount", curCount + data["count"]);
	}
	
});