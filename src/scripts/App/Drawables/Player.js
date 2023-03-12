"use strict";
import { GlAddMesh } from '../../Graphics/GlBuffers.js'
import { GlSetColor, GlSetDim, GlSetWpos, GlSetWposX } from '../../Graphics/GlBufferOps.js';
import { BallPlayerCollision } from './Ball.js';
import { PowerUpPlayerCollision } from './PowerUp.js';
import { Rect } from '../../Engine/Drawables/Rect.js';

const PLAYER_DEF_COLOR = BLUE_13_125_217;


// Exporting is only for the class type(to compare with the instanceof operator)
export class Player extends Rect{
    constructor(sid, col, dim, scale, tex, pos, style, speed) {
        super('player', sid, col, dim, scale, tex, pos, style, null);
        this.speed = speed;
    }

    speed = 0;
    mouseDist = 0;
    size = 0;
    xdir = 0;
    
    prevPos = [0];
    

    timeOutId = null; // To store the timer from setTimeout that is created for the animation 

    state = {         // The state in which the player may be. Mainly for animations
        inScaleAnimation: false,
        inDimAnimation: false,
        inUpScale: false,
        inDownScale: false,
        inMove: false,
    };

};

let player = null;

export function CreatePlayer(scene) {

    const style = {
        roundCorner: 4.0,
        border: 1.0,
        feather: 4.0,
    };
    PLAYER.XPOS =  Viewport.width / 2;
    PLAYER.YPOS =  Viewport.bottom - 100;
    PLAYER.WIDTH =  80.0;
    PLAYER.HEIGHT =  10.0;
    const speed = 4.0;
    const sid = SID_DEFAULT;
    const pl = new Player(
        sid, PLAYER_DEF_COLOR,
        [PLAYER.WIDTH, PLAYER.HEIGHT], [1.0, 1.0], null, [PLAYER.XPOS,  PLAYER.YPOS, 4.0],
        style, speed
    );

    pl.gfxInfo = GlAddMesh(pl.sid, pl.mesh, 1, scene, 'player', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    player = pl;

    
    return pl;
}
export function UpdatePlayerPosX(posx, mouseXdir) {

    PLAYER.XPOS = posx;
    player.mesh.pos[0] = posx;
    GlSetWposX(player.gfxInfo, posx);

    /* mouseXdir is the mouse's difference in pixels from a previous pos.
     * But also caunts as a direction. If the mouse is going left, then mouseXdir
     * is negative etc.*/
    player.xdir = mouseXdir; // Player's direction is always the mouse's direction.
    PLAYER.XDIR = player.xdir; // Store globally
    // player.state.inMove = true;
    // console.log(player.xdir)
}
export function PlayerBallCollision() {
    BallPlayerCollision(player.mesh.pos, player.mesh.dim[0], player.mesh.dim[1], player.xdir);
}
export function PlayerPowerUpCollision() {
    PowerUpPlayerCollision(player.mesh.pos, player.mesh.dim[0], player.mesh.dim[1]);
}
export function PlayerReset(){
    player.mesh.pos = player.mesh.defPos;
    GlSetWpos(player.gfxInfo, player.mesh.defPos);
    GlSetColor(player.gfxInfo, PLAYER_DEF_COLOR)
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Getters-Setters */

export function PlayerGetPos() {
    return player.mesh.pos;
}
export function PlayerGetDim() {
    return player.mesh.dim;
}
export function PlayerGetPlayer(){
    return player;
}
export function PlayerSetStateScaleAnimation(flag){
    player.state.inScaleAnimation = flag;
    player.state.inUpScale = flag;
    if(player.timeOutId){
        clearTimeout(player.timeOutId)
        player.timeOutId = null;
    }
}

export function PlayerRunEnlargeAnimation(scaleFactor){
    player.mesh.dim[0] *= scaleFactor;
    GlSetDim(player.gfxInfo, player.mesh.dim);
}

/** Dim color animation */
export function PlayerCreateDimColorAnimation(){
    // const animations = AnimationsGet(); 
    // animations.Create(PlayerDimColorStartAnimation, PlayerDimColorStopAnimation);
    // player.state.inDimAnimation = true;
}
function PlayerDimColorStopAnimation(){ 
    console.log('Stop Player Animation');
    player.state.inDimAnimation = false;
}
function PlayerDimColorStartAnimation(){ // This is the callback to the Animations.clbk at Animations.js
    if(player.state.inDimAnimation && player.mesh.col[3] > 0.2){
        player.DimColor(0.2, 0.99)
        return true;
    }
    return false;
}