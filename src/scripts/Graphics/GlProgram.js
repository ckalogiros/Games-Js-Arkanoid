"use strict";




export function GlGetProgram(progIdx){
    return g_glPrograms[progIdx];
}

export function GlGetVB(progIdx, vbIdx){
    return g_glPrograms[progIdx].vertexBuffer[vbIdx];
}

export function GlGetIB(progIdx, ibIdx){
    return g_glPrograms[progIdx].indexBuffer[ibIdx];
}