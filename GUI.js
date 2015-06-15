function GUI(){
}	
	GUI.colors = [];
	var i = 0;
	GUI.init = function(){
		var gui = new dat.GUI();
		GUI.scene(gui,Scene);
	};

	var addColor = function(gui,color,name){
		GUI.colors[i] = vec4.scale(vec4.create(),color,255);
		GUI.colors[i] = [GUI.colors[i][0],GUI.colors[i][1],GUI.colors[i][2],color[3]];
		gui.addColor(GUI.colors, [i]).name(name).listen().onChange(function(value){
			var alpha = value[3];
			vec4.scale(color,value,1/255);
			color[3] = alpha;
		});
		i++;
	}

	GUI.scene = function(gui,scene){
		gui.add(scene, 'renderMode',{'Forward':0,'Deferred':1,'G-Buffer':2}).name('Render Type').listen();
		this.NiceScene = function() {NiceScene();}
		this.Sponza = function() {Sponza(50);}
		this.SponzaNormal = function() {Sponza(50,true);}
		this.Temple = function() {Temple(50);}
		this.Checker = function() {Checker(100,100);}
		this.Dragons = function() {Dragons();}

		this.B1x1Lights = function() {BenchmarkLights(1,1);}
		this.B2x2Lights = function() {BenchmarkLights(2,2);}
		this.B5x5Lights = function() {BenchmarkLights(5,5);}
		this.B10x10Lights = function() {BenchmarkLights(10,10);}
		this.B15x15Lights = function() {BenchmarkLights(15,15);}
		
		this.B1x1Objects = function() {BenchmarkLightsObjects(1,1);}
		this.B2x2Objects = function() {BenchmarkLightsObjects(2,2);}
		this.B5x5Objects = function() {BenchmarkLightsObjects(5,5);}
		this.B10x10Objects = function() {BenchmarkLightsObjects(10,10);}
		this.B15x15Objects = function() {BenchmarkLightsObjects(15,15);}

		gui.add(this,'NiceScene');
		gui.add(this,'Sponza');
		gui.add(this,'SponzaNormal');
		gui.add(this,'Temple');
		gui.add(this,'Checker');
		gui.add(this,'Dragons');

		gui.add(this,'B1x1Lights').name('1 Light');
		gui.add(this,'B2x2Lights').name('4 Lights');
		gui.add(this,'B5x5Lights').name('25 Lights');
		gui.add(this,'B10x10Lights').name('100 Lights');
		gui.add(this,'B15x15Lights').name('225 Lights');

		gui.add(this,'B1x1Objects').name('1 Object + 1 Light');
		gui.add(this,'B2x2Objects').name('4 Objects + 4 Lights');
		gui.add(this,'B5x5Objects').name('25 Objects + 25 Lights');
		gui.add(this,'B10x10Objects').name('100 Objects + 100 Lights');
		gui.add(this,'B15x15Objects').name('225 Objects + 225 Lights');
	};

	GUI.gameObject = function(gui,gameObject){
		var guiObject = gui.addFolder(gameObject.name);
		guiObject.add(gameObject, 'enabled').name('Enabled').listen();

		if (gameObject.renderer)
			addColor(guiObject,gameObject.color,'Color');

		for (var c in gameObject.components){
			if (gameObject.components[c] == 'transform') GUI.transform(guiObject,gameObject[gameObject.components[c]]);
			if (gameObject.components[c] == 'light') GUI.light(guiObject,gameObject[gameObject.components[c]]);
		}

	};

	GUI.light = function(gui,light){
		var guiLight = gui.addFolder(name == 'parent' ? this.owner.name : 'Light');
		guiLight.add(light,'enabled').name('Enabled').listen();
		guiLight.add(light,'type',{'Ambient':-1,'Directional':0,'Point':1,'Spot':2}).name('Type').listen();

		guiLight.add(light,'intensity').name('Intensity').step(0.01).min(0);
		// guiLight.add(light,'range').name('Range').min(0);
		guiLight.add(light,'spotAngle').name('Spot Angle').min(0);
		guiLight.add(light,'spotExponent').name('Spot Exponent');
		guiLight.add(light,'near').name('Near');
		guiLight.add(light,'far').name('Far');
		// guiLight.add(light,'constantAttenuation',0,1).name('Constant Attenuation').step(0.001);
		// guiLight.add(light,'linearAttenuation',0,1).name('Linear Attenuation').step(0.001);
		// guiLight.add(light,'quadraticAttenuation',0,1).name('Quadratic Attenuation').step(0.001);
	
		var guiLightColor = guiLight.addFolder('Color');
		{
			addColor(guiLightColor,light.specular,'Specular');
			addColor(guiLightColor,light.diffuse,'Diffuse');
		}
	};

	GUI.transform = function(gui,transform){
		var guiTransform = gui.addFolder('Transform');
		var guiTransformPos = guiTransform.addFolder('Position');
		{
			guiTransformPos.add(transform._position,[0]).name('x').step(0.1).listen();
			guiTransformPos.add(transform._position,[1]).name('y').step(0.1).listen();
			guiTransformPos.add(transform._position,[2]).name('z').step(0.1).listen();
		}
		var rot = quat.toEuler(vec3.create(),transform._rotation);
		rot = vec3.scale(rot,rot,180/Math.PI);
		var guiTransformPos = guiTransform.addFolder('Rotation');
		{
			guiTransformPos.add(rot,[0]).name('x').step(1).listen().onChange(function(value){
				var inrot = quat.toEuler(vec3.create(),transform._rotation);
				inrot[0] = value;
				inrot = vec3.scale(inrot,inrot,Math.PI/180);
				transform._rotation = quat.fromEuler(transform._rotation,inrot);
				transform._needToUpdate = true;
			});
			guiTransformPos.add(rot,[1]).name('y').step(1).listen().onChange(function(value){
				var inrot = quat.toEuler(vec3.create(),transform._rotation);
				inrot[1] = value;
				inrot = vec3.scale(inrot,inrot,Math.PI/180);
				transform._rotation = quat.fromEuler(transform._rotation,inrot);
			});
			guiTransformPos.add(rot,[2]).name('z').step(1).listen().onChange(function(value){
				var inrot = quat.toEuler(vec3.create(),transform._rotation);
				inrot[2] = value;
				inrot = vec3.scale(inrot,inrot,Math.PI/180);
				transform._rotation = quat.fromEuler(transform._rotation,inrot);
			});
		}		


		var guiTransformPos = guiTransform.addFolder('Scale');
		{
			guiTransformPos.add(transform._scale,[0]).name('x').listen();
			guiTransformPos.add(transform._scale,[1]).name('y').listen();
			guiTransformPos.add(transform._scale,[2]).name('z').listen();
		}
	};
