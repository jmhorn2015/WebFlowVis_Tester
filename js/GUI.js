  //Main Screen GUI Functions
  function skyboxOnOff(){
	console.log($('#skySwitch').value);
	var onoff = $('#skySwitch').value;
	if(!onoff){
		scene.background = null;
		scene.background = new THREE.Color('white');
	}
	else{
		scene.background = textureCube;
	}
  }