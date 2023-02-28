"use strict";
import { GlAddMesh } from '../../Graphics/GlBuffers.js'
import { Mesh } from '../../Engine/Drawables/Mesh.js'
import { BallBrickCollision } from './Ball.js';
import { GlSetColor, GlSetColorAlpha, GlSetDim, GlSetWpos } from '../../Graphics/GlBufferOps.js';
import { GlSetAttrRoundCorner, GlSetAttrBorderWidth, GlSetAttrBorderFeather } from '../../Graphics/GlBufferOps.js';
import { ExplosionsCreateExplosion } from '../../Engine/Events/Explosions.js';
import { ParticlesCreateParticleSystem } from '../../Engine/ParticlesSystem/Particles.js';
import { ScenesLoadScene } from '../Scenes.js';
import { OnStageCompleted } from '../../Engine/Events/SceneEvents.js';


class Brick {
    
        sid = 0;
    
        mesh = null;
        gfxInfo = null;
    
        active = false;

    constructor(sid, col, dim, scale, tex, pos, style) {
        this.sid = sid;
        this.mesh = new Mesh(col, dim, scale, tex, pos, style, null);
    }

    SetPos(pos){
        this.mesh.pos[0] = pos[0]; // Must assign each value explicitly so js does not create a ref to pos
        this.mesh.pos[1] = pos[1]; // Must assign each value explicitly so js does not create a ref to pos
        this.mesh.pos[2] = pos[2]; // Must assign each value explicitly so js does not create a ref to pos
        GlSetWpos(this.gfxInfo, pos);
    }
    SetDim(dim){
        this.mesh.dim[0] = dim[0];
        this.mesh.dim[1] = dim[1];
        GlSetDim(this.gfxInfo, dim);
    }
    SetColor(col){
        this.mesh.col[0] = col[0];
        this.mesh.col[1] = col[1];
        this.mesh.col[2] = col[2];
        this.mesh.col[3] = col[3];
        GlSetColor(this.gfxInfo, col);
    }
    SetColorAlpha(alpha){
        this.mesh.col[3] = alpha;
        GlSetColorAlpha(this.gfxInfo, alpha);
    }
};

class Bricks {

    brick = [];
    count = 0;
    size = 0;

    Init(sceneIdx, count){
        const pos = [0, 0, 0];
        const dim = [28, 16];
        const style = { roundCorner: 8.0, border: 2.8, feather: 1.4, };
        const sid = SID_DEFAULT;
        for (let i = 0; i < count; i++) {
            this.brick[i] = new Brick(sid, TRANSPARENT, dim, [1.0, 1.0], null, pos, style);
            this.brick[i].gfxInfo = GlAddMesh(this.brick[i].sid, this.brick[i].mesh, 1, sceneIdx, 'Bricks', 
                                                DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
            this.brick[i].active = false;
            this.size++;
        }
    }
    GetNextFree(){
        const len = this.brick.length;
        for (let i = 0; i < len; i++) {
            if(!this.brick[i].active){
                return this.brick[i];
            }
        }
        return null;
    }
    DimColor(){
        const len = this.brick.length;
        for(let i=0; i<len; i++){
            const col = DimColor(this.brick[i].mesh.col);
            GlSetColor(this.brick.gfxInfo, col)
            this.brick[i].mesh.col = col;
        }
    }
}

const bricks = new Bricks;
let destructionParticles = null;


export function BrickGetBricksBuffer() {
    return bricks.brick;
}
export function BrickOnUpdate() {
    BrickUpdateParticles();

    // Stage completed
    if (g_state.game.stageCompleted) {
        // ScenesStageCompleted();
        OnStageCompleted();
    }
}
export function BrickInit(sceneIdx, count) {
    
    // Initialize Bricks buffer
    bricks.Init(sceneIdx, count);
    // Initialize Particles
    BrickCreateParticleSystem(sceneIdx);

    return bricks.brick;
}
export function BrickCreateBrick(pos, dim) {
    const br = bricks.GetNextFree();
    br.SetPos(pos);
    br.SetDim(dim);
    br.SetColor(ORANGE_230_148_0);
    br.active = true;
    bricks.count++;

    // TODO: It might not belong here. Put some place else
    // If there is at least one brick and the game is in a state of 'stageComleted' then set 'NOT in state:stageCompleted' 
    if(g_state.game.stageCompleted)
        g_state.game.stageComleted = false;

    return br;
}
export function BrickBallCollision() {

    for (let i = 0; i < bricks.size; i++) {

        if (bricks.brick[i].active) {

            if (BallBrickCollision(bricks.brick[i].mesh.pos, bricks.brick[i].mesh.dim[0], bricks.brick[i].mesh.dim[1])){
                bricks.brick[i].SetColorAlpha(0.0);
                bricks.brick[i].active = false;
                bricks.count--;
                // Set active the program that draws the explosions
                ExplosionsCreateExplosion(bricks.brick[i].mesh.pos);
                BrickCreateParticles(i);

                // If this is the last breaked brick of the stage,
                // Set global state  'Stage completed'
                if (bricks.count <= 0) {
                    // ScenesStageCompleted();
                    g_state.game.stageCompleted = true;
                }
            }
        }
    }

}
export function BrickSetRoundCorner(roundnes) {

    for (let i = 0; i < bricks.brick.length; i++) {

        GlSetAttrRoundCorner(bricks.brick[i].gfxInfo, roundnes);
    }
}
export function BrickSetBorderWidth(width) {

    for (let i = 0; i < bricks.brick.length; i++) {

        GlSetAttrBorderWidth(bricks.brick[i].gfxInfo, width);
    }
}
export function BrickSetBorderFeather(feather) {

    for (let i = 0; i < bricks.brick.length; i++) {

        GlSetAttrBorderFeather(bricks.brick[i].gfxInfo, feather);
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Brick's destruction particles
 */
export function BrickCreateParticleSystem(sceneIdx) {
    const meshAttr = {
        sid: SID_EXPLOSION2,
        col: GREEN,
        // pos: [Viewport.bottom+100,0,5],
        pos: [10000, 0, 5],
        dim: [28 / 2, 16 / 2],
        scale: [1, 1],
        time: 0,
        style: null,
    };
    const timerAttr = {
        step: 0.01,
        duration: 1.0,
    }
    const numParticles = 30;
    destructionParticles = ParticlesCreateParticleSystem(meshAttr, timerAttr, numParticles, sceneIdx, 'Brick Destruction');
    return destructionParticles;
}

export function BrickCreateParticles(idx) {
    let step = 10;
    const pos = [
        [bricks.brick[idx].mesh.pos[0] - 14., bricks.brick[idx].mesh.pos[1] + 8.],
        [bricks.brick[idx].mesh.pos[0] + 14., bricks.brick[idx].mesh.pos[1] + 8.],
        [bricks.brick[idx].mesh.pos[0] - 14., bricks.brick[idx].mesh.pos[1] - 8.],
        [bricks.brick[idx].mesh.pos[0] + 14., bricks.brick[idx].mesh.pos[1] - 8.],
    ];
    const ballDir = { x: BALL.DIR.X, y: BALL.DIR.Y };
    for (let i = 0; i < 4; i++) {
        destructionParticles.Create(pos[i][0], pos[i][1], ballDir);
        step += step;
    }
}
function BrickUpdateParticles() {
    // let seed = 0.3298745; 
    let seed = Math.random();
    const gravity = 10.0;
    let side = .3;
    for (let i = 0; i < destructionParticles.count; i++) {
        const ballDir = destructionParticles.buffer[i].dir;

        if (destructionParticles.buffer[i].isAlive) {
            const t = destructionParticles.GetTime(i);
            // seed += 1.-(Math.atan((i)*2));
            // seed += (Math.atan(seed*5));
            seed += (Math.atan(t * 4 * (i + 1) * .5));
            side *= -1;
            // const tPos = [(Math.cos(seed))*side+ballDir.x+t, Math.sin(seed)*(ballDir.y+t)];
            const tPos = [(Math.cos(seed)) * side + ballDir.x + t, Math.atan(seed) * (ballDir.y + t)];
            tPos[1] = (gravity * t * t) + (tPos[1] * t) + t;
            // tPos[1] = (gravity*t*t);

            // destructionParticles.Move(i, tPos[0]+side, tPos[1]-0.9);
            destructionParticles.Move(i, tPos[0], tPos[1] - .9);
        }
    }
    // console.log('------------------------')
    destructionParticles.Update();
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local Functions
 */


