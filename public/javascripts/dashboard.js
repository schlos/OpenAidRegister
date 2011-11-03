var map_bounds;

$(document).ready(function(){
	initMap();
	initUploadForm();
});

function initMap(){
	var latlng = new google.maps.LatLng(14.5, 15.5);
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDoubleClickZoom: true
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	$.each(projects_list, function(index, project){
		if (!(project.markers == 'POINT EMPTY' || project.markers == 'MULTIPOINT EMPTY' || project.markers == "")) {
			parseWkt(project);
		}
	});

	map.fitBounds(map_bounds);
}

function parseWkt(project) {
  var wkt = project.markers;
	var procstring;
	var auxarr;

  if (!map_bounds) {
    map_bounds = new google.maps.LatLngBounds();
  }

	procstring = $.trim(wkt.replace("MULTIPOINT",""));
	procstring = procstring.slice(0,-1).slice(1);
	auxarr = procstring.split(",");
	$.each(auxarr,function(index,value) {
		//var txt = $.trim(value).slice(0,-1).slice(1);
		//var coords = txt.split(" ");
		var coords = value.split(" ");
		marker = new google.maps.Marker({
		    map:map,
		    draggable:true,
		    position: new google.maps.LatLng(coords[1], coords[0])
		  });
    createInfowindow(marker, project);

    map_bounds.extend(marker.getPosition());
	});
}

function createInfowindow(marker, project){
  var div = $('<div/>');
  if (project.info.name) {
    div.append($('<h3>' + project.info.name + '</h3>'));
  }
  if (project.info.sectors) {
    var ul = $('<ul/>');
    $.each(project.info.sectors, function(index, sector){
      ul.append($('<li> '+ sector + '</li>'));
    });
    div.append(ul);
  }
  if (project.info.budget) {
    div.append($('<span>' + project.info.budget + '</span><br />'));
  }
  if (project.info.start_date && project.info.end_date) {
    div.append($('<span>' + project.info.start_date + ' - ' + project.info.end_date + '</span><br />'));
  }

  google.maps.event.addListener(marker, 'click', function() {
    console.debug(div.html());
    new google.maps.InfoWindow({
      content: div.html()
    }).open(map, marker);

  });
}

function initUploadForm(){
	var input = $('.dashboard_right .project_details .add_project form input');

	input.change(function(){
		$(this).closest('form').submit();
	});
}
