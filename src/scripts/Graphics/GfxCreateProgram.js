"use strict";
import { GlProgram } from './I_GlProgram.js'
import { LoadShaderProgram, GlCreateShaderInfo } from './GlShaders.js'
import { gfxCtx } from './I_WebGL.js'
// Debug
// For Debuging
import { PrintShaderInfo, PrintAttributes } from './Debug/GfxDebug.js'


/*
 * Initialize default Web Gl Program. 
 */
export function GfxCreatePrograms(gl) {

    const progs = g_glPrograms;

    // Create default program for NON textured geometries
    let progIdx = g_glProgramsCount++;
    progs[progIdx] = new GlProgram;
    progs[progIdx].info.progIdx = progIdx;
    progs[progIdx].program = LoadShaderProgram(gl, SID_DEFAULT);

    gl.useProgram(progs[progIdx].program.program);
    progs[progIdx].shaderInfo = GlCreateShaderInfo(gl, progs[progIdx].program, SID_DEFAULT);
    PrintShaderInfo(progs[progIdx]);

    progs[progIdx].info.sid = SID_DEFAULT;

    // Store globally the fire shader program index
    UNIFORM_PARAMS.defaultVertex.progIdx = progIdx;
    // Create the uniforms buffer 
    progs[progIdx].shaderInfo.uniforms.paramsBuffer = new Float32Array(UNIFORM_PARAMS.defaultVertex.count);
    
    // Initialize Camera
    progs[progIdx].CameraSet();
    // progs[progIdx].CameraUpdate(gl);
    progs[progIdx].UniformsSetParamsBufferValue(Viewport.width,  UNIFORM_PARAMS.defaultVertex.widthIdx);
    progs[progIdx].UniformsSetParamsBufferValue(Viewport.height, UNIFORM_PARAMS.defaultVertex.heightIdx);

    /**
     *  Create default program for textured geometries
     */ 
    progIdx = g_glProgramsCount++;
    progs[progIdx] = new GlProgram;
    progs[progIdx].info.progIdx = progIdx;
    progs[progIdx].program = LoadShaderProgram(gl, SID_DEFAULT_TEXTURE_SDF);

    gl.useProgram(progs[progIdx].program);
    progs[progIdx].shaderInfo = GlCreateShaderInfo(gl, progs[progIdx].program, SID_DEFAULT_TEXTURE_SDF);
    PrintShaderInfo(progs[progIdx]);

    progs[progIdx].info.sid = SID_DEFAULT_TEXTURE_SDF;

    // Initialize Camera
    progs[progIdx].CameraSet();
    // Store globally the fire shader program index
    UNIFORM_PARAMS.sdf.progIdx = progIdx;
    // Create the uniforms buffer 
    progs[progIdx].shaderInfo.uniforms.paramsBuffer = new Float32Array(UNIFORM_PARAMS.sdf.count);

    return progs;
}

/*
 * Generalized Program Web Gl Creation 
 */
export function GlCreateProgram(sid) {

    const prog = new GlProgram;
    const progIdx = g_glProgramsCount++;
    prog.info.progIdx = progIdx;
    prog.program = LoadShaderProgram(gfxCtx.gl, sid);

    gfxCtx.gl.useProgram(prog.program);
    prog.shaderInfo = GlCreateShaderInfo(gfxCtx.gl, prog.program, SID_DEFAULT);
    PrintShaderInfo(prog);

    prog.info.sid = sid;
    g_glPrograms[progIdx] = prog;

    
    if (sid & SID.FIRE_FS) {

        // Initialize Camera
        prog.CameraSet();
        // Store globally the fire shader program index
        UNIFORM_PARAMS.fireBall.progIdx = progIdx;
        // Create the uniforms buffer 
        prog.shaderInfo.uniforms.paramsBuffer = new Float32Array(UNIFORM_PARAMS.fireBall.count);
    }
    
    if (sid & SID.EXPLOSION) {

        // Initialize Camera
        prog.CameraSet();
        // Store globally the fire shader program index
        UNIFORM_PARAMS.brickExplosion.progIdx = progIdx;
        PROGRAM.explosions = progIdx; // HACK:TEMP to have a globbal refference to the explosions shader program
        // Create the uniforms buffer 
        prog.shaderInfo.uniforms.paramsBuffer = new Float32Array(UNIFORM_PARAMS.brickExplosion.count);
        prog.UniformsSetParamsBufferValue(Viewport.width,  UNIFORM_PARAMS.brickExplosion.widthIdx);
        prog.UniformsSetParamsBufferValue(Viewport.height, UNIFORM_PARAMS.brickExplosion.heightIdx);

        // Create a unique to this program uniform, 
        // to store the positions of an explosiable object
        prog.shaderInfo.uniforms.positionsBuffer = new Float32Array(5); // The actual array
        prog.shaderInfo.uniforms.positionsBufferLoc = gfxCtx.gl.getUniformLocation(prog.program, 'u_Positions');	// The location of the uniform
    }

    if (sid & SID.PARTICLES) {

        // Initialize Camera
        prog.CameraSet();
        // Store globally the fire shader program index
        UNIFORM_PARAMS.particles.progIdx = progIdx;
        // Create the uniforms buffer 
        prog.shaderInfo.uniforms.paramsBuffer = new Float32Array(UNIFORM_PARAMS.particles.count);
        prog.UniformsSetParamsBufferValue(Viewport.width,  UNIFORM_PARAMS.particles.widthIdx);
        prog.UniformsSetParamsBufferValue(Viewport.height, UNIFORM_PARAMS.particles.heightIdx);
        prog.UniformsSetParamsBufferValue(0, UNIFORM_PARAMS.particles.speedIdx);
    }
    if (sid & SID.NOISE) {
        
        // Initialize Camera
        prog.CameraSet();
        // Store globally the fire shader program index
        UNIFORM_PARAMS.NOISE.progIdx = progIdx;
        // Create the uniforms buffer 
        prog.shaderInfo.uniforms.paramsBuffer = new Float32Array(UNIFORM_PARAMS.NOISE.count);
        // prog.UniformsSetParamsBufferValue(Viewport.width,  UNIFORM_PARAMS.NOISE.widthIdx);
        prog.UniformsSetParamsBufferValue(Viewport.width,  UNIFORM_PARAMS.NOISE.widthIdx);
        prog.UniformsSetParamsBufferValue(Viewport.height, UNIFORM_PARAMS.NOISE.heightIdx);
    }
    
    PrintAttributes(gfxCtx.gl);

    return progIdx;
}

