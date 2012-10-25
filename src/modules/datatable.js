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

		_.each(data["series"], function(series) {
			
			var seriesProps = {
				"mData" : series["name"],
				"sName" : series["name"],
				"sTitle" : series["label"]
			}
			
			if($.inArray("columnOptions",series)) {
				$.extend(seriesProps, series["columnOptions"]);
			}
			
			seriesList.push(seriesProps);
		});
		me.set("seriesList", seriesList);
		
		return data["data"];
	},
	
	updateDashPod : function(data) {
		var me = this,
			tableObj = me.get("tableObj");
			
		var dataTableObj = tableObj.dataTable($.extend(true, {
			"aaData" : data,
			"aoColumns" : me.get("seriesList"),
			"bPaginate" : false,
			"bJQueryUI" : true,
			"sDom" : '<"H"<"dataTableHeader">lfr>t<"F"ip>'
		},
		me.get("tableOptions")));
		
		$("div.dataTableHeader").html(me.get("podTitle"));
		me.set("dataTableObj",dataTableObj);
	}
	
});