function Camera(fov,aspect,near,far){
	//[0,10,50],[0,0,0],[0,1,0],45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.1,1000
	this.name = "camera";
					
	this.fov = fov || 45 * DEG2RAD;
	this.aspect = aspect || gl.canvas.width/gl.canvas.height; //1024/720;
	this.near = near || 0.1;
	this.far = far || 1000;
	
	this.projection = window.persp = mat4.create();
	this.view = window.view = mat4.create();
	this.mvp = window.mvp = mat4.create();

	this._needToUpdate = false;
	
	//GETTERS & SETTERS

					
	//MISC.
	Camera.prototype.lookAt = function(eye,center,up){
		if (this.owner){
			// vec3.subtract(center,[0,0,0],center);
			this.owner.transform.lookAt(eye,center,up);
			this.updateViewMatrix();
		}else{
			alert("Attach the camera to a GameObject");
		}
	}

	Camera.prototype.setPerspective = function(fov,aspect,near,far){
		this.fov = fov;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.updatePerpectiveMatrix();
	}
	Camera.prototype.updateViewMatrix = function(){
		if (this.owner){
			var eye = this.owner.transform.position;
			var up = this.owner.transform.top;
			var front = this.owner.transform.front;
			var center = vec3.create();
			vec3.subtract(center,eye,front);
			mat4.lookAt(this.view,eye,center,up);
			//this.view = this.owner.transform.model;
		}else{
			alert("Attach the camera to a GameObject");
		}
	}
	Camera.prototype.updatePerpectiveMatrix = function(){
		//set the camera perspective
		mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);	
	}
	
	Camera.prototype.update = function(dt){
			this.updateViewMatrix();
	}

	Camera.prototype.GUI = function(gui){
		var guiCamera = gui.addFolder('Camera');
		var self = this;
		guiCamera.add(this,'fov').name('Field of View').listen().onChange(function(value,self) {
		// Fires on every change, drag, keypress, etc.
		this.setPerspective(value,this.aspect,this.near,this.far);
		});

		guiCamera.add(this,'aspect').name('Aspect Ratio').listen().onChange(this.updatePerpectiveMatrix);
		guiCamera.add(this,'near').name('Near Plane').listen().onChange(this.updatePerpectiveMatrix);
		guiCamera.add(this,'far').name('Far Plane').listen().onChange(this.updatePerpectiveMatrix);
	}
	function updatePersp(camera){
		camera.setPerspective(camera.fov,camera.aspect,camera.near,camera.far);
	}
}