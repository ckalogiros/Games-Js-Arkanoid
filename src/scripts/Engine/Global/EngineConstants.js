"use strict";


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Loaders's Constants */
const CHAR_ARRAY_START_OFFSET = ' '.charCodeAt(0);
/* Loaders's Constants
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Timer's Constants */
const TIMER_FPS_TIME = 1000;
/* Timer's Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Mesh's Constants */
const SCALE_DEFAULT = [1, 1];
/* Mesh's Constants 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Events Constants */
const EVENTS = {
	NONE: 0,
	MOUSE: 1,
}
/* Events Constants
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Style Constants */
const TRANSPARENT	= [ 0.0, 0.0, 0.0, 0.0 ];
const WHITE			= [ 1.0, 1.0, 1.0, 1.0 ];
const BLACK			= [ 0.0, 0.0, 0.0, 1.0 ];
const GREY1   	    = [ 0.1, 0.1, 0.1, 1.0 ];
const GREY2   	    = [ 0.2, 0.2, 0.2, 1.0 ];
const GREY3   	    = [ 0.3, 0.3, 0.3, 1.0 ];
const GREY4   	    = [ 0.4, 0.4, 0.4, 1.0 ];
const GREY5   	    = [ 0.5, 0.5, 0.5, 1.0 ];
const GREY6   	    = [ 0.6, 0.6, 0.6, 1.0 ];
const GREY7   	    = [ 0.7, 0.7, 0.7, 1.0 ];
const GREEN 		= [ 0.0, 1.0, 0.0, 1.0 ];
const GREENL1 		= [ 0.07, 0.9, 0.0, 1.0 ];
const GREENL2 		= [ 0.1, 0.8, 0.0, 1.0 ];
const GREENL3 		= [ 0.1, 0.6, 0.0, 1.0 ];
const GREENL4 		= [ 0.08, 0.2, 0.0, 1.0 ];
const BLUE 			= [ 0.0, 0.0, 1.0, 1.0 ];
const BLUER1 		= [ 0.0, 0.2, 88.0, 1.0 ];
const BLUER2 		= [ 0.0, 0.2, 75.0, 1.0 ];
const BLUER3 		= [ 0.0, 0.2, 6.0, 1.0 ];
const RED			= [ 1.0, 0.0, 0.0, 1.0 ];
const YELOW			= [ 1.0, 1.0, 0.0, 1.0 ];
const MAGENTA_BLUE	= [ 0.5, 0.0, 1.0, 1.0 ];
const MAGENTA_RED	= [ 1.0, 0.0, 0.6, 1.0 ];
const ORANGE		= [ 1.0, 0.5, 0.0, 1.0 ];
const LIGHT_BLUE	= [ 0.0, 1.0, 1.0, 1.0 ];
const MAGENTA_BLUE_DARK1 = [ 0.3, 0.0, 0.7, 1.0 ];
const MAGENTA_BLUE_DARK2 = [ 0.2, 0.1, 0.52, 1.0 ];
const MAGENTA_BLUE_DARK3 = [ 0.1, 0.1, 0.26, 1.0 ];

const citf = 1/255;
function InterpolateRgb(red, green, blue){
    return [
        citf * red,
		citf * green,
		citf * blue,
		1.0,
	];
}

const GREEN_33_208_40	= InterpolateRgb(33, 208, 40);
const BLUE_12_158_216	= InterpolateRgb(12, 158, 216);
const BLUE_13_125_217	= InterpolateRgb(13, 125, 217);
const YELLOW_229_206_0  = InterpolateRgb(229, 206, 0);
const ORANGE_230_148_0  = InterpolateRgb(230, 148, 0);
const GREEN_138_218_0   = InterpolateRgb(138, 218, 0);


const COLOR_ARRAY = new Array(	
    GREEN, BLUE, RED, YELOW, MAGENTA_BLUE, MAGENTA_RED, ORANGE, LIGHT_BLUE,
    GREEN_33_208_40, BLUE_12_158_216, BLUE_13_125_217, YELLOW_229_206_0, ORANGE_230_148_0, 
    );
/* Style Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/



