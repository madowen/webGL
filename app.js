// var Scene = new Scene();

var gl = GL.create({width:window.innerWidth,height: window.innerHeight});

function KeyController(front,right){
	this.name = "keycontroller"
	this.front = front 	|| [0,0,1];
	this.right = right 	|| [1,0,0];
	this.speed = 50;
	//KeyController.prototype.onkeydown = function(){}
	KeyController.prototype.update = function(dt){
		var f = this.owner.transform.front; //front
		var r = this.owner.transform.right; //right
		var sf = vec3.create();
		var sr = vec3.create();
		vec3.scale(sf,f,this.speed*dt);
		vec3.scale(sr,r,this.speed*dt);
		var sfn = vec3.create();
		var srn = vec3.create();
		vec3.negate(sfn,sf);
		vec3.negate(srn,sr);

		if (gl.keys[87])  //W
			this.owner.transform.translate(sfn);
		if (gl.keys[83])  //S
			this.owner.transform.translate(sf);
		if (gl.keys[65])  //A
			this.owner.transform.translate(srn);
		if (gl.keys[68])  //D
			this.owner.transform.translate(sr);
		
	}
}

function MouseController(horizontalMouseMoveToRotateVector,verticalMouseMoveToRotateVector){
	this.name = "mousecontroller"
	this.click_time = 0;
	this.h = horizontalMouseMoveToRotateVector 	|| [0,1,0];
	this.v = verticalMouseMoveToRotateVector 	|| [1,0,0];
	this.dx = 0;
	this.dy = 0;
	this.speed = 5;

	MouseController.prototype.onmousemove = function(e){
		var evento = e['evento'];
		if(evento.dragging){
			this.dx = evento.deltax;
			this.dy = evento.deltay;
		}
	}

	MouseController.prototype.update = function(dt){
		if (this.dx)
			this.owner.transform.rotateLocal(this.dx*dt*this.speed,this.h);
		if (this.dy)
			this.owner.transform.rotate(this.dy*dt*this.speed,this.v);
		this.dx = 0;
		this.dy = 0;

	}
}

function init(){
	MicroShaderManager.loadXML();
	//create the rendering context
	var canvas = document.getElementById("content");
	canvas.appendChild(gl.canvas);
	gl.animate();
	
	//NiceScene();
	//BenchmarkLights(2,2);
	//Sponza();
	Temple();

	console.log(Scene.objects);

	gl.clearColor(0.0,0.0,0.0,1);

	//rendering loop
	gl.ondraw = function(){
		console.timeEnd('Render To Render');
		Renderer.draw(Scene.renderMode,Scene.channel,Scene.objects,Scene.lights,Scene.cameras[Scene.activeCamera]);
		console.time('Render To Render');
	};

	//update loop
	gl.onupdate = function(dt){
		Scene.update(dt);
	};

	gl.captureMouse();
	gl.captureKeys(true);

	//controllers
	gl.onkeydown 	= function(e){
		Scene.onkeydown(e);
	};
	gl.onmousemove 	= function(e){
		Scene.onmousemove(e);
	};

	 GUI.init();

}

function resize(){
	alert("resize");
}
