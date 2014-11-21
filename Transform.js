function Transform(position,rotation,scale){
	this._name = "transform";
	this._position = position || vec3.create();
	this._rotation = rotation || quat.create();
	this._scale = scale || vec3.fromValues(1,1,1);
	this._model = mat4.create();
	this._needToUpdate = false;
	
	
	//GETTERS & SETTERS
	Object.defineProperty(this, 'name',{
		get: function() {
			return this._name;
		}
	});
	Object.defineProperty(this, 'position',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return vec3.fromValues(this._model[12],this._model[13],this._model[14]);
		},
		set: function(pos) {
			this._position = pos;
			this._needToUpdate = true;
		}
	});
	Object.defineProperty(this, 'rotation',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			var m3 = mat3.create();
			mat3.fromMat4(m3,this._model);
			var q = quat.create();
			quat.fromMat3(q,m3);
			return q;
		},
		set: function(rot) {
			this._rotation = rot;
			this._needToUpdate = true;
		}
	});
	Object.defineProperty(this, 'scale',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return vec3.clone(this._scale);
		},
		set: function(sca) {
			this._scale = sca;
			this._needToUpdate = true;
		}
	});
	Object.defineProperty(this, 'model',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return mat4.clone(this._model);
		},
		set: function(mod) {
			// TODO: get the scale from the model and update it.
			this._model = mod;
			this._position = vec3.fromValues(mod[12],mod[13],mod[14]);
			var m3 = mat3.create();
			mat3.fromMat4(m3,mod);
			quat.fromMat3(this._rotation,m3);
			this._needToUpdate = true;
		}
	});
	
	Object.defineProperty(this, 'right',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return vec3.fromValues(this._model[0],this._model[1],this._model[2]);
		}
	});
	Object.defineProperty(this, 'top',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return vec3.fromValues(this._model[4],this._model[5],this._model[6]);
		}
	});
	Object.defineProperty(this, 'front',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return vec3.fromValues(this._model[8],this._model[9],this._model[10]);
		}
	});

	Transform.prototype.rotate = function(angle_in_deg, axis){
		var R = quat.setAxisAngle(quat.create(), axis, angle_in_deg * 0.0174532925);
		this._rotation = quat.multiply(quat.create(), R, this._rotation);
		this._needToUpdate = true;
	}

	Transform.prototype.rotateLocal = function(angle_in_deg, axis){
		var R = quat.setAxisAngle(quat.create(), axis, angle_in_deg * 0.0174532925 );
		this._rotation = quat.multiply(quat.create(), this._rotation, R);
		this._needToUpdate = true;
	}

	Transform.prototype.translate = function(x,y,z){
		// var tmp = mat4.create();
		// tmp[12] = x;
		// tmp[13] = y;
		// tmp[14] = z;
		// this._model = mat4.mul(this._model,this._model,tmp);
		if(arguments.length == 3)
			vec3.add( this._position, this._position, [x,y,z]);
		else
			vec3.add( this._position, this._position, x);
		this._needToUpdate = true;
	}
	Transform.prototype.translateLocal = function( x,y,z){
		// var tmp = mat4.create();
		// tmp[12] = x;
		// tmp[13] = y;
		// tmp[14] = z;
		// this._model = mat4.mul(this._model,tmp,this._model);
		if(arguments.length == 3)
			vec3.add( this._position, this._position, vec3.transformQuat(vec3.create(), [x,y,z], this._rotation ));
		else
			vec3.add( this._position, this._position, vec3.transformQuat(vec3.create(), x, this._rotation ));
		this._needToUpdate = true;
	}

	Transform.prototype.updateModel = function(){
		mat4.fromRotationTranslation( this._model , this._rotation, this._position );
		mat4.scale(this._model, this._model, this._scale);
		this._needToUpdate = false;
	}

	Transform.prototype.lookAt = function(pos,target,up){
		mat4.lookAt(this._model,pos,target,up);
		this._model = mat4.invert(this._model,this._model);
		this._position = vec3.fromValues(this._model[12],this._model[13],this._model[14]);
		var m3 = mat3.create();
		mat3.fromMat4(m3,this._model);
		quat.fromMat3(this._rotation,m3);
		this.updateModel();
	}

	// UPDATE
	// Transform.prototype.update = function(dt){
	// }

	//this.updateModel();
	
}