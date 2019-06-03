function Transparency(num){
	var arr = scene.children;
	for( var x = 0; x < arr.length; x++){
		var object = arr[x];
		object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh & object.name == "surface") {
				child.material.opacity = num;
        	}
    	});
	}
};
function Hue(num){
	var arr = scene.children;
	for( var x = 0; x < arr.length; x++){
		var object = arr[x];
		object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh & object.name == "surface") {
            	child.material.color.setHSL(num, 1, .5);
        	}
    	});
	}
};
function Light(num){
	var arr = scene.children;
	for( var x = 0; x < arr.length; x++){
		var object = arr[x];
		if(object.isPointLight){
			object.position.set(num, -10 + Math.abs(num), 10);
		}
	}
};
function Material(num){
	var arr = scene.children;
	for( var x = 0; x < arr.length; x++){
		var object = arr[x];
		object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh & object.name == "surface") {
				var oldMat = child.material;
            	switch(num){
					case 0:
						child.material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
						break;
					case 1:
						child.material = new THREE.MeshBasicMaterial( { color: 0x808080, dithering: true } );
						break;
					case 2:
						child.material = new THREE.MeshLambertMaterial( { color: 0x808080, dithering: true } );
						break;
				}
				child.material.side = THREE.BackSide;
            	child.material.color = new THREE.Color(oldMat.color);
				child.material.transparent = true;
				child.material.opacity = oldMat.opacity;
				child.material.map = oldMat.map;
        	}
    	});
	}
	console.log(num);
};
function Texture(bool){
	var arr = scene.children;
	var loader = new THREE.TextureLoader();
	loader.load(
	"data/graniteTXT.jpg",
	function ( texture ) {
		texture.repeat.set(.01,.01); 
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		for( var x = 0; x < arr.length; x++){
			var object = arr[x];
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh & object.name == "surface") {
					if(child.material.map == null)
						child.material.map = texture;
					else
						child.material.map = null;
					child.material.needsUpdate = true;
				}
			});
		}
	}
	,
	undefined,
	function ( err ) {
		console.error( 'An error happened.' );
	}
);

};
function Shadow(bool){
	var arr = scene.children;
	for( var x = 0; x < arr.length; x++){
		var object = arr[x];
		object.traverse( function ( child ) {
        	if ( child instanceof THREE.Mesh & object.name != "plane") {
				if(bool){
					child.castShadow = true;
					materialP.opacity = 1;
				}
				else{
					child.castShadow = false;
					materialP.opacity = 0;
				}
        	}
			else if( child instanceof THREE.Mesh) {
				if(bool){
					child.recieveShadow = true;
					materialP.opacity = 1;
				}
				else{
					child.recieveShadow = false;
					materialP.opacity = 0;
				}
			}
    	});
	}
};
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
	