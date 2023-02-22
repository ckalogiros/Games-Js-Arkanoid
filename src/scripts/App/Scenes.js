"use strict";
import { CreatePlayer } from './Drawables/Player.js';
import { CreateButton } from '../Engine/Drawables/Widgets/Button.js';
import { BallCreate, BallCreateTail, BallSetSpeed } from './Drawables/Ball.js';
import { BrickCreateParticleSystem, BrickGetBricksBuffer, CreateBrick } from './Drawables/Brick.js';
import { GlGetVB } from '../Graphics/GlProgram.js';
import { RectCreateRect } from '../Engine/Drawables/Rect.js';
import { CalcTextWidth } from '../Engine/Drawables/Text.js';
import { DarkenColor } from '../Helpers/Helpers.js';
import { UiCreateScore, UiCreateScoreModifier, UiCreateLives } from './Drawables/Ui/Ui.js';
import { GlAddMesh, GfxSetVbShowFromSceneId, GfxSetVbShow } from '../Graphics/GlBuffers.js';
import { BallsInit } from './Drawables/Ball.js';
import { ExplosionsGet, ExplosionsInit } from '../Engine/Events/Explosions.js';

// TEMP
export let fireMesh = null;

let cnt = 0;
const APP_MESHES_IDX = {
    background:{
        startMenu: cnt++,
        stages: cnt++,
    },
    buttons:{
        play: cnt++,
        options: cnt++,
        menuStage: cnt++,
        backStage: cnt++,
    },
    player: cnt++,
    balls: cnt++,
    bricks: cnt++,
    fx:{
        ballTail: cnt++,
        explosions: cnt++,
    },

    count: cnt
};

class Scene {

    constructor(sceneId) {
        this.sceneId = sceneId;
    }

    sceneId = 0; // Scene ID (of type: SCENE const structure).
    name = ''; // Scene name
    meshes = []; // Store a ref for each mesh of the current scene

};

class Scenes {

    scene = [];
    sceneCount = 0;

    allMeshes = [];
    allMeshesCount = 0;

    gfxBuffers = [];

    count = APP_MESHES_IDX.count;

    AddScene(scene){
        this.scene[this.sceneCount++] = scene;
        return this.sceneCount-1;
    }
    InitAllMeshesBuffer(){ // Initialize the buffer to the count of all meshes(APP_MESHES_IDX.count)
        for(let i=0; i<this.count; i++){
            this.allMeshes[i] = null;
        }
    }
    AddMesh(mesh, gfxInfo, idx){
        this.allMeshes[idx] = mesh;
        // Store the Graphics Buffer Index for this mesh
        this.StoreGfxBuffer(gfxInfo)
    }

    /** Graphics */
    StoreGfxBuffer(gfxInfo){ // This is the way for a scene to know what and how many gfx buffers it's meshes have
        // Check if gfx buffer index already stored
        let found = false;
        const len = this.gfxBuffers.length;
        for(let i=0; i<len; i++){
            if( this.gfxBuffers[i].progIdx === gfxInfo.prog.idx  
                && this.gfxBuffers[i].vbIdx === gfxInfo.vb.idx){
                found = true;
            }
        }
        // If gfx buffer is not stored, store it
        if(!found) {
            this.gfxBuffers.push({progIdx:gfxInfo.prog.idx, vbIdx:gfxInfo.vb.idx}); 
        }
    }
    SetAllGfxBuffersToHidden(){
        const len = this.gfxBuffers.length;
        for(let i=0; i<len; i++){
            GfxSetVbShow(this.gfxBuffers[i].progIdx, this.gfxBuffers[i].vbIdx, false)
        }
    }

};

const scenes = new Scenes;

export function ScenesCreateAllMeshes() {

    // Must initialize a meshes buffer, with count the count of all app's meshes,
    // so that we are able to add meshes to any index(not in consecutive order)  base on the const struct APP_MESHES_IDX
    scenes.InitAllMeshesBuffer();

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Backgrounds */
    // Create A Window background
    const mainWindow = {
        dim: [Viewport.width / 2, Viewport.height / 2],
        pos: [Viewport.width / 2, Viewport.height / 2, -1],
        style: {
            pad: 10,
            roundCorner: 6,
            border: 8,
            feather: 30,
        },
    };
    // Create A Window background
    // const startMenuBackground = RectCreateRect('startMenuBackground', SID_DEFAULT|FR_0, DarkenColor(MAGENTA_BLUE, 0.3), 
    const startMenuBackground = RectCreateRect('startMenuBackground', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.3),
        mainWindow.dim, [1, 1], null, mainWindow.pos, mainWindow.style);
    startMenuBackground.gfxInfo = GlAddMesh(startMenuBackground.sid, startMenuBackground.mesh, 1, SCENE.startMenu,
        DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    scenes.AddMesh(startMenuBackground, startMenuBackground.gfxInfo, APP_MESHES_IDX.background.startMenu);
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Backgrounds */


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Buttons */
    let btnDim = [100, 20];
    let btnPos = [0, 150, 0];
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 3,
        feather: 12,
    };
    let fontSize = 20;

    // Create pay button
    const playBtn = CreateButton(SCENE.startMenu, 'PlayBtn', 'Play',
                    WHITE, DarkenColor(YELLOW_229_206_0, 0.1), btnDim, btnPos,
                    style, fontSize, true, ALIGN.CENTER_HOR | ALIGN.TOP);
    // Add play button to scenes mesh to buffer
    scenes.AddMesh(playBtn, playBtn.text.gfxInfo, APP_MESHES_IDX.buttons.play);

    // Options (in main start menu) button
    btnPos[1] += playBtn.area.mesh.dim[1] * 2 + style.pad + style.border + style.feather; // Set next button's y pos (just bellow the prev button)
    const optionsBtn = CreateButton(SCENE.startMenu, 'OptionsBtn', 'Options',
        WHITE, DarkenColor(MAGENTA_RED, 0.1), btnDim, btnPos,
        style, fontSize, true, ALIGN.CENTER_HOR | ALIGN.TOP);
    scenes.AddMesh(optionsBtn, optionsBtn.text.gfxInfo, APP_MESHES_IDX.buttons.options);


    // Back button
    fontSize = 10;
    // btnPos[0] = style.pad * 2 + style.border + style.feather + 20;
    btnPos[1] = style.pad * 2 + style.border + style.feather;
    btnDim = [0, 0];
    btnDim[0] = CalcTextWidth('Back', fontSize, btnDim, style);
    const backBtn = CreateButton(SCENE.play, 'ReturnBtn', 'Back', WHITE, BLUE_13_125_217, 
                    btnDim, btnPos, style, fontSize, true, ALIGN.LEFT | ALIGN.TOP);
    scenes.AddMesh(backBtn, backBtn.text.gfxInfo, APP_MESHES_IDX.buttons.backStage);

    // Options (in stage scenes) button
    btnDim[0] = CalcTextWidth('MENU', fontSize);
    // btnPos[0] *= -1; // Padd for the right must be negative
    btnPos[0] = -20; // Padd fro the right must be negative
    const menuStageBtn = CreateButton(SCENE.play, 'MenuBtn', 'MENU', WHITE, BLUE_13_125_217, 
                        btnDim, btnPos, style, fontSize, true, ALIGN.RIGHT | ALIGN.TOP);
    scenes.AddMesh(menuStageBtn, menuStageBtn.text.gfxInfo, APP_MESHES_IDX.buttons.menuStage);

    // Connect the font texture of (for button's text) with the vertex buffer for text rendering. 
    // Get the vertexBuffer for the text rendering Gfx program of of any button mesh(assuming all buttons have text)
    const vb = GlGetVB(menuStageBtn.text.gfxInfo.prog.idx, menuStageBtn.text.gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; // TODO: Temporary binding of the font texture to the text rendering VertexBuffer
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * End Buttons */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Player */
    const player = CreatePlayer(SCENE.play);
    scenes.AddMesh(player, player.gfxInfo, APP_MESHES_IDX.player);
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Ball */
   BallsInit(SCENE.play); // Initialize Ball's buffer
   const ball = BallCreate(SCENE.play, [Viewport.width / 2, Viewport.bottom - 82]);
   scenes.AddMesh(ball, ball.gfxInfo, APP_MESHES_IDX.balls);
   
   /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * fx */
  // Exlosions
  const explosions = ExplosionsGet();
  explosions.Init(); // Initialize explosions Graphics
  scenes.AddMesh(explosions, explosions.buffer[0].gfxInfo, APP_MESHES_IDX.fx.explosions);
  // Ball tail fx
  const ballTailFx = BallCreateTail(28, 40, SCENE.play);
  scenes.AddMesh(ballTailFx, ballTailFx.buffer[0].gfxInfo, APP_MESHES_IDX.fx.ballTail);

   /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Bricks: Create only the skeleton buffer for the bricks*/
  // TODO: temp sceneId. Must change the logic of having to send a sceneId to the GlAddMesh function
  const sceneId = 0;
  const bricks = TempCreateBricks(sceneId);
  scenes.AddMesh(bricks, bricks[0].gfxInfo, APP_MESHES_IDX.bricks);

  // Finaly after creating all the app's meshes and their respective Graphics programs and buffers,
  // set the gfx buffers to 'hidden', so that the meshhes will not been drawn until the function
  // ScenesLoadScene enables the apropriate Gfx buffers.
  scenes.SetAllGfxBuffersToHidden();
}


export function GetScene(idx) {

    if (idx < 0 || idx > scenes.count)
        alert('Scene Index Out Of Bounds!');

    return scenes.scene[idx];
}


export function ScenesCreateScene(sceneId) {
    switch (sceneId) {
        case SCENE.startMenu: {

            const sceneIdx = scenes.AddScene(new Scene(SCENE.startMenu));

            // Add here all required meshes, for this specific scene, to the scene's buffer
            scenes.scene[sceneIdx].meshes.push(scenes.allMeshes[APP_MESHES_IDX.background.startMenu]);
            scenes.scene[sceneIdx].meshes.push(scenes.allMeshes[APP_MESHES_IDX.buttons.play]);
            scenes.scene[sceneIdx].meshes.push(scenes.allMeshes[APP_MESHES_IDX.buttons.options]); 

            scenes.scene[sceneIdx].sceneId = sceneId;
            scenes.scene[sceneIdx].name = SceneGetSceneName(sceneIdx);
            // Update global state
            SCENE.active.id = sceneId;
            SCENE.active.idx = sceneIdx;
            break;
        }
        case SCENE.play: {

            const sceneIdx = scenes.count;
            scenes.count++;
            scenes.scene[sceneIdx] = new Scene(SCENE.play);

            // Add here all required meshes, for this specific scene, to the scene's buffer
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.background.stages]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.buttons.backStage]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.buttons.menuStage]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.player]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.balls]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.fx.ballTail]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.fx.explosions]);
            scenes.scene[sceneIdx].mesh.push(scenes.allMeshes[APP_MESHES_IDX.bricks]);

            scenes.scene[sceneIdx].sceneId = sceneId;
            scenes.scene[sceneIdx].name = SceneGetSceneName(sceneIdx);
            // Update global state
            SCENE.active.id = sceneId;
            SCENE.active.idx = sceneIdx;
            break;
        }
    }
}

// export function CreateScene(sceneId) {

//     switch (sceneId) {

//         case SCENE.startMenu: {

//             const sceneIdx = scenes.count;
//             scenes.count++;
//             scenes.scene[sceneIdx] = new Scene(SCENE.startMenu);

//             CreateStartMenuScene(sceneIdx);

//             scenes.scene[sceneIdx].sceneId = sceneId;
//             SCENE.active.id = sceneId;
//             SCENE.active.idx = sceneIdx;
//             break;
//         }
//         case SCENE.play: {

//             const sceneIdx = scenes.count;
//             scenes.count++;
//             scenes.scene[sceneIdx] = new Scene(SCENE.play);

//             CreatePlayScene(sceneIdx);

//             scenes.scene[sceneIdx].sceneId = sceneId;
//             SCENE.active.id = sceneId;
//             SCENE.active.idx = sceneIdx;
//             break;
//         }
//     }
// }

export function StageCompleted() {
    CreatePlayScene(SCENE.play);
}
// export function LoadScene(sceneId) {

//     // If there is a loaded scene and it's not the one we are trying to load..
//     if (SCENE.active.id && sceneId !== SCENE.active.id) {

//         const idx = SCENE.active.idx;
//         // .. deactivate scene
//         for (let j = 0; j < scenes.scene[idx].btnCount; j++) {

//             scenes.scene[idx].buttons[j].area.display = false;
//             scenes.scene[idx].buttons[j].text.display = false;
//             GfxSetVbShowFromSceneId(SCENE.active.id, false);
//         }

//         if (scenes.scene[idx].player) {
//             scenes.scene[idx].player.display = false;
//             GfxSetVbShowFromSceneId(SCENE.active.id, false);
//         }

//         SCENE.active.id = SCENE.none;
//         SCENE.active.idx = -1;
//     }

//     for (let i = 0; i < scenes.count; i++) {

//         if (sceneId === scenes.scene[i].sceneId) {

//             // Activate button meshes and their gfx buffers
//             if (scenes.scene[i].btnCount) {

//                 for (let j = 0; j < scenes.scene[i].btnCount; j++) {
//                     scenes.scene[i].buttons[j].area.display = true;
//                     scenes.scene[i].buttons[j].text.display = true;

//                     GfxSetVbShowFromSceneId(sceneId, true);

//                     SCENE.active.id = sceneId;
//                     SCENE.active.idx = i;
//                 }
//             }

//             if (scenes.scene[i].player) {
//                 scenes.scene[i].player.display = true;
//                 GfxSetVbShowFromSceneId(sceneId, true);
//             }

//         }
//     }

// }
export function ScenesLoadScene(sceneId) {

    // If there is a loaded scene and it's not the one we are trying to load..
    if (SCENE.active.id && sceneId !== SCENE.active.id) {

        const idx = SCENE.active.idx;
        // .. deactivate scene's meshes Graphics programs
        for (let j = 0; j < scenes.scene[idx].btnCount; j++) {

            scenes.scene[idx].buttons[j].area.display = false;
            scenes.scene[idx].buttons[j].text.display = false;
            GfxSetVbShowFromSceneId(SCENE.active.id, false);
        }

        if (scenes.scene[idx].player) {
            scenes.scene[idx].player.display = false;
            GfxSetVbShowFromSceneId(SCENE.active.id, false);
        }

        SCENE.active.id = SCENE.none;
        SCENE.active.idx = -1;
    }

    for (let i = 0; i < scenes.count; i++) {

        if (sceneId === scenes.scene[i].sceneId) {

            // Activate button meshes and their gfx buffers
            if (scenes.scene[i].btnCount) {

                for (let j = 0; j < scenes.scene[i].btnCount; j++) {
                    scenes.scene[i].buttons[j].area.display = true;
                    scenes.scene[i].buttons[j].text.display = true;

                    GfxSetVbShowFromSceneId(sceneId, true);

                    SCENE.active.id = sceneId;
                    SCENE.active.idx = i;
                }
            }

            if (scenes.scene[i].player) {
                scenes.scene[i].player.display = true;
                GfxSetVbShowFromSceneId(sceneId, true);
            }

        }
    }

}

function CreateStartMenuScene(sceneIdx) {

    // Create A Window background
    const mainWindow = {
        dim: [Viewport.width / 2, Viewport.height / 2],
        pos: [Viewport.width / 2, Viewport.height / 2, -1],
        style: {
            pad: 10,
            roundCorner: 6,
            border: 8,
            feather: 30,
        },
    };
    // Create A Window background
    // const startMenuBackground = RectCreateRect('startMenuBackground', SID_DEFAULT|FR_0, DarkenColor(MAGENTA_BLUE, 0.3), 
    const startMenuBackground = RectCreateRect('startMenuBackground', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.3),
        mainWindow.dim, [1, 1], null, mainWindow.pos, mainWindow.style);
    startMenuBackground.gfxInfo = GlAddMesh(startMenuBackground.sid, startMenuBackground.mesh, 1, SCENE.startMenu,
        DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


    const btnDim = [100, 20];
    let btnPos = [0, 150, 0];
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 3,
        feather: 12,
    };
    const fontSize = 20;

    /**
     * scenes class should push an object(button, player, ball,...) in the .scene[] array,
     * Also we have to be able to check if a specific object is already created and pushed to a specific scene[] as an element
     * so that we do not make duplicate initializations for the graphics buffers.
     * 
     * One solution would be: The scenes class have all the game objects as member variables,
     * + in situations like object:button should have an array to store all buttons of a scene.
     * Another solution would be to have an abstract array and push all objects to the array as references,
     * and compare them by an id or by a name(scene.push(playButton), scene.push(uiLifes), scene.push(player), ...)
     *      
     */

    let btnIdx = scenes.scene[sceneIdx].btnCount;	// Get next free element in the buttons array.
    scenes.scene[sceneIdx].btnCount++;				// Update buttons count.
    const btn1 = CreateButton(SCENE.startMenu, 'PlayBtn', 'Play',
        WHITE, DarkenColor(YELLOW_229_206_0, 0.1), btnDim, btnPos,
        style, fontSize, true, ALIGN.CENTER_HOR | ALIGN.TOP);

    scenes.scene[sceneIdx].buttons[btnIdx] = btn1	// Store the newly created button to the current scene (by refference). 


    btnIdx = scenes.scene[sceneIdx].btnCount++;
    btnPos[1] += btn1.area.mesh.dim[1] * 2 + style.pad + style.border + style.feather; // Set next button's y pos (just bellow the prev button)
    const btn2 = CreateButton(SCENE.startMenu, 'OptionsBtn', 'Options',
        WHITE, DarkenColor(MAGENTA_RED, 0.1), btnDim, btnPos,
        style, fontSize, true, ALIGN.CENTER_HOR | ALIGN.TOP);
    scenes.scene[sceneIdx].buttons[btnIdx] = btn2;

    btnPos[1] += btn2.area.mesh.dim[1] * 2 + style.pad + style.border + style.feather + 80; // Set next button's y pos (just bellow the prev button)

    // Connect the font texture of (for button's text) with the vertex buffer for text rendering. 
    const vb = GlGetVB(btn1.text.gfxInfo.prog.idx, btn1.text.gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; // TODO: Temporary binding of the font texture to the text rendering VB



    // // Create Destoy-brick shader
    // const db = RectCreateRect('Destroybrick', SID_DEFAULT | SID.EXPLOSION_FS, GREY1, [300,300], [1,1], null, [350, 450, 5], style);
    // db.gfxInfo = GlAddMesh(db.sid, db.mesh, 1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


}

function CreatePlayScene(sceneIdx) {


    const menuBar = {
        dim: [Viewport.width / 2, MENU_BAR_HEIGHT],
        pos: [Viewport.width / 2, MENU_BAR_HEIGHT, -2],
        style: {
            pad: 10,
            roundCorner: 6,
            border: 1,
            feather: 10,
        },
    };
    // Create A Window background
    const menu = RectCreateRect('Window', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.1), menuBar.dim, [1, 1], null, menuBar.pos, menuBar.style, null);
    menu.gfxInfo = GlAddMesh(menu.sid, menu.mesh, 1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


    const mainWindow = {
        dim: [Viewport.width / 2, Viewport.height / 2 - menuBar.dim[1]],
        pos: [Viewport.width / 2, Viewport.height / 2 + menuBar.dim[1], -2],
    };
    // Create A Window background
    const startMenuBackground = RectCreateRect('Window', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.3), mainWindow.dim, [1, 1], null, mainWindow.pos, menuBar.style, null);
    startMenuBackground.gfxInfo = GlAddMesh(startMenuBackground.sid, startMenuBackground.mesh,
        1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };
    const fontSize = 10;
    let btnPos = [
        style.pad * 2 + style.border + style.feather + 20,
        style.pad * 2 + style.border + style.feather,
        0
    ];

    let btnIdx = scenes.scene[sceneIdx].btnCount++;	// Get next free element in the buttons array.
    const btn1Name = 'Back';
    const btnDim = [0, 0];
    btnDim[0] = CalcTextWidth(btn1Name, fontSize, btnDim, style);
    const btn1 = CreateButton(SCENE.play, 'ReturnBtn', btn1Name, WHITE, BLUE_13_125_217, btnDim, btnPos, style, fontSize, true, ALIGN.LEFT | ALIGN.TOP);
    scenes.scene[sceneIdx].buttons[btnIdx] = btn1	// Store the newly created button to the current scene (by refference). 

    const btn2Name = 'MENU';
    btnDim[0] = CalcTextWidth(btn2Name, fontSize);
    // btnPos[0] *= -1; // Padd fro the right must be negative
    btnPos[0] = -20; // Padd fro the right must be negative
    btnIdx = scenes.scene[sceneIdx].btnCount++;	    // Get next free element in the buttons array.
    const btn2 = CreateButton(SCENE.play, 'MenuBtn', btn2Name, WHITE, BLUE_13_125_217, btnDim, btnPos, style, fontSize, true, ALIGN.RIGHT | ALIGN.TOP);
    scenes.scene[sceneIdx].buttons[btnIdx] = btn2	// Store the newly created button to the current scene (by refference). 

    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(btn1.text.gfxInfo.prog.idx, btn1.text.gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; // TODO: Temporary binding of the font texture to the text rendering VB


    // Use Fire Shader
    // const fire = RectCreateRect('Fire', SID_DEFAULT | SID.FIRE_FS, RED, [700, 700], [1,1], null, [350, 450, 5], style, null);
    // fire.gfxInfo = GlAddMesh(fire.sid, fire.mesh, 1, SCENE.startMenu, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    // fireMesh = fire;

    /** Bricks */
    const bricks = TempCreateBricks(SCENE.play)

    /** Player */
    const player = CreatePlayer(SCENE.play);
    scenes.scene[sceneIdx].player = player;

    /** Ball */
    BallsInit(SCENE.play); // Initialize Ball's buffer
    BallCreate(SCENE.play, [Viewport.width / 2, Viewport.bottom - 82]);
    BallCreateTail(28, 40, SCENE.play);

    /** Initialize the explosions buffer and it's graphics */
    ExplosionsInit();


    /** Ui */
    UiCreateScore(SCENE.play);
    UiCreateScoreModifier(SCENE.play);
    UiCreateLives(SCENE.play);

    // Create frameBuffer to render the scene(to a texture)
    // const fb = GlCreateFrameBuffer(gfxCtx.gl);
    // Temp: Create a rect for the frame buffer
    // CreateRectForFrameBuffer(fb);


}

// TODO: Move this Func to Bricks.js
function TempCreateBricks(scene) {


    const pad = 10;
    const padStart = 100;
    const dim = [28, 16];
    let pos = [padStart + dim[0] + pad, 120 + dim[1] + 100, -1];

    // Test Big Square
    // const dim = [300, 160];
    // let pos = [dim[0] + pad + 60, dim[1] + pad + 60, -1];

    for (let i = 0; i < 10; i++) {
        CreateBrick(scene, pos, dim);
        pos[0] += dim[0] * 2 + pad;
        if (pos[0] + dim[0] * 2 + 50 > Viewport.right) {
            pos[1] += dim[1] * 2 + pad;
            pos[0] = dim[0] + pad + padStart;
        }
    }

    BrickCreateParticleSystem(SCENE.play);

    return BrickGetBricksBuffer();
}

function CreateRectForFrameBuffer(fb) {

    const RenderBuffer = {
        dim: [200 * Viewport.ratio, 200],
        pos: [480, 440, -2],
    };
    // Create A Window background
    const RenderBufferMesh = RectCreateRect('Window', SID_DEFAULT_TEXTURE, WHITE, RenderBuffer.dim, [1, 1], [0, 1, 1, 0], RenderBuffer.pos, 10.0, 4, 10, null);

    RenderBufferMesh.gfxInfo = GlAddMesh(RenderBufferMesh.sid, RenderBufferMesh.mesh,
        1, SCENE.play, CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    // GfxSetVbShow(RenderBufferMesh.gfxInfo.prog.idx, RenderBufferMesh.gfxInfo.vb.idx, false);


    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(RenderBufferMesh.gfxInfo.prog.idx, RenderBufferMesh.gfxInfo.vb.idx);
    // Do not render the vertex buffer data of the rect that is to render the frame buffer texture
    vb.texIdx = fb.texIdx; // TODO: Temporary binding of the font texture to the text rendering VB
    // Store the program's and vb's indexes in the frame buffer for refferencing them
    fb.progIdx = RenderBufferMesh.gfxInfo.prog.idx;
    fb.vbIdx = RenderBufferMesh.gfxInfo.vb.idx;

}



function CreateTestButtonsScene() {

    CreatePlayer(SCENE.testButtons);


    const btnDim = [80, 20];
    let btnPos = [50, 25, 0];
    const padding = 20;
    const roundness = 5;

    const btn1 = CreateButton('Btn1', 'Button 1', GREEN, TRANSPARENT, btnDim, btnPos, roundness, 6, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn1.area.mesh.dim[1] * 2 + padding;
    const btn2 = CreateButton('Btn2', 'Button 2', RED, TRANSPARENT, btnDim, btnPos, roundness, 8, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn2.area.mesh.dim[1] * 2 + padding;
    const btn3 = CreateButton('Btn3', 'Button 3', BLUE, TRANSPARENT, btnDim, btnPos, roundness, 12, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn3.area.mesh.dim[1] * 2 + padding;
    const btn4 = CreateButton('Btn4', 'Button 4', YELOW, TRANSPARENT, btnDim, btnPos, roundness, 14, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn4.area.mesh.dim[1] * 2 + padding;
    const btn5 = CreateButton('Btn5', 'Button 5', YELOW, TRANSPARENT, btnDim, btnPos, roundness, 14, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn5.area.mesh.dim[1] * 2 + padding;
    const btn6 = CreateButton('Btn6', '!@#E$%^&*{}<>?"\';:', WHITE, TRANSPARENT, btnDim, btnPos, roundness, 16, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn6.area.mesh.dim[1] * 2 + padding;
    const btn7 = CreateButton('Btn7', 'Hi the! said \'james\'', MAGENTA_BLUE, TRANSPARENT, btnDim, btnPos, roundness, 16, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn7.area.mesh.dim[1] * 2 + padding;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Helper functions
 */
function SceneGetSceneName(sceneId){
    switch(sceneId){
        case SCENE.startMenu: return 'Start Menu Scene';
        case SCENE.play: return 'Play Scene';
        default: alert('SceneId does not exist! At: SceneGetSceneName(sceneId)');
    }
}

////////////////////////////////////////////////// OLD CODE //////////////////////////////////////////////////
// function createCreativeMenu() {

// 	// let _word = new Array;
// 	let pos = new Array(3);
// 	let scale = 0.0;


// 	let offset = 30;
// 	let offset2 = 30;

// 	let index = 0;


// 	pos = [ALIGN.RIGHT - 20, ALIGN.TOP - offset, 20.0];
// 	scale = 0.4;
// 	CreateButton(index, "!@#$%^&*()12345678 Test Game", pos, scale, WHITE, 'right');
// 	offset += offset2;
// 	index++;

// 	// _word = "Test Game";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.TOP - offset, 20.0];
// 	// CreateText(0, _word, pos, scale, WHITE, false, "right");
// 	// textLastElem++;
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_TEST;
// 	// offset += offset2;



// 	offset = 70;
// 	offset2 = 30;

// 	pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	scale = 0.3;
// 	CreateButton(index, "Stone Brick", pos, scale, WHITE, 'right');
// 	offset += offset2;
// 	index++;
// 	// _word = "Stone";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(1, _word, pos, scale, WHITE, false, "right");
// 	// textLastElem++;
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_STONE;
// 	// offset += offset2;

// 	pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	CreateButton(index, "Sand Stone Brick", pos, scale, WHITE, 'right');
// 	offset += offset2;
// 	index++;
// 	// _word = "Sand Stone";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(2, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_STONESAND;
// 	// offset += offset2;

// 	// _word = "Wood";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(3, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_WOOD;
// 	// offset += offset2;

// 	// _word = "Iron Black";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(4, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_IRONBLACK;
// 	// offset += offset2;

// 	// _word = "Iron Silver";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(5, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_IRONSILVER;
// 	// offset += offset2;

// 	// _word = "Iron Rust";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(6, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_IRONRUST;
// 	// offset += offset2;

// }


// function CreateMainMenu() {

// 	// for (let i = 0; i < text.length; i++) {
// 	// 	if (i <= OPTIONS_TEXT)
// 	// 		text[i].display = true;
// 	// 	else
// 	// 		text[i].display = false;
// 	// }
// 	// CreateMainMenuUi();


// 	// let _word = "Play";
// 	// CreateText(PLAY_TEXT, _word, pos, scale, WHITE, true, "center");
// 	// textLastElem++;
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);

// 	let pos = [0.0, CHAR_HEIGHT * 2 + 20, 0.0];
// 	let scale = 0.8;
// 	CreateButton(PLAY_TEXT, "Play", pos, scale, WHITE, 'center');
// }


// function startGame() {

// 	startBall = false;
// 	score.curr = 0;
// 	score.modifier = 1.0;


// 	createStage();
// 	text[UI_TOTAL_SCORE_NUM].display = false;

// 	GAME_STATE = SHOW_STAGENUM; console.log("SHOW_STAGENUM");

// }

