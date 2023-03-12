"use strict";
import { GlAddMesh } from "../../Graphics/GlBuffers.js";
import { GlSetWpos, GlSetColor, GlSetDim, GlSetAttrRoundCorner } from "../../Graphics/GlBufferOps.js";
import { PlayerGetPos, PlayerGetDim } from "./Player.js";
import { UiCreateModifierValue, UiUpdate } from './Ui/Ui.js'
import { MouseGetXdir } from "../../Engine/Events/MouseEvents.js";
import { PowerUpCreate } from "./PowerUp.js";
import { GetRandomPos, GetRandomColor, GetSign } from "../../Helpers/Helpers.js";
import * as math from '../../Helpers/Math/MathOperations.js'
import { ParticlesCreateParticleSystem } from "../../Engine/ParticlesSystem/Particles.js";
import { GlGetProgram } from "../../Graphics/GlProgram.js";
import { AnimationsGet } from "../../Engine/Animations/Animations.js";
import { Rect } from "../../Engine/Drawables/Rect.js";


const BALL_SPEED_REGULATION = 1.0;
const MAX_BALLS_COUNT = 1;
const BALL_MAX_SPEED = 12;
const BALL_MIN_SPEED = 1.2;
const BALL_DEF_SPEED = 4;
const MAX_BALL_PROJECTION_LINE = 80;
const BALL_PROJECTION_LINE_DIST = 40; // The distance of each projection segment

const BOUNDING_BOX_PAD = 10;


// Exporting is only for the class type(to compare with the instanceof operator)
export class Ball extends Rect {

    speed = BALL_DEF_SPEED;
    mouseDist = 0;
    size = 0;

    prevPos = [0];
    xdir = 1;
    ydir = -1;
    amtx = 0.6;
    amty = 0.4;

    inMove = false;
    inAnimation = false;
    inLock = false;

    tail = {
        fx: null,
        intensity: 0,
        inIncrement: false,
    }

    constructor(sid, col, dim, scale, tex, pos, style, speed, isFree) {

        super('ball', sid, col, dim, scale, tex, pos, style, null);

        this.speed = speed;
        this.isFree = isFree;
    }

    ResetPos() {
        this.mesh.pos = [Viewport.width / 2, PLAYER.YPOS - (this.mesh.dim[1] + PLAYER.HEIGHT), 2];
        GlSetWpos(this.gfxInfo, [this.mesh.pos[0], this.mesh.pos[1], 2])
    }
    SetPos(pos) {
        this.mesh.pos = pos;
        GlSetWpos(this.gfxInfo, pos)
    }
    SetDim(dim) {
        this.mesh.dim = dim;
        GlSetDim(this.gfxInfo, dim);
        this.mesh.style[0] = this.mesh.dim[0] - this.mesh.style[2];
        GlSetAttrRoundCorner(this.gfxInfo, this.mesh.style[0]);
    }
    SetColor(col) {
        this.mesh.col = col;
        GlSetColor(this.gfxInfo, col);
    }
    SetTailFlameIntensity(){
        const prog = GlGetProgram(UNIFORM_PARAMS.particles.progIdx);
        prog.UniformsSetParamsBufferValue(this.tail.intensity, UNIFORM_PARAMS.particles.speedIdx);
    }

}

class Balls {
    balls = [];
    mainBall = null;
    ballTailFx = null;

    DimColor() {
        const len = this.balls.length;
        for (let i = 0; i < len; i++) {
            // const col = DimColor(this.balls[i].mesh.col);
            // GlSetColor(this.balls.gfxInfo, col)
            // this.balls[i].mesh.col = col;
            this.balls[i].DimColor(0.2, 0.99);
        }
    }

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Local scoped (to this compilation unit) variables */
let mainBall = null;
const balls = []; // Array to store the powerUp balls
let isOnlyMainBall = true; // Quick check if more than one balls exist. Set to false if the powerUp 'BALL' is activated 
let ballInStartPos = true;

// For Cashing mainBall's radius.
let blr = 0;
let acceleration = 0;

// Ball's particle system Tail
let ballTailFx = null;
let projLine = [];


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Getters-Setters */
export function BallGetPos() {
    return mainBall.mesh.pos;
}
export function BallGetBall() {
    return mainBall;
}
export function BallGetDir() {
    return {
        x: mainBall.xdir * mainBall.amtx,
        y: mainBall.ydir * mainBall.amty,
    };
}
export function BallSetSpeed(val) {
    // if(mainBall.speed + val > 0 
    //     && mainBall.speed + val < BALL_MAX_SPEED
    //     && mainBall.speed + val > BALL_MIN_SPEED)
    //     {
    //         // const prog = GlGetProgram(UNIFORM_PARAMS.particles.progIdx);
    //         // prog.UniformsSetParamsBufferValue(acceleration+=val, UNIFORM_PARAMS.particles.idx0);
    //         BallSetTailFlameIntensity(val)
    //         mainBall.speed += val*.5;
    //         console.log('acceleration:', acceleration);
    //         console.log('BallSpeed:', mainBall.speed)
    //     }
    allRedFlame(val)
}
// Check if the ball is in the starting position
export function BallGetInStartPos() {
    return ballInStartPos;
}
export function BallTailFxGet() {
    return ballTailFx;
}


// Release the ball at the start o a stage OR whenever the ball is set to the starting position(player pos)
export function BallRelease() {
    ballInStartPos = false;
for (let i = 0; i < MAX_BALL_PROJECTION_LINE; i++) {
        GlSetWpos(projLine[i].gfxInfo, [1000, 0, 2]);
    }
}
export function BallReset() {
    mainBall.ResetPos();
    ballInStartPos = true;
    mainBall.speed = BALL_DEF_SPEED;
    mainBall.SetColor(WHITE);
    mainBall.tail.flameIntensity = -acceleration
    mainBall.SetTailFlameIntensity()
    // BallSetTailFlameIntensity(-acceleration);

}
export function BallResetPos() {
    mainBall.ResetPos();
    ballInStartPos = true;
}
// function BallSetTailFlameIntensity(val) {
//     mainBall.tail.intensity = val;
//     const prog = GlGetProgram(UNIFORM_PARAMS.particles.progIdx);
//     prog.UniformsSetParamsBufferValue(val, UNIFORM_PARAMS.particles.speedIdx);
// }


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Functions */

export function BallsInit(sceneIdx) {

    const radius = BALL.RADIUS;
    const style = { roundCorner: 0, border: 0.0, feather: 2.0, };

    style.roundCorner = radius - style.feather;
    const sid = SID_DEFAULT;
    let color = [1, 1, 1, 1.0];
    // let pos   = [Viewport.width / 2, Viewport.bottom - 82, 2];
    let pos = [OUT_OF_VIEW, PLAYER.YPOS - 30, 2];// Set the pos of every un-rendered ball out of view
    let isFree = false;

    for (let i = 0; i < MAX_BALLS_COUNT; i++) {

        balls[i] = new Ball(sid, color, [radius, radius], [1.0, 1.0], null, pos, style, 4, isFree,);
        balls[i].gfxInfo = GlAddMesh(balls[i].sid, balls[i].mesh, 1, sceneIdx, 'ball', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);

        // Store to local compilation unit(mainBall and balls[])
        if (!mainBall) { // Case the main ball is created
            mainBall = balls[i];
        }

        if (i === 0) {
            // Set Not visible for the rest of the balls
            color = [0, 0, 0, 0];
            pos = [0, 0, 0];
            isFree = true;
            isOnlyMainBall = true;
        }
    }
    blr = balls[0].mesh.dim[0]; // Cache ball radius

    // Initialize ballTail fx
    ballTailFx = BallFxCreateTail(28, 40, sceneIdx);

    // Initialize ball's line projection
    BallInitProjectLine(sceneIdx);

    return balls;
}

export function BallCreate(pos) {

    for (let i = 0; i < MAX_BALLS_COUNT; i++) {

        if (balls[i].isFree) {

            const color = GetRandomColor();
            GlSetColor(balls[i].gfxInfo, color);
            math.CopyArr4(balls[i].mesh.col, color);

            // Set as position the bricks position
            GlSetWpos(balls[i].gfxInfo, pos);
            balls[i].mesh.pos[0] = pos[0];
            balls[i].mesh.pos[1] = pos[1];

            balls[i].isFree = false;

            return balls[i];
        }
    }
}

export function BallOnUpdate() {
    // Case no powerUp 'BALL' is active(deal with only one mainBall)
    if (isOnlyMainBall) {

        BallBoundariesCollision(mainBall);
        BallUpdatePos(mainBall);
    }
    else { // Update all balls from the array
        for (let i = 0; i < MAX_BALLS_COUNT; i++) {
            if (!balls[i].isFree) {
                BallBoundariesCollision(balls[i]);
                BallUpdatePos(balls[i]);
            }
        }
    }

    BALL.DIR.X = mainBall.xdir * mainBall.amtx;
    BALL.DIR.Y = mainBall.ydir * mainBall.amty;

    const xpos = mainBall.mesh.pos[0];
    const ypos = mainBall.mesh.pos[1];
    ballTailFx.Create(xpos, ypos);
    ballTailFx.Update();

}


function BallUpdateProjectLine(ball) {
    let pos = [ball.mesh.pos[0], ball.mesh.pos[1]];
    const dif = pos[0] - PLAYER.XPOS;
    const x = ball.amtx * BALL.SIGN;
    const y = ball.amty;
    let xdir = 1;
    let ydir = -1;

    const size = (math.Abs(math.Abs(x) - math.Abs(y)) + 1) * 3;

    let lock = 0;

    const right = Viewport.right - BOUNDING_BOX_PAD;
    const left = Viewport.left + BOUNDING_BOX_PAD;

    for (let i = 0; i < MAX_BALL_PROJECTION_LINE; i++) {
        let nextDistX = (x * BALL_PROJECTION_LINE_DIST);
        const nextPosY = (y * BALL_PROJECTION_LINE_DIST);

        if (lock) {
            xdir = lock;
            lock = 0;
        }

        if (dif > 0) { // Ball is located at the rigth half of the players surface
            if (pos[0] + (nextDistX * xdir) > right) {
                const a = right - pos[0];
                const b = nextDistX - a;
                if (a > b) {
                    lock = -1; // a < b takes proj entity(ball) forward and changes dir on the next proj entity
                    nextDistX = a - b
                }
                else if (a < b) {
                    xdir = -1;
                    nextDistX = b - a
                }
            }
            else if (pos[0] + (nextDistX * xdir) < left) {
                const a = pos[0] - left;
                const b = nextDistX - a;
                if (a > b) {
                    lock = 1;
                    nextDistX = a - b
                }
                else if (a < b) {
                    lock = 1;
                    nextDistX = -b
                }
            }
        }
        else { // Ball is located at the left half of the players surface, so nextDistX is negative(actuually x variable is negative)
            if (pos[0] + (nextDistX * xdir) > right) {
                const a = -(right - pos[0]);
                const b = nextDistX - a;
                if (a > b) {
                    lock = 1; // Change dir on the next proj entity
                    nextDistX = a - b
                }
                else if (a < b) {
                    xdir = 1;
                    nextDistX = b - a
                }
            }
            else if (pos[0] + (nextDistX * xdir) < left) {
                const a = left - pos[0];
                const b = nextDistX - a;
                if (a > b) {
                    lock = -1;
                    nextDistX = a - b
                }
                else if (a < b) {
                    lock = -1;
                    nextDistX = a
                }
            }
        }

        pos[0] += nextDistX * xdir;
        pos[1] += nextPosY * ydir;

        GlSetWpos(projLine[i].gfxInfo, pos);

        projLine[i].SetDim([size, size]);
    }
}
function BallInitProjectLine(sceneIdx) {

    let pos = [mainBall.mesh.pos[0], mainBall.mesh.pos[1], 2];

    for (let i = 0; i < MAX_BALL_PROJECTION_LINE; i++) {
        const radius = 4;
        const style = { roundCorner: 0, border: 0.0, feather: 1.0, };

        style.roundCorner = radius - style.feather;
        const sid = SID_DEFAULT;
        let color = GREEN_138_218_0;
        // let color = GetRandomColor();
        projLine[i] = new Ball(sid, color, [radius, radius], [1.0, 1.0], null, pos, style, 4, false);

        projLine[i].amtx = 1;
        projLine[i].amty = 1;
        projLine[i].gfxInfo =
            GlAddMesh(projLine[i].sid, projLine[i].mesh, 1, sceneIdx,
                'ballProj', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    }
}

export function BallUpdatePos(ball) {

    if (!ball) return;

    if (!ballInStartPos) {

        ball.mesh.pos[0] += ball.xdir * ball.amtx * ball.speed * BALL_SPEED_REGULATION; // * delta;
        ball.mesh.pos[1] += ball.ydir * ball.amty * ball.speed * BALL_SPEED_REGULATION; // * delta;
        GlSetWpos(ball.gfxInfo, ball.mesh.pos);
        ball.inMove = true;

        /**
         * Un-lock ball's property, to check collision with the player
         * In simple terms, prevent ball to collide more than once,
         * before it gets away from the player
         */
        if (ball.mesh.pos[1] < PLAYER.YPOS - 40)
            ball.inLock = false;

    }
    else { // If the state of the game is at the start of a stage, keep the ball at the start position until user releases it.

        const playerPos = PlayerGetPos();
        const playerDim = PlayerGetDim();
        const mouseDir = MouseGetXdir();
        let inMove = false;
        ball.inLock = false;

        // Make the ball not leave the players's width area
        if (ball.mesh.pos[0] < playerPos[0] - playerDim[0] && mouseDir > 0) {
            ball.mesh.pos[0] = playerPos[0] - playerDim[0];
            inMove = true;
        }
        if (ball.mesh.pos[0] > playerPos[0] + playerDim[0] && mouseDir < 0) {
            ball.mesh.pos[0] = playerPos[0] + playerDim[0];
            inMove = true;
        }
        if (inMove) {
            GlSetWpos(ball.gfxInfo, ball.mesh.pos);
            ball.inMove = true;
        }
        BallUpdateProjectLine(mainBall);
    }

}

export function BallBoundariesCollision(ball) {

    if (!ball) return;

    // const radius = ball.mesh.dim[0];
    const radius = 0;

    if (ball.mesh.pos[0] - radius < Viewport.left + BOUNDING_BOX_PAD) {
        ball.mesh.pos[0] = Viewport.left + radius + BOUNDING_BOX_PAD;
        ball.xdir = 1; // Reverse balls direction.
        // ball.xdir *= -1; // Reverse balls direction.
    }
    else if (ball.mesh.pos[0] + radius > Viewport.right - BOUNDING_BOX_PAD) {
        ball.mesh.pos[0] = Viewport.right - radius - BOUNDING_BOX_PAD;
        ball.xdir = -1;
        // ball.xdir *= -1;
    }
    else if (ball.mesh.pos[1] - radius < GAME_AREA_TOP + BOUNDING_BOX_PAD) {
        ball.mesh.pos[1] = GAME_AREA_TOP + radius + BOUNDING_BOX_PAD;
        ball.ydir = 1;
        // ball.ydir *= -1;
    }
    else if (ball.mesh.pos[1] + radius > Viewport.bottom - BOUNDING_BOX_PAD) {
        ball.mesh.pos[1] = Viewport.bottom - radius - BOUNDING_BOX_PAD;
        ball.ydir = -1;
        // ball.ydir *= -1;
    }
}

export function BallPlayerCollision(plpos, plw, plh, plXdir) {

    if (!mainBall) return;

    let count = MAX_BALLS_COUNT;
    if (isOnlyMainBall)
        count = 1; // If no powerUp 'Ball' is active, dont loop through all elements in the ball's buffer

    for (let i = 0; i < count; i++) {

        if (!balls[i].isFree && !balls[i].inLock &&
            balls[i].mesh.pos[0] + blr >= plpos[0] - plw &&
            balls[i].mesh.pos[0] - blr <= plpos[0] + plw &&
            balls[i].mesh.pos[1] + blr >= plpos[1] - plh &&
            balls[i].mesh.pos[1] - blr <= plpos[1] + plh
        ) {
            // Bounce ball in y dir
            balls[i].ydir = -1;
            balls[i].inLock = true; // Set a lock so we do not check for collision until a certain y pos threshold has passed

            /**
             * dif: It is the ball's position difference to the sides of the player
             *      If ball is located at the center of the player,
             *          then dif = 0
             *      If ball is located at the sides of the player,
             *          then dif = player (+,-)width
             * amt: Is the dif converted to a value ranging: [1, 0, 1],
             *      that is: [far left, center, far right]
             * 'amt*amt' conscept manages to increase x ammount at the siades
             *      and decreas it more near the ceneter.
             *      In simple terms, 'amt*amt' is exaggerating the x component configuration
             */

            const dif = balls[i].mesh.pos[0] - plpos[0];
            // Interpolate the ball's hit x pos relative to players surface to 0.0-1.0 value
            const amt = math.Abs(math.Min(dif / plw, 1.0));
            let x = (amt * amt * amt); // +0.2 converts the val to 0.2-1.2 range
            let y = (1. - (amt)) + 0.2;
            
            // Leave a small area in the center of the players surface for 0 x direction, 
            // so that the ball goes straight up
            if(x > 0.0003) 
                x += 0.2
            if (math.Abs(dif) > plw) { // Case we hit with the players side(right or left)
                y += 0.15; // Give some extra power to x direction
                x += 0.4;  // Give some extra power to y direction
            }
            balls[i].amty = y * BALL.YX_SPEED_RATIO;
            balls[i].amtx = x;

            // Set ball's direction based on where it collided with the player
            // (ball goes left if collided from center2left or ball goes right if collided from cnter2right)
            BALL.SIGN = GetSign(dif)
            balls[i].xdir = BALL.SIGN;
            // Increase speed when x OR y are in their extremes
            const xydiff = math.Abs(x - y);
            
            
            if(!ballInStartPos){

                const params = {
                    maxSpeed: (xydiff + 40) * 0.1,
                    flameIntensity: math.Max(xydiff * 2.3, 1),
                };

                // Set a flag for if we are going to animate with increment or decrement
                if(params.flameIntensity > mainBall.tail.intensity)
                    mainBall.tail.inIncrement = true;
                else 
                    mainBall.tail.inIncrement = false;

                const animations = AnimationsGet();
                animations.Create(BallSpeedUpStartAnimation, BallSpeedUpStopAnimation, params, 'jsj');
            }
            else{
                balls[i].speed = (xydiff + 40) * 0.1;
                // The "xydiff*<val>" expands the ratio to which the ballTail fx is stronger-weaker(greater the val, greater the expansion)  
                balls[i].tail.flameIntensity = math.Max(xydiff * 2.3, 1)
                balls[i].SetTailFlameIntensity()
            }

        }
    }
}
function BallSpeedUpStartAnimation(params){
    let ret = false;
    const speedIntensity = 0.0015
    const flameIntensity = 0.05

    if(mainBall.tail.inIncrement){
        if (mainBall.speed < params.maxSpeed) {
            mainBall.speed += speedIntensity;
            ret =  true; // Ret true if animation is not over
        }
        if(mainBall.tail.inIncrement && mainBall.tail.intensity < params.flameIntensity){
            mainBall.tail.intensity += flameIntensity;
            mainBall.SetTailFlameIntensity();
            ret =  true; // Ret true if animation is not over
        }

    }
    else{

        if(mainBall.speed > params.maxSpeed) {
            mainBall.speed -= speedIntensity;
            ret =  true; // Ret true if animation is not over
        }
        if(!mainBall.tail.inIncrement && mainBall.tail.intensity > params.flameIntensity){
            mainBall.tail.intensity -= flameIntensity;
            mainBall.SetTailFlameIntensity();
            ret =  true; // Ret true if animation is not over
        }
    }
    return ret; // Ret false if animation is completed
}
function BallSpeedUpStopAnimation(){
    console.log('------------------------\nStop Anim\n-------------------------')
}

export function BallBrickCollision(brpos, brw, brh) {

    if (!mainBall) return; // Case we are at a menu or any other place that no ball exists

    let count = MAX_BALLS_COUNT;
    if (isOnlyMainBall)
        count = 1; // If no powerUp 'Ball' is active, dont loop through all elements in the ball's buffer

    for (let i = 0; i < count; i++) {

        let intersects = false;

        // Cashed Variables
        const ballTop = balls[i].mesh.pos[1] - balls[i].mesh.dim[1]; // /1.2;
        const ballBottom = balls[i].mesh.pos[1] + balls[i].mesh.dim[1]; // /1.2;
        const ballRight = balls[i].mesh.pos[0] + balls[i].mesh.dim[0]; // /1.2;
        const ballLeft = balls[i].mesh.pos[0] - balls[i].mesh.dim[0]; // /1.2;

        const brTop = brpos[1] - brh;
        const brBottom = brpos[1] + brh;
        const brRight = brpos[0] + brw;
        const brLeft = brpos[0] - brw;

        let scoreMod = 0;

        // let accel = BALL.CORNER_HIT_ACCEL;
        let accel = 1;

        if (BALL.MODE.powerBall) {
            if (ballRight >= brLeft && ballLeft <= brRight &&
                ballTop >= brTop && ballTop <= brBottom) {
                intersects = true;
                scoreMod = 0.5;
                balls[i].amtx *= 1.08;
                balls[i].amty *= 1.08;
            }
        }
        // Bricks Left Side Collision Check
        else if (ballRight >= brLeft && balls[i].mesh.pos[0] < brLeft && balls[i].xdir > 0) {

            BALL.HIT.LEFT_DIR = 1;
            if (balls[i].mesh.pos[1] - BALL.RADIUS_TWO_THIRDS > brTop && balls[i].mesh.pos[1] + BALL.RADIUS_TWO_THIRDS < brBottom) {
                balls[i].xdir = -accel;
                intersects = true;
                scoreMod = 0.1;
                BALL.HIT.TOP_DIR = 0;
            }
            // Left Up corner collision
            else if (ballBottom - BALL.RADIUS_TWO_THIRDS > brTop && ballTop < brTop && balls[i].ydir > 0) {
                // balls[i].amtx *= 2.0;
                balls[i].ydir = -accel;
                balls[i].xdir *= -1;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.TOP_DIR = 1;
            }
            // Left Bottom corner collision
            else if (ballTop + BALL.RADIUS_TWO_THIRDS < brBottom && ballBottom > brBottom && balls[i].ydir < 0) {
                // balls[i].amtx *= 2.0
                balls[i].ydir = -accel;
                balls[i].xdir *= -1;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.TOP_DIR = -1;
            }
        }
        // Bricks Right Side Collision Check
        else if (ballLeft <= brRight && balls[i].mesh.pos[0] > brRight && balls[i].xdir < 0) {

            BALL.HIT.LEFT_DIR = -1;
            if (balls[i].mesh.pos[1] - BALL.RADIUS_TWO_THIRDS > brTop && balls[i].mesh.pos[1] + BALL.RADIUS_TWO_THIRDS < brBottom) {
                // Collision to bricks right side
                balls[i].xdir = accel;
                intersects = true;
                scoreMod = 0.1;
                BALL.HIT.TOP_DIR = 0;
            }
            else if (ballBottom - BALL.RADIUS_TWO_THIRDS > brTop && ballTop < brTop && balls[i].ydir > 0) {
                // Right Up corner collision
                // balls[i].amtx *= 2.0;
                balls[i].ydir = -accel;
                balls[i].xdir *= -1;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.TOP_DIR = 1;
            }
            // Right Bottom corner collision
            else if (ballTop + BALL.RADIUS_TWO_THIRDS < brBottom && ballBottom > brBottom && balls[i].ydir < 0) {
                balls[i].ydir = accel;
                balls[i].xdir *= -1;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.TOP_DIR = -1;
            }
        }
        // Bricks Bottom Side Collision Check
        else if (ballTop <= brBottom && balls[i].mesh.pos[1] > brBottom && balls[i].ydir < 0) {

            BALL.HIT.TOP_DIR = -1;
            if (balls[i].mesh.pos[0] - BALL.RADIUS_TWO_THIRDS > brLeft && balls[i].mesh.pos[0] + BALL.RADIUS_TWO_THIRDS < brRight) {
                // Collision to bricks bottom side
                balls[i].ydir = accel;
                intersects = true;
                scoreMod = 0.1;
                BALL.HIT.LEFT_DIR = 0;
            }
            // Bottom Left corner collision
            else if (ballRight - BALL.RADIUS_TWO_THIRDS > brLeft && ballLeft < brLeft && balls[i].xdir > 0) {
                // balls[i].amtx *= 2.0;
                balls[i].xdir = -accel;
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.LEFT_DIR = 1;
            }
            else if (ballLeft + BALL.RADIUS_TWO_THIRDS < brRight && ballRight > brRight && balls[i].xdir < 0) {
                // Bottom Right corner collision
                // balls[i].amtx *= 2.0;
                balls[i].xdir = -accel;
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.LEFT_DIR = -1;
            }
        }
        // Bricks Top Side Collision Check
        else if (ballBottom >= brTop && balls[i].mesh.pos[1] < brTop && balls[i].ydir > 0) {

            BALL.HIT.TOP_DIR = 1;
            if (balls[i].mesh.pos[0] - BALL.RADIUS_TWO_THIRDS > brLeft && balls[i].mesh.pos[0] + BALL.RADIUS_TWO_THIRDS < brRight) {
                // Collision to bricks Top side
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.1;
                BALL.HIT.LEFT_DIR = 0;
            }
            else if (ballRight + BALL.RADIUS_TWO_THIRDS > brLeft && ballLeft < brLeft && balls[i].xdir > 0) {
                // Top Left corner collision
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.LEFT_DIR = 1;
            }
            else if (ballLeft - BALL.RADIUS_TWO_THIRDS < brRight && ballRight > brRight && balls[i].xdir < 0) {
                // Top Right corner collision
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.2;
                BALL.HIT.LEFT_DIR = -1;
            }
        }


        // Normalize speed
        // if(balls[i].amtx > 2.6) balls[i].amtx = 2.3;
        // if(balls[i].amty > 2.6) balls[i].amty = 2.8;

        if (intersects) {
            UiCreateModifierValue(brpos, 1.1);
            UiUpdate(UI_TEXT_INDEX.SCORE_MOD, scoreMod);
            PowerUpCreate(brpos);
        }

        // If at least one ball intersects, return. No need to check for the rest of the balls 
        if (intersects)
            return intersects;
    }

    return false; // No ball intersects
}

export function BallCreatePowUpBalls(count) {
    for (let i = 0; i < count; i++) {
        BallCreate(GetRandomPos([20, Viewport.bottom - 90], [Viewport.right - 20, PLAYER.YPOS - 100]));
    }
    isOnlyMainBall = false;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Fx */

export function BallFxCreateTail(scene) {
    const meshAttr = {
        sid: SID_PARTICLES_TAIL,
        col: WHITE,
        pos: [0, 0, 5],
        dim: [40 / 2, 40 / 2],
        scale: [1, 1],
        time: 0,
        style: null,
    };
    const timerAttr = {
        step: 0.04,
        duration: 1.0,
    }
    const numParticles = 80;
    ballTailFx = ParticlesCreateParticleSystem(meshAttr, timerAttr, numParticles, scene, 'Ball Tail');

    return ballTailFx;
}

/** Slow ball speed animation */
export function BallCreateSlowSpeedAnimation() {
    const animations = AnimationsGet();
    animations.Create(BallSlowSpeedStartAnimation, BallSlowSpeedStopAnimation);
}
function BallSlowSpeedStopAnimation() {
    console.log('Stop Ball Animation')
}
function BallSlowSpeedStartAnimation() { // This is the callback to the Animations.clbk at Animations.js
    const intensity = 0.1;
    if (mainBall.speed >= 1) {
        mainBall.tail.intensity = -intensity * 0.9;
        mainBall.SetTailFlameIntensity();
        // BallSetTailFlameIntensity(-intensity * 0.9)
        mainBall.speed -= intensity * 0.5;
        return true; // Ret true if animation is not over
    }
    return false; // Ret false if animation is completed
}
/** Dim color animation */
export function BallCreateDimColorAnimation() {
    // const animations = AnimationsGet(); 
    // animations.Create(RunBallDimColorAnimation, BallStopDimColorAnimation);
}
function BallStopDimColorAnimation() {
    console.log('Stop Ball Animation')
}
function RunBallDimColorAnimation() { // This is the callback to the Animations.clbk at Animations.js
    return mainBall.DimColor(0.03, 0.99)
}
