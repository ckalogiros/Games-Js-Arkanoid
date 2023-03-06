"use strict";
import { GlGetVB } from '../Graphics/GlProgram.js';
import { Player, CreatePlayer, PlayerGetPos } from './Drawables/Player.js';
import { Button, CreateButton } from '../Engine/Drawables/Widgets/Button.js';
import { BallCreate, BallResetPos } from './Drawables/Ball.js';
import { Rect, RectCreateRect } from '../Engine/Drawables/Rect.js';
import { Text, CalcTextWidth } from '../Engine/Drawables/Text.js';
import { DarkenColor } from '../Helpers/Helpers.js';
import { UiCreateScore, UiCreateScoreModifier, UiCreateLives, UiGet, UiTextVariable, UiCreateTotalScore } from './Drawables/Ui/Ui.js';
import { GlAddMesh, GfxSetVbShow } from '../Graphics/GlBuffers.js';
import { BallsInit } from './Drawables/Ball.js';
import { Explosions, ExplosionsGet } from '../Engine/Explosions.js';
import { ParticleSystem, ParticleSystemGet } from '../Engine/ParticlesSystem/Particles.js';
import { PowerUpGet, PowerUpReset, PowerUps } from './Drawables/PowerUp.js';
import { StageCreateStage2 } from './Stages.js';
import { BrickInit } from './Drawables/Brick.js';
import { TextLabel } from '../Engine/Drawables/Widgets/TextLabel.js';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  LOGIC:
 *      The whole point of the Scenes abstraction is to have a structure(a scene) that can store all 
 *          of it's meshes Graphics info, so that we can enable-dissable the drawing of the scene's vertex buffers.
 *
 *      Create a scene:
 *          1. Add any new meshes in APP_MESHES_IDX struct (as member vars denoting indexes)
 *          2. Create any new meshes in ScenesCreateAllMeshes().
 *              Here takes place the creation of the actual meshes. 
 *              They are been added to the Scene meshes buffer, 
 *              an array that stores refferences of all meshes of the application).
 *              E.g. Create mesh, add it's refference to the Scenes.allMeshes buffer
 *          3. Set a switch statement in ScenesCreateScene(), 
 *              to add the necessary meshes for that specific scene. Use the 'APP_MESHES_IDX' to refer(find) any
 *              mesh in the Scenes.allMeshes buffer, and add their gfxInfo to the current scene's gfxInfo buffer.
 *              The scene does not store or have a reference to any mesh data, only it's gfxInfo data.
 *              Call ScenesCreateScene(sceneIdx) with param the scene's indxe(SCENE.xxxx) from E.g. App.js file
 *              to create a new scene.
 *          4. Finaly any scene can be loaded with ScenesLoadScene().
 *              Where any current scene's is being unloaded 
 *              and the desired scene is loaded.
 *              [Unloading: Deactivating all scene's vertex buffers. Loading: Activating all scene's vertex buffers ]
 *          5. For Debugging: Dont forget to add the new scene's name to the ScenesGetSceneName();
 *          
 *      Meshes Reusability: 
 *          Any created mesh can be reused in any other scene without the need to create a new one,
 *          but the mesh has to be inserted ([again, duplicate]) in the vertex buffers created for the scene.
 * 
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */




class Scene {
    /**
     * The only reason a Scene has refferences to meshes is that:
     *      1. needs to have all programs and vertex buffers so it can toggle the drawing
     *      2. the Button meshes may differ from scene to scene
     */
    constructor(sceneIdx) {
        this.sceneIdx = sceneIdx;
    }

    sceneIdx = 0; // Scene ID (of type: SCENE const structure).
    name = ''; // Scene name
    meshesIdx = []; // Store the index of each mesh in 'scenes.allMeshes buffer' of the current scene
    // player = null;
    // balls = null;
    // bricks = null;
    buttons = [];
    btnCount = 0;
    gfxBuffers = []; // Store the program and vertexBuffer indexes

    AddMesh(mesh, idx) {
        if (!mesh || mesh === undefined) alert('Mesh shouldn\'t be undefined. At: class Scene.AddMesh()');

        if (mesh instanceof Rect) {
            this.StoreGfxBuffer(mesh.gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh instanceof Player) {
            // this.player = mesh;
            this.StoreGfxBuffer(mesh.gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh[0] !== undefined && mesh[0] instanceof UiTextVariable) {
            // Because constText and variText belong to the same buffer, the gfx info of any letter is enough to store progIdx and vbIdx.
            this.StoreGfxBuffer(mesh[0].constText.letters[0].gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh[0] !== undefined) {
            this.StoreGfxBuffer(mesh[0].gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh instanceof Button) {
            this.buttons.push(mesh);
            this.btnCount++;
            this.StoreGfxBuffer(mesh.text.gfxInfo);
            this.StoreGfxBuffer(mesh.area.gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh instanceof TextLabel || mesh instanceof Text) {
            this.StoreGfxBuffer(mesh.text.gfxInfo);
            this.StoreGfxBuffer(mesh.area.gfxInfo);
        }
        else if (mesh instanceof PowerUps) {
            this.StoreGfxBuffer(mesh.powUp[0].gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh instanceof Explosions) { // For Fx
            this.StoreGfxBuffer(mesh.buffer[0].gfxInfo);
            // this.meshesIdx.push(idx);
        }
        else if (mesh instanceof ParticleSystem) { // For Fx
            for (let i = 0; i < mesh.psBuffer.length; i++) {
                this.StoreGfxBuffer(mesh.psBuffer[i].buffer[0].gfxInfo);
            }
            // this.meshesIdx.push(idx);
        }

        this.meshesIdx.push(idx);
    }
    /** Graphics */
    StoreGfxBuffer(gfxInfo) { // This is the way for a scene to know what and how many gfx buffers it's meshes have
        if (gfxInfo === undefined)
            console.log()

        // Check if gfx buffer index already stored
        let found = false;
        const len = this.gfxBuffers.length;

        for (let i = 0; i < len; i++) {
            if (this.gfxBuffers[i].progIdx === gfxInfo.prog.idx
                && this.gfxBuffers[i].vbIdx === gfxInfo.vb.idx) {
                found = true;
                break;
            }
        }
        // If gfx buffer is not stored, store it
        if (!found) {
            this.gfxBuffers.push({ progIdx: gfxInfo.prog.idx, vbIdx: gfxInfo.vb.idx });
        }
    }
    SetAllGfxBuffersToHidden() {
        const len = this.gfxBuffers.length;
        for (let i = 0; i < len; i++) {
            GfxSetVbShow(this.gfxBuffers[i].progIdx, this.gfxBuffers[i].vbIdx, false)
        }
    }

};

class Scenes {

    scene = [];
    sceneCount = 0;

    allMeshes = [];
    allMeshesCount = 0;

    gfxBuffers = [];

    count = APP_MESHES_IDX.count;

    AddScene(scene) {
        this.scene[this.sceneCount++] = scene;
        return this.sceneCount - 1;
    }
    InitAllMeshesBuffer() { // Initialize the buffer to the count of all meshes(APP_MESHES_IDX.count)
        for (let i = 0; i < this.count; i++) {
            this.allMeshes[i] = null;
        }
    }
    AddMesh(mesh, idx) {
        this.allMeshes[idx] = mesh;
    }

};

const scenes = new Scenes;
export function ScenesGetScene(sceneIdx) {

    if (sceneIdx < 0 || sceneIdx > scenes.count)
        alert('Scene Index Out Of Bounds!');

    return scenes.scene[sceneIdx];
}

export function ScenesGetMesh(meshIdx){
    const mesh = scenes.allMeshes[meshIdx];
    return mesh;
}

/**
 * Creates all meshes of the application. Also initializes all required Graphics programs and vertex buffers
 */
export function ScenesCreateAllMeshes() {

    // Must initialize a meshes buffer, with count the count of all app's meshes,
    // so that we are able to add meshes to any index(not in consecutive order)  base on the const struct APP_MESHES_IDX
    scenes.InitAllMeshesBuffer();

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Backgrounds */
    // Create 'start menu' background
    let dim = [Viewport.width / 2, Viewport.height / 2];
    let pos = [Viewport.width / 2, Viewport.height / 2, -1];
    let style = { pad: 10, roundCorner: 6, border: 0, feather: 30 };
    const startMenuBk = RectCreateRect('startMenuBk', SID_DEFAULT, DarkenColor(GREY2, 0.1), dim, [1, 1], null, pos, style);
    startMenuBk.gfxInfo = GlAddMesh(startMenuBk.sid, startMenuBk.mesh, 1, SCENE.startMenu, 'Background StartMenu', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    scenes.AddMesh(startMenuBk, APP_MESHES_IDX.background.startMenu);

    // Create 'start stage' background
    const startStageBk = RectCreateRect('startStageBk', SID_DEFAULT, DarkenColor(GREY2, 0.1), dim, [1, 1], null, pos, style);
    startStageBk.gfxInfo = GlAddMesh(startStageBk.sid, startStageBk.mesh, 1, SCENE.startStage, 'Background StartStage', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    scenes.AddMesh(startStageBk, APP_MESHES_IDX.background.startStage);
    // Create 'finish stage' background
    const finishStageBk = RectCreateRect('finishStageBk', SID_DEFAULT, DarkenColor(BLUE_12_158_216, 0.3), dim, [1, 1], null, pos, style);
    finishStageBk.gfxInfo = GlAddMesh(finishStageBk.sid, finishStageBk.mesh, 1, SCENE.finishStage, 'Background FinishStage', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    scenes.AddMesh(finishStageBk, APP_MESHES_IDX.background.finishStage);

    // Create 'stage' background
    dim = [Viewport.width / 2, MENU_BAR_HEIGHT];
    pos = [Viewport.width / 2, MENU_BAR_HEIGHT, -2];
    style = { pad: 10, roundCorner: 6, border: 1, feather: 10 };
    const stageBk = RectCreateRect('stageBk', SID_DEFAULT, DarkenColor(GREY2, 0.1), dim, [1, 1], null, pos, style, null);
    stageBk.gfxInfo = GlAddMesh(stageBk.sid, stageBk.mesh, 1, SCENE.stage, 'Background Stage', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    scenes.AddMesh(stageBk, APP_MESHES_IDX.background.stage);

    // Create stage menu background
    dim = [Viewport.width / 2, Viewport.height / 2 - dim[1]];
    pos = [Viewport.width / 2, Viewport.height / 2 + MENU_BAR_HEIGHT, -2];
    const stageMenuBk = RectCreateRect('stageMenuBk', SID_DEFAULT, DarkenColor(GREY2, 0.1), dim, [1, 1], null, pos, style, null);
    stageMenuBk.gfxInfo = GlAddMesh(stageMenuBk.sid, stageMenuBk.mesh, 1, SCENE.stage, 'Background Stage', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    // 1, SCENE.stage, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    scenes.AddMesh(stageMenuBk, APP_MESHES_IDX.background.stageMenu);
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Backgrounds */


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Buttons */
    let btnDim = [100, 20];
    let btnPos = [0, 100, 0];
    style = { pad: 10, roundCorner: 6, border: 3, feather: 12 };
    let fontSize = 20;

    // Create play button
    const playBtn = CreateButton(SCENE.startMenu, 'PlayBtn', 'Play',
        WHITE, DarkenColor(YELLOW_229_206_0, 0.1), btnDim, btnPos,
        style, fontSize, true, 0.5, ALIGN.CENTER_HOR | ALIGN.TOP);
    // Add play button to scenes mesh to buffer
    scenes.AddMesh(playBtn, APP_MESHES_IDX.buttons.play);

    // Options (in main start menu) button
    btnPos[1] += playBtn.area.mesh.dim[1] * 2 + style.pad + style.border + style.feather; // Set next button's y pos (just bellow the prev button)
    const optionsBtn = CreateButton(SCENE.startMenu, 'OptionsBtn', 'Options',
        WHITE, DarkenColor(MAGENTA_RED, 0.1), btnDim, btnPos,
        style, fontSize, true, 0.5, ALIGN.CENTER_HOR | ALIGN.TOP);
    scenes.AddMesh(optionsBtn, APP_MESHES_IDX.buttons.options);

    // Start Stage (in main start stage) button
    btnPos[0] = 0;
    btnPos[1] = 0;
    const startStageBtn = CreateButton(SCENE.startStage, 'startStageBtn', 'Start',
        WHITE, DarkenColor(GREENL1, 0.1), btnDim, btnPos,
        style, fontSize, true, 0.5, ALIGN.CENTER_HOR | ALIGN.CENTER_VERT);
    scenes.AddMesh(startStageBtn, APP_MESHES_IDX.buttons.start);


    // Back button
    fontSize = 10;
    btnPos[0] = style.pad * 2 + style.border + style.feather + 20;
    btnPos[1] = style.pad * 2 + style.border + style.feather;
    btnDim = [0, 0];
    btnDim[0] = CalcTextWidth('Back', fontSize, btnDim, style);
    const backBtn = CreateButton(SCENE.stage, 'ReturnBtn', 'Back', WHITE, BLUE_13_125_217,
        btnDim, btnPos, style, fontSize, true, 0.5, ALIGN.LEFT | ALIGN.TOP);
    scenes.AddMesh(backBtn, APP_MESHES_IDX.buttons.backStage);

    // Options (in stage scenes) button
    btnDim[0] = CalcTextWidth('MENU', fontSize);
    btnPos[0] = -20; // Padd fro the right must be negative
    const menuStageBtn = CreateButton(SCENE.stage, 'MenuBtn', 'MENU', WHITE, BLUE_13_125_217,
        btnDim, btnPos, style, fontSize, true, 0.5, ALIGN.RIGHT | ALIGN.TOP);
    scenes.AddMesh(menuStageBtn, APP_MESHES_IDX.buttons.menuStage);

    // Continue (after completing a stage) button
    btnDim[0] = CalcTextWidth('CONTINUE', fontSize);
    btnPos = [0, 100, btnPos[2]]; 
    const continueBtn = CreateButton(SCENE.finishStage, 'ContinueBtn', 'CONTINUE', WHITE, BLUE_13_125_217,
        btnDim, btnPos, style, fontSize, true, 0.5, ALIGN.CENTER_HOR | ALIGN.CENTER_VERT);
    scenes.AddMesh(continueBtn, APP_MESHES_IDX.buttons.continue);

    // Connect the font texture of (for button's text) with the vertex buffer for text rendering. 
    // Get the vertexBuffer for the text rendering Gfx program of of any button mesh(assuming all buttons have text)
    const vb = GlGetVB(menuStageBtn.text.gfxInfo.prog.idx, menuStageBtn.text.gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; // TODO: Temporary binding of the font texture to the text rendering VertexBuffer
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * End Buttons */


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Text-Labels */
   const score = 'Total Score: XXXXXXXXX';
    const showTotalScore = new TextLabel(SCENE.finishStage, 'showTotalScore', score, WHITE, 
                                        TRANSPARENT, [0,0], [0,0,0], style, fontSize, true, 
                                        0.4, ALIGN.CENTER_HOR | ALIGN.CENTER_VERT); 
    scenes.AddMesh(showTotalScore, APP_MESHES_IDX.text.totalScore);
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * End Text-Labels */


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Player */
    const player = CreatePlayer(SCENE.stage);
    scenes.AddMesh(player, APP_MESHES_IDX.player);

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Ball */
    const balls = BallsInit(SCENE.stage); // Initialize Ball's buffer
    BallCreate(SCENE.stage, [Viewport.width / 2, PLAYER.YPOS-100]);
    scenes.AddMesh(balls, APP_MESHES_IDX.balls);

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * UI */
    UiCreateScore(SCENE.stage);
    UiCreateTotalScore(SCENE.stage);
    UiCreateScoreModifier(SCENE.stage);
    UiCreateLives(SCENE.stage);
    const uiTexts = UiGet();
    scenes.AddMesh(uiTexts, APP_MESHES_IDX.ui);
    scenes.AddMesh(uiTexts, APP_MESHES_IDX.ui);

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Bricks: Create only the skeleton buffer for the bricks*/
    const bricks = BrickInit(SCENE.stage, 40);
    scenes.AddMesh(bricks, APP_MESHES_IDX.bricks);

    const powUps = PowerUpGet();
    scenes.AddMesh(powUps, APP_MESHES_IDX.powUps);

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * fx */
    const explosions = ExplosionsGet();
    explosions.Init(); // Initialize explosions Graphics
    scenes.AddMesh(explosions, APP_MESHES_IDX.fx.explosions);
    // ParticleSystem
    const particleSystem = ParticleSystemGet();
    scenes.AddMesh(particleSystem, APP_MESHES_IDX.fx.particleSystem);
}

export function ScenesCreateScene(sceneIdx) {
    switch (sceneIdx) {
        case SCENE.startMenu: {
            const idx = scenes.AddScene(new Scene(SCENE.startMenu));

            // Add here all required meshes, for this specific scene, to the scene's mesh buffer
            let meshIdx = APP_MESHES_IDX.background.startMenu;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.buttons.play;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.buttons.options;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);

            scenes.scene[idx].sceneIdx = sceneIdx;
            scenes.scene[idx].name = ScenesGetSceneName(sceneIdx);

            // Set the gfx buffers to 'hidden', so that the meshes will not been drawn until the function
            // ScenesLoadScene enables the apropriate Gfx buffers.
            scenes.scene[idx].SetAllGfxBuffersToHidden();

            break;
        }
        /**
         * This is before starting a stage, where the player gets some info
         * and must press a button in order to start playing the game
         */
        case SCENE.startStage: {
            const idx = scenes.AddScene(new Scene(SCENE.startStage));

            // Add here all required meshes, for this specific scene, to the scene's buffer
            let meshIdx = APP_MESHES_IDX.background.startStage;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.buttons.start;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);

            scenes.scene[idx].sceneIdx = sceneIdx;
            scenes.scene[idx].name = ScenesGetSceneName(sceneIdx);
            scenes.scene[idx].SetAllGfxBuffersToHidden(); // Hide scene's meshes

            break;
        }
        /**
         * This is after finishing a stage, where some info are displayed...
         */
        case SCENE.finishStage: {
            const idx = scenes.AddScene(new Scene(SCENE.finishStage));

            // Add here all required meshes, for this specific scene, to the scene's buffer
            let meshIdx = APP_MESHES_IDX.background.finishStage;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.text.totalScore;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.buttons.continue;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);

            scenes.scene[idx].sceneIdx = sceneIdx;
            scenes.scene[idx].name = ScenesGetSceneName(sceneIdx);
            scenes.scene[idx].SetAllGfxBuffersToHidden(); // Hide scene's meshes

            break;
        }
        /**
         *  The actual stage scene where the player starts playing a stage.
         *  There is one stage scene and we differentiate between stages by Bricks (position, color, etc),
         *  All other elements remain the same across all stage(like UI, ball, player, etc)
         */
        case SCENE.stage: {
            const idx = scenes.AddScene(new Scene(SCENE.stage));

            // Add here all required meshes, for this specific scene, to the scene's buffer
            let meshIdx = APP_MESHES_IDX.background.stage;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx]), meshIdx;
            meshIdx = APP_MESHES_IDX.background.stageMenu;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.buttons.backStage;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.buttons.menuStage;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.player;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.balls;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.bricks;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.powUps;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            // Fx
            meshIdx = APP_MESHES_IDX.fx.explosions;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            meshIdx = APP_MESHES_IDX.fx.particleSystem;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);
            // Ui
            meshIdx = APP_MESHES_IDX.ui;
            scenes.scene[idx].AddMesh(scenes.allMeshes[meshIdx], meshIdx);

            // StageCreateStage1();

            scenes.scene[idx].sceneIdx = sceneIdx;
            scenes.scene[idx].name = ScenesGetSceneName(sceneIdx);

            // Set the gfx buffers to 'hidden', so that the meshes will not been drawn until the function
            // ScenesLoadScene enables the apropriate Gfx buffers.
            scenes.scene[idx].SetAllGfxBuffersToHidden();

            break;
        }

    }
}

export function ScenesLoadScene(sceneIdx) {

    // If there is a loaded scene and it's not the same with the one we are trying to load..
    if (sceneIdx !== SCENE.active.idx) {
        const idx = SCENE.active.idx; // Current loaded scene index

        // If there is no scene loaded ... load scene.
        if (idx === INT_NULL) {
            const scenesLen = scenes.scene.length;
            // .. activate the Graphics buffers for the loaded scene
            for (let i = 0; i < scenesLen; i++) {
                if (scenes.scene[i].sceneIdx === sceneIdx) {
                    const gfxBufLen = scenes.scene[sceneIdx].gfxBuffers.length;
                    for (let j = 0; j < gfxBufLen; j++) {
                        GfxSetVbShow(scenes.scene[i].gfxBuffers[j].progIdx, scenes.scene[i].gfxBuffers[j].vbIdx, true);
                    }
                    SCENE.active.idx = i;
                    break;
                }
            }
        }
        else { // There is a loaded scene ...
            // .. deactivate current scene's meshes Graphics buffers
            let gfxBufLen = scenes.scene[idx].gfxBuffers.length;
            for (let i = 0; i < gfxBufLen; i++) {
                GfxSetVbShow(scenes.scene[idx].gfxBuffers[i].progIdx, scenes.scene[idx].gfxBuffers[i].vbIdx, false);
            }

            // .. load the new scene
            gfxBufLen = scenes.scene[sceneIdx].gfxBuffers.length;
            for (let i = 0; i < gfxBufLen; i++) {
                GfxSetVbShow(scenes.scene[sceneIdx].gfxBuffers[i].progIdx, scenes.scene[sceneIdx].gfxBuffers[i].vbIdx, true);
            }
            SCENE.active.idx = sceneIdx;

        }
    }
}


/**
 * TODO: Put here:
 *      load stage scene
 *      the score countDown 
 *      load stage scene
 *      AFTER that: show button 'Continue'
 *      load stage scene
 *      AFTER that: Show button 'start next stage' Or 'Pick a stage'
 *      load stage scene
*/
export function ScenesStageCompleted23RenameMe() {
    ScenesLoadScene(SCENE.startStage);
    // ScenesLoadScene(SCENE.finishStage);
    StageCreateStage2();
    BallResetPos();
    // // Reset Power Ups
    PowerUpReset();
    // // TODO: Fx reset
}



function CreateRectForFrameBuffer(fb) {

    const RenderBuffer = {
        dim: [200 * Viewport.ratio, 200],
        pos: [480, 440, -2],
    };
    // Create A Window background
    const RenderBufferMesh = RectCreateRect('Window', SID_DEFAULT_TEXTURE, WHITE, RenderBuffer.dim, [1, 1], [0, 1, 1, 0], RenderBuffer.pos, 10.0, 4, 10, null);

    RenderBufferMesh.gfxInfo = GlAddMesh(RenderBufferMesh.sid, RenderBufferMesh.mesh,
        1, SCENE.stage, 'Background', CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
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
function ScenesGetSceneName(sceneIdx) {
    switch (sceneIdx) {
        case SCENE.startMenu: return 'Start Menu Scene';
        case SCENE.startStage: return 'Start Stage Scene';
        case SCENE.finishStage: return 'Finish Scene';
        case SCENE.stage: return 'Play Stage Scene';
        default: alert('sceneIdx does not exist! At: ScenesGetSceneName(sceneIdx)');
    }
}

////////////////////////////////////////////////// OLD CODE //////////////////////////////////////////////////
