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
	var loader = new NRRDLoader();
	loader.load( name2, function ( volume ) {
		var texture = new THREE.DataTexture3D( volume.data, volume.xLength, volume.yLength, volume.zLength );
		texture.format = THREE.RedFormat;
		texture.type = THREE.FloatType;
		texture.minFilter = texture.magFilter = THREE.LinearFilter;
		texture.unpackAlignment = 1;
		texture.needsUpdate = true;
		// Colormap textures
		cmtextures = new THREE.TextureLoader().load( textureName, render );
		// Material
		var shader = VolumeRenderShader1;
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
		uniforms[ "u_data" ].value = texture;
		uniforms[ "u_size" ].value.set( volume.xLength, volume.yLength, volume.zLength );
		uniforms[ "u_clim" ].value.set( volconfig.clim1, volconfig.clim2 );
		uniforms[ "u_renderstyle" ].value = 0;
		uniforms[ "u_cmdata" ].value = cmtextures[ volconfig.colormap ];
		material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			side: THREE.BackSide // The volume shader uses the backface as its "reference point"
		} );
		// THREE.Mesh
		var geometry = new THREE.BoxBufferGeometry( volume.xLength, volume.yLength, volume.zLength );
		geometry.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = name;
		var volumeTemp = new SRMesh(sceneName);
		volumeTemp.updateMesh(mesh, sceneName);
		render();
	} );
};