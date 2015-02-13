function Transform(position,rotation,scale){
	this._name = "transform";
	this._position = position || vec3.create();
	this._rotation = rotation || quat.create();
	this._scale = scale || vec3.fromValues(1,1,1);
	this._model = mat4.create();
	this._globalModel = mat4.create();
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
	Object.defineProperty(this, 'globalPosition',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			return vec3.fromValues(this._globalModel[12],this._globalModel[13],this._globalModel[14]);
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
	Object.defineProperty(this, 'globalRotation',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			var m3 = mat3.create();
			mat3.fromMat4(m3,this._globalModel);
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
			//position
			this._position = vec3.fromValues(mod[12],mod[13],mod[14]);
			//rotation
			var m3 = mat3.create();
			mat3.fromMat4(m3,mod);
			quat.fromMat3(this._rotation,m3);
			//scale
			var tmp = vec3.create();
			this._scale[0] = vec3.length( mat4.rotateVec3(tmp,mod,[1,0,0]) );
			this._scale[1] = vec3.length( mat4.rotateVec3(tmp,mod,[0,1,0]) );
			this._scale[2] = vec3.length( mat4.rotateVec3(tmp,mod,[0,0,1]) );

			this._needToUpdate = true;
		}
	});

	Object.defineProperty(this, 'globalModel',{
		get: function(){
			if (this._needToUpdate) this.updateModel();
			if (this.owner.parent)
				mat4.multiply(this._globalModel, this.owner.parent.transform.globalModel,this._model);
			else
				this._globalModel = this._model
			return this._globalModel;
		}
	});

	Object.defineProperty(this, 'right',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			// return vec3.fromValues(this._model[0],this._model[1],this._model[2]);
			return vec3.transformQuat(vec3.create(), vec3.fromValues(1,0,0), this.rotation);
		}
	});
	Object.defineProperty(this, 'top',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			// return vec3.fromValues(this._model[4],this._model[5],this._model[6]);
			return vec3.transformQuat(vec3.create(), vec3.fromValues(0,1,0), this.rotation);
		}
	});
	Object.defineProperty(this, 'front',{
		get: function() {
			if (this._needToUpdate) this.updateModel();
			// return vec3.fromValues(this._model[8],this._model[9],this._model[10]);
			return vec3.transformQuat(vec3.create(), vec3.fromValues(0,0,1), this.rotation);
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
		if(arguments.length == 3)
			vec3.add( this._position, this._position, [x,y,z]);
		else
			vec3.add( this._position, this._position, x);
		this._needToUpdate = true;
	}
	Transform.prototype.translateLocal = function(x,y,z){
		if(arguments.length == 3)
			vec3.add( this._position, this._position, vec3.transformQuat(vec3.create(), [x,y,z], this._rotation ));
		else
			vec3.add( this._position, this._position, vec3.transformQuat(vec3.create(), x, this._rotation ));
		this._needToUpdate = true;
	}

	Transform.prototype.updateModel = function(){
		this._needToUpdate = false;
		mat4.fromRotationTranslation( this._model , this._rotation, this._position );
		mat4.scale(this._model, this._model, this._scale);
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
	Transform.prototype.update = function(dt){
		this.updateModel();
	}

	//this.updateModel();
	
}