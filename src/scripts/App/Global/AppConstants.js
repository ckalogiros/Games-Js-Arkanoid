"use strict";



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Application's Constants */
const g_state = {
    game: {
        paused: false,
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
    CENTER_VERT: 0x11,
};

const MENU_BAR_HEIGHT = 50;
const GAME_AREA_TOP = MENU_BAR_HEIGHT * 2;

const Viewport = {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ratio: 0,
};

const GAME_STATE = {

};

const SCENE = {
    none: 0,
    startMenu: 1,
    play: 2,
    active: {
        id: 0,
        idx: -1,
    },
    testButtons: 10,
};

/** Ball */
const BALL = {
    MAX_AMT: 7.2,
    MIN_AMT: -7.2,
    HIT_ACCEL: 1.05, //1.15,
    CORNER_HIT_ACCEL: 1.15, //1.4,
    // When ball collides with a brick, move ball away from brick by 4 pixels
    // THROUGH_OUTSIDE: 4,
    RADIUS_TWO_THIRDS: 0,
    MODE: {
        powerBall: false,
    },
    DIR:{X:1, Y:1},
};


//** These are static indexe for all ui text */
const UI_TEXT_INDEX = {
    SCORE: 0,
    TOTAL_SCORE: 1,
    SCORE_MOD: 2,
    LIVES: 3,
};


/* Application's Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/





