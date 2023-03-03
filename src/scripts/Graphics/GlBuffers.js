import { gfxCtx }               from './I_WebGL.js'
// import { UniformsSet }  from './GlUniforms.js'
import { GfxInfoMesh }          from './I_GlProgram.js'
import * as GlOps               from './GlBufferOps.js';
import { VertexBuffer, IndexBuffer } from './I_GlProgram.js'
import { GlFrameBuffer }        from './I_GlProgram.js'

// For Debuging
import * as dbg from './Debug/GfxDebug.js'
import { GlCreateProgram } from './GfxCreateProgram.js'
import { GlCreateTexture, GlTexture, glTextures, LoadTexture, StoreGlobalTextureIndex } from './GlTextures.js';


const glReservedBuffers = [];
let glReservedBufferCount = 0;

(function GlInitReservedBuffer(){

    // Create Max 10 reserved buffers
    for(let i = 0; i < MAX_RESERVED_BUFFERS; i++){
        glReservedBuffers[i] = {
            sid: 0,
            progIdx: INT_NULL,
            vbIdx:   INT_NULL,
        };
    }
})();
function GlSetReservedBuffer(gfxInfo){

    glReservedBuffers[glReservedBufferCount].sid = gfxInfo.sid;
    glReservedBuffers[glReservedBufferCount].progIdx = gfxInfo.prog.idx; 
    glReservedBuffers[glReservedBufferCount].vbIdx = gfxInfo.vb.idx; 
    glReservedBufferCount++;
}


export function GlCreateReservedBuffer(sid, sceneIdx, vbName){

    const progs = g_glPrograms;
    const gfxInfo = new GfxInfoMesh; 

    // ProgramExists returns 0 index based program or -1 for not found
    const progIdx = ProgramExists(sid, progs);
    
    // If the program already exists, add mesh
    if (progIdx >= 0) {

        const program = progs[progIdx].program;

        
        gfxCtx.gl.useProgram(program)
        
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        * Create Vertex Buffer
        */
        const vbIdx = progs[progIdx].vertexBufferCount++; 
        progs[progIdx].vertexBuffer[vbIdx] = new VertexBuffer;  
        const vb = progs[progIdx].vertexBuffer[vbIdx];  
        vb.name = vbName; 
        vb.sceneIdx = sceneIdx; 
        vb.idx = vbIdx;
        
        const vao = gfxCtx.gl.createVertexArray();
        gfxCtx.gl.bindVertexArray(vao);
        vb.buffer = gfxCtx.gl.createBuffer();
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.buffer);
        vb.data = new Float32Array(MAX_VERTEX_BUFFER_COUNT);
        vb.needsUpdate = true;
        vb.vao = vao;
        // Must initialize attribute locations of the shader for every newly created program
        GlEnableAttribsLocations(gfxCtx.gl, progs[progIdx]);
        console.log('===== VertexBuffer =====\nvbIdx:', vbIdx, 'progIdx:',  progIdx);


        // Cash values
        const vertsPerRect = progs[progIdx].shaderInfo.verticesPerRect;
        const attribsPerVertex = progs[progIdx].shaderInfo.attribsPerVertex;

        const start = vb.count; // Add meshes to the vb continuously
        
        // Set meshes gfx info
        gfxInfo.vao              = vb.vao;
        gfxInfo.numFaces         = 0;
        gfxInfo.vertsPerRect     = vertsPerRect;
        gfxInfo.attribsPerVertex = attribsPerVertex;
        gfxInfo.prog.idx         = progIdx;
        gfxInfo.vb.idx           = vbIdx;
        gfxInfo.vb.buffer        = vb.buffer;
        gfxInfo.vb.start         = start;
        gfxInfo.vb.count         = 0;
        gfxInfo.sceneIdx         = sceneIdx;
        gfxInfo.sid              = sid;

        progs[progIdx].isActive = true; // Sets a program to 'active', only if there are meshes in the program's vb

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Add Mesh to Index Buffer
         * TODO: Put this some place else, but keep  CreateIndices() here
         */
        if (sid & SID.INDEXED || ((sid & SID.INDEXED) && addNewGlBuffer)) {

            const ibIdx = progs[progIdx].indexBufferCount++;
            progs[progIdx].indexBuffer[vbIdx] = new IndexBuffer;
            const ib = progs[progIdx].indexBuffer[vbIdx];
            ib.name = dbg.GetShaderTypeId(sid);
            ib.sceneIdx = sceneIdx;
            ib.buffer = gfxCtx.gl.createBuffer();
            gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ib.buffer);
            ib.data = new Uint16Array(MAX_INDEX_BUFFER_COUNT);
            ib.vao = vb.vao;
            ib.count = 0;
            console.log('----- VertexBuffer -----\nibIdx:', ibIdx, 'progIdx:',  progIdx)

            // Set meshes gfx info
            gfxInfo.ib.idx = ibIdx;
            gfxInfo.ib.buffer = ib.buffer;
            gfxInfo.ib.start = start;
            gfxInfo.ib.count = 0;
        }


        // Update viewport for the curent program
        progs[progIdx].CameraUpdate(gfxCtx.gl);
        
    } else { // Else create new program
        // alert('Gl Program Does not Exist!. See: GlBuffers.js');
    }
    // dbg.PrintAttributes(gfxCtx.gl, progs[progIdx]);

    GlSetReservedBuffer(gfxInfo);

    return gfxInfo;
}

export function GlAddMesh(sid, mesh, numFaces, sceneIdx, meshName, addNewGlBuffer, addToSpecificGlBuffer) {
    
    const progs = g_glPrograms;
    const gfxInfo = new GfxInfoMesh; 

    // ProgramExists returns 0 index based program or -1 for not found
    let progIdx = ProgramExists(sid, progs);
    
    // If the program already exists, add mesh
    if (progIdx === INT_NULL) { // Else create new program
        progIdx = GlCreateProgram(sid);
    }
    
    // const program = progs[progIdx].program;
    gfxCtx.gl.useProgram(progs[progIdx].program)
    
    let vbIdx = INT_NULL;
    if(addToSpecificGlBuffer !== INT_NULL)
        vbIdx = addToSpecificGlBuffer;
    else
        vbIdx = VertexBufferExists(sceneIdx, progs[progIdx])
    let vb = null;
    let ib = null;
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Add Mesh to Vertex Buffer
    */
    if (vbIdx < 0 || addNewGlBuffer) { // Create gl buffer
        
            vbIdx = progs[progIdx].vertexBufferCount++; 
            progs[progIdx].vertexBuffer[vbIdx] = new VertexBuffer;  
            vb = progs[progIdx].vertexBuffer[vbIdx];  
            vb.debug.sidName = dbg.GetShaderTypeId(sid); 
            vb.sceneIdx = sceneIdx; 
            vb.idx = vbIdx;
            
            const vao = gfxCtx.gl.createVertexArray();
            gfxCtx.gl.bindVertexArray(vao);
            vb.buffer = gfxCtx.gl.createBuffer();
            gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.buffer);
            vb.data = new Float32Array(MAX_VERTEX_BUFFER_COUNT);
            vb.needsUpdate = true;
            vb.vao = vao;

            // Must initialize attribute locations of the shader for every newly created program
            GlEnableAttribsLocations(gfxCtx.gl, progs[progIdx]);
            if(dbg.GL_DEBUG_BUFFERS_ALL) console.log('===== VertexBuffer =====\nvbIdx:', vbIdx, 'progIdx:',  progIdx);

    }
    else{
        vb = progs[progIdx].vertexBuffer[vbIdx]; 
        gfxCtx.gl.bindVertexArray(vb.vao) // TODO: bindVertexArray() is called twice
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.buffer) 
    }

    AddUnique(vb.debug.meshesNames, meshName); 

    // Cash values
    const vertsPerRect = progs[progIdx].shaderInfo.verticesPerRect;
    const attribsPerVertex = progs[progIdx].shaderInfo.attribsPerVertex;
    const start = vb.count; // Add meshes to the vb continuously
    const count = numFaces * vertsPerRect * attribsPerVertex; // Total attributes to add
    
    // Set meshes gfx info
    gfxInfo.vao              = vb.vao;
    gfxInfo.numFaces         = numFaces;
    gfxInfo.vertsPerRect     = vertsPerRect;
    gfxInfo.attribsPerVertex = attribsPerVertex;
    gfxInfo.prog.idx         = progIdx;
    gfxInfo.vb.idx           = vbIdx;
    gfxInfo.vb.buffer        = vb.buffer;
    gfxInfo.vb.start         = start;
    gfxInfo.vb.count         = count;
    gfxInfo.sceneIdx         = sceneIdx;
    gfxInfo.sid              = sid;


    if (sid & SID.ATTR_COL4) { // Add Color, if the program has such an attribute
        GlOps.VbSetAttribCol(vb, start+ progs[progIdx].shaderInfo.colOffset, 
            count, attribsPerVertex - V_COL_COUNT, mesh.col);
    }
    if (sid & SID.ATTR_POS2) { // Add Position, if the program has such an attribute 
        GlOps.VbSetAttribPos(vb, start + progs[progIdx].shaderInfo.posOffset, 
            count, attribsPerVertex - V_POS_COUNT, mesh.dim);
    }
    if (sid & SID.ATTR_SCALE2) { // Add Scale, if the program has such an attribute 
        GlOps.VbSetAttribScale(vb, start + progs[progIdx].shaderInfo.scaleOffset, 
            count, attribsPerVertex - V_SCALE_COUNT, mesh.scale);
    }
    if (sid & SID.ATTR_TEX2) { // Add Texture, if the program has such an attribute 
        GlOps.VbSetAttribTex(vb, start + progs[progIdx].shaderInfo.texOffset, 
            count, attribsPerVertex - V_TEX_COUNT, mesh.tex);
    }
    if (sid & SID.ATTR_WPOS3) { // Add World Position, if the program has such an attribute 
        GlOps.VbSetAttribWpos(vb, start + progs[progIdx].shaderInfo.wposOffset, 
            count, attribsPerVertex - V_WPOS_COUNT, mesh.pos);
    }
    if (sid & SID.ATTR_SDF_PARAMS) { // The parameters for the rendering of SDF text
        GlOps.VbSetAttrSdfParams(vb, start + progs[progIdx].shaderInfo.sdfParamsOffset, 
            count, attribsPerVertex - V_SDF_PARAMS_COUNT, mesh.sdfParams)
    }
    if (sid & SID.ATTR_ROUND_CORNERS) { // Mesh round corners
        GlOps.VbSetAttrRoundCorner(vb, start + progs[progIdx].shaderInfo.roundOffset, 
            count, attribsPerVertex - V_ROUND_CORNER_COUNT, mesh.roundCorner)
    }
    if (sid & SID.ATTR_BORDER_WIDTH) { // Mesh border
        GlOps.VbSetAttrBorderWidth(vb, start + progs[progIdx].shaderInfo.borderOffset, 
            count, attribsPerVertex - V_BORDER_WIDTH_COUNT, mesh.border);
    }
    if (sid & SID.ATTR_BORDER_FEATHER) { // Mesh border feather 
        GlOps.VbSetAttrBorderFeather(vb, start + progs[progIdx].shaderInfo.featherOffset, 
            count, attribsPerVertex - V_BORDER_FEATHER_COUNT, mesh.feather);
    }
    if (sid & SID.ATTR_TIME) { // Timer for qnimations  
        GlOps.VbSetAttrTime(vb, start + progs[progIdx].shaderInfo.timeOffset, 
            count, attribsPerVertex - V_TIME_COUNT, mesh.time);
    }



    vb.needsUpdate = true; // Make sure that we update GL bufferData after adding a mesh.
    progs[progIdx].isActive = true; // Sets a program to 'active', only if there are meshes in the program's vb
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Add Mesh to Index Buffer
     * TODO: Pt this some place else, but keep  CreateIndices() here
     */
    if (sid & SID.INDEXED || ((sid & SID.INDEXED) && addNewGlBuffer)) {
        let ibIdx = INT_NULL;
        if(addToSpecificGlBuffer !== INT_NULL)
            ibIdx = addToSpecificGlBuffer;
        else
            ibIdx = IndexBufferExists(sceneIdx, progs[progIdx]);
        if (ibIdx < 0 || addNewGlBuffer) {

                ibIdx = progs[progIdx].indexBufferCount++;
                progs[progIdx].indexBuffer[vbIdx] = new IndexBuffer;
                ib = progs[progIdx].indexBuffer[vbIdx];
                ib.name = dbg.GetShaderTypeId(sid);
                ib.sceneIdx = sceneIdx;

                ib.buffer = gfxCtx.gl.createBuffer();
                gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ib.buffer);
                ib.data = new Uint16Array(MAX_INDEX_BUFFER_COUNT);
                ib.vao = vb.vao;
                if(dbg.GL_DEBUG_BUFFERS_ALL) console.log('----- VertexBuffer -----\nibIdx:', ibIdx, 'progIdx:',  progIdx)
        }
        else {
                ib = progs[progIdx].indexBuffer[ibIdx];
        }
        CreateIndices(ib, numFaces);
        // Set meshes gfx info
        gfxInfo.ib.idx = ibIdx;
        gfxInfo.ib.buffer = ib.buffer;
        gfxInfo.ib.start = start;
        gfxInfo.ib.count = numFaces * INDICES_PER_RECT;
    }

    // Update viewport for the curent program
    progs[progIdx].CameraUpdate(gfxCtx.gl);
        
    // dbg.PrintAttributes(gfxCtx.gl, progs[progIdx]);

    return gfxInfo;
}

/**
 * Update index and vertex buffers.
 * When meshes are added to the local buffers, we must inform GL to update to the changed buffers. 
 */
export function GlUpdateVertexBufferData(gl, buffer){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW, 0);
    buffer.needsUpdate = false;
}
export function GlUpdateIndexBufferData(gl, buffer){
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW, 0);
    buffer.needsUpdate = false;
}

/**
 * When a mesh is to be drawn, we check to see, if a program that
 * satisfies that meshe's data, already exists. 
 * If exists, we return the program's index, else -1 for false
 * 
 * @param {*} sid : The Shader Type Id
 * @param {*} progs : The array of all GL programs
 * @returns : 0-n: true or -1:false
 */
function ProgramExists(sid, progs) {

    for (let i = 0; i < progs.length; i++) {
        if (sid === progs[i].info.sid)
            return i;

    }
    return -1;
}

/**
 * 
 * @param {*} sceneIdx : The id for the scene the Vertex Buffer belongs to.
 * @param {*} prog : WebGl program
 * @returns 
 */
function VertexBufferExists(sceneIdx, prog) {

    for (let i = 0; i < prog.vertexBufferCount; i++) {
        if (sceneIdx === prog.vertexBuffer[i].sceneIdx)
            return i;

    }
    return -1;
}
function IndexBufferExists(sceneIdx, prog) {

    for (let i = 0; i < prog.indexBufferCount; i++) {
        if (sceneIdx === prog.indexBuffer[i].sceneIdx)
            return i;

    }
    return -1;
}

// TODO: the scene id must be a unique hex for bit masking, so we can & it with programs many scene ids.
export function GfxSetVbShowFromSceneId(sceneIdx, flag){

    const progs = g_glPrograms;

    for (let i = 0; i < progs.length; i++) {
        for (let j = 0; j < progs[i].vertexBufferCount; j++) {
            if (sceneIdx === progs[i].vertexBuffer[j].sceneIdx){
                progs[i].vertexBuffer[j].show = flag;
                progs[i].indexBuffer[j].show  = flag;
            }
        }
    }
}

export function GfxSetVbShow(progIdx, vbIdx, flag){

    const progs = g_glPrograms;

    progs[progIdx].vertexBuffer[vbIdx].show = flag;
    progs[progIdx].indexBuffer[vbIdx].show  = flag;
}

function CreateIndices(ib, numFaces) {

    const offset = 4;
    let k = ib.vCount;

    for (let i = 0; i < numFaces; ++i) {

        for (let j = 0; j < 2; j++) {

            ib.data[ib.count++] = k + j;
            ib.data[ib.count++] = k + j + 1;
            ib.data[ib.count++] = k + j + 2;
        }

        k += offset;
        ib.vCount += offset;
    }

    // ib.count = index;
    ib.needsUpdate = true; // Make sure that we update GL bufferData 
}


/**
 * Enabling Attribute locations for a program
 * and
 * Setting the attribute's offsets, types and sizes. 
 * 
 * @param {*} gl : Gl context
 * @param {*} prog : The program to which we set enable the attribute locations
 */
function GlEnableAttribsLocations(gl, prog) {

    const attribsPerVertex = prog.shaderInfo.attribsPerVertex;
    // For Uniforms
    if (prog.shaderInfo.attributes.colLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.colLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.colLoc,
            V_COL_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.colOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.posLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.posLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.posLoc,
            V_POS_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.posOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.scaleLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.scaleLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.scaleLoc,
            V_SCALE_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.scaleOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.texLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.texLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.texLoc,
            V_TEX_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.texOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.wposLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.wposLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.wposLoc,
            V_WPOS_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.wposOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.roundLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.roundLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.roundLoc,
            V_ROUND_CORNER_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.roundOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.borderLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.borderLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.borderLoc,
            V_ROUND_CORNER_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.borderOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.featherLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.featherLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.featherLoc,
            V_ROUND_CORNER_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.featherOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.timeLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.timeLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.timeLoc,
            V_TIME_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.timeOffset * FLOAT);
    }
    if (prog.shaderInfo.attributes.sdfParamsLoc >= 0) {
        gl.enableVertexAttribArray(prog.shaderInfo.attributes.sdfParamsLoc);
        gl.vertexAttribPointer(prog.shaderInfo.attributes.sdfParamsLoc,
            V_SDF_PARAMS_COUNT, gl.FLOAT, false, attribsPerVertex * FLOAT, prog.shaderInfo.sdfParamsOffset * FLOAT);
    }


}


export function GlCreateFrameBuffer(gl){

    
    /************************************
     * Create the texture thst Gl will render to
     */
    const texture = GlCreateTexture('FrameBufferTexture0', gl, null);


    /************************************
     * Render Buffer
    */
       const depthBuffer = gl.createRenderbuffer();
       gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
       gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
       gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture.width, texture.height);
   
   
   /************************************
    * Frame Buffer
    */
    const fb = gl.createFramebuffer();
    if(!fb){ alert('Could not create FrameBuffer.') }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, texture.tex, texture.level);
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.tex, texture.level);


    /*********************************
     * Render Buffer again
     */
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    GlFrameBuffer.buffer    = fb;
    GlFrameBuffer.tex       = texture.tex;
    GlFrameBuffer.texId     = texture.texId;
    GlFrameBuffer.texIdx    = texture.idx;
    GlFrameBuffer.texWidth  = texture.width;
    GlFrameBuffer.texHeight = texture.height;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER, null);
    if(e !== gl.FRAMEBUFFER_COMPLETE){
        alert('FrameBBbuffer is not Complete')
    }

    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return GlFrameBuffer;
}



// Helpers
function AddUnique(strArr, str){
    for(let i=0; i<strArr.length; i++){
        if(strArr[i] === str){
            return;
        }
    }
    //Else if the string does not exist, add it
    strArr.push(str);
}