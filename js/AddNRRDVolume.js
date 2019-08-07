
import {
	DefaultLoadingManager,
	FileLoader,
	Matrix4,
	Vector3
} from "./modules/three.module.js";
import { NRRDLoader } from './NRRDLoader.js';
import { VolumeRenderShader1 } from './VolumeShader.js';		
export function AddVolume(name, textureName,  sceneName){
	new NRRDLoader().load( name, function ( volume ) {
		console.log(volume);
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
		var volumeTemp = new SRVolume(sceneName);
		volumeTemp.updateMesh(meshtemp, sceneName);
	}, function(value){ 
	},	function ( error ) {
		alert( 'An error happened in Add Volume' );
		console.log(error);
	});
};