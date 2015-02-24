function GUI(){}	
GUI.init = function(){
		var gui = new dat.GUI();
		GUI.scene(gui,scene);
	};

	GUI.scene = function(gui,scene){
		gui.add(scene, 'deferred').name('Deferred Render').listen();
		gui.add(scene, 'renderMode',{'full':0,'albedo':1,'depth':2,'normals':3}).name('Render Mode').listen();
		this.color = [	scene.lights[0].ambient[0]*255,
						scene.lights[0].ambient[1]*255,
						scene.lights[0].ambient[2]*255,
						scene.lights[0].ambient[3]];
		gui.addColor(this, 'color').name('Ambient Scene').listen().onChange(function(value){
			scene.lights[0].ambient = [	value[0]/255,
										value[1]/255,
										value[2]/255,
										value[3]];
		});
		for (var o in scene.objects){
			GUI.gameObject(gui,scene.objects[o])
		}
	};

	GUI.gameObject = function(gui,gameObject){
		var guiObject = gui.addFolder(gameObject.name);
		guiObject.add(gameObject, 'enabled').name('Enabled').listen();

		this.color = [	gameObject.color[0]*255,
						gameObject.color[1]*255,
						gameObject.color[2]*255,
						gameObject.color[3]];
		guiObject.addColor(this, 'color').name('Color').listen().onChange(function(value){
			gameObject.color = [value[0]/255,
								value[1]/255,
								value[2]/255,
								value[3]];
		});
		// for (var c in this.components){
		// 	if (this[this.components[c]].GUI)
		// 		this[this.components[c]].GUI(guiObject);
		// }

	};

	GUI.light = function(gui,light){

	};

	GUI.transform = function(gui,transform){

	};
