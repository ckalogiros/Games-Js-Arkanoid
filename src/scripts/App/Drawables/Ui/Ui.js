"use strict";
import { CreateText } from "../../../Engine/Drawables/Text.js";
import { GlMove, GlScale, GlSetScale, GlSetColor, GlSetTex, GlSetWpos, GlSetWposX } from "../../../Graphics/GlBufferOps.js";
import { GlAddMesh, GlCreateReservedBuffer } from "../../../Graphics/GlBuffers.js";
import { FontGetUvCoords } from "../../../Engine/Loaders/Font/LoadFont.js";
import { GlGetVB } from "../../../Graphics/GlProgram.js";
import * as math from "../../../Helpers/Math/MathOperations.js"
import { CalculateSdfOuterFromDim, DarkenColor } from "../../../Helpers/Helpers.js";
import { AnimationsGet } from "../../../Engine/Animations/Animations.js";

/**
 * TODO: For now style is not used by simple text.
 */

// Score's for diffferent kinds of achievments
const SCORE_FOR = {
    brick: 10,
};

const UI_SDF_INNER_PARAMS = 0.4;

// Exporting is only for the class type(to compare with the instanceof operator)
export class UiTextVariable {

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

export function UiGet() {
    return uiTexts;
}
export function UiGetScore() {
    if (uiTexts.length)
        return uiTexts[UI_TEXT_INDEX.SCORE].val;
    else return '0';
}
export function UiGetTotalScore() {
    if (uiTexts.length)
        return uiTexts[UI_TEXT_INDEX.TOTAL_SCORE].val;
    else return '0';
}
export function UiSetTotalScore(totalScore) {
    uiTexts[UI_TEXT_INDEX.TOTAL_SCORE].val = totalScore;
}



function UiCreate(sceneIdx, constTextStr, variTextStr, constTextcol, variTextcol, pos, fontSize, style, Align) {

    const uiText = new UiTextVariable(style);

    // Create the unchanged text
    uiText.constText = CreateText(constTextStr, constTextcol, [], pos, uiText.style, fontSize, true, UI_SDF_INNER_PARAMS, Align);

    // Create the changed text (it is numerical value in most cases)
    pos[0] += uiText.constText.dim[0];
    uiText.variText = CreateText(uiText.val.toFixed(1), variTextcol, [], pos, uiText.style, fontSize, true, UI_SDF_INNER_PARAMS, Align);

    const pad = 20;
    // Add constText meshes to Gl buffers 
    for (let i = 0; i < uiText.constText.letters.length; i++) {
        // Update the unchanged text's x pos to fit with the variable one
        // Add to Gl buffers
        uiText.constText.letters[i].gfxInfo = GlAddMesh(uiText.constText.sid, uiText.constText.letters[i], 1, sceneIdx, 'Ui', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    }

    for (let i = 0; i < uiText.variText.letters.length; i++) {
        // Update the unchanged text's x pos to fit with the variable one
        // uiText.variText.letters[i].pos[0] += uiText.variText.dim[0] + pad;
        uiText.variText.letters[i].gfxInfo = GlAddMesh(uiText.constText.sid, uiText.variText.letters[i], 1, sceneIdx, 'Ui', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
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
    for (let i = 0; i < uiText.variText.letters.length; i++) {

        let uvs = [];
        if (variTextStr[i]) // Set the uvs for the variable text
            uvs = FontGetUvCoords(variTextStr[i]);
        else // else fill up the remaining characters with space until max characters
            uvs = FontGetUvCoords(' ');

        GlSetTex(uiText.variText.letters[i].gfxInfo, uvs);
        uiText.variText.letters[i].tex = uvs;
    }

    return uiText;
}
export function UiUpdate(uiTextIndex, val) {

    uiTexts[uiTextIndex].val += val;
    const text = uiTexts[uiTextIndex].val.toFixed(1); // toFixed: floating point digits

    for (let i = 0; i < text.length; i++) {
        const uvs = FontGetUvCoords(text[i]);
        GlSetTex(uiTexts[uiTextIndex].variText.letters[i].gfxInfo, uvs);
        uiTexts[uiTextIndex].variText.letters[i].tex = uvs;
    }
}

export function UiCreateScore(sceneIdx) {

    const pos = [30, GAME_AREA_TOP + 20, 4];
    const fontSize = UI_TEXT.FONT_SIZE;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };

    uiTexts[UI_TEXT_INDEX.SCORE] = UiCreate(sceneIdx, 'Score: ', '0', WHITE, YELLOW_229_206_0, pos, fontSize, style, ALIGN.LEFT | ALIGN.TOP);

}
export function UiUpdateScore() {

    let score = uiTexts[UI_TEXT_INDEX.SCORE].val;
    score = score + (SCORE_FOR.brick * uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
    const text = Math.floor(score).toString();

    for (let i = 0; i < text.length; i++) {
        const uvs = FontGetUvCoords(text[i]);
        GlSetTex(uiTexts[UI_TEXT_INDEX.SCORE].variText.letters[i].gfxInfo, uvs);
        uiTexts[UI_TEXT_INDEX.SCORE].variText.letters[i].tex = uvs;
    }
    uiTexts[UI_TEXT_INDEX.SCORE].val = score;
}
export function UiCreateTotalScore(sceneIdx) {

    const pos = [-70, GAME_AREA_TOP + 20, 4];
    const fontSize = UI_TEXT.FONT_SIZE;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };

    uiTexts[UI_TEXT_INDEX.TOTAL_SCORE] = UiCreate(sceneIdx, 'Total Score:', '0', WHITE, GREENL1, pos, fontSize, style, ALIGN.RIGHT | ALIGN.TOP);

}
export function UiUpdateTotalScore(totalScore) {

    const score = uiTexts[UI_TEXT_INDEX.TOTAL_SCORE].val;
    // score = score + (SCORE_FOR.brick * uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
    const text = Math.floor(score).toString();

    for (let i = 0; i < text.length; i++) {
        const uvs = FontGetUvCoords(text[i]);
        GlSetTex(uiTexts[UI_TEXT_INDEX.TOTAL_SCORE].variText.letters[i].gfxInfo, uvs);
        uiTexts[UI_TEXT_INDEX.TOTAL_SCORE].variText.letters[i].tex = uvs;
    }
}
export function UiCreateScoreModifier(sceneIdx) {

    const pos = [-70, Viewport.bottom - 20, 6];
    const fontSize = UI_TEXT.FONT_SIZE;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };

    uiTexts[UI_TEXT_INDEX.SCORE_MOD] = UiCreate(sceneIdx, 'Score mod x', '0', WHITE, MAGENTA_RED, pos, fontSize, style, ALIGN.RIGHT | ALIGN.BOTTOM);
}
export function UiCreateLives(sceneIdx) {

    const pos = [30, Viewport.bottom - 20, 2];
    const fontSize = UI_TEXT.FONT_SIZE;
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };

    uiTexts[UI_TEXT_INDEX.LIVES] = UiCreate(sceneIdx, 'Lives: ', '3', WHITE, MAGENTA_RED, pos, fontSize, style, ALIGN.LEFT | ALIGN.BOTTOM);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Create animated score modifier text for every score mod earning */
const MODS_MAX_COUNT = 32;
class Mod {
    text = null;
    isActive = false;
    inAnimation = false;
    fontSize = 0;
    animation = {
        scaleFactor: 1,
        inUpScale: false,
    };

    constructor(sid, txt, col, dim, pos, style, fontSize, useSdfFont, align) {
        this.fontSize = fontSize;
        this.text = CreateText(txt, col, dim, pos, style, fontSize, useSdfFont, UI_SDF_INNER_PARAMS, align);
    }
};

class Mods{

    mod = [];
    count = 0;
    size = MODS_MAX_COUNT;

    constructor(){
        
    }

    Init(sid, fontSize, sceneIdx, vbIdx){
        for (let i = 0; i < MODS_MAX_COUNT; i++) {
    
            const text = '9999';
            this.mod[i] = new Mod(sid, text, TRANSPARENT, [0, 0, 0], [0, 0, 2], null, fontSize, true, ALIGN.NONE);
            for (let j = 0; j < this.mod[i].text.letters.length; j++) {
                this.mod[i].text.letters[j].gfxInfo = GlAddMesh(this.mod[i].text.sid, this.mod[i].text.letters[j], 1, sceneIdx, 'Ui-Mod', DONT_CREATE_NEW_GL_BUFFER, vbIdx);
            }
        }
    }
    Create(){

    }
    GetNextFree(){
        for(let i=0; i<this.size; i++){
            if(!this.mod[i].isActive)
                return {mod:this.mod[i], idx:i};
        }
        return null;
    }
}

const mods = new Mods;


export function UiInitMods() {

    const sid = SID_DEFAULT_TEXTURE_SDF;
    const gfxInfo = GlCreateReservedBuffer(sid, SCENE.stage, 'Ui_Mods');
    const fontSize = UI_TEXT.FONT_SIZE/2;

    mods.Init(sid, fontSize, gfxInfo.sceneIdx, gfxInfo.vb.idx);

    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(gfxInfo.prog.idx, gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35;

}


const UI_MOD_COLOR = ORANGE_230_148_0;



export function ModCreateAnimation(idx) {
    const animation = AnimationsGet();
    animation.Create(ModAnimation, ModStopAnimation, idx);
}


export function UiCreateModifierValue(targetPos, modVal) {

    let pos = [];
    pos[0] = targetPos[0];
    pos[1] = targetPos[1];
    pos[2] = -5;

    const obj = mods.GetNextFree();
    if(obj){
        const mod = obj.mod;
        console.log(obj.idx)
        GlSetColor(mod.text.letters[0].gfxInfo, WHITE);
        const text = '+' + modVal.toFixed(1);
        const textHalfWidth = text.length * (mod.fontSize);
        pos[0] = pos[0] - textHalfWidth;

        // Init attributes for each mod's text character
        for (let j = 0; j < text.length; j++) {
            // Set default scale
            math.CopyArr2(mod.text.letters[j].dim, mod.text.letters[j].defDim);

            mod.text.letters[j].scale[0] = 1;
            mod.text.letters[j].scale[1] = 1;
            GlSetScale(mod.text.letters[j].gfxInfo, [1, 1])

            // Color the mod depending on the some characteristics
            math.CopyArr4(mod.text.letters[j].col, UI_MOD_COLOR);
            GlSetColor(mod.text.letters[j].gfxInfo, UI_MOD_COLOR);

            // Set as position the bricks position
            mod.text.letters[j].pos[0] = pos[0];
            mod.text.letters[j].pos[1] = pos[1];
            GlSetWpos(mod.text.letters[j].gfxInfo, pos);
            pos[0] += mod.text.letters[j].dim[0] * 2;

            // Set texture coordinates
            const uvs = FontGetUvCoords(text[j]);
            GlSetTex(mod.text.letters[j].gfxInfo, uvs);
            mod.text.letters[j].tex = uvs;
        }

        mod.isActive = true;
        mod.inAnimation = true;
        mod.animation.inUpScale = true;
        // mod.animation.scaleFactor = 1.03;
        mod.animation.scaleFactor = 1.07;
        uiTexts[UI_TEXT_INDEX.SCORE_MOD].val += modVal;

        // Update the score adding the hit value * the mod value
        UiUpdateScore(uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
        ModCreateAnimation(obj.idx)
        return;
    }

    // for (let i = 0; i < MODS_MAX_COUNT; i++) {
    //     if (mods.mod[i].isActive) {
    //         const text = '+' + modVal.toFixed(1);
    //         const textHalfWidth = text.length * mods.mod[i].fontSize;
    //         pos[0] = pos[0] - textHalfWidth;

    //         for (let j = 0; j < text.length; j++) {
    //             // Set default scale
    //             math.CopyArr2(mods.mod[i].text.letters[j].dim, mods.mod[i].text.letters[j].defDim);

    //             mods.mod[i].text.letters[j].scale[0] = 1;
    //             mods.mod[i].text.letters[j].scale[1] = 1;
    //             GlSetScale(mods.mod[i].text.letters[j].gfxInfo, [1, 1])

    //             // Color the mod depending on the some characteristics
    //             math.CopyArr4(mods.mod[i].text.letters[j].col, UI_MOD_COLOR);
    //             GlSetColor(mods.mod[i].text.letters[j].gfxInfo, UI_MOD_COLOR);

    //             // Set as position the bricks position
    //             mods.mod[i].text.letters[j].pos[0] = pos[0];
    //             mods.mod[i].text.letters[j].pos[1] = pos[1];
    //             GlSetWpos(mods.mod[i].text.letters[j].gfxInfo, pos);
    //             pos[0] += mods.mod[i].text.letters[j].dim[0] * 2;

    //             // Set texture coordinates
    //             const uvs = FontGetUvCoords(text[j]);
    //             GlSetTex(mods.mod[i].text.letters[j].gfxInfo, uvs);
    //             mods.mod[i].text.letters[j].tex = uvs;
    //         }

    //         mods.mod[i].isActive = false;
    //         mods.mod[i].inAnimation = true;
    //         mods.mod[i].animation.inUpScale = true;
    //         // mods.mod[i].animation.scaleFactor = 1.03;
    //         mods.mod[i].animation.scaleFactor = 1.07;
    //         uiTexts[UI_TEXT_INDEX.SCORE_MOD].val += modVal;

    //         // Update the score adding the hit value * the mod value
    //         UiUpdateScore(uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
    //         ModCreateAnimation(i)
    //         return;
    //     }
    // }
}
function ModAnimation(i) {

    if(!mods.mod.length) return false;

    const colorFactor = 0.97;
    const yPosAdvance = 0.3;
    let nextCharWidth = 0;

    if (mods.mod[i].isActive) {

        // TODO: mods.mod[i].text.letters.length  = 4 but the text may be 2 chars. 
        // So we set unused data. FIX IT
        for (let j = 0; j < mods.mod[i].text.letters.length; j++) {
            // Set dim color
            math.MulArr4Val(mods.mod[i].text.letters[j].col, colorFactor);
            GlSetColor(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].col);

            // Scale
            const scalex = mods.mod[i].text.letters[j].scale[0];
            if (scalex > 2 && mods.mod[i].animation.inUpScale) {
                mods.mod[i].animation.scaleFactor = 0.99;
                mods.mod[i].animation.inUpScale = false;
            }
            mods.mod[i].text.letters[j].dim[0]   *= mods.mod[i].animation.scaleFactor;
            mods.mod[i].text.letters[j].dim[1]   *= mods.mod[i].animation.scaleFactor;
            mods.mod[i].text.letters[j].scale[0] *= mods.mod[i].animation.scaleFactor;
            mods.mod[i].text.letters[j].scale[1] *= mods.mod[i].animation.scaleFactor;
            GlScale(mods.mod[i].text.letters[j].gfxInfo, [mods.mod[i].animation.scaleFactor, mods.mod[i].animation.scaleFactor])


            // Translate
            const posx = (mods.mod[i].text.letters[j].pos[0] - (mods.mod[i].text.letters[j].dim[0]/2) + nextCharWidth);
            mods.mod[i].text.letters[j].pos[1] -= yPosAdvance;
            GlSetWpos(mods.mod[i].text.letters[j].gfxInfo, [posx, mods.mod[i].text.letters[j].pos[1]]);
            // nextCharWidth += mods.mod[i].text.letters[j].dim[0]/2; // Accum half width
            nextCharWidth += mods.mod[i].text.letters[j].dim[0]; // Accum half width
            // nextCharWidth += mods.mod[i].text.letters[j].dim[0]/2;
        }

        if (mods.mod[i].text.letters[0].col[0] <= 0.01) {
            mods.mod[i].inAnimation = false;
            mods.mod[i].isActive = false;
            return false;
        }
        return true;
    }
    // return false;
}
function ModStopAnimation() {

}



/////////////////////////////////////////////////////////////////////////////////////////////////
// Old Code
// export function UiCreateModifierValue(targetPos, modVal) {

//     let pos = [];
//     pos[0] = targetPos[0];
//     pos[1] = targetPos[1];
//     pos[2] = -5;

//     for (let i = 0; i < MODS_MAX_COUNT; i++) {
//         if (mods.mod[i].isActive) {
//             const text = '+' + modVal.toFixed(1);
//             const textHalfWidth = text.length * mods.mod[i].fontSize;
//             pos[0] = pos[0] - textHalfWidth;

//             for (let j = 0; j < text.length; j++) {
//                 // Set default scale
//                 math.CopyArr2(mods.mod[i].text.letters[j].dim, mods.mod[i].text.letters[j].defDim);

//                 mods.mod[i].text.letters[j].scale[0] = 1;
//                 mods.mod[i].text.letters[j].scale[1] = 1;
//                 GlSetScale(mods.mod[i].text.letters[j].gfxInfo, [1, 1])

//                 // Color the mod depending on the some characteristics
//                 math.CopyArr4(mods.mod[i].text.letters[j].col, UI_MOD_COLOR);
//                 GlSetColor(mods.mod[i].text.letters[j].gfxInfo, UI_MOD_COLOR);

//                 // Set as position the bricks position
//                 mods.mod[i].text.letters[j].pos[0] = pos[0];
//                 mods.mod[i].text.letters[j].pos[1] = pos[1];
//                 GlSetWpos(mods.mod[i].text.letters[j].gfxInfo, pos);
//                 // pos[0] += mods.mod[i].text.letters[j].dim[0];
//                 pos[0] += mods.mod[i].text.letters[j].dim[0] * 2;
//                 // GlSetWpos(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].pos);

//                 // Set texture coordinates
//                 const uvs = FontGetUvCoords(text[j]);
//                 GlSetTex(mods.mod[i].text.letters[j].gfxInfo, uvs);
//                 mods.mod[i].text.letters[j].tex = uvs;
//             }

//             mods.mod[i].isActive = false;
//             mods.mod[i].inAnimation = true;
//             mods.mod[i].animation.inUpScale = true;
//             // mods.mod[i].animation.scaleFactor = 1.03;
//             mods.mod[i].animation.scaleFactor = 1.01;
//             uiTexts[UI_TEXT_INDEX.SCORE_MOD].val += modVal;

//             // Update the score adding the hit value * the mod value
//             UiUpdateScore(uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
//             ModCreateAnimation()
//             return;
//         }
//     }
// }


// export function UiModRunAnimation(){

//     // const colorFactor   = 0.97;
//     const colorFactor   = 0.985;
//     const yPosAdvance   = -0.7;

//     for(let i = 0; i < MODS_MAX_COUNT; i++){

//         if(mods.mod[i].inAnimation){
//             // TODO: mods.mod[i].text.letters.length  = 4 but the text may be 2 chars. 
//             // So we set unused data. FIX IT
//             for(let j = 0; j < mods.mod[i].text.letters.length; j++){

//                 math.MulArr4Val(mods.mod[i].text.letters[j].col, colorFactor);
//                 GlSetColor(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].col);

//                 mods.mod[i].text.letters[j].pos[1] += yPosAdvance;
//                 GlSetWpos(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].pos);
//             }

//             if(mods.mod[i].text.letters[0].col[0] <= 0.2){
//                 for(let j = 0; j < mods.mod[i].text.letters.length; j++){
//                     math.CopyArr4(mods.mod[i].text.letters[j].col, [.0,.0,.0,.0]);
//                     GlSetColor(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].col);
//                 }
//                 mods.mod[i].inAnimation = false;
//                 mods.mod[i].isActive = true;
//             }
//         }
//     }
// }
// function ModAnimation() {

//     // if(!mods.length) return false;

//     const colorFactor = 0.995;
//     const yPosAdvance = 0.1;
//     let nextCharWidth = 0;

//     for (let i = 0; i < MODS_MAX_COUNT; i++) {
//         // if(mods.mod[i].inAnimation){
//         if (!mods.mod[i].isActive) {

//             // TODO: mods.mod[i].text.letters.length  = 4 but the text may be 2 chars. 
//             // So we set unused data. FIX IT
//             for (let j = 0; j < mods.mod[i].text.letters.length; j++) {

//                 // Cash
//                 const face = mods.mod[i].text.letters[j];

//                 // Set dim color
//                 // math.MulArr4Val(mods.mod[i].text.letters[j].col, colorFactor);
//                 // GlSetColor(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].col);

//                 // Translate
//                 mods.mod[i].text.letters[j].pos[1] -= yPosAdvance;
//                 // console.log(mods.mod[i].text.letters[j].pos[1])
//                 GlSetWpos(mods.mod[i].text.letters[j].gfxInfo, mods.mod[i].text.letters[j].pos);

//                 // Scale
//                 const scalex = mods.mod[i].text.letters[j].scale[0];
//                 if (scalex > 2 && mods.mod[i].animation.inUpScale) {
//                     mods.mod[i].animation.scaleFactor = 0.997;
//                     mods.mod[i].animation.inUpScale = false;
//                 }
//                 // mods.mod[i].text.letters[j].dim[0]   *= mods.mod[i].animation.scaleFactor;
//                 // mods.mod[i].text.letters[j].dim[1]   *= mods.mod[i].animation.scaleFactor;
//                 // mods.mod[i].text.letters[j].scale[0] *= mods.mod[i].animation.scaleFactor;
//                 // mods.mod[i].text.letters[j].scale[1] *= mods.mod[i].animation.scaleFactor;
//                 // GlScale(mods.mod[i].text.letters[j].gfxInfo, [mods.mod[i].animation.scaleFactor, mods.mod[i].animation.scaleFactor])


//                 // const a = mods.mod[i].text.letters[j].dim[0];
//                 // nextCharWidth += mods.mod[i].text.letters[j].dim[0]/2; // Accum half width
//                 // const posx = mods.mod[i].text.letters[j].pos[0] - (mods.mod[i].text.letters[j].dim[0]/2) + nextCharWidth;
//                 // GlSetWposX(mods.mod[i].text.letters[j].gfxInfo, posx);
//                 // nextCharWidth += mods.mod[i].text.letters[j].dim[0]; // Accum half width
//                 // nextCharWidth += mods.mod[i].text.letters[j].dim[0]/2;
//             }

//             if (mods.mod[i].text.letters[0].col[0] <= 0.2) {
//                 mods.mod[i].inAnimation = false;
//                 mods.mod[i].isActive = true;
//             }
//         }
//     }

//     return true;
// }