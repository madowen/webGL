var scene = new Scene();
// THIS SHOULD BE PROGRAMMED 
function KeyController(front,right){
	this.name = "keycontroller"
	this.front = front 	|| [0,0,1];
	this.right = right 	|| [1,0,0];
	this.speed = 5;
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
	var gl = GL.create({width:window.innerWidth,height: window.innerHeight});
	canvas.appendChild(gl.canvas);
	gl.animate();
	
	var obj = new GameObject("floor");
	obj.transform.position = [100,100,100]
	var ren = new Renderer();
	ren.mesh = GL.Mesh.cube();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [10,0.01,10];
	obj.addComponent(ren);
	scene.addObject(obj);

	obj = new GameObject("leftWall");
	obj.transform.position = [105,105,100]
	var ren = new Renderer();
	ren.mesh = GL.Mesh.cube();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [0.01,10,10];
	obj.addComponent(ren);
	scene.addObject(obj);
				
	obj = new GameObject("rightWall");
	obj.transform.position = [95,105,100]
	var ren = new Renderer();
	ren.mesh = GL.Mesh.cube();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [0.01,10,10];
	obj.addComponent(ren);
	scene.addObject(obj);

	obj = new GameObject("frontWall");
	obj.transform.position = [100,105,105]
	var ren = new Renderer();
	ren.mesh = GL.Mesh.cube();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [10,10,0.01];
	obj.addComponent(ren);
	scene.addObject(obj);

	obj = new GameObject("sphere");
	obj.transform.position = [100,101,100]
	var ren = new Renderer();
	ren.mesh = GL.Mesh.sphere();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [1,1,1];
	obj.addComponent(ren);
	scene.addObject(obj);
	
	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([102,106,91],[100,102,100],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,1,10000);
	scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	scene.addObject(obj);

	var objlight = new GameObject("light1",[100,105,100]);
	var light = new Light(1);
	objlight.addComponent(light);
	scene.addLight(light);
	scene.addObject(objlight);
	
	var objlight = new GameObject("light2");
	var light = new Light(2);
	objlight.addComponent(light);
	light.lookAt([103,105,103],[100,101,100],[0,1,0]);
	scene.addLight(light);
	scene.addObject(objlight);

	var ol3 = new GameObject("globalLight");
	var l3 = new Light();
	ol3.addComponent(l3);
	l3.lookAt([700,600,0],[70,0,-300],[0,0,1]);
	l3.type = 0;
	l3.intensity = 0.7;
	l3.diffuse = [0.05,0.1,0.9,1];
	l3.specular = [0.5,0.1,0.9,1];
	scene.addLight(l3);
	scene.addObject(ol3);

	console.log(scene.objects);

	//generic gl flags and settings
	gl.clearColor(0.2,0.2,0.2,1);
	gl.enable( gl.DEPTH_TEST );
	gl.enable( gl.CULL_FACE );

	//rendering loop
	gl.ondraw = function(){
		scene.draw();
	};

	//update loop
	gl.onupdate = function(dt){
		scene.update(dt);
	};

	gl.captureMouse();
	gl.captureKeys(true);

	//controllers
	gl.onkeydown 	= function(e){
		scene.onkeydown(e);
	};
	gl.onmousemove 	= function(e){
		scene.onmousemove(e);
	};

	GUI.init();

}

function resize(){
	alert("resize");
}