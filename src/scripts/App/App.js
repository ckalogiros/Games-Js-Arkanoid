"use strict";
import { GfxInitGraphics } from '../Graphics/GfxInit.js'
import { LoadFontTextures, FontCreateUvMap } from '../Engine/Loaders/Font/LoadFont.js'
import { ScenesLoadScene, ScenesCreateAllMeshes, ScenesCreateScene } from './Scenes.js'
import { Render } from '../Engine/Renderer/Render.js'
import { SetTimer } from '../Engine/Timer/Timer.js'
import { AddEventListeners, } from '../Engine/Events/Events.js';
import { fps } from '../Engine/Timer/Timer.js';
import { ModCreateAnimation, UiInitMods } from './Drawables/Ui/Ui.js';
import { PowerUpInit } from './Drawables/PowerUp.js';
import { GlGetProgram } from '../Graphics/GlProgram.js';

// Debug-Print
import { PrintBuffersAll } from '../Graphics/Debug/GfxDebug.js';
import { InterpolateToRange } from '../Helpers/Math/MathOperations.js';



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

    ModCreateAnimation();

    // * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * *  * * * * * * 
    // Display Frames per second
    SetTimer(DisplayFps, TIMER_FPS_TIME, FpsNode);

    PrintBuffersAll();
    // setTimeout(()=>{g_state.game.paused = true}, 723);



    // Render
    window.requestAnimationFrame(Render);
    // Render();

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

function AddCssUiListeners()
{
    const SdfInnerDistSlider   = document.getElementById("sdf-param1");
    const SdfInnerDistOut      = document.getElementById("sdf-param1-val");
    SdfInnerDistOut.innerHTML  = SdfInnerDistSlider.value;
    
    /**
     * Below are the event listeners for every time a slider ui is changed,
     * we make a call to update the uniform values of the gl program
     */

    // Set Uniforms buffer params
    const prog = GlGetProgram(UNIFORM_PARAMS.sdf.progIdx,UNIFORM_PARAMS.sdf.innerIdx);
    prog.UniformsSetParamsBufferValue(InterpolateToRange(SdfInnerDistSlider.value, 100, 1), UNIFORM_PARAMS.sdf.innerIdx);
    
    // On event
    SdfInnerDistSlider.oninput = function () {
        SdfInnerDistOut.innerHTML = this.value;
        prog.UniformsSetParamsBufferValue(InterpolateToRange(SdfInnerDistSlider.value, 100, 1), UNIFORM_PARAMS.sdf.innerIdx);
    }
    
    const SdfOuterDistSlider   = document.getElementById("sdf-param2");
    const SdfOuterDistOut      = document.getElementById("sdf-param2-val");
    SdfOuterDistOut.innerHTML  = SdfOuterDistSlider.value;
    
    prog.UniformsSetParamsBufferValue(InterpolateToRange(SdfOuterDistSlider.value, 100, 1), UNIFORM_PARAMS.sdf.outerIdx);
    
    SdfOuterDistSlider.oninput = function () {
        SdfOuterDistOut.innerHTML = this.value;
        prog.UniformsSetParamsBufferValue(InterpolateToRange(SdfOuterDistSlider.value, 100, 1), UNIFORM_PARAMS.sdf.outerIdx);
    }
    
    /**
     * Below we set the listeners for attributs that have to change through
     * ui sliders(like the roundnes, bborder, etc). We update directly the 
     * vertex buffer values, so there is no need for uniform buffer update .
     */
    const roundRatio   = 0.5;
    const borderRatio  = 0.15;
    const featherRatio = 0.2;

    // Button's Sliders
    const buttonRoundCornerSlider   = document.getElementById('button-round-corner');
    const buttonRoundCornerOut      = document.getElementById("button-round-corner-val");
    buttonRoundCornerOut.innerHTML  = buttonRoundCornerSlider.value;
    buttonRoundCornerSlider.oninput = function () {
        buttonRoundCornerOut.innerHTML = this.value;
        ButtonSetRoundCorner(Number(this.value)); 
    }
    
    const buttonBorderWidthSlider   = document.getElementById('button-border-width');
    const buttonBorderWidthOut      = document.getElementById("button-border-width-val");
    buttonBorderWidthOut.innerHTML  = buttonRoundCornerSlider.value;
    buttonBorderWidthSlider.oninput = function () {
        buttonBorderWidthOut.innerHTML = this.value;
        ButtonSetBorderWidth(Number(this.value)); 
    }

    const buttonBorderFeatherSlider = document.getElementById('button-border-feather');
    const buttonBorderFeatherOut      = document.getElementById("button-border-feather-val");
    buttonBorderFeatherOut.innerHTML  = buttonRoundCornerSlider.value;
    buttonBorderFeatherSlider.oninput = function () {
        buttonBorderFeatherOut.innerHTML = this.value;
        ButtonSetBorderFeather(Number(this.value)) 
    }


    // Brick's Sliders
    const brickRoundCornerSlider   = document.getElementById('brick-round-corner');
    const brickRoundCornerOut      = document.getElementById("brick-round-corner-val");
    brickRoundCornerOut.innerHTML  = brickRoundCornerSlider.value;
    brickRoundCornerSlider.oninput = function () {
        brickRoundCornerOut.innerHTML = this.value;
        BrickSetRoundCorner(Number(this.value) * roundRatio); 
    }

    const brickBorderWidthSlider   = document.getElementById('brick-border-width');
    const brickBorderWidthOut      = document.getElementById("brick-border-width-val");
    brickBorderWidthOut.innerHTML  = brickRoundCornerSlider.value;
    brickBorderWidthSlider.oninput = function () {
        brickBorderWidthOut.innerHTML = this.value;
        BrickSetBorderWidth(Number(this.value) * borderRatio); 
    }

    const brickBorderFeatherSlider  = document.getElementById('brick-border-feather');
    const brickBorderFeatherOut      = document.getElementById("brick-border-feather-val");
    brickBorderFeatherOut.innerHTML  = brickRoundCornerSlider.value;
    brickBorderFeatherSlider.oninput = function () {
        brickBorderFeatherOut.innerHTML = this.value;
        BrickSetBorderFeather(Number(this.value) * featherRatio); 
    }

}
