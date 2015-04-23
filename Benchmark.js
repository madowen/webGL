var orig_x = 100;
var orig_y = 100;
var orig_z = 100;
var separation = 5;

var r,g,b;
var obj;
var light;

function NiceScene(Scene){
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
	obj.transform.scale = [1,1,1];
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
	obj.transform.scale = [1,1,1];
	obj.transform.rotate(135,[0,1,0]);
	obj.addComponent(ren);
	Scene.addObject(obj);
}

function Benchmark(Scene,n,m,object_mesh){
	// for (var i = 0; i < n_objecs; i++){
	// 	for (var j = 0; j < m_objecs; j++){
	// 		obj = new GameObject("obj"+i,[orig_x+(i-n_objecs/2)*3,orig_y,orig_z+(i-n_objecs/2)*3]);
	// 	}
	// }

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


}

function generateRandomNumber(min,max) {
    return Math.random() * (max - min) + min;
};