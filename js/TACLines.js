function GenerateTACLines(name, dataFile, sceneName){
	var newSRObjects = [];
	var loadData = [];
	$.get(name,	function(data) {
		 texts = data.split(" ");
		 sub();
		 dataLoader();
		})
		.fail(function() {
			alert( "error load" );	
		});
	function dataLoader(){
	$.get(dataFile,	function(data) {
		 texts = data.split(" ");
		 sub2();
		})
		.fail(function() {
			alert( "error data" );	
		});
	}
	function sub2(){
		var TACData = [];
		var objCounter = 0;
		var pointCounter = 0;
		for(var a = 0; a <= texts.length; a++){
			if(pointCounter < 200){
				TACData.push(Number(texts[a]));
				pointCounter++;
			}
			else{
				newSRObjects[objCounter].loadDataTwo(TACData);
				objCounter++;
				pointCounter = 0;
				a--;
			}
		}
		LoadTACGraph(surfaceObjects, "#d3-test2");
	}
	function sub(){
		var lineData = [];
		var xData = [];
		var prevPos = 0;
		var tempVal = 0;
		var counter = 0;
		var pointCounter = 0;
		var lineCounter = 0;
		var x = 0;
		var y = 0;
		var z = 0;
		for(var a = 0; a <= texts.length; a++){
			if(pointCounter < 200){
				counter++;
				tempVal = Number(texts[a]);
				prevPos = a+1;
				if(counter == 1){
					x = tempVal;
					xData.push(x);
				}
				else if(counter == 2){
					y = tempVal;
				}
				else if(counter == 3){
					z = tempVal;
					lineData.push(new THREE.Vector3(x,y,z));
					counter = 0;
					pointCounter++;
				}
			}
			else{
				var draw = new THREE.CatmullRomCurve3( lineData );
				bigData[lineCounter] = draw;
				lineCounter++;
				extrudeSettings = {
					steps: 40,
					bevelEnabled: false,
					extrudePath: draw
				};
				var geo = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );
				var mat = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff , wireframe: false } );
				var meshtemp = new THREE.Mesh( geo, mat );
				meshtemp.name = name + lineCounter;
				var SCtemp = new SRSeedingCurve(sceneName);
				SCtemp.updateMesh(meshtemp, sceneName);
				SCtemp.loadDataOne(xData);
				newSRObjects.push(SCtemp);
				lineData = [];
				xData = [];
				pointCounter = 0;
				prevPos = a+1;
				a--;
			}
		}
	}
};

//2D setup
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = 820
  , height = 150;
  
var dataSize = 200;
var xScale = d3.scaleLinear()
    .domain([-1.5, 1.5]) // input
    .range([0, width]); // output
 
var yScale = d3.scaleLinear()
    .domain([1.5, 5]) // input 
    .range([height, 0]); // output 

function LoadTACGraph(objectsAll, loc){
	console.log("enter");
	//var dataset = d3.range(dataSize).map(function(d) { 
	//return {"y": d3.randomUniform(1)() } 
	//});
	
	var svgTAC = d3.select(loc).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// 3. Call the x axis in a group tag
	svgTAC.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom
	
	// 4. Call the y axis in a group tag
	svgTAC.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

	// 9. Append the path, bind the data, and call the line generator 
	/*svgTAC.append("path")
		.datum(dataset)
		.attr("class", "line") 
		.attr("d", line); */
	for(var a = 0; a < objectsAll.length; a++){
		if(objectsAll[a].dataOne != null){
			var lineGen = d3.line()
					.x(function(d) { return xScale(d.x); })
					.y(function(d) { return yScale(d.y); })
					.curve(d3.curveMonotoneX);
			var dataset = d3.range(dataSize).map(function(d) { 
				return {"x": objectsAll[a].dataOne[d], "y": objectsAll[a].dataTwo[d]}
			});
			
			//styleLine.stroke = "#" + objectsAll[a].mat.color.getHexString();
			//console.log(styleLine.stroke);
			svgTAC.append("path")
				.datum(dataset)
				.attr("class", "line") 
				.attr("d", lineGen)
		}
	}
	console.log("Exit");
}