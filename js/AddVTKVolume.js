//This funcion is used to load a VTK Volume object into a scene. It generates an SRVolume Object to be used in your scene.
import {
	DefaultLoadingManager,
	FileLoader,
	Matrix4,
	Vector3
} from "./modules/three.module.js";
import { VolumeRenderShader1 } from './VolumeShader.js';		
export function AddVTKVolume(name, sceneName){
	 // Load the vtk data
    var loader = new THREE.FileLoader();
    //load a text file and output the result to the console
    loader.load(
    // resource URL
    name,
    // onLoad callback
    function ( data ) {
    // output the text to the console
    //console.log( data )
		var lines = data.split( '\n' );
            var scalars = [];
            var xLength,yLength, zLength;
            for ( var i in lines ) {
                var line = lines[ i ];
                if ( line.indexOf( 'DIMENSIONS' ) === 0 ) {
					console.log(line);
					var line_values = line.split( ' ' )
                    xLength = parseInt(line_values[ 1 ]);
                    yLength = parseInt(line_values[ 2 ]);
                    zLength = parseInt(line_values[ 3 ]);
                    console.log(xLength,yLength,zLength);
                }
                        
                       
                if (i>9){
                    scalars.push(parseFloat(line));
				}
            }        
            var volume_data = new Float32Array(scalars);
            var texture = new THREE.DataTexture3D( volume_data, xLength, yLength, zLength );
            texture.format = THREE.RedFormat;
            texture.type = THREE.FloatType;
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.unpackAlignment = 1;
            texture.needsUpdate = true;

            // Material
            var shader = VolumeRenderShader1;

            var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

            uniforms[ "u_data" ].value = texture;
            uniforms[ "u_size" ].value.set( xLength, yLength, zLength );
            uniforms[ "u_clim" ].value.set( 0 , 1 );
            uniforms[ "u_renderstyle" ].value = 0;
            uniforms[ "u_cmdata" ].value = cmtextures.Viridis;

            var materialtemp = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                side: THREE.BackSide // The volume shader uses the backface as its "reference point"
            } );

            // THREE.Mesh
            var geometrytemp = new THREE.BoxBufferGeometry( xLength, yLength, zLength );
            geometrytemp.translate( xLength / 2 - 0.5, yLength / 2 - 0.5, zLength / 2 - 0.5);
			var meshtemp = new THREE.Mesh( geometrytemp, materialtemp );
			meshtemp.name = name;
			var volumeTemp = new SRVolume(sceneName);
			volumeTemp.position( -xLength / 2 - 0.5, -yLength / 2 - 0.5, -zLength / 2 - 0.5);
			volumeTemp.updateMesh(meshtemp, sceneName);
		},

        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function ( err ) {
            console.error( 'An error happened' );
        }
    );
};

