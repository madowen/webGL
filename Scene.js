var Scene = {};
Scene.objects = [];
Scene.cameras = [];
Scene.lights = [];
Scene.activeCamera = 0;
Scene.ambientLight = [0.1, 0.1, 0.1, 1.0];
Scene.renderingType = 0; //0 = forward, 1 = deferred
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
	var L = vec3.normalize(vec3.create(),[1.5,1.1,1.4]); //light vector
	var cam = this.cameras[this.activeCamera];
	this.shader = null;
	//mat4.lookAt(cam.view, cam.eye, cam.center, cam.up);

	if (this.renderingType == 0){
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
					first = false;
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
		var diffuseTexture = new GL.Texture(0,0);
		diffuseTexture.drawTo(function(){
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

				shader = MicroShaderManager.getShader("deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
				shader.uniforms({
				    	m:mrot,
				    	v:cam.view,
				    	p:cam.projection,
				    	mvp:cam.mvp,
				    	umodelt:modelt,
				    	v_inv:mat4.invert(mat4.create(),cam.view),
				    	uTexture: 0,
				}).draw(this.objects[i].renderer.mesh);
			}
		});
		var positionTexture = new GL.Texture(0,0);
		positionTexture.drawTo(function(){
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

				shader = MicroShaderManager.getShader("deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
				shader.uniforms({
				    	m:mrot,
				    	v:cam.view,
				    	p:cam.projection,
				    	mvp:cam.mvp,
				    	umodelt:modelt,
				    	v_inv:mat4.invert(mat4.create(),cam.view),
				    	uTexture: 0,
				}).draw(this.objects[i].renderer.mesh);
			}
		});
		var normalsTexture = new GL.Texture(0,0);
		normalsTexture.drawTo(function(){
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

				shader = MicroShaderManager.getShader("deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
				shader.uniforms({
				    	m:mrot,
				    	v:cam.view,
				    	p:cam.projection,
				    	mvp:cam.mvp,
				    	umodelt:modelt,
				    	v_inv:mat4.invert(mat4.create(),cam.view),
				    	uTexture: 0,
				}).draw(this.objects[i].renderer.mesh);
			}
		});
		for (var l in this.lights){}

	}
}

/*	Scene.onmousedown = function(e){
		for (var i in this.objects){
			if (this.objects[i].onmousedown)
				this.objects[i].onmousedown(e);
		}
	}
	Scene.onmouseup = function(e){
		for (var i in this.objects){					
			if (this.objects[i].onmouseup)
				this.objects[i].onmouseup(e);
		}
	}*/
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
