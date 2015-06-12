var Renderer = {}
Renderer.shader = null;

Renderer.draw = function(renderMode,channel,objects,lights,cam){
	// gl.clearColor(0.1,0.1,0.1,1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	this.shader = null;

	if (renderMode == Scene.FORWARD){
		Renderer.forwardRender(channel,objects,lights,cam);
	}else{
		//Renderer.deferredRender(channel,objects,lights,cam);
		Renderer.newDeferred(objects,lights,cam);
	}
}

var modelt = mat4.create();
var uniforms = {};

Renderer.forwardRender = function(channel,objects,lights,cam){
	// gl.clearColor(0.1,0.1,0.1,1);
	//if (gl.clearDepth) gl.clearDepth(1.0); else gl.clearDepthf(1.0); 
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	view = cam.view;
	mat4.invert(inv_v,view);
	proj = cam.projection;
	
	mat4.multiply( viewprojection, proj, view );
	mvp.set( viewprojection );

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
			model = object.transform.globalModel;			
			mat4.multiply( mvp, viewprojection, model );
			v_inv = mat4.invert(mat4.create(),cam.view);

			//compute rotation matrix for normals
			mat4.toRotationMat4(modelt, model);

			uniforms = {
				m:model,
				v:view,
				p:proj,
				mvp:mvp,
				umodelt:modelt,
				v_inv:inv_v,
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
				uLNear: light.near,
				uLFar: light.far,
				uOColor: oColor,
				cameraPosition: cam.owner.transform.position,
				nearPlane: cam.near,
				farPlane: cam.far
			}

		    object.objectRenderer.render(channel,uniforms,light.type);

			firstLight = false;
			gl.depthMask(true);

		}
	}
}



	//G Buffer
	var w = (gl.canvas.width*0.5)|0;
	var h = (gl.canvas.height*0.5)|0;
	var type = gl.UNSIGNED_BYTE;

	var texture_albedo = new GL.Texture(w,h, { type: type, filter: gl.NEAREST });
	var texture_normal = new GL.Texture(w,h, { type: type, filter: gl.NEAREST });
	var texture_depth = new GL.Texture(w,h, { format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_INT, filter: gl.NEAREST }); 
	var textures = [ texture_albedo, texture_normal ];
	var fbo = new GL.FBO( textures, texture_depth );
	var texture_final = new GL.Texture(w,h, { type: type, filter: gl.NEAREST });

	//matrices
	var proj = mat4.create();
	var view = mat4.create();
	var viewprojection = mat4.create();
	var inv_v = mat4.create();
	var inv_vp = mat4.create();
	var model = mat4.create();
	var mvp = mat4.create();
	var temp = mat4.create();
	var identity = mat4.create();

	gl.clearColor(0.1,0.1,0.1,1);
	gl.enable( gl.DEPTH_TEST );

	var gbuffers_shader = null;
	var final_shader_quad = null;
	var final_shader_sphere = null;
	var camera_position = null;

	var quad = GL.Mesh.getScreenQuad();
	var sphere = GL.Mesh.sphere();

	var gbuffer_uniforms = {};
	var final_uniforms = {};

Renderer.newDeferred = function(objects,lights,cam){

	gbuffers_shader = 	MicroShaderManager.getShader("gbuffer",["new_gbuffer_vertex"],["new_gbuffer_fragment"],"microShaders.xml");
	final_shader_quad = MicroShaderManager.getShader("deferedlightQuad",["new_deferredlight_vertex"],["new_deferredlight_fragment"],"microShaders.xml");
	final_shader_sphere = MicroShaderManager.getShader("deferedlightSphere",["new_gbuffer_vertex"],["new_deferredlight_fragment"],"microShaders.xml");
	camera_position = cam.owner.transform.position;

	view = cam.view;
	mat4.invert(inv_v,view);
	proj = cam.projection;

	// GEOMETRY PASS (GBUFFER GENERATION) //
	fbo.bind(true);

	gl.clearColor(0.1,0.1,0.1,1);
 	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	gl.enable( gl.DEPTH_TEST );
	gl.disable(gl.BLEND);

	mat4.multiply( viewprojection, proj, view );
	mat4.invert( inv_vp, viewprojection );
	mvp.set( viewprojection );

	for (var i = 0; i < objects.length ; ++i){
		var object = objects[i];
		if (!object.enabled || !object.objectRenderer) continue;

		if (object.objectRenderer.texture)
			object.objectRenderer.texture.bind(0);

		model = object.transform.globalModel;
		mat4.multiply( mvp, viewprojection, model );

		gbuffer_uniforms = {
			u_texture: 			0,
			u_color: 			object.color,
			u_model: 			model,
			u_mvp: 				mvp,
			u_view: 			view,
			u_camera_position: 	camera_position,
		};

		if (gbuffers_shader)
			gbuffers_shader.uniforms( gbuffer_uniforms ).draw( object.objectRenderer.mesh );

		if (object.objectRenderer.texture)
			object.objectRenderer.texture.unbind(0);

	}

	fbo.unbind();
	gl.disable( gl.DEPTH_TEST );

	// LIGHT PASS //
	texture_final.drawTo(function(){
		
		gl.enable(gl.BLEND);
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFunc(gl.ONE, gl.ONE);

		texture_albedo.bind(0);
		texture_normal.bind(1);
		texture_depth.bind(2);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		firstLight = true;
		for (var l = 0; l < lights.length; l++){
			light = lights[l];
			if (!light.enabled || !light.owner.enabled) continue;

			model = light.owner.transform.globalModel;
			mat4.scale(model,model,vec4.fromValues(light.far,light.far,light.far,1.0));
			mat4.multiply( mvp, viewprojection, model );

			final_uniforms = {
				u_invvp: 			inv_vp,
				u_invv:  			inv_v,
				u_mvp:   			mvp,
				u_viewport: 		gl.viewport_data,
				u_color_texture: 	0,
				u_normal_texture: 	1,
				u_depth_texture: 	2,

				uLPosition: 		light.position,
				uLDirection: 		light.direction,
				uLType: 			light.type,
				uLRange: 			light.range,
				uLIntensity: 		light.intensity,
				uLSpotAngle: 		light.spotAngle,
				uLSpotExponent: 	light.spotExponent,
				uLDiffuse: 			light.diffuse,
				uLSpecular: 		light.specular,
				uLAmbient: 			light.ambient,
				uLNear: 			light.near,
				uLFar: 				light.far,
			};

			if (light.type == Light.DIRECTIONAL || light.type == Light.AMBIENT){
				if (final_shader_quad)
					final_shader_quad.uniforms(final_uniforms).draw( quad );
				
			}else{
				gl.enable(gl.CULL_FACE);
				gl.cullFace(gl.FRONT);
				if (final_shader_sphere)
					final_shader_sphere.uniforms(final_uniforms).draw(sphere);
				gl.cullFace(gl.BACK);
				gl.disable(gl.CULL_FACE);
			}
		}
		gl.disable(gl.BLEND);
	});


			gl.disable(gl.DEPTH_TEST);
	gl.drawTexture(texture_albedo, 0,0, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
	gl.drawTexture(texture_normal, gl.canvas.width * 0.5,0, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
	gl.drawTexture(texture_depth, 0, gl.canvas.height * 0.5, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
	gl.drawTexture(texture_final, gl.canvas.width * 0.5, gl.canvas.height * 0.5, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
};
