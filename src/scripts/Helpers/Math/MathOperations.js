"use strict";


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Multiply Array */
export function MulArr4Val(arr, val){
    arr[0] *= val;
    arr[1] *= val;
    arr[2] *= val;
    arr[3] *= val;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Set Array */
export function SetArr4(src, dst){
    src[0] = dst[0];
    src[1] = dst[1];
    src[2] = dst[2];
    src[3] = dst[3];
}
export function SetArr3(src, dst){
    src[0] = dst[0];
    src[1] = dst[1];
    src[2] = dst[2];
}
export function SetArr2(src, dst){
    src[0] = dst[0];
    src[1] = dst[1];
}
export function SetArr1(src, dst){
    src[0] = dst[0];
}
export function SetArrElem(src, dst, idx){
    src[idx] = dst[idx];
}

export function Abs(a){
    return a > 0 ? a : -a;
}
export function Max(val1, val2) {
    return val1 > val2 ? val1 : val2;
}
export function Min(val1, val2) {
    return val1 < val2 ? val1 : val2;
}

export function InterpolateToRange(value, resolution, maxVal) {

    const res = maxVal / resolution;
    // console.log('res:', res);
    const interpolatedVal = value * res;
    return interpolatedVal;
}

export function InterpolateToRange01Inverted(value) {
    return 1/value;
}
export function InterpolateToRange01(value, max) {
    return (1.0/max) * value;
}


export function Hash11(seed){
    let x = Math.sin(seed*19287.8873)*28715.715; 
    return (x-Math.floor(x));
}