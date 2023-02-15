"use strict";
import { CreatePlayer } from './Drawables/Player.js';
import { CreateButton } from '../Engine/Drawables/Widgets/Button.js';
import { BallCreate, BallCreateTail } from './Drawables/Ball.js';
import { BrickCreateParticleSystem, CreateBrick } from './Drawables/Brick.js';
import { GlGetVB }      from '../Graphics/GlProgram.js';
import { RectCreateRect } from '../Engine/Drawables/Rect.js';
import { CalcTextWidth } from '../Engine/Drawables/Text.js';
import { DarkenColor } from '../Helpers/Helpers.js';
import { UiCreateScore, UiCreateScoreModifier, UiCreateLives } from './Drawables/Ui/Ui.js';
import { GlAddMesh, GlCreateFrameBuffer, GfxSetVbShowFromSceneId, GfxSetVbShow } from '../Graphics/GlBuffers.js';
import { BallsInit } from './Drawables/Ball.js';
import { ExplosionsInit } from '../Engine/Events/Explosions.js';

// TEMP
export let fireMesh = null;


class Scene {

    constructor(sceneId) {
        this.sceneId = sceneId;
    }

    sceneId = 0; 	// Scene ID (of type SCENE).

    buttons = []; 	// Array of all buttons of a scene
    btnCount = 0; 	// Total number of buttons.

    player = null;
    ball = null;
    bricks = null;
};

class Scenes {

    scene = [];
    count = 0;

};

const scenes = new Scenes;


export function GetScene(idx) {

    if (idx < 0 || idx > scenes.count)
        alert('Scene Index Out Of Bounds!');

    return scenes.scene[idx];
}

export function CreateScene(sceneId) {

    switch (sceneId) {

        case SCENE.startMenu: {

            const sceneIdx = scenes.count;
            scenes.count++;
            scenes.scene[sceneIdx] = new Scene(SCENE.startMenu);

            CreateStartMenuScene(sceneIdx);

            scenes.scene[sceneIdx].sceneId = sceneId;
            SCENE.active.id = sceneId;
            SCENE.active.idx = sceneIdx;
            break;
        }
        case SCENE.play: {

            const sceneIdx = scenes.count;
            scenes.count++;
            scenes.scene[sceneIdx] = new Scene(SCENE.play);

            CreatePlayScene(sceneIdx);

            scenes.scene[sceneIdx].sceneId = sceneId;
            SCENE.active.id = sceneId;
            SCENE.active.idx = sceneIdx;
            break;
        }

    }
}

export function LoadScene(sceneId) {

    // If there is a loaded scene and it's not the one we are trying to load..
    if (SCENE.active.id && sceneId !== SCENE.active.id) {

        const idx = SCENE.active.idx;
        // .. deactivate scene
        for (let j = 0; j < scenes.scene[idx].btnCount; j++) {

            scenes.scene[idx].buttons[j].area.display = false;
            scenes.scene[idx].buttons[j].text.display = false;
            GfxSetVbShowFromSceneId(SCENE.active.id, false);
        }

        if (scenes.scene[idx].player) {

            scenes.scene[idx].player.display = false;
            GfxSetVbShowFromSceneId(SCENE.active.id, false);
        }

        SCENE.active.id = SCENE.none;
        SCENE.active.idx = -1;
    }

    for (let i = 0; i < scenes.count; i++) {

        if (sceneId === scenes.scene[i].sceneId) {

            // Activate button meshes and their gfx buffers
            if (scenes.scene[i].btnCount) {

                for (let j = 0; j < scenes.scene[i].btnCount; j++) {

                    scenes.scene[i].buttons[j].area.display = true;
                    scenes.scene[i].buttons[j].text.display = true;

                    GfxSetVbShowFromSceneId(sceneId, true);

                    SCENE.active.id = sceneId;
                    SCENE.active.idx = i;
                }
            }

            if (scenes.scene[i].player) {

                scenes.scene[i].player.display = true;
                GfxSetVbShowFromSceneId(sceneId, true);
            }
        }
    }

}

function CreateStartMenuScene(sceneIdx) {

    // Create A Window background
    const mainWindow = {
        dim: [Viewport.width / 2, Viewport.height / 2],
        pos: [Viewport.width / 2, Viewport.height / 2, -1],
        style: {
            pad: 10,
            roundCorner: 6,
            border: 8,
            feather: 30,
        },
    };
    // Create A Window background
    // const mainWindowRect = RectCreateRect('mainWindowRect', SID_DEFAULT|FR_0, DarkenColor(MAGENTA_BLUE, 0.3), 
    // const mainWindowRect = RectCreateRect('mainWindowRect', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.3), 
    //                                     mainWindow.dim, [1, 1], null, mainWindow.pos, mainWindow.style);
    // mainWindowRect.gfxInfo = GlAddMesh(mainWindowRect.sid, mainWindowRect.mesh, 1, SCENE.startMenu, 
    //                                     DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


    const btnDim = [100, 20];
    let btnPos = [0, 150, 0];
    const style = {
        pad: 10,
        roundCorner: 6,
        border: 3,
        feather: 12,
    };  
    const fontSize = 20;


    let btnIdx = scenes.scene[sceneIdx].btnCount;	// Get next free element in the buttons array.
    scenes.scene[sceneIdx].btnCount++;				// Update buttons count.
    const btn1 = CreateButton(SCENE.startMenu, 'PlayBtn', 'Play',
        WHITE, DarkenColor(YELLOW_229_206_0, 0.1), btnDim, btnPos,
        style, fontSize, true, ALIGN.CENTER_HOR | ALIGN.TOP);

    scenes.scene[sceneIdx].buttons[btnIdx] = btn1	// Store the newly created button to the current scene (by refference). 
    
    
    btnIdx = scenes.scene[sceneIdx].btnCount++;
    btnPos[1] += btn1.area.mesh.dim[1] * 2 + style.pad + style.border + style.feather; // Set next button's y pos (just bellow the prev button)
    const btn2 = CreateButton(SCENE.startMenu, 'OptionsBtn', 'Options',
        WHITE, DarkenColor(MAGENTA_RED, 0.1), btnDim, btnPos,
        style, fontSize, true, ALIGN.CENTER_HOR | ALIGN.TOP);
        scenes.scene[sceneIdx].buttons[btnIdx] = btn2;
        
    btnPos[1] += btn2.area.mesh.dim[1] * 2 + style.pad + style.border + style.feather + 80; // Set next button's y pos (just bellow the prev button)

    // Connect the font texture of (for button's text) with the vertex buffer for text rendering. 
    const vb = GlGetVB(btn1.text.gfxInfo.prog.idx, btn1.text.gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; // TODO: Temporary binding of the font texture to the text rendering VB


    
    // // Create Destoy-brick shader
    // const db = RectCreateRect('Destroybrick', SID_DEFAULT | SID.EXPLOSION_FS, GREY1, [300,300], [1,1], null, [350, 450, 5], style);
    // db.gfxInfo = GlAddMesh(db.sid, db.mesh, 1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


}

function CreatePlayScene(sceneIdx) {


    const menuBar = {
        dim: [Viewport.width / 2, MENU_BAR_HEIGHT],
        pos: [Viewport.width / 2, MENU_BAR_HEIGHT, -2],
        style: {
            pad: 10,
            roundCorner: 6,
            border: 1,
            feather: 10,
        },
    };
    // Create A Window background
    const menu = RectCreateRect('Window', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.1), menuBar.dim, [1, 1], null, menuBar.pos, menuBar.style, null);
    menu.gfxInfo = GlAddMesh(menu.sid, menu.mesh, 1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


    const mainWindow = {
        dim: [Viewport.width / 2, Viewport.height / 2 - menuBar.dim[1]],
        pos: [Viewport.width / 2, Viewport.height / 2 + menuBar.dim[1], -2],
    };
    // Create A Window background
    const mainWindowRect = RectCreateRect('Window', SID_DEFAULT, DarkenColor(MAGENTA_BLUE, 0.3), mainWindow.dim, [1, 1], null, mainWindow.pos, menuBar.style, null);
    mainWindowRect.gfxInfo = GlAddMesh(mainWindowRect.sid, mainWindowRect.mesh, 
        1, SCENE.play, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);


    const style = {
        pad: 10,
        roundCorner: 6,
        border: 2,
        feather: 12,
    };
    const fontSize = 10;
    let btnPos = [
        style.pad * 2 + style.border + style.feather + 20,
        style.pad * 2 + style.border + style.feather,
        0
    ];
      
    let btnIdx = scenes.scene[sceneIdx].btnCount++;	// Get next free element in the buttons array.
    const btn1Name = 'Back';
    const btnDim = [0, 0];
    btnDim[0] = CalcTextWidth(btn1Name, fontSize, btnDim, style);
    const btn1 = CreateButton(SCENE.play, 'ReturnBtn', btn1Name, WHITE, BLUE_13_125_217, btnDim, btnPos, style, fontSize, true, ALIGN.LEFT | ALIGN.TOP);
    scenes.scene[sceneIdx].buttons[btnIdx] = btn1	// Store the newly created button to the current scene (by refference). 

    const btn2Name = 'MENU';
    btnDim[0] = CalcTextWidth(btn2Name, fontSize);
    // btnPos[0] *= -1; // Padd fro the right must be negative
    btnPos[0] = -20; // Padd fro the right must be negative
    btnIdx = scenes.scene[sceneIdx].btnCount++;	    // Get next free element in the buttons array.
    const btn2 = CreateButton(SCENE.play, 'MenuBtn', btn2Name, WHITE, BLUE_13_125_217, btnDim, btnPos, style, fontSize, true, ALIGN.RIGHT | ALIGN.TOP);
    scenes.scene[sceneIdx].buttons[btnIdx] = btn2	// Store the newly created button to the current scene (by refference). 

    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(btn1.text.gfxInfo.prog.idx, btn1.text.gfxInfo.vb.idx);
    vb.texIdx = Texture.fontConsolasSdf35; // TODO: Temporary binding of the font texture to the text rendering VB


    const bricks = TempCreateBricks(SCENE.play)

    // Use Fire Shader
    // const fire = RectCreateRect('Fire', SID_DEFAULT | SID.FIRE_FS, RED, [700, 700], [1,1], null, [350, 450, 5], style, null);
    // fire.gfxInfo = GlAddMesh(fire.sid, fire.mesh, 1, SCENE.startMenu, DONT_CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    // fireMesh = fire;

    /** Player */    
    const player = CreatePlayer(SCENE.play);
    scenes.scene[sceneIdx].player = player;

    /** Ball */    
    BallsInit(SCENE.play); // Initialize Ball's buffer
    BallCreate(SCENE.play, [Viewport.width / 2, Viewport.bottom - 82]);

    /** Initialize the explosions buffer and it's graphics */
    ExplosionsInit();

    BallCreateTail(28, 40, SCENE.play);    

    /** Ui */    
    const scoreUi = UiCreateScore(SCENE.play);
    const scoreModUi = UiCreateScoreModifier(SCENE.play);
    const livesUi = UiCreateLives(SCENE.play);
    // Create frameBuffer to render the scene(to a texture)
    // const fb = GlCreateFrameBuffer(gfxCtx.gl);
    // Temp: Create a rect for the frame buffer
    // CreateRectForFrameBuffer(fb);


}

// TODO: Move this Func to Bricks.js
function TempCreateBricks(scene) {


    const pad = 10;
    const padStart = 100;
    const dim = [28, 16];
    let pos = [padStart + dim[0] + pad, 120 + dim[1] + 100, -1];

    // Test Big Square
    // const dim = [300, 160];
    // let pos = [dim[0] + pad + 60, dim[1] + pad + 60, -1];

    for (let i = 0; i < 42; i++) {
        CreateBrick(scene, pos, dim);
        pos[0] += dim[0] * 2 + pad;
        if (pos[0] +  dim[0] * 2 + 50 > Viewport.right) {
            pos[1] += dim[1] * 2 + pad;
            pos[0] =  dim[0] + pad + padStart;
        }
    }

    BrickCreateParticleSystem(SCENE.play);

}

function CreateRectForFrameBuffer(fb) {

    const RenderBuffer = {
        dim: [200 * Viewport.ratio, 200],
        pos: [480, 440, -2],
    };
    // Create A Window background
    const RenderBufferMesh = RectCreateRect('Window', SID_DEFAULT_TEXTURE, WHITE, RenderBuffer.dim, [1, 1], [0, 1, 1, 0], RenderBuffer.pos, 10.0, 4, 10, null);

    RenderBufferMesh.gfxInfo = GlAddMesh(RenderBufferMesh.sid, RenderBufferMesh.mesh, 
        1, SCENE.play, CREATE_NEW_GL_BUFFER, NO_SPECIFIC_GL_BUFFER);
    // GfxSetVbShow(RenderBufferMesh.gfxInfo.prog.idx, RenderBufferMesh.gfxInfo.vb.idx, false);


    // Connect the font texture with the vertex buffer for text rendering. 
    const vb = GlGetVB(RenderBufferMesh.gfxInfo.prog.idx, RenderBufferMesh.gfxInfo.vb.idx);
    // Do not render the vertex buffer data of the rect that is to render the frame buffer texture
    vb.texIdx = fb.texIdx; // TODO: Temporary binding of the font texture to the text rendering VB
    // Store the program's and vb's indexes in the frame buffer for refferencing them
    fb.progIdx = RenderBufferMesh.gfxInfo.prog.idx;
    fb.vbIdx = RenderBufferMesh.gfxInfo.vb.idx;

}



function CreateTestButtonsScene() {

    CreatePlayer(SCENE.testButtons);


    const btnDim = [80, 20];
    let btnPos = [50, 25, 0];
    const padding = 20;
    const roundness = 5;

    const btn1 = CreateButton('Btn1', 'Button 1', GREEN, TRANSPARENT, btnDim, btnPos, roundness, 6, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn1.area.mesh.dim[1] * 2 + padding;
    const btn2 = CreateButton('Btn2', 'Button 2', RED, TRANSPARENT, btnDim, btnPos, roundness, 8, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn2.area.mesh.dim[1] * 2 + padding;
    const btn3 = CreateButton('Btn3', 'Button 3', BLUE, TRANSPARENT, btnDim, btnPos, roundness, 12, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn3.area.mesh.dim[1] * 2 + padding;
    const btn4 = CreateButton('Btn4', 'Button 4', YELOW, TRANSPARENT, btnDim, btnPos, roundness, 14, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn4.area.mesh.dim[1] * 2 + padding;
    const btn5 = CreateButton('Btn5', 'Button 5', YELOW, TRANSPARENT, btnDim, btnPos, roundness, 14, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn5.area.mesh.dim[1] * 2 + padding;
    const btn6 = CreateButton('Btn6', '!@#E$%^&*{}<>?"\';:', WHITE, TRANSPARENT, btnDim, btnPos, roundness, 16, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn6.area.mesh.dim[1] * 2 + padding;
    const btn7 = CreateButton('Btn7', 'Hi the! said \'james\'', MAGENTA_BLUE, TRANSPARENT, btnDim, btnPos, roundness, 16, true, ALIGN.LEFT | ALIGN.TOP); btnPos[1] += btn7.area.mesh.dim[1] * 2 + padding;
}


////////////////////////////////////////////////// OLD CODE //////////////////////////////////////////////////
// function createCreativeMenu() {

// 	// let _word = new Array;
// 	let pos = new Array(3);
// 	let scale = 0.0;


// 	let offset = 30;
// 	let offset2 = 30;

// 	let index = 0;


// 	pos = [ALIGN.RIGHT - 20, ALIGN.TOP - offset, 20.0];
// 	scale = 0.4;
// 	CreateButton(index, "!@#$%^&*()12345678 Test Game", pos, scale, WHITE, 'right');
// 	offset += offset2;
// 	index++;

// 	// _word = "Test Game";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.TOP - offset, 20.0];
// 	// CreateText(0, _word, pos, scale, WHITE, false, "right");
// 	// textLastElem++;
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_TEST;
// 	// offset += offset2;



// 	offset = 70;
// 	offset2 = 30;

// 	pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	scale = 0.3;
// 	CreateButton(index, "Stone Brick", pos, scale, WHITE, 'right');
// 	offset += offset2;
// 	index++;
// 	// _word = "Stone";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(1, _word, pos, scale, WHITE, false, "right");
// 	// textLastElem++;
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_STONE;
// 	// offset += offset2;

// 	pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	CreateButton(index, "Sand Stone Brick", pos, scale, WHITE, 'right');
// 	offset += offset2;
// 	index++;
// 	// _word = "Sand Stone";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(2, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_STONESAND;
// 	// offset += offset2;

// 	// _word = "Wood";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(3, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_WOOD;
// 	// offset += offset2;

// 	// _word = "Iron Black";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(4, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_IRONBLACK;
// 	// offset += offset2;

// 	// _word = "Iron Silver";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(5, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_IRONSILVER;
// 	// offset += offset2;

// 	// _word = "Iron Rust";
// 	// pos = [ALIGN.RIGHT - 20, ALIGN.BOTTOM + offset, 20.0];
// 	// CreateText(6, _word, pos, scale, WHITE, false, "right");
// 	// buttonsData[buttonsLastElem] = initButtonElem();
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
// 	// BUTTON_STATE |= BUTTON_IRONRUST;
// 	// offset += offset2;

// }


// function CreateMainMenu() {

// 	// for (let i = 0; i < text.length; i++) {
// 	// 	if (i <= OPTIONS_TEXT)
// 	// 		text[i].display = true;
// 	// 	else
// 	// 		text[i].display = false;
// 	// }
// 	// CreateMainMenuUi();


// 	// let _word = "Play";
// 	// CreateText(PLAY_TEXT, _word, pos, scale, WHITE, true, "center");
// 	// textLastElem++;
// 	// buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);

// 	let pos = [0.0, CHAR_HEIGHT * 2 + 20, 0.0];
// 	let scale = 0.8;
// 	CreateButton(PLAY_TEXT, "Play", pos, scale, WHITE, 'center');
// }


// function startGame() {

// 	startBall = false;
// 	score.curr = 0;
// 	score.modifier = 1.0;


// 	createStage();
// 	text[UI_TOTAL_SCORE_NUM].display = false;

// 	GAME_STATE = SHOW_STAGENUM; console.log("SHOW_STAGENUM");

// }

