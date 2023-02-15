"use strict";
import { PlayerPowerUpCollision, UpdatePlayerPosX } from "../../App/Drawables/Player.js";
import { BallOnUpdate } from "../../App/Drawables/Ball.js";
import { PlayerBallCollision } from "../../App/Drawables/Player.js";
import { BrickBallCollision, BrickOnUpdate } from "../../App/Drawables/Brick.js";
import { ExplosionsUpdate } from "./Explosions.js";
// import { ParticlesCreateParticle } from "../ParticlesSystem/Particles.js";


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

    // If none of the meshes are hovered, update the global hovered pointer(pointer to hovered mesh)
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

// export function OnBallMove() {
// }

export function CheckCollisions() {
    PlayerBallCollision();
    BrickBallCollision();
    PlayerPowerUpCollision();
    ExplosionsUpdate();
}
export function Update() {
    BallOnUpdate();
    BrickOnUpdate();
}