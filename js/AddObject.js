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

function AddVolume(name, textureName,  sceneName){
	console.log("enter");
	new NRRDLoader.load( name, function ( volume ) {
		console.log("start");
		var texture = new THREE.DataTexture3D( volume.data, volume.xLength, volume.yLength, volume.zLength );
		texture.format = THREE.RedFormat;
		texture.type = THREE.FloatType;
		texture.minFilter = texture.magFilter = THREE.LinearFilter;
		texture.unpackAlignment = 1;
		texture.needsUpdate = true;
		// Colormap textures
		var cmtextures = new THREE.TextureLoader().load( textureName, render );
		// Material
		var shader = VolumeRenderShader1;
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
		uniforms[ "u_data" ].value = texture;
		uniforms[ "u_size" ].value.set( volume.xLength, volume.yLength, volume.zLength );
		uniforms[ "u_clim" ].value.set( 0 , 1 ); // put volume controls here;
		uniforms[ "u_renderstyle" ].value = 0;
		uniforms[ "u_cmdata" ].value = cmtextures;
		var materialtemp = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			side: THREE.BackSide
		} );
		// THREE.Mesh
		var geometrytemp = new THREE.BoxBufferGeometry( volume.xLength, volume.yLength, volume.zLength );
		geometrytemp.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );
		var meshtemp = new THREE.Mesh( geometrytemp, materialtemp );
		meshtemp.name = name;
		var volumeTemp = new SRMesh(sceneName);
		volumeTemp.updateMesh(meshtemp, sceneName);
		console.log("done");
	}, function(value){ 
	console.log(value);
	},	function ( error ) {
		alert( 'An error happened in Add Volume' );
		console.log(error);
	});
};