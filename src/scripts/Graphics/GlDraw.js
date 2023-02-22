import { gfxCtx }               from './I_WebGL.js'
import { GlGetTexture }         from './GlTextures.js';
import { GlFrameBuffer }        from './I_GlProgram.js';
// import { UniformsUpdate }       from './GlUniforms.js';
import { GlUpdateVertexBufferData, GlUpdateIndexBufferData, GfxSetVbShow } from './GlBuffers.js'

export function GlDraw() {

    const gl = gfxCtx.gl;
    const progs = g_glPrograms;

    if(GlFrameBuffer.buffer != null){
        GlRenderToFrameBuffer();
    }

    gl.viewport(0, 0, Viewport.width, Viewport.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // GfxSetVbShow(fb.progIdx, fb.vbIdx, true);
    for (let i = 0; i < progs.length; i++) {
        
        if (progs[i].isActive) {
            
            gl.useProgram(progs[i].program)
            
            if(progs[i].uniformsNeedUpdate) 
                progs[i].UniformsUpdateParamsBuffer(gl);
            
            // UniformsUpdate(i)
            // if(i==2) // HACK: TEMP for explosions uniform buffer
            // gl.uniform1fv(progs[i].shaderInfo.uniforms.positionsBufferLoc, progs[i].shaderInfo.uniforms.positionsBuffer);

            for (let j = 0; j < progs[i].vertexBuffer.length; j++) {
                
                const vb = progs[i].vertexBuffer[j];
                const ib = progs[i].indexBuffer[j];
                
                if(vb.show){
                    
                    gl.bindVertexArray(ib.vao);

                    // if(progs[i].info.sid & SID.ATTR_TEX2 && Texture.boundTexture !== vb.texIdx){
                    if(progs[i].info.sid & SID.ATTR_TEX2 ){
                        if(vb.texIdx >= 0){
                            const texture = GlGetTexture(vb.texIdx);
                            gl.activeTexture(texture.texId);
                            gl.bindTexture(gl.TEXTURE_2D, texture.tex);
                            gl.uniform1i(progs[i].shaderInfo.uniforms.sampler, texture.idx);

                            Texture.boundTexture = texture.idx;
                        }
                    }

                    if(ib.needsUpdate) 
                        GlUpdateIndexBufferData(gl, ib)
                    if(vb.needsUpdate) 
                        GlUpdateVertexBufferData(gl, vb)
    
                    gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 0);
                }
            }
        }
    }
}

export function GlRenderToFrameBuffer(){

    const gl = gfxCtx.gl;
    const progs = g_glPrograms;
    const fb = GlFrameBuffer;    

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.buffer);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Set correct vieport
    gl.viewport(0, 0, fb.texWidth, fb.texHeight);
    
    // gl.enable(gl.BLEND);
    // gfxCtx.gl.blendFunc(gfxCtx.gl.GL_SRC_ALPHA, gfxCtx.gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    GfxSetVbShow(fb.progIdx, fb.vbIdx, false); // Disable rendering the rect that the texture of the frameBuffer will be rendered to 
    for (let i = 0; i < progs.length; i++) {
        if (progs[i].isActive) {
            
            gl.useProgram(progs[i].program);

            for (let j = 0; j < progs[i].vertexBuffer.length; j++) {

                const vb = progs[i].vertexBuffer[j];
                const ib = progs[i].indexBuffer[j];
                if(vb.show && i == 2){

                    if(progs[i].info.sid & SID.ATTR_TEX2 ){
                        if(vb.texIdx >= 0){
                            const texture = GlGetTexture(vb.texIdx);
                            gl.activeTexture(texture.texId);
                            gl.bindTexture(gl.TEXTURE_2D, texture.tex);
                            gl.uniform1i(progs[i].shaderInfo.uniforms.sampler, texture.idx);
                            
                            Texture.boundTexture = texture.idx;
                        }
                    }

                    gl.bindVertexArray(ib.vao);
                    gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 0);
                }
            }
        }
    }
    GfxSetVbShow(fb.progIdx, fb.vbIdx, true); // Enable rendering FrameBuffer's rect


    // gl.enable(gl.BLEND);
    // gfxCtx.gl.blendFunc(gfxCtx.gl.DST_ALPHA, gfxCtx.gl.ONE_MINUS_SRC_ALPHA);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(true);

}
