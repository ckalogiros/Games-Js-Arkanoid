"use strict";
import { FontGetUvCoords, FontGetFontDimRatio } from '../Loaders/Font/LoadFont.js'
import { Mesh } from './Mesh.js'



export class Text {
	len		= 0;
	name	= '';
	dim 	= [0, 0]; // Dimentions x,y as an array[2]
	// width 	= 0; 	  // width of the whole text(in pixels)
	pos 	= [0, 0, 0];
	defScale= [1, 1];
	display	= true;

    faceWidth = 0;
    faceHeight = 0;

    letters	= [];

	sid = 0;
	gfxInfo	= null;
}

/**
 * 
 * @param {*} txt : The string
 * @param {*} col : Float Array[4] 
 * @param {*} scale : Float Array[2]
 * @param {*} pos : Float Array[2]. The Position of the text
 * @param {*} display : True/False. Flag for if the text is displayable.
 * @param {*} Align : Left/Right/Top/Bottom in relation with the game window.
 * @returns : class Text
 */
export function CreateText(txt, col, dim, _pos, style, fontSize, useSdfFont, Align) {

	const text = new Text;

	text.len 	 = txt.length;
	text.name 	 = txt;
	text.display = true;
	text.sid 	 = SID_DEFAULT_TEXTURE_SDF;

	
	// Do a deep copy of param position (to avoid copy by ref (shallow copy))
	let pos = []
	pos[0] = _pos[0];
	pos[1] = _pos[1];
	pos[2] = _pos[2];

	
	const faceWidth  = fontSize;  
	const faceHeight = fontSize * FontGetFontDimRatio(); 
	const textWidth  = CalcTextWidth(txt, fontSize);

	let alignx = 0; // For calculating text's align in x axis
	let aligny = 0; 

	if(Align & ALIGN.LEFT){ // TODO: Unecessary. left is 0.
		alignx = Viewport.left;
		pos[0] += alignx;	
	}
	else if(Align & ALIGN.RIGHT){
		alignx = Viewport.right;
		pos[0] += alignx-((textWidth*2)+faceWidth);	
	}
	else if(Align & ALIGN.CENTER_HOR){ // Center
		pos[0] += Viewport.width/2;	
        pos[0] -= textWidth-faceWidth;
	}
	if(Align & ALIGN.TOP){
		aligny  = Viewport.top;
		pos[1] += aligny+(faceHeight);	
	}
	else if(Align & ALIGN.BOTTOM){
		aligny = Viewport.bottom;
		pos[1] += aligny-(faceHeight);	
	}
	
	text.dim[1] = faceHeight;
    text.pos[0] = pos[0]; 
	text.pos[1] = pos[1];
	text.pos[2] = pos[2];
    text.faceWidth  = faceWidth;
    text.faceHeight = faceHeight;


    // pos[0] -= textWidth-faceWidth;
	// Create face mesh for each letter of the txt
	for(let i=0; i<text.len; i++){
		
		text.letters[i] = new Mesh(col, [faceWidth, faceHeight], SCALE_DEFAULT, FontGetUvCoords(txt[i]), pos, style, null);
		pos[0] += faceWidth*2;
		text.dim[0] += faceWidth;
	}

	text.defWpos  = text.pos; // Keep a copy of the starting position
	text.defScale = SCALE_DEFAULT; // Keep a copy of the starting scale

	return text;

}

export function CalcTextWidth(text, fontSize){

    let textWidth = 0;
    for(let i = 0; i < text.length; i++)
        textWidth += fontSize;

    return textWidth;
}
