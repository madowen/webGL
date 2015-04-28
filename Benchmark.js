var orig_x = 100;
var orig_y = 100;
var orig_z = 100;
var separation = 5;

var r,g,b;
var obj;
var light;

function NiceScene(){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	var ambientLight = new Light();
	ambientLight.ambient = [0.005, 0.005, 0.005, 1];
	ambientLight.diffuse = [0, 0, 0, 1];
	ambientLight.specular = [0, 0, 0, 1];
	ambientLight.owner = Scene;
	Scene.lights.push(ambientLight);

	var objlight = new GameObject("Point Light",[104,101,104]);
	var light = new Light(Light.POINT);
	light.diffuse = [0.8,0.1,0.3,1.0];
	light.specular = [0.9,0.05,0.15,1.0];
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
	obj.transform.rotate(135,[0,1,0]);
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

function GreatHall(){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	var ambientLight = new Light();
	ambientLight.ambient = [0.1, 0.1, 0.1, 1];
	ambientLight.diffuse = [0, 0, 0, 1];
	ambientLight.specular = [0, 0, 0, 1];
	ambientLight.owner = Scene;
	Scene.lights.push(ambientLight);

	obj = new GameObject("GreatHall");
	obj.transform.position = [100,100,100]
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.fromURL("assets/Great Hall/Great Hall Model.obj");
	// ren.shader = GL.Shader.fromURL("light.vert","light.frag");;
	ren.texture = GL.Texture.fromURL("assets/white.png");
	obj.addComponent(ren);
	Scene.addObject(obj);

	var ol3 = new GameObject("Directional Light");
	var l3 = new Light();
	ol3.addComponent(l3);
	l3.lookAt([700,600,0],[70,0,-300],[0,0,1]);
	l3.type = 0;
	l3.intensity = 1.0;
	l3.diffuse = [0.8,0.8,0.8,1];
	l3.specular = [0.8,0.8,0.8,1];
	Scene.addLight(l3);
	Scene.addObject(ol3);

	var ol3 = new GameObject("Point Light");
	var l3 = new Light();
	ol3.addComponent(l3);
	ol3.transform.position = [100,91.3,49];
	l3.type = 1;
	l3.intensity = 3.5;
	l3.diffuse = [0.8,0.3,0.3,1];
	l3.specular = [0.8,0.3,0.3,1];
	l3.far = 65
	Scene.addLight(l3);
	Scene.addObject(ol3);

	obj = new GameObject("camera");
	var cam = new Camera();
	obj.addComponent(cam);
	cam.lookAt([102,106,91],[100,91.3,49],[0,1,0]);
	cam.setPerspective(45 * DEG2RAD,gl.canvas.width/gl.canvas.height,0.01,255.0);
	Scene.addCamera(cam);
	var kc = new KeyController([0,0,-1],[-1,0,0]);
	obj.addComponent(kc);
	var mc = new MouseController([0,-1,0],[-1,0,0]);
	obj.addComponent(mc);
	Scene.addObject(obj);

}

function Benchmark(n,m,object_mesh){
	Scene.objects.splice(0,Scene.objects.length);
	Scene.lights.splice(0,Scene.lights.length);
	Scene.cameras.splice(0,Scene.cameras.length);

	var ambientLight = new Light();
	ambientLight.ambient = [0.1, 0.1, 0.1, 1];
	ambientLight.diffuse = [0, 0, 0, 1];
	ambientLight.specular = [0, 0, 0, 1];
	ambientLight.owner = Scene;
	Scene.lights.push(ambientLight);

	for (var i = 0; i < n; i++){
		for (var j = 0; j < m; j++){
			obj = new GameObject("obj"+i+"-"+j,[orig_x-(i-n/2)*separation-separation/2,orig_y+0.3,orig_z-(j-m/2)*separation-separation/2]);
			light = new Light(Light.POINT);
			r = generateRandomNumber(0,1);
			g = generateRandomNumber(0,1);
			b = generateRandomNumber(0,1);
			light.diffuse = [r,g,b,1.0];
			light.specular = [r*0.05,g*0.05,b*0.05,1.0];
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

function generateRandomNumber(min,max) {
    return Math.random() * (max - min) + min;
};