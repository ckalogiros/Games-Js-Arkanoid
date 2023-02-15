"use strict";
// import { FontGetUvCoords, FontGetCharFaceRatio, FontGetCharWidth, FontGetCharHeight } from '../../Loaders/Font/LoadFont.js'
import { GlAddMesh } from '../../../Graphics/GlBuffers.js'
import { RectCreateRect } from '../Rect.js'
import { CreateText } from '../Text.js'
import { GlScale, GlSetScale, GlSetWposX } from '../../../Graphics/GlBufferOps.js';
import { GlSetAttrRoundCorner, GlSetAttrBorderWidth, GlSetAttrBorderFeather } from '../../../Graphics/GlBufferOps.js';


const BUTTON_AREA_SHADER_TYPE = SID_DEFAULT;



class Button {

    constructor(name, text, col, bkCol, dim, pos, style, fontSize, useSdfFont, Align) {
        this.name = name;
        this.text = CreateText(text, col, dim, pos, style, fontSize, useSdfFont, Align);
        this.pad = style.pad;
        this.style.roundCorner = style.roundCorner;
        this.style.border = style.border;
        this.style.feather = style.feather;
    }

    name = '';
    area = null; // Button's rect area.
    text = null; // Button's text faces.

    state = {         // The state in which a button may be.
        inHover: false,
        inAnimation: false,
        inUpScale: false,
        inDownScale: false,
    };

    style = {
        pad: 3, // In pixels
        roundCorner: 0,
        border: 0,
        feather: 0,
    };

};

class Buttons { btn = []; count = 0; }
const buttons = new Buttons; // Array for all buttons
const buttonsArea = []; // Array for all buttons areas. It is a duplicate (for efficiency) of all button areas of the above array

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Getters-Setters's Section
 */
export function ButtonGetButtons() {
    return buttons;
}
export function GetButton(btnIdx) {
    if (btnIdx >= 0 && btnIdx < buttons.count)
        return buttons.btn[btnIdx];
    else
        return null;
}
export function GetButtonsAreas() {
    return buttonsArea;
}
export function GetButtonGfxInfo(btnIdx) {
    return buttons.btn[btnIdx].area.gfxInfo;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialization Section
 */
export function CreateButton(scene, name, text, col, bkCol, dim, pos, style, fontSize, useSdfFont, Align) {

    const idx = buttons.count;
    const btn = new Button(name, text, col, bkCol, dim, pos, style, fontSize, useSdfFont, Align);
    btn.area = CreateButtonArea(name + '-area', bkCol, btn.text.dim, btn.text.pos, btn.text.faceWidth, style, btn.style.pad);

    btn.area.sid = BUTTON_AREA_SHADER_TYPE;

    // Add buttons area to Gl buffers
    btn.area.gfxInfo = GlAddMesh(btn.area.sid, btn.area.mesh, 1, scene, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);

    // Add text meshes to Gl buffers 
    for (let i = 0; i < btn.text.letters.length; i++) {
        btn.text.letters[i].gfxInfo = GlAddMesh(btn.text.sid, btn.text.letters[i], 1, scene, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    }
    // This is for just have the prog.idx, vb.idx,...etc info in the btn.text structure.
    btn.text.gfxInfo = btn.text.letters[0].gfxInfo;

    // Have all buttons areas in one buffer, for efficiency
    buttonsArea[idx] = btn.area.mesh;
    buttons.btn[idx] = btn; // Finally store the newly created button to the buttons array 
    buttons.count++;

    return btn;
}

function CreateButtonArea(name, col, dim, pos, charWidth, style, pad) {

    // Create the buttons area(based on text dimentions and position)
    const areaWpos = pos;
    areaWpos[0] += dim[0] - charWidth;
    areaWpos[2] -= 1; // Draw btn area beneath text

    // Add padding
    dim[0] += pad * 2 + style.border + style.feather;
    dim[1] += pad * 2 + style.border + style.feather;

    const area = RectCreateRect(name, SID_DEFAULT, col, dim, [1, 1], null, areaWpos, style, null);

    area.defDim = area.dim; // Keep a duplicate of the first assigned dimintion.
    area.defWpos = area.pos; // Keep a duplicate of the first assigned dimintion.

    return area;
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Animation's Section
 */

/**
 * Buttons Scale Animation, for hovered buttons.
 * 
 * @param {*} idx 
 * @param {*} scaleFactor 
 */
export function ButtonRunScaleAnimation(idx, scaleFactor) {

    GlScale(buttons.btn[idx].area.gfxInfo, [scaleFactor, scaleFactor]);// Update Vertex Buffer
    buttonsArea[idx].scale[0] *= scaleFactor; // Update button's area scale x
    buttonsArea[idx].scale[1] *= scaleFactor; // Update button's area scale y
    buttonsArea[idx].dim[0] *= scaleFactor; // Update button's area dimentions x
    buttonsArea[idx].dim[1] *= scaleFactor; // Update button's area dimentions y
    ButtonTextScaleAnimation(idx, scaleFactor,);

}

/**
 * Helper function for button scale animation.
 * It sets the scale for the button's text faces.
 * 
 * @param {*} idx : Button's index.
 * @param {*} scaleFactor : The value to be scaled to.
 */
function ButtonTextScaleAnimation(idx, scaleFactor) {

    let posx = 0;
    let accumTextWidth = 0;
    const textLen = buttons.btn[idx].text.letters.length;

    for (let i = 0; i < textLen; i++) {

        GlScale(buttons.btn[idx].text.letters[i].gfxInfo, [scaleFactor, scaleFactor]);// Update Vertex Buffer
        buttons.btn[idx].text.letters[i].scale[0] *= scaleFactor; // Update button's text scale x
        buttons.btn[idx].text.letters[i].scale[1] *= scaleFactor; // Update button's text scale y
        buttons.btn[idx].text.letters[i].dim[0] *= scaleFactor; // Update button's text dimentions x
        buttons.btn[idx].text.letters[i].dim[1] *= scaleFactor; // Update button's text dimentions y

        /**
         * Accumulate the width of each char in text, in 2 parts.
         * First part, store half width of current character
         * Second part, store half width current character, 
         * but to be added to the next character's (next iteration) 
         * starting position  
        */
        const extraWidth = buttons.btn[idx].style.pad * 2 + buttons.btn[idx].style.border + buttons.btn[idx].style.feather;
        // accumTextWidth += buttons.btn[idx].text.letters[i].dim[0] * (scaleFactor*1.04); 
        accumTextWidth += buttons.btn[idx].text.letters[i].dim[0];
        // posx = buttonsArea[idx].pos[0] - buttonsArea[idx].dim[0] + (extraWidth * scaleFactor) + accumTextWidth;
        posx = buttonsArea[idx].pos[0] - buttonsArea[idx].dim[0] + extraWidth + accumTextWidth;
        GlSetWposX(buttons.btn[idx].text.letters[i].gfxInfo, posx);
        // accumTextWidth += buttons.btn[idx].text.letters[i].dim[0] * (scaleFactor*1.04);
        accumTextWidth += buttons.btn[idx].text.letters[i].dim[0];
    }
}

/**
 * Set the default values for a button
 * after completing an animation for scale.
 * That is because of the cpu's floating point
 * numbers rounding error.
 * 
 * @param {*} idx : The index of the button to be set; 
 */
export function ButtonSetDefaultMeshProps(idx) {

    // Set buttons area to default scale
    const areaDefScale = [buttons.btn[idx].area.defScale[0], buttons.btn[idx].area.defScale[1]]
    GlSetScale(buttons.btn[idx].area.gfxInfo, areaDefScale); // Update Vertex Buffer
    buttonsArea[idx].scale[0] = areaDefScale[0]; // Reset button's area scale x
    buttonsArea[idx].scale[1] = areaDefScale[1]; // Reset button's area scale y
    buttonsArea[idx].dim[0] = buttonsArea[idx].defDim[0];   // Reset button's area dimentions x
    buttonsArea[idx].dim[1] = buttonsArea[idx].defDim[1];   // Reset button's area dimentions y

    // Set buttons text to default scale and position
    const textLen = buttons.btn[idx].text.letters.length;
    for (let i = 0; i < textLen; i++) {

        GlSetScale(buttons.btn[idx].text.letters[i].gfxInfo, [1, 1]);// Update Vertex Buffer
        buttons.btn[idx].text.letters[i].scale[0] = [1, 1];
        buttons.btn[idx].text.letters[i].scale[1] = [1, 1];

        GlSetWposX(buttons.btn[idx].text.letters[i].gfxInfo, buttons.btn[idx].text.letters[i].defPos[0]); // Update Vertex Buffer
        buttons.btn[idx].text.letters[i].pos = buttons.btn[idx].text.letters[i].defWpos;
        buttons.btn[idx].text.letters[i].dim[0] = buttons.btn[idx].text.letters[i].defDim[0];

    }
}

export function ButtonSetRoundCorner(roundnes) {

    for (let i = 0; i < buttonsArea.length; i++) {

        GlSetAttrRoundCorner(buttons.btn[i].area.gfxInfo, roundnes);
    }
}
export function ButtonSetBorderWidth(width) {

    for (let i = 0; i < buttonsArea.length; i++) {

        GlSetAttrBorderWidth(buttons.btn[i].area.gfxInfo, width);
    }
}
export function ButtonSetBorderFeather(feather) {

    for (let i = 0; i < buttonsArea.length; i++) {

        GlSetAttrBorderFeather(buttons.btn[i].area.gfxInfo, feather);
    }
}
