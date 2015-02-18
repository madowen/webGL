var Scene = {};
Scene.objects = [];
Scene.cameras = [];
Scene.lights = [];
Scene.activeCamera = 0;
Scene.ambientLight = [0.1, 0.1, 0.1, 1.0];
Scene.deferredRender = false; //0 = forward, 1 = deferred
Scene.shader = null;

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
	var cam = this.cameras[this.activeCamera];
	this.shader = null;
	//mat4.lookAt(cam.view, cam.eye, cam.center, cam.up);

	if (!this.deferredRender){
		//create modelview and projection matrices
		gl.disable(gl.BLEND);
		for (var i in this.objects){
			var firstLight = true;
			if (this.objects[i].renderer){
				for (var l in this.lights){
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
						if (t == 0)
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
						this.shader = MicroShaderManager.getShader("position_deferred_rendering",["fulllight_vertex"],["position_deferred_fragment"],"microShaders.xml");
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
				    	uLDiffuse: this.lights[l].diffuse,
				    	uLSpecular: this.lights[l].specular,
				    	uLConstantAttenuation: this.lights[l].constantAttenuation,
				    	uLLinearAttenuation: this.lights[l].linearAttenuation,
				    	uLQuadraticAttenuation: this.lights[l].quadraticAttenuation,
				    	uSceneAmbient: !firstLight ? Scene.ambientLight : [0,0,0,0],
				    	uOColor: this.objects[i].color
				    }).draw(this.objects[i].renderer.mesh);

					// if next object do not have texture, it won't get it from the buffer
					if (this.objects[i].renderer.texture)
						this.objects[i].renderer.texture.unbind(0);
					firstLight = false;
				}
			}
			firstLight = true;
		}
	}else{
		var diffuseTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.FLOAT});
		var positionTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.FLOAT});
		var normalsTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,{type: gl.FLOAT});
		var uniforms = {
				    	m:mrot,
				    	v:cam.view,
				    	p:cam.projection,
				    	mvp:cam.mvp,
				    	umodelt:modelt,
				    	v_inv:mat4.invert(mat4.create(),cam.view),
				    	uTexture: 0,
					};
		Texture.drawTo([diffuseTexture,positionTexture,normalsTexture],function(){
			for (var i in this.objects){
				gl.enable( gl.BLEND );
				gl.blendFunc( gl.ONE, gl.ONE );
				gl.depthMask(false);
				gl.depthFunc(gl.LEQUAL);

				var modelt = mat4.create();
				var temp = mat4.create();
				var mrot = this.objects[i].transform.globalModel;

				mat4.multiply(temp,cam.view,mrot); //modelview
				mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
				//compute rotation matrix for normals
				mat4.toRotationMat4(modelt, mrot);

				this.shader = MicroShaderManager.getShader("gbuffer",["fulllight_vertex"],["gbuffer_fragment"],"microShaders.xml");
				this.shader.uniforms(uniforms).draw(this.objects[i].renderer.mesh);
			}
		});
		// diffuseTexture.drawTo(function(){
		// 	for (var i in this.objects){
		// 		gl.enable( gl.BLEND );
		// 		gl.blendFunc( gl.ONE, gl.ONE );
		// 		gl.depthMask(false);
		// 		gl.depthFunc(gl.LEQUAL);

		// 		var modelt = mat4.create();
		// 		var temp = mat4.create();
		// 		var mrot = this.objects[i].transform.globalModel;

		// 		mat4.multiply(temp,cam.view,mrot); //modelview
		// 		mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
		// 		//compute rotation matrix for normals
		// 		mat4.toRotationMat4(modelt, mrot);

		// 		this.shader = MicroShaderManager.getShader("albedo_deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
		// 		this.shader.uniforms({
		// 		    	m:mrot,
		// 		    	v:cam.view,
		// 		    	p:cam.projection,
		// 		    	mvp:cam.mvp,
		// 		    	umodelt:modelt,
		// 		    	v_inv:mat4.invert(mat4.create(),cam.view),
		// 		    	uTexture: 0,
		// 		}).draw(this.objects[i].renderer.mesh);
		// 	}
		// });
		// positionTexture.drawTo(function(){
		// 	for (var i in this.objects){
		// 		gl.enable( gl.BLEND );
		// 		gl.blendFunc( gl.ONE, gl.ONE );
		// 		gl.depthMask(false);
		// 		gl.depthFunc(gl.LEQUAL);

		// 		var modelt = mat4.create();
		// 		var temp = mat4.create();
		// 		var mrot = this.objects[i].transform.globalModel;

		// 		mat4.multiply(temp,cam.view,mrot); //modelview
		// 		mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
		// 		//compute rotation matrix for normals
		// 		mat4.toRotationMat4(modelt, mrot);

		// 		this.shader = MicroShaderManager.getShader("position_deferred_rendering",["fulllight_vertex"],["position_deferred_fragment"],"microShaders.xml");
		// 		this.shader.uniforms({
		// 		    	m:mrot,
		// 		    	v:cam.view,
		// 		    	p:cam.projection,
		// 		    	mvp:cam.mvp,
		// 		    	umodelt:modelt,
		// 		    	v_inv:mat4.invert(mat4.create(),cam.view),
		// 		    	uTexture: 0,
		// 		}).draw(this.objects[i].renderer.mesh);
		// 	}
		// });
		// normalsTexture.drawTo(function(){
		// 	for (var i in this.objects){
		// 		gl.enable( gl.BLEND );
		// 		gl.blendFunc( gl.ONE, gl.ONE );
		// 		gl.depthMask(false);
		// 		gl.depthFunc(gl.LEQUAL);

		// 		var modelt = mat4.create();
		// 		var temp = mat4.create();
		// 		var mrot = this.objects[i].transform.globalModel;

		// 		mat4.multiply(temp,cam.view,mrot); //modelview
		// 		mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection
		// 		//compute rotation matrix for normals
		// 		mat4.toRotationMat4(modelt, mrot);

		// 		this.shader = MicroShaderManager.getShader("normals_deferred_rendering",["fulllight_vertex"],["normals_deferred_fragment"],"microShaders.xml");
		// 		this.shader.uniforms({
		// 		    	m:mrot,
		// 		    	v:cam.view,
		// 		    	p:cam.projection,
		// 		    	mvp:cam.mvp,
		// 		    	umodelt:modelt,
		// 		    	v_inv:mat4.invert(mat4.create(),cam.view),
		// 		    	uTexture: 0,
		// 		}).draw(this.objects[i].renderer.mesh);
		// 	}
		// });

		diffuseTexture.bind(0);
		positionTexture.bind(1);
		normalsTexture.bind(2);

		var firstLight = true;
		for (var l in this.lights){
			if(!firstLight){
				gl.enable( gl.BLEND );
				gl.blendFunc( gl.ONE, gl.ONE );
				gl.depthMask(false);
				gl.depthFunc(gl.LEQUAL);
			}else{
				gl.disable(gl.BLEND);
				gl.depthMask(true);
			}

			this.shader = MicroShaderManager.getShader("deferred",["deferred_vertex"],["deferred_fragment"],'microShaders.xml');
			if (t == 0)
				this.shader = MicroShaderManager.getShader("deferred_lightDir",["deferred_vertex"],["deferred_light_directional"],'microShaders.xml');
			if (t == 1)
				this.shader = MicroShaderManager.getShader("deferred_lightPoint",["deferred_vertex"],["deferred_light_point"],'microShaders.xml');
			if (t == 2)
				this.shader = MicroShaderManager.getShader("deferred_lightSpot",["deferred_vertex"],["deferred_light_spot"],'microShaders.xml');

			var uniforms = {
				tDiffuse:0,
				tPosition:1,
				tNormals:2,
		    	uLPosition: this.lights[l].position,
		    	uLDirection: this.lights[l].direction,
		    	uLType: this.lights[l].type,
		    	uLRange: this.lights[l].range,
		    	uLIntensity: this.lights[l].intensity,
		    	uLSpotAngle: this.lights[l].spotAngle,
		    	uLSpotExponent: this.lights[l].spotExponent,
		    	uLDiffuse: this.lights[l].diffuse,
		    	uLSpecular: this.lights[l].specular,
		    	uLConstantAttenuation: this.lights[l].constantAttenuation,
		    	uLLinearAttenuation: this.lights[l].linearAttenuation,
		    	uLQuadraticAttenuation: this.lights[l].quadraticAttenuation,
		    	uSceneAmbient: !firstLight ? Scene.ambientLight : [0,0,0,0],
			};
			this.shader.toViewport(uniforms);

		}

	}
}


Scene.update = function(dt){
	for (var i in this.objects){					
		if (this.objects[i].update)
			this.objects[i].update(dt);
	}
}

Scene.onkeydown = function(e){
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
Scene.onmousemove = function(e){
	for (var i in this.objects){
		// console.log(e);
		this.objects[i].callMethod("onmousemove",{evento: e});
	}
}
