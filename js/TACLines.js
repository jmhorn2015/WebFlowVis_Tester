function GenerateTACLines(name, dataFile, scene){
	var newSRObjects = [];
	$.get(name,	function(data) {
		 texts = data.split(" ");
		 sub();
		})
		.fail(function() {
			alert( "error" );	
		});
	$.get(dataFile,	function(data) {
		 texts = data.split(" ");
		 sub2();
		})
		.fail(function() {
			alert( "error" );	
		});

	function sub2(){
		var TACData = [];
		var objCounter = 0;
		for(var a = 0; a <= texts.length; a++){
			if(pointCounter < 200){
				TACData.push(Number(texts[a]));
			}
			else{
				newSRObjects[objCounter].loadDataTwo(TACData);
				objCounter++;
				a--;
			}
		}
		console.log(objCounter);
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
				//meshtemp.name = name;
				//mesh.updateMesh(meshtemp);
				meshtemp.name = name + lineCounter;
				var SCtemp = new SRSeedingCurve(scene);
				SCtemp.updateMesh(meshtemp);
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