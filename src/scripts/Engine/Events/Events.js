"use strict";
import { OnMouseMove, OnMouseClick } from "./MouseEvents.js";
// import { GlUniformsSet } from '../../Graphics/GlUniforms.js'
import { ButtonSetRoundCorner, ButtonSetBorderWidth, ButtonSetBorderFeather } from "../Drawables/Widgets/Button.js";
import { BrickSetRoundCorner, BrickSetBorderWidth, BrickSetBorderFeather } from "../../App/Drawables/Brick.js";
import { InterpolateToRange } from "../../Helpers/Math/MathOperations.js";
import { GlGetProgram } from "../../Graphics/GlProgram.js";
// import { ParticlesSetUniforms } from "../ParticlesSystem/Particles.js";
import { BallSetSpeed } from "../../App/Drawables/Ball.js";
import { PrintVertexBufferAll, PrintBuffersMeshesNames } from "../../Graphics/Debug/GfxDebug.js";
import { GlFrameBuffer } from "../../Graphics/I_GlProgram.js";


const events = []; // Aplication's events array
let evtsIdx = 0; // Index for events array

/**
 * 
 * @param {*} eventType : Type of constant EVENTS (in Global/Constants.js)
 * @param {*} params : An object with at least the type of hovered object and a value of the object's index in an array
 */
export function RegisterEvent(eventType, params){
    events[evtsIdx++] = {
        
        type: eventType,
        params: params,
    };
}

export function HandleEvents(){

    for(let i=evtsIdx-1; i>=0; i--){

        switch(events[i].type)
        {
            case EVENTS.MOUSE: {
                // OnButtonHover(events[i].params.btnIdx);
                evtsIdx--; // Remove handled event
                break;
            }
        }
    }
}

export function HandleEventsEmidiate(){
}

let acceleration = 0;
const step = .2;
export function AddEventListeners(){

    document.addEventListener('mousemove', OnMouseMove, false);
    document.addEventListener('click', OnMouseClick, false);
    // document.addEventListener('keyup', input.keyReleased, false);
    document.addEventListener('keydown', function (event){
        if (event.key === 'P' || event.key === 'p') {
            if(g_state.game.paused === false){
                g_state.game.paused = true;
                console.log('Game Resumed');
            }
            else{
                g_state.game.paused = false;
                console.log('Game Paused');
            }
        }
        else if (event.key === 'M' || event.key === 'm') {
            console.log('M key pressed');
            const vb = GlGetVB(GlFrameBuffer.progIdx, GlFrameBuffer.vbIdx); 
            console.log('Framebuffer show = ', vb.show);
        }
        else if (event.key === 'A' || event.key === 'a') {
            BallSetSpeed(step);
        }
        else if (event.key === 'S' || event.key === 's') {
            BallSetSpeed(-step);
        }
        else if (event.key === 'Z' || event.key === 'z') {
            // PrintVertexBufferAll();
            PrintBuffersMeshesNames();
        }
    }, false);
}

export function AddCssUiListeners()
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
