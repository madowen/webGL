function GameObject(name,position,rotation,scale){
	this.name = name || "GameObject";
	this.enabled = true;
	this.color = [255,255,255,1];
	this.components = [];
	this.children = [];
	this.parent = null;


	//GETTERS & SETTERS				
	GameObject.prototype.getComponents = function(){
		return this.components || [];
	}
	GameObject.prototype.getChildren = function(){
		return this.children || [];
	}
	
	GameObject.prototype.setComponents = function(c){
		this.components = c;
	}
	GameObject.prototype.setChildren = function(c){
		this.children = c;
	}
	
	//ADDERS & REMOVERS (to arrays)
	GameObject.prototype.addComponent = function(component){
		if (this[component.name] == null){
			component.owner = this;
			this.components.push(component.name);
			this[component.name] = component;
		}else
		console.log("A "+component.name+" component already exists in the object "+this.name);
		
	}				
	GameObject.prototype.addChild = function(child){
		child.parent = this;
		this.children[child.name] = child;
	}
	GameObject.prototype.removeComponent = function (component){
		if (component.name)
			var index = this.components.indexOf(component.name);
		else
			var index = this.components.indexOf(component);
		
		if (index > -1){
			this.components.splice(index, 1);
			this[component.name] = null;
		}else{
			console.log("The "+component.name+" component does not exist in the object "+this.name);			
		}						
	}
	// EVENT
	GameObject.prototype.callMethod = function(method,params) {
		for (var i in this.components){
			if (this[this.components[i]][method])
				this[this.components[i]][method](params);
		}
	};

	// UPDATE
	GameObject.prototype.update = function(dt){
		for (var i in this.components){
			if (this[this.components[i]].update)
				this[this.components[i]].update(dt);
		}
	}
	
	GameObject.prototype.GUI = function(gui){
		var guiObject = gui.addFolder(this.name);
		guiObject.add(this, 'enabled').name('Enabled').listen();
		guiObject.addColor(this, 'color').name('Color').listen();
		for (var c in this.components){
			if (this[this.components[c]].GUI)
				this[this.components[c]].GUI(guiObject);
		}
	}

	this.addComponent(new Transform(position,rotation,scale));


}