"use strict";
import { COMIC_FONT_METRICS } from './Metrics.js'



// export const COMIC_FONT_TEXTURE_PATH = '../../../../resources/fonts/comic_bold_sdf35/comic_bold_sdf35.bmp'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../resources/fonts/consolas_sdf80/consolas_sdf80.bmp'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../resources/fonts/consolas_sdf35/consolas_sdf35.bmp'
// const COMIC_FONT_METRICS_PATH = '../../../../resources/fonts/comicBold_sdf35/metrics/comicBold_sdf35.txt'

// export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/consolas_sdf35.bmp'
export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/consolas_sdf35.bmp'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/consolas_sdf35_blurred.bmp'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/consolas_sdf35_blurred.png'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/paint.bmp'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/consolas_sdf35_photoshop.bmp'
// export const COMIC_FONT_TEXTURE_PATH = '../../../../consolas_sdf35/consolas_sdf35_photoshop.png'
const COMIC_FONT_METRICS_PATH = '../../../../consolas_sdf35/metrics/consolas_sdf35.txt'

const COMIC_BOLD_SDF_110 = 0; // Static Indexes forthe array of fonts
// The maximum number of characters for ASCII
const ASCII_NUM_CHARACTERS = '~'.charCodeAt(0) - (' '.charCodeAt(0))




// * * * * * * * * * * * * * * * * * *
// Interfaces
let I_FontMetrics = {

	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	advancex: 0,
	width: 0,
	height: 0,
	bearingtop: 0,
	bearingleft: 0,
	ratio: 0, // Ratio width to height, for each character's. Used for non monospace fonts
}
let I_FontTexture = {

	ch: [],
	size: 0,
	texWidth: 0,
	texHeight: 0,
	advancex: 0, // Start (in pixels) of curr character unti the start of next character(in the texture)
	padding: 0,
	isMonoSpace: 0, // In non monospace fonts, the advancex variable is different from char to char (compare to monospace fonts)
	ratio: 0,
}


let I_UVs = [0.0, 0.0, 0.0, 0.0];
let I_Pos = { start: 0, end: 0, len: 0, line: 0 };
let I_File = { content: '', name: '', pos: I_Pos, size: 0, }


let s_fontTextures = [I_FontTexture];
const fontsUvMap = [[I_UVs]];
const s_fontsMetrics = I_FontTexture;



export function LoadFontTextures() {
	s_fontTextures[COMIC_BOLD_SDF_110] = FontLoadTexture();
	s_fontTextures.len++;
}


function GetUvCoord(ch, index) {
	return s_fontTextures[index].ch[ch]
}

/*
	 Finds text between delimiters, in a string buffer.
*/
function FindValue(file, delim) {
	/**
	 * pos reference's indexes in the string buffer.
	 * 		pos.start:   the start index of the searched text in the string buffer
	 * 		pos.end:     the end index of the searched text in the string buffer
	 * 		pos.len:     the length of the searched text in the string buffer
	 * 		pos.line:    the line of the searched text in the string buffer
	 */
	let pos = file.pos;

	// Cash values
	const data = file.content;
	let i = file.pos.start;

	// Find first delim
	while (data[i++] != delim[0]) {
		if (data[i] == '\n')
			file.pos.line++;
		if (i >= file.size) {
			console.log("Delimiter does not exist. Returning");
			return -1;
		}
	}
	pos.start = i;

	// Store to "charval" whatever lies in between the two delimiter characters
	let charval = '';
	let k = 0;
	while (data[i] != delim[1]) {
		charval += data[i];
		pos.len++;
		i++; k++;
		if (i >= file.size) {
			console.log("No value found. Reached the end of file.");
		}
	}
	pos.end = i - 1;

	// Store the "charval's" position (in the string buffer) to file.pos object
	file.pos.start = pos.start;
	file.pos.end = pos.end;
	file.pos.len = pos.len;

	// Convert String to Number
	let val = 0;
	for (i = 0; i < k; i++)
		val = val * 10 + (charval[i] - '0');

	return val;
}

function FindWord(file, word, pos) {
	let wordpos = { start: -1, end: -1, len: 0, line: -1 };
	let wordlen = word.length;

	let line = pos.line;
	let i = pos.start;

	let filelen = file.length;
	while (i <= filelen) {
		let k = 0;
		let found = false;

		if (file[i] == '\n')
			line++;

		if (file[i] == word[k]) {
			wordpos.start = i;
			wordpos.len = 0;
			i++; k++;
			while (file[i] == word[k]) {
				wordpos.len++;
				if (k >= wordlen - 1) {
					wordpos.line = line;
					wordpos.len++;
					found = true;
					wordpos.end = i + 1;
					return wordpos;
				}
				i++; k++;
			}
		}
		i++;
	}
	return wordpos;
}

function FontLoadTexture() {

	const file = I_File;
	file.content = COMIC_FONT_METRICS;
	file.size = file.content.length;

	// Get how many characters the font texture has 
	// by retrieving the line: "NumCharacters		:	[94]"
	file.pos = FindWord(file.content, "NumCharacters", file.pos);

	let size = 0;
	// Check if found
	if (file.pos.len)
		size = FindValue(file, "[]");
	size++; // +1 for the ' ' space char

	// Create character map
	for (let i = 0; i < ASCII_NUM_CHARACTERS; i++) {
		s_fontsMetrics.ch[i] = I_FontMetrics;
	}
	s_fontsMetrics.size = size;


	file.pos = FindWord(file.content, "Image Width", file.pos);
	if (file.pos.len) {
		s_fontsMetrics.texWidth = FindValue(file, "[]");
		// The next val inside [] is the height 
		s_fontsMetrics.texHeight = FindValue(file, "[]");
	}

	// In monospace {Only} the advance x is the same for every character
	s_fontsMetrics.advancex = FindValue(file, "[]");
	// Space between the characters in the texture font
	s_fontsMetrics.padding = FindValue(file, "[]");

	file.pos = FindWord(file.content, "Mono Space", file.pos);
	s_fontsMetrics.isMonoSpace = FindValue(file, "[]");
	s_fontsMetrics.ratio = s_fontsMetrics.texHeight / s_fontsMetrics.advancex;



	s_fontsMetrics.ch[0] = {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		advancex: 0,
		width: 0,
		height: 0,
		bearingtop: 0,
		bearingleft: 0,
	}
	// For char space character ' '
	s_fontsMetrics.ch[0].left = 0;
	s_fontsMetrics.ch[0].right = 0;
	s_fontsMetrics.ch[0].top = 0;
	s_fontsMetrics.ch[0].bottom = 0;
	s_fontsMetrics.ch[0].width = 0;
	s_fontsMetrics.ch[0].height = 0;
	if (!s_fontsMetrics.isMonoSpace) {
		s_fontsMetrics.ch[0].advancex = s_fontsMetrics.advancex; // TODO: Is there a global advancex in metrics file???
		s_fontsMetrics.ch[0].ratio = s_fontsMetrics.texHeight / s_fontsMetrics.ch[0].advancex; // width to height ratio(and not the other way arround)
	}

	// Reset the file's pos
	file.pos.start = 0;


	// Load all property values to character map for each character
	for (let i = 1; i < size; i++) {
		s_fontsMetrics.ch[i] = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			advancex: 0,
			width: 0,
			height: 0,
			bearingtop: 0,
			bearingleft: 0,
		};
		file.pos = FindWord(file.content, "Face Left", file.pos);
		if (file.pos.len)
			s_fontsMetrics.ch[i].left = FindValue(file, "[]");

		// Because the file.pos retains the start position
		// we just call FindValue() to  get the next val
		s_fontsMetrics.ch[i].right = FindValue(file, "[]");
		s_fontsMetrics.ch[i].top = FindValue(file, "[]");
		s_fontsMetrics.ch[i].bottom = FindValue(file, "[]");
		s_fontsMetrics.ch[i].width = FindValue(file, "[]");
		s_fontsMetrics.ch[i].height = FindValue(file, "[]");
		s_fontsMetrics.ch[i].bearingleft = FindValue(file, "[]");
		s_fontsMetrics.ch[i].bearingtop = FindValue(file, "[]");
		if (!s_fontsMetrics.isMonoSpace) {
			s_fontsMetrics.ch[i].advancex = FindValue(file, "[]");
			s_fontsMetrics.ch[i].ratio = s_fontsMetrics.ch[i].height / s_fontsMetrics.ch[i].width; // width to height ratio(and not the other way arround)
		}
	}

	// console.log('s_fontsMetrics', s_fontsMetrics)
	return s_fontsMetrics;
}

export function FontCreateUvMap() {

	for (let i = 0; i < s_fontTextures.length; i++) {

		let uv = I_FontMetrics;
		let fontTex = I_FontTexture;
		// let uvmap = [I_UVs];


		let transormedU = 1.0 / fontTex.texWidth;	// Transform to 0-1 coords
		if (fontTex.advancex % 2) {
			fontTex.advancex++;
			transormedU = 1.0 / (fontTex.texWidth);	// Deal with odd width. 
		}


		let transormedV = 1.0 / fontTex.texHeight;	// Transform to 0-1 coords
		if (fontTex.texHeight % 2) {
			fontTex.texHeight++;
			transormedV = 1.0 / (fontTex.texHeight);	// Deal with odd width. 
		}

		const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
		for (let j = 0; j < fontTex.size; j++) {
			uv = GetUvCoord(j, i); // Get a characters uv coordinates...

			// and store them to the uvmap
			fontsUvMap[i][j] = [0.0, 0.0, 0.0, 0.0]; //  Create new array for each font for each character
			fontsUvMap[i][j][U1] = transormedU * uv.left;
			fontsUvMap[i][j][U2] = transormedU * uv.right;

			let scalex = (fontTex.advancex - uv.width) / 2;
			fontsUvMap[i][j][U1] -= transormedU * scalex;
			fontsUvMap[i][j][U2] += transormedU * scalex;

			fontsUvMap[i][j][V1] = 0;
			fontsUvMap[i][j][V2] = 1;

			if (fontTex.texHeight % 2)
				fontsUvMap[i][j][V1] += transormedV;
		}
	}
}

/**
 * 
 * @param {*} ch : The ASCII character.
 * @returns : An array of [4] elements
 */
export function FontGetUvCoords(ch) {
	return fontsUvMap[COMIC_BOLD_SDF_110][ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]
}

export function FontGetCharFaceRatio(ch) {
	return s_fontTextures[COMIC_BOLD_SDF_110].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].ratio;
}

export function FontGetFontDimRatio() {
	return s_fontsMetrics.ratio;
}

export function FontGetCharWidth(ch) {
	return s_fontTextures[COMIC_BOLD_SDF_110].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width;
}

export function FontGetCharHeight(ch) {
	return s_fontTextures[COMIC_BOLD_SDF_110].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].height;
}

export function FontGetTexWidth() {
	return s_fontTextures[COMIC_BOLD_SDF_110].advancex;
}

export function FontGetTexHeight() {
	return s_fontTextures[COMIC_BOLD_SDF_110].texHeight;
}

