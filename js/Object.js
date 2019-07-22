//Holds meshes of the objects for the raycaster in Surface view
var objects = [];
//Holds the current SRObjects in the Surface rendering scene
var surfaceObjects = [];
//Holds meshes of the objects for the raycaster in Volume view
var vObjects = [];
//Holds the current SRObjects in the Surface volume scene
var volumeObjects = [];
/** 
* @class SRObject
* @classdesc This is the type in which all scene objects fall under other than the scene and the camera. This is a base class, so you will not need to construct an object as an SRObject. Instead, utilize the constructors with the children classes. 
*/
class SRObject{
	object;
	posParams;
	rotParams;
	constructor(sceneName){
		this.object = new THREE.Object3D();
		this.posParams = {
			X: 0,
			Y: 0,
			Z: 0
		};
		this.rotParams = {
			X: 0,
			Y: 0,
			Z: 0
		};
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
		console.log(this.object.name);
		console.log(this.object.castShadow);
		console.log(this.object.receiveShadow);
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
	getGUIMenu() {
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
		var objEditor = this;
		
		//Position folder
		var posMenu = this.surfaceLocalMenu.addFolder("Position");
		var posXCntrlr = posMenu.add(this.posParams, 'X', -5 , 5);
		posXCntrlr.onChange(function(value) {
			var currPos  = objEditor.Position;
			objEditor.position(value, currPos.y, currPos.z);
		});
		var posYCntrlr = posMenu.add(this.posParams, 'Y', -5 , 5);
		posYCntrlr.onChange(function(value) {
			var currPos  = objEditor.Position;
			objEditor.position(currPos.x, value, currPos.z);
		});
		var posZCntrlr = posMenu.add(this.posParams, 'Z', -5 , 5);
		posZCntrlr.onChange(function(value) {
			var currPos  = objEditor.Position;
			objEditor.position(currPos.x, currPos.y, value);
		});
		
		//Rotation folder
		var rotMenu = this.surfaceLocalMenu.addFolder("Rotation");
		var rotXCntrlr = rotMenu.add(this.rotParams, 'X', -5 , 5);
		rotXCntrlr.onChange(function(value) {
			var currRot  = objEditor.Rotation;
			objEditor.rotate(value, currRot.y, currRot.z);
		});
		var rotYCntrlr = rotMenu.add(this.rotParams, 'Y', -5 , 5);
		rotYCntrlr.onChange(function(value) {
			var currRot  = objEditor.Rotation;
			objEditor.rotate(currRot.x, value, currRot.z);
		});
		var rotZCntrlr = rotMenu.add(this.rotParams, 'Z', -5 , 5);
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
	/**
	* Add a node to represent the object in our 2D space
	* 
	*/
	generate2DNode() {
		//nodes.push({ id: this.object.name, reflexive: false });
		console.log("node function");
	}
	/**
	* Hides the object from the scene
	* @param {bool} onoff - On = true, Off = false
	* 
	*/
	hideObject(onOff) {
		this.object.traverse ( function (child) {
			if (child instanceof THREE.Mesh) {
				child.visible = onOff;
			}
		});
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
	constructor(sceneName){
		super(sceneName);
		this.object = new THREE.AmbientLight(0x777777);
		this.object.position.set(0, 0, 0);
		this.object.name = "Light";
		sceneName.add( this.object );
		surfaceObjects.push(this);
		objects.push(this.object);
		this.generate2DNode();
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
	type(x, sceneName){
		var temp = this.object;
		if(x = "Point"){
			this.object = new THREE.PointLight(0xffffff);
			this.object.shadow.mapSize.width = 1024;
			this.object.shadow.mapSize.height = 1024; 
		}
		else{
			this.object = new THREE.AmbientLight(0x777777);
		}
		this.object.position.set(temp.position);
		sceneName.add( this.object );
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
	objParams;
	/**
	* Adds an "x" object to your scene. Currently supports "Sphere" and "Box".
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	* @params {string} x - type of object. If blank, Constructor makes a Plane.
	*/
	constructor(sceneName, shape){
		super(sceneName);
		this.objParams = {
			Opacity: 50,
			Color: 0,
			Material: 'Phong',
			Recieve_Shadows: false,
			Textured: false,
			Reflective: false,
			Hide: false
		};
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
		var materialPtr = this.mat;
		loader.load(
			"data/graniteTXT.jpg",
			function ( texture ) {
				texture.repeat.set(.01,.01); 
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				if(materialPtr.map == null)
					materialPtr.map = texture;
				else
					materialPtr.map = null;
				materialPtr.needsUpdate = true;
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
	updateMesh(mesh, sceneName){
		this.geo = mesh.geometry;
		this.mat = mesh.material;
		this.mat.transparent = true;
		this.mat.opacity = 0.5;
		this.object = new THREE.Mesh( this.geo, this.mat);
		this.object.receiveShadow = mesh.receiveShadow;
		this.object.name = mesh.name;
		sceneName.add(this.object);
		objects.push(this.object);
		surfaceObjects.push(this);
		this.generate2DNode();
	};
	/**
	* Allows a local menu to show on the screen when the object is clicked on
	* @params {domElement} mesh - new mesh information to adapt to object.
	*/
	getGUIMenu() {
		var objMenu = super.getGUIMenu();
		var objEditor = this;
		var opacityCntrlr = objMenu.add(this.objParams, 'Opacity', 1 , 100);
		opacityCntrlr.onChange(function(value) {
			objEditor.transparency(value);
		});
		var colorCntrlr = objMenu.add(this.objParams, 'Color', 0 , 100);
		colorCntrlr.onChange(function(value) {
			objEditor.color(value);
			document.getElementById(objEditor.object.name).setAttribute("stroke", "#" + objEditor.mat.color.getHexString())
			document.getElementById(objEditor.object.name).setAttribute("stroke", "#" + objEditor.mat.color.getHexString());
			
		});
		var matCntrlr = objMenu.add(this.objParams, 'Material', ['Phong', 'Basic', 'Lambert']);
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
		var shadCntrlr = objMenu.add(this.objParams, 'Recieve_Shadows');
		shadCntrlr.onChange(function(value) {
			objEditor.recvShadow(value);
		});
		var textCntrlr = objMenu.add(this.objParams, 'Textured');
		textCntrlr.onChange(function(value) {
			objEditor.texture(value);
		});
		var reflectCntrlr = objMenu.add(this.objParams, 'Reflective');
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
		var hideCntrlr = objMenu.add(this.objParams, 'Hide');
		hideCntrlr.onChange(function(value) {
			objEditor.hideObject(!value);
		});
		if (!(this instanceof SRVolume)){
			return this.surfaceLocalMenu;
		}
		else{
			return objMenu;
		}
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
	constructor(sceneName){
		super(sceneName);
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
	* Adds an SRSurface to your scene. To populate it, call AddObject(String filename, THREE.Scene scene)
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	*/
	constructor(sceneName){
		super(sceneName);
	}
}
/**
* SRSeedingCurve is used to load in 3D line coordinates into a tube and insert it into your scene.
* @extends SRMesh
*/
class SRSeedingCurve extends SRMesh{
		/**
	* Adds an SRSeedingCurve to your scene. To populate it, call GenerateLines(String filename, THREE.Scene scene)
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	*/
	dataOne;
	dataTwo;
	constructor(filename, sceneName){
		super(sceneName);
		this.dataOne = [];
		this.dataTwo = [];
	}
	/**
	* Can load an array of data into the object to be used for 2D rendering
	* @params {Array} data - array of data to load into the object.
	*/
	loadDataOne(data){
		for(var a = 0; a < data.length; a++){
			this.dataOne.push(data[a]);
		}
	};
	/**
	* Can load an second array of data into the object to be used for 2D rendering
	* @params {Array} data - array of data to load into the object.
	*/
	loadDataTwo(data){
		for(var a = 0; a < data.length; a++){
			this.dataTwo.push(data[a]);
		}
	};
}
/**
* SRVolume is used to load in .nrrd files into your scene.
* @extends SRMesh
*/
class SRVolume extends SRMesh{
	/**
	* Adds an SRVolume to your scene. To populate it, call AddVolume(String filename, String textureMapName, THREE.Scene scene)
	* @constructor
	* @params {THREE.Scene} scene - Scene you would like to add an object to.
	*/
	volConfig;
	constructor(sceneName){
		super(sceneName);
		this.volConfig = { clim1: 0, clim2: 1 };
	}
		/**
	* Updates the geometry of the object. Used with the sub classes to load in the data properly.
	* @params {THREE.Mesh} mesh - new mesh information to adapt to object.
	*/
	updateMesh(mesh, sceneName){
		this.geo = mesh.geometry;
		this.mat = mesh.material;
		this.mat.transparent = true;
		this.mat.opacity = 0.5;
		this.object = new THREE.Mesh( this.geo, this.mat);
		this.object.receiveShadow = mesh.receiveShadow;
		this.object.name = mesh.name;
		sceneName.add(this.object);
		vObjects.push(this.object);
		volumeObjects.push(this);
		this.generate2DNode();
	};
	
	getGUIMenu() {
		var objMenu = super.getGUIMenu();
		var objEditor = this;
		objMenu.add( this.volConfig, 'clim1', 0, 1, 0.01 ).onChange( this.updateUniforms(objEditor));
		objMenu.add( this.volConfig, 'clim2', 0, 1, 0.01 ).onChange( this.updateUniforms(objEditor));
		return this.surfaceLocalMenu;
	}
	
	updateUniforms(volObject){
			volObject.mat.uniforms[ "u_clim" ].value.set( volObject.volConfig.clim1, volObject.volConfig.clim2);
	}
}