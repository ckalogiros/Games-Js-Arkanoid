"use strict";
import { GfxInitGraphics } from '../Graphics/GfxInit.js'
import { LoadFontTextures, FontCreateUvMap } from '../Engine/Loaders/Font/LoadFont.js'
import { ScenesLoadScene, ScenesCreateAllMeshes, ScenesCreateScene } from './Scenes.js'
import { Render } from '../Engine/Renderer/Render.js'
import { SetTimer } from '../Engine/Timer/Timer.js'
import { AddEventListeners, AddCssUiListeners } from '../Engine/Events/Events.js';
import { fps } from '../Engine/Timer/Timer.js';
import { UiInitMods } from './Drawables/Ui/Ui.js';
import { PowerUpInit } from './Drawables/PowerUp.js';

// Debug-Print
import { PrintBuffersAll } from '../Graphics/Debug/GfxDebug.js';



export function AppInit() {

    // * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * * 
    // User Input Callbacks
    const FpsNode = document.getElementById('fps');

    // Load Fonts, load metrics and create uv map for each loaded font 
    LoadFontTextures();
    FontCreateUvMap();

    // * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * * 
    // Graphics Initialization
    GfxInitGraphics(); // Creation of some commonly used gl programs(like simple rect rendering and texture rendering)

    AddEventListeners();
    AddCssUiListeners();


    AppInitReservedGlBuffers();

    // Init all app's meshes
    ScenesCreateAllMeshes();
    // Create Scene
    ScenesCreateScene(SCENE.startMenu);
    ScenesCreateScene(SCENE.startStage);
    ScenesCreateScene(SCENE.finishStage);
    ScenesCreateScene(SCENE.stage);
    // TODO: CONTINUE: Create a gfxBuffers for each scene
    ScenesLoadScene(SCENE.startMenu);
    // TODO: CONTINUE: Set the update() in render to update all meshes throug Scene, 
    // so it can check only for events of meshes that exist in the current scene


    // * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * * 
    // Display Frames per second
    SetTimer(DisplayFps, TIMER_FPS_TIME, FpsNode);

    PrintBuffersAll();
    // setTimeout(()=>{g_state.game.paused = true}, 723);


    // Render
    Render();

}


function DisplayFps(FpsNode) {

    const avg = fps.accum / fps.cnt;
    const cur = fps.elapsedAccum / fps.elapsedCnt;
    fps.elapsedCnt = 1;
    fps.elapsedAccum = 0.0001;

    FpsNode.innerHTML =
        "Fps (avg total): " + Math.floor(1 / avg)
        +
        " <> Fps (avg 1s): " + Math.floor(1 / cur)
        ;

}


function AppInitReservedGlBuffers(){
    UiInitMods();
    PowerUpInit();
}