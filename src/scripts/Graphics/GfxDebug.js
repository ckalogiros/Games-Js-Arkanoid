"use strict";


/**
 * Enable-Disable Debuging
 */
const GL_DEBUG_ATTRIBUTES     = true;
const GL_DEBUG_PROGRAM        = false;
const GL_DEBUG_SHADER_INFO    = false;
const GL_DEBUG_VERTEX_BUFFER  = true;
const GL_DEBUG_INDEX_BUFFER   = true;
const GL_DEBUG_BUFFERS_ALL    = true;



export function GetShaderTypeId(sid){

    let str = 'Shader Attributes: ';

    if(sid & SID.ATTR_COL4)     str += 'col4, '
    if(sid & SID.ATTR_POS2)     str += 'pos2, '
    if(sid & SID.ATTR_SCALE2)   str += 'scale2, '
    if(sid & SID.ATTR_TEX2)     str += 'tex2, '
    if(sid & SID.ATTR_WPOS3)    str += 'wpos3, '
    if(sid & SID.ATTR_ROUND_CORNERS)  str += 'round corners, '
    if(sid & SID.ATTR_BORDER_WIDTH)  str += 'border width, '
    if(sid & SID.ATTR_BORDER_FEATHER)  str += 'border feather, '
    if(sid & SID.ATTR_TIME)  str += 'time, '

    return str;
}

/**
 * 
 * @param {*} gl 
 * @param {*} prog 
 * @returns 
 */
export function PrintAttributes(gl) {
    if(!GL_DEBUG_ATTRIBUTES) return;

    
    const progs = g_glPrograms;
    
    for(let i = 0; i < progs.length; i++){
        
        const prog = progs[i];        
        console.log('\n-[GL Enabled Attributes]-\nFor Shader Program: ', GetShaderTypeId(prog.info.sid))
        const attribsPerVertex = prog.shaderInfo.attribsPerVertex;
    
        // For Uniforms
        if (prog.shaderInfo.attributes.colLoc >= 0) {
            console.log('   COLOR: loc:', prog.shaderInfo.attributes.colLoc,
                ' count:', V_COL_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.colOffset)
        }
        if (prog.shaderInfo.attributes.posLoc >= 0) {
            console.log('   POS: loc:', prog.shaderInfo.attributes.posLoc,
                ' count:', V_POS_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.posOffset)
        }
        if (prog.shaderInfo.attributes.scaleLoc >= 0) {
            console.log('   SCALE: loc:', prog.shaderInfo.attributes.scaleLoc,
                ' count:', V_SCALE_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.scaleOffset)
        }
        if (prog.shaderInfo.attributes.texLoc >= 0) {
            console.log('   TEX: loc:', prog.shaderInfo.attributes.texLoc,
                ' count:', V_TEX_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.texOffset)
        }
        if (prog.shaderInfo.attributes.wposLoc >= 0) {
            console.log('   WPOS: loc:', prog.shaderInfo.attributes.wposLoc,
                ' count:', V_WPOS_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.wposOffset)
        }
        if (prog.shaderInfo.attributes.roundLoc >= 0) {
            console.log('   RADIUS: loc:', prog.shaderInfo.attributes.roundLoc,
                ' count:', V_ROUND_CORNER_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.roundOffset)
        }
        if (prog.shaderInfo.attributes.borderLoc >= 0) {
            console.log('   BORDER: loc:', prog.shaderInfo.attributes.borderLoc,
                ' count:', V_BORDER_WIDTH_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.borderOffset)
        }
        if (prog.shaderInfo.attributes.featherLoc >= 0) {
            console.log('   FEATHER: loc:', prog.shaderInfo.attributes.featherLoc,
                ' count:', V_BORDER_FEATHER_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.featherOffset)
        }
        if (prog.shaderInfo.attributes.timeLoc >= 0) {
            console.log('   TIME: loc:', prog.shaderInfo.attributes.timeLoc,
                ' count:', V_TIME_COUNT, ' stride:', attribsPerVertex, 
                ' offset:', prog.shaderInfo.timeOffset)
        }
    
        console.log('\n')
        console.log('\nGL Enable Uniforms:')
    
        if (prog.shaderInfo.uniforms.orthoProj) {
            console.log('   Orthographic Projection: ', prog.shaderInfo.uniforms.orthoProj)
        }
        if (prog.shaderInfo.uniforms.sampler) {
            console.log('   Texture Sampler: ', prog.shaderInfo.uniforms.sampler)
        }
        // if (prog.shaderInfo.uniforms.winDim) {
        //     console.log('   Window Dimentions: ', prog.shaderInfo.uniforms.winDim)
        // }
        if (prog.shaderInfo.uniforms.paramsBufferLoc) {
            console.log('   Sdf Font Params: ', prog.shaderInfo.uniforms.paramsBufferLoc)
        }

    }

    console.log('\n\n')
}

/**
 * 
 * @param {*} prog 
 * @param {*} idx 
 */
export function PrintProgram(prog, idx){
    if(!GL_DEBUG_PROGRAM) return;
    console.log('-[Gl Program]-\nProgram index:', idx, ' program:', prog, ' sid:', GetShaderTypeId(prog.info.sid))
}


/**
 * 
 * @param {*} prog 
 * @param {*} idx 
 */
export function PrintShaderInfo(prog){
    if(!GL_DEBUG_SHADER_INFO) return;
    console.log('-[Gl Shader Info]-\n', prog.shaderInfo, ' sid:', GetShaderTypeId(prog.info.sid))
}
export function PrintVertexBuffer(vb){
    if(!GL_DEBUG_VERTEX_BUFFER) return;
    console.log('-[Gl Vertex Buffer]-\n', vb)
}
export function PrintVertexBufferAll(){
    if(!GL_DEBUG_VERTEX_BUFFER) return;
    
    const progs = g_glPrograms;
    for(let i=0; i<progs.length; i++){

        console.log('-[Gl Vertex Buffer]-')
        console.log( i, ': ', progs[i].vertexBuffer)
    }
}
export function PrintIndexBuffer(ib){
    if(!GL_DEBUG_INDEX_BUFFER) return;
    console.log('-[Gl Index Buffer]-\n', ib)
}
export function PrintIndexBufferAll(){
    if(!GL_DEBUG_INDEX_BUFFER) return;
    
    const progs = g_glPrograms;
    for(let i=0; i<progs.length; i++){
        
        console.log('-[Gl Index Buffer]-\n ', i, ': ', progs[i].ib)
    }
}
export function PrintBuffersAll(){
    if(!GL_DEBUG_BUFFERS_ALL) return;
    
    console.log('-[Gl Print All GL Buffers]-')
    const progs = g_glPrograms;
    for(let i=0; i<progs.length; i++){
        
        for(let j=0; j<progs[i].vertexBuffer.length; j++){
            console.log('   progIdx:', i, ' vbIdx:', j, ': ', progs[i].vertexBuffer[j])
            console.log('   progIdx:', i, ' ibIdx:', j, ': ', progs[i].indexBuffer[j])
        }
    }
}

