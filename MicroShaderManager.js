var MicroShaderManager = {
	microShaders: null,
	shaders: [],
	xmlFile: 'microShaders.xml',
	micros: null,
	vertexSource: null,
	fragmentSource: null,

	getShader: function(name,vertex,fragment,fromXMLFile){
		if (this.microShaders == null){
			this.microShaders = [];
			this.loadXML(this.xmlFile, function(){
				MicroShaderManager.getShader(name,vertex,fragment,fromXMLFile);
			});
		}else{
			if (this.shaders[name] == null){
				this.vertexSource = this.composeShader(vertex);
				this.fragmentSource = this.composeShader(fragment);
				if(!this.vertexSource || !this.fragmentSource)
					return null;


				var shader = new GL.Shader(this.vertexSource,this.fragmentSource);
				this.shaders[name] = shader;
				shader.ps_code = this.fragmentSource;
				return shader;
			}else{
				return this.shaders[name];
			}
		}
	},


	// compose a fragment or vertex shader giving the micros with are made off
	composeShader: function(micros){
		var shaderHeader = "precision highp float;";
		var shaderCode = "void main(){";
		for (var m in micros){
			var micro = micros[m]
			var shader = this.microShaders[micro];
			if(!shader)
				return null;

			shaderHeader += shader.header+"\n";
			shaderCode   += shader.maincode+"\n";
		}
		shaderCode += "}";
		return shaderHeader+shaderCode;
	},


	// loads a xml file to the manager with a completion block to compose the shader needed
	loadXML: function(fileName,onComplete){
		this.xmlFile = fileName || this.xmlFile;
		$.ajax({
			type: "GET",
			url: this.xmlFile,
			dataType: "xml",
			success: function(xml){
				$(xml).find('micro_shader').each(function(){
					var name = $(this).find('name').text();
					var header = $(this).find('header').text();
					var code = $(this).find('maincode').text();
					MicroShaderManager.microShaders[name] = {header: header, maincode: code};
				});
				if (onComplete)
					onComplete();
				console.log("MicroShaderManager: XML "+MicroShaderManager.xmlFile+" loaded");
			},
			error: function() {
				alert("An error occurred while processing XML file.");
			}
		});
	},

};