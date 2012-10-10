console.log('Loading Data Table Module');

EasyDash.availablePods.DataTablePod = EasyDash.DashPod.extend({

	podPostwork : function(pod) {
		var me = this,
			tableObj = $('<table/>');
		
		me.set("tableObj", tableObj);
		
		$(pod)
			.css("overflow", "auto")
			.append(tableObj);
	},
	
	translateData : function(data) {
		var me = this;
		
		// save the series data as column data for DataTables
		var seriesList = [];
		var pctPerColumn = Math.floor(100 / data["series"].length) + "%";

		_.each(data["series"], function(series) {
			seriesList.push({
				"mData" : series["name"],
				"sName" : series["name"],
				"sTitle" : series["label"],
				"sWidth" : pctPerColumn
			});
		});
		me.set("seriesList", seriesList);
		
		return data["data"];
	},
	
	updateDashPod : function(data) {
		var me = this,
			tableObj = me.get("tableObj");
			
		tableObj.dataTable($.extend(true, {
			"aaData" : data,
			"aoColumns" : me.get("seriesList"),
			"bPaginate" : false,
			"bJQueryUI" : true,
			"sDom" : '<"H"<"dataTableHeader">lfr>t<"F"ip>'
		},
		me.get("tableOptions")));
		
		$("div.dataTableHeader").html(me.get("podTitle"));
	}
	
});