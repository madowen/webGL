precision highp float;
varying vec4 vPosition;  // position of the vertex (and fragment) in world space
varying vec3 vNormalDirection;  // surface normal vector in world space
varying vec2 vTextureCoord;
uniform mat4 m, v, p;
uniform mat4 v_inv;
uniform sampler2D uTexture;

//light//

uniform vec3 uLPosition;
uniform vec3 uLDirection;
/*
uniform vec4 uLRange;
uniform vec4 uLIntensity;
uniform vec4 uLDiffuse;
uniform vec4 uLSpecular;
uniform float uLConstantAttenuation, uLLinearAttenuation, uLQuadraticAttenuation;
uniform float uLSpotCutoff, uLSpotExponent;
uniform vec3 uLSpotDirection;
*/



void main()
{
	float intensity;
	vec4 lightColor;
	vec3 n = normalize(vNormalDirection);
	intensity = dot(uLDirection,n);

	if (intensity > 0.95)
		lightColor = vec4(0.8,0.8,0.8,1.0);
	else if (intensity > 0.5)
		lightColor = vec4(0.5,0.5,0.5,1.0);
	else if (intensity > 0.25)
		lightColor = vec4(0.2,0.2,0.2,1.0);
	else
		lightColor = vec4(0.1,0.1,0.1,1.0);
		
	vec4 textureColor = texture2D( uTexture, vTextureCoord);
			
	gl_FragColor = lightColor * textureColor;

}
