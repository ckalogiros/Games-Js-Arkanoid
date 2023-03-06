"use strict";
import { GlAddMesh } from '../../Graphics/GlBuffers.js'
import { Mesh } from '../../Engine/Drawables/Mesh.js'
import { BallBrickCollision } from './Ball.js';
import { GlSetColor, GlSetColorAlpha} from '../../Graphics/GlBufferOps.js';
import { GlSetAttrRoundCorner, GlSetAttrBorderWidth, GlSetAttrBorderFeather } from '../../Graphics/GlBufferOps.js';
import { ExplosionsCreateExplosion } from '../../Engine/Explosions.js';
import { ParticlesCreateParticleSystem } from '../../Engine/ParticlesSystem/Particles.js';
import { OnStageCompleted } from '../../Engine/Events/SceneEvents.js';
import { AnimationsGet } from '../../Engine/Animations/Animations.js';
import { Rect } from '../../Engine/Drawables/Rect.js';


class Brick extends Rect{
    // mesh = null;
    // gfxInfo = null;
    
    sid = 0;
    isActive = false;

    inAnimation = false;
    animation = {
        scaleFactor: 1,
        inUpScale: false,
    };

    constructor(sid, col, dim, scale, tex, pos, style) {
        super('Brick', sid, col, dim, scale, tex, pos, style, null);
        this.sid = sid;
        // this.mesh = new Mesh(col, dim, scale, tex, pos, style, null, null);
    }

    Destroy(){
        this.mesh.col[3] = 0.0;
        GlSetColorAlpha(this.gfxInfo, 0.0);
        this.isActive = false;
    }

};

class Bricks {

    brick = [];
    count = 0;
    size = 0;

    Init(sceneIdx, count) {
        const pos = [0, 0, 0];
        const dim = [28, 16];
        const style = { roundCorner: BRICK.ROUNDNENSS, border: BRICK.BORDER, feather: BRICK.FEATHER, };
        const sid = SID_DEFAULT;
        for (let i = 0; i < count; i++) {
            this.brick[i] = new Brick(sid, TRANSPARENT, dim, [1.0, 1.0], null, pos, style);
            this.brick[i].gfxInfo = GlAddMesh(this.brick[i].sid, this.brick[i].mesh, 1, sceneIdx, 'Bricks',
                                                DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
            this.brick[i].isActive = false;
            this.size++;
        }
    }
    GetNextFree() {
        for (let i = 0; i < this.size; i++) {
            if (!this.brick[i].isActive) {
                return this.brick[i];
            }
        }
        return null;
    }
    DimColor() {
        const len = this.brick.length;
        for (let i = 0; i < len; i++) {
            const col = DimColor(this.brick[i].mesh.col);
            GlSetColor(this.brick.gfxInfo, col)
            this.brick[i].mesh.col = col;
        }
    }
    Destroy(){
        for(let i=0; i<this.size; i++){
            if(this.brick[i].isActive){
                this.brick[i].Destroy();
                this.count--;
                if(this.count < 0) alert('Bricks Reset count is minus')
            }
        }
    }
}

const bricks = new Bricks;
let destructionParticles = null;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Getters
 */
export function BrickGetBricksBuffer() {
    return bricks.brick;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Init
 */
export function BrickInit(sceneIdx, count) {
    // Initialize Bricks array
    bricks.Init(sceneIdx, count);
    // Initialize destruction Particles
    BrickCreateParticleSystem(sceneIdx);

    return bricks.brick;
}
export function BrickCreateBrick(pos, dim) {
    const br = bricks.GetNextFree();
    br.SetPos(pos);
    br.SetDim(dim);
    br.SetColor(ORANGE_230_148_0);
    br.SetScaleFromVal(1);
    br.isActive = true;
    bricks.count++;

    // TODO: It might not belong here. Put some place else
    // If there is at least one brick and the game is in a state of 'stageComleted' then set 'NOT in state:stageCompleted' 
    if (g_state.game.stageCompleted)
        g_state.game.stageComleted = false;

    return br;
}
export function BrickReset(){
    // Destroy any active bricks
    bricks.Destroy();
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Update
 */
export function BrickOnUpdate() {
    BrickUpdateParticles();

    // Call StageCompleted() if global state: stageCompleted is set
    if (g_state.game.stageCompleted) {
        OnStageCompleted();
    }
}
export function BrickBallCollision() {

    for (let i = 0; i < bricks.size; i++) {

        if (bricks.brick[i].isActive) {

            if (BallBrickCollision(bricks.brick[i].mesh.pos, bricks.brick[i].mesh.dim[0], bricks.brick[i].mesh.dim[1])) {
                // Create brick destroy animation
                BrickDestroyAnimation(i);
                // Set active the program that draws the explosions
                ExplosionsCreateExplosion(bricks.brick[i].mesh.pos);
                BrickCreateParticles(i);
                
                bricks.brick[i].isActive = false;
                // bricks.brick[i].SetColorAlpha(0.0);
                bricks.count--;
                
                // If this is the last breaked brick of the stage,
                // Set global state  'Stage completed'
                if (bricks.count <= 0) {
                    g_state.game.stageCompleted = true;
                }
            }
        }
    }

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Particles
 */
export function BrickCreateParticleSystem(sceneIdx) {
    const meshAttr = {
        sid: SID_NOISE,
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
 * Animations
 */
export function BrickDestroyAnimation(i) {
    const animations = AnimationsGet();
    animations.Create(BrickDestroyStartAnimation, BrickStopDestroyStopAnimation, i);
    bricks.brick[i].inAnimation = true;
    bricks.brick[i].animation.inUpScale = true;
    bricks.brick[i].animation.scaleFactor = 1.015;
}
function BrickStopDestroyStopAnimation(i) {
    console.log('Stop Brick Animation')
    bricks.brick[i].SetColorAlpha(0.0);
}
function BrickDestroyStartAnimation(i) { // This is the callback to the Animations.clbk at Animations.js
    if (bricks.brick[i].mesh.scale[0] > 0.15) {
        // Scale
        const scalex = bricks.brick[i].mesh.scale[0];
        if (scalex > 1.3 && bricks.brick[i].animation.inUpScale) {
            bricks.brick[i].animation.scaleFactor = 0.9;
            bricks.brick[i].animation.inUpScale = false;
        }
        // if(!bricks.brick[i].animation.inUpScale && bricks.brick[i].animation.scaleFactor > 0.9){
        //     bricks.brick[i].animation.scaleFactor *= 0.994
        // }

        bricks.brick[i].ScaleFromVal(bricks.brick[i].animation.scaleFactor);

        return true; // Ret true if animation is not over
    }
    else return false; // Ret false if animation is completed
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Setters
 */
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
 * Local Functions
 */


