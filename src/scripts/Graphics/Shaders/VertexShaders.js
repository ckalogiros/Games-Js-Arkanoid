"use strict";

/**
 * Raymarching Implementation
 *      https://www.youtube.com/watch?v=PGtv-dBi2wE
 *      https://www.shadertoy.com/view/XlGBW3
 * 
    float GetDist(vec3 p)
    {
        vec4 sphere = vac4(0,1,6,1); // [x,y,z,radius]
        // distance to the sphere
        float ds = length(p - sphere.xyz) - sphere.w;  // -.w is the radius
        float dp = p.y; // distance to the plane(the ground plane is the camera.y)
        float d = min(ds, dp); // Take the closest distance(either the plane or the sphere)
        return d;
    }

    // Calculate the normal of a surface by drawing a line between to (very close to each other) points
    // on the surface, calculating the slope (the perpendicular to the line)
    vec3 GetNormal(vec3 p) // p is a point on the surface
    {
        vec2 e = vec2(0.01, 0.0)
        float d = GetDist(p);
        vec3 normal = vec3(
            d - GetDist(p - e.xyy),
            d - GetDist(p - e.yxy),
            d - GetDist(p - e.yyx)
        ); 

        return normalize(normal);
    }

    // ro: ray origin. 
    // rd: ray direction
    float RayMarch(vec3 ro, vec3 rd)
    {
        float do = 0; // do: distance origin(The origin changes in each step of the loop) 
        for(int i=0; i<MAX_STEPS; i++)
        {
            // Set the ray origin to be the prev ray origin + the ray distance 
            // to the prev closest point of the surface
            vec3 p = ro + (do*rd);
            
            // Calculate the new distance(from the current ray origin to the new closest to the surface point)
            ds = GetDist(p);

            // Store the current distance as the next origin
            do += ds;
            
            // If we come across a min distance that we declare as a contant
            // OR we pass a max distance, we stop the ray marching
            if(ds < SOME_MINIMUM_SURFACE_DISTANCE || do > SOME_MAX_DISTANCE)
        }
        return do;
    }

 * 
 */

//===================== Orthographic Matrix =====================
// | left-right | 0				| 0							| 0 |
// | 0			| top - bottom	|							| 0 |
// |			|				| zFar - zNear				| 0 |
// |-(r+l)/(r-l)|-(t+b) / (t-b) |-(zFar+zNear)/(zFar-zNear)	| 1 |
// 0.,     cos(1.), -sin(1.), -0.,
// 0.,     sin(1.), cos(1.),  0.,

/**
 * u_Params[0] = Window Width
 */

const VS_DEFAULT = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 5

layout (location = 0) in mediump vec4 a_Col;
layout (location = 1) in mediump vec2 a_Pos;
layout (location = 2) in mediump vec2 a_Scale;
layout (location = 3) in mediump vec3 a_Wpos;
layout (location = 4) in mediump vec3 a_Style;


uniform mat4  u_OrthoProj;
uniform mediump float u_Params[MAX_NUM_PARAMS_BUFFER];                  // [0]:WinWidth, [1]:WinHeight, [3]:Time

out mediump vec4 v_Color; 
out mediump vec2 v_Wpos; 
out mediump vec2 v_Dim; 
out mediump vec2 v_Scale; 
out mediump vec3 v_Style; 
out mediump float v_Params[MAX_NUM_PARAMS_BUFFER];                   
    
void main(void) {
    
    vec2 scaled = a_Pos  * a_Scale;
    gl_Position = u_OrthoProj * vec4(scaled.x + a_Wpos.x, scaled.y + a_Wpos.y, a_Wpos.z, 1.0);
    
    v_Color     = a_Col;
    v_Dim       = abs(a_Pos);
    v_Wpos      = a_Wpos.xy;
    v_Scale     = a_Scale;
    v_Style     = a_Style; 
    v_Params    = u_Params;
}
`;


const VS_DEFAULT_TEXTURE = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 5

layout (location = 0) in vec4 a_Col;
layout (location = 1) in vec2 a_Pos;
layout (location = 2) in vec2 a_Scale;
layout (location = 3) in vec2 a_Tex;
layout (location = 4) in vec3 a_Wpos;

// In
uniform mat4 u_OrthoProj;
uniform mediump float u_Params[MAX_NUM_PARAMS_BUFFER];                  // [0]:SdfInner, [1]:SdfOuter, [3]?


// Out
out mediump vec4 v_Color; 
out mediump vec2 v_Pos;
out mediump vec2 v_Wpos;
out mediump vec2 v_TexCoord;
out mediump float v_Params[MAX_NUM_PARAMS_BUFFER];

void main(void) 
{
    vec2 scaled = a_Pos * a_Scale;
    gl_Position = u_OrthoProj * vec4(scaled.x + a_Wpos.x, scaled.y + a_Wpos.y, a_Wpos.z, 1.0);

    v_Color = a_Col;
    v_Pos = a_Pos;
    v_Wpos = vec2(a_Wpos.x, a_Wpos.y);
    v_TexCoord = a_Tex;
    v_Params = u_Params;
}
`;

const VS_DEFAULT_TEXTURE_SDF = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 5

layout (location = 0) in vec4 a_Col;
layout (location = 1) in vec2 a_Pos;
layout (location = 2) in vec2 a_Scale;
layout (location = 3) in vec2 a_Tex;
layout (location = 4) in vec3 a_Wpos;
layout (location = 5) in vec2 a_Sdf;

// Uniforms
uniform mat4 u_OrthoProj;
uniform mediump float u_Params[MAX_NUM_PARAMS_BUFFER];                  // [0]:SdfInner, [1]:SdfOuter, [3]?


// Out
out mediump vec4 v_Color; 
out mediump vec2 v_TexCoord;
out mediump vec2 v_SdfParams;

void main(void) 
{

    vec2 scaled = a_Pos * a_Scale;
    gl_Position = u_OrthoProj * vec4(scaled.x + a_Wpos.x, scaled.y + a_Wpos.y, a_Wpos.z, 1.0);

    v_Color = a_Col;
    v_TexCoord = a_Tex;
    v_SdfParams = a_Sdf;
}
`;

const VS_FIRE = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 9

layout (location = 0) in mediump vec4  a_Col;
layout (location = 1) in mediump vec2  a_Pos;
layout (location = 2) in mediump vec2  a_Scale;
layout (location = 3) in mediump vec3  a_Wpos;
layout (location = 4) in mediump float a_RoundCorners;
layout (location = 5) in mediump float a_Border;
layout (location = 6) in mediump float a_Feather;

uniform mat4  u_OrthoProj;
uniform float u_Params[MAX_NUM_PARAMS_BUFFER];                 

out mediump vec4  v_Color; 
out mediump vec2  v_Wpos; 
out mediump vec2  v_Pos; 
out mediump vec2  v_Scale; 
out mediump float v_RoundCorners; 
out mediump float v_Border; 
out mediump float v_Feather;                 
out mediump float  v_ParamsFireShader[MAX_NUM_PARAMS_BUFFER];                   

void main(void) 
{
    vec2 scaled = a_Pos  * a_Scale;
    gl_Position = u_OrthoProj * vec4(scaled.x + a_Wpos.x, scaled.y + a_Wpos.y, a_Wpos.z, 1.0);
    
    v_Color     = a_Col;
    v_Wpos      = abs(a_Pos);
    v_Pos       = a_Wpos.xy;
    v_Scale     = a_Scale;
    v_RoundCorners    = a_RoundCorners; 
    v_Border    = a_Border; 
    v_Feather   = a_Feather;
    v_ParamsFireShader    = u_Params;
}
`;

const VS_EXPLOSION = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 5
#define MAX_NUM_POSITIONS_BUFFER 5

layout (location = 0) in mediump vec4  a_Col;
layout (location = 1) in mediump vec2  a_Pos;
layout (location = 2) in mediump vec3  a_Wpos;
layout (location = 3) in mediump float a_Time;

uniform mat4  u_OrthoProj;
uniform mediump float u_Params[MAX_NUM_PARAMS_BUFFER];    
// uniform mediump float u_Positions[MAX_NUM_POSITIONS_BUFFER]; 

out mediump vec4  v_Color; 
out mediump vec2  v_Wpos; 
out mediump vec2  v_Dim; 
out mediump float v_Time; 
out mediump float v_Params[MAX_NUM_PARAMS_BUFFER];                   
// out mediump float v_Positions[MAX_NUM_POSITIONS_BUFFER]; 

    
void main(void) {
    
    gl_Position = u_OrthoProj * vec4(a_Pos.x + a_Wpos.x, a_Pos.y + a_Wpos.y, a_Wpos.z, 1.0);
    
    v_Color     = a_Col;
    v_Wpos      = a_Wpos.xy;
    v_Time      = a_Time;
    v_Params    = u_Params;
}
`;

const VS_PARTICLES = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 3

layout (location = 0) in mediump vec4  a_Col;
layout (location = 1) in mediump vec2  a_Pos;
layout (location = 2) in mediump vec3  a_Wpos;
layout (location = 3) in mediump float a_Time;

uniform mat4  u_OrthoProj;
uniform float u_Params[MAX_NUM_PARAMS_BUFFER];                 

out mediump vec4  v_Col; 
out mediump vec2  v_Wpos; 
out mediump vec2  v_Dim; 
out mediump float v_Time; 
out mediump float v_ParamsParticlesShader[MAX_NUM_PARAMS_BUFFER];                   

void main(void) 
{
    gl_Position = u_OrthoProj * vec4(a_Pos.x + a_Wpos.x, a_Pos.y + a_Wpos.y, a_Wpos.z, 1.0);
    
    v_Col  = a_Col;
    v_Wpos = a_Wpos.xy;
    v_Dim  = abs(a_Pos);
    v_Time = a_Time;
    v_ParamsParticlesShader = u_Params;
}`;

const VS_NOISE = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 2

layout (location = 0) in mediump vec4  a_Col;
layout (location = 1) in mediump vec2  a_Pos;
layout (location = 2) in mediump vec3  a_Wpos;
layout (location = 3) in mediump float a_Time;

uniform mat4  u_OrthoProj;
uniform float u_Params[MAX_NUM_PARAMS_BUFFER];                 

out mediump vec4  v_Col; 
out mediump vec2  v_Wpos; 
out mediump vec2  v_Dim; 
out mediump float v_Time; 
out mediump float v_ParamsParticlesShader[MAX_NUM_PARAMS_BUFFER];                   

void main(void) 
{
    gl_Position = u_OrthoProj * vec4(a_Pos.x + a_Wpos.x, a_Pos.y + a_Wpos.y, a_Wpos.z, 1.0);
    
    v_Col  = a_Col;
    v_Wpos = a_Wpos.xy;
    v_Dim  = abs(a_Pos);
    v_Time = a_Time;
    v_ParamsParticlesShader = u_Params;
}`;

/**
 * Pass @param sid of @type: SID, to get the correct shader
 */
export function VertexShaderChoose(sid){

    if(
        (sid & SID.ATTR_STYLE)
    ){
        return VS_DEFAULT;
    }
    else if(sid & SID.ATTR_TEX2 && sid & SID.ATTR_SDF_PARAMS){
        return VS_DEFAULT_TEXTURE_SDF;
    }
    else if(sid & SID.ATTR_TEX2){
        return VS_DEFAULT_TEXTURE;
    }
    else if(sid & SID.FIRE_FS){
        return VS_FIRE;
    }
    else if(sid & SID.PARTICLES){
        return VS_PARTICLES;
    }
    else if(sid & SID.NOISE){
        return VS_NOISE;
    }
    else if(sid & SID.EXPLOSION){
        return VS_EXPLOSION;
    }

}
