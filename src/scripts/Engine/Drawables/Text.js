"use strict";
import * as math from '../../Helpers/Math/MathOperations.js'
import { FontGetUvCoords, FontGetFontDimRatio } from '../Loaders/Font/LoadFont.js'
import { Mesh } from './Mesh.js'



export class Text {
	sid = 0;
	len = 0; // Number of characters in the text
	name = ''; // The actual text. TODO: rename to something more apropriate
	dim = [0, 0]; // The width and height of the whole text
	pos = [0, 0, 0]; // The position of the whole text
	display = true;
	gfxInfo = null; // 

	faceWidth = 0; // Only for monospace fonts
	faceHeight = 0;
	textWidth = 0;

	letters = [];


	constructor(sid, col, pos, dim, style, txt, fontSize, align){
		this.sid 	 = sid;
		this.len 	 = txt.length;
		this.name 	 = txt;
		math.CopyArr3(this.pos, pos);
		this.faceWidth = fontSize;
		this.faceHeight = fontSize * FontGetFontDimRatio();;
		this.textWidth = CalcTextWidth(txt, fontSize);
		this.dim[1] = this.faceHeight; // The x dimention of the whole text is going to be calculated for each char in txt

		this.Align(align);
		this.CreateLetters(col, pos, txt, style)
	}

	Align(align){
		
		if (align & ALIGN.LEFT) { // TODO: Unecessary. left is 0.
			this.pos[0] += Viewport.left;
		}
		else if (align & ALIGN.RIGHT) {
			this.pos[0] += Viewport.right - ((this.textWidth * 2) + this.faceWidth);
		}
		else if (align & ALIGN.CENTER_HOR) { // Center
			this.pos[0] += Viewport.width / 2;
			this.pos[0] -= this.textWidth - this.faceWidth;
		}
		if (align & ALIGN.TOP) {
			this.pos[1] += Viewport.top + (this.faceHeight);
		}
		else if (align & ALIGN.BOTTOM) {
			this.pos[1] += Viewport.top - (this.faceHeight);
		}
		else if (align & ALIGN.CENTER_VERT) { // Center
			this.pos[1] += (Viewport.height / 2) - this.faceWidth;
		}
	}
	CreateLetters(col, pos, txt, style){
		// Use a dummy pos[0](x coord) to calculate the distance to the next character of the text
		let posi = [0, 0, 0];
		math.CopyArr3(posi, this.pos)
	
		for (let i = 0; i < this.len; i++) {
			this.letters[i] = new Mesh(col, [this.faceWidth, this.faceHeight], SCALE_DEFAULT, 
												FontGetUvCoords(txt[i]), posi, style, null);
			posi[0] += this.faceWidth * 2;
			this.dim[0] += this.faceWidth;
		}
	}
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
export function CreateText(txt, col, dim, pos, style, fontSize, useSdfFont, align) {

	const text = new Text(SID_DEFAULT_TEXTURE_SDF, col, pos, dim, style, txt, fontSize, align);
	return text;
}

export function CalcTextWidth(text, fontSize) {
	return text.length * fontSize;
}


