// var Scene = new Scene();

var gl = GL.create({width:window.innerWidth,height: window.innerHeight});

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
	canvas.appendChild(gl.canvas);
	gl.animate();
	
	NiceScene();
	//Benchmark(3,3);
	//GreatHall();
	


	console.log(Scene.objects);

	//generic gl flags and settings
	gl.clearColor(0.0,0.0,0.0,1);
	// gl.enable( gl.DEPTH_TEST );
	// gl.enable( gl.CULL_FACE );

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

function printVector(v){
	for (var i = 0; i < v.length; i++){
		document.getElementById("log").innerHTML += v[i];
		if (i < v.length-1) document.getElementById("log").innerHTML += ", ";
	}
	document.getElementById("log").innerHTML += "<br>";
}

function printMatrix(m){
	for (var i = 0; i < m.length; i++){
		printVector(m[i]);
		if (i < m.length-1) document.getElementById("log").innerHTML += "<br>";
	}
	document.getElementById("log").innerHTML += "<br>";
}

function testUnproject(){
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			var model = mat4.create();
			document.getElementById("log").innerHTML += "model: ";
			printVector(model);
			document.getElementById("log").innerHTML += "<br>";

			var view = mat4.create();
			document.getElementById("log").innerHTML += "view: ";
			printVector(view);
			document.getElementById("log").innerHTML += "<br>";

			var projection = mat4.perspective(mat4.create(), 45, gl.canvas.width/gl.canvas.height, 0.1, 100);
			document.getElementById("log").innerHTML += "var projection = mat4.perspective(mat4.create(), 45, gl.canvas.width/gl.canvas.height, 0.1, 100);";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "projection: ";
			printVector(projection);
			document.getElementById("log").innerHTML += "<br>";

			var pos = [0,0,-1,1];
			document.getElementById("log").innerHTML += "pos: ";
			printVector(pos);
			document.getElementById("log").innerHTML += "<br>";

			var viewport = gl.getViewport();
			
			var modelview = 		mat4.multiply(mat4.create(),	view,		model); 
			document.getElementById("log").innerHTML += "var modelview = 		mat4.multiply(mat4.create(),	view,		model); ";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "modelview: ";
			printVector(modelview);
			document.getElementById("log").innerHTML += "<br>";

			var viewprojection = 	mat4.multiply(mat4.create(),	projection,	view);
			document.getElementById("log").innerHTML += "var viewprojection = 	mat4.multiply(mat4.create(),	projection,	view);";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "viewprojection: ";
			printVector(viewprojection);
			document.getElementById("log").innerHTML += "<br>";

			var mvp = 				mat4.multiply(mat4.create(),	projection,	modelview); 
			document.getElementById("log").innerHTML += "var mvp = 				mat4.multiply(mat4.create(),	projection,	modelview); ";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "mpv: ";
			printVector(mvp);
			document.getElementById("log").innerHTML += "<br>";

			var posScreenCoords = 	vec4.transformMat4(vec4.create(),	pos,	mvp);
			document.getElementById("log").innerHTML += "var posScreenCoords = 	vec4.transformMat4(vec4.create(),	pos,	mvp);";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "posScreenCoords: ";
			printVector(posScreenCoords);
			document.getElementById("log").innerHTML += "<br>";

			var gluUnproj = vec3.create();
			GLU.unProject(posScreenCoords[0],posScreenCoords[1],posScreenCoords[2], modelview, projection, viewport, gluUnproj);
			document.getElementById("log").innerHTML += "GLU.unProject(posScreenCoords[0],posScreenCoords[1],posScreenCoords[2], modelview, projection, viewport, gluUnproj);";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "gluUnproj: ";
			printVector(gluUnproj);
			document.getElementById("log").innerHTML += "<br>";

			var vec3unproj = vec3.create();
			vec3.unproject(vec3unproj, [posScreenCoords[0],posScreenCoords[1],posScreenCoords[2]], viewprojection, viewport);
			document.getElementById("log").innerHTML += "vec3.unproject(vec3unproj, [posScreenCoords[0],posScreenCoords[1],posScreenCoords[2]], viewprojection, viewport);";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "vecUnproj: ";
			printVector(vec3unproj);
			document.getElementById("log").innerHTML += "<br>";

			var VSPositionFromDepthUnproj = vec3.create();
			var p_inv = mat4.invert(mat4.create(),projection);
			var vp_inv = mat4.invert(mat4.create(),viewprojection);
			VSPositionFromDepthUnproj = VSPositionFromDepth(posScreenCoords[0],posScreenCoords[1],posScreenCoords[2], vp_inv);
			document.getElementById("log").innerHTML += "VSPositionFromDepthUnproj = VSPositionFromDepth([posScreenCoords[0],posScreenCoords[1],posScreenCoords[2]], p_inv);";
			document.getElementById("log").innerHTML += "<br>";
			document.getElementById("log").innerHTML += "VSPositionFromDepthUnproj: ";
			printVector(VSPositionFromDepthUnproj);
			document.getElementById("log").innerHTML += "<br>";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

function VSPositionFromDepth(in_x, in_y, in_z, p_inv){
				// Get the depth value for this pixel
				var z = in_z;
				// Get x/w and y/w from the viewport position
				var x = in_x * 2.0 - 1.0;
				var y = (1.0 - in_y) * 2.0 - 1.0;
				var vProjectedPos = vec4.create();
				vProjectedPos[0] = x;
				vProjectedPos[1] = y;
				vProjectedPos[2] = z;
				vProjectedPos[3] = 1.0;
				// Transform by the inverse projection matrix
				var vPositionVS = vec4.create();
				vec4.transformMat4(vPositionVS,vProjectedPos,p_inv);
				// Divide by w to get the view-space position
				var out = vec3.create();
				out[0] = vPositionVS[0] / vPositionVS[3];
				out[1] = vPositionVS[1] / vPositionVS[3];
				out[2] = vPositionVS[2] / vPositionVS[3];
				return out;
			}
