var Scene = {
}
Scene.FORWARD = 0;
Scene.DEFERRED = 1;

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
Scene.renderMode = Scene.DEFERRED; //0 = forward, 1 = deferred
Scene.shader = null;

Scene.ambient = [0.005, 0.005, 0.005, 1];

Scene.channel = Scene.FULL;

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
	if(gl.keys['U']) this.channel = Scene.FULL;
	if(gl.keys['I']) this.channel = Scene.ALBEDO;
	if(gl.keys['O']) this.channel = Scene.DEPTH;
	if(gl.keys['P']) this.channel = Scene.NORMAL;
	if(gl.keys['Y']) this.renderMode = !this.renderMode;
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

