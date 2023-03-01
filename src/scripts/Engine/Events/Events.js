"use strict";
import { OnMouseMove, OnMouseClick } from "./MouseEvents.js";
import { BallSetSpeed } from "../../App/Drawables/Ball.js";
import { PrintBuffersMeshesNames } from "../../Graphics/Debug/GfxDebug.js";
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
    document.addEventListener('keydown', function (event){
        if (event.key === 'P' || event.key === 'p') {
            if(g_state.game.paused === false){
                g_state.game.paused = true;
                // console.log('Game Resumed');
            }
            else{
                g_state.game.paused = false;
                // console.log('Game Paused');
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

