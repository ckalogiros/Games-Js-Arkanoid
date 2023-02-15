"use strict";
import { Mat4Orthographic } from '../Helpers/Math/Matrix.js';
import { gfxCtx }           from './I_WebGL.js'


/**
 * void gl.uniform1f(location, v0);
 * void gl.uniform1fv(location, value);
 * void gl.uniform1i(location, v0);
 * void gl.uniform1iv(location, value);
 * 
 * void gl.uniform2f(location, v0, v1);
 * void gl.uniform2fv(location, value);
 * void gl.uniform2i(location, v0, v1);
 * void gl.uniform2iv(location, value);
 * 
 * void gl.uniform3f(location, v0, v1, v2);
 * void gl.uniform3fv(location, value);
 * void gl.uniform3i(location, v0, v1, v2);
 * void gl.uniform3iv(location, value);
 * 
 * void gl.uniform4f(location, v0, v1, v2, v3);
 * void gl.uniform4fv(location, value);
 * void gl.uniform4i(location, v0, v1, v2, v3);
 * void gl.uniform4iv(location, value);
 */

/**
 *  gl.uniform1f (floatUniformLoc, v);                 // for float
 *  gl.uniform1fv(floatUniformLoc, [v]);               // for float or float array
 *  gl.uniform2f (vec2UniformLoc,  v0, v1);            // for vec2
 *  gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // for vec2 or vec2 array
 *  gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // for vec3
 *  gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // for vec3 or vec3 array
 *  gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // for vec4
 *  gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // for vec4 or vec4 array
 *   
 *  gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // for mat2 or mat2 array
 *  gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // for mat3 or mat3 array
 *  gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // for mat4 or mat4 array
 *   
 *  gl.uniform1i (intUniformLoc,   v);                 // for int
 *  gl.uniform1iv(intUniformLoc, [v]);                 // for int or int array
 *  gl.uniform2i (ivec2UniformLoc, v0, v1);            // for ivec2
 *  gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // for ivec2 or ivec2 array
 *  gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // for ivec3
 *  gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // for ivec3 or ivec3 array
 *  gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // for ivec4
 *  gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for ivec4 or ivec4 array
 *   
 *  gl.uniform1i (sampler2DUniformLoc,   v);           // for sampler2D (textures)
 *  gl.uniform1iv(sampler2DUniformLoc, [v]);           // for sampler2D or sampler2D array
 *   
 *  gl.uniform1i (samplerCubeUniformLoc,   v);         // for samplerCube (textures)
 *  gl.uniform1iv(samplerCubeUniformLoc, [v]);         // for samplerCube or samplerCube array
 */



// const defaultProgramUniformParams   = new Float32Array(5);
// const sdfProgramUniformParams       = new Float32Array(5);
// const fireProgramUniformParams      = new Float32Array(7);


// export function GlUniformsCreateParamsBuffer(numElements){ 

//     return new Float32Array(numElements);
// }
// export function GlUniformsGetParamsBuffer(progIdx){ 

//     if(progIdx === 0){
//         return defaultProgramUniformParams;
//     }
//     else if(progIdx === 1){
//         return sdfProgramUniformParams;
//     }
//     else if(progIdx === 2){
//         return fireProgramUniformParams;
//     }
//     alert('No correct program index. GlUniformsGetParamsBuffer(). GlUniforms.js')
// }
// export function GlUniformsSet(index, val, progIdx){

//     if(progIdx === 0){
//         defaultProgramUniformParams[index] = val;
//         UniformsNeedUpdate(progIdx);
//         return;
//     }
//     else if(progIdx === 1){
//         sdfProgramUniformParams[index] = val;
//         UniformsNeedUpdate(progIdx);
//         return;
//     }
//     else if(progIdx === 2){
//         fireProgramUniformParams[index] = val;
//         UniformsNeedUpdate(progIdx);
//         return;
//     }
//     alert('No correct program index. GlUniformsSet().  GlUniforms.js')
// }
// export function UniformsNeedUpdate(progIdx){
    
//     const progs = g_glPrograms;
    
//     if(progIdx >= 0){
//         progs[progIdx].uniformsNeedUpdate = true;
//         return;
//     }
//     alert('No correct program index. UniformsNeedUpdate().  GlUniforms.js')

// }
// export function UniformsUpdate(progIdx){
    
//     const progs  = g_glPrograms;
    
//     if(progIdx === 0){
//         // gfxCtx.gl.useProgram(progs[progIdx].program);
//         gfxCtx.gl.uniform1fv(progs[progIdx].shaderInfo.uniforms.paramsBufferLoc, progs[progIdx].shaderInfo.uniforms.paramsBuffer); // And the shader decides the number of elements to draw from the buffer
//         progs[progIdx].uniformsNeedUpdate = false;
//         return;
//     }
//     else if(progIdx === 1){
//         // gfxCtx.gl.useProgram(progs[progIdx].program);
//         gfxCtx.gl.uniform1fv(progs[progIdx].shaderInfo.uniforms.paramsBufferLoc, progs[progIdx].shaderInfo.uniforms.paramsBuffer); // And the shader decides the number of elements to draw from the buffer
//         progs[progIdx].uniformsNeedUpdate = false;
//         return;
//     }
//     else if(progIdx === 2){
//         gfxCtx.gl.uniform1fv(progs[progIdx].shaderInfo.uniforms.paramsBufferLoc, progs[progIdx].shaderInfo.uniforms.paramsBuffer); // And the shader decides the number of elements to draw from the buffer
//         progs[progIdx].uniformsNeedUpdate = false;
//         return;
//     }

//     alert('No correct program index. UniformsUpdate().  GlUniforms.js')

// }


// TODO: It is called for every AddMesh instead of once per program OR vertex buffer
// export function UniformsSet(gl, prog) {

//     const projMat = new Mat4Orthographic(0, Viewport.width, Viewport.height, 0, -100.0, 1000);

//     if (prog.shaderInfo.uniforms.orthoProj) {
//         gl.uniformMatrix4fv(prog.shaderInfo.uniforms.orthoProj, false, projMat);
//     }
// }

