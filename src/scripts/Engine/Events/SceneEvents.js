"use strict";
import { PlayerCreateDimColorAnimation, PlayerPowerUpCollision, PlayerReset, UpdatePlayerPosX } from "../../App/Drawables/Player.js";
import { BallCreateDimColorAnimation, BallCreateSlowSpeedAnimation, BallOnUpdate, BallReset } from "../../App/Drawables/Ball.js";
import { PlayerBallCollision } from "../../App/Drawables/Player.js";
import { BrickBallCollision, BrickOnUpdate, BrickReset } from "../../App/Drawables/Brick.js";
import { ExplosionsUpdate } from "../Explosions.js";
import { ScenesGetMesh, ScenesLoadScene } from "../../App/Scenes.js";
import { AnimationsGet } from "../Animations/Animations.js";
import { PowerUpReset } from "../../App/Drawables/PowerUp.js";
import { UiGetScore, UiGetTotalScore, UiSetTotalScore, UiUpdateTotalScore } from "../../App/Drawables/Ui/Ui.js";


/**
 * Check for scene's hovered meshes by the mouse
 * @param {*} scene : Enum of type SCENE.
 * @param {*} mouse : Mouse Position
 */
export function OnHover(scene, mouse) {

    let anyMeshHovered = false;
    // If the scene has buttons, check for hover
    for (let i = 0; i < scene.btnCount; i++) {

        const btn = scene.buttons[i].area;

        if (mouse.x > btn.mesh.pos[0] - btn.mesh.dim[0] &&
            mouse.x < btn.mesh.pos[0] + btn.mesh.dim[0] &&
            mouse.y > btn.mesh.pos[1] - btn.mesh.dim[1] &&
            mouse.y < btn.mesh.pos[1] + btn.mesh.dim[1]) {

            scene.buttons[i].state.inHover = true;
            g_state.hovered = scene.buttons[i];
            anyMeshHovered = true;
        }
        else {

            scene.buttons[i].state.inHover = false;
        }
    }

    // If none of the meshes are hovered, update the global state (refference to hovered mesh)
    if (!anyMeshHovered)
        g_state.hovered = null;
}

/**
 * Move Player by the mouse x position
 * @param {*} mousex : Mouse x position
 */
export function OnPlayerMove(mousex, mouseXdir) {
    UpdatePlayerPosX(mousex, mouseXdir);
}


export function CheckCollisions() {
    if(SCENE.active.idx === SCENE.stage){
        PlayerBallCollision();
        BrickBallCollision();
        PlayerPowerUpCollision();
        ExplosionsUpdate();
    }
}
export function Update() {
    if(SCENE.active.idx === SCENE.stage){
        BallOnUpdate();
        BrickOnUpdate();
    }
}

export function OnStageCompleted(){
    g_state.game.stageCompleted = false;

    // Create an animation. 
    // This will run once and will automaticaly update the animation from Renderer.Render.RunAnimations()
    BallCreateSlowSpeedAnimation();  
    PlayerCreateDimColorAnimation();
    BallCreateDimColorAnimation();

    setTimeout(ShowTotalScoreTemp, 3000);

    // Dim the whole frame's color
}

export function OnStageStart(){
    PlayerReset();
    BallReset();
    BrickReset();
    PowerUpReset();
}

function ShowTotalScoreTemp(){
    ScenesLoadScene(SCENE.finishStage);
    
    // Animate the score 
    const animations = AnimationsGet();
    animations.Create(TempIncrementScore, TempStopIncrementScore);
}

let cnt = 0;
function TempIncrementScore(){
    
    // Get the mesh TextLabel with the total score
    const scoreLabel = ScenesGetMesh(APP_MESHES_IDX.text.totalScore);
    const score = UiGetScore();
    let totalScore = UiGetTotalScore();
    totalScore++;
    scoreLabel.ChangeText('Total Score: ' + totalScore);
    UiSetTotalScore(totalScore);

    // Implement a way to skip or speed up the total score increment
    if(totalScore < score) return true;

    return false; // Stop the animation
}

function TempStopIncrementScore(){
    UiUpdateTotalScore();
    // Reset stage score
}


