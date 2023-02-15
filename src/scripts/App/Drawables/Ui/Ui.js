"use strict";
import { CreateText } from "../../../Engine/Drawables/Text.js";
import { GlMove, GlSetColor, GlSetTex, GlSetWpos } from "../../../Graphics/GlBufferOps.js";
import { GlAddMesh, GlCreateReservedBuffer } from "../../../Graphics/GlBuffers.js";
import { FontGetUvCoords } from "../../../Engine/Loaders/Font/LoadFont.js";
import { GlGetVB } from "../../../Graphics/GlProgram.js";
import * as math from "../../../Helpers/Math/MathOperations.js"
import { DarkenColor } from "../../../Helpers/Helpers.js";

/**
 * TODO: For now style is not used by simple text.
 */

// Score's for diffferent kinds of achievments
const SCORE_FOR = {
    brick: 10, 
};

class UiTextVariable {

    constructor(style) {
        this.style.pad = style.pad;
        this.style.roundCorner = style.roundCorner;
        this.style.border = style.border;
        this.style.feather = style.feather;
    }

    constText = null;   // Constant text(unchangable)
    variText = null;   // Variable text(text that changes)
    val = 100000; // The numerical value of the variable text. The number of digits denotes the max length of characters for any variable ui text number
    style = {
        pad: 0,
        roundCorner: 0,
        border: 0,
        feather: 0,
    };
};

const uiTexts = [];



function UiCreate(sceneId, constTextStr, variTextStr, constTextcol, variTextcol, pos, fontSize, style, Align) {

    const uiText = new UiTextVariable(style);

    // Create the unchanged text
    uiText.constText = CreateText(constTextStr, constTextcol, [], pos, uiText.style, fontSize, true, Align);

    // Create the changed text (it is numerical value in most cases)
    pos[0] += uiText.constText.dim[0];
    uiText.variText = CreateText(uiText.val.toFixed(1), variTextcol, [], pos, uiText.style, fontSize, true, Align);

    const pad = 20;
    // Add constText meshes to Gl buffers 
    for (let i = 0; i < uiText.constText.letters.length; i++) {
        // Update the unchanged text's x pos to fit with the variable one
        // uiText.constText.letters[i].pos[0] -= uiText.variText.dim[0] + pad;
        // Add to Gl buffers
        uiText.constText.letters[i].gfxInfo = GlAddMesh(uiText.constText.sid, uiText.constText.letters[i], 1, sceneId, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    }

    for (let i = 0; i < uiText.variText.letters.length; i++) {
        // Update the unchanged text's x pos to fit with the variable one
        // uiText.variText.letters[i].pos[0] += uiText.variText.dim[0] + pad;
        uiText.variText.letters[i].gfxInfo = GlAddMesh(uiText.constText.sid, uiText.variText.letters[i], 1, sceneId, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    }

    // Move the uiText val to the right so it does not overlap withe the ui text 'uiText:'
    const move = [uiText.variText.dim[0] / 2 + 10, 0.0];
    for (let i = 0; i < uiText.variText.letters.length; i++) {
        GlMove(uiText.variText.letters[i].gfxInfo, move);
        uiText.variText.letters[i].pos[0] += move;
    }

    // Reset the uiText value (after initializing constText faces  to max number display of '100000'),
    // to 0. Update all faces with space character and a 0 at the start
    uiText.val = 0;
    // GlSetTex(uiText.variText.letters[0].gfxInfo, FontGetUvCoords('0'));
    for (let i = 0; i < uiText.variText.letters.length; i++) {
        
        let uvs = [];
        if(variTextStr[i]) // Set the uvs for the variable text
            uvs = FontGetUvCoords(variTextStr[i]);
        else // else fill up the remaining characters with space until max characters
            uvs = FontGetUvCoords(' ');
        
            GlSetTex(uiText.variText.letters[i].gfxInfo, uvs);
        uiText.variText.letters[i].tex = uvs;
    }

    return uiText;
}
export function UiUpdate(uiTextIndex, val){

    uiTexts[uiTextIndex].val += val;
    const text = uiTexts[uiTextIndex].val.toFixed(1);

    for (let i = 0; i < text.length; i++) {
        const uvs = FontGetUvCoords(text[i]);
        GlSetTex(uiTexts[uiTextIndex].variText.letters[i].gfxInfo, uvs);
        uiTexts[uiTextIndex].variText.letters[i].tex = uvs;
    }
}

export function UiCreateScore(sceneId) {
    
    const pos = [30, GAME_AREA_TOP + 20, 4];
    const fontSize = 7;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };
    
    uiTexts[UI_TEXT_INDEX.SCORE] = UiCreate(sceneId, 'Score: ', '0', WHITE, YELLOW_229_206_0, pos, fontSize, style, ALIGN.LEFT | ALIGN.TOP);

}
export function UiUpdateScore(sceneId) {

    let score = uiTexts[UI_TEXT_INDEX.SCORE].val;
    score = score + (SCORE_FOR.brick * uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
    const text = Math.floor(score).toString();

    for (let i = 0; i < text.length; i++) {
        const uvs = FontGetUvCoords(text[i]);
        GlSetTex(uiTexts[UI_TEXT_INDEX.SCORE].variText.letters[i].gfxInfo, uvs);
        uiTexts[UI_TEXT_INDEX.SCORE].variText.letters[i].tex = uvs;
    }
}
export function UiCreateScoreModifier(sceneId) {

    const pos = [-70, -20, 6];
    const fontSize = 7;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };

    uiTexts[UI_TEXT_INDEX.SCORE_MOD] = UiCreate(sceneId, 'Score mod x', '0', WHITE, MAGENTA_RED, pos, fontSize, style, ALIGN.RIGHT | ALIGN.BOTTOM);
}
export function UiCreateLives(sceneId) {

    const pos = [30, -20, 2];
    const fontSize = 7;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };

    uiTexts[UI_TEXT_INDEX.LIVES] = UiCreate(sceneId, 'Lives: ', '3', WHITE, MAGENTA_RED, pos, fontSize, style, ALIGN.LEFT | ALIGN.BOTTOM);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Create animated score modifier text for every score mod earning */

class Mod {

    constructor(sid, text, color, dim, pos, style, fontSize, useSdfFont, Align){
        this.sid = sid;
        this.text = CreateText(text, color, dim, pos, style, fontSize, useSdfFont, Align);
    }

    text = null;
    isEmpty = false;
    inAnimation = false;
    sid = 0;
};

const mods = [];
let MODS_MAX_COUNT = 16;

export function UiInitMods(){

    const sid = SID_DEFAULT_TEXTURE_SDF;
    const gfxInfo = GlCreateReservedBuffer(sid, SCENE.play, 'ReservedBuffer1');


    const modFontSize = 6;

    for(let i = 0; i < MODS_MAX_COUNT; i++){

        const text = '9999';
        mods[i] = new Mod(sid, text, TRANSPARENT, [0,0,0], [0,100,2], null, modFontSize, true, ALIGN.NONE);
        mods[i].isEmpty = true;

        for (let j = 0; j < mods[i].text.letters.length; j++) {
            mods[i].text.letters[j].gfxInfo = GlAddMesh(mods[i].text.sid, mods[i].text.letters[j], 1, gfxInfo.sceneId, DONT_CREATE_NEW_GL_BUFFER, gfxInfo.vb.idx);
        }
    }
    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(gfxInfo.prog.idx, gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; 
    
}

// const UI_MOD_COLOR = ORANGE_230_148_0;
const UI_MOD_COLOR = WHITE;

export function UiCreateModifierValue(targetPos, modVal) {
    
    let pos = [];
    pos[0] = targetPos[0];
    pos[1] = targetPos[1];
    pos[2] = -5;

    for(let i = 0; i < MODS_MAX_COUNT; i++){

        if(mods[i].isEmpty){
            
            const text = '+' + modVal.toFixed(1);
            for (let j = 0; j < text.length; j++) {
                               
                // Color the mod depending on the some characteristics
                GlSetColor(mods[i].text.letters[j].gfxInfo, UI_MOD_COLOR);
                math.SetArr4(mods[i].text.letters[j].col, UI_MOD_COLOR);
                
                // Set as position the bricks position
                GlSetWpos(mods[i].text.letters[j].gfxInfo, pos);
                mods[i].text.letters[j].pos[0] = pos[0];
                mods[i].text.letters[j].pos[1] = pos[1];
                pos[0] += mods[i].text.letters[j].dim[0]*2;

                // Set texture coordinates
                const uvs = FontGetUvCoords(text[j]);
                GlSetTex(mods[i].text.letters[j].gfxInfo, uvs);
                mods[i].text.letters[j].tex = uvs;
            }

            mods[i].isEmpty     = false;
            mods[i].inAnimation = true;
            uiTexts[UI_TEXT_INDEX.SCORE_MOD].val += modVal;

            UiUpdateScore(uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);

            // Create mod 'disappear' animation
            return;
        }
    }
}


export function UiModRunAnimation(){

    // const colorFactor   = 0.97;
    const colorFactor   = 0.985;
    const yPosAdvance   = -0.7;

    for(let i = 0; i < MODS_MAX_COUNT; i++){
        
        if(mods[i].inAnimation){
            // TODO: mods[i].text.letters.length  = 4 but the text may be 2 chars. 
            // So we set unused data. FIX IT
            for(let j = 0; j < mods[i].text.letters.length; j++){
                
                math.MulArr4Val(mods[i].text.letters[j].col, colorFactor);
                GlSetColor(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].col);
                
                mods[i].text.letters[j].pos[1] += yPosAdvance;
                GlSetWpos(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].pos);
            }
            
            if(mods[i].text.letters[0].col[0] <= 0.2){
                for(let j = 0; j < mods[i].text.letters.length; j++){
                    math.SetArr4(mods[i].text.letters[j].col, [.0,.0,.0,.0]);
                    GlSetColor(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].col);
                }
                mods[i].inAnimation = false;
                mods[i].isEmpty = true;
            }
        }
    }
}