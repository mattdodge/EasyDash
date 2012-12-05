console.log('Loading Google Maps Module');

EasyDash.availablePods.GoogleMapsPod = EasyDash.DashPod.extend({

	defaults : function() {
		return $.extend({},
		this.constructor.__super__.defaults);
	},
	
	podPostwork : function(pod) {
		var me = this;
		
		map = new google.maps.Map(pod, me.get("mapOptions"));
		
		me.set("map",map);
		me.set("markers", {});
	},
	
	updateDashPod : function(data) {
		var me = this,
			map = me.get("map"),
			markers = me.get("markers"),
			origMarkersLength = _.size(markers);
		
		_.each(data["data"], function(datapoint) {
			series = _.find(data["series"], 
				function(s) {
					return s.name == datapoint["x"];
				}
			);
			
			if (!series || series.type != "marker") {return;}
			if (!datapoint.name) {return;}
			
			markername = datapoint.name;
			
			if (datapoint.lat && datapoint.long) {
				latLong = new google.maps.LatLng(datapoint.lat, datapoint.long);
			} else {
				latLong = null;
			}
			
			if (markername in markers) {
				marker = markers[markername];
			} else {
				marker = new google.maps.Marker({map:map});
				markers[markername] = marker;
			}
			
			if (latLong) {
				marker.setPosition(latLong);

				// extend our map's bounds to include this point if it's new
				if (origMarkersLength != _.size(markers)) {
					me.extendBounds(latLong);
				}
			}
			
			if (datapoint.infoWindow) {
				if (!("infoWindow" in marker)) {
					marker.infoWindow = new google.maps.InfoWindow(datapoint.infoWindow);
					
					// new info window, bind
					google.maps.event.addListener(marker, 'click', function() {
						this.infoWindow.open(map, this);
					});
				} else {
					marker.infoWindow.setOptions(datapoint.infoWindow)
				}
			}
			
			if ("seriesOptions" in series) {
				marker.setOptions(series.seriesOptions);
			}
		});
		
		me.set("markers",markers);
			
		// resize for hidden divs
		google.maps.event.trigger(map, 'resize');
	},
	
	extendBounds : function(latLong) {
		var me = this,
			map = me.get("map");
			
		oldBounds = map.getBounds();
		if (!oldBounds) {
			map.panTo(latLong);
		} else if (!oldBounds.contains(latLong)) {
			map.fitBounds(oldBounds.extend(latLong));
		}
	}
	
});