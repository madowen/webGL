Light.DIRECTIONAL = 0
Light.POINT = 1
Light.SPOT = 2
Light.AMBIENT = 3
function Light(type,ambient,diffuse,specular,intensity,range,spotAngle,spotExponent,constantAttenuation,linearAttenuation,quadraticAttenuation,att_near,att_far){
	this.name = "light";
	this.enabled = true;
	
	this.type = type || Light.DIRECTIONAL //directional = 0|| point = 1 ||spot = 2
    this.ambient = ambient || [0.005,0.005,0.005,1.0];
   	this.diffuse = diffuse || [0.9,0.9,0.9,1.0];
	this.specular = specular || [0.9,0.9,0.9,1.0];
	this.intensity = intensity || 0.88;
	this.range = range || 1.0;
	this.spotAngle = spotAngle || 30.0;
	this.spotExponent = spotExponent || 1.0;
	this.constantAttenuation = constantAttenuation || 0.08;
	this.linearAttenuation = linearAttenuation || 0.1;
	this.quadraticAttenuation = quadraticAttenuation ||  0.57;
	this.near = att_near || 0.01;
	this.far = att_far|| 1.5;

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
				return this.owner.transform.position;
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

	}

}
