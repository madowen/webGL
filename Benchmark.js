var orig_x = 0;
var orig_y = 0;
var orig_z = 0;
var separation = 2;

var r,g,b;
var obj;
var light;

var sphere = GL.Mesh.sphere();
var plane =  GL.Mesh.plane({xz:true});
var dragon = GL.Mesh.fromURL("assets/Dragon/Dargon posing2.obj");
var sponzaNormal = GL.Mesh.fromURL("assets/sponza_obj/sponza.obj",function(mesh){
		mesh.computeNormals(gl.STATIC_DRAW);
	});
var sponza = GL.Mesh.fromURL("assets/sponza_obj/sponza.obj");
var temple = GL.Mesh.fromURL("assets/Basic Temple/Model/Basic Temple.obj");
var white =  GL.Texture.fromURL("assets/white.png");
var checker =  GL.Texture.fromURL("assets/checkerboard.png");

function NiceScene(light_swap){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	// var ambientLight = new Light();
	// ambientLight.ambient = [0.005, 0.005, 0.005, 1];
	// ambientLight.diffuse = [0, 0, 0, 1];
	// ambientLight.specular = [0, 0, 0, 1];
	// ambientLight.owner = Scene;
	// Scene.lights.push(ambientLight);

	if (light_swap == 0 || light_swap == 1 || light_swap == 4){
		var objlight = new GameObject("Point Light",[102,105,102]);
		var light = new Light(Light.POINT);
		light.diffuse = [0.8,0.1,0.3,1.0];
		light.specular = [0.9,0.05,0.15,1.0];
		light.intensity = 1.5;
		light.near = 4.5;
		light.far = 6.0;
		objlight.addComponent(light);
		Scene.addLight(light);
		Scene.addObject(objlight);
	}
	
	if (light_swap == 0 || light_swap == 2 || light_swap == 4){
		var objlight = new GameObject("Spot Light");
		var light = new Light(Light.SPOT);
		objlight.addComponent(light);
		light.lookAt([103,105,103],[100,101,100],[0,1,0]);
		light.far = 8;
		Scene.addLight(light);
		Scene.addObject(objlight);
	}

	if (light_swap == 0 || light_swap == 3 || light_swap == 4){
		var ol3 = new GameObject("Directional Light");
		var l3 = new Light();
		ol3.addComponent(l3);
		l3.lookAt([700,600,0],[70,0,-300],[0,0,1]);
		l3.type = 0;
		l3.intensity = 0.3;
		l3.diffuse = [0.8,0.8,0.8,1];
		l3.specular = [0.8,0.8,0.8,1];
		Scene.addLight(l3);
		Scene.addObject(ol3);
	}
	
	var obj = new GameObject("floor");
	obj.transform.position = [100,100,100];
	var ren = new ObjectRenderer();
	ren.mesh = plane;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.scale = [10,1,10];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("leftWall");
	obj.transform.position = [105,105,100]
	var ren = new ObjectRenderer();
	ren.mesh = plane;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.rotateLocal(90,[0,0,1]);
	obj.transform.scale = [10,1,10];
	obj.addComponent(ren);
	Scene.addObject(obj);
				
	obj = new GameObject("rightWall");
	obj.transform.position = [95,105,100]
	var ren = new ObjectRenderer();
	ren.mesh = plane;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.scale = [10,1,10];
	obj.transform.rotateLocal(-90,[0,0,1]);
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("frontWall");
	obj.transform.position = [100,105,105]
	var ren = new ObjectRenderer();
	ren.mesh = plane;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.scale = [10,1,10];
	obj.transform.rotateLocal(-90,[1,0,0]);
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("dragon");
	obj.transform.position = [100,102,100]
	var ren = new ObjectRenderer();
	ren.mesh = dragon;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = white;
	obj.transform.rotate(135,[0,1,0]);
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("sphere");
	obj.transform.position = [97,103,100]
	var ren = new ObjectRenderer();
	ren.mesh = sphere;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = white;
	obj.transform.scale = [0.5,0.5,0.5];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("cylinder");
	obj.transform.position = [97,100,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.cylinder();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = white;
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	if (light_swap == 4){
		cam.lookAt( [100.57647705,102.34823608,99.495018005], [100.15442657470703, 102.53095245361328, 99.43574523925781],[0,1,0]);
	}else
		cam.lookAt([102,106,91],[100,102,100],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,20.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	kc.speed = 5;
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	if (light_swap)
		Scene.renderMode = 2;
	else
		Scene.renderMode = 1;
}

function Sponza(N_lights,normal){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	obj = new GameObject("Sponza");
	obj.transform.position = [0,0,0]
	var ren = new ObjectRenderer();
	// ren.mesh = GL.Mesh.fromURL("assets/sponza_obj/sponza.obj",function(mesh){
	// 	mesh.computeNormals(gl.STATIC_DRAW);
	// });
	if (normal)
		ren.mesh = sponzaNormal;
	else
		ren.mesh = sponza;
	ren.texture = white;
	obj.transform.scale = [5,5,5];
	obj.addComponent(ren);
	Scene.addObject(obj);

	// LIGHTS //
		for (var j = 0; j < N_lights; j++){
			obj = new GameObject("light"+j);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			x = generateRandomNumber(-100,100);
			y = generateRandomNumber(-10,100);
			z = generateRandomNumber(-40,40);
			obj.transform.position = [x,y,z]
			light.diffuse 	= [r,g,b,1.0];
			light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
			light.near 		= 10;
			light.far 		= 30;
			obj.addComponent(light);
			Scene.addLight(light);
			Scene.addObject(obj);
		}

		obj = new GameObject("light"+j);
		light = new Light(Light.DIRECTIONAL);
		obj.transform.lookAt([0,300,-1000],[0,0,0],[0,1,0]);
		light.diffuse 	= [0.1,0.1,0.1,1.0];
		light.specular 	= [0.1,0.1,0.1,1.0];
		obj.addComponent(light);
		Scene.addLight(light);
		Scene.addObject(obj);

	// CAMERA //
	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([-50,50,0],[0,30,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,5000.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-10],[-10,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	Scene.renderMode = 1;

}

function BenchmarkLights(n,m,object_mesh){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	// var ambientLight = new Light();
	// ambientLight.ambient = [0.1, 0.1, 0.1, 1];
	// ambientLight.diffuse = [0, 0, 0, 1];
	// ambientLight.specular = [0, 0, 0, 1];
	// ambientLight.owner = Scene;
	// Scene.lights.push(ambientLight);

	for (var i = 0; i < n; i++){
		for (var j = 0; j < m; j++){
			obj = new GameObject("light"+i+"-"+j,[orig_x-(i-n/2)*separation-separation/2,orig_y+0.1,orig_z-(j-m/2)*separation-separation/2]);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			movex = generateRandomNumber(-1,1);
			movez = generateRandomNumber(-1,1);
			light.intensity = 1.0;
			light.diffuse = [r,g,b,1.0];
			light.specular = [r*0.05,g*0.05,b*0.05,1.0];
			light.near = 0.1;
			light.far = 0.6;
			obj.addComponent(light);
			var rm = new RandomMovement([movex,0,movez]);
			obj.addComponent(rm);
			Scene.addLight(light);
			Scene.addObject(obj);
		}
	}

	var obj = new GameObject("floor");
	obj.transform.position = [orig_x,orig_y,orig_z];
	var ren = new ObjectRenderer();
	ren.mesh = plane;
	ren.texture = white;
	obj.transform.scale = [n*separation,1,m*separation];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([0,10,-15],[0,0,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,50.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	Scene.renderMode = 1;
}

function BenchmarkLightsObjects(n,m,object_mesh){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	for (var i = 0; i < n; i++){
		for (var j = 0; j < m; j++){
			obj = new GameObject("light"+i+"-"+j,[orig_x-(i-n/2)*separation-separation,orig_y,orig_z-(j-m/2)*separation-separation]);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			light.diffuse = [r,g,b,1.0];
			light.specular = [r*0.05,g*0.05,b*0.05,1.0];
			obj.addComponent(light);
			movex = generateRandomNumber(-1,1);
			movez = generateRandomNumber(-1,1);
			var rm = new RandomMovement([movex,0,movez]);
			obj.addComponent(rm);
			Scene.addLight(light);
			Scene.addObject(obj);

			var obj = new GameObject("floor"+i+"-"+j,[orig_x-(i-n/2)*separation-separation,orig_y-1,orig_z-(j-m/2)*separation-separation]);
			var ren = new ObjectRenderer();
			ren.mesh = sphere;
			ren.texture = white;
			obj.transform.scale = [1,1,1];
			obj.addComponent(ren);
			Scene.addObject(obj);
		}
	}

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([orig_x,orig_y+10,orig_z-15],[orig_x,orig_y,orig_z],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,255.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	Scene.renderMode = 1;
}

function Temple(N_lights){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	obj = new GameObject("sphere");
	obj.transform.position = [0,5,0]
	var ren = new ObjectRenderer();
	ren.mesh = temple;
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = white;
	obj.transform.scale = [5,5,5];
	obj.addComponent(ren);
	Scene.addObject(obj);

	// LIGHTS //
		for (var j = 0; j < N_lights; j++){
			obj = new GameObject("light"+j);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			x = generateRandomNumber(-200,200);
			y = generateRandomNumber(70,400);
			z = generateRandomNumber(-200,200);
			movex = generateRandomNumber(-100,100);
			movey = generateRandomNumber(-100,100);
			movez = generateRandomNumber(-100,100);
			obj.transform.position = [x,y,z]
			light.intensity = 2.0;
			light.diffuse 	= [r,g,b,1.0];
			light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
			light.near 		= 40;
			light.far 		= 100;
			obj.addComponent(light);
			var rm = new RandomMovement(movex,movey,movez);
			obj.addComponent(rm);
			Scene.addLight(light);
			Scene.addObject(obj);
		}

		obj = new GameObject("light"+j+2);
		light = new Light(Light.DIRECTIONAL);
		obj.transform.lookAt([0,300,-1000],[0,0,0],[0,1,0]);
		light.diffuse 	= [0.5,0.2,0.2,1.0];
		light.specular 	= [0.5,0.2,0.2,1.0];
		obj.addComponent(light);
		Scene.addLight(light);
		Scene.addObject(obj);

	var obj = new GameObject("floor");
	obj.transform.position = [orig_x,orig_y,orig_z];
	obj.color = [0.2,0.8,0.2,1.0];
	var ren = new ObjectRenderer();
	ren.mesh = plane;
	ren.texture = white;
	obj.transform.scale = [3000,1,3000];
	obj.addComponent(ren);
	Scene.addObject(obj);

	// CAMERA //
	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([0,500,1000],[0,110,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,5000.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-10],[-10,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	Scene.renderMode = 1;
}

function Checker(n,m,object_mesh){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	for (var i = 0; i < n; i++){
		for (var j = 0; j < m; j++){
			var obj = new GameObject("floor"+i+"-"+j,[orig_x-(i-n/2)*separation-separation,orig_y-1,orig_z-(j-m/2)*separation-separation]);
			var ren = new ObjectRenderer();
			ren.mesh = plane;
			ren.texture = checker;
			obj.transform.scale = [2,1,2];
			obj.addComponent(ren);
			Scene.addObject(obj);
		}
	}
		obj = new GameObject("light"+j+2);
		light = new Light(Light.DIRECTIONAL);
		obj.transform.lookAt([0,300,-1000],[0,0,0],[0,1,0]);
		light.diffuse 	= [1,1,1,1.0];
		light.specular 	= [1,1,1,1.0];
		obj.addComponent(light);
		Scene.addLight(light);
		Scene.addObject(obj);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([0,10,-100],[0,0,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,255.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	Scene.renderMode = 1;
}

function Dragons(){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	var obj = new GameObject("sphere",[0,0,0]);
	var ren = new ObjectRenderer();
	ren.mesh = sphere;
	ren.texture = white;
	obj.transform.scale = [0.1,0.1,0.1];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("light");
	light = new Light(Light.POINT);
	r = generateRandomNumber(0,1);
	g = generateRandomNumber(0,1);
	b = generateRandomNumber(0,1);
	obj.transform.position = [0,3,0]
	light.intensity = 2.0;
	light.diffuse 	= [r,g,b,1.0];
	light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
	light.near 		= 1;
	light.far 		= 4;
	obj.addComponent(light);
	Scene.addLight(light);
	Scene.addObject(obj);

	obj = new GameObject("light");
	light = new Light(Light.POINT);
	r = generateRandomNumber(0,1);
	g = generateRandomNumber(0,1);
	b = generateRandomNumber(0,1);
	obj.transform.position = [2,0,2]
	light.intensity = 3.0;
	light.diffuse 	= [r,g,b,1.0];
	light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
	light.near 		= 1;
	light.far 		= 3;
	obj.addComponent(light);
	Scene.addLight(light);
	Scene.addObject(obj);

	obj = new GameObject("light");
	light = new Light(Light.POINT);
	r = generateRandomNumber(0,1);
	g = generateRandomNumber(0,1);
	b = generateRandomNumber(0,1);
	obj.transform.position = [2,0,-2]
	light.intensity = 3.0;
	light.diffuse 	= [r,g,b,1.0];
	light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
	light.near 		= 1;
	light.far 		= 3;
	obj.addComponent(light);
	Scene.addLight(light);
	Scene.addObject(obj);

	obj = new GameObject("light");
	light = new Light(Light.POINT);
	r = generateRandomNumber(0,1);
	g = generateRandomNumber(0,1);
	b = generateRandomNumber(0,1);
	obj.transform.position = [-2,0,2]
	light.intensity = 3.0;
	light.diffuse 	= [r,g,b,1.0];
	light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
	light.near 		= 1;
	light.far 		= 3;
	obj.addComponent(light);
	Scene.addLight(light);
	Scene.addObject(obj);

	obj = new GameObject("light");
	light = new Light(Light.POINT);
	r = generateRandomNumber(0,1);
	g = generateRandomNumber(0,1);
	b = generateRandomNumber(0,1);
	obj.transform.position = [-2,0,-2]
	light.intensity = 3.0;
	light.diffuse 	= [r,g,b,1.0];
	light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
	light.near 		= 1;
	light.far 		= 3;
	obj.addComponent(light);
	Scene.addLight(light);
	Scene.addObject(obj);


	var obj = new GameObject("dragon1");
	obj.transform.lookAt([2,0,0],[0,0,0],[0,1,0]);
	var ren = new ObjectRenderer();
	ren.mesh = dragon;
	ren.texture = white;
	obj.transform.scale = [1,1,1];
	obj.addComponent(ren);
	Scene.addObject(obj);

	var obj = new GameObject("dragon1");
	obj.transform.lookAt([-2,0,0],[0,0,0],[0,1,0]);
	var ren = new ObjectRenderer();
	ren.mesh = dragon;
	ren.texture = white;
	obj.transform.scale = [1,1,1];
	obj.addComponent(ren);
	Scene.addObject(obj);

	var obj = new GameObject("dragon1");
	obj.transform.lookAt([0,0,2],[0,0,0],[0,1,0]);
	var ren = new ObjectRenderer();
	ren.mesh = dragon;
	ren.texture = white;
	obj.transform.scale = [1,1,1];
	obj.addComponent(ren);
	Scene.addObject(obj);

	var obj = new GameObject("dragon1");
	obj.transform.lookAt([0,0,-2],[0,0,0],[0,1,0]);
	var ren = new ObjectRenderer();
	ren.mesh = dragon;
	ren.texture = white;
	obj.transform.scale = [1,1,1];
	obj.addComponent(ren);
	Scene.addObject(obj);

		obj = new GameObject("light");
		light = new Light(Light.DIRECTIONAL);
		obj.transform.lookAt([-500,300,-100],[0,0,0],[0,1,0]);
		light.diffuse 	= [0.1,0.1,0.1,1.0];
		light.specular 	= [0.1,0.1,0.1,1.0];
		obj.addComponent(light);
		// Scene.addLight(light);
		// Scene.addObject(obj);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([0,10,-10],[0,0,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,255.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	kc.speed = 5;
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

	Scene.renderMode = 1;
}


