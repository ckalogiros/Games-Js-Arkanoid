"use strict";

import { BrickCreateBrick, BrickCreateParticleSystem, BrickGetBricksBuffer } from "./Drawables/Brick.js";

/**
 * Bricks:
 *      sand: 
 *          1 hits to destroy
 *          color :
 *      wood:  
 *          2 hits to destroy
 *          color :
 *      stone: 
 *          3 hits to destroy
 *          color :
 *      metal: 
 *          4 hits to destroy
 *          color :
 *      diamont: 
 *          ? hits to destroy
 *          color :
 *      Unbreakable: 
 *          infinity hits to destroy
 *          color :
 */

// Stage 1 mockup
/** 10 x 10 grid
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*  *  *  *  *  *  *  *  *  *
*/

let stage = 0;
export function  StageGetNextStage(){
    switch(stage){
        case 0: {
            stage++;
            return StageCreateStage1();
            
        }
        case 1: {
            stage++;
            return StageCreateStage2();
        }
        case 2: {
            stage++;
            return StageCreateStage3();
        }
    }
}


// TODO: Implemetn an Init with the Init of the particlesSystem
export function StageCreateStage1() {

   const pad = BRICK.PAD;
   const padStart = 100;
   const dim = [BRICK.WIDTH, BRICK.HEIGHT];
   let pos = [padStart + dim[0] + pad, 220 + dim[1] + 100, -1];

   for (let i = 0; i < 20; i++) {
       BrickCreateBrick(pos, dim); 
       pos[0] += dim[0] * 2 + pad;
       if (pos[0] + dim[0] * 2 + 50 > Viewport.right) {
           pos[1] += dim[1] * 2 + pad;
           pos[0] = dim[0] + pad + padStart;
       }
   }
}

export function StageCreateStage2() {

   const pad = BRICK.PAD;
   const padStart = 100;
   const dim = [BRICK.WIDTH, BRICK.HEIGHT];
   let pos = [padStart + dim[0] + pad, 120 + dim[1] + 100, -1];

   for (let i = 0; i < 10; i++) {
       BrickCreateBrick(pos, dim);
       pos[0] += dim[0] * 2 + pad;
       if (pos[0] + dim[0] * 2 + 50 > Viewport.right) {
           pos[1] += dim[1] * 2 + pad;
           pos[0] = dim[0] + pad + padStart;
       }
   }
}
export function StageCreateStage3() {

   const pad = BRICK.PAD;
   const padStart = 100;
   const dim = [BRICK.WIDTH, BRICK.HEIGHT];
   let pos = [padStart + dim[0] + pad, 120 + dim[1] + 100, -1];

   for (let i = 0; i < 20; i++) {
       BrickCreateBrick(pos, dim);
       pos[0] += dim[0] * 2 + pad;
       if (pos[0] + dim[0] * 2 + 50 > Viewport.right) {
           pos[1] += dim[1] * 2 + pad;
           pos[0] = dim[0] + pad + padStart;
       }
   }
}