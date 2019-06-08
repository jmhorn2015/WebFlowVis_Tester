
function Reflection(bool){
	var arr = scene.children;
	var path = "data/skybox/";
	var urls = [
		path + "px.jpg", path + "nx.jpg",
		path + "py.jpg", path + "ny.jpg",
		path + "pz.jpg", path + "nz.jpg"
	];
	textureCube = new THREE.CubeTextureLoader().load( urls );
	textureCube.format = THREE.RGBFormat;
	for( var x = 0; x < arr.length; x++){
		var object = arr[x];
		object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh & object.name == "surface") {
				if(bool){
					scene.background = textureCube;
					child.material.envMap = textureCube;
					child.material.needsUpdate = true;
				}
				else{
					scene.background = null;
					child.material.envMap = null;
					child.material.needsUpdate = true;
					scene.background = new THREE.Color('white');
				}
        	}
    	});
	}
};
	