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
var fileStorage;
function loadLocal(evt){
	console.log(evt.target);
	console.log(evt.target.files);
	fileStorage = evt.target.files;
	evt.target.next().after().text($(this).val().split('\\').slice(-1)[0]);
}
function readLocal(){
	var currScene;
	if(sceneCheck){
		currScene = scene;
	}
	else{
		currScene = sceneH;
	}
	var filetype = $(document.getElementById("input")).val().split('.').slice(-1)[0];
	console.log(fileStorage);
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
			surfaceObjects[a].objParams.Hide = true;
		 }		 
	  }
  }
   function unhideSurface(){
	  for(var a = 0; a < surfaceObjects.length; a++){
		 if(surfaceObjects[a] instanceof SRSurface){
			surfaceObjects[a].hideObject(true);
			surfaceObjects[a].objParams.Hide = true;
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
	  console.log(value);
		for( var a = 0; a < surfaceObjects.length; a++){
			if(surfaceObjects[a] instanceof SRMesh){
				surfaceObjects[a].material(value);
				if(value == 0){
					surfaceObjects[a].objParams.Material = 'Phong';
				}
				else if(value == 1){
					surfaceObjects[a].objParams.Material = 'Basic';
				}
				else{
					surfaceObjects[a].objParams.Material = 'Lambert';
				}
			}
		}
  }
  function allReflective(){
	  	allParams.reflective = !allParams.reflective;
		for( var a = 0; a < surfaceObjects.length; a++){
			if(surfaceObjects[a] instanceof SRMesh){
				surfaceObjects[a].reflective(allParams.reflective, textureCube);
				surfaceObjects[a].objParams.Reflective = allParams.reflective;
			}
		}
  }
  