attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec2 a_coord;

varying vec4 vPosition;  		// position of the vertex (and fragment) in world space
varying vec3 vNormalDirection;  // surface normal vector in world space
varying vec2 vTextureCoord;		

uniform mat4 m, v, p;			//model, view, projection
uniform mat4 umodelt; 	//inverse(transpose(model))
 
void main()
{
	vTextureCoord = a_coord;
	vPosition = m * vec4(a_vertex,1.0);
	vNormalDirection = normalize(umodelt * vec4(a_normal,1.0)).xyz;
	
	mat4 mvp = p*v*m;
	gl_Position = mvp * vec4(a_vertex,1.0);
}