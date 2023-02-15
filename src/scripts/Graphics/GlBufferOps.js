"use strict";



/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Functions to add meshe data to the vertex buffer.
 * 
 * @param {*} vb : The vertex buffer reference
 * @param {*} start : The starting index for the mesh in the vertex buffer
 * @param {*} count : The number of vertices * number of attributes per vertex
 * @param {*} stride : The distance (in elements) from vertex to next vertex. 
 */ 

export function VbSetAttribCol(vb, start, count, stride, col) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = col[0];
        vb.data[index++] = col[1];
        vb.data[index++] = col[2];
        vb.data[index++] = col[3];

        index += stride;
        vb.count += V_COL_COUNT;
    }
}
export function VbSetAttribPos(vb, start, count, stride, dim) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = -dim[0];
        vb.data[index++] =  dim[1];
        index += stride;

        vb.data[index++] = -dim[0];
        vb.data[index++] = -dim[1];
        index += stride;

        vb.data[index++] = dim[0];
        vb.data[index++] = dim[1];
        index += stride;

        vb.data[index++] =  dim[0];
        vb.data[index++] = -dim[1];
        index += stride;

        vb.count += V_POS_COUNT * VERTS_PER_RECT_INDEXED; // TODO: Let the shaderInfo give the vertsPerRect
    }
}
export function VbSetAttribScale(vb, start, count, stride, scale) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = scale[0];
        vb.data[index++] = scale[1];

        index += stride;
        vb.count += V_SCALE_COUNT;
    }
}
export function VbSetAttribTex(vb, start, count, stride, tex) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = tex[0];
        vb.data[index++] = tex[3];
        index += stride;

        vb.data[index++] = tex[0];
        vb.data[index++] = tex[2];
        index += stride;

        vb.data[index++] = tex[1];
        vb.data[index++] = tex[3];
        index += stride;

        vb.data[index++] = tex[1];
        vb.data[index++] = tex[2];
        index += stride;

        vb.count += V_TEX_COUNT * VERTS_PER_RECT_INDEXED; // TODO: Let the shaderInfo give the vertsPerRect
    }
}
export function VbSetAttribWpos(vb, start, count, stride, pos) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = pos[0];
        vb.data[index++] = pos[1];
        vb.data[index++] = pos[2];

        index += stride;
        vb.count += V_WPOS_COUNT;
    }
}
export function VbSetAttrDecorationAll3(vb, start, count, stride, radius, border, feather) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = radius;
        vb.data[index++] = border;
        vb.data[index++] = feather;

        index += stride-2;
        vb.count += V_ROUND_CORNER_COUNT;
        vb.count += V_ROUND_CORNER_COUNT;
        vb.count += V_ROUND_CORNER_COUNT;
    }
}
export function VbSetAttrRoundCorner(vb, start, count, stride, radius) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = radius;

        index += stride;
        vb.count += V_ROUND_CORNER_COUNT;
    }
}
export function VbSetAttrBorderWidth(vb, start, count, stride, border) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = border;

        index += stride;
        vb.count += V_BORDER_WIDTH_COUNT;
    }
}
export function VbSetAttrBorderFeather(vb, start, count, stride, feather) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = feather;

        index += stride;
        vb.count += V_BORDER_FEATHER_COUNT;
    }
}
export function VbSetAttrTime(vb, start, count, stride, time) {

    let index = start;
    const end = start + count;

    while (index < end) {

        vb.data[index++] = time;

        index += stride;
        vb.count += V_TIME_COUNT;
    }
}



export function GlSetColor(gfxInfo, color){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.colOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_COL_COUNT;

    while (verts) {

        vb.data[index++] = color[0]; // Move mesh's x pos by amt
        vb.data[index++] = color[1]; // Move mesh's x pos by amt
        vb.data[index++] = color[2]; // Move mesh's x pos by amt
        vb.data[index++] = color[3]; // Move mesh's x pos by amt

        index += stride; // Go to next vertice's pos. +1 for skipping pos.z
        verts--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed 
}
export function GlSetColorAlpha(gfxInfo, val){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.colOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_COL_COUNT;

    while (verts) {

        vb.data[index++] = val; // Move mesh's x pos by amt
        vb.data[index++] = val; // Move mesh's x pos by amt
        vb.data[index++] = val; // Move mesh's x pos by amt
        vb.data[index++] = val; // Move mesh's x pos by amt

        index += stride; // Go to next vertice's pos. +1 for skipping pos.z
        verts--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed 
}
export function GlSetDim(gfxInfo, dim) {

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.posOffset;
    let faces  = gfxInfo.numFaces;
    let stride = gfxInfo.attribsPerVertex - V_POS_COUNT;


    while (faces) {

        vb.data[index++] = -dim[0];
        vb.data[index++] =  dim[1];
        index += stride;

        vb.data[index++] = -dim[0];
        vb.data[index++] = -dim[1];
        index += stride;

        vb.data[index++] = dim[0];
        vb.data[index++] = dim[1];
        index += stride;

        vb.data[index++] =  dim[0];
        vb.data[index++] = -dim[1];
        index += stride;

        faces--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed 
}
export function GlSetTex(gfxInfo, uvs){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.texOffset;
    let numTimes  = gfxInfo.numFaces;
    let stride = gfxInfo.attribsPerVertex - V_TEX_COUNT;

    while (numTimes) {

        vb.data[index++] = uvs[0];
        vb.data[index++] = uvs[3];
        index += stride;

        vb.data[index++] = uvs[0];
        vb.data[index++] = uvs[2];
        index += stride;

        vb.data[index++] = uvs[1];
        vb.data[index++] = uvs[3];
        index += stride;

        vb.data[index++] = uvs[1];
        vb.data[index++] = uvs[2];
        index += stride;

        numTimes--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed 
}
export function GlScale(gfxInfo, val){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.scaleOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect; // Number of vertices
    let stride = gfxInfo.attribsPerVertex - 2; // Offset to next scale[0] attribute

    while (verts) {
        
        vb.data[index++] *= val[0]; 
        vb.data[index++] *= val[1]; 

        index += stride; // Go to next vertice's scale.
        verts--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed data.
}
export function GlSetScale(gfxInfo, val){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.scaleOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect; // Number of vertices
    let stride = gfxInfo.attribsPerVertex - 2; // Offset to next scale[0] attribute

    while (verts) {
        
        vb.data[index++] = val[0]; 
        vb.data[index++] = val[1]; 

        index += stride; // Go to next vertice's scale.
        verts--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed data.
}
export function GlMove(gfxInfo, wpos){
    
    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.wposOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_WPOS_COUNT;

    while (verts) {

        vb.data[index++] += wpos[0]; // Move mesh's x pos by amt
        vb.data[index++] += wpos[1]; // Move mesh's y pos by amt
        index++

        index += stride; // Go to next vertice's pos. +1 for skipping pos.z
        verts--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed 
}
export function GlSetWpos(gfxInfo, pos){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.wposOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_WPOS_COUNT;

    while (verts) {

        vb.data[index++] = pos[0]; // Move mesh's x pos by amt
        vb.data[index++] = pos[1]; // Move mesh's y pos by amt
        index++

        index += stride; // Go to next vertice's pos. +1 for skipping pos.z
        verts--;
    }

    vb.needsUpdate = true; // To Update vertex buffer with the changed 
}

// TODO: Same with GlSetWpos???

export function GlSetWposX(gfxInfo, posx){

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.wposOffset;
    let faces  = gfxInfo.numFaces; // Number of vertices
    let stride = gfxInfo.attribsPerVertex; // Offset to next scale[0] attribute

    while (faces) {
        
        vb.data[index] = posx; 
        index += stride; // Go to next vertice's wposx.
        vb.data[index] = posx; 
        index += stride; // Go to next vertice's wposx.
        vb.data[index] = posx; 
        index += stride; // Go to next vertice's wposx.
        vb.data[index] = posx; 
        index += stride; // Go to next vertice's wposx.

        faces--;
    }
    // console.log(vb.data)
    vb.needsUpdate = true; // To Update vertex buffer with the changed data.
}
export function GlSetAttrRoundCorner(gfxInfo, val) {

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.roundOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_ROUND_CORNER_COUNT;

    while (verts) {

        vb.data[index++] = val;

        index += stride; // Go to next vertice's borderWidth attrib.
        verts--;
    }

    vb.needsUpdate = true;
}
export function GlSetAttrBorderWidth(gfxInfo, val) {

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.borderOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_BORDER_WIDTH_COUNT;

    while (verts) {

        vb.data[index++] = val;

        index += stride; // Go to next vertice's borderWidth attrib.
        verts--;
    }

    vb.needsUpdate = true;
}
export function GlSetAttrBorderFeather(gfxInfo, val) {

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.featherOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_BORDER_FEATHER_COUNT;

    while (verts) {

        vb.data[index++] = val;

        index += stride; // Go to next vertice's borderWidth attrib.
        verts--;
    }

    vb.needsUpdate = true;
}
export function GlSetAttrTime(gfxInfo, val) {

    const progs = g_glPrograms;
    const vb = progs[gfxInfo.prog.idx].vertexBuffer[gfxInfo.vb.idx]; 

    let index  = gfxInfo.vb.start + progs[gfxInfo.prog.idx].shaderInfo.timeOffset;
    let verts  = gfxInfo.numFaces * gfxInfo.vertsPerRect;
    let stride = gfxInfo.attribsPerVertex - V_TIME_COUNT;

    while (verts) {

        vb.data[index++] = val;

        index += stride; // Go to next vertice's borderWidth attrib.
        verts--;
    }

    vb.needsUpdate = true;
}
