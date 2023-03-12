"use strict";
import { Max } from "./Math/MathOperations.js";



export function DarkenColor(color, darkenAmt) {

    if (darkenAmt === 0)
        return color;

    const colorMax = Max(color[0], Max(color[1], color[2]));
    let maxColorIdx = 0;
    if (color[1] > color[0] && color[1] > color[2])
        maxColorIdx = 1;
    else if (color[2] > color[0] && color[2] > color[1])
        maxColorIdx = 2;

    // const ratio1 = color[maxColorIdx] - color[maxColorIdx - 1];
    // const ratio2 = color[maxColorIdx] - color[maxColorIdx - 2];
    let darkerColor = [0, 0, 0, color[3]];
    for (let i = 0; i < color.length - 1; i++) {

        if (i !== maxColorIdx) {

            const ratio = color[maxColorIdx] / color[i];
            darkerColor[i] = color[i] - (darkenAmt / ratio);
        }
        else {
            darkerColor[maxColorIdx] = color[maxColorIdx] - darkenAmt;
        }

    }
    return darkerColor;
}

export function DimColor(col, dimAmt){
    return [col[0]*dimAmt, col[1]*dimAmt, col[2]*dimAmt, col[3]];
}

export function GetRandomColor(){
    return COLOR_ARRAY[GetRandomInt(0, COLOR_ARRAY.length)];
}

export function GetRandomPos(minPos, maxPos){
    const posx = GetRandomInt(minPos[0], maxPos[0]);
    const posy = GetRandomInt(minPos[1], maxPos[1]);
    return [posx, posy];
}

export function GetRandomInt(min, max) {
    return Math.floor((Math.random() * (max-min)) + min);
}

const SDF_PARAMS_VALS = {
    dimMin: 16,      // x1
    dimMax: 90,     // x2
    outerMin: 0.1,  // y1
    outerMax: 0.5,  // y2
}
export function CalculateSdfParamsFromFont(fontSize){
    let sdfVal = [0, 0];
    // Linear Interpolation
    sdfVal[0] = 0.5
    // sdfVal[0] = 
    //             (SDF_PARAMS_VALS.innerMin + (fontSize-SDF_PARAMS_VALS.fontSizeMin)
    //             // *((SDF_PARAMS_VALS.innerMax-SDF_PARAMS_VALS.innerMin)
    //             *((SDF_PARAMS_VALS.innerMax-SDF_PARAMS_VALS.innerMin)
    //             /(SDF_PARAMS_VALS.fontSizeMax-SDF_PARAMS_VALS.fontSizeMin)))/SDF_PARAMS_VALS.innerMax;
    //             // /(SDF_PARAMS_VALS.fontSizeMin-SDF_PARAMS_VALS.fontSizeMax));
    // sdfVal[1] = 0.3 
    sdfVal[1] = 1-
                (SDF_PARAMS_VALS.outerMin + (fontSize-SDF_PARAMS_VALS.fontSizeMin)
                *((SDF_PARAMS_VALS.outerMax-SDF_PARAMS_VALS.outerMin)
                /(SDF_PARAMS_VALS.fontSizeMax-SDF_PARAMS_VALS.fontSizeMin)))/SDF_PARAMS_VALS.outerMax;
    return sdfVal;
}
// export function CalculateSdfParamsFromDim(dim){
//     let sdfVal = [0, 0];
//     const size = dim/2.5;
//     // Linear Interpolation
//     sdfVal[0] = 
//                 (SDF_PARAMS_VALS.innerMin + (dim-SDF_PARAMS_VALS.dimMin)
//                 *((SDF_PARAMS_VALS.innerMax-SDF_PARAMS_VALS.innerMin)
//                 /(SDF_PARAMS_VALS.dimMax-SDF_PARAMS_VALS.dimMin)))/SDF_PARAMS_VALS.innerMax;
//     sdfVal[1] = 1-
//                 (SDF_PARAMS_VALS.outerMin + (dim-SDF_PARAMS_VALS.dimMin)
//                 *((SDF_PARAMS_VALS.outerMax-SDF_PARAMS_VALS.outerMin)
//                 /(SDF_PARAMS_VALS.dimMax-SDF_PARAMS_VALS.dimMin)))/SDF_PARAMS_VALS.outerMax;
//     return sdfVal;
// }
export function CalculateSdfOuterFromDim(dim){
    // const sdfOuter = 
    //                 (1-
    //                 (SDF_PARAMS_VALS.outerMin + (dim-SDF_PARAMS_VALS.dimMin)
    //                 *((SDF_PARAMS_VALS.outerMax-SDF_PARAMS_VALS.outerMin)
    //                 /(SDF_PARAMS_VALS.dimMax-SDF_PARAMS_VALS.dimMin))));
    //                 // /(SDF_PARAMS_VALS.dimMax-SDF_PARAMS_VALS.dimMin)))/SDF_PARAMS_VALS.outerMax);
    
    // const sdfOuter = ((SDF_PARAMS_VALS.outerMax/SDF_PARAMS_VALS.dimMax))*(SDF_PARAMS_VALS.dimMax-dim)
    const sdfOuter = (( 
                        (SDF_PARAMS_VALS.outerMax-SDF_PARAMS_VALS.outerMin)
                        /(SDF_PARAMS_VALS.dimMax-SDF_PARAMS_VALS.dimMin)))
                        *(SDF_PARAMS_VALS.dimMax-dim)
                        // *(SDF_PARAMS_VALS.outerMin + ((SDF_PARAMS_VALS.dimMax-dim)))
                        // *(SDF_PARAMS_VALS.dimMax-dim)*(SDF_PARAMS_VALS.outerMin + (dim-SDF_PARAMS_VALS.dimMin))
    // console.log(sdfOuter, dim)
    return sdfOuter;
}

// Returns the sign (-1,+1) out of any number
export function GetSign(val){
    return (2 * (val >> 31) + 1);
}

