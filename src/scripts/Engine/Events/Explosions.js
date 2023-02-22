"use strict";

import { GlAddMesh } from "../../Graphics/GlBuffers.js";
import { RectCreateRect } from "../Drawables/Rect.js";
import { TimersCreateTimer } from "../Timer/Timer.js";
import { GlSetAttrTime, GlSetColor, GlSetColorAlpha, GlSetWpos } from "../../Graphics/GlBufferOps.js";


const MAX_EXPLOSIONS = 100;
const EXPLOSIONS_DIM = [80, 110];




class Explosion{

    gfxInfo  = null;
    timer    = null;
    isActive = false;

};

class Explosions{

    buffer = [];
    maxSize = MAX_EXPLOSIONS;
    curSize = 0;
    count = 0;

    GetfirstAvaliable(){

    }

    Create(){

        const idx = this.GetFreeElem(); 
        this.buffer[idx].isActive = true; 
        this.curSize++;
        this.count++;
        // console.log('Storing explosion to buffer index:', idx)
        return this.buffer[idx];
    }

    Clear(idx){
        this.buffer[idx].isActive = false;
        this.count--;
        
        // Shift the elements of the buffer so that we can reuse the buffer
        if(this.curSize !== this.count){
            // Sort(); // TODO: Implement
        }
        // Decrement curren total size only if the explosion is the last one in the buffer
        if(this.curSize === idx){
            this.curSize--;
            // console.log('curSize = ', curSize)
        }
    }

    Init(){
        for(let i=0; i<this.maxSize; i++){
            
            this.buffer[i] = new Explosion;

            // Reserve  shader
            // Create a dummy explosion to initialize the Gfx buffers
            const ex = RectCreateRect('Explosion' + i, SID_EXPLOSION | SID.EXPLOSION_FS, WHITE, EXPLOSIONS_DIM, [1,1], null, [OUT_OF_VIEW, 0, 5], null, 0);
            ex.gfxInfo = GlAddMesh(ex.sid, ex.mesh, 1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
            this.buffer[i].gfxInfo = ex.gfxInfo;
        }
    }

    GetFreeElem(){
        for(let i=0; i<MAX_EXPLOSIONS; i++){
            if(!this.buffer[i].isActive)
                return i;
        }
        alert('No more space in buffer to create an explosion. Explosions.js');
    }
}

const explosions = new Explosions;
export function ExplosionsGet(){
    return explosions;
}

// Reserve to a buffer all explosions that can be render at one time(until animation expires).
export function ExplosionsInit(){
    explosions.Init(); 
}

export function ExplosionsCreateExplosion(pos){

    const explosion = explosions.Create();
    // const explosion = explosions.GetfirstAvaliable();

    const duration = 1.;
    const step = .01;
    const timer = TimersCreateTimer(step, duration, step);
    explosion.timer = timer;

    GlSetColor(explosion.gfxInfo, BLUER3);
    GlSetWpos(explosion.gfxInfo, pos);
    GlSetAttrTime(explosion.gfxInfo, timer.t);

}

export function ExplosionsUpdate(){
    
    for(let i=0; i<explosions.curSize; i++){
        
        if(explosions.buffer[i].isActive){ // TODO: Find a bbetter way of checking if the timer has bbeen initialized
            if(explosions.buffer[i].timer.isActive)
                GlSetAttrTime(explosions.buffer[i].gfxInfo, explosions.buffer[i].timer.t); // Update the time attribute, for the shader animation
            else if(!explosions.buffer[i].timer.isActive){ // Timer has completed it's cycle, destroy explosion mesh
                // Stop Drawing in the vertex buffer
                GlSetColorAlpha(explosions.buffer[i].gfxInfo, 0.);
                explosions.Clear(i);
                // console.log('DELETING explosion at index:', i)
            }
        }
    }
}