import {AddVTKVolume} from "./AddVTKVolume.js";

// Input Function
var fileStorage;
function loadLocal(evt){
	fileStorage = evt.target.files;
	console.log(fileStorage[0]);
	document.getElementById("inputName").innerHTML = fileStorage[0].name;
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
	
	var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
			if(filetype == "txt"){
				GenerateCurves(e.target.result, currScene, true);
			}
			else if(filetype == "obj"){
				AddObject(e.target.result, currScene, true);
			}
			else if(filetype == "nrrd"){
				
			}
			else if(filetype == "vtk"){
				AddVTKVolume(e.target.result, currScene, true);
			}
			else{
				alert("Error: Bad File Type");
			};	
        };
      })(fileStorage[0]);
	  if(filetype == "txt"){
		reader.readAsText(fileStorage[0]);
	  }
	  else{
		reader.readAsDataURL(fileStorage[0]);
	  }
}