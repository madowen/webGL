var orig_x = 0;
var orig_y = 0;
var orig_z = 0;
var separation = 1;

var r,g,b;
var obj;
var light;

function NiceScene(){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	// var ambientLight = new Light();
	// ambientLight.ambient = [0.005, 0.005, 0.005, 1];
	// ambientLight.diffuse = [0, 0, 0, 1];
	// ambientLight.specular = [0, 0, 0, 1];
	// ambientLight.owner = Scene;
	// Scene.lights.push(ambientLight);

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
	
	var objlight = new GameObject("Spot Light");
	var light = new Light(Light.SPOT);
	objlight.addComponent(light);
	light.lookAt([103,105,103],[100,101,100],[0,1,0]);
	light.far = 8;
	Scene.addLight(light);
	Scene.addObject(objlight);

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
	
	var obj = new GameObject("floor");
	obj.transform.position = [100,100,100];
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.plane({xz:true});
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.scale = [10,1,10];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("leftWall");
	obj.transform.position = [105,105,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.plane({xz:true});
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.rotateLocal(90,[0,0,1]);
	obj.transform.scale = [10,1,10];
	obj.addComponent(ren);
	Scene.addObject(obj);
				
	obj = new GameObject("rightWall");
	obj.transform.position = [95,105,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.plane({xz:true});
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.scale = [10,1,10];
	obj.transform.rotateLocal(-90,[0,0,1]);
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("frontWall");
	obj.transform.position = [100,105,105]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.plane({xz:true});
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/crate.gif");
	obj.transform.scale = [10,1,10];
	obj.transform.rotateLocal(-90,[1,0,0]);
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("dragon");
	obj.transform.position = [100,102,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.fromURL("assets/Dragon/Dargon posing2.obj");
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.rotate(135,[0,1,0]);
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("sphere");
	obj.transform.position = [97,103,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.sphere();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [0.5,0.5,0.5];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("cylinder");
	obj.transform.position = [97,100,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.cylinder();
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([102,106,91],[100,102,100],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,255.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);
}

function Sponza(){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	obj = new GameObject("Sponza");
	obj.transform.position = [0,0,0]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.fromURL("assets/sponza_obj/sponza.obj",function(mesh){
		mesh.computeNormals(gl.STATIC_DRAW);
	});
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [5,5,5];
	obj.addComponent(ren);
	Scene.addObject(obj);

	// LIGHTS //
		for (var j = 0; j < 50; j++){
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
			light.intensity = 1.0;
			light.diffuse = [r,g,b,1.0];
			light.specular = [r*0.05,g*0.05,b*0.05,1.0];
			light.near = 0.001;
			light.far = 0.3;
			obj.addComponent(light);
			Scene.addLight(light);
			Scene.addObject(obj);
		}
	}

	var obj = new GameObject("floor");
	obj.transform.position = [orig_x,orig_y,orig_z];
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.plane({xz:true});
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [n*separation,1,m*separation];
	obj.addComponent(ren);
	Scene.addObject(obj);

	var obj = new GameObject("sphere");
	obj.transform.position = [1,0,0];
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.sphere();
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [0.2,0.2,0.2];
	obj.addComponent(ren);
	Scene.addObject(obj);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([0.1,0.6,-0.9],[0,0,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,50.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);
}

function BenchmarkLightsObjects(n,m,object_mesh){
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
			obj = new GameObject("light"+i+"-"+j,[orig_x-(i-n/2)*separation-separation/2,orig_y+0.3,orig_z-(j-m/2)*separation-separation/2]);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			light.diffuse = [r,g,b,1.0];
			light.specular = [r*0.05,g*0.05,b*0.05,1.0];
			obj.addComponent(light);
			Scene.addLight(light);
			Scene.addObject(obj);

			var obj = new GameObject("floor"+i+"-"+j,[orig_x-(i-n/2)*separation-separation/2,orig_y,orig_z-(j-m/2)*separation-separation/2]);
			var ren = new ObjectRenderer();
			ren.mesh = GL.Mesh.plane({xz:true});
			ren.texture = GL.Texture.fromURL("assets/white.png");
			obj.transform.scale = [1*separation,1,1*separation];
			obj.addComponent(ren);
			Scene.addObject(obj);
		}
	}

	

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([orig_x+2,orig_y+6,orig_z-9],[orig_x,orig_y+2,orig_z],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,255.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);
}

function Temple(){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	obj = new GameObject("sphere");
	obj.transform.position = [0,5,0]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.fromURL("assets/Basic Temple/Model/Basic Temple.obj");
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.transform.scale = [5,5,5];
	obj.addComponent(ren);
	Scene.addObject(obj);

	// LIGHTS //
		for (var j = 0; j < 1; j++){
			obj = new GameObject("light"+j);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			x = generateRandomNumber(-250,250);
			y = generateRandomNumber(100,500);
			z = generateRandomNumber(-250,250);
			obj.transform.position = [x,y,z]
			light.intensity = 2.0;
			light.diffuse 	= [r,g,b,1.0];
			light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
			light.near 		= 40;
			light.far 		= 100;
			obj.addComponent(light);
			Scene.addLight(light);
			Scene.addObject(obj);
		}
			obj = new GameObject("light"+j+1);
			light = new Light(Light.POINT);
			r = 1;
			g = 0;
			b = 0;
			x = 0;
			y = 200;
			z = 0;
			obj.transform.position = [x,y,z]
			light.intensity = 2.0;
			light.diffuse 	= [r,g,b,1.0];
			light.specular 	= [r*0.05,g*0.05,b*0.05,1.0];
			light.near 		= 40;
			light.far 		= 100;
			obj.addComponent(light);
			Scene.addLight(light);
			Scene.addObject(obj);

		obj = new GameObject("light"+j+2);
		light = new Light(Light.DIRECTIONAL);
		obj.transform.lookAt([0,300,-1000],[0,0,0],[0,1,0]);
		light.diffuse 	= [0.5,0.2,0.2,1.0];
		light.specular 	= [0.5,0.2,0.2,1.0];
		obj.addComponent(light);
		Scene.addLight(light);
		Scene.addObject(obj);

	// CAMERA //
	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([0,430,700],[0,110,0],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,5000.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-10],[-10,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);
}

function generateRandomNumber(min,max) {
    return Math.random() * (max - min) + min;
};