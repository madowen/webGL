Light.DIRECTIONAL = 0
Light.POINT = 1
Light.SPOT = 2
Light.AMBIENT = 3
function Light(type,ambient,diffuse,specular,intensity,range,spotAngle,spotExponent,constantAttenuation,linearAttenuation,quadraticAttenuation,addGizmo){
	this.name = "light";
	this.enabled = true;
	
	this.type = type || Light.DIRECTIONAL //directional = 0|| point = 1 ||spot = 2
	this.ambient = ambient || [0.01,0.01,0.01,1.0];
	this.diffuse = diffuse || [0.9,0.9,0.9,1.0];
	this.specular = specular || [0.9,0.9,0.9,1.0];
	this.intensity = intensity || 0.88;
	this.range = range || 1.0;
	this.spotAngle = spotAngle || 30.0;
	this.spotExponent = spotExponent || 1.0;
	this.constantAttenuation = constantAttenuation || 0.09;
	this.linearAttenuation = linearAttenuation || 0.08;
	this.quadraticAttenuation = quadraticAttenuation ||  0.17;

	this.gizmo = true || addGizmo;

	Object.defineProperty(this, 'direction',{
		get: function() {
			if (this.owner.transform)
				return vec3.subtract([0,0,0],[0,0,0],this.owner.transform.front);
			else
				return [0,0,0];
		},
	});
	Object.defineProperty(this, 'position',{
		get: function() {
			if (this.owner.transform)
				return this.owner.transform.globalPosition;
			else
				return [0,0,0];
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
			obj.transform.scale = [0,0,0];
			obj.parent = this.owner;
			var ren = new Renderer();
			obj.addComponent(ren);
			ren.mesh = GL.Mesh.sphere();
			var temp_color = [this.diffuse[0]*255,this.diffuse[1]*255,this.diffuse[2]*255,this.diffuse[3]];
			ren.texture = GL.Texture.fromURL("assets/white.png",{temp_color:temp_color, minFilter: gl.LINEAR_MIPMAP_LINEAR});
			Scene.addObject(obj);
			this.gizmo = false;
		}
	}

	Light.prototype.GUI = function(gui,name){

		var guiLight = gui.addFolder(name == 'parent' ? this.owner.name : 'Light');
		guiLight.add(this,'enabled').name('Enabled').listen();
		guiLight.add(this,'type',{'Ambient':-1,'Directional':0,'Point':1,'Spot':2}).name('Type').listen();

		guiLight.add(this,'intensity').name('Intensity').step(0.01).min(0);
		guiLight.add(this,'range').name('Range').min(0);
		guiLight.add(this,'spotAngle').name('Spot Angle').min(0);
		guiLight.add(this,'spotExponent').name('Spot Exponent');
		guiLight.add(this,'constantAttenuation',0,1).name('Constant Attenuation').step(0.001);
		guiLight.add(this,'linearAttenuation',0,1).name('Linear Attenuation').step(0.001);
		guiLight.add(this,'quadraticAttenuation',0,1).name('Quadratic Attenuation').step(0.001);
	
		var guiLightColor = guiLight.addFolder('Color');
		{
			guiLightColor.addColor(this,'ambient');
			guiLightColor.addColor(this,'specular');
			guiLightColor.addColor(this,'diffuse');
		}
	}
}
