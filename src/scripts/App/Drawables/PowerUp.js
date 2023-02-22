"use strict";
import * as math from "../../Helpers/Math/MathOperations.js"
import { Mesh } from "../../Engine/Drawables/Mesh.js";
import { GlSetColor, GlSetColorAlpha, GlSetWpos } from "../../Graphics/GlBufferOps.js";
import { GlAddMesh, GlCreateReservedBuffer } from "../../Graphics/GlBuffers.js";
import { GetRandomColor, GetRandomInt } from "../../Helpers/Helpers.js";
import { UiCreateModifierValue, UiUpdate } from "./Ui/Ui.js";
import { BallCreatePowUpBalls } from "./Ball.js";
import { PlayerSetStateAnimation } from "./Player.js";

const POWUPS_MAX_COUNT = 32;
const POWUP_TYPES = {
    BALL: 0,
    GUN: 1,
    ENLARGE_PLAYER: 2,
    POWER_BALL: 3,

    COUNT: 3,
};
const POWUP_TYPES_ARRAY = [];
// const POWUP_TYPES_ARRAY = [POWUP_TYPES.ENLARGE_PLAYER];
// const POWUP_TYPES_ARRAY = [POWUP_TYPES.POWER_BALL];
// const POWUP_TYPES_ARRAY = [POWUP_TYPES.ENLARGE_PLAYER, POWUP_TYPES.POWER_BALL];
// const POWUP_TYPES_ARRAY = [POWUP_TYPES.BALL, POWUP_TYPES.POWER_BALL];
// const POWUP_TYPES_ARRAY = [POWUP_TYPES.ENLARGE_PLAYER, POWUP_TYPES.BALL];


class PowerUp {

    constructor(sid, col, dim, scale, tex, pos, style) {
        this.sid = sid;
        this.mesh = new Mesh(col, dim, scale, tex, pos, style, null);
    }

    sid     = 0;

    mesh    = null;
    gfxInfo = null;

    type = 'NULL'; // The type of the power up
    isEmpty     = false;
    inAnimation = false;
};

class PowerUps{

    powUp = [];
    count = 0;
}

let powUps = new PowerUps;



export function PowerUpInit(){

    const sid = SID_EXPLOSION2;
    const gfxInfo = GlCreateReservedBuffer(sid, SCENE.play, 'ReservedBuffer2');
    
    const style = {
        roundCorner: 0.0,
        border: 2.0,
        feather: 14.0,
    };

    for(let i = 0; i < POWUPS_MAX_COUNT; i++){

        powUps.powUp[i] = new PowerUp(sid, TRANSPARENT, [28, 14, 0], [1,1], null,  [0,0,3], style);
        powUps.powUp[i].isEmpty = true;
        // powUps.powUp[i].gfxInfo = GlAddMesh(SID_DEFAULT, powUps.powUp[i].mesh, 1, gfxInfo.sceneId, DONT_CREATE_NEW_GL_BUFFER, gfxInfo.vb.idx);
        powUps.powUp[i].gfxInfo = GlAddMesh(powUps.powUp[i].sid, powUps.powUp[i].mesh, 1, gfxInfo.sceneId, DONT_CREATE_NEW_GL_BUFFER, gfxInfo.vb.idx);
    }
    
}

export function PowerUpCreate(brickPos) {
    
    let pos = [];
    pos[0] = brickPos[0];
    pos[1] = brickPos[1];
    pos[2] = -5;

    for(let i = 0; i < POWUPS_MAX_COUNT; i++){

        if(powUps.powUp[i].isEmpty){
                               
            // TODO: Color powUp by type 
            const color = GetRandomColor();
            // powUps.powUp[i].type = POWUP_TYPES.ENLARGE_PLAYER;
            powUps.powUp[i].type = POWUP_TYPES_ARRAY[GetRandomInt(0, POWUP_TYPES_ARRAY.length)];
            GlSetColor(powUps.powUp[i].gfxInfo, color);
            math.SetArr4(powUps.powUp[i].mesh.col, color);
            
            // Set as position the bricks position
            GlSetWpos(powUps.powUp[i].gfxInfo, pos);
            powUps.powUp[i].mesh.pos[0] = pos[0];
            powUps.powUp[i].mesh.pos[1] = pos[1];
            pos[0] += powUps.powUp[i].mesh.dim[0]*2;

            powUps.powUp[i].isEmpty     = false;
            powUps.powUp[i].inAnimation = true;

            return;
        }
    }
}

export function PowerUpPlayerCollision(plPos, plw, plh) {

    let scoreMod = 0;
    
    for(let i = 0; i < POWUPS_MAX_COUNT; i++){
        
        const powpos = powUps.powUp[i].mesh.pos;
        const poww = powUps.powUp[i].mesh.dim[0];
        const powh = powUps.powUp[i].mesh.dim[1];
        if(!powUps.powUp[i].isEmpty){
            if (
                plPos[0] + plw >= powpos[0] - poww &&
                plPos[0] - plw <= powpos[0] + poww &&
                plPos[1] + plh >= powpos[1] - powh &&
                plPos[1] - plh <= powpos[1] + powh
                ){
                    DestroyPowerUp(i);
                    scoreMod  = 0.5;
                    UiCreateModifierValue(powpos, scoreMod);
                    UiUpdate(UI_TEXT_INDEX.SCORE_MOD, scoreMod);

                    // Set PowerUps
                    if(powUps.powUp[i].type == POWUP_TYPES.BALL){
                        BallCreatePowUpBalls(10);
                    }
                    else if(powUps.powUp[i].type == POWUP_TYPES.GUN){
                    }
                    else if(powUps.powUp[i].type == POWUP_TYPES.ENLARGE_PLAYER){
                        PlayerSetStateAnimation(true)
                    }
                    else if(powUps.powUp[i].type == POWUP_TYPES.POWER_BALL){
                        
                        BALL.MODE.powerBall = true;
                        // setInterval(function(){
                        //     BALL.MODE.powerBall = false;
                        // }, 2000);
                    }
            }
        }
    }
}

export function PowerUpRunAnimation(){

    const yPosAdvance = 3.0;

    for(let i = 0; i < POWUPS_MAX_COUNT; i++){
        
        if(powUps.powUp[i].inAnimation){

            powUps.powUp[i].mesh.pos[1] += yPosAdvance;
            GlSetWpos(powUps.powUp[i].gfxInfo, powUps.powUp[i].mesh.pos);
            
            if(powUps.powUp[i].mesh.pos[1] > Viewport.bottom + 100){
                powUps.powUp[i].inAnimation = false;
                powUps.powUp[i].isEmpty = true;
                DestroyPowerUp(i);
            }
        }
    }
}

function DestroyPowerUp(idx){

    GlSetColorAlpha(powUps.powUp[idx].gfxInfo, 0.0);
    powUps.powUp[idx].isEmpty = true;
}