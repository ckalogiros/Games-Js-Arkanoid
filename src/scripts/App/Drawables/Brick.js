"use strict";
import { GlAddMesh } from '../../Graphics/GlBuffers.js'
import * as math from '../../Helpers/Math/MathOperations.js'
import { BallBrickCollision } from './Ball.js';
import { GlMove, GlSetColor, GlSetColorAlpha } from '../../Graphics/GlBufferOps.js';
import { GlSetAttrRoundCorner, GlSetAttrBorderWidth, GlSetAttrBorderFeather } from '../../Graphics/GlBufferOps.js';
import { ExplosionsCreateExplosion } from '../../Engine/Explosions.js';
import { ParticlesCreateParticleSystem } from '../../Engine/ParticlesSystem/Particles.js';
import { OnStageCompleted } from '../../Engine/Events/SceneEvents.js';
import { AnimationsGet } from '../../Engine/Animations/Animations.js';
import { Rect } from '../../Engine/Drawables/Rect.js';
import { GetSign } from '../../Helpers/Helpers.js';
import { PowerUpCreate } from './PowerUp.js';


class Brick extends Rect {
    sid = 0;
    isActive = false;

    inAnimation = false;
    animation = {
        scale:{
            active:false,
            factor:1,
        },
        push: {
            x:{
                active: false,
                maxDist:0,
                maxAmt:3,
                minAmt:-0.1,
                sign: 0,
            },
            y:{
                active: false,
                maxDist:0,
                maxAmt:3,
                minAmt:-0.1,
                sign: 0,
            },
            moveAmt: [0, 0],
            drag: 0.85,
        },
        pull: {
            x:{
                active: false,
                maxDist:0,
                maxAmt:8,
                minAmt:0,
                sign: 0,
            },
            y:{
                active: false,
                maxDist:0,
                maxAmt:5,
                minAmt:0,
                sign: 0,
            },
            moveAmt: [0, 0],
            drag: 1.2,
        },
    };

    hit = {
        leftDir: 0,
        topDir: 0,
    };

    constructor(sid, col, dim, scale, tex, pos, style) {
        super('Brick', sid, col, dim, scale, tex, pos, style, null);
        this.sid = sid;
    }

    Destroy() {
        this.mesh.col[3] = 0.0;
        GlSetColorAlpha(this.gfxInfo, 0.0);
        this.isActive = false;
    }
    MovePush() {
        if(this.animation.push.x.active){
            if(math.Abs(this.animation.push.moveAmt[0]) < math.Abs(this.animation.push.x.minAmt)){
                this.animation.push.x.active = false;
            }
            else{
                this.animation.push.moveAmt[0] *= this.animation.push.drag; // Update the new move ammount 
                this.mesh.pos[0] += this.animation.push.moveAmt[0];
            }
        }
        if(this.animation.push.y.active){
            if(math.Abs(this.animation.push.moveAmt[1]) < math.Abs(this.animation.push.y.minAmt)){
                this.animation.push.y.active = false;
            }
            else{
                this.animation.push.moveAmt[1] *= this.animation.push.drag;  // Update the new move ammount 
                this.mesh.pos[1] += this.animation.push.moveAmt[1];
            }
        }
        GlMove(this.gfxInfo, this.animation.push.moveAmt);
    }
    MovePull() {
        if(this.animation.pull.x.active){
            if(math.Abs(this.animation.pull.moveAmt[0]) > this.animation.pull.x.maxAmt){
                this.animation.pull.x.active = false;
            }
            else{
                this.animation.pull.moveAmt[0] *= this.animation.pull.drag; // Update the new move ammount 
                this.mesh.pos[0] += this.animation.pull.moveAmt[0];
            }
        } 
        if(this.animation.pull.y.active){
            if(math.Abs(this.animation.pull.moveAmt[1]) > this.animation.pull.y.maxAmt){
                this.animation.pull.y.active = false;
            }
            else{
                this.animation.pull.moveAmt[1] *= this.animation.pull.drag;  // Update the new move ammount 
                this.mesh.pos[1] += this.animation.pull.moveAmt[1];
            }
        }
        GlMove(this.gfxInfo, this.animation.pull.moveAmt);
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
    Destroy() {
        for (let i = 0; i < this.size; i++) {
            if (this.brick[i].isActive) {
                this.brick[i].Destroy();
                this.count--;
                if (this.count < 0) alert('Bricks Reset count is minus')
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
export function BrickCreateBrick(col, pos, dim) {
    const br = bricks.GetNextFree();
    br.SetPos(pos);
    br.SetDim(dim);
    br.SetColor(GREY1);
    br.SetScaleFromVal(1);
    br.isActive = true;
    bricks.count++;

    // TODO: It might not belong here. Put some place else
    // If there is at least one brick and the game is in a state of 'stageComleted' then set 'NOT in state:stageCompleted' 
    if (g_state.game.stageCompleted)
        g_state.game.stageComleted = false;

    return br;
}
export function BrickReset() {
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
            const res = BallBrickCollision(bricks.brick[i].mesh.pos, bricks.brick[i].mesh.dim[0], bricks.brick[i].mesh.dim[1]);
            if (res) {


                // Update the hit direction
                bricks.brick[i].hit.leftDir = BALL.HIT.LEFT_DIR;
                bricks.brick[i].hit.topDir = BALL.HIT.TOP_DIR;
                // Create brick destroy animation
                BrickDestroyAnimation(i);

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
    // const ballDir = { x: BALL.DIR.X, y: BALL.DIR.Y };
    const ballDir = { x: BALL.HIT.LEFT_DIR, y: BALL.HIT.TOP_DIR };
    for (let i = 0; i < 4; i++) {
        destructionParticles.Create(pos[i][0], pos[i][1], ballDir, bricks.brick[idx].mesh.col);
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
const pushAmt = 2
const pushDist = 25
const pullAmt = 2
const pullDist = 35
// TODO: Create merthod for creating animations
export function BrickDestroyAnimation(i) {
    const br = bricks.brick[i];

    const animations = AnimationsGet();
    animations.Create(BrickDestroyPushStartAnimation, BrickDestroyPushStopAnimation, i);
    br.animation.push.x.maxDist = 0;
    br.animation.push.y.maxDist = 0;
    br.animation.push.y.sign = br.hit.topDir;
    br.animation.push.x.sign = br.hit.leftDir;
    if (br.hit.leftDir > 0) {
        br.animation.push.x.active = true;
        br.animation.push.moveAmt[0] = pushAmt;
        br.animation.push.x.maxDist = br.mesh.pos[0] + pushDist;
    } else if (br.hit.leftDir < 0) {
        br.animation.push.x.active = true;
        br.animation.push.moveAmt[0] = br.hit.leftDir * pushAmt
        br.animation.push.x.maxDist = br.mesh.pos[0] + (br.hit.leftDir * pushDist);
    }
    if (br.hit.topDir > 0) {
        br.animation.push.y.active = true;
        br.animation.push.moveAmt[1] = pushAmt;
        br.animation.push.y.maxDist = br.mesh.pos[1] + pushDist;
    } else if (br.hit.topDir < 0) {
        br.animation.push.y.active = true;
        br.animation.push.moveAmt[1] = br.hit.topDir*pushAmt;
        br.animation.push.y.maxDist = br.mesh.pos[1] + (br.hit.topDir  * pushDist);
    }


}
function BrickDestroyScaleStopAnimation(i) {
    // console.log('Stop Brick Animation')
    bricks.brick[i].SetColorAlpha(0.0);

}
function BrickDestroyScaleStartAnimation(i) { // This is the callback to the Animations.clbk at Animations.js
    if (bricks.brick[i].mesh.scale[0] > 0.15) {
        // Scale
        const scalex = bricks.brick[i].mesh.scale[0];
        if (scalex > 1.3 && bricks.brick[i].animation.scale.active) {
            bricks.brick[i].animation.scale.factor = 0.9;
            bricks.brick[i].animation.scale.active = false;
        }
        bricks.brick[i].ScaleFromVal(bricks.brick[i].animation.scale.factor);

        return true; // Ret true if animation is not over
    }
    else return false; // Ret false if animation is completed
}
function BrickDestroyPushStopAnimation(i) {
    bricks.brick[i].SetColorAlpha(0.0);
    // Set active the program that draws the explosions
    ExplosionsCreateExplosion(bricks.brick[i].mesh.pos);
    BrickCreateParticles(i);
    PowerUpCreate(bricks.brick[i].mesh.pos);
}
function BrickDestroyPushStartAnimation(i) { // This is the callback to the Animations.clbk at Animations.js
    const br = bricks.brick[i];
    if (br.animation.push.y.active || br.animation.push.x.active) {
        br.MovePush()

        // If both x and y animation transition has been completed, reverse the animatio
        if(!br.animation.push.y.active && !br.animation.push.x.active){ // active may change in br.MovePush() function
            // Reverse animation
            if(br.hit.leftDir){
                br.animation.pull.moveAmt[0] = br.hit.leftDir * pullAmt *-1;
                br.animation.pull.x.maxDist = br.mesh.pos[0] + (br.hit.leftDir * pullDist *-1);
                br.animation.pull.x.sign = br.hit.leftDir*-1;
                br.animation.pull.x.active = true;
            }
            if(br.hit.topDir){
                br.animation.pull.moveAmt[1] = br.hit.topDir * pullAmt *-1;
                br.animation.pull.y.maxDist = br.mesh.pos[1] + (br.hit.topDir * pullDist *-1);
                br.animation.pull.y.sign = br.hit.topDir*-1;
                br.animation.pull.y.active = true;
            }
        }
        return true;
    }
    else {
        if (br.animation.pull.x.active || br.animation.pull.y.active) {
            br.MovePull()
            return true;
        }

        // br.animation.pull.y.active = false;
        return false
    }
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


