"use strict";
import {Mat4Orthographic} from '../Helpers/Math/Matrix.js'

export class VertexBuffer {

	name = '';
	sceneId = INT_NULL;
	
	buffer =	null;
	data = [];

	idx 	= INT_NULL;			// The vertex buffer (float*) idx that this Mesh is stored to.
	count 	= 0;			// Current size of the float buffer (in floats)
	size 	= 0;			// Total   size of the float buffer (in floats)
	start 	= 0;			// The current meshe's starting idx in vertex buffer. 
	vCount 	= 0;
	
	vao    = null;
	vboId  = INT_NULL;
	iboId  = INT_NULL;
	tboId  = INT_NULL;
	texIdx = INT_NULL;
	
	
	scissorBox = [];
	
	show 		  = true;
	needsUpdate   = false;
	hasChanged 	  = false;
	hasScissorBox = false;

};

export class IndexBuffer {
    
	name = '';
	
	data = [];
	buffer =	null;

	idx     = INT_NULL;
	start   = 0;
	count   = 0;
	size    = 0;
	vCount  = 0;

	vao = null;
	iboId =  INT_NULL;
	
	needsUpdate = false;
};

export class GlProgram  {

	program = null;
	isActive = false;
    uniformsNeedUpdate = false;

	info = {

		sid:0,				// Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
		programId:0,			
		progIdx:INT_NULL,		
	};
	shaderInfo = {
		colOffset:      INT_NULL,				
		posOffset:      INT_NULL, 			
		scaleOffset:    INT_NULL, 			
		texOffset:      INT_NULL, 			
		wposOffset:     INT_NULL,	
        roundOffset:    INT_NULL,   // Radius for rounding corners
        borderOffset:   INT_NULL,	// Border width		
        featherOffset:  INT_NULL,	// Border feather distance	
        timeOffset:     INT_NULL,	// Border feather distance	

		attributes:{
			colLoc:     INT_NULL,			
			posLoc:     INT_NULL,			
			scaleLoc:   INT_NULL,			
			texLoc:     INT_NULL,			
			wposLoc:    INT_NULL,			
			roundLoc:   INT_NULL,   // Radius for rounding corners
			borderLoc:  INT_NULL,	// Border width		
			featherLoc: INT_NULL,	// Border feather distance		
			timeLoc:    INT_NULL,	 		
		},

		uniforms:{
			orthoProj:          null,
			sampler:            null,
			paramsBuffer:       null,    // Uniform Buffer
			paramsBufferLoc:    null,    // Uniform Location
			positionsBuffer:    null,    // Uniform Buffer
			positionsBufferLoc: null,    // Uniform Location
            paramsBufferCount:0,         // Counts the numbber of uniform values
		},		
			
		attribsPerVertex:0,	
		verticesPerRect:0,	
	};

	vertexBuffer = [];
	vertexBufferCount = 0;
    
	indexBuffer = [];
	indexBufferCount = 0;

	camera = null; 

    CameraSet(){
        this.camera = new Mat4Orthographic(0, Viewport.width, Viewport.height, 0, -100.0, 1000);
    }
    CameraUpdate(glContext){
        if(!this.camera) alert('Forget to set camera. I_GlProgram.js');
        glContext.uniformMatrix4fv(this.shaderInfo.uniforms.orthoProj, false, this.camera);
    }
    
    /**
     * Uniform buffer for miscellaneous-orbitary number of uniforms for a specific gl program 
     */
    UniformsSetParamsBufferValue(value, index){
        this.shaderInfo.uniforms.paramsBuffer[index] = value;
        this.uniformsNeedUpdate = true;
    }

    UniformsUpdateParamsBuffer(glContext){
        glContext.uniform1fv(this.shaderInfo.uniforms.paramsBufferLoc, this.shaderInfo.uniforms.paramsBuffer); // And the shader decides the number of elements to draw from the buffer
        this.uniformsNeedUpdate = false;
    }
};


export class GfxInfoMesh{
    
    sceneId     = INT_NULL;          
    sid         = INT_NULL;          
    numFaces    = 0;
	vertsPerRect = 0;
	attribsPerVertex = 0;
    
	prog = {
        idx: INT_NULL,
	}
	vao = null;
    
	vb = { // The vertex buffer info the mesh belongs to
        
		buffer:	null,
		idx:INT_NULL,			// The vertex buffer (float*) idx that this Mesh is stored to.
		start:0,		// The current meshe's starting idx in vertex buffer. 
		count:0,		// Current size of the float buffer (in floats)
	}; 
	
	ib = { // The vertex buffer info the mesh belongs to
		
		buffer:	null,
		idx:INT_NULL,			// The idx buffer's  idx.
		start:0,		// The current meshe's starting idx in vertex buffer. 
		count:0,		// Number of total meshe's attributes  
	}; 

    tb = { // The Texture info for the mesh

        id:  INT_NULL,     // An id generated by webGl (texture unit: GL_TEXTURE0)
        idx: INT_NULL,
    };
}


export let GlFrameBuffer = {

    name: '',
    
    buffer: null,
	tex: null,
    texId:      INT_NULL,
    texIdx:     INT_NULL,
    texWidth:   0,
    texHeight:  0,
    progIdx:    INT_NULL,
    vbIdx:      INT_NULL,
};

let GlUID = INT_NULL; // A unique id for every vertex buffer, to distinguish which meshes belong to which buffer 
export function GlCreateUniqueBufferid(){
    GlUID++;
    return GlUID;
}