console.log('Loading HighCharts Module');

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

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
				id : series["name"],
				name : series["label"],
				seriesType : series["type"],
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
					var pointYData = [];
					
					if(newData[seriesMappings[seriesName]]["seriesType"] == "flags") {
						pointYData = {};
						if ('x' in dataPoint) {
							pointYData['x'] = eval(dataPoint['x']) * 1000;
						}
						
						if (typeof dataPoint[seriesName] == 'object') {
							pointYData['title'] = dataPoint[seriesName].title;
							pointYData['text'] = dataPoint[seriesName].text;
						} else {
							pointYData['title'] = dataPoint[seriesName];
							pointYData['text'] = dataPoint[seriesName];
						}
						
					} else {
					
						if ('x' in dataPoint) {
							if ((dataPoint["x"]+"").length <= 10) {
								pointYData.push(eval(dataPoint['x']) * 1000);
							} else {
								pointYData.push(eval(dataPoint['x']));
							}
						}
						
						if (typeof dataPoint[seriesName] != 'object') {
							dataArr = [dataPoint[seriesName]];
						} else {
							dataArr = dataPoint[seriesName];
						}
						
						_.each(dataArr, function(pt) {
							pointYData.push(parseFloat(pt));
						});
					}
					
					newData[seriesMappings[seriesName]].data.push(pointYData);
				} 
				
			}
		});
		
		var xAxis = null;
		if ("xAxis" in data && "xAxisOptions" in data["xAxis"] && "categories" in data["xAxis"]["xAxisOptions"]) {
			// set our xAxis categories
			xAxis = data["xAxis"]["xAxisOptions"]["categories"];
			
			// now we need to remove the 1 element arrays and make them all into one
			for(seriesName in seriesMappings) {
				var newArr = [];
				_.each(newData[seriesMappings[seriesName]].data, function(dataPointArr) {
					newArr.push(dataPointArr[0]);
				});
				newData[seriesMappings[seriesName]].data = newArr;
			}
		}
		
		return {
			"data" : newData,
			"xAxis" : xAxis
		};
	},
	
	updateDashPod : function(newData) {
		var me = this,
			data = newData["data"],
			seriesAccountedFor = [];
		
		_.each(data, function(seriesConfig) {
			// see if series exists already
			var existingSeries = _.find(me.chart.series, function(series) {
				return series.name == seriesConfig["name"];		
			});
			
			seriesAccountedFor.push(seriesConfig["name"])
			
			if (existingSeries) {
				// check that the colors are the same
				if (existingSeries.options.color != seriesConfig["color"]) {
					existingSeries.remove(false);
					me.chart.addSeries($.parseJSON(JSON.stringify(seriesConfig)));
				} else {
					existingSeries.setData($.parseJSON(JSON.stringify(seriesConfig["data"])));
				}
			} else {
				// otherwise add the series
				me.chart.addSeries($.parseJSON(JSON.stringify(seriesConfig)));
			}
		});
		
		_.each(me.chart.series, function(s) {
			if ($.inArray(s.name, seriesAccountedFor) == -1) {
				s.remove(true);
			}
		});
		
		if ("xAxis" in newData && newData["xAxis"]) {
			me.chart.xAxis[0].setCategories(newData["xAxis"]);
		}
		
		me.chart.hideLoading();
	}
});

EasyDash.availablePods.HighStockPod = EasyDash.availablePods.HighChartsPod.extend({

	defaults : function() {
		return $.extend({},
		{
			"chartOptions" : {},
			"startDate" : null,
			"endDate" : null
		},
		this.constructor.__super__.defaults);
	},
	
	basicChartOptions : {
		"chart" : {
			"backgroundColor" : "rgba(255,255,255,0)",
			"xAxis" : {
				"type" : "datetime"
			}
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
		
		var highstockConfig = $.extend(true, {
			chart: {
				renderTo: pod.id
			},
			title: {
				text: me.get("podTitle")
			}
		},
		me.get("myOptions"));
		
		if (me.get("startDate")) {
			if (me.get("endDate")) {
				endDate = me.get("endDate");
			} else {
				endDate = (new Date).getTime();
			}
			
			dummySeries = {
				name: "dummy",
				id : "dummy",
				color: "rgba(255,255,255,0)",
				showInLegend: false,
				data: [
					[me.get("startDate"),0],
					[endDate,0]
				]
			};
			highstockConfig['series'] = [dummySeries];
		}

		me.chart = new Highcharts.StockChart(highstockConfig);
	},
	
	updateDashPod : function(newData) {
		var me = this,
			data = newData["data"];
		
		_.each(data, function(seriesConfig) {
			// see if series exists already
			var existingSeries = _.find(me.chart.series, function(series) {
				return series.name == seriesConfig["name"];		
			});
			
			if (existingSeries) {
				existingSeries.setData($.parseJSON(JSON.stringify(seriesConfig["data"])));
			} else {
				// otherwise add the series
				me.chart.addSeries($.parseJSON(JSON.stringify(seriesConfig)));
				
				// then remove the dummy series
				var dummy = me.chart.get('dummy');
				if (dummy) { dummy.remove(true); }
			}
		});
		
		me.chart.hideLoading();
	}
});

