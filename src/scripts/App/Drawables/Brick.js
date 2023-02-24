"use strict";
import { GlAddMesh } from '../../Graphics/GlBuffers.js'
import { Mesh } from '../../Engine/Drawables/Mesh.js'
import { BallBrickCollision, BallGetDir } from './Ball.js';
import { GlSetColorAlpha } from '../../Graphics/GlBufferOps.js';
import { GlSetAttrRoundCorner, GlSetAttrBorderWidth, GlSetAttrBorderFeather } from '../../Graphics/GlBufferOps.js';
import { ExplosionsCreateExplosion } from '../../Engine/Events/Explosions.js';
import { GetRandomPos } from '../../Helpers/Helpers.js';
import { ParticlesCreateParticleSystem } from '../../Engine/ParticlesSystem/Particles.js';
import { ScenesLoadScene } from '../Scenes.js';


// Exporting is only for the class type(to compare with the instanceof operator)
export class Brick {

    constructor(sid, col, dim, scale, tex, pos, style) {
        this.sid = sid;
        this.mesh = new Mesh(col, dim, scale, tex, pos, style, null);
    }

    sid       = 0;

    mesh    = null;
    gfxInfo = null;

    active  = true;
    display = false;
};

class Bricks{

    brick = [];
    count = 0;
    size = 0;
}

const bricks = new Bricks;
let destructionParticles = null;


export function BrickGetBricksBuffer() {
    return bricks.brick;
}
export function BrickOnUpdate() {
    BrickUpdateParticles();

    // Stage completed
    if(bricks.count<=0){
        ScenesLoadScene(SCENE.startMenu);
        // StageCompleted();
    }
}
export function CreateBrick(scene, pos, dim) {

    const style = {
        roundCorner:  8.0,
        border:  2.8,
        feather: 1.4,
    };
    // const style = null;
    const sid = SID_DEFAULT;
    const br = new Brick(
        sid, 
        // YELLOW_229_206_0, 
        // GREEN_33_208_40, 
        GREEN_138_218_0, 
        // BLUE_13_125_217, 
        // GREY7, 
        dim, 
        [1.0, 1.0], 
        null, 
        pos, 
        style
    );
    br.gfxInfo = GlAddMesh(br.sid, br.mesh, 1, scene, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    bricks.brick[bricks.count++] = br;
    bricks.size++;
    return br;
}
export function BrickBallCollision() {

    for(let i = 0; i < bricks.size; i++){

        if(bricks.brick[i].active){

        if(BallBrickCollision(bricks.brick[i].mesh.pos, bricks.brick[i].mesh.dim[0], bricks.brick[i].mesh.dim[1]))
            destroyBrick(i);
        }
    }
  
}
export function BrickSetRoundCorner(roundnes){

    for(let i = 0; i < bricks.brick.length; i++){

        GlSetAttrRoundCorner(bricks.brick[i].gfxInfo, roundnes);
    }
}
export function BrickSetBorderWidth(width){

    for(let i = 0; i < bricks.brick.length; i++){

        GlSetAttrBorderWidth(bricks.brick[i].gfxInfo, width);
    }
}
export function BrickSetBorderFeather(feather){

    for(let i = 0; i < bricks.brick.length; i++){

        GlSetAttrBorderFeather(bricks.brick[i].gfxInfo, feather);
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Brick's destruction particles
 */
export function BrickCreateParticleSystem(scene){
    const meshAttr = {
        sid: SID_EXPLOSION2,
        col:GREEN,
        // pos: [Viewport.bottom+100,0,5],
        pos: [10000,0,5],
        dim:[28/2,16/2],
        scale:[1,1],
        time:0,
        style:null,
    };
    const timerAttr = {
        step: 0.01,
        duration: 1.0,
    }
    const numParticles = 30;
    destructionParticles = ParticlesCreateParticleSystem(meshAttr, timerAttr, numParticles, scene, 'Brick Destruction');
}

export function BrickCreateParticles(idx){
    let step = 10;
    const pos = [
        [bricks.brick[idx].mesh.pos[0]-14.,bricks.brick[idx].mesh.pos[1]+8.],
        [bricks.brick[idx].mesh.pos[0]+14.,bricks.brick[idx].mesh.pos[1]+8.],
        [bricks.brick[idx].mesh.pos[0]-14.,bricks.brick[idx].mesh.pos[1]-8.],
        [bricks.brick[idx].mesh.pos[0]+14.,bricks.brick[idx].mesh.pos[1]-8.],
    ];
    const ballDir = {x:BALL.DIR.X, y:BALL.DIR.Y};
    for(let i=0; i<4; i++){
        destructionParticles.Create(pos[i][0], pos[i][1], ballDir);
        step+=step;
    }
}
function BrickUpdateParticles(){
    // let seed = 0.3298745; 
    let seed = Math.random(); 
    const gravity = 10.0; 
    let side = .3;
    for(let i=0; i<destructionParticles.count; i++){
        const ballDir = destructionParticles.buffer[i].dir;
        
        if(destructionParticles.buffer[i].isAlive){
            const t =  destructionParticles.GetTime(i);
            // seed += 1.-(Math.atan((i)*2));
            // seed += (Math.atan(seed*5));
            seed += (Math.atan(t*4*(i+1)*.5));
            side *= -1;
            // const tPos = [(Math.cos(seed))*side+ballDir.x+t, Math.sin(seed)*(ballDir.y+t)];
            const tPos = [(Math.cos(seed))*side+ballDir.x+t, Math.atan(seed)*(ballDir.y+t)];
            tPos[1] = (gravity*t*t)+(tPos[1]*t)+t;
            // tPos[1] = (gravity*t*t);
    
            // destructionParticles.Move(i, tPos[0]+side, tPos[1]-0.9);
            destructionParticles.Move(i, tPos[0], tPos[1]-.9);
        }
    }
    // console.log('------------------------')
    destructionParticles.Update();
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local Functions
 */


function destroyBrick(idx){
  
    GlSetColorAlpha(bricks.brick[idx].gfxInfo, 0.0);
    bricks.brick[idx].active = false;
    bricks.count--;

    // Set active the program that draws the explosions
    ExplosionsCreateExplosion(bricks.brick[idx].mesh.pos);
    BrickCreateParticles(idx);
}
