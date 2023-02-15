"use strict";
import * as math from "../../Helpers/Math/MathOperations.js"

/**
 * A structure to reflect a mesh's data to be inserted in the vertex buffer
 */
export class Mesh{

    constructor(col, dim, scale, tex, pos, style, time){

        math.SetArr4(this.col, col);
        math.SetArr2(this.dim, dim);
        math.SetArr2(this.scale, scale);

        if(tex){ // Case of none textured geometry
            math.SetArr4(this.tex, tex);
        } 
        else tex = null;
        
        math.SetArr3(this.pos, pos);

        if(style){
            this.roundCorner  = style.roundCorner;
            this.border  = style.border;
            this.feather = style.feather;
        }

        this.time = time;
        
        // Keep a copy of the starting dimention an position
        math.SetArr2(this.defDim, dim);
        math.SetArr3(this.defPos, pos);
    }

    col     = [0,0,0,0];
    dim     = [0,0];
    scale   = [0,0];
    tex     = [0,0,0,0];
    pos     = [0,0,0];
    roundCorner  = 0.0;
    border  = 0.0;
    feather = 0.0;
    time    = 0.0;
    defDim  = [0,0]
    defPos  = [0,0,0];
}


