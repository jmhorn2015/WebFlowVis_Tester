
//-----Three.js Setup-----//
var container = document.createElement( 'div' );
container.style.border = "1px solid black";
document.getElementById( 'surface_view' ).appendChild( container );
var stats = new Stats();
container.appendChild( stats.dom );

//D3 setup
d3.selection.prototype.moveToFront = function() {  
    return this.each(function(){
       this.parentNode.appendChild(this);
     });
};
	
//Surface Scene Setup
var w = $(".col-sm-8").width();
var h = 450;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, w/h, 0.1, 1000 );
renderer = new THREE.WebGLRenderer();
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
sceneH = new THREE.Scene();
sceneH.background = new THREE.Color('black');
var canvas = document.createElement( 'canvas' );
container.appendChild(canvas);
var context = canvas.getContext( 'webgl2' );
rendererH = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
rendererH.setPixelRatio( window.devicePixelRatio );
rendererH.setSize( w, h);
container.appendChild( rendererH.domElement );
rendererH.domElement.style.display = "none";
var frusth = 512;
var aspect = w / h;
cameraH = new THREE.OrthographicCamera( - frusth * aspect / 2, frusth * aspect / 2, frusth / 2, - frusth / 2, 1, 1000 );
cameraH.position.set( 0, 0, 128 );
cameraH.up.set( 0, 0, 1 );

controls = new THREE.TrackballControls( camera, document.getElementById("surface_view"));
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
GenerateTACLines("data/pathlines.txt","data/tacs.txt", scene, new SRMesh(scene, "Sphere"));

import {AddVolume} from "./AddNRRDVolume.js";
AddVolume("data/stent.nrrd", "data/cm_viridis.png", sceneH);

//shadow plane
var shadowPlane = new SRMesh(scene);
shadowPlane.updateMesh(shadowPlane.object, scene);


//Raycaster
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
rendererH.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
var raycaster = new THREE.Raycaster();
var canvasBounds = renderer.context.canvas.getBoundingClientRect();
  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
    mouse.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;
	
	if(sceneCheck){
		raycaster.setFromCamera(mouse, camera);
		intersects = raycaster.intersectObjects(objects, true);
		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				INTERSECTED = intersects[0].object;
				if(currObject != null){
					currObject.removeMenu();
					currObject = null;
				}
				if(!(INTERSECTED instanceof SRSeedingCurve)){
					selectMode = true;
					d3.selectAll("path").classed("line", function() {
						d3.select(this)
						.attr('stroke', null)
						.attr('stroke', this.getAttribute('origColor'));
					});
					d3.select(clicked)
					.attr('stroke-width', null)
					.attr('stroke-width', "3");
				}
				else{
					selectMode = false;
				}
				for( var b = 0; b < objects.length; b++){
					if(INTERSECTED.name == surfaceObjects[b].object.name){
						currObject = surfaceObjects[b];
						currObject.color(currObject.origColor);
						$('#localGUI').append(currObject.getGUIMenu().domElement);
						d3.select(clicked)
						.attr('stroke-width', null)
						.attr('stroke-width', "3");
						d3.selectAll("path").classed("line", function() {
						d3.select(this)
						.attr('stroke', null)
						.attr('stroke', "#888888");
						});
						clicked = document.getElementById(currObject.object.name);
						d3.select(clicked).moveToFront()
						.attr('stroke-width', null)
						.attr('stroke-width', "6")
						.attr('stroke', null)
						.attr('stroke', clicked.getAttribute('origColor'));
					}
					else{
						if(surfaceObjects[b] instanceof SRMesh){
							surfaceObjects[b].color("#888888");
						}
					}
				}
			}
		}
		else {
			INTERSECTED = null;
			for( var b = 0; b < objects.length; b++){
				if(surfaceObjects[b] instanceof SRMesh){
					surfaceObjects[b].color(surfaceObjects[b].origColor);
				}
			}
			currObject.removeMenu();
			currObject = null;
			d3.selectAll("path").classed("line", function() {
				d3.select(this)
				.attr('stroke', null)
				.attr('stroke', this.getAttribute('origColor'));
			});
			d3.select(clicked)
			.attr('stroke-width', null)
			.attr('stroke-width', "3");
		}
	}
	else{
		raycaster.setFromCamera(mouse, cameraH);
		var intersects = raycaster.intersectObjects(vObjects, true);
		console.log("volume");
		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				INTERSECTED = intersects[0].object;
				if(currObject != null){
					currObject.removeMenu();
					currObject = null;
				}
				if(!(INTERSECTED instanceof SRSeedingCurve)){
					selectMode = false;
					d3.selectAll("path").classed("line", function() {
						d3.select(this)
						.attr('stroke', null)
						.attr('stroke', this.getAttribute('origColor'));
					});
					d3.select(clicked)
					.attr('stroke-width', null)
					.attr('stroke-width', "3");
				}
				for( var b = 0; b < vObjects.length; b++){
					if(INTERSECTED.name == volumeObjects[b].object.name){
						currObject = volumeObjects[b];
						$('#localGUI').append(currObject.getGUIMenu().domElement);
						selectMode = true;
						break;
					}
					if(b+1 == objects.length){
						console.log("not found");
					}
				}
			}
		}
		else {
			INTERSECTED = null;
			currObject.removeMenu();
			currObject = null;
			selectMode = false;
		}
	}
	if(currObject == null){
		$("#deleter").style.display = "none";
	}
	else{
		$("#deleter").style.display = "block";
	}
  }

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