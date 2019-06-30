function GenerateTACLines(name, scene){
	$.get(name,	function(data) {
		 texts = data.split(" ");
		 return sub();
		})
		.fail(function() {
			alert( "error" );	
		});

	function sub(){
		var newSRObjects = [];
		//
		var lineData = [];
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
				lineData = [];
				pointCounter = 0;
				prevPos = a+1;
				a--;
			}
		}
		console.log(texts.length);
	}
};