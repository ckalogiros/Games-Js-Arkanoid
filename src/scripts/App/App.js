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
import { PrintBuffersAll } from '../Graphics/GfxDebug.js';



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

    // Init all app's meshes
    ScenesCreateAllMeshes();
    // Create Scene
    ScenesCreateScene(SCENE.startMenu);
    // TODO: CONTINUE: create the meshes for the particle system(ballTail etc.)

    // CreateScene(SCENE.startMenu);
    // CreateScene(SCENE.play);
    // LoadScene(SCENE.startMenu);
    // LoadScene(SCENE.play);

    // * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * * 
    // Display Frames per second
    SetTimer(DisplayFps, TIMER_FPS_TIME, FpsNode);

    PrintBuffersAll();
    // setTimeout(()=>{g_state.game.paused = true}, 723);

    AppInitReservedGlBuffers();

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