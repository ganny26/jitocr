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

		

			function areaToString (area) {
				var areaObject = {
					"x":area.x,
					"y":area.y,
					"width":area.width,
					"height":area.height
				}
				return areaObject;
			}

		
			// Display areas coordinates in a div
			function displayAreas (areas) {
				$.each(areas, function (id, area) {
					vertexDetails.push(areaToString(area));
				});
				console.log(vertexDetails);
			};
