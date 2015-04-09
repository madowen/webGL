function Renderer(mesh,texture,shader){
	this.name = "renderer";
	this.mesh = mesh;
	this.texture = texture;
	this.shader = shader;

	Renderer.prototype.render = function(renderMode,uniforms,light){

		if (this.texture)
			this.texture.bind(0);


		var t = light.type;
	    //render mesh using the shader
	    if (renderMode == Scene.FULL){
			if (t == Light.DIRECTIONAL || t == Light.AMBIENT)
				this.shader = MicroShaderManager.getShader("lightDir",["fulllight_vertex"],["light_directional","light_phong","phong","basic_fragment"],'microShaders.xml');
			else if (t == Light.POINT)
				this.shader = MicroShaderManager.getShader("lightPoint",["fulllight_vertex"],["light_point","light_phong","phong","basic_fragment"],'microShaders.xml');
			else if (t == Light.SPOT)
				this.shader = MicroShaderManager.getShader("lightSpot",["fulllight_vertex"],["light_spot","light_phong","phong","basic_fragment"],'microShaders.xml');
		}
	    else if (renderMode == Scene.ALBEDO ){
			this.shader = MicroShaderManager.getShader("albedo_deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");
		}
	    else if (renderMode == Scene.DEPTH){
			this.shader = MicroShaderManager.getShader("depth_deferred_rendering",["fulllight_vertex"],["depth_deferred_fragment"],"microShaders.xml");
	    }
	    else if (renderMode == Scene.NORMAL){
			this.shader = MicroShaderManager.getShader("normals_deferred_rendering",["fulllight_vertex"],["normals_deferred_fragment"],"microShaders.xml");
	    }
	    if (this.owner.name == "gizmo")
			this.shader = MicroShaderManager.getShader("albedo_deferred_rendering",["fulllight_vertex"],["albedo_deferred_fragment"],"microShaders.xml");

		if (this.shader)
		this.shader.uniforms(uniforms).draw(this.mesh);

		// if next object do not have texture, it won't get it from the buffer
		if (this.texture)
			this.texture.unbind(0);


	}
}