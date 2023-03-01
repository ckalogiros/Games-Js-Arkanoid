"use strict";
import { CreateText } from "../../../Engine/Drawables/Text.js";
import { GlMove, GlScale, GlSetScale, GlSetColor, GlSetTex, GlSetWpos, GlSetWposX } from "../../../Graphics/GlBufferOps.js";
import { GlAddMesh, GlCreateReservedBuffer } from "../../../Graphics/GlBuffers.js";
import { FontGetUvCoords } from "../../../Engine/Loaders/Font/LoadFont.js";
import { GlGetVB } from "../../../Graphics/GlProgram.js";
import * as math from "../../../Helpers/Math/MathOperations.js"
import { DarkenColor } from "../../../Helpers/Helpers.js";
import { AnimationsGet } from "../../../Engine/Animations/Animations.js";

/**
 * TODO: For now style is not used by simple text.
 */

// Score's for diffferent kinds of achievments
const SCORE_FOR = {
    brick: 10,
};

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
    uiText.constText = CreateText(constTextStr, constTextcol, [], pos, uiText.style, fontSize, true, Align);

    // Create the changed text (it is numerical value in most cases)
    pos[0] += uiText.constText.dim[0];
    uiText.variText = CreateText(uiText.val.toFixed(1), variTextcol, [], pos, uiText.style, fontSize, true, Align);

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
    const fontSize = 7;
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
    const fontSize = 7;
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
    const fontSize = 7;
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
    const fontSize = 7;
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

class Mod {

    constructor(sid, text, color, dim, pos, style, fontSize, useSdfFont, Align) {
        this.fontSize = fontSize;
        this.text = CreateText(text, color, dim, pos, style, fontSize, useSdfFont, Align);
    }

    text = null;
    isEmpty = true;
    inAnimation = false;
    fontSize = 0;
    animation = {
        scaleFactor: 1,
        inUpScale: false,
    };
};

const mods = [];
let MODS_MAX_COUNT = 16;

export function UiInitMods() {

    const sid = SID_DEFAULT_TEXTURE_SDF;
    const gfxInfo = GlCreateReservedBuffer(sid, SCENE.stage, 'Ui_Mods');
    const modFontSize = 6;

    for (let i = 0; i < MODS_MAX_COUNT; i++) {

        const text = '9999';
        mods[i] = new Mod(sid, text, TRANSPARENT, [0, 0, 0], [0, 0, 2], null, modFontSize, true, ALIGN.NONE);
        mods[i].isEmpty = true;

        for (let j = 0; j < mods[i].text.letters.length; j++) {
            mods[i].text.letters[j].gfxInfo = GlAddMesh(mods[i].text.sid, mods[i].text.letters[j], 1, gfxInfo.sceneIdx, 'Ui-Mod', DONT_CREATE_NEW_GL_BUFFER, gfxInfo.vb.idx);
            console.log('mods: ', mods[i].isEmpty)
        }
    }
    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(gfxInfo.prog.idx, gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35;

}

// const UI_MOD_COLOR = ORANGE_230_148_0;
const UI_MOD_COLOR = ORANGE_230_148_0;

export function UiCreateModifierValue(targetPos, modVal) {

    let pos = [];
    pos[0] = targetPos[0];
    pos[1] = targetPos[1];
    pos[2] = -5;

    for (let i = 0; i < MODS_MAX_COUNT; i++) {
        if (mods[i].isEmpty) {
            const text = '+' + modVal.toFixed(1);
            const textHalfWidth = text.length * mods[i].fontSize;
            pos[0] = pos[0] - textHalfWidth;
            for (let j = 0; j < text.length; j++) {

                const face = mods[i].text.letters[j];

                // Set default scale
                math.CopyArr2(mods[i].text.letters[j].dim, mods[i].text.letters[j].defDim);
                // console.log(face.defDim)
                // face.dim[1] = defScale;
                mods[i].text.letters[j].scale[0] = 1;
                mods[i].text.letters[j].scale[1] = 1;
                GlSetScale(mods[i].text.letters[j].gfxInfo, [1, 1])

                // Color the mod depending on the some characteristics
                GlSetColor(mods[i].text.letters[j].gfxInfo, UI_MOD_COLOR);
                math.CopyArr4(mods[i].text.letters[j].col, UI_MOD_COLOR);

                // Set as position the bricks position
                mods[i].text.letters[j].pos[0] = pos[0];
                mods[i].text.letters[j].pos[1] = pos[1];
                GlSetWpos(mods[i].text.letters[j].gfxInfo, pos);
                // pos[0] += mods[i].text.letters[j].dim[0];
                pos[0] += mods[i].text.letters[j].dim[0] * 2;
                // GlSetWpos(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].pos);

                // Set texture coordinates
                const uvs = FontGetUvCoords(text[j]);
                GlSetTex(mods[i].text.letters[j].gfxInfo, uvs);
                mods[i].text.letters[j].tex = uvs;
            }

            mods[i].isEmpty = false;
            mods[i].inAnimation = true;
            mods[i].animation.inUpScale = true;
            mods[i].animation.scaleFactor = 1.03;
            uiTexts[UI_TEXT_INDEX.SCORE_MOD].val += modVal;

            // Update the score adding the hit value * the mod value
            UiUpdateScore(uiTexts[UI_TEXT_INDEX.SCORE_MOD].val);
            if (targetPos[1] > 680) {
                console.log('@@@ 2: i: ', i, ' : ', mods[i].text.letters[0].pos[0])

            }
            return;
        }
    }
}


// export function UiModRunAnimation(){

//     // const colorFactor   = 0.97;
//     const colorFactor   = 0.985;
//     const yPosAdvance   = -0.7;

//     for(let i = 0; i < MODS_MAX_COUNT; i++){

//         if(mods[i].inAnimation){
//             // TODO: mods[i].text.letters.length  = 4 but the text may be 2 chars. 
//             // So we set unused data. FIX IT
//             for(let j = 0; j < mods[i].text.letters.length; j++){

//                 math.MulArr4Val(mods[i].text.letters[j].col, colorFactor);
//                 GlSetColor(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].col);

//                 mods[i].text.letters[j].pos[1] += yPosAdvance;
//                 GlSetWpos(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].pos);
//             }

//             if(mods[i].text.letters[0].col[0] <= 0.2){
//                 for(let j = 0; j < mods[i].text.letters.length; j++){
//                     math.CopyArr4(mods[i].text.letters[j].col, [.0,.0,.0,.0]);
//                     GlSetColor(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].col);
//                 }
//                 mods[i].inAnimation = false;
//                 mods[i].isEmpty = true;
//             }
//         }
//     }
// }


export function ModCreateAnimation() {
    const animation = AnimationsGet();
    animation.Create(ModAnimation, ModStopAnimation);
}
function ModAnimation() {

    // if(!mods.length) return false;

    const colorFactor = 0.985;
    const yPosAdvance = -0.7;
    let accumTextWidth = 0;

    for (let i = 0; i < MODS_MAX_COUNT; i++) {
        // if(mods[i].inAnimation){
        if (!mods[i].isEmpty) {

            // TODO: mods[i].text.letters.length  = 4 but the text may be 2 chars. 
            // So we set unused data. FIX IT
            for (let j = 0; j < mods[i].text.letters.length; j++) {

                // Cash
                const face = mods[i].text.letters[j];

                // Set dim color
                math.MulArr4Val(mods[i].text.letters[j].col, colorFactor);
                GlSetColor(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].col);

                // Translate
                mods[i].text.letters[j].pos[1] += yPosAdvance;
                GlSetWpos(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].pos);

                // Scale
                const scalex = mods[i].text.letters[j].scale[0];
                let scaleFactor = 1.01;
                if(scalex > 2 && mods[i].animation.inUpScale){
                    mods[i].animation.scaleFactor = 0.99;
                    mods[i].animation.inUpScale = false;
                }
                mods[i].text.letters[j].dim[0] *= mods[i].animation.scaleFactor;
                mods[i].text.letters[j].dim[1] *= mods[i].animation.scaleFactor;
                mods[i].text.letters[j].scale[0] *= mods[i].animation.scaleFactor;
                mods[i].text.letters[j].scale[1] *= mods[i].animation.scaleFactor;
                GlScale(mods[i].text.letters[j].gfxInfo, [mods[i].animation.scaleFactor, mods[i].animation.scaleFactor])


                // const a = mods[i].text.letters[j].dim[0];
                const a = 0;
                // accumTextWidth += mods[i].text.letters[j].dim[0]/2; // Accum half width
                // const posx = mods[i].text.letters[j].pos[0] - (mods[i].text.letters[j].dim[0]/2) + accumTextWidth - a;
                // const posx = mods[i].text.letters[j].pos[0] - (mods[i].text.letters[j].dim[0]/2) + accumTextWidth;
                // GlSetWposX(mods[i].text.letters[j].gfxInfo, posx);
                // accumTextWidth += mods[i].text.letters[j].dim[0]; // Accum half width
                // accumTextWidth += mods[i].text.letters[j].dim[0]/2;
            }

            if (mods[i].text.letters[0].col[0] <= 0.2) {
                // for(let j = 0; j < mods[i].text.letters.length; j++){
                //     math.CopyArr4(mods[i].text.letters[j].col, [.0,.0,.0,.0]);
                //     GlSetColor(mods[i].text.letters[j].gfxInfo, mods[i].text.letters[j].col);
                // }
                // console.log('3: i: ', i, ' : ', mods[i].text.letters[0].pos[0])
                // if (i == 1)
                //     console.log()
                mods[i].inAnimation = false;
                mods[i].isEmpty = true;
            }
        }
    }

    return true;
}
function ModStopAnimation() {

}