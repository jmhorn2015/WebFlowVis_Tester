// Function that loads in .OBJ files as SRSurface objects

function AddObject(name2, sceneName, isFile){
	var loader = new THREE.OBJLoader();
	loader.load(name2, function ( object ) {
    	object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh ) {
            	child.material.color.setHex(0x808080);
				child.material.side = THREE.BackSide;
				child.material.transparent = true;
				child.material.opacity = .5;
				child.recieveShadow = false;
				if(isFile){
					child.name = document.getElementById("inputName").innerHTML;
				}
				else{
					child.name = name2;
				}
				var SStemp = new SRSurface(sceneName);
				SStemp.updateMesh(child, sceneName);
        	}
			else{
				var temp = object;
				if ( child instanceof THREE.LineSegments ) {
					console.log("found");
				}
			}
			if(!sceneCheck){
				volumeObjects[volumeObjects.length - 1].scale(50);
			}
    	} );
		loading = false;
		},
	function ( xhr ) {
		loading = true;
	},
	function ( error ) {
		alert( 'An error happened' );
	}
	);
	//$("#loading").removeClass('spinner-border');
};
