"use strict";
import * as math from "../../Helpers/Math/MathOperations.js"

/**
 * A structure to reflect a mesh's data to be inserted in the vertex buffer
 */
export class Mesh {

    col = [0, 0, 0, 0];
    dim = [0, 0];
    scale = [0, 0];
    tex = [0, 0, 0, 0];
    pos = [0, 0, 0];
    roundCorner = 0.0;
    border = 0.0;
    feather = 0.0;
    time = 0.0;
    sdfParams = [0, 0]
    defDim = [0, 0]
    defScale = [0, 0]
    defPos = [0, 0, 0];

    constructor(col, dim, scale, tex, pos, style, time, sdfParams) {

        math.CopyArr4(this.col, col);
        math.CopyArr2(this.dim, dim);
        math.CopyArr2(this.scale, scale);

        if (tex) { // Case of none textured geometry
            math.CopyArr4(this.tex, tex);
        }
        else tex = null;

        math.CopyArr3(this.pos, pos);

        if (style) {
            this.roundCorner = style.roundCorner;
            this.border = style.border;
            this.feather = style.feather;
        }
        
        this.time = time;
        if(sdfParams) math.CopyArr2(this.sdfParams, sdfParams);

        // Keep a copy of the starting dimention and position
        math.CopyArr2(this.defDim, dim);
        math.CopyArr2(this.defScale, scale);
        math.CopyArr3(this.defPos, pos);
    }
}


