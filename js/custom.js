var vertexDetails = [];

$(document).ready(function () {
	console.log('loaded');
	$('img#example').selectAreas({
		minSize: [10, 10],
		width: 500,
		areas: [
			{
				x: 10,
				y: 20,
				width: 60,
				height: 100,
			}
		]
	});
	$('#btnView').click(function () {
		var areas = $('img#example').selectAreas('areas');
		displayAreas(areas);
	});


});



function areaToString(area) {
	var areaObject = {
		"x": area.x,
		"y": area.y,
		"width": area.width,
		"height": area.height
	}
	return areaObject;
}


// Display areas coordinates in a div
function displayAreas(areas) {
	$.each(areas, function (id, area) {
		vertexDetails.push(areaToString(area));
	});

	$.ajax({
		url:"fetchData",
		type:"GET",
		data:{"vertex":vertexDetails},
		success:function(data){

		},
		error:function(err){
			
		}
	})
	console.log(vertexDetails);
};

//scan

$('#btnScan').click(function(){
	console.log('scanning');
	$.ajax({
		url:"scan",
		type:"GET",
		success:function(data){
			console.log('scanned',data);
		},
		error:function(err){
			console.log('error while scanning',err);
		}
	})
})