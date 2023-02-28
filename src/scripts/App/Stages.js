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




// TODO: Implemetn an Init with the Init of the particlesSystem
export function StageCreateStage1() {


   const pad = 10;
   const padStart = 100;
   const dim = [28, 16];
   let pos = [padStart + dim[0] + pad, 120 + dim[1] + 100, -1];

   for (let i = 0; i < 1; i++) {
       BrickCreateBrick(pos, dim); 
       pos[0] += dim[0] * 2 + pad;
       if (pos[0] + dim[0] * 2 + 50 > Viewport.right) {
           pos[1] += dim[1] * 2 + pad;
           pos[0] = dim[0] + pad + padStart;
       }
   }

   return BrickGetBricksBuffer();
}

export function StageCreateStage2() {


   const pad = 10;
   const padStart = 100;
   const dim = [28, 16];
   let pos = [padStart + dim[0] + pad, 120 + dim[1] + 100, -1];

   for (let i = 0; i < 10; i++) {
       BrickCreateBrick(pos, dim);
       pos[0] += dim[0] * 2 + pad;
       if (pos[0] + dim[0] * 2 + 50 > Viewport.right) {
           pos[1] += dim[1] * 2 + pad;
           pos[0] = dim[0] + pad + padStart;
       }
   }

   return BrickGetBricksBuffer(); 
}