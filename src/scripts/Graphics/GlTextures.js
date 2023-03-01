"use strict";


export class GlTexture {

    name            = '';
    tex             = null;
    texId           = -1;
    idx             = -1;
    width           = 0;
    height          = 0;
    level           = -1;
    internalFormat  = -1;
    srcFormat       = -1;   
    srcType         = -1;
    img             = null;
    imgSrc          = '';

};


export let glTextures = {

    texture: [],
    count: 0,
};



export function GlGetTexture(idx){
    return glTextures.texture[idx];
}


export function GlCreateTexture(name, gl, url) {

    const texture = new GlTexture;

    texture.idx = glTextures.count++;
    glTextures.texture[texture.idx] = texture;
    StoreGlobalTextureIndex(name, texture.idx);

    texture.name            = name;
    texture.texId           = gl.TEXTURE0 + texture.idx; // Advance the texture ID to the next. TODO: Should check for GL_MAX_ALLOWED_TEXTURE_UNITS.
    texture.level           = 0;
	texture.internalFormat  = gl.RGB;
	texture.srcFormat       = gl.RGB;
	texture.srcType         = gl.UNSIGNED_BYTE;

    gl.activeTexture(texture.texId);
    texture.tex = gl.createTexture();
    if(!texture.tex)
        alert('Could not create Texture');

    texture.img     = new Image();
    texture.imgSrc  = url;
    texture.img.src = url;
    LoadTexture(gl, texture);


    return texture;
}

export function LoadTexture(gl, texture) {
    

    if(texture.imgSrc){

        texture.img.onload = function () {
            
            gl.bindTexture(gl.TEXTURE_2D, texture.tex);
            Texture.boundTexture = texture.idx;
            gl.texImage2D(gl.TEXTURE_2D, texture.level, texture.internalFormat, 
                texture.srcFormat, texture.srcType, texture.img);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    
            texture.width = texture.img.width;
            texture.height = texture.img.height;
        };

    }
    else{

        const data = null; // No data yet. (For FrameBuffers).
        const border = 0;
        // TODO: Temp. Let texture width and height be stored in the texture object(Also see the frambuffer)
        texture.width  = Viewport.width;
        texture.height = Viewport.height;

        gl.bindTexture(gl.TEXTURE_2D, texture.tex);
        Texture.boundTexture = texture.idx;

        // gl.texImage2D(gl.TEXTURE_2D, texture.level, texture.internalFormat,
        //     texture.width, texture.height, border, texture.srcFormat, texture.srcType, data);
        gl.texImage2D(gl.TEXTURE_2D, texture.level,  gl.RGBA,
            texture.width, texture.height, border, gl.RGBA, gl.UNSIGNED_BYTE, data);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        {
            // const container = document.querySelector('#image');
            // const img = document.createElement('img')
            // img.src = texture.imgSrc;
            // img.style.height = '45px';
            // container.append(img);
        }
    }
    { // Debug - Show font texture image
        // texture.img.onload = function () { // Debug - Show font texture image
        //     const container = document.querySelector('#image');
        //     const img = document.createElement('img')
        //     img.src = texture.imgSrc;
        //     img.style.height = '45px';
        //     container.append(img);
        // };
    }
}


export function StoreGlobalTextureIndex(name, idx){

    if(name === 'FontConsolasSdf35'){
        // Store the index of the current free element in the array of textures, 
        // to the global variable textures key-value pairs 
        Texture.fontConsolasSdf35 = idx;
    }
    else if(name === 'FrameBufferTexture0'){
        // Store the index of the current free element in the array of textures, 
        // to the global variable textures key-value pairs 
        Texture.frameBufferTexture0 = idx;
    }
    else{
        alert('No texture name Exists for the global Texture key-value pair object');
    }
}
















////////////////////////////////////////////////////////////////////////////////////////////////
// export function LoadTexture(gl, url) {
    
// 	gl.activeTexture(gl.TEXTURE0);
//     const texture = gl.createTexture();
// 	gl.bindTexture(gl.TEXTURE_2D, texture);
	
// 	const level = 0;
// 	const internalFormat = gl.RGBA;
// 	const srcFormat = gl.RGBA;
// 	const srcType = gl.UNSIGNED_BYTE;

// 	{ // Debug - Show font texture image
// 		// const container = document.querySelector('#image');
// 		// const img = document.createElement('img')
// 		// img.src = url;
// 		// img.style.height = '45px';
// 		// container.append(img);
// 	}
	
// 	const image = new Image();
	
// 	image.onload = function () {
		
// 		gl.bindTexture(gl.TEXTURE_2D, texture);
// 		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image);
		
// 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
// 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
// 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
// 		console.log( 'width :', image.width, ' height :', image.height)

// 	};

// 	image.src = url;
// 	return texture;
// }

