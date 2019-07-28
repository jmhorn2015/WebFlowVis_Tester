var loading = false;
var sceneCheck = true;
var allParams = {
	opacity: 50,
	reflective: false,
	recvShadows: false
};
var currObject;
var cameraH;
var camera;
var controls;
var renderer;
var rendererH;
var scene;
var sceneH;
var mouse = new THREE.Vector2(), INTERSECTED;

// Input Function
function loadLocal(){
	var currScene;
	if(sceneCheck){
		currScene = scene;
	}
	else{
		currScene = sceneH;
	}
	var filename = $(document.getElementById("input"));
	var filetype = filename.val().split('.').slice(-1)[0];
	console.log(filename);
	console.log(filename);
	console.log(filetype);
	if(filetype == "txt"){
		console.log("run")
		//GenerateCurves(filename.files[0].webkitRelativePath, currScene);
	}
	else if(filetype == "obj"){
		
	}
	else if(filetype == "nrrd"){
		
	}
	else if(filetype == "vtk"){
	}
	else{
		alert("Error: Bad File Type");
	};
}

  // Skybox Cube
  var path = "data/skybox/";
  var urls = [
		path + "px.jpg", path + "nx.jpg",
		path + "py.jpg", path + "ny.jpg",
		path + "pz.jpg", path + "nz.jpg"
	  ];
	var textureCube = new THREE.CubeTextureLoader().load( urls );
	textureCube.format = THREE.RGBFormat;  

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
  function unhideCurves(){
	  for(var a = 0; a < surfaceObjects.length; a++){
		 if(surfaceObjects[a] instanceof SRSeedingCurve){
			surfaceObjects[a].hideObject(true);
		 }		 
	  }
  }
   function unhideSurface(){
	  for(var a = 0; a < surfaceObjects.length; a++){
		 if(surfaceObjects[a] instanceof SRSurface){
			surfaceObjects[a].hideObject(true);
		 }		 
	  }
  }
  function allRecvShad(){
		allParams.recvShadows = !allParams.recvShadows;
		for( var a = 0; a < surfaceObjects.length; a++){
			surfaceObjects[a].recvShadow(allParams.recvShadows);
			if(surfaceObjects[a] instanceof SRMesh){
				surfaceObjects[a].objParams.Recieve_Shadows = allParams.recvShadows;
			}
		}
  }
  function allOpacity(value){
	  	allParams.opacity = value;
		for( var a = 0; a < surfaceObjects.length; a++){
			if(surfaceObjects[a] instanceof SRMesh){
				surfaceObjects[a].transparency(allParams.opacity);
				surfaceObjects[a].objParams.Opacity = parseInt(allParams.opacity);
			}
		}
  }
  function allMaterial(value){
		for( var a = 0; a < surfaceObjects.length; a++){
			if(surfaceObjects[a] instanceof SRMesh){
				surfaceObjects[a].material(value);
			}
		}
  }
  function allReflective(){
	  	allParams.reflective = !allParams.reflective;
		for( var a = 0; a < surfaceObjects.length; a++){
			if(surfaceObjects[a] instanceof SRMesh){
				surfaceObjects[a].reflective(allParams.reflective);
				surfaceObjects[a].objParams.Reflective = allParams.reflective;
			}
		}
  }
  