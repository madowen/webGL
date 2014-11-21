var Scene = {};
Scene.objects = [];
Scene.cameras = [];
Scene.lights = [];
Scene.activeCamera = 0;
Scene.ambientLight = [0.1, 0.1, 0.1, 1.0];

Scene.addObject = function(object){
	this.objects.push(object);
}
Scene.addCamera = function(camera){
	this.cameras.push(camera);
}
Scene.addLight = function(light){
	this.lights.push(light);
}
Scene.draw = function(){
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		var L = vec3.normalize(vec3.create(),[1.5,1.1,1.4]); //light vector
		var cam = this.cameras[this.activeCamera];
		//mat4.lookAt(cam.view, cam.eye, cam.center, cam.up);
		//create modelview and projection matrices
		gl.disable(gl.BLEND);
		for (var i in this.objects){
			var firstLight = true;
			if (this.objects[i].renderer){
				for (var l in this.lights){
					if(!firstLight){
						gl.enable( gl.BLEND );
						gl.blendFunc( gl.ONE, gl.ONE );
						gl.depthMask(false);
						gl.depthFunc(gl.LEQUAL);
					}else{
						gl.disable(gl.BLEND);
						gl.depthMask(true);
					}
					first = false;
					var modelt = mat4.create();
					var temp = mat4.create();

					mat4.multiply(temp,cam.view,this.objects[i].transform.model); //modelview
					mat4.multiply(cam.mvp,cam.projection,temp); //modelviewprojection

					if (this.objects[i].renderer.texture)
						this.objects[i].renderer.texture.bind(0);


					//compute rotation matrix for normals
					mat4.toRotationMat4(modelt, this.objects[i].transform.model);
				    //render mesh using the shader
				    this.objects[i].renderer.shader.uniforms({
				    	m:this.objects[i].transform.model,
				    	v:cam.view,
				    	p:cam.projection,
				    	mvp:cam.mvp,
				    	umodelt:modelt,
				    	v_inv:mat4.invert(mat4.create(),cam.view),
				    	uTexture: 0,
				    	uLPosition: this.lights[l].position,
				    	uLDirection: vec3.subtract([0,0,0],[0,0,0],this.lights[l].direction),
				    	uLType: this.lights[l].type,
				    	uLRange: this.lights[l].range,
				    	uLIntensity: this.lights[l].intensity,
				    	uLSpotAngle: this.lights[l].spotAngle,
				    	uLSpotExponent: this.lights[l].spotExponent,
				    	uLDiffuse: this.lights[l].diffuse,
				    	uLSpecular: this.lights[l].specular,
				    	uSceneAmbient: !firstLight ? Scene.ambientLight : [0,0,0,0],
				    	uOColor: this.objects[i].color
				    }).draw(this.objects[i].renderer.mesh);

					// if next object do not have texture, it won't get it from the buffer
					if (this.objects[i].renderer.texture)
						this.objects[i].renderer.texture.unbind(0);
					firstLight = false;
				}
			}
			firstLight = true;
		}
	}
	Scene.update = function(dt){
		for (var i in this.objects){					
			if (this.objects[i].update)
				this.objects[i].update(dt);
		}
	}

/*	Scene.onmousedown = function(e){
		for (var i in this.objects){
			if (this.objects[i].onmousedown)
				this.objects[i].onmousedown(e);
		}
	}
	Scene.onmouseup = function(e){
		for (var i in this.objects){					
			if (this.objects[i].onmouseup)
				this.objects[i].onmouseup(e);
		}
	}*/
	Scene.onkeydown = function(e){
		for (var i in this.objects){
			// console.log(e);
			this.objects[i].callMethod("onkeydown",{evento: e});
		}
	}
	Scene.onmousemove = function(e){
		for (var i in this.objects){
			// console.log(e);
			this.objects[i].callMethod("onmousemove",{evento: e});
		}
	}
