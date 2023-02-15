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
