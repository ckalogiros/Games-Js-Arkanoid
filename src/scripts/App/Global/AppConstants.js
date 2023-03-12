"use strict";

// Counter to increment some member variables(instaed of harcoding incrimental values)
let cnt = 0;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Application's Constants */
const g_state = {
    game: {
        paused: false,
        stageCompleted: false,
    },
    hovered: null,
};

const ALIGN = {

    NONE:0x0,
    LEFT: 0x1,
    RIGHT: 0x2,
    TOP: 0x4,
    BOTTOM: 0x8,
    CENTER_HOR: 0x10,
    CENTER_VERT: 0x20,
};

const MENU_BAR_HEIGHT = 50;
const GAME_AREA_TOP = MENU_BAR_HEIGHT * 2;

const Device = {
    width: 0,
    height:0,
}
const Viewport = {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ratio: 0,
    leftMargin:0,
    topMargin:0,
};

const GAME_STATE = {

};

/**
 * This is to create structured indexes for all scenes in the application,
 * and also store the global state of the current active scene() 
 */
cnt = 0;
const SCENE = {
    // none: 0,
    startMenu: cnt++,
    startStage: cnt++,
    finishStage: cnt++,
    stage: cnt++,
    active: { idx: INT_NULL },
};

/**
 * This is used to create structured indexes for all meshes of the application,
 * so that we do not waste calculations on searching for a mesh by name (or any other id) 
 */
cnt = 0;
const APP_MESHES_IDX = {
    background: {
        startMenu: cnt++,
        startStage: cnt++,
        stage: cnt++,
        finishStage: cnt++,
        stageMenu: cnt++,
        Menu: cnt++,
    },
    buttons: {
        play: cnt++,
        options: cnt++,
        start: cnt++,
        continue: cnt++,
        menuStage: cnt++,
        backStage: cnt++,
    },
    text: {
        totalScore: cnt++,
    },
    player: cnt++,
    balls: cnt++,
    bricks: cnt++,
    powUps: cnt++,
    ui: cnt++,
    fx: {
        ballTail: cnt++,
        explosions: cnt++,
        particleSystem: cnt++,
    },

    count: cnt
};

/** Ball */
const BALL = {
    RADIUS: 12,
    MAX_AMT: 7.2,
    MIN_AMT: -7.2,
    HIT:{
        LEFT_DIR: 0,
        TOP_DIR: 0,
        HIT_ACCEL: 1.05, //1.15,
        CORNER_HIT_ACCEL: 1.15, //1.4,
    },
    YX_SPEED_RATIO: 1.3,
    RADIUS_TWO_THIRDS: 0,
    MODE: {
        powerBall: false,
    },
    DIR:{X:1, Y:1},
    SIGN: 0,
};

/** Player */
const PLAYER = {
    XPOS: 0,
    YPOS: 0,
    WIDTH: 0,
    HEIGHT: 0,
};
/** Brick */
const BRICK = {
    // WIDTH: 28,
    // HEIGHT: 16,
    WIDTH: 24,
    HEIGHT: 13,
    PAD: 6,

    ROUNDNENSS:4,
    BORDER:1.6,
    FEATHER:0.8,
};

const POW_UP = {
    
    STYLE: {
        ROUNDNENSS:8,
        BORDER:0,
        FEATHER:2.8,
    }
}

const UI_TEXT = {
    FONT_SIZE: 6,
}



cnt = 0;
//** These are static indexe for all ui text */
const UI_TEXT_INDEX = {
    SCORE: cnt++,
    TOTAL_SCORE: cnt++,
    SCORE_MOD: cnt++,
    LIVES: cnt++,
};


/* Application's Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/





