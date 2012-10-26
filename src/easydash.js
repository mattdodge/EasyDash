listOfModules = [
	"googlechart",
	"highchart",
	"textfeed",
	"datatable",
	"counter"
];

var EasyDash = EasyDash || {};

require.config({
	paths : {
		async : '../lib/requirejs-plugins/async',
		goog : '../lib/requirejs-plugins/goog',
		propertyParser : '../lib/requirejs-plugins/propertyParser',
		backbone : '../lib/backbone',
		underscore : '../lib/underscore',
		jquery : '../lib/jquery.min',
		highcharts : '../lib/highcharts',
		highcharts_more : '../lib/highcharts-more',
		highstock : '../lib/highstock',
		datatables : '../lib/jquery.dataTables',
		appleCounter : '../lib/apple-counter'
	},
	
	shim : {
		'backbone' : {
//			deps : ['underscore', 'jquery'],
			deps : ['underscore'],
			exports : 'Backbone'
		},
		'highcharts' : {
//			deps : ['jquery'],
			exports : 'Highcharts'
		},
		'highcharts_more' : {
			deps : ['highcharts']
		},
		'highstock' : {
			deps : ['highcharts']
		},
		'datatables' : {
//			deps : ['jquery']
		}
	},
	
	urlArgs : "bust=" + (new Date()).getTime()
});

// Include the dependencies for backbone, and require backbone itself
define([
	"backbone", 
	"goog!visualization,1,packages:[corechart,gauge]",
	"highcharts",
	"highcharts_more",
	"highstock",
	"datatables",
	"appleCounter"
], function(Backbone,google,Highcharts) {
	console.log('Backbone & Dependencies loaded');
	init();
});


function init() {
	
	EasyDash.availablePods = {}
	
	console.log('Defining DashPod Model');
	
	EasyDash.DashPod = getDashPodModel();
	
	var PodCollectionType = Backbone.Collection.extend({
		model: EasyDash.DashPod
	});
	
	EasyDash.pods = new PodCollectionType();
	
	EasyDash.addPod = addPodToDashboard;
	EasyDash.getPod = getPod;
	EasyDash.finalizeDashboard = finalizeDashboard;

	loadOtherModules(listOfModules, EasyDash.callback);
	
}

function addPodToDashboard(dashboardId, podType, podDefinition) {
	EasyDash.pods.add(new podType(podDefinition, {"targetDashboard" : dashboardId}));
}

function getPod(podId) {
	var matchedPods = EasyDash.pods.where({"podId" : podId});
	if (matchedPods.length > 0) {
		return matchedPods[0];
	} else {
		return null;
	}
}

function finalizeDashboard(dashboardId) {
	$('#'+dashboardId).append(
		$('<div/>').css('clear','both')
	);
}

function getDashPodModel() {
	return Backbone.Model.extend({
		
		defaults: {
			"refreshInterval" : 1000,
			"autoStart" : true,
			"autoLoad" : true,
			"dataSource" : null,
			"dataType" : "json",
			"dataSourceParams" : {},
			"dataSourceMethod" : "GET",
			
			"podWidth" : null,
			"podHeight" : null,
			"podId" : null,
			"podClass" : "easydashpod",
			"podTitle" : ""
		},
		
		initialize : function(attrs, classAttrs) {
			
			if (! this.get("podId")) {
				this.set("podId",this.cid);
			}
			
			this.podPrework();
			
			this.set("pod", this.createDashPod());
			$('#' + classAttrs["targetDashboard"]).append(this.get("pod"));
			
			this.podPostwork(this.get("pod"));
			
			if (this.get("autoLoad")) {
			// we will load the data at the beginning
				
				if (this.get("autoStart")) {
					// do we want to start the interval?
					this.start();
				} else {
					// or just get the data once?
					this.getData(this);
				}
			}
		},
		
		podPrework : function() {
			return;
		},
		
		podPostwork : function(pod) {
			return;
		},
		
		createDashPod : function() {
			var theDiv = $("<div/>");
			
			if (this.get("podWidth")) {
				theDiv.width(this.get("podWidth"));
			}
			
			if (this.get("podHeight")) {
				theDiv.height(this.get("podHeight"));
			}
			
			return theDiv
				.addClass(this.get("podClass"))
				.attr("id",this.get("podId"))[0];
		},
		
		getData : function(me) {
			if (me.get("dataSource")) {
				$.ajax({
					success: function(data, status, jqXHR) {
						me.updateDashPod(me.translateData(data));
					},
					error: function(jqXHR, status, error) {
						console.error("Error fetching data : "+status);
						console.error(error);
					},
					data : me.get("dataSourceParams"),
					type : me.get("dataSourceMethod"),
					dataType : me.get("dataType"),
					url : me.get("dataSource")
				});
				
			}
		},
		
		translateData : function(data) {
			return data;
		},
		
		updateDashPod : function(data) {
			return;
		},
		
		start : function() {
			var me = this,
				func = me.getData;
				
			if (me.get("timeoutInterval")) {
				console.log("Chart already started, ignoring");
				return;
			}
				
			func(me);
			
			me.set("timeoutInterval", setInterval(
				function() { func(me); },
				me.get("refreshInterval")
			));
		},
		
		stop : function() {
			var me = this;
			
			clearInterval(me.get("timeoutInterval"));
			
			me.set("timeoutInterval",null);
		}
		
	});
}

function loadOtherModules(moduleList, callbackFunction) {
	require(
		_.map(moduleList, function(module) { return "modules/" + module; }),
		function() {
			console.log('Modules loaded');
			callbackFunction();
		}
	);
}
