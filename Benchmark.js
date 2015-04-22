var orig_x = 100;
var orig_y = 100;
var orig_z = 100;
var separation = 5;

var r,g,b;
var obj;
var light;

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
			light.specular = [r,g,b,1.0];
			obj.addComponent(light);
			Scene.addLight(light);
			Scene.addObject(obj);
		}
	}

	var obj = new GameObject("floor");
	obj.transform.position = [orig_x,orig_y,orig_z];
	var ren = new ObjectRenderer();
	ren.mesh = GL.Mesh.plane({xz:true});
	obj.transform.scale = [n*separation,1,m*separation];
	obj.addComponent(ren);
	Scene.addObject(obj);


}

function generateRandomNumber(min,max) {
    return Math.random() * (max - min) + min;
};