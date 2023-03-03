"use strict";

import { GlSetTex } from "../../../Graphics/GlBufferOps.js";
import { GlAddMesh } from "../../../Graphics/GlBuffers.js";
import { FontGetUvCoords } from "../../Loaders/Font/LoadFont.js";
import { Rect, RectCreateRect } from "../Rect.js";
import { CreateText } from "../Text.js";

/**
 * The difference with plain text is that a label draws the text inside a rect mesh
 */
export class TextLabel {

    name = '';
    area = null; // Labels's rect area.
    text = null; // Labels's text faces.

    style = {
        pad: 3, // In pixels
        roundCorner: 0,
        border: 0,
        feather: 0,
    };

    constructor(sceneIdx, name, text, col, bkCol, dim, pos, style, fontSize, useSdfFont, sdfInner, Align) {
        this.name = name;
        this.style.roundCorner = style.roundCorner;
        this.style.border = style.border;
        this.style.feather = style.feather;
        this.text = CreateText(text, col, dim, pos, style, fontSize, useSdfFont, sdfInner, Align);
        this.area = this.CreateArea(name + '-area', bkCol, this.text.dim, this.text.pos, this.text.faceWidth, style, this.style.pad);
        this.area.gfxInfo = GlAddMesh(this.area.sid, this.area.mesh, 1, sceneIdx, 'button', DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
        for (let i = 0; i < this.text.letters.length; i++) {
            this.text.letters[i].gfxInfo = GlAddMesh(this.text.sid, this.text.letters[i], 1, sceneIdx, name, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
        }
        // Store the gfxInfo of one of the text faces (instead of accessing 'xxx.text.letters[x].gfxInfo')
        this.text.gfxInfo = this.text.letters[0].gfxInfo;
    }

    CreateArea(name, col, dim, pos, charWidth, style, pad) {
        // Create the buttons area(based on text dimentions and position)
        const areaWpos = pos;
        areaWpos[0] += dim[0] - charWidth;
        areaWpos[2] -= 1; // Draw area beneath text

        // Add padding
        dim[0] += pad * 2 + style.border + style.feather;
        dim[1] += pad * 2 + style.border + style.feather;

        const area = new Rect(name, SID_DEFAULT, col, dim, [1, 1], null, areaWpos, style, null);

        area.defDim = area.dim; // Keep a duplicate of the first assigned dimintion.
        area.defWpos = area.pos; // Keep a duplicate of the first assigned dimintion.

        return area;
    }

    ChangeText(newText) {
        this.name = newText;

        const newlen = newText.length;
        const totallen = this.text.len;
        const spaceCharUvs = FontGetUvCoords(' ');

        for (let i = 0; i < totallen; i++) {
            if(i < newlen){
                const uvs = FontGetUvCoords(newText[i]);
                GlSetTex(this.text.letters[i].gfxInfo, uvs);
                this.text.letters[i].tex = uvs;
            }
            else{ // Set remaining characters to empty(space char)
                GlSetTex(this.text.letters[i].gfxInfo, spaceCharUvs);
                this.text.letters[i].tex = spaceCharUvs;
            }
        }
    }
}