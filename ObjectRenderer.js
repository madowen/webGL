function ObjectRenderer(mesh,texture,shader){
	this.name = "objectRenderer";
	this.mesh = mesh;
	this.texture = texture;
	this.shader = shader;

	ObjectRenderer.prototype.render = function(renderMode,uniforms,type){

		if (this.texture)
			this.texture.bind(0);


		var t = type;

		if (t == Light.DIRECTIONAL || t == Light.AMBIENT)
			this.shader = MicroShaderManager.getShader("lightDir",["fulllight_vertex"],["light_directional","light_phong","phong","basic_fragment"],'microShaders.xml');
		else if (t == Light.POINT)
			this.shader = MicroShaderManager.getShader("lightPoint",["fulllight_vertex"],["light_point","light_phong","phong","basic_fragment"],'microShaders.xml');
		else if (t == Light.SPOT)
			this.shader = MicroShaderManager.getShader("lightSpot",["fulllight_vertex"],["light_spot","light_phong","phong","basic_fragment"],'microShaders.xml');
	    
		if (this.shader)
		this.shader.uniforms(uniforms).draw(this.mesh);

		if (this.texture)
			this.texture.unbind(0);


	}
}

