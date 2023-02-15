/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * OLDER-To be checked
 */
// const GRID_COLS = 11;
// const GRID_ROWS = 16;
// const MAX_BALLS = 2000;



// const UI_UPPER_BAR  = 30;
// const UI_BOTTOM_BAR = 50;



// Game State Flags
// let   setFlag             = 1;
// let   GAME_STATE 	        = 0;
// const MODE_GAME		        = setFlag;   setFlag *=2;  // 1
// const MODE_CREATIVE		    = setFlag;   setFlag *=2;  // 2
// const MENU_MAIN	          = setFlag;   setFlag *=2;  // 4
// const SHOW_STAGENUM       = setFlag;   setFlag *=2;  // 8
// const SHOW_STAGECOMPLETED = setFlag;   setFlag *=2;  // 16
// const SHOW_GAMEOVER	      = setFlag;   setFlag *=2;  // 32
// const SCREEN_SHOWSCORE	  = setFlag;   setFlag *=2;  // 64
// const GAME_PAUSED			    = setFlag;   setFlag *=2;  // 128
// const GAME_UNPAUSED	      = setFlag;   setFlag *=2;  // 256
// const DEBUG			          = setFlag;   setFlag *=2;  // 512



// const states = {
	
// 	creative: 0, 
// 	game: { 
// 		menu: {
// 			main: 0,
// 			options: 0,
// 			upgrade: 0,
// 		}, 
// 		show: {
// 			stage: 0,
// 			stageComplete: 0,
// 			totalScore: 0,
// 			gameOver: 0,
			
// 		},
// 		inGame: {
// 			paused: 0,
// 			unPaused: 0,
// 		} 
// 	} 
// }

// Buttons Recognition Flags
// setFlag                   = 1;    
// let   BUTTON_STATE        = 0;           
// const BUTTON_PLAY         = setFlag;   setFlag *=2;  
// const BUTTON_UPGRADE      = setFlag;   setFlag *=2;     
// const BUTTON_OPTIONS      = setFlag;   setFlag *=2;
// const BUTTON_TEST         = setFlag;   setFlag *=2;                                 
// const BUTTON_STONE        = setFlag;   setFlag *=2;          
// const BUTTON_STONESAND    = setFlag;   setFlag *=2;           
// const BUTTON_WOOD         = setFlag;   setFlag *=2;
// const BUTTON_IRONBLACK    = setFlag;   setFlag *=2;
// const BUTTON_IRONSILVER   = setFlag;   setFlag *=2;
// const BUTTON_IRONRUST     = setFlag;   setFlag *=2;
  



// Text Array Indexes
// setFlag = 0;
// const PLAY_TEXT		      	= setFlag; setFlag++; //0
// const UPGRADE_TEXT		  	= setFlag; setFlag++; //1
// const OPTIONS_TEXT		  	= setFlag; setFlag++; //2

// const UI_LIVES_TEXT		    = setFlag; setFlag++; //3
// const UI_SCORE_TEXT       = setFlag; setFlag++; //4
// const UI_MOD_NUM	        = setFlag; setFlag++; //5
// const UI_MOD_TEXT         = setFlag; setFlag++; //6
// const UI_SCORE_NUM	      = setFlag; setFlag++; //7
// const UI_LIVES_NUM  		  = setFlag; setFlag++; //8

// const UI_TOTAL_SCORE_NUM  = setFlag; setFlag++; //9
// const STAGE_COMPLETION  	= setFlag; setFlag++; //10
// const STAGE_NUM				  	= setFlag; setFlag++; //11
// const MOD_NUM1		        = setFlag; setFlag++; //12
// const MOD_NUM2		        = setFlag; setFlag++; //13
// const LAST_TEXT		        = MOD_NUM1;  // Last pre-initialised text's index


// // Texture coord for uv mapping
// const ATLAS_NORM = 1 / 2048;
// const ATLAS_BR_WIDTH  = 90;
// let atlasBrOffset = 0;
// const BACKGROUND = [ 
//   ATLAS_NORM *1024, ATLAS_NORM *1024, 
//   ATLAS_NORM *1024, ATLAS_NORM *2048,  
//   ATLAS_NORM *2048, ATLAS_NORM *2048, 
//   ATLAS_NORM *2048, ATLAS_NORM *1024 
// ];
// const POW_UP = [ 
//   ATLAS_NORM *1866, ATLAS_NORM *258, 
//   ATLAS_NORM *1866, ATLAS_NORM *270,  
//   ATLAS_NORM *1908, ATLAS_NORM *270, 
//   ATLAS_NORM *1908, ATLAS_NORM *258 
// ];
// const PL_STANDARD = [ 
//   ATLAS_NORM *1816, ATLAS_NORM *189, 
//   ATLAS_NORM *1816, ATLAS_NORM *258, 
//   ATLAS_NORM *2043, ATLAS_NORM *258, 
//   ATLAS_NORM *2043, ATLAS_NORM *189 
// ];
// const BALL_STANDARD = [
//   ATLAS_NORM *1688, ATLAS_NORM *210, 
//   ATLAS_NORM *1688, ATLAS_NORM *242, 
//   ATLAS_NORM *1719, ATLAS_NORM *242, 
//   ATLAS_NORM *1719, ATLAS_NORM *210
// ];
// const  BR_STONE = [ 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *300, 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *343, 
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *343, 
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *300 
// ];
// atlasBrOffset += 10 + ATLAS_BR_WIDTH;//100
// const  BR_STONE_SAND = [
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *300, 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *300 
// ];
// atlasBrOffset += 10 + ATLAS_BR_WIDTH;//200
// const  BR_WOOD = [
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *(300), 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *(343),
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *(343),
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *(300) 
// ]; 
// atlasBrOffset += 10 + ATLAS_BR_WIDTH;//300
// const  BR_IRON_BLACK = [
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *300, 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH+atlasBrOffset), ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH+atlasBrOffset), ATLAS_NORM *300 
// ];   
// atlasBrOffset += 10 + ATLAS_BR_WIDTH;//400
// const  BR_IRON_SILVER = [
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *300, 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *300 
// ];
// atlasBrOffset += 10 + ATLAS_BR_WIDTH;//500
// const  BR_IRON_RUST = [
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *300, 
//   ATLAS_NORM *atlasBrOffset, ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *343,
//   ATLAS_NORM *(ATLAS_BR_WIDTH +atlasBrOffset), ATLAS_NORM *300 
// ];
// const PARTICLES = [ 
//   ATLAS_NORM *490, ATLAS_NORM *300, 
//   ATLAS_NORM *490, ATLAS_NORM *343,
//   ATLAS_NORM *580, ATLAS_NORM *343, 
//   ATLAS_NORM *580, ATLAS_NORM *300  
// ]; 
// const BULLET_LASER = [ 
//   ATLAS_NORM *1687, ATLAS_NORM *246, 
//   ATLAS_NORM *1687, ATLAS_NORM *258, 
//   ATLAS_NORM *1700, ATLAS_NORM *258, 
//   ATLAS_NORM *1700, ATLAS_NORM *246 
// ]; 
// const SHIELD_LASER = [ 
//   ATLAS_NORM *1687, ATLAS_NORM *256, 
//   ATLAS_NORM *1692, ATLAS_NORM *256,
//   ATLAS_NORM *1692, ATLAS_NORM *249, 
//   ATLAS_NORM *1687, ATLAS_NORM *249  
// ];   
// const BRICK_UV_MAP = [ 
//   BR_STONE,
//   BR_STONE_SAND,
//   BR_WOOD,
//   BR_IRON_BLACK,
//   BR_IRON_SILVER,
//   BR_IRON_RUST
// ];
// let activeTexture = 0;







// // Odd & even counters for half the frames rendering
// let oddFr = true;
// let evenFr = false;

// Time between start & end of render function
// let currTime = 0;
// let prevTime = 0;
// let timePerFrame = 0;
// // FPS
// let time = {
// 	prev:  0,
// 	curr:  0,
// 	delta: 0,
// 	accum: 0,
//   cnt:   0,
// };


// If we don't want to render something 
// every frame or to render it in intervals 
// let time50Ms;    
// let time150Ms;  
// let time1s;  


// // Which stage we are currently in
// let stageNum = 0;
// // Create scene cases for the switch statement
// let case_mainMenu      = 1;
// let case_startGame     = 2;
// let case_creativeMenu  = 3;




// ASCII characters for texture coord
// const CHAR_ARR_LEN	= new Uint8Array(93);
// let charArr					= new Array( CHAR_ARR_LEN );			 
// let charStart				= new Uint16Array( CHAR_ARR_LEN );
// let charEnd					= new Uint16Array(CHAR_ARR_LEN);	 
// let charWidth				= new Uint16Array( CHAR_ARR_LEN );
// const CHAR_HEIGHT		= 64.5;
// const CHAR_DEPTH		= 10;


// let showMenu = false;
// let startBall =  false;

// Shortcuts for objects x, y and z coordinates 
// let blx  = 5.0,   bly  = 5.0,   blz  = 0.8; 
// let brx  = 26.0,  bry  = 13,    brz  = 0.5; 
// let gunx = 15.0,  guny = 10.5,  gunz = 0.5; 
// let pwx  = 18.0,  pwy  = 4,     pwz  = 0.6;
// let bux  = 3.8,   buy  = 8.2,   buz  = 0.9;

// const TEXTBUF   = 1;
// const COLBUF    = 2;    
// const POSBUF    = 3;    
// const WPOSBUF   = 4;
// const INDBUF    = 5;


// let g_text = [];
// let textSize = 0;
// let textLastElem = 0;


// let player = {
	
//   prevPos: [ ], savePos: false, speed: 500, 
//   mouseDist: 0, size: 1,
  
//   changed:  [ false, false, false, false, false, false ],
//   col:      [ ],
//   pos:      [ ],
//   text:     [ ],
//   wPos:     [ ],
//   scale:    [ 1.0, 1.0, 1.0 ],
//   idx:      0,
// };
// let plScale				= [ 1.0, 1.0, 1.0 ];


// let ball = { 

//   size: 0, active: [ ],
//   amtx: [ ], amty: [ ], xdir: [ ], ydir: [ ],
//   nextPosX: [ ], nextPosY: [ ],

//   changed:  [ false, false, false, false, false, false ],
//   col:      [ ],
//   pos:      [ ],
//   text:     [ ],
//   wPos:     [ ],
//   scale:    [ ],
//   idx:      0,
// };


// let grid = { 

//   active: [ ], 
//   pos: [ ], 
//   col: [ ],
//   row: [ ],
//   lastElem: 0,
  
// };
// let br = { 

//   size:0, lastElem:0, len: 0, gridIndex: [ ], 
//   type: [ ], powUp: [ ],

//   changed:  [ false, false, false, false, false ],
//   col:      [ ],
//   pos:      [ ],
//   text:     [ ],
//   wPos:     [ ],
// 	scale:    [ ],
//   idx:   0,
// };
 
// let powUp = { 

//   size: 0, prevSize:0, lastElem: 0, 
//   types: [ ], name: [ ], active: [ ],

//   changed:  [ false, false, false, false, false ],
//   col:      [ ],
//   pos:      [ ],
//   text:     [ ],
//   wPos:     [ ],
// 	scale:    [ ],
//   idx:      0,
// };

// let gun = {
//   changed:  [ false, false, false, false, false, false ],
//   col:      [ ],
//   pos:      [ ],
//   text:     [ ],
//   wPos:     [ ],
// 	scale:    [ ],
//   idx:      0,
// };
// let	gunPosOffset =  [ 0.0, 1.25, 0.0 ];

// let bullet = { 

//   size: 0, 
//   lastElem: 0,
  
//   changed:  [ false, false, false, false, false, false ],
//   active:   [ ], 
//   col:      [ ],
//   pos:      [ ],
//   text:     [ ],
//   wPos:     [ ],
// 	scale:    [ ],
//   idx:      0,
// };

// const MAX_BULLETS = 20;
// let		bulletSpeed 	= 180;

    
// let shieldMesh = null,
//     shieldPos = new Array(3);
    

// let ammount	= 1; 
// let	amtx 		= new Float32Array( MAX_BALLS ); 
// let	amty 		= new Float32Array( MAX_BALLS );

// let curv = {
//   x: 1.0,
//   y: 1.0,
//   xMinus: false,
//   xPlus : false,
// }
// let cycle = 0.0;

// // Player Modes
// let inCurvMode  = false;
// let inBallsMode = false;
// let inGunMode 	= false;
// let inScaleMode = false;
// let inShieldMode = false;
// let inPowerBallMode = false;



// let mouseX 		  = 0;
// let mouseY 		  = 0;
// let lives 			= 1;
// let rotation    = 0;
// let max 			  = 0;
// let ballSpeed 	= 150;
// let ballNextPos = [0,0];

// let score = {
//   total:          0,
//   curr:           0,
//   modifier:       1.0,
//   breakBrick:     0.2,
//   comboMod:       0.0,
//   storedModifier: 1.0,
//   textModifier:   [ ],
// };


// // Timer for Modifier Number
// let scoreModifier = {
//   prev: 0,
//   curr: Date.now(),
//   time:   0.8,
//   plCollision: false,
//   red:    1.0,
//   green:  1.0,
//   blue:   1.0,
// };



// let glob_buffersIndexes = {
//   player: { start: 0, end: 0 },
//   ball	: { start: 0, end: 0 },
//   brick	: { start: 0, end: 0 },
//   powUp	: { start: 0, end: 0 },
//   gun 	: { start: 0, end: 0 },
//   bullet: { start: 0, end: 0 },
//   text	: { start: [], end: [] },	
// };
