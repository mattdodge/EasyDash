console.log('Loading Google Charts Module');

EasyDash.availablePods.GoogleChartsPod = EasyDash.DashPod.extend({

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
		"interpolateNulls" : true,
		"lineWidth" : 1,
		"hAxis" : {"viewWindowMode" : "pretty"},
		"vAxis" : {"viewWindowMode" : "pretty"},
		"backgroundColor" : "transparent"
	},
	
	podPrework : function() {
		if (this.get("getFormat") && typeof(this.get("getFormat")) == 'function') {
			this.getFormat = this.get("getFormat");
		}
		
		this.set("myOptions", this.basicChartOptions);
		
		this.set("myOptions", $.extend(true, {}, this.get("myOptions"), this.get("chartOptions")));
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		if (me.get("chartType") == "scatter") {
			me.chart = new google.visualization.ScatterChart(pod);
		} else if (me.get("chartType") == "column") {
			me.chart = new google.visualization.ColumnChart(pod);
		} else if (me.get("chartType") == "bar") {
			me.chart = new google.visualization.BarChart(pod);
		} else if (me.get("chartType") == "gauge") {
			me.chart = new google.visualization.Gauge(pod);
		} else {
			console.error(me.get("chartType") + " is not a valid chart type");
		}
	},
	
	translateData : function(data) {
		var me = this,
			newData = {
				"cols" : [],
				"rows" : []
			},
			seriesMappings = {},
			totalSeries = 0;
		
		// define the xAxis as a column, per google's standards
		newData["cols"].push(me.getXAxisDefinition(data["xAxis"]));
		
		// define each additional column (y-values)
		_.each(data["series"], function(series) {
			newData["cols"].push(me.getYAxisDefinition(series));
			seriesMappings[series["name"]] = totalSeries;
			totalSeries++;
		});
		
		// create the data points
		_.each(data["data"], function(dataPoint) {
			newData["rows"].push(me.getXYDataPoint(dataPoint, seriesMappings, totalSeries));
		});
		
		return newData;
	},
	
	getXAxisDefinition : function(xAxisData) {
		return {
			"id" : "xAxis",
			"label" : xAxisData["label"],
			"type" : xAxisData["type"]
		}
	},
	
	getYAxisDefinition : function(yAxisData) {
		return {
			"id" : yAxisData["name"],
			"label" : yAxisData["label"],
			"type" : yAxisData["type"]
		};
	},
	
	getXYDataPoint : function(dataPoint, seriesMappings, totalSeries) {
		var point = { "c" : new Array() };
		
		point["c"][0] = {
			"v" : dataPoint["x"]		
		};
		
//		for(var i=0; i < totalSeries; i++) {
//			var pointYData = {};
//			if (i == seriesMappings[dataPoint["series"]]) {
//				//this is our point
//				pointYData = {
//					"v" : dataPoint["y"],
//					"f" : this.getFormat(dataPoint["y"], "number")
//				};
//			} else {
//				//not out point, put a null
//				pointYData = {
//					"v" : null,
//					"f" : null
//				};
//			}
//			point["c"][i+1] = pointYData;
//		}
		
		for(seriesName in seriesMappings) {
			var pointYData = {};
			if (seriesName in dataPoint) {
				//this is our point
				pointYData = {
					"v" : dataPoint[seriesName],
					"f" : this.getFormat(dataPoint[seriesName], "number")
				};
			} else {
				//not out point, put a null
				pointYData = {
					"v" : null,
					"f" : null
				};
			}
			point["c"].push(pointYData)
		}
		
		return point;
	},
	
	getFormat : function(value, formatType) {
		switch(formatType) {
			case "number":
			case "string":
				return value + "";
			case "date":
				return value + "";
			default:
				return value + "";
		}
	},
	
	updateDashPod : function(data) {
		this.chart.draw(new google.visualization.DataTable(data), this.getChartOptions());
	},
	
	getChartOptions : function() {
		return $.extend({},
		this.get("myOptions"),
		{
			"title" : this.get("podTitle") 
		});
	}
	
});
