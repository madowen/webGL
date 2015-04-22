var Scene = {
}
//Render Type
Scene.FORWARD = 0;
Scene.DEFERRED = 1;

//Render Mode
Scene.FULL = 0;
Scene.ALBEDO = 1;
Scene.DEPTH = 2;
Scene.NORMAL = 3;

Scene.name = "Scene";
Scene.enabled = true;
Scene.objects = [];
Scene.cameras = [];
Scene.lights = [];
Scene.activeCamera = 0;
Scene.renderType = Scene.DEFERRED; //0 = forward, 1 = deferred

var ambientLight = new Light();
ambientLight.ambient = [0.005, 0.005, 0.005, 1];
ambientLight.diffuse = [0, 0, 0, 1];
ambientLight.specular = [0, 0, 0, 1];
ambientLight.owner = Scene;
// Scene.lights.push(ambientLight);

Scene.renderMode = Scene.FULL;

Scene.addObject = function(object){
	this.objects.push(object);
}
Scene.addCamera = function(camera){
	this.cameras.push(camera);
}
Scene.addLight = function(light){
	this.lights.push(light);
}

Scene.update = function(dt){
	for (var i in this.objects){					
		if (this.objects[i].update)
			this.objects[i].update(dt);
	}
}

Scene.onkeydown = function(e){
	if(gl.keys['U']){ 
		this.renderMode = Scene.FULL;
		console.log("Full mode");
	}
	if(gl.keys['I']){ 
		this.renderMode = Scene.ALBEDO;
		console.log("Albedo mode");
	}
	if(gl.keys['O']){ 
		this.renderMode = Scene.DEPTH;
		console.log("Depth mode");
	}
	if(gl.keys['P']){ 
		this.renderMode = Scene.NORMAL;
		console.log("Normal mode");
	}
	if(gl.keys['Y']){ 
		this.renderType = !this.renderType;
		console.log(this.renderType?"Deferred mode":"Forward mode");
	}
	for (var i in this.objects){
		// console.log(e);
		this.objects[i].callMethod("onkeydown",{evento: e});
	}
}
Scene.onmousemove = function(e){
	for (var i in this.objects){
		// console.log(e);
		this.objects[i].callMethod("onmousemove",{evento: e});
	}
}

