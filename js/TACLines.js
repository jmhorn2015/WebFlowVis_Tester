var clicked;
var label;
var selectMode = false;

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
				TACData.push(newSRObjects[objCounter].object.name);
				newSRObjects[objCounter].loadDataOne(TACData);
				objCounter++;
				pointCounter = 0;
				a--;
				TACData = [];
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
    .domain([0, 200]) // input
    .range([0, width]); // output
 
var yScale = d3.scaleLinear()
    .domain([0, 5]) // input 
    .range([height, 0]); // output 
	
var focus;
var focusText;
	
// This allows to find the closest X index of the mouse:
var bisect = d3.bisector(function(d) { return d.x; }).left;

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
	  // Create a rect on top of the svg area: this rectangle recovers mouse position
	svgTAC.append('rect')
		.style("fill", "none")
		.style("pointer-events", "all")
		.attr('width', width)
		.attr('height', height)
		.on('mouseover', mouseover)
		.on('mousemove', mousemove)
		.on('mouseout', mouseout);
	// 3. Call the x axis in a group tag
	svgTAC.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom
	
	// 4. Call the y axis in a group tag
	svgTAC.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
		
	for(var a = 0; a < objectsAll.length; a++){
		if(objectsAll[a].dataOne != null){
			var lineGen = d3.line()
					.x(function(d,i) { return xScale(i); })
					.y(function(d) { return yScale(d.y); })
					.curve(d3.curveMonotoneX);
			var dataset = d3.range(dataSize).map(function(d) { 
				return {"y": objectsAll[a].dataOne[d]}
			});
			//styleLine.stroke = "#" + objectsAll[a].mat.color.getHexString();
			//console.log(objectsAll[a].object.name);
			svgTAC.append("path")
				.datum(dataset) 
				.attr("d", lineGen)
				.attr("id", objectsAll[a].dataOne[200])
				.attr("fill", "none")
				.attr("stroke-width", "3")
				.attr("stroke", "#" + objectsAll[a].mat.color.getHexString())
				.attr("origColor", "#" + objectsAll[a].mat.color.getHexString())
				.attr("data-yValue", objectsAll[a].dataOne)
				.on("click", selectLine); 
		}
	}
	// Create the circle that travels along the curve of chart
	focus = svgTAC
	.append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 8.5)
      .style("opacity", 0)
	  .style("z-index", 100)

	// Create the text that travels along the curve of chart
	focusText = svgTAC
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .style("z-index", 100)
}
function selectLine(){
	if(currObject != null){
		currObject.removeMenu();
		currObject = null;
		d3.select(clicked)
		.attr('stroke-width', null)
		.attr('stroke-width', "3");
	}
	clicked = this;
	selectMode = true;
	d3.selectAll("path").classed("line", function() {
		d3.select(this)
		.attr('stroke', null)
		.attr('stroke', "#888888");
		return clicked === this;
	});
	d3.select(clicked).moveToFront()
	.attr('stroke-width', null)
	.attr('stroke-width', "6")
	.attr('stroke', null)
	.attr('stroke', clicked.getAttribute('origColor'));
	for( var b = 0; b < objects.length; b++){
		if(clicked.id == surfaceObjects[b].object.name){
			currObject = surfaceObjects[b];
			$('#localGUI').append(currObject.getGUIMenu().domElement);
			break;
			}
			if(b+1 == objects.length){
				console.log("not found");
			}
		}
	}
//}
  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
	if(selectMode){
		focus.style("opacity", 1)
		focusText.style("opacity",1)
	}
  }

  function mousemove() {
    // recover coordinate we need
	if(selectMode){
		var x0 = Math.floor(xScale.invert(d3.mouse(this)[0]));
		//var i = bisect(clicked.data, x0, 1);
		selectedData = currObject.dataOne;
		focus
		.attr("cx", xScale(x0))
		.attr("cy", yScale(selectedData[x0]))
		focusText
		.html("x:" + x0 + "  -  " + "y:" + selectedData[x0])
		.attr("x", xScale(x0)+15)
		.attr("y", yScale(selectedData[x0]))
	}
}
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }