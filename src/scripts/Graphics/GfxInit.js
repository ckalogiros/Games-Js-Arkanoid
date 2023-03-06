"use strict";
import { gfxCtx } from './I_WebGL.js'
import { GfxCreatePrograms } from './GfxCreateProgram.js';
import { GlCreateTexture } from './GlTextures.js'
import { COMIC_FONT_TEXTURE_PATH } from '../Engine/Loaders/Font/LoadFont.js'
// import { GlUniformsSet } from './GlUniforms.js';


// For Debuging
import * as dbg from './Debug/GfxDebug.js'



const canvas = document.getElementById("glCanvas");

function DeviceSetUp(){
    Device.width  = window.innerWidth;
    Device.height = window.innerHeight;
    console.log('Device width: ', Device.width, ' height: ',  Device.height)

    if(Device.width > 500){
        canvas.width  = 500;
        canvas.height = Device.height;
    }
    else{
        canvas.width  = Device.width;
        canvas.height = Device.height;
    }
    // Update (global) Viewport object
    Viewport.width    = canvas.width;
    Viewport.height   = canvas.height;

    Viewport.left     = 0;
    Viewport.right    = canvas.width;
    Viewport.top      = 0;
    Viewport.bottom   = canvas.height;
    Viewport.centerX  = Viewport.left + (Viewport.width/2);
    Viewport.centerY  = Viewport.top + (Viewport.height/2);
    
    Viewport.ratio    = canvas.width / canvas.height;
    Viewport.leftMargin =  (window.innerWidth - Viewport.width) / 2;
    Viewport.topMargin  = (window.innerHeight - Viewport.height) / 2
}

export function GfxInitGraphics() {

    DeviceSetUp();

    console.log('Initializing Graphics.')

    /** Create Graphics Context */
    gfxCtx.gl = canvas.getContext("webgl2", {
        premultipliedAlpha: false,
        antialias: true,
        // colorSpace: 'srgb',
        // alpha: true,
        preserveDrawingBuffer: true,
    });

    console.log('WebGl version: ', gfxCtx.gl.getParameter(gfxCtx.gl.SHADING_LANGUAGE_VERSION));
    if (!gfxCtx.gl)
        alert('Unable to initialize WebGL.');


    // gfxCtx.ext = gfxCtx.gl.getSupportedExtensions();
    // gfxCtx.gl.getExtension('OES_standard_derivatives');
    // gfxCtx.gl.getExtension('EXT_shader_texture_lod');

    gfxCtx.gl.enable(gfxCtx.gl.DEPTH_TEST);
    /* * * * * GlDepthFunc Constant Parameters
        gl.NEVER (never pass)
        gl.LESS (pass if the incoming value is less than the depth buffer value)
        gl.EQUAL (pass if the incoming value equals the depth buffer value)
        gl.LEQUAL (pass if the incoming value is less than or equal to the depth buffer value)
        gl.GREATER (pass if the incoming value is greater than the depth buffer value)
        gl.NOTEQUAL (pass if the incoming value is not equal to the depth buffer value)
        gl.GEQUAL (pass if the incoming value is greater than or equal to the depth buffer value)
        gl.ALWAYS (always pass)
    */
    gfxCtx.gl.depthFunc(gfxCtx.gl.LEQUAL)
    gfxCtx.gl.enable(gfxCtx.gl.BLEND);
    /* * * * * GlBlend Constants
        gl.ZERO 	                    Multiplies all colors by 0.
        gl.ONE 	                        Multiplies all colors by 1.
        gl.SRC_COLOR 	                Multiplies all colors by the source colors.
        gl.ONE_MINUS_SRC_COLOR 	        Multiplies all colors by 1 minus each source color.
        gl.DST_COLOR 	                Multiplies all colors by the destination color.
        gl.ONE_MINUS_DST_COLOR 	        Multiplies all colors by 1 minus each destination color.
        gl.SRC_ALPHA 	                Multiplies all colors by the source alpha value.
        gl.ONE_MINUS_SRC_ALPHA 	        Multiplies all colors by 1 minus the source alpha value.
        gl.DST_ALPHA 	                Multiplies all colors by the destination alpha value.
        gl.ONE_MINUS_DST_ALPHA 	        Multiplies all colors by 1 minus the destination alpha value.
        gl.CONSTANT_COLOR 	            Multiplies all colors by a constant color.
        gl.ONE_MINUS_CONSTANT_COLOR 	Multiplies all colors by 1 minus a constant color.
        gl.CONSTANT_ALPHA 	            Multiplies all colors by a constant alpha value.
        gl.ONE_MINUS_CONSTANT_ALPHA 	Multiplies all colors by 1 minus a constant alpha value.
        gl.SRC_ALPHA_SATURATE 	        Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1. 
     */
    // gfxCtx.gl.blendFunc(gfxCtx.gl.GL_SRC_ALPHA, gfxCtx.gl.ONE_MINUS_SRC_ALPHA);
    gfxCtx.gl.blendFunc(gfxCtx.gl.DST_ALPHA, gfxCtx.gl.ONE_MINUS_SRC_ALPHA);
    // gfxCtx.gl.depthMask(false);

    const progs = GfxCreatePrograms(gfxCtx.gl);
    dbg.PrintAttributes(gfxCtx.gl);
    const texture = GlCreateTexture('FontConsolasSdf35', gfxCtx.gl, COMIC_FONT_TEXTURE_PATH);

}



