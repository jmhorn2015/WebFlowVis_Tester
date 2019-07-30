function AddObject(name2, sceneName){
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
				var SStemp = new SRSurface(sceneName);
				SStemp.updateMesh(child, sceneName);
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

function AddVTKVolume(name3, sceneName){
	var loader = new THREE.VTKLoader();
	var material = new THREE.MeshPhongMaterial( { color: 0x888888, side: THREE.DoubleSide } );
	loader.load( name3, function ( geometry ) {
		geometry.center();
		geometry.computeVertexNormals();
		var meshTemp= new THREE.Mesh( geometry, material );
		meshTemp.name = name3;
		var SStemp = new SRSurface(sceneName);
		SStemp.updateMesh(meshTemp, sceneName);
		} );
}
