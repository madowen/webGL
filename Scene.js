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
Scene.render = Scene.DEFERRED; //0 = forward, 1 = deferred
Scene.shader = null;

var ambientLight = new Light(Light.AMBIENT,[0, 0, 0.6, 1]);
ambientLight.owner = Scene;
Scene.lights.push(ambientLight);

Scene.renderMode = 0;

Scene.addObject = function(object){
	this.objects.push(object);
}
Scene.addCamera = function(camera){
	this.cameras.push(camera);
}
Scene.addLight = function(light){
	this.lights.push(light);
}
Scene.draw = function(){
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	this.shader = null;
	//mat4.lookAt(cam.view, cam.eye, cam.center, cam.up);

	if (this.render == Scene.FORWARD){
		this.forwardRender();
	}else{
		this.deferredRender();
	}
}

Scene.forwardRender = function(){
	var cam = this.cameras[this.activeCamera];
	//create modelview and projection matrices
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	for (var i = 0; i < this.objects.length; i++){
		object = this.objects[i];
		oColor = object.color;
		var firstLight = true;
		if (!object.enabled) continue;
		if (!object.renderer) continue;
		for (var l = 0; l < this.lights.length; l++){
			light = this.lights[l];
			if (!light.enabled || !light.owner.enabled) continue;
			if(!firstLight){
				gl.enable( gl.BLEND );
				gl.blendFunc( gl.ONE, gl.ONE );
				gl.depthMask(false);
				gl.depthFunc(gl.LEQUAL);
			}else{
				gl.disable(gl.BLEND);
				gl.depthMask(true);
			}
			mrot = object.transform.globalModel;
			v_inv = mat4.invert(mat4.create(),cam.view);
			
			mat4.multiply(temp,cam.view,mrot); //modelview
			mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
			//compute rotation matrix for normals
			mat4.toRotationMat4(modelt, mrot);

			uniforms = {
				m:mrot,
				v:cam.view,
				p:cam.projection,
				mvp:cam.mvp,
				umodelt:modelt,
				v_inv:v_inv,
				uTexture: 0,
				uLPosition: light.position,
				uLDirection: light.direction,
				uLType: light.type,
				uLRange: light.range,
				uLIntensity: light.intensity,
				uLSpotAngle: light.spotAngle,
				uLSpotExponent: light.spotExponent,
				uLDiffuse: light.diffuse,
				uLSpecular: light.specular,
				uLAmbient: light.ambient,
				uLConstantAttenuation: light.constantAttenuation,
				uLLinearAttenuation: light.linearAttenuation,
				uLQuadraticAttenuation: light.quadraticAttenuation,
				uOColor: object.color,
				cameraPosition: cam.owner.transform.position,
				nearPlane: cam.near,
				farPlane: cam.far
			}

		    object.renderer.render(this.renderMode,uniforms,light.type);

			firstLight = false;
		}
	}
}

	var diffuseTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.HALF_FLOAT_OES});
	var depthTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.HALF_FLOAT_OES});
	var normalsTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.HALF_FLOAT_OES});

	var modelt = mat4.create();
	var temp = mat4.create();
	var mrot;
	var i;
	var uniforms = {};
	var cam;

Scene.deferredRender = function(){

	cam = this.cameras[this.activeCamera];
	Texture.drawTo([diffuseTexture,depthTexture,normalsTexture],function(){
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		gl.enable( gl.DEPTH_TEST );
		gl.disable( gl.CULL_FACE );
		gl.disable( gl.BLEND );

		uniforms = {
			m:mrot,
			v:cam.view,
			p:cam.projection,
			mvp:cam.mvp,
			umodelt:modelt,
			cameraPosition: cam.owner.transform.position,
			nearPlane: cam.near,
			farPlane: cam.far,
			uTexture: 6
		};
			
		 for (var i = 0; i < Scene.objects.length ; ++i){
			var object = Scene.objects[i];
		 	if (!object.renderer)
				continue;

			gl.enable( gl.CULL_FACE );

			mrot = object.transform.globalModel;

			mat4.multiply(temp,cam.view,mrot); //modelview
			mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
			//compute rotation matrix for normals
			mat4.toRotationMat4(modelt, mrot);

			if (object.renderer.texture)
				object.renderer.texture.bind(6);

			Scene.shader = MicroShaderManager.getShader("gbuffer",["deferred_vertex"],["gbuffer_fragment"],"microShaders.xml");
			if (Scene.shader)
				Scene.shader.uniforms(uniforms).draw(object.renderer.mesh);
		 }
	});


	gl.disable( gl.DEPTH_TEST );

	if (this.renderMode == Scene.FULL){
		gl.drawTexture(diffuseTexture, 	0,0, 					gl.canvas.width*0.5, gl.canvas.height*0.5);
		gl.drawTexture(depthTexture, 	gl.canvas.width*0.5,0, 	gl.canvas.width*0.5, gl.canvas.height*0.5);
		gl.drawTexture(normalsTexture, 	0,gl.canvas.height*0.5, gl.canvas.width*0.5, gl.canvas.height*0.5);
	}else{
		diffuseTexture.bind(0);
		depthTexture.bind(1);
		normalsTexture.bind(2);

		 Scene.shader = MicroShaderManager.getShader("deferred",["SCREEN_VERTEX_SHADER"],["deferred_fragment"],"microShaders.xml");
		uniforms = {
					uAlbedoText:0,
					uDepthText:1,
					uNormalText:2
		};
			if (Scene.shader)
				Scene.shader.toViewport(uniforms);
	}
}

Scene.update = function(dt){
	for (var i in this.objects){					
		if (this.objects[i].update)
			this.objects[i].update(dt);
	}
}

Scene.onkeydown = function(e){
	if(gl.keys['U']) this.renderMode = Scene.FULL;
	if(gl.keys['I']) this.renderMode = Scene.ALBEDO;
	if(gl.keys['O']) this.renderMode = Scene.DEPTH;
	if(gl.keys['P']) this.renderMode = Scene.NORMAL;
	if(gl.keys['Y']) this.render = !this.render;
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

Scene.GUI = function(gui){
	gui.add(this, 'deferred').name('Deferred Render').listen();
	gui.add(this, 'renderMode',{'full':0,'albedo':1,'depth':2,'normals':3}).name('Render Mode').listen();
	gui.addColor(this.lights[0], 'ambient').name('Ambient Scene').listen();
	// gui.add(this.lights[0],)
	for (var o in this.objects){
		this.objects[o].GUI(gui);
	}
	var guiLights = new dat.GUI();
	for (var l in this.lights){
		this.lights[l].GUI(guiLights,'parent');
	}

}

