"use strict";
import * as math from '../../Helpers/Math/MathOperations.js'
import { GlSetColor, GlSetWpos, GlSetDim, GlSetColorAlpha, GlSetScale, GlScale } from "../../Graphics/GlBufferOps.js";
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
        this.mesh = new Mesh(col, dim, scale, tex, pos, style, time, null, null);
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
    SetColor(col) {
        math.CopyArr4(this.mesh.col, col);
        GlSetColor(this.gfxInfo, col);
    }
    SetPos(pos) {
        math.CopyArr3(this.mesh.pos, pos);
        GlSetWpos(this.gfxInfo, pos);
    }
    SetDim(dim) {
        math.CopyArr2(this.mesh.dim, dim);
        GlSetDim(this.gfxInfo, dim);
    }
    SetColorAlpha(alpha) {
        this.mesh.col[3] = alpha;
        GlSetColorAlpha(this.gfxInfo, alpha);
    }
    SetScale(scale){
        // math.CopyArr2(this.mesh.scale, scale);
        // GlSetScale(this.gfxInfo, this.mesh.scale);
        // // Also set dim to mirror the scale
        // this.mesh.dim[0] *= scale[0];    
        // this.mesh.dim[0] *= scale[1];
    }
    ScaleFromVal(val){
        this.mesh.scale[0] *= val;
        this.mesh.scale[1] *= val;
        // GlScale(this.gfxInfo, val);
        GlSetScale(this.gfxInfo, this.mesh.scale);
        // Also set dim to mirror the scale
        this.mesh.dim[0] *= val;    
        this.mesh.dim[1] *= val;
    }
    SetScaleFromVal(val){
        this.mesh.scale[0] = val;
        this.mesh.scale[1] = val;
        GlSetScale(this.gfxInfo, this.mesh.scale);
    }
}

export function RectCreateRect(name, sid, col, dim, scale, tex, pos, style, time) {
    return new Rect(name, sid, col, dim, scale, tex, pos, style, time);
}