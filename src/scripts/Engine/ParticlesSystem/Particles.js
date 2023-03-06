"use strict";

import { GlSetAttrTime, GlSetWpos } from "../../Graphics/GlBufferOps.js";
import { GlAddMesh } from "../../Graphics/GlBuffers.js";
import { Mesh } from "../Drawables/Mesh.js";
import { TimersCreateTimer } from "../Timer/Timer.js";

class Particle{
    isAlive = false;
    mesh    = null;
    gfxInfo = null;
    timer   = null;
    dir = { x:1, y:1 };
};


export class Particles{

    buffer    = []; // Buffer to store all particles.
    count     = 0;  // Particles count.
    lifeTime  = 0; // Duration of particles life.
    timerStep = 0; // The step in which the timer will increase in order to reach the end of lifeCycle.
    name = '';


    constructor(timerAttr, name){
        this.timerStep = timerAttr.step;
        this.lifeTime  = timerAttr.duration;
        this.name      = name;
    }

    Update(){
        for(let i=0; i< this.count; i++){
            if( this.buffer[i].isAlive){
                if( this.buffer[i].timer.t >=  this.buffer[i].timer.duration){
                    this.buffer[i].isAlive = false;
                    // Set the wpos far from screen view, so the dead particle does not interact.
                    // GlSetWpos(this.buffer[i].gfxInfo,     this.buffer[i].mesh.pos);
                    GlSetWpos(this.buffer[i].gfxInfo,     [Viewport.bottom+100, 0]);
                }
                else{
                    GlSetWpos(this.buffer[i].gfxInfo,     this.buffer[i].mesh.pos);
                    GlSetAttrTime(this.buffer[i].gfxInfo, this.buffer[i].timer.t);
                }    
            }
        }
    }

    Create(xpos, ypos, dir){
        const idx = this.GetNextFree();
        if(idx !== null){
            this.buffer[idx].mesh.pos[0] = xpos;
            this.buffer[idx].mesh.pos[1] = ypos;
            this.buffer[idx].timer   = TimersCreateTimer(0.01, this.lifeTime, this.timerStep);
            this.buffer[idx].isAlive = true;
            this.buffer[idx].dir = dir;
        }
    }

    SetPos(idx, xpos, ypos){
        if(xpos) this.buffer[idx].mesh.pos[0] = xpos;
        if(ypos) this.buffer[idx].mesh.pos[1] = ypos;
    }

    Move(idx, x, y){
        this.buffer[idx].mesh.pos[0] += x;
        this.buffer[idx].mesh.pos[1] += y;
    }

    GetNextFree(){
        for(let i=0; i<this.count; i++){
            if(this.buffer[i].isAlive === false){
                return i;
            }
        }
        console.log('Not enough Particles for:' + this.name)
        // alert('Not enough Particles for:' + this.name)
        return null;
    }

    GetTime(idx){
        // if(this.buffer[idx]) return this.buffer[idx].timer.t;
        // return 0.;
        return this.buffer[idx].timer.t;
    }
};
export class ParticleSystem{

    psBuffer = []; //  A buffer to store all the different particle systems
    count = 0;
    name = '';

    CreateSystem(meshAttr, timerAttr, num, scene, name){

        const idx = this.count;
        this.psBuffer[idx] = new Particles(timerAttr, name); 
        this.count++;
        this.name = name;
        
        const pos = [];

        let x = Viewport.width/2;
        let y = Viewport.bottom;
        for(let i=0; i<num; i++){
            pos[i] = new Float32Array(3);
            pos[i][0] = x;
            pos[i][1] = y;
            pos[i][2] = meshAttr.pos[2];

            this.psBuffer[idx].buffer[i] = new Particle;
            this.psBuffer[idx].buffer[i].mesh = new Mesh(meshAttr.col, meshAttr.dim, meshAttr.scale, meshAttr.tex, pos[i], meshAttr.style, meshAttr.time, null);
            this.psBuffer[idx].buffer[i].gfxInfo = GlAddMesh(meshAttr.sid, this.psBuffer[idx].buffer[i].mesh, 1, scene, 'Particles' + name, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
            this.psBuffer[idx].count++;
        }
        return this.psBuffer[idx];
    }

};

const particleSystem = new ParticleSystem;
export function ParticleSystemGet(){
    return particleSystem;
}

export function ParticlesCreateParticleSystem(meshAttr, timerAttr, num, scene, name){
    return particleSystem.CreateSystem(meshAttr, timerAttr, num, scene, name);
}


// export function ParticlesUpdate(idx){
//     // particleSystem.Update(idx);
// }

// export function ParticlesUpdate(){

//     for(let i=0; i<system.count; i++){
//         if(system.buffer[i].isAlive)
//         {
//             if(system.buffer[i].timer.t >= system.buffer[i].timer.duration){
//                 system.buffer[i].isAlive = false;
//             }
//             else{
//                 GlSetWpos(system.buffer[i].gfxInfo,  system.buffer[i].mesh.pos);
//                 GlSetAttrTime(system.buffer[i].gfxInfo,  system.buffer[i].timer.t);
//             }    
//         }
//     }
// }

// export function ParticlesCreateParticle(sysIdx){

//     const idx = GetNextFreeParticleIdx(sysIdx);
    
//     if(idx !== null)
//     {
//         const bp = BallGetPos();
//         particleSystem.psBuffer[sysIdx].buffer[idx].mesh.pos[0] = bp[0];
//         particleSystem.psBuffer[sysIdx].buffer[idx].mesh.pos[1] = bp[1];
//         particleSystem.psBuffer[sysIdx].buffer[idx].timer = TimersCreateTimer(0.01, particleSystem.psBuffer[sysIdx].lifeTime, particleSystem.psBuffer[sysIdx].timerStep);
//         particleSystem.psBuffer[sysIdx].buffer[idx].isAlive = true;
//     }
// }

// function GetNextFreeParticleIdx(sysIdx){
//     for(let i=0; i<particleSystem.psBuffer[sysIdx].count; i++){
//         if(particleSystem.psBuffer[sysIdx].buffer[i].isAlive === false){
//             return i;
//         }
//     }
//     return null;
//     // alert('No more particles to create. Particles.js');
// }

// export function ParticlesSetUniforms(val){
//     const prog = GlGetProgram(UNIFORM_PARAMS.particles.progIdx);
//     prog.UniformsSetParamsBufferValue(val, UNIFORM_PARAMS.particles.idx0);
// }
