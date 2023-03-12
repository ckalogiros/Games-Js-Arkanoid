"use strict";

const INT_NULL = -1; // For case like 0 index arrays, where the number 0 index cannot be used as null element for a buffer


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Graphics Constants */

// SID: Shader Type ID, for creating different g_glPrograms with 
// different vertex and fragment shaders bbbased uppon the input attribbutes, input uniforms and other properties.
const SID = {
	
	ATTR_COL4: 	                0x1,
	ATTR_POS2: 	                0x2,
	ATTR_SCALE2:                0x4,
	ATTR_TEX2: 	                0x8,
	ATTR_WPOS3:                 0x10,
	ATTR_STYLE:                 0x20,
	// ATTR_ROUND_CORNERS:         0x20,
	// ATTR_BORDER_WIDTH:          0x40,
	// ATTR_BORDER_FEATHER:        0x80,
	ATTR_TIME:                  0x100,
	ATTR_SDF_PARAMS:            0x200,

    
    UNIF_SAMPLER:               0x1000,
	UNIF_PROJECTION:            0x2000,
	INDEXED:                    0x4000,
	TEXT_SDF:                   0x8000,
	PARTICLES:                  0x10000,

    // Post processing shaders
    FIRE_FS:                    0x100000,
    EXPLOSION:                  0x200000,
    NOISE:                      0x400000,
	
};
/**
 * Global Shader Programs. Not essential, for convinience only.
 * One can pass the SID bbbellow directly to GlAddMesh(SID) parameter.
 */

const SID_DEFAULT = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_SCALE2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_STYLE);
const SID_DEFAULT_TEXTURE = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_SCALE2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TEX2);
const SID_DEFAULT_TEXTURE_SDF = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_SCALE2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TEX2 | SID.TEXT_SDF | SID.ATTR_SDF_PARAMS);
const SID_EXPLOSION = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TIME);
const SID_NOISE = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TIME | SID.NOISE);
const SID_PARTICLES_TAIL = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TIME | SID.PARTICLES);

/**
 * GL program's indexes
 */
const PROGRAM = {

    explosions: INT_NULL,
};


const VS_TRIPPY_TRIANGLE = 'TrippyTriangle';

const MAX_VERTEX_BUFFER_COUNT 	= 16000;
const MAX_INDEX_BUFFER_COUNT 	= MAX_VERTEX_BUFFER_COUNT / 2;
const INDICES_PER_RECT 			= 6
const VERTS_PER_RECT 			= 6
const VERTS_PER_RECT_INDEXED 	= 4

const V_COL_COUNT 		     = 4 // Number of floats for vertex buffer's attribute
const V_POS_COUNT 		     = 2 
const V_SCALE_COUNT 	     = 2 
const V_TEX_COUNT 		     = 2 
const V_WPOS_COUNT 		     = 3 
const V_STYLE                = 3 
const V_SDF_PARAMS_COUNT     = 2 
const V_TIME_COUNT           = 1 

// The style's buffer attribute strides(buffer indexes) 
const V_ROUND_CORNER_STRIDE	  = 0 
const V_BORDER_WIDTH_STRIDE	  = 1 
const V_BORDER_FEATHER_STRIDE = 2 

// 
const CREATE_NEW_GL_BUFFER      = true;
const DONT_CREATE_NEW_GL_BUFFER = false;
const NO_SPECIFIC_GL_BUFFER     = INT_NULL; 
const GL_BUFFER = {
    SPECIFIC_BUFFER: INT_NULL,
};

const MAX_RESERVED_BUFFERS = 10;

// Temporary counters to automaticaly calculate indexes
let cnt1 = 0;
let cnt2 = 0;
let cnt3 = 0;
let cnt4 = 0;
let cntPart = 0;
const UNIFORM_PARAMS = {
    defaultVertex: { // Uniform buffer indexes to pass default vertex shader params
        widthIdx:       cnt1++,
        heightIdx:      cnt1++,
        timeIdx:        cnt1++,
        mouseXPosIdx:   cnt1++,
        mouseYPosIdx:   cnt1++,
        count: cnt1,
        progIdx: INT_NULL,  // Refference to the program
    },
    sdf: { // Uniform buffer indexes to pass sdf params
        innerIdx:       cnt2++,
        outerIdx:       cnt2++,
        count:          cnt2,
        progIdx:        INT_NULL, 
    },
    fireBall:{ // Uniform buffer indexes to pass sdf params
        mouseXdir:          cnt3++,
        mouseYdir:          cnt3++,
        mouseTimeidx:       cnt3++,
        mouseXPosIdx:       cnt3++,
        mouseYPosIdx:       cnt3++,
        temp1Idx:           cnt3++,
        temp2Idx:           cnt3++,
        temp3Idx:           cnt3++,
        temp4Idx:           cnt3++,
        count: cnt3,
        progIdx: INT_NULL, 
    },
    brickExplosion: { // Uniform buffer indexes to pass default vertex shader params
        widthIdx:       cnt4++,
        heightIdx:      cnt4++,
        timeIdx:        cnt4++,
        mouseXPosIdx:   cnt4++,
        mouseYPosIdx:   cnt4++,
        count: cnt4,
        progIdx: INT_NULL,  // Refference to the program
    },
    NOISE:{
        widthIdx:  0,
        heightIdx: 1,
        count: 2,
        progIdx: INT_NULL,  // Refference to the program
    },
    particles: { // Uniform buffer indexes to pass default vertex shader params
        widthIdx:   cntPart++,
        heightIdx:  cntPart++,
        speedIdx:   cntPart++,
        count: cntPart,
        progIdx: INT_NULL,  // Refference to the program
    },
    
};

// Store key-value pairs of texture name - texture index(for the global texture array. See GlTextures.js)
const Texture = {
    fontConsolasSdf35: -1,
    frameBufferTexture0: -1,

    // Current Bound Texture's index(in the texture array. See GlTextures.js). 
    // Only one bound texture is allowed at any time by webGl, so this is a global access
    // to which texture is bound.
    boundTexture: -1, 
};




const FLOAT = 4; // 4 Bytes

/* Graphics Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

// Global Gl Program object

let g_glPrograms = [];
let g_glProgramsCount = 0;

