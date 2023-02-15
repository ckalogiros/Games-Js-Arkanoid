"use strict";
import { GlDraw } from '../../Graphics/GlDraw.js'
import { fps } from '../Timer/Timer.js';
import { HandleEvents } from '../Events/Events.js';
import { RunAnimations } from '../Animations/Animations.js';
import { BallGetBall } from '../../App/Drawables/Ball.js';
import { CheckCollisions, Update } from '../Events/SceneEvents.js';
import { Abs } from '../../Helpers/Math/MathOperations.js'
import { OnMouseMove } from '../Events/MouseEvents.js';
import { GlGetProgram } from '../../Graphics/GlProgram.js';
import { TimersUpdateTimers } from '../Timer/Timer.js';


export function Render() {
    
    fps.Start();
    
    
    if (g_state.game.paused === false) {
        
        TimersUpdateTimers();

        HandleEvents();
        RunAnimations();
        CheckCollisions();
        Update();
        
        OnMouseMove();
        // UpdateFireBall();

        GlDraw();
    }
    
    requestAnimationFrame(function () { Render(); });
    
    fps.Stop();
}


let time = 0.0;
let XDIR = 1.0;
let YDIR = 1.0;
const C  = 0.01; 

function UpdateFireBall(){

    const prog = GlGetProgram(UNIFORM_PARAMS.fireBall.progIdx);
    if(!prog) return;
    time += 0.01;

    let ball = BallGetBall();
    let ballPos = ball.mesh.pos;
    
    const xamt = C *Abs(ball.xdir*ball.amtx*ball.speed);
    const yamt = C *Abs(ball.ydir*ball.amty*ball.speed);
    
    if(ball.xdir > 0.){XDIR -= xamt;}
    else if(ball.xdir < 0.) {XDIR += xamt;}
    if(ball.ydir > 0.) {YDIR += yamt;}
    else if(ball.ydir < 0.) {YDIR -= yamt;}

    prog.UniformsSetParamsBufferValue(XDIR, UNIFORM_PARAMS.fireBall.mouseXdir);
    prog.UniformsSetParamsBufferValue(YDIR, UNIFORM_PARAMS.fireBall.mouseYdir);
    prog.UniformsSetParamsBufferValue(time, UNIFORM_PARAMS.fireBall.mouseTimeidx);
    prog.UniformsSetParamsBufferValue(ballPos[0], UNIFORM_PARAMS.fireBall.mouseXPosIdx);
    prog.UniformsSetParamsBufferValue(ballPos[1], UNIFORM_PARAMS.fireBall.mouseYPosIdx);
    prog.UniformsSetParamsBufferValue(ball.amtx, UNIFORM_PARAMS.fireBall.temp1Idx);
    prog.UniformsSetParamsBufferValue(ball.amty, UNIFORM_PARAMS.fireBall.temp2Idx);
    prog.UniformsSetParamsBufferValue(ball.xdir, UNIFORM_PARAMS.fireBall.temp3Idx);
    prog.UniformsSetParamsBufferValue(ball.ydir, UNIFORM_PARAMS.fireBall.temp4Idx);
    

    
}



// function UpdateExplosions(){

//     const mouse = MouseGetMouse();

//     const prog = GlGetProgram(UNIFORM_PARAMS.brickExplosion.progIdx);
//     // prog.UniformsSetParamsBufferValue(time,    UNIFORM_PARAMS.brickExplosion.timeIdx);     
//     prog.UniformsSetParamsBufferValue(mouse.x, UNIFORM_PARAMS.brickExplosion.mouseXPosIdx);
//     prog.UniformsSetParamsBufferValue(mouse.y, UNIFORM_PARAMS.brickExplosion.mouseYPosIdx);
    
//     // TEMP. Manualy insert positions to the exposion uniform buffer shader
//     // const gl = gfxCtx.gl;
//     // prog.shaderInfo.uniforms.positionsBuffer[0] = 200.;
//     // prog.shaderInfo.uniforms.positionsBuffer[1] = 100.;
// }

