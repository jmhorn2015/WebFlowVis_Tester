  //Main Screen GUI Functions
  function shadowsOnOff(){
	  console.log("test");
	for( x = 0; x < objects.length; x++){
		objects[x].castShadow(!objects[x].object.castShadow);
	}
  }
  function skyboxOnOff(){
	if(scene.background == textureCube){
		scene.background = null;
		scene.background = new THREE.Color('white');
	}
	else{
		scene.background = textureCube;
	}
  }
  function 