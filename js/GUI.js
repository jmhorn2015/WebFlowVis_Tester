var loading = false;
var sceneCheck = true;
var currObject;
var cameraH;
var camera;
var controls;
var renderer;
var rendererH;
var scene;
var sceneH;
var mouse = new THREE.Vector2(), INTERSECTED;

  //Main Screen GUI Functions
  function shadowsOnOff(){
	for( x = 0; x < surfaceObjects.length; x++){
		if(!surfaceObjects[x].object.isAmbientLight){
			surfaceObjects[x].castShadow(!surfaceObjects[x].object.castShadow);
		}
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
  function switchViews(){
	  console.log("fires");
	  sceneCheck = !sceneCheck;
	  if(currObject != null){
		  currObject.removeMenu();
		  currObject == null;
	  }
	  if(!sceneCheck){
		  controls = new THREE.OrbitControls( cameraH, document.getElementById("surface_view"));
		  controls.enableKeys = false;
		  controls.target.set( 64, 64, 128 );
		  controls.minZoom = 0.5;
		  controls.maxZoom = 4;
		  renderer.domElement.style.display = "none";
		  rendererH.domElement.style.display = "block";
	  }
	  else{
		controls = new THREE.TrackballControls( camera, document.getElementById("surface_view"));
		controls.enableKeys = false;
		renderer.domElement.style.display = "block";
		rendererH.domElement.style.display = "none";
	  }
  }