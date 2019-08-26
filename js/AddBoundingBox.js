function AddBoundingBox(name3, sceneName){
var loader = new THREE.FileLoader();
    loader.load(
    name3,
    function ( data ) {
		var lines = data.split( '\n' );
		var linedata = [];
        for ( var i in lines ) {
            var line = lines[ i ];
            if ( line.indexOf( 0 ) === 'v' ) {
				var line_values = line.split( ' ' )
                 linedata.push(new THREE.Vector3(parseInt(line_values[ 1 ]), parseInt(line_values[ 2 ]), parseInt(line_values[ 3 ])));
                }
            }        
			var draw = new THREE.CatmullRomCurve3( lineData );
			extrudeSettings = {
				steps: 40,
				bevelEnabled: false,
				extrudePath: draw
			};
			var geo = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );
			var mat = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff , wireframe: false } );
			var meshtemp = new THREE.Mesh( geo, mat );
			meshtemp.name = name3;
			var BBtemp = new SRBoundingBox(sceneName);
			BBtemp.updateMesh(meshtemp, sceneName);
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
}