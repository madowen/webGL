precision highp float;
varying vec4 vPosition;  // position of the vertex (and fragment) in world space
varying vec3 vNormalDirection;  // surface normal vector in world space
varying vec2 vTextureCoord;
uniform mat4 m, v, p;
uniform mat4 v_inv;
uniform sampler2D uTexture;

//light//
uniform vec3	uLPosition;
uniform vec3	uLDirection;
uniform int		uLType;
uniform float	uLRange;
uniform float	uLIntensity;
uniform float	uLSpotAngle;
uniform float	uLSpotExponent;
uniform vec4 	uLDiffuse;
uniform vec4 	uLSpecular;
uniform float 	uLConstantAttenuation, uLLinearAttenuation, uLQuadraticAttenuation;

uniform vec4 	uSceneAmbient;

//object//
uniform vec4 uOColor;

 
struct material
{
  vec4 ambient;
  vec4 diffuse;
  vec4 specular;
  float shininess;
};
material frontMaterial = material(
  vec4(0.4, 0.4, 0.4, 1.0),
  vec4(1.0, 0.8, 0.8, 1.0),
  vec4(1.0, 1.0, 1.0, 1.0),
  1.0
);
// float range = 500.0;
void main(){
	vec3 normalDirection = normalize(vNormalDirection);
	vec3 viewDirection = normalize(vec3(v_inv * vec4(0.0, 0.0, 0.0, 1.0) - vPosition));
	vec3 lightDirection;
	float attenuation;
	
	if (0 == uLType){																// directional light?
		attenuation = 1.0; 																		// no attenuation
		lightDirection = normalize(-uLDirection);
	}else if(1 == uLType){ 																						// point light or spotlight (or other kind of light)
		vec3 positionToLightSource = vec3(vec4(uLPosition,1.0) - vPosition);
		float distance = length(positionToLightSource);
		lightDirection = normalize(positionToLightSource);
		attenuation = uLRange * 1.0 / (uLConstantAttenuation + uLLinearAttenuation * distance + uLQuadraticAttenuation * distance * distance);
	}else if(2 == uLType){
		vec3 positionToLightSource = vec3(vec4(uLPosition,1.0) - vPosition);
		float distance = length(positionToLightSource);
		lightDirection = normalize(positionToLightSource);
		attenuation = uLRange * 1.0 / (uLConstantAttenuation + uLLinearAttenuation * distance + uLQuadraticAttenuation * distance * distance);

		float clampedCosine = max(0.0, dot(-lightDirection, normalize(uLDirection)));
		if (clampedCosine < cos(radians(uLSpotAngle))){ 								// outside of spotlight cone?
			attenuation = 0.0;
		}else{
			attenuation = attenuation * pow(clampedCosine, uLSpotExponent);   
		}

	}
	
	vec3 ambientLighting = vec3(uSceneAmbient) * vec3(frontMaterial.ambient);
	
	vec3 diffuseReflection = attenuation * vec3(uLDiffuse) * vec3(frontMaterial.diffuse) * max(0.0, dot(normalDirection, lightDirection));
	
	vec3 specularReflection;
	if (dot(normalDirection, lightDirection) < 0.0){ // light source on the wrong side?
		specularReflection = vec3(0.0, 0.0, 0.0); // no specular reflection
	}else{ // light source on the right side
		specularReflection = attenuation * vec3(uLSpecular) * vec3(frontMaterial.specular) * pow(max(0.0, dot(reflect(-lightDirection, normalDirection), viewDirection)), frontMaterial.shininess);
	}
	
	vec4 color = texture2D( uTexture, vTextureCoord);
	gl_FragColor = color * vec4(ambientLighting + diffuseReflection + specularReflection, 1.0) * uLIntensity;
}