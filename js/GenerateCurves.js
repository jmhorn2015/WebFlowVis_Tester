//base shape
var circleRadius = .01;
var circleShape = new THREE.Shape();
circleShape.moveTo( 0, circleRadius );
circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );

var extrudeSettings;
var bigData = [];
var texts;

function GenerateCurves(name, mesh){
	$.get(name,	function(data) {
		 texts = data.split(" ");
		 sub();
		})
		.fail(function() {
			alert( "error" );	
		});

	function sub(){
		var lineData = [];
		var prevPos = 0;
		var tempVal = 0;
		var counter = 0;
		var lineCounter = 0;
		var x = 0;
		var y = 0;
		var z = 0;
		for(var a = 0; a < texts.length; a++){
			if(texts[a].charAt(texts[a].length-1)!=','){
				counter++;
				tempVal = Number(texts[a]);
				prevPos = a+1;
				if(counter == 1){
					x = tempVal;
				}
				else if(counter == 2){
					y = tempVal;
				}
				else if(counter == 3){
					z = tempVal;
					lineData.push(new THREE.Vector3(x,y,z));
					counter = 0;
				}
			}
			else{
				tempVal = Number(texts[a].substring(0, texts[a].length-1));
				z = tempVal;
				lineData.push(new THREE.Vector3(x,y,z));
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
				meshtemp.name = name;
				mesh.updateMesh(meshtemp);
				lineData = [];
				counter = 0;
				prevPos = a+1;
			}
		}
		console.log(texts.length);
	}
};