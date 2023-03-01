"use strict";
import * as math from '../../Helpers/Math/MathOperations.js'
import { GlSetColor } from "../../Graphics/GlBufferOps.js";
import { DimColor } from "../../Helpers/Helpers.js";
import { Max3 } from "../../Helpers/Math/MathOperations.js";
import { Mesh } from "./Mesh.js";


export class Rect {

    sid     = 0; // Shader Type Id
    mesh    = null; // Meshe's attributes
    gfxInfo = null; // Graphics Info
    display = true;
    defScale = [1, 1];
    // For debuging
    name = '';

    constructor(name, sid, col, dim, scale, tex, pos, style, time) {
        this.name = name;
        this.sid = sid;
        this.display = true;
        this.mesh = new Mesh(col, dim, scale, tex, pos, style, time);
        math.CopyArr2(this.defScale, scale);
    }

    /**
     * @param {float} minCol: The min value that the color should transition
     *                      The min value is checked based on the MAX(r, g, b)
     * @param {float} amt: the ammount of color dim. 
     *                  Should be a value of range [0.0, 1.0]
     *                  The higher the value, the slower the transition 
     * @returns {bool} True: Animation not finished. False: Animation is finished.
     */
    DimColor(minCol, amt) {
        const col = DimColor(this.mesh.col, amt);
        const max = Max3(col[0], col[1], col[2])
        if (max > minCol) {
            GlSetColor(this.gfxInfo, col);
            this.mesh.col = col;
            return true;
        }
        return false;
    }
}

export function RectCreateRect(name, sid, col, dim, scale, tex, pos, style, time) {
    return new Rect(name, sid, col, dim, scale, tex, pos, style, time);
}