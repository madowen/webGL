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

function RandomMovement(sizex,sizey,sizez){
	if(arguments.length == 3){
		this.sizex = sizex;
		this.sizey = sizey;
		this.sizez = sizez;
	}else{
		this.sizex = sizex[0];
		this.sizey = sizex[1];
		this.sizez = sizex[2];
	}
	this.rx = 1;//generateRandomNumber(-1,1);
	this.ry = 1;//generateRandomNumber(-1,1);
	this.rz = 1;//generateRandomNumber(-1,1);
	RandomMovement.prototype.update = function(dt){
		var time = getTime()*0.001;
		this.owner.transform.translate(Math.sin(time*this.rx)*this.sizex*dt,Math.cos(time*this.ry)*this.sizey*dt,Math.cos(time*this.rz)*this.sizez*dt);
	}
}

function generateRandomNumber(min,max) {
    return Math.random() * (max - min) + min;
};

function init(){
	MicroShaderManager.loadXML();
	//create the rendering context
	var canvas = document.getElementById("content");
	canvas.appendChild(gl.canvas);
	gl.animate();
	
	//NiceScene();
	//BenchmarkLights(1,1);
	// Sponza(10);
	// Temple(50);
	// Checker(100,100);
	//Dragons();
	BenchmarkLightsObjects(15,15);
	
	console.log(Scene.objects);

	gl.clearColor(0.0,0.0,0.0,1);

	//rendering loop
	gl.ondraw = function(){
		Renderer.draw(Scene.renderMode,Scene.channel,Scene.objects,Scene.lights,Scene.cameras[Scene.activeCamera]);
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
