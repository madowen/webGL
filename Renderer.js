var Renderer = {}
Renderer.shader = null;

Renderer.draw = function(renderMode,channel,objects,lights,cam){
	// gl.clearColor(0.1,0.1,0.1,1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	this.shader = null;

	if (renderMode == Scene.FORWARD){
		Renderer.forwardRender(channel,objects,lights,cam);
	}else{
		Renderer.deferredRender(channel,objects,lights,cam);
	}
}


Renderer.forwardRender = function(channel,objects,lights,cam){
	// gl.clearColor(0.1,0.1,0.1,1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	for (var i = 0; i < objects.length; i++){
		object = objects[i];
		oColor = object.color;
		var firstLight = true;
		if (!object.enabled) continue;
		if (!object.objectRenderer) continue;
		for (var l = 0; l < lights.length; l++){
			light = lights[l];
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
				// uLConstantAttenuation: light.constantAttenuation,
				// uLLinearAttenuation: light.linearAttenuation,
				// uLQuadraticAttenuation: light.quadraticAttenuation,
				uLNear: light.near,
				uLFar: light.far,
				uOColor: object.color,
				cameraPosition: cam.owner.transform.position,
				nearPlane: cam.near,
				farPlane: cam.far
			}

		    object.objectRenderer.render(channel,uniforms,light.type);

			firstLight = false;
		}
	}
}

	var diffuseTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,	{type: gl.FLOAT, 	magFilter: gl.LINEAR});
	var depthTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,		{type: gl.FLOAT, 	magFilter: gl.LINEAR});
	var normalsTexture = new GL.Texture(gl.canvas.width,gl.canvas.height,	{type: gl.FLOAT, 	magFilter: gl.LINEAR});

	var modelt = mat4.create();
	var temp = mat4.create();
	var mrot;
	var i;
	var uniforms = {};

Renderer.deferredRender = function(channel,objects,lights,cam){

	Texture.drawTo([diffuseTexture,depthTexture,normalsTexture],function(){
		gl.depthMask(true);
		gl.disable( gl.CULL_FACE );

		 // gl.clearColor(0.1,0.1,0.1,1);
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		gl.enable(gl.DEPTH_TEST);
		gl.disable(gl.BLEND);
			
		for (var i = 0; i < objects.length ; ++i){
			var object = objects[i];
		 	if (!object.objectRenderer)
				continue;

			//gl.enable( gl.CULL_FACE );

			mrot = object.transform.globalModel; 

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
			cameraPosition: cam.owner.transform.position,
			nearPlane: cam.near,
			farPlane: cam.far,
			uTexture: 6
		};

			if (object.objectRenderer.texture)
				object.objectRenderer.texture.bind(6);

			this.shader = MicroShaderManager.getShader("gbuffer",["deferred_vertex"],["gbuffer_fragment"],"microShaders.xml");
			if (this.shader)
				this.shader.uniforms(uniforms).draw(object.objectRenderer.mesh);
		 }
		gl.depthMask(false);
		gl.disable( gl.DEPTH_TEST );
	});



	if (channel != Scene.FULL){
		gl.drawTexture(diffuseTexture, 	0,0, 					gl.canvas.width*0.5, gl.canvas.height*0.5);
		gl.drawTexture(depthTexture, 	gl.canvas.width*0.5,0, 	gl.canvas.width*0.5, gl.canvas.height*0.5);
		gl.drawTexture(normalsTexture, 	0,gl.canvas.height*0.5, gl.canvas.width*0.5, gl.canvas.height*0.5);
	}else{

		gl.enable(gl.BLEND);
   		gl.blendEquation(gl.FUNC_ADD);
   		gl.blendFunc(gl.ONE, gl.ONE);

		diffuseTexture.bind(0);
		depthTexture.bind(1);
		normalsTexture.bind(2);
	
		// gl.clearColor(0.1,0.1,0.1,1);
		gl.clear(gl.COLOR_BUFFER_BIT );

		var firstLight = true;		
		for (var l = 0; l < lights.length; l++){
			light = lights[l];
			if (!light.enabled || !light.owner.enabled) continue;

			if (light.owner.transform)
				mrot = light.owner.transform.globalModel; 

			mat4.multiply(temp,cam.view,mrot); 
			mat4.multiply(cam.mvp,cam.projection,temp); 
			mat4.toRotationMat4(modelt, mrot);

			v_inv = mat4.invert(mat4.create(),cam.view);
			mvp_inv = mat4.invert(mat4.create(),cam.mvp);

			uniforms = {
				m:mrot,
				v:cam.view,
				p:cam.projection,
				mvp:cam.mvp,
				umodelt:modelt,
				uAlbedoText:0,
				uDepthText:1,
				uNormalText:2,
				v_inv:v_inv,
				mvp_inv:mvp_inv,
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
				// uLConstantAttenuation: light.constantAttenuation,
				// uLLinearAttenuation: light.linearAttenuation,
				// uLQuadraticAttenuation: light.quadraticAttenuation,
				uLNear: light.near,
				uLFar: light.far,
				uScreenSize: [gl.canvas.width,gl.canvas.height],
			};

			 if (light.type == Light.DIRECTIONAL || light.type == Light.AMBIENT){
				this.shader = MicroShaderManager.getShader("deferred",["SCREEN_VERTEX_SHADER"],["deferred_fragment"],"microShaders.xml");
				if (this.shader)
					this.shader.toViewport(uniforms);
			 }else{
				this.shader = MicroShaderManager.getShader("deferred",["deferred_vertex"],["deferred_fragment"],"microShaders.xml");
				if (this.shader)
					this.shader.uniforms(uniforms).draw(GL.Mesh.sphere({size:light.far}));
			}
		}
	}
}