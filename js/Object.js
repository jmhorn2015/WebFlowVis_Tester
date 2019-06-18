//Holds meshes of the objects for the raycaster
var objects = [];
//Holds the current SRObjects in the scene
var surfaceObjects = [];

/** 
* @class SRObject
* @classdesc This is the type in which all scene objects fall under other than the scene and the camera. This is a base class, so you will not need to construct an object as an SRObject. Instead, utilize the constructors with the children classes. 
*/
class SRObject{
	object;
	constructor(scene){
		this.object = new THREE.Object3D();
	}
	/**
	* Sets the position of the object within the scene.
	* @param {double} x - posistion along x axis
	* @param {double} y - posistion along y axis
	* @param {double} z - posistion along z axis
	*/
	position(x,y,z){
		this.object.position.set(x, y, z);
	}
	/**
	* Sets the rotatiom of the object within the scene.
	* @param {double} x - rotation around x axis
	* @param {double} y - rotation around y axis
	* @param {double} z - rotation around z axis
	*/
	rotate(x,y,z){
		this.object.rotation.set(x,y,z);
	}
	/**
	* Sets the ability for an object to cast shadows. Default is false.
	* @param {bool} onoff - On = true, Off = false
	*/
	castShadow(onoff){
		this.object.castShadow = onoff;
		console.log("cast");
	}
	/**
	* Sets the ability for an object to recieve shadows. Default is false.
	* @param {bool} onoff - On = true, Off = false
	*/
	recvShadow(onoff){
		console.log("recieve")
		this.object.receiveShadow = onoff;
	}
	 /**
	* Construct a local dat.GUI menu. Made by Duong Ngyuyen.
	* @returns {dat.GUI} surface local menu
	*/
	getGUIMenu(container) {
		this.surfaceLocalMenu = new dat.GUI({ autoPlace: false });
		this.surfaceLocalMenu.domElement.id = 'gui';
		
		var guiContainer = document.getElementById('localGUI');
		guiContainer.appendChild(this.surfaceLocalMenu.domElement);
		
		var objMenu;
		if(this.object.name != ''){
			objMenu = this.surfaceLocalMenu.addFolder(this.object.name);
		}
		else{
			objMenu = this.surfaceLocalMenu.addFolder('Light');
		}
		var posParams = {
			X: 0,
			Y: 0,
			Z: 0
		};
		var rotParams = {
			X: 0,
			Y: 0,
			Z: 0
		};
		var objEditor = this;
		
		//Position folder
		var posMenu = this.surfaceLocalMenu.addFolder("Position");
		var posXCntrlr = posMenu.add(posParams, 'X', -5 , 5);
		posXCntrlr.onChange(function(value) {
			var currPos  = objEditor.Position;
			objEditor.position(value, currPos.y, currPos.z);
		});
		var posYCntrlr = posMenu.add(posParams, 'Y', -5 , 5);
		posYCntrlr.onChange(function(value) {
			var currPos  = objEditor.Position;
			objEditor.position(currPos.x, value, currPos.z);
		});
		var posZCntrlr = posMenu.add(posParams, 'Z', -5 , 5);
		posZCntrlr.onChange(function(value) {
			var currPos  = objEditor.Position;
			objEditor.position(currPos.x, currPos.y, value);
		});
		
		//Rotation folder
		var rotMenu = this.surfaceLocalMenu.addFolder("Rotation");
		var rotXCntrlr = rotMenu.add(rotParams, 'X', -5 , 5);
		rotXCntrlr.onChange(function(value) {
			var currRot  = objEditor.Rotation;
			objEditor.rotate(value, currRot.y, currRot.z);
		});
		var rotYCntrlr = rotMenu.add(rotParams, 'Y', -5 , 5);
		rotYCntrlr.onChange(function(value) {
			var currRot  = objEditor.Rotation;
			objEditor.rotate(currRot.x, value, currRot.z);
		});
		var rotZCntrlr = rotMenu.add(rotParams, 'Z', -5 , 5);
		rotZCntrlr.onChange(function(value) {
			var currRot  = objEditor.Rotation;
			objEditor.rotate(currRot.x, currRot.y, value);
		});
		
		return objMenu;
	}
	/**
	* Remove a local dat.GUI menu. Made by Duong Ngyugen.
	* 
	*/
	removeMenu() {
		$('#gui').remove();
	}
	get Position(){
		return this.object.position;
	}
	get Rotation(){
		return this.object.rotation;
	}
	loadSettings(){
	}
}
/**
* These objects add light to your scene. Right now, it supports an Ambient Light and a Point Light.
* @extends SRObject
*/
class SRLight extends SRObject{
	/**
	* Adds an ambient light to your scene.
	* @constructor
	* @params {THREE.Scene} scene - The scene in which you would like the object in.
	*/
	constructor(scene){
		super(scene);
		this.object = new THREE.AmbientLight(0x777777);
		this.object.position.set(0, 0, 0);
		surfaceObjects.push(this);
		scene.add( this.object );
	}
	/**
	* Sets how bright the light is. On a scale of 0-1.
	* @params {double} x - value of intensity.
	*/
	intensity(x){
		this.object.intensity = x;
	}
	/**
	* Sets the type of the light to the "x" type. Only works for "Point" Light
	* @params {string} x - name of light type.
	*/
	type(x){
		var temp = this.object;
		if(x = "Point"){
			this.object = new THREE.PointLight(0xffffff);
			this.object.castShadow = true;
			this.object.shadow.mapSize.width = 1024;
			this.object.shadow.mapSize.height = 1024; 
		}
		else{
			this.object = new THREE.AmbientLight(0x777777);
		}
		this.object.position.set(temp.position);
		scene.add( this.object );
		this.object.opacity = temp.opacity;
		
	}
	/**
	* Changes the hue color of the light. On a scale of 0-1.
	* @params {double} hue - value of hue.
	*/
	color(hue){
		this.object.color.setHSL(hue/100, 1, .5);
	}
	getIntensity(){
		return this.object.intensity;
	}
	getType(){
		if (this.object.isAmbientLight){
			return "Ambient";
		}
		else{
			return "Point";
		}
	}
	getColor(){
		return this.object.color.getHex();
	}
}
/**
* SRMesh objects hold all of your 3D shapes and is the parent class for all of the visible objects in the scene.
* @extends SRObject
*/
class SRMesh extends SRObject{
	geo;
	mat;
	/**
	* Adds an "x" object to your scene. Currently supports "Sphere" and "Box".
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	* @params {string} x - type of object. If blank, Constructor makes a Plane.
	*/
	constructor(scene, shape){
		super(scene);
		var newName;
		this.geo = new THREE.PlaneGeometry(9,9,32);
		this.mat = new THREE.MeshPhongMaterial( { color: 0x888888, dithering: true } );
		if(shape == "Sphere"){
			this.geo = new THREE.SphereGeometry(5,32,32);
			newName = "Sphere";
		}
		else if(shape == "Box"){
			this.geo = new THREE.BoxGeometry(5,5,5);
			newName = "Box";
		}
		else{
			newName = "Plane";
		}
		this.mat.transparent = true;
		this.mat.opacity = 1;
		this.object = new THREE.Mesh( this.geo, this.mat);
		this.object.position.set(0, 0, -1);
		this.object.name = newName;
		
	}
	add(newobject){
		
	}
	/**
	* Changes the hue color of the mesh. On a scale of 0-1.
	* @params {double} hue - value of hue.
	*/
	color(hue){
		this.mat.color.setHSL(hue/100, 1, .5);
	}
	/**
	* Changes the material of the Mesh object.
	* @params {double} x - 0 = Phong, 1 = Basic, 2 = Lambert.
	*/
	material(x){
		var oldMat = this.mat;
        switch(x){
			case 0:
				this.mat = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
				break;
			case 1:
				this.mat = new THREE.MeshBasicMaterial( { color: 0x808080, dithering: true } );
				break;
			case 2:
				this.mat = new THREE.MeshLambertMaterial( { color: 0x808080, dithering: true } );
				break;
		}
		this.mat.side = THREE.BackSide;
        this.mat.color = new THREE.Color(oldMat.color);
		this.mat.transparent = true;
		this.mat.opacity = oldMat.opacity;
		this.mat.map = oldMat.map;
		this.object.material = this.mat;
	}
	/**
	* Allows a texture to be loaded onto the mesh.
	* @params {bool} onoff - On = true, Off = false
	*/
	texture(onoff){
		var loader = new THREE.TextureLoader();
		loader.load(
			"data/graniteTXT.jpg",
			function ( texture ) {
				texture.repeat.set(.01,.01); 
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				this.object.traverse( function ( child ) {
				if(child.material.map == null)
					child.material.map = texture;
				else
					child.material.map = null;
				child.material.needsUpdate = true;
				});
			},
			undefined,
			function ( err ) {
				console.error( 'An error happened.' );
			}
		);
		
	}
	/**
	* Allows the mesh to reflect the scene background onto its surface. The scene is required in the call to load a skybox for best effect.
	* @params {bool} onoff - On = true, Off = false
	* @params {THREE.CubeTextureLoader} texturecube - Skybox code info for the reflection map.
	*/
	reflective(onoff, textureCube){
			if(onoff){
				this.mat.envMap = textureCube;
				this.mat.needsUpdate = true;
			}
			else{
				this.mat.envMap = null;
				this.mat.needsUpdate = true;
			}
	}
	/**
	* Changes the transparency of the object. On a scale of 0-1.
	* @params {double} x - value of transparency.
	*/
	transparency(x){
		this.mat.opacity = x/100;
	}
	/**
	* Updates the geometry of the object. Used with the sub classes to load in the data properly.
	* @params {THREE.Mesh} mesh - new mesh information to adapt to object.
	*/
	updateMesh(mesh){
		this.geo = mesh.geometry;
		this.mat = mesh.material;
		this.mat.transparent = true;
		this.mat.opacity = 0.5;
		this.object = new THREE.Mesh( this.geo, this.mat);
		this.object.receiveShadow = mesh.receiveShadow;
		this.object.name = mesh.name;
		scene.add(this.object);
		objects.push(this.object);
		surfaceObjects.push(this);
	};
		/**
	* Allows a local menu to show on the screen when the object is clicked on
	* @params {domElement} mesh - new mesh information to adapt to object.
	*/
	getGUIMenu(container) {
		var objParams = {
				Opacity: 50,
				Color: 0,
				Material: 'Phong',
				Recieve_Shadows: false,
				Textured: false,
				Reflective: false
		};
		var objMenu = super.getGUIMenu(container);
		var objEditor = this;
		var opacityCntrlr = objMenu.add(objParams, 'Opacity', 1 , 100);
		opacityCntrlr.onChange(function(value) {
			objEditor.transparency(value);
		});
		var colorCntrlr = objMenu.add(objParams, 'Color', 0 , 100);
		colorCntrlr.onChange(function(value) {
			objEditor.color(value);
		});
		var matCntrlr = objMenu.add(objParams, 'Material', ['Phong', 'Basic', 'Lambert']);
		matCntrlr.onChange(function(value) {
			if(value == 'Phong'){
				objEditor.material(0);
			}
			else if(value == 'Basic'){
				objEditor.material(1);
			}
			else{
				objEditor.material(2);
			}
		});
		var shadCntrlr = objMenu.add(objParams, 'Recieve_Shadows');
		shadCntrlr.onChange(function(value) {
			objEditor.recvShadow(value);
		});
		var textCntrlr = objMenu.add(objParams, 'Textured');
		textCntrlr.onChange(function(value) {
			objEditor.texture(value);
		});
		var reflectCntrlr = objMenu.add(objParams, 'Reflective');
		reflectCntrlr.onChange(function(value) {
			var path = "data/skybox/";
			var urls = [
				path + "px.jpg", path + "nx.jpg",
				path + "py.jpg", path + "ny.jpg",
				path + "pz.jpg", path + "nz.jpg"
			];
			textureCube = new THREE.CubeTextureLoader().load( urls );
			textureCube.format = THREE.RGBFormat;
			objEditor.reflective(value, textureCube);
		});
		return this.surfaceLocalMenu;
	}
	getColor(){
		
	}
	getMaterial(){
		
	}
	getTexture(){
		
	}
	getRefletive(){
		
	}
	getTransparency(){
		
	}
	getWireframe(){
		
	}
}
/**
* These objects were going to be a wireframe representation to help visually span the area that all of the objects on the scene would take up. I was not able to implement this object yet.
* @extends SRObject
*/
class SRBoundingBox extends SRObject{
	constructor(scene){
		super(scene);
	}
	Resize(){
		
	}
}
/**
* SRSurface is used to load in .obj files into your scene.
* @extends SRMesh
*/
class SRSurface extends SRMesh{
	/**
	* Adds an SRSurface to your scene. To populate it, call AddObject(String filename, SRSurface object)
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	*/
	constructor(scene){
		super(scene);
	}
}
/**
* SRSeedingCurve is used to load in 3D line coordinates into a tube and insert it into your scene.
* @extends SRMesh
*/
class SRSeedingCurve extends SRMesh{
		/**
	* Adds an SRSeedingCurve to your scene. To populate it, call GenerateLines(String filename, SRSeedingCurve object)
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	*/
	constructor(filename, scene){
		super(scene);
	}
}