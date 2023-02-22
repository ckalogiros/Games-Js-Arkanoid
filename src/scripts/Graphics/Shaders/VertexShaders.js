"use strict";

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

layout (location = 0) in mediump vec4  a_Col;
layout (location = 1) in mediump vec2  a_Pos;
layout (location = 2) in mediump vec2  a_Scale;
layout (location = 3) in mediump vec3  a_Wpos;
layout (location = 4) in mediump float a_RoundCorners;
layout (location = 5) in mediump float a_Border;
layout (location = 6) in mediump float a_Feather;

uniform mat4  u_OrthoProj;
uniform mediump float u_Params[MAX_NUM_PARAMS_BUFFER];                  // [0]:WinWidth, [1]:WinHeight, [3]:Time

out mediump vec4  v_Color; 
out mediump vec2  v_Wpos; 
out mediump vec2  v_Dim; 
out mediump vec2  v_Scale; 
out mediump float v_RoundCorners; 
out mediump float v_Border; 
out mediump float v_Feather; 
out mediump float v_Params[MAX_NUM_PARAMS_BUFFER];                   
    
void main(void) {
    
    vec2 scaled = a_Pos  * a_Scale;
    gl_Position = u_OrthoProj * vec4(scaled.x + a_Wpos.x, scaled.y + a_Wpos.y, a_Wpos.z, 1.0);
    
    v_Color     = a_Col;
    v_Dim       = abs(a_Pos);
    v_Wpos      = a_Wpos.xy;
    v_Scale     = a_Scale;
    v_Border    = a_Border; 
    v_Feather   = a_Feather;
    v_Params    = u_Params;
    v_RoundCorners = a_RoundCorners; 
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

#define MAX_NUM_PARAMS_BUFFER 1

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
out mediump float  v_ParamsParticlesShader[MAX_NUM_PARAMS_BUFFER];                   

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

    if(sid & SID.ATTR_TEX2){
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
    else if(sid & SID.EXPLOSION2_FS){
        return VS_PARTICLES;
    }
    else if(sid & SID.EXPLOSION_FS){
        return VS_EXPLOSION;
    }
    else if(
        (sid & SID.ATTR_POS2   && sid & SID.ATTR_COL4  &&
         sid & SID.ATTR_SCALE2 && sid & SID.ATTR_WPOS3 &&
         sid & SID.ATTR_ROUND_CORNERS  &&
         sid & SID.ATTR_BORDER_WIDTH  && sid & SID.ATTR_BORDER_FEATHER)
    ){
        return VS_DEFAULT;
    }
}
