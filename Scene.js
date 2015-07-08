var Scene = {
}
Scene.FORWARD = 0;
Scene.DEFERRED = 1;
Scene.GBUFFER = 2;

Scene.name = "Scene";
Scene.enabled = true;
Scene.objects = [];
Scene.cameras = [];
Scene.lights = [];
Scene.activeCamera = 0;
Scene.renderMode = Scene.DEFERRED; //0 = forward, 1 = deferred
Scene.shader = null;

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
	if(gl.keys['Y']){
		this.renderMode = (this.renderMode+1)%3;
		if (!this.renderMode) console.log("Render Mode: Forward");
		else console.log("Render Mode: Deferred");
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

