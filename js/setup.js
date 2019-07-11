
//-----Three.js Setup-----//
var container = document.createElement( 'div' );
container.style.border = "1px solid black";
document.getElementById( 'surface_view' ).appendChild( container );
var stats = new Stats();
container.appendChild( stats.dom );
//Surface Scene Setup
var w = $(".col-sm-8").width();
var h = 450;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, w/h, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( w, h );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapSoft = true;
renderer.gammaInput = true;
renderer.gammaOutput = true;
scene.background = new THREE.Color('white');
container.appendChild( renderer.domElement );

//Volume Scene Setup
var sceneH = new THREE.Scene();
sceneH.background = new THREE.Color('black');
var canvas = document.createElement( 'canvas' );
container.appendChild(canvas);
var context = canvas.getContext( 'webgl2' );
var rendererH = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
rendererH.setPixelRatio( window.devicePixelRatio );
rendererH.setSize( w, h);
container.appendChild( rendererH.domElement );
rendererH.domElement.style.display = "none";
var frusth = 512;
var aspect = w / h;
var cameraH = new THREE.OrthographicCamera( - frusth * aspect / 2, frusth * aspect / 2, frusth / 2, - frusth / 2, 1, 1000 );
cameraH.position.set( 0, 0, 128 );
cameraH.up.set( 0, 0, 1 );

var controls = new THREE.TrackballControls( camera, document.getElementById("surface_view"));
controls.enableKeys = false;
camera.position.set( 0, 0, 2);

//axis
/*var axes = document.getElementById( 'inset' );
var renderer2 = new THREE.WebGLRenderer();
renderer2.setClearColor( 0x000000, 1 );
renderer2.setSize( 100, 100 );
axes.appendChild( renderer2.domElement );
var scene2 = new THREE.Scene();
var camera2 = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
camera2.up = camera.up;
var axesHelper = new THREE.AxesHelper( 5 );
scene2.add( axesHelper );*/

//box
var geometry = new THREE.BoxGeometry( 10, 5, 10);
var edge = new THREE.EdgesGeometry( geometry );
var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
var wireframe = new THREE.LineSegments( edge, mat );
wireframe.name = "plane";
scene.add( wireframe );

//lights
var light = new SRLight(scene);
var light2 = new SRLight(scene);
light2.type("Point", scene);
light2.position(0,-10,10);
var light3 = new SRLight(sceneH);
var light4 = new SRLight(sceneH);
light4.type("Point", sceneH);
light4.position(0,-10,10);

//objects
/*GenerateCurves("data/seeding_curve_1.txt", scene);
GenerateCurves("data/seeding_curve_2.txt", scene);*/
//AddObject("data/surface1_1.obj", sceneH);
/*AddObject("data/surface1_2.obj", scene);
AddObject("data/surface2_1.obj", scene);
AddObject("data/surface2_2.obj", scene);*/
GenerateTACLines("data/pathlines.txt","data/tacs.txt", scene);

import {AddVolume} from "./AddObject.js";
AddVolume("data/stent.nrrd", "data/cm_viridis.png", sceneH);

//shadow plane
var shadowPlane = new SRMesh(scene);
shadowPlane.updateMesh(shadowPlane.object, scene);

//Raycaster
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var canvasBounds = renderer.context.canvas.getBoundingClientRect();
  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
    mouse.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
	if(sceneCheck){
		var intersects = raycaster.intersectObjects(objects, true);
		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
				INTERSECTED = intersects[0].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex(0xff0000);
				if(currObject != null){
					currObject.removeMenu();
					currObject = null;
				}
				for( var b = 0; b < objects.length; b++){
					if(INTERSECTED.name == surfaceObjects[b].object.name){
						currObject = surfaceObjects[b];
						$('#localGUI').append(currObject.getGUIMenu(container).domElement);
							break;
						}
					if(b+1 == objects.length){
						console.log("not found");
					}
				}
			}
		}
		else {
			if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
			INTERSECTED = null;

			currObject.removeMenu();
			currObject = null;

		}
	}

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

function animate() {
	if(loading){
		$("#loading").addClass('spinner-border');
	}
	else{
		$("#loading").removeClass('spinner-border');
	}
	requestAnimationFrame( animate );
	controls.update();
	/*camera2.position.copy( camera.position );
	camera2.position.sub( controls.target );
	camera2.position.setLength( 15 );
    camera2.lookAt( scene2.position );*/
	stats.begin();
	if(sceneCheck){
		renderer.render( scene, camera );
	}
	else{
		rendererH.render( sceneH, cameraH );
	}
	stats.end();
	//renderer2.render( scene2, camera2 );
};
animate();