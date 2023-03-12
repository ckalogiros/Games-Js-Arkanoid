"use strict";
import { ScenesLoadScene } from "../../App/Scenes.js";
import { OnHover, OnPlayerMove, OnStageStart } from "./SceneEvents.js";
import { ScenesGetScene } from "../../App/Scenes.js";
import { BallGetInStartPos, BallRelease, BallReset } from "../../App/Drawables/Ball.js";
import { StageGetNextStage } from "../../App/Stages.js";



const mouse = {
    x: 0,
    y: 0,
    xprev: 0, // Mouse previous x pos
    yprev: 0, // Mouse previous y pos
    xdiff: 0, // Mouse X difference in pixels(from previous mesurment)
    ydiff: 0, // Mouse X difference in pixels(from previous mesurment)
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Getters-Setters */

export function MouseGetMouse() {
    return mouse;
}
export function MouseGetPos() {
    return [mouse.x, mouse.y];
}
export function MouseGetDir() {
    return [mouse.xdiff,mouse.ydiff];
}
export function MouseGetXdir() {
    return mouse.xdiff;
}
export function MouseGetYdir() {
    return mouse.ydiff;
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Listeners */

export function OnMouseMove(event) {

    if(!event){
        mouse.xprev = mouse.x;
        mouse.yprev = mouse.y;
        return;
    }

    mouse.xprev = mouse.x;
    mouse.yprev = mouse.y;

    mouse.x = event.clientX - Viewport.leftMargin; 
    mouse.y = event.clientY + Viewport.topMargin;  

    mouse.xdiff = mouse.x - mouse.xprev;
    mouse.ydiff = -(mouse.y - mouse.yprev); // Reverse the direction(negative for down dir and positive for up dir) 

    const scene = ScenesGetScene(SCENE.active.idx);

    if(scene){
        OnHover(scene, mouse);
    }

    if (scene.sceneIdx === SCENE.stage) {
        // Move Player 
        OnPlayerMove(mouse.x, mouse.xdiff);
    }

}



export function OnMouseClick(event) {

    { // For Debuging
        console.log('x:', mouse.x, 'y:', mouse.y);
    }

    if (g_state.hovered) {

        switch (g_state.hovered.name) {
            // Load Start Menu Scene on pressing the 'Back' button
            case 'ReturnBtn': {
                ScenesLoadScene(SCENE.startMenu);
                break;
            }
            case 'PlayBtn': {
                ScenesLoadScene(SCENE.startStage);
                break;
            }
            case 'startStageBtn': {
                OnStageStart();
                ScenesLoadScene(SCENE.stage);
                StageGetNextStage();
                break;
            }
            case 'ContinueBtn': {
                OnStageStart();
                ScenesLoadScene(SCENE.stage);
                StageGetNextStage();
                break;
            }
        }
    }

    // If mouse clicked and ball is not moving(start of a stage), release the ball
    else if (BallGetInStartPos() && SCENE.active.idx === SCENE.stage &&
        mouse.x > Viewport.left && mouse.x < Viewport.right && 
        mouse.y > Viewport.top && mouse.y < Viewport.bottom)
        BallRelease();
}

