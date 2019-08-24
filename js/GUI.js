var loading = false; //boolean for loading icon to appear or not
var sceneCheck = true;  //boolean to tell whether current scene is surface rendering or volume rendering
var allParams = { //GUI parameters for the "Change all object settings" options in the Filters tab
	opacity: 50,
	reflective: false,
	recvShadows: false
};

//Instanciated variables for this script and setup.js
var currObject;
var cameraH;
var camera;
var controls;
var renderer;
var rendererH;
var scene;
var sceneH;
var mouse = new THREE.Vector2(), INTERSECTED;

var fileStorage;

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
			surfaceObjects[a].hideObject(false);
			surfaceObjects[a].objParams.Hide = false;
		 }		 
	  }
  }
   function unhideSurface(){
	  for(var a = 0; a < surfaceObjects.length; a++){
		 if(surfaceObjects[a] instanceof SRSurface){
			surfaceObjects[a].hideObject(false);
			surfaceObjects[a].objParams.Hide = false;
		 }		 
	  }
  }
    function hideCurves(){
	  for(var a = 0; a < surfaceObjects.length; a++){
		 if(surfaceObjects[a] instanceof SRSeedingCurve){
			surfaceObjects[a].hideObject(true);
			surfaceObjects[a].objParams.Hide = true;
		 }		 
	  }
  }
   function hideSurface(){
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
  function invertBackground(){
	  var tempScene = scene;
	  if(!sceneCheck){
		  tempScene = sceneH;
	  }
	  if(tempScene.background.r == 1){
		  tempScene.background = new THREE.Color('black');
	  }
	  else{
		  tempScene.background = new THREE.Color('white');
	  }
  }
  //List of Hidden Objects in Scene GUI
  var dropdownOn = false;
  function hiddenObjectList(){
	  if(document.getElementById("dropdownMenuHiddenObj").getAttribute("aria-expanded") == "false"){
		var e = document.getElementById("hiddenObjects");
		var objPointer;
		if(sceneCheck){
			objPointer = surfaceObjects;
		}
		else{
			objPointer = volumeObjects;
		}
		for(var a = 0; a < objPointer.length; a++){
			if(!objPointer[a].object.visible){
				var tempDiv = document.createElement( 'a' );
				tempDiv.classList.add("dropdown-item");
				tempDiv.onclick = unhideListItem(objPointer[a].object.name);
				tempDiv.innerHTML = objPointer[a].object.name;
				e.appendChild(tempDiv);
			}
		}
		dropdownOn = true;
	  }
	  else{
		var e = document.getElementById("hiddenObjects");
		var child = e.lastElementChild;  
        while (child) {
            e.removeChild(child); 
            child = e.lastElementChild; 
        }
		var tempDiv = document.createElement( 'a' );
		tempDiv.classList.add("dropdown-item");
		tempDiv.innerHTML = "None";
		e.appendChild(tempDiv);
		dropdownOn = true;
	  }
  }
  function unhideListItem(elmnt){
	if(!dropdownOn){
		return;
	}
	console.log(elmnt);
	var objPointer;
	if(sceneCheck){
		objPointer = surfaceObjects;
	}
	else{
		objPointer = volumeObjects;
	}
	for(var a = 0; a < objPointer.length; a++){
		console.log(elmnt);
		if(objPointer[a].object.name == elmnt){
			objPointer[a].hideObject(false);
		}
	}
	var e = document.getElementById("hiddenObjects");
	var child = e.lastElementChild;  
    while (child) {
        e.removeChild(child); 
        child = e.lastElementChild; 
    }
	var tempDiv = document.createElement( 'a' );
	tempDiv.classList.add("dropdown-item");
	tempDiv.innerHTML = "None";
	e.appendChild(tempDiv);
	dropdown = false;
  }
  //Deletes an object from the visualizer
  function deleteButton(){
	  if(sceneCheck){
		currObject.remove(scene);
	  }
	  else{
		currObject.remove(sceneH);
	  }
	  currObject = null;
	  document.getElementById("deleter").style.display = "none";
  }