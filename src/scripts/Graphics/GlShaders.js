"use strict";
import {VertexShaderChoose} 	from './Shaders/VertexShaders.js'
import {FragmentShaderChoose} 	from './Shaders/FragmentShaders.js'
import * as dbg from './Debug/GfxDebug.js'



export function LoadShaderProgram(gl, sid) {

	const shader = {
		vShader: VertexShaderChoose(sid),
		fShader: FragmentShaderChoose(sid),
	};
	const program = LoadShaders(gl, shader);
	if (program){
		if(dbg.GL_DEBUG_SHADERS) console.log('Shader Program Created Sucessuly!\nShader Type ID: ', dbg.GetShaderTypeId(sid));
	} else {
		alert('Unable to CREATE shader program: ' + gl.getProgramInfoLog(program));
	}

	return program;
}


function LoadShaders(gl, shader) {

	const vShader = loadShaders(gl, gl.VERTEX_SHADER, shader.vShader);
	const fShader = loadShaders(gl, gl.FRAGMENT_SHADER, shader.fShader);

	const program = gl.createProgram();

	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);
	gl.linkProgram(program);

	const status = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!status) {
		alert('Unable to LINK the shader program: ' + gl.getProgramInfoLog(program));
        glDeleteProgram(program);
        program = 0;
		return null;
	} else {
		console.log('Shaders Linked Sucessuly!');
	}

	return program;
}

function loadShaders(gl, shaderType, source) {

	const shader = gl.createShader(shaderType);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (!status) {
		alert('An error occurred COMPILING the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	} else {
		console.log('Shader Compiled Sucessuly!');
	}

	return shader;
}

export function GlCreateShaderInfo(gl, program, sid) {

	let attribsOffset = 0;

	const shaderInfo = {

		// The string with the name of the attribute/uniform passed to getAttribLocation/Location, 
		// must match the exact name in the vertex shader code.
		attributes:{

			colLoc: 	gl.getAttribLocation(program, 'a_Col'),		// Color attrib	
			posLoc:		gl.getAttribLocation(program, 'a_Pos'),		// Vertex Position attrib	 
			scaleLoc:	gl.getAttribLocation(program, 'a_Scale'),	// Scale attrib	 		
			texLoc:		gl.getAttribLocation(program, 'a_Tex'),		// texture Coords attrib	 	
			wposLoc:	gl.getAttribLocation(program, 'a_Wpos'),	// World Position attrib	 		
			roundLoc:	gl.getAttribLocation(program, 'a_RoundCorners'),	// Radius attrib (for round mesh corners)	 		
			borderLoc:	gl.getAttribLocation(program, 'a_Border'),	// Border attrib (border width)	 		
			featherLoc:	gl.getAttribLocation(program, 'a_Feather'),	// Feather attrib (border feather distance )	 		
			timeLoc:	gl.getAttribLocation(program, 'a_Time'),	// Time attrib 	 		
		},
		uniforms:{

            // Static uniforms
			orthoProj: 	gl.getUniformLocation(program, 'u_OrthoProj'), 	// Orthographic Projection Matrix4 	
			sampler:	gl.getUniformLocation(program, 'u_Sampler0'),	// Sampler for texture units 	
			
            /**
             * Variable Uniforms
			 * Uniforms paramsBuffer is an array of floats to be used as a buffer
             * to pass any kind of float values to the shaders.
			 */
			paramsBufferLoc:	gl.getUniformLocation(program, 'u_Params'),	// The location of the uniform
            paramsBuffer: null, // The actual array
        },	
		
	}
	
	if(shaderInfo.attributes.colLoc >= 0){
		shaderInfo.colOffset = attribsOffset;
		attribsOffset += V_COL_COUNT;
	}
	if(shaderInfo.attributes.posLoc >= 0){
		shaderInfo.posOffset = attribsOffset;
		attribsOffset += V_POS_COUNT
	}
	if(shaderInfo.attributes.scaleLoc >= 0){
		shaderInfo.scaleOffset = attribsOffset;
		attribsOffset += V_SCALE_COUNT
	}
	if(shaderInfo.attributes.texLoc >= 0){
		shaderInfo.texOffset = attribsOffset;
		attribsOffset += V_TEX_COUNT
	}
	if(shaderInfo.attributes.wposLoc >= 0){
		shaderInfo.wposOffset = attribsOffset;
		attribsOffset += V_WPOS_COUNT
	}
	if(shaderInfo.attributes.roundLoc >= 0){
		shaderInfo.roundOffset = attribsOffset;
		attribsOffset += V_ROUND_CORNER_COUNT
	}
	if(shaderInfo.attributes.borderLoc >= 0){
		shaderInfo.borderOffset = attribsOffset;
		attribsOffset += V_BORDER_WIDTH_COUNT
	}
	if(shaderInfo.attributes.featherLoc >= 0){
		shaderInfo.featherOffset = attribsOffset;
		attribsOffset += V_BORDER_FEATHER_COUNT
	}
	if(shaderInfo.attributes.timeLoc >= 0){
		shaderInfo.timeOffset = attribsOffset;
		attribsOffset += V_TIME_COUNT
	}
	
	shaderInfo.attribsPerVertex = attribsOffset;	
	
	if(sid & SID.INDEXED)
		shaderInfo.verticesPerRect = VERTS_PER_RECT_INDEXED;

	return shaderInfo;
}

