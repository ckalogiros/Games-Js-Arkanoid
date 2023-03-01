"use strict";
import { GlAddMesh } from "../../Graphics/GlBuffers.js";
import { Mesh } from "../../Engine/Drawables/Mesh.js";
import { GlSetWpos, GlSetColor } from "../../Graphics/GlBufferOps.js";
import { PlayerGetPos, PlayerGetDim } from "./Player.js";
import { ModCreateAnimation, UiCreateModifierValue, UiUpdate } from './Ui/Ui.js'
import { MouseGetXdir } from "../../Engine/Events/MouseEvents.js";
import { PowerUpCreate } from "./PowerUp.js";
import { GetRandomPos, GetRandomColor, DimColor } from "../../Helpers/Helpers.js";
import * as math from '../../Helpers/Math/MathOperations.js'
import { ParticlesCreateParticleSystem } from "../../Engine/ParticlesSystem/Particles.js";
import { GlGetProgram } from "../../Graphics/GlProgram.js";
import { AnimationsGet } from "../../Engine/Animations/Animations.js";
import { Rect } from "../../Engine/Drawables/Rect.js";



const MAX_BALLS_COUNT = 1;
const BALL_MAX_SPEED = 12;
const BALL_MIN_SPEED = 1.2;
const BALL_DEF_SPEED = 4;
// const BALL_DEF_POS = [Viewport.width/2, Viewport.bottom - 82, 2];


// Exporting is only for the class type(to compare with the instanceof operator)
export class Ball extends Rect{

    speed = BALL_DEF_SPEED;
    mouseDist = 0;
    size = 0;
    
    prevPos = [0];
    xdir = 1;
    ydir = 1;
    amtx = 0.6;
    amty = 0.4;

    inMove = false;
    inAnimation = false;

    constructor(sid, col, dim, scale, tex, pos, style, speed, isFree) {
        
        super('ball', sid, col, dim, scale, tex, pos, style, null);

        this.speed = speed;
        this.isFree = isFree;
    }

    ResetPos(){
        this.mesh.pos = [Viewport.width/2, Viewport.bottom - 82, 2];
        GlSetWpos(this.gfxInfo, [Viewport.width/2, Viewport.bottom - 82, 2])
    }
    SetPos(pos){
        this.mesh.pos = pos;
        GlSetWpos(this.gfxInfo, pos)
    }
    SetDim(dim){
        this.mesh.dim = dim;
        GlSetDim(this.gfxInfo, dim);
    }
    SetColor(col){
        this.mesh.col = col;
        GlSetColor(this.gfxInfo, col);
    }

}

class Balls{
    balls = [];
    mainBall = null;
    ballTailFx = null;

    DimColor(){
        const len = this.balls.length;
        for(let i=0; i<len; i++){
            // const col = DimColor(this.balls[i].mesh.col);
            // GlSetColor(this.balls.gfxInfo, col)
            // this.balls[i].mesh.col = col;
            this.balls[i].DimColor(0.2, 0.99);
        }
    }

}

let mainBall = null;
const balls = []; // Array to store the powerUp balls
let isOnlyMainBall = true; // Quick check if more than one balls exist. Set to false if the powerUp 'BALL' is activated 
let ballInStartPos = true;

// For Cashing mainBall's radius.
let blr = 0;
let acceleration = 0;

// Ball's particle system Tail
let ballTailFx = null;
export function BallTailFxGet() {
    return ballTailFx;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Getters-Setters */
// Release the ball at the start o a stage OR whenever the ball is set to the starting position(player pos)
export function BallRelease() {
    ballInStartPos = false;
}
// Check if the ball is in the starting position
export function BallIsInStartPos() {
    return ballInStartPos;
}
export function BallReset(){
    mainBall.ResetPos();
    ballInStartPos = true;
    mainBall.speed = BALL_DEF_SPEED;
    mainBall.SetColor(WHITE);
    BallRedFlame(-acceleration);

}
export function BallResetPos(){
    mainBall.ResetPos();
    ballInStartPos = true;
}
export function BallGetPos(){
    return mainBall.mesh.pos;
}
export function BallGetBall(){
    return mainBall;
}
export function BallGetDir(){
    return {
        x: mainBall.xdir * mainBall.amtx,
        y: mainBall.ydir * mainBall.amty,
    };
}
export function BallSetSpeed(val){
    if(mainBall.speed + val > 0 
        && mainBall.speed + val < BALL_MAX_SPEED
        && mainBall.speed + val > BALL_MIN_SPEED)
        {
            // const prog = GlGetProgram(UNIFORM_PARAMS.particles.progIdx);
            // prog.UniformsSetParamsBufferValue(acceleration+=val, UNIFORM_PARAMS.particles.idx0);
            BallRedFlame(val)
            mainBall.speed += val*.5;
            console.log('acceleration:', acceleration);
            console.log('BallSpeed:', mainBall.speed)
        }
}

function BallRedFlame(val){
    const prog = GlGetProgram(UNIFORM_PARAMS.particles.progIdx);
    acceleration+=val;
    prog.UniformsSetParamsBufferValue(acceleration, UNIFORM_PARAMS.particles.idx0);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Functions */

export function BallsInit(sceneIdx){

    const radius = 15.0;
    const style = { roundCorner: 0, border: 0.0, feather: 2.0, };

    style.roundCorner = radius - style.feather;
    const sid = SID_DEFAULT;
    let color = [1,1,1,1.0];
    // let pos   = [Viewport.width / 2, Viewport.bottom - 82, 2];
    let pos   = [OUT_OF_VIEW, Viewport.bottom - 82, 2];// Set the pos of every un-rendered ball out of view
    let isFree = false;
    
    for(let i = 0; i < MAX_BALLS_COUNT; i++){

        balls[i] = new Ball(
            sid,
            color,
            [radius, radius], // dimentions
            [1.0, 1.0], // Default scale
            null, // Texture coords
            pos, // World Position
            style,
            4, // Ball speed
            isFree,
        );

        balls[i].gfxInfo = GlAddMesh(balls[i].sid, balls[i].mesh, 1, sceneIdx, 'ball', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    
        // Store to local compilation unit(mainBall and balls[])
        if(!mainBall){ // Case the main ball is created
            mainBall = balls[i];
        }

        if(i === 0){
            // Set Not visible for the rest of the balls
            color = [0,0,0,0]; 
            pos = [0,0,0]; 
            isFree = true;
            isOnlyMainBall = true;
        }
    }
    blr = balls[0].mesh.dim[0]; // Cache ball radius

    // Initialize ballTail fx
    ballTailFx = BallFxCreateTail(28, 40, sceneIdx);

    return balls;
}

export function BallCreate(pos) {

    for(let i = 0; i < MAX_BALLS_COUNT; i++){

        if(balls[i].isFree){
                               
            const color = GetRandomColor();
            GlSetColor(balls[i].gfxInfo, color);
            math.CopyArr4(balls[i].mesh.col, color);
            
            // Set as position the bricks position
            GlSetWpos(balls[i].gfxInfo, pos);
            balls[i].mesh.pos[0] = pos[0];
            balls[i].mesh.pos[1] = pos[1];

            balls[i].isFree     = false;

            return balls[i];
        }
    }
}

export function BallOnUpdate(){

    // Case no powerUp 'BALL' is active(deal with only one mainBall)
    if(isOnlyMainBall){

        BallBoundariesCollision(mainBall);
        BallUpdatePos(mainBall);
    }
    else{ // Update all balls from the array

        for(let i = 0; i < MAX_BALLS_COUNT; i++){
    
            if(!balls[i].isFree){
                
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

export function BallUpdatePos(ball) {

    if (!ball) return;

    if (!ballInStartPos) {

        // Normalize balls ballSpeed over time
        if (!(ball.amty <= 1.0)) ball.amty *= 0.99995;
        //   else if (ball.amty < 1.0) ball.amty *= 1.002;
        if (!(ball.amtx <= 1.0)) ball.amtx *= 0.9992;
        //   else if (ball.amtx < 0.8) ball.amtx *= 1.002;

        ball.mesh.pos[0] += ball.xdir * ball.amtx * ball.speed; // * delta;
        ball.mesh.pos[1] += ball.ydir * ball.amty * ball.speed; // * delta;
        GlSetWpos(ball.gfxInfo, ball.mesh.pos);
        ball.inMove = true;
    }
    else { // If the state of the game is at the start of a stage, keep the ball at the start position until user releases it.
        
        const playerPos = PlayerGetPos();
        const playerDim = PlayerGetDim();
        const mouseDir  = MouseGetXdir();
        let inMove = false;
        
        // Make the ball not leave the players's width area
        if (ball.mesh.pos[0] < playerPos[0] - playerDim[0] && mouseDir > 0){
            ball.mesh.pos[0] = playerPos[0] - playerDim[0];
            inMove = true;
        }
        if (ball.mesh.pos[0] > playerPos[0] + playerDim[0] && mouseDir < 0){
            ball.mesh.pos[0] = playerPos[0] + playerDim[0];
            inMove = true;
        }
        if(inMove){
            GlSetWpos(ball.gfxInfo, ball.mesh.pos);
            ball.inMove = true;
            // OnBallMove();
        }
    }

}

const BOUNDING_BOX_PAD = 10;
export function BallBoundariesCollision(ball) {

    if (!ball) return;

    if (ball.mesh.pos[0] - blr < Viewport.left+BOUNDING_BOX_PAD) {
        ball.mesh.pos[0] = Viewport.left + blr+BOUNDING_BOX_PAD;
        // ball.xdir = 1; // Reverse balls direction.
        ball.xdir *= -1; // Reverse balls direction.
    } 
    else if (ball.mesh.pos[0] + blr > Viewport.right-BOUNDING_BOX_PAD) {
        ball.mesh.pos[0] = Viewport.right - blr-BOUNDING_BOX_PAD;
        // ball.xdir = -1;
        ball.xdir *= -1;
    } 
    else if (ball.mesh.pos[1] - blr < GAME_AREA_TOP+BOUNDING_BOX_PAD) {
        ball.mesh.pos[1] = GAME_AREA_TOP + blr+BOUNDING_BOX_PAD;
        // ball.ydir = 1;
        ball.ydir *= -1;
    } 
    else if (ball.mesh.pos[1] + blr > Viewport.bottom-BOUNDING_BOX_PAD) {
        ball.mesh.pos[1] = Viewport.bottom - blr-BOUNDING_BOX_PAD;
        // ball.ydir = -1;
        ball.ydir *= -1;
    }
}

export function BallPlayerCollision(plpos, plw, plh, plXdir) {

    if (!mainBall) return;
        
    let count = MAX_BALLS_COUNT;
    if(isOnlyMainBall)
        count = 1; // If no powerUp 'Ball' is active, dont loop through all elements in the ball's buffer


    
    for(let i = 0; i < count; i++){
    
        if ( !balls[i].isFree && // curr elem has a ball mesh
            balls[i].mesh.pos[0] + blr >= plpos[0] - plw &&
            balls[i].mesh.pos[0] - blr <= plpos[0] + plw &&
            balls[i].mesh.pos[1] + blr >= plpos[1] - plh &&
            balls[i].mesh.pos[1] - blr <= plpos[1] + plh
        ) {
            // Bounce ball in y dir
            balls[i].ydir = -1;
    
            /**
            * collPos is how much away from the player's center the ball had collided.
            * We use it to create different responce of the ball x and y direction
            * vector. The more the collision happens in the middle of the player, the
            * straighter the ball is going to bounce off. If the collPos is large(ball
            * collided at the sides) the ball will bounce with a greater angle.
            */
            let collPos = (balls[i].mesh.pos[0] - plpos[0]) / 5;
    
            // Clamp very high and very low values
            if (collPos < BALL.MIN_AMT) collPos = -BALL.MIN_AMT;
            else if (collPos > BALL.MAX_AMT) collPos = BALL.MAX_AMT;
    
            /* If balls is comming from the left and collides
             * to the left half of the player AND player
             * comes from the right (oposite X directions for ball-player),
             * then balls goes to the oposite direction. */
            if ((collPos > 0 && balls[i].xdir < 0 && plXdir > 0) ||
                (collPos < 0 && balls[i].xdir > 0 && plXdir < 0)) {
                balls[i].xdir *= -1;
            }
    
            // Normalize collPos to have only positive values
            if (collPos < 0) collPos *= -1;
    
            // Change ballSpeed for x and y separately
            balls[i].amty = (12 - collPos) * 0.185;
    
            // // Clamp y ballSpeed
            // if (balls[i].amty > BALL.MAX_AMT) balls[i].amty = BALL.MAX_AMT;
            // if (balls[i].amty > 2.5) balls[i].amty = 2.5;
    
            /* Regulate balls speed for individual x and y direction.
             * This is the actual calculation resulting in ball's speed y
             * to be more when colliding in the middle of the player (straighter bounce)
             * or the speed x to be more when colliding in the sides
             * of the player (bounce with an angle)
             */
            if (collPos < (plw / 3) * 2.62) {
                balls[i].amtx = collPos * 0.2;
            }
            else if (collPos < plw / 2) {
                balls[i].amty = collPos * 1.12;
            }
            else {
                balls[i].amtx = collPos * 0.3;
                balls[i].amty = (12 - collPos) * 0.07;
            }
    
            // Clamp y ballSpeed
            if (balls[i].amty > BALL.MAX_AMT) balls[i].amty = BALL.MAX_AMT;
        }
    }

}

export function BallBrickCollision(brpos, brw, brh) {

    if (!mainBall) return; // Case we are at a menu or any other place that no ball exists
    
    let count = MAX_BALLS_COUNT;
    if(isOnlyMainBall)
        count = 1; // If no powerUp 'Ball' is active, dont loop through all elements in the ball's buffer

    for(let i = 0; i < count; i++){

        // const RADIUS_TWO_THIRDS = ball.dim[0]/4; 
        var intersects = false;
    
        // Cashed Variables
        const ballTop       = balls[i].mesh.pos[1] - balls[i].mesh.dim[1]; // /1.2;
        const ballBottom    = balls[i].mesh.pos[1] + balls[i].mesh.dim[1]; // /1.2;
        const ballRight     = balls[i].mesh.pos[0] + balls[i].mesh.dim[0]; // /1.2;
        const ballLeft      = balls[i].mesh.pos[0] - balls[i].mesh.dim[0]; // /1.2;
    
        const brTop     = brpos[1] - brh;
        const brBottom  = brpos[1] + brh;
        const brRight   = brpos[0] + brw;
        const brLeft    = brpos[0] - brw;
    
        let scoreMod = 0;

        // let accel = BALL.CORNER_HIT_ACCEL;
        let accel = 1;

        if(BALL.MODE.powerBall)
        {
            if(ballRight >= brLeft && ballLeft <= brRight && 
                ballTop >= brTop && ballTop <= brBottom)
                {
                    intersects = true;
                    scoreMod = 0.5;
                    balls[i].amtx *= 1.08;
                    balls[i].amty *= 1.08;
                }
        }
        // Bricks Left Side Collision Check
        else if (ballRight >= brLeft && balls[i].mesh.pos[0] < brLeft && balls[i].xdir > 0) {

            if (balls[i].mesh.pos[1] - BALL.RADIUS_TWO_THIRDS > brTop && balls[i].mesh.pos[1] + BALL.RADIUS_TWO_THIRDS < brBottom) {
                balls[i].xdir = -accel;
                intersects = true;
                scoreMod = 0.1;
            }
            // Left Up corner collision
            else if (ballBottom - BALL.RADIUS_TWO_THIRDS > brTop && ballTop < brTop && balls[i].ydir > 0) {
                // balls[i].amtx *= 2.0;
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.2;
            }
            // Left Bottom corner collision
            else if (ballTop + BALL.RADIUS_TWO_THIRDS < brBottom && ballBottom > brBottom && balls[i].ydir < 0) {
                // balls[i].amtx *= 2.0
                balls[i].ydir = -accel;
                intersects = true;
                scoreMod = 0.2;
            }
        }
        // Bricks Right Side Collision Check
        else if (ballLeft <= brRight && balls[i].mesh.pos[0] > brRight && balls[i].xdir < 0) {

            if (balls[i].mesh.pos[1] - BALL.RADIUS_TWO_THIRDS > brTop && balls[i].mesh.pos[1] + BALL.RADIUS_TWO_THIRDS < brBottom) {
                // Collision to bricks right side
                balls[i].xdir = accel;
                intersects = true;
                scoreMod = 0.1;
            }
            else if (ballBottom - BALL.RADIUS_TWO_THIRDS > brTop && ballTop < brTop && balls[i].ydir > 0) {
                // Right Up corner collision
                // balls[i].amtx *= 2.0;
                balls[i].ydir = -accel;
                intersects = true;
                
                scoreMod = 0.2;
            }
            else if (ballTop + BALL.RADIUS_TWO_THIRDS < brBottom && ballBottom > brBottom && balls[i].ydir < 0) {
                // Right Bottom corner collision
                // balls[i].amtx *= 2.0;
                balls[i].ydir = accel;
                balls[i].ydir = accel;
                intersects = true;
                
                scoreMod = 0.2;
            }
        }
        // Bricks Bottom Side Collision Check
        else if (ballTop <= brBottom && balls[i].mesh.pos[1] > brBottom && balls[i].ydir < 0) {

            if (balls[i].mesh.pos[0] - BALL.RADIUS_TWO_THIRDS > brLeft && balls[i].mesh.pos[0] + BALL.RADIUS_TWO_THIRDS < brRight) {
                // Collision to bricks bottom side
                balls[i].ydir = accel;
                intersects = true;
                
                scoreMod = 0.1;
            }
            else if (ballRight - BALL.RADIUS_TWO_THIRDS > brLeft && ballLeft < brLeft && balls[i].xdir > 0) {
                // Bottom Left corner collision
                // balls[i].amtx *= 2.0;
                balls[i].xdir = -accel;
                balls[i].ydir = -accel;
                intersects = true;
                
                scoreMod = 0.2;
            }
            else if (ballLeft + BALL.RADIUS_TWO_THIRDS < brRight && ballRight > brRight && balls[i].xdir < 0) {
                // Bottom Right corner collision
                // balls[i].amtx *= 2.0;
                balls[i].xdir = -accel;
                balls[i].ydir = -accel;
                intersects = true;
                
                scoreMod = 0.2;
            }
        }
        // Bricks Top Side Collision Check
        else if (ballBottom >= brTop && balls[i].mesh.pos[1] < brTop && balls[i].ydir > 0) {

            if (balls[i].mesh.pos[0] - BALL.RADIUS_TWO_THIRDS > brLeft && balls[i].mesh.pos[0] + BALL.RADIUS_TWO_THIRDS < brRight) {
                // Collision to bricks Top side
                balls[i].ydir = -accel;
                intersects = true;
                
                scoreMod = 0.1;
            }
            else if (ballRight + BALL.RADIUS_TWO_THIRDS > brLeft && ballLeft < brLeft && balls[i].xdir > 0) {
                // Top Left corner collision
                // balls[i].amtx *= 2.0;
                balls[i].ydir = -accel;
                intersects = true;
                
                scoreMod = 0.2;
            }
            else if (ballLeft - BALL.RADIUS_TWO_THIRDS < brRight && ballRight > brRight && balls[i].xdir < 0) {
                // Top Right corner collision
                // balls[i].amtx *= 2.0;
                balls[i].ydir = -accel;
                intersects = true;
                
                scoreMod = 0.2;
            }
        }
  
        
        // Normalize speed
        if(balls[i].amtx > 2.6) balls[i].amtx = 2.3;
        if(balls[i].amty > 2.6) balls[i].amty = 2.8;

        if(intersects){
            UiCreateModifierValue(brpos, 1.1);
            // ModCreateAnimation(brpos, 1.1);
            UiUpdate(UI_TEXT_INDEX.SCORE_MOD, scoreMod);
            PowerUpCreate(brpos);
        }
    
        // If at least one ball intersects, return. No need to check for the rest of the balls 
        if(intersects)
            return intersects;
    }
    
    return false; // No ball intersects
}

export function BallCreatePowUpBalls(count){
    for(let i = 0; i < count; i++){
        BallCreate(GetRandomPos([20, Viewport.bottom-90], [Viewport.right-20, Viewport.bottom-120]));
    }
    isOnlyMainBall = false;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Particles */

export function BallFxCreateTail(scene){
    const meshAttr = {
        sid: SID_PARTICLES_TAIL,
        col:WHITE,
        pos: [0,0,5],
        dim:[40/2,40/2],
        scale:[1,1],
        time:0,
        style:null,
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
export function BallCreateSlowSpeedAnimation(){
    const animations = AnimationsGet();
    animations.Create(RunBallSlowSpeedAnimation, BallStopSlowSpeedAnimation);
}
function BallStopSlowSpeedAnimation(){ 
    console.log('Stop Ball Animation')
}
function RunBallSlowSpeedAnimation(){ // This is the callback to the Animations.clbk at Animations.js
    const intensity = 0.1;
    if(mainBall.speed >= 1){
        BallRedFlame(-intensity*0.9)
        mainBall.speed -= intensity*0.5;
        return true; // Ret true if animation is not over
    }
    else return false; // Ret false if animation is completed
}
/** Dim color animation */
export function BallCreateDimColorAnimation(){
    const animations = AnimationsGet(); 
    animations.Create(RunBallDimColorAnimation, BallStopDimColorAnimation);
}
function BallStopDimColorAnimation(){ 
    console.log('Stop Ball Animation')
}
function RunBallDimColorAnimation(){ // This is the callback to the Animations.clbk at Animations.js
    return mainBall.DimColor(0.03, 0.99)
}
