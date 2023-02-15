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
	ATTR_ROUND_CORNERS:         0x20,
	ATTR_BORDER_WIDTH:          0x40,
	ATTR_BORDER_FEATHER:  0x80,
	ATTR_TIME:                  0x100,

    UNIF_SAMPLER:               0x200,
	UNIF_PROJECTION:            0x400,
    
	INDEXED:                    0x1000,
	TEXT_SDF:                   0x2000,
	PARTICLES:                  0x4000,

    // Post processing shaders
    FIRE_FS:                    0x10000,
    EXPLOSION_FS:               0x20000,
    EXPLOSION2_FS:              0x40000,
	
};
/**
 * Global Shader Programs. Not essential, for convinience only.
 * One can pass the SID bbbellow directly to GlAddMesh(SID) parameter.
 */

const SID_DEFAULT = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_SCALE2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_ROUND_CORNERS | SID.ATTR_BORDER_WIDTH | SID.ATTR_BORDER_FEATHER);
const SID_DEFAULT_TEXTURE = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_SCALE2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TEX2);
const SID_DEFAULT_TEXTURE_SDF = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_SCALE2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TEX2 | SID.TEXT_SDF);
const SID_EXPLOSION = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TIME);
const SID_EXPLOSION2 = 
    (SID.ATTR_COL4 | SID.ATTR_POS2 | SID.ATTR_WPOS3 | SID.INDEXED | SID.ATTR_TIME | SID.EXPLOSION2_FS);
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

const V_COL_COUNT 		     = 4 // Number of floats for vertex buffer's color attribute
const V_POS_COUNT 		     = 2 // Number of floats for vertex buffer's position attribute
const V_SCALE_COUNT 	     = 2 // Number of floats for vertex buffer's scale attribute
const V_TEX_COUNT 		     = 2 // Number of floats for vertex buffer's texture attribute
const V_WPOS_COUNT 		     = 3 // Number of floats for vertex buffer's world pos attribute
const V_ROUND_CORNER_COUNT	 = 1 // Number of floats for vertex buffer's radius attribute
const V_BORDER_WIDTH_COUNT	 = 1 // Number of floats for vertex buffer's radius attribute
const V_BORDER_FEATHER_COUNT = 1 // Number of floats for vertex buffer's radius attribute
const V_TIME_COUNT           = 1 // Number of floats for vertex buffer's time attribute

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
    particles: { // Uniform buffer indexes to pass default vertex shader params
        idx0:  0,
        idx1:  1,
        idx2:  2,
        idx3:  3,
        idx4:  4,
        idx5:  5,
        idx6:  6,
        count: 7,
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

