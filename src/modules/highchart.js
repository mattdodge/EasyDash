console.log('Loading HighCharts Module');

EasyDash.availablePods.HighChartsPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({},
		{
			"chartType" : "scatter",
			"chartOptions" : {},
			"getFormat" : null
		},
		this.constructor.__super__.defaults);
	},
	
	basicChartOptions : {
		"chart" : {
			"backgroundColor" : "rgba(255,255,255,0)"
		},
		"credits" : {
			"enabled" : false
		}
	},
	
	podPrework : function() {
		this.set("myOptions", $.extend(true, {}, this.basicChartOptions, this.get("chartOptions")));
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		me.chart = new Highcharts.Chart($.extend(true, {
			chart: {
				renderTo: pod,
				type: me.get("chartType")
			},
			title: {
				text: me.get("podTitle")
			}
		},
		me.get("myOptions")));
	},
	
	translateData : function(data) {
		var me = this,
			newData = [],
			seriesMappings = {},
			totalSeries = 0;
		
		_.each(data["series"], function(series) {
			var seriesData = {
				name : series["name"],
				data : []
			};
			
			if (series["seriesOptions"]) {
				$.extend(seriesData, series["seriesOptions"]);
			}
			
			newData.push(seriesData);
			seriesMappings[series["name"]] = totalSeries;
			totalSeries++;
		});
		
		// create the data points
		_.each(data["data"], function(dataPoint) {
			
			for(seriesName in seriesMappings) {
				if (seriesName in dataPoint) {
					//this is our point
					var pointYData = [
						dataPoint['x'],
						parseFloat(dataPoint[seriesName])
					];
					
					newData[seriesMappings[seriesName]].data.push(pointYData);
				} 
				
			}
		});
		
		return newData;
	},
	
	updateDashPod : function(data) {
		var me = this;
		
		_.each(data, function(seriesConfig) {
			// see if series exists already
			var existingSeries = _.find(me.chart.series, function(series) {
				return series.name == seriesConfig["name"];		
			});
			
			if (existingSeries) {
				existingSeries.setData(seriesConfig["data"]);
			} else {
				// otherwise add the series
				me.chart.addSeries(seriesConfig);
			}
		});
	}
});
