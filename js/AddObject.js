function AddObject(name2, scene){
	var loader = new THREE.OBJLoader();
	loader.load(name2, function ( object ) {
    	object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh ) {
            	child.material.color.setHex(0x808080);
				child.material.side = THREE.BackSide;
				child.material.transparent = true;
				child.material.opacity = .5;
				child.recieveShadow = false;
				child.name = name2;
				var SStemp = new SRSurface(scene);
				SStemp.updateMesh(child);
        	}
			else{
				var temp = object;
				if ( child instanceof THREE.LineSegments ) {
					console.log("found");
				}
				//object = new THREE.Mesh( temp, new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } ));
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