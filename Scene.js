var Scene = function(){
this.name = "Scene";
this.enabled = true;
this.objects = [];
this.cameras = [];
this.lights = [];
this.activeCamera = 0;
this.deferred = false; //0 = forward, 1 = deferred
this.shader = null;

var ambientLight = new Light(-1,[0, 0, 0.6, 1]);
ambientLight.owner = this;
this.lights.push(ambientLight);

this.renderMode = 0;

Scene.prototype.addObject = function(object){
	this.objects.push(object);
}
Scene.prototype.addCamera = function(camera){
	this.cameras.push(camera);
}
Scene.prototype.addLight = function(light){
	this.lights.push(light);
}
Scene.prototype.draw = function(){
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	this.shader = null;
	//mat4.lookAt(cam.view, cam.eye, cam.center, cam.up);

	if (!this.deferred){
		this.forwardRender();
	}else{
		this.deferredRender();
	}
}

Scene.prototype.forwardRender = function(){
	var cam = this.cameras[this.activeCamera];
	//create modelview and projection matrices
	gl.disable(gl.BLEND);
	for (var i in this.objects){
		if (this.objects[i].enabled){
			var firstLight = true;
			if (this.objects[i].renderer){
				for (var l in this.lights){
					// var Diffuse = [this.lights[l].diffuse[0]/255,this.lights[l].diffuse[1]/255,this.lights[l].diffuse[2]/255,this.lights[l].diffuse[3]];
					// var Specular = [this.lights[l].specular[0]/255,this.lights[l].specular[1]/255,this.lights[l].specular[2]/255,this.lights[l].specular[3]];
					// var Ambient = [this.lights[l].ambient[0]/255,this.lights[l].ambient[1]/255,this.lights[l].ambient[2]/255,this.lights[l].ambient[3]];
					var Diffuse = this.lights[l].diffuse;
					var Specular = this.lights[l].specular;
					var Ambient = this.lights[l].ambient;
					if (!this.lights[l].enabled || !this.lights[l].owner.enabled){
				    	Diffuse = [0,0,0,1];
				    	Specular = [0,0,0,1];
				    	Ambient = [0,0,0,1];
					}
					if(!firstLight){
						gl.enable( gl.BLEND );
						gl.blendFunc( gl.ONE, gl.ONE );
						gl.depthMask(false);
						gl.depthFunc(gl.LEQUAL);
					}else{
						gl.disable(gl.BLEND);
						gl.depthMask(true);
					}
					var modelt = mat4.create();
					var temp = mat4.create();
					var mrot = this.objects[i].transform.globalModel;

					mat4.multiply(temp,cam.view,mrot); //modelview
					mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
					//compute rotation matrix for normals
					mat4.toRotationMat4(modelt, mrot);

					if (this.objects[i].renderer.texture)
						this.objects[i].renderer.texture.bind(0);


					var t = this.lights[l].type;
				    //render mesh using the shader
				    if (this.renderMode == 0){
						if (t == 0 || t == -1)
							this.shader = MicroShaderManager.getShader("lightDir",["fulllight_vertex"],["light_directional","light_phong","phong","basic_fragment"],'microShaders.xml');
						if (t == 1)
							this.shader = MicroShaderManager.getShader("lightPoint",["fulllight_vertex"],["light_point","light_phong","phong","basic_fragment"],'microShaders.xml');
						if (t == 2)
							this.shader = MicroShaderManager.getShader("lightSpot",["fulllight_vertex"],["light_spot","light_phong","phong","basic_fragment"],'microShaders.xml');
					}
				    if (this.renderMode == 1 ){
						this.shader = MicroShaderManager.getShader("albedo_deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
					}
				    if (this.renderMode == 2){
						this.shader = MicroShaderManager.getShader("depth_deferred_rendering",["fulllight_vertex"],["depth_deferred_fragment"],"microShaders.xml");
				    }
				    if (this.renderMode == 3){
						this.shader = MicroShaderManager.getShader("normals_deferred_rendering",["fulllight_vertex"],["normals_deferred_fragment"],"microShaders.xml");
				    }
				    if (this.objects[i].name == "gizmo")
						this.shader = MicroShaderManager.getShader("albedo_deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
					if (this.shader)
				    this.shader.uniforms({
				    	m:mrot,
				    	v:cam.view,
				    	p:cam.projection,
				    	mvp:cam.mvp,
				    	umodelt:modelt,
				    	v_inv:mat4.invert(mat4.create(),cam.view),
				    	uTexture: 0,
				    	uLPosition: this.lights[l].position,
				    	uLDirection: this.lights[l].direction,
				    	uLType: this.lights[l].type,
				    	uLRange: this.lights[l].range,
				    	uLIntensity: this.lights[l].intensity,
				    	uLSpotAngle: this.lights[l].spotAngle,
				    	uLSpotExponent: this.lights[l].spotExponent,
				    	uLDiffuse: Diffuse,
				    	uLSpecular: Specular,
				    	uLAmbient: Ambient,
				    	uLConstantAttenuation: this.lights[l].constantAttenuation,
				    	uLLinearAttenuation: this.lights[l].linearAttenuation,
				    	uLQuadraticAttenuation: this.lights[l].quadraticAttenuation,
				    	uOColor: [this.objects[i].color[0]/255,this.objects[i].color[1]/255,this.objects[i].color[2]/255,this.objects[i].color[3]],
				    	cameraPosition: cam.owner.transform.position
				    }).draw(this.objects[i].renderer.mesh);

					// if next object do not have texture, it won't get it from the buffer
					if (this.objects[i].renderer.texture)
						this.objects[i].renderer.texture.unbind(0);
					firstLight = false;
				}
			
			}
		}
		firstLight = true;
	}
}

Scene.prototype.deferredRender = function(){
	var cam = this.cameras[this.activeCamera];
	var diffuseTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.FLOAT});
	var depthTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.FLOAT});
	var normalsTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.FLOAT});


	Texture.drawTo([diffuseTexture,depthTexture,normalsTexture],function(){
		for (var i in scene.objects){
			if (scene.objects[i].renderer){
				gl.enable( gl.BLEND );
				gl.blendFunc( gl.ONE, gl.ONE );
				gl.depthMask(false);
				gl.depthFunc(gl.LEQUAL);

				var modelt = mat4.create();
				var temp = mat4.create();
				var mrot = scene.objects[i].transform.globalModel;

				mat4.multiply(temp,cam.view,mrot); //modelview
				mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
				//compute rotation matrix for normals
				mat4.toRotationMat4(modelt, mrot);

				if (scene.objects[i].renderer.texture)
					scene.objects[i].renderer.texture.bind(0);

				var uniforms = {
			    	m:mrot,
			    	v:cam.view,
			    	p:cam.projection,
			    	mvp:cam.mvp,
			    	umodelt:modelt,
			    	uTexture: 0
				};

				scene.shader = MicroShaderManager.getShader("gbuffer",["fulllight_vertex"],["gbuffer_fragment"],"microShaders.xml");
				if (scene.shader)
					scene.shader.uniforms(uniforms).draw(scene.objects[i].renderer.mesh);
			}
		}
	});
		// depthTexture.toCanvas(gl.canvas);
		gl.drawTexture(diffuseTexture, 	0,0, 					gl.canvas.width*0.5, gl.canvas.height*0.5);
		gl.drawTexture(depthTexture, 	gl.canvas.width*0.5,0, 	gl.canvas.width*0.5, gl.canvas.height*0.5);
		gl.drawTexture(normalsTexture, 	0,gl.canvas.height*0.5, gl.canvas.width*0.5, gl.canvas.height*0.5);


	// diffuseTexture.bind(0);
	// positionTexture.bind(1);
	// normalsTexture.bind(2);

	// var firstLight = true;
	// for (var l in this.lights){
	// 	if(!firstLight){
	// 		gl.enable( gl.BLEND );
	// 		gl.blendFunc( gl.ONE, gl.ONE );
	// 		gl.depthMask(false);
	// 		gl.depthFunc(gl.LEQUAL);
	// 	}else{
	// 		gl.disable(gl.BLEND);
	// 		gl.depthMask(true);
	// 	}

	// 	this.shader = MicroShaderManager.getShader("deferred",["deferred_vertex"],["deferred_fragment"],'microShaders.xml');
	// 	if (t == 0)
	// 		this.shader = MicroShaderManager.getShader("deferred_lightDir",["deferred_vertex"],["deferred_light_directional"],'microShaders.xml');
	// 	if (t == 1)
	// 		this.shader = MicroShaderManager.getShader("deferred_lightPoint",["deferred_vertex"],["deferred_light_point"],'microShaders.xml');
	// 	if (t == 2)
	// 		this.shader = MicroShaderManager.getShader("deferred_lightSpot",["deferred_vertex"],["deferred_light_spot"],'microShaders.xml');

	// 	var uniforms = {
	// 		tDiffuse:0,
	// 		tPosition:1,
	// 		tNormals:2,
	//     	uLPosition: this.lights[l].position,
	//     	uLDirection: this.lights[l].direction,
	//     	uLType: this.lights[l].type,
	//     	uLRange: this.lights[l].range,
	//     	uLIntensity: this.lights[l].intensity,
	//     	uLSpotAngle: this.lights[l].spotAngle,
	//     	uLSpotExponent: this.lights[l].spotExponent,
	//     	uLDiffuse: [this.lights[l].diffuse[0]/255,this.lights[l].diffuse[1]/255,this.lights[l].diffuse[2]/255,this.lights[l].diffuse[3]],
	//     	uLSpecular: [this.lights[l].specular[0]/255,this.lights[l].specular[1]/255,this.lights[l].specular[2]/255,this.lights[l].specular[3]],
	//     	uLAmbient: [this.lights[l].ambient[0]/255,this.lights[l].ambient[1]/255,this.lights[l].ambient[2]/255,this.lights[l].ambient[3]],
	//     	uLConstantAttenuation: this.lights[l].constantAttenuation,
	//     	uLLinearAttenuation: this.lights[l].linearAttenuation,
	//     	uLQuadraticAttenuation: this.lights[l].quadraticAttenuation,
	//     	uOColor: [this.objects[i].color[0]/255,this.objects[i].color[1]/255,this.objects[i].color[2]/255,this.objects[i].color[3]]
	// 	};
	// 	this.shader.toViewport(uniforms);

	// }
}

Scene.prototype.update = function(dt){
	for (var i in this.objects){					
		if (this.objects[i].update)
			this.objects[i].update(dt);
	}
}

Scene.prototype.onkeydown = function(e){
	if(gl.keys['U']) this.renderMode = 0;
	if(gl.keys['I']) this.renderMode = 1;
	if(gl.keys['O']) this.renderMode = 2;
	if(gl.keys['P']) this.renderMode = 3;
	if(gl.keys['Y']) this.deferredRender = !this.deferredRender;
	for (var i in this.objects){
		// console.log(e);
		this.objects[i].callMethod("onkeydown",{evento: e});
	}
}
Scene.prototype.onmousemove = function(e){
	for (var i in this.objects){
		// console.log(e);
		this.objects[i].callMethod("onmousemove",{evento: e});
	}
}

Scene.prototype.GUI = function(gui){
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
};
