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



	//G Buffer
	var w = (gl.canvas.width*0.5)|0;
	var h = (gl.canvas.height*0.5)|0;
	var type = gl.UNSIGNED_BYTE;// , gl.FLOAT, (or gl.HALF_FLOAT_OES although it doesnt work in firefox)

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


Renderer.newDeferred = function(objects,lights,cam){
	var gbuffers_shader = 	MicroShaderManager.getShader("gbuffer",["new_gbuffer_vertex"],["new_gbuffer_fragment"],"microShaders.xml");
	var final_shader = 		MicroShaderManager.getShader("deferedlight",["new_deferredlight_vertex"],["new_deferredlight_fragment"],"microShaders.xml");
	var camera_position = cam.owner.transform.position;
	
	view = cam.view;
	mat4.invert(inv_v,view);
	proj = cam.projection;

	var gbuffer_uniforms = {
		u_texture: 0,
		u_color: [1.0,1.0,1.0,1],
		u_model: model,
		u_mvp: mvp,
		u_view: view,
		u_camera_position: camera_position,
	};

	fbo.bind(true);

	gl.clearColor(0.1,0.1,0.1,1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	gl.enable( gl.DEPTH_TEST );

	mat4.multiply( viewprojection, proj, view );
	mat4.invert( inv_vp, viewprojection );
	mvp.set( viewprojection );

	for (var i = 0; i < objects.length ; ++i){
		var object = objects[i];
	 	if (!object.objectRenderer)
			continue;

		if (object.objectRenderer.texture)
			object.objectRenderer.texture.bind(0);

		model = object.transform.globalModel;
		mat4.multiply( mvp, viewprojection, model );
		if (gbuffers_shader)
			gbuffers_shader.uniforms( gbuffer_uniforms ).draw( object.objectRenderer.mesh );

		if (object.objectRenderer.texture)
			object.objectRenderer.texture.unbind(0);

	}

	fbo.unbind();

	gl.disable( gl.DEPTH_TEST );



	texture_final.drawTo(function(){
		gl.clearColor(0.0,0.0,0.0,1);
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		gl.enable( gl.DEPTH_TEST );
		gl.clear(gl.COLOR_BUFFER_BIT );
		
		gl.enable(gl.BLEND);
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFunc(gl.ONE, gl.ONE);
		gl.depthFunc(gl.LEQUAL);

		var quad = GL.Mesh.getScreenQuad();

		texture_albedo.bind(0);
		texture_normal.bind(1);
		texture_depth.bind(2);
		for (var l = 0; l < lights.length; l++){
			light = lights[l];
			if (!light.enabled || !light.owner.enabled) continue;


			var final_uniforms = {
				u_invvp: inv_vp,
				u_invv:  inv_v,
				u_viewport: gl.viewport_data,
				u_color_texture: 0,
				u_normal_texture: 1,
				u_depth_texture: 2,

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
			};


			if (final_shader){
				if (light.type == Light.DIRECTIONAL || light.type == Light.AMBIENT)
					final_shader.uniforms( final_uniforms ).draw( quad );
				else
					final_shader.uniforms( final_uniforms ).draw( GL.Mesh.sphere({size:light.far}) );
			}
		}
	gl.disable(gl.BLEND);
	});


	gl.drawTexture(texture_albedo, 0,0, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
	gl.drawTexture(texture_normal, gl.canvas.width * 0.5,0, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
	gl.drawTexture(texture_depth, 0, gl.canvas.height * 0.5, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
	gl.drawTexture(texture_final, gl.canvas.width * 0.5, gl.canvas.height * 0.5, gl.canvas.width * 0.5, gl.canvas.height * 0.5);
};
