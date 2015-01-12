function Light(type,ambient,diffuse,specular,intensity,range,spotAngle,spotExponent,constantAttenuation,linearAttenuation,quadraticAttenuation,addGizmo){
	this.name = "light";
	
	this.type = type || 0 //directional = 0|| point = 1 ||spot = 2
	this.ambient = ambient || [0.5,0.5,0.5,1.0];
	this.diffuse = diffuse || [0.9,0.9,0.9,1.0];
	this.specular = specular || [0.9,0.9,0.9,1.0];
	this.intensity = intensity || 0.8;
	this.range = range || 100.0;
	this.spotAngle = spotAngle || 30.0;
	this.spotExponent = spotExponent || 1.0;
	this.constantAttenuation = constantAttenuation || 0.5;
	this.linearAttenuation = linearAttenuation || 0.4;
	this.quadraticAttenuation = quadraticAttenuation || 0.1;

	this.gizmo = true || addGizmo;

	Object.defineProperty(this, 'direction',{
		get: function() {
			return vec3.subtract([0,0,0],[0,0,0],this.owner.transform.front);
		},
	});
	Object.defineProperty(this, 'position',{
		get: function() {
			return this.owner.transform.globalPosition;
		}
	});
	
	Light.prototype.lookAt = function(eye,center,up){
		if (this.owner){
			this.owner.transform.lookAt(eye,center,up);
		}else{
			alert("Attach the light to an GameObject");
		}
	}

	Light.prototype.update = function(dt){
		if (this.gizmo){
			var obj = new GameObject("gizmo");
			obj.transform.scale = [0.1,0.1,0.1];
			obj.parent = this.owner;
			var ren = new Renderer();
			obj.addComponent(ren);
			ren.mesh = GL.Mesh.fromURL("assets/box.ase");
			ren.shader = GL.Shader.fromURL("light.vert","light.frag");
			ren.texture = GL.Texture.fromURL("assets/white.png",{temp_color:[80,120,40,255], minFilter: gl.LINEAR_MIPMAP_LINEAR});
			Scene.addObject(obj);
			this.gizmo = false;
		}
	}
}