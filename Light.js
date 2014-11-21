function Light(type,ambient,diffuse,specular,intensity,range,spotAngle,spotExponent){
	this.name = "light";
	
	this.type = type || 0 //directional = 0|| point = 1 ||spot = 2
	this.ambient = ambient || [0.5,0.5,0.5,1.0];
	this.diffuse = diffuse || [0.9,0.9,0.9,1.0];
	this.specular = specular || [0.9,0.9,0.9,1.0];
	this.intensity = intensity || 0.8;
	this.range = range || 100.0;
	this.spotAngle = spotAngle || 30.0;
	this.spotExponent = spotExponent || 1.0;

	Object.defineProperty(this, 'direction',{
		get: function() {
			return this.owner.transform.front;
		},
	});
	Object.defineProperty(this, 'position',{
		get: function() {
			return this.owner.transform.position;
		}
	});
	
	Light.prototype.lookAt = function(eye,center,up){
		if (this.owner){
			this.owner.transform.lookAt(eye,center,up);
		}else{
			alert("Attach the light to an GameObject");
		}
	}
}