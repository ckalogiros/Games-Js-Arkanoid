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
    
        sid     = 0;
    
        mesh    = null;
        gfxInfo = null;
    
        type = 'NULL'; // The type of the power up
        isActive     = false;
        inAnimation = false;

    constructor(sid, col, dim, scale, tex, pos, style) {
        this.sid = sid;
        this.mesh = new Mesh(col, dim, scale, tex, pos, style, null, null);
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
};

export class PowerUps{

    powUp = [];
    count = 0;
    size = POWUPS_MAX_COUNT;

    // We dont use the constructor because power ups nedd to be initialized in specific time order
    Init(){
        const sid = SID_EXPLOSION2;
        const gfxInfo = GlCreateReservedBuffer(sid, SCENE.stage, 'PowerUp');
        
        const style = {
            roundCorner: 0.0,
            border: 2.0,
            feather: 14.0,
        };
        for(let i = 0; i < this.size; i++){

            this.powUp[i] = new PowerUp(sid, TRANSPARENT, [28, 14, 0], [1,1], null,  [0,0,3], style);
            this.powUp[i].isActive = false;
            this.powUp[i].gfxInfo = GlAddMesh(this.powUp[i].sid, this.powUp[i].mesh, 1, 
                                        gfxInfo.sceneIdx, 'PowUp', DONT_CREATE_NEW_GL_BUFFER, gfxInfo.vb.idx);
        }
    }
    Reset(){
        for(let i=0; i<this.size; i++){
            this.Destroy(i);
        }
    }
    Destroy(idx){
        GlSetColorAlpha(this.powUp[idx].gfxInfo, 0.0);
        this.powUp[idx].isActive = false;
        this.count--;
    }
    GetNextFree(){
        for (let i = 0; i < this.size; i++) {
            if(!this.powUp[i].isActive){
                this.count++;
                return this.powUp[i];
            }
        }
        return null;
    }
    RunAnimation(){
        const yPosAdvance = 3.0;

        for(let i = 0; i < POWUPS_MAX_COUNT; i++){
            
            if(this.powUp[i].inAnimation){
    
                this.powUp[i].mesh.pos[1] += yPosAdvance;
                GlSetWpos(this.powUp[i].gfxInfo, this.powUp[i].mesh.pos);
                
                if(this.powUp[i].mesh.pos[1] > Viewport.bottom + 100){
                    this.powUp[i].inAnimation = false;
                    this.powUp[i].isActive = false;
                    this.Destroy(i);
                }
            }
        }
    }
    DimColor(){
        const len = this.powUp.length;
        for(let i=0; i<len; i++){
            const col = DimColor(this.powUp[i].mesh.col);
            GlSetColor(this.powUp.gfxInfo, col)
            this.powUp[i].mesh.col = col;
        }
    }
}

let powUps = new PowerUps;
export function PowerUpGet(){
    return powUps;
}



export function PowerUpInit(){

    powUps.Init();
}

export function PowerUpCreate(brickPos) {
    
    let pos = [];
    pos[0] = brickPos[0];
    pos[1] = brickPos[1];
    pos[2] = -5;

    const powUp = powUps.GetNextFree();
    const color = GetRandomColor();
    powUp.type = POWUP_TYPES_ARRAY[GetRandomInt(0, POWUP_TYPES_ARRAY.length)];
    GlSetColor(powUp.gfxInfo, color);
    math.CopyArr4(powUp.mesh.col, color);
    
    // Set as position the bricks position
    GlSetWpos(powUp.gfxInfo, pos);
    powUp.mesh.pos[0] = pos[0];
    powUp.mesh.pos[1] = pos[1];
    pos[0] += powUp.mesh.dim[0]*2;

    powUp.isActive    = true;
    powUp.inAnimation = true;

    // for(let i = 0; i < POWUPS_MAX_COUNT; i++){

    //     if(!powUps.powUp[i].isActive){
                               
    //         // TODO: Color powUp by type 
    //         const color = GetRandomColor();
    //         // powUps.powUp[i].type = POWUP_TYPES.ENLARGE_PLAYER;
    //         powUps.powUp[i].type = POWUP_TYPES_ARRAY[GetRandomInt(0, POWUP_TYPES_ARRAY.length)];
    //         GlSetColor(powUps.powUp[i].gfxInfo, color);
    //         math.CopyArr4(powUps.powUp[i].mesh.col, color);
            
    //         // Set as position the bricks position
    //         GlSetWpos(powUps.powUp[i].gfxInfo, pos);
    //         powUps.powUp[i].mesh.pos[0] = pos[0];
    //         powUps.powUp[i].mesh.pos[1] = pos[1];
    //         pos[0] += powUps.powUp[i].mesh.dim[0]*2;

    //         powUps.powUp[i].isActive    = true;
    //         powUps.powUp[i].inAnimation = true;

    //         return;
    //     }
    // }
}

export function PowerUpReset(){
    // Destroy any active Power Up
    powUps.Reset();
}



export function PowerUpPlayerCollision(plPos, plw, plh) {

    let scoreMod = 0;
    
    for(let i = 0; i < POWUPS_MAX_COUNT; i++){
        
        const powpos = powUps.powUp[i].mesh.pos;
        const poww = powUps.powUp[i].mesh.dim[0];
        const powh = powUps.powUp[i].mesh.dim[1];
        if(powUps.powUp[i].isActive){
            if (
                plPos[0] + plw >= powpos[0] - poww &&
                plPos[0] - plw <= powpos[0] + poww &&
                plPos[1] + plh >= powpos[1] - powh &&
                plPos[1] - plh <= powpos[1] + powh
                ){
                    // DestroyPowerUp(i);
                    scoreMod  = 0.5;
                    // UiCreateModifierValue(powpos, scoreMod);
                    console.log('-------1:', powUps.powUp[i].mesh.pos[0])
                    UiCreateModifierValue(powUps.powUp[i].mesh.pos, scoreMod);
                    UiUpdate(UI_TEXT_INDEX.SCORE_MOD, scoreMod);
                    powUps.Destroy(i);

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

    // powUps.RunAnimation();

    const yPosAdvance = 3.0;

    for(let i = 0; i < POWUPS_MAX_COUNT; i++){
        
        if(powUps.powUp[i].inAnimation){

            powUps.powUp[i].mesh.pos[1] += yPosAdvance;
            GlSetWpos(powUps.powUp[i].gfxInfo, powUps.powUp[i].mesh.pos);
            
            if(powUps.powUp[i].mesh.pos[1] > Viewport.bottom + 100){
                powUps.powUp[i].inAnimation = false;
                powUps.powUp[i].isActive = false;
                // DestroyPowerUp(i);
                powUps.Destroy(i);
            }
        }
    }
}

// TODO: Put this func in class PowerUps as a method
function DestroyPowerUp(idx){

    GlSetColorAlpha(powUps.powUp[idx].gfxInfo, 0.0);
    powUps.powUp[idx].isActive = false;
}