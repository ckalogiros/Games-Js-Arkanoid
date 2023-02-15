"use strict";


// Init basic meshes
// export function InitMeshes( ) {

//   // Shield Mesh
//   //shieldMesh = createBuffersFromMesh( WHITE, VIEWPORT_WIDTH /2, 15, 0, SHIELD_LASER );
//   //shieldPos = [ RIGHT, BOTTOM + UI_BOTTOM_BAR, 0.0 ];
  
// 	// Player Mesh
//   createPlayer( );

// 	// Create ball mesh & data
// 	createBall( 1 );

// }

// function CreateStartMenu( ) {
  
//   let pos = [ 0.0, CHAR_HEIGHT *2 +20, 0.0 ];
// 	let scale = 0.8;
  
//   // Play button
// 	let _word = "Play";
//   CreateText( PLAY_TEXT, _word, pos, scale, WHITE, true, "center" );
//   textLastElem++;
// 	buttonsData[ buttonsLastElem ] = createButtons( _word, scale, pos );
// 	BUTTON_STATE |= BUTTON_PLAY;

  
//   // Upgrade button  
// 	_word = "Upgrade";
// 	pos =  [ 0.0, CHAR_HEIGHT, 0.0 ];
//   CreateText( UPGRADE_TEXT, _word, pos, scale, WHITE, true, "center" );
//   textLastElem++;
// 	buttonsData[ buttonsLastElem ] = createButtons( _word, scale, pos );
// 	BUTTON_STATE |= BUTTON_UPGRADE;
  
  
//   // Options button  
// 	_word = "Options";
// 	pos =  [ 0.0, -30.0, 0.0 ];
//   CreateText( OPTIONS_TEXT, _word, pos, scale, WHITE, true, "center" );
//   textLastElem++;
// 	buttonsData[ buttonsLastElem ] = createButtons( _word, scale, pos );
// 	BUTTON_STATE |= BUTTON_OPTIONS;
  
  
//   scale = 0.4;
//   _word = "Lives ";
// 	CreateText( UI_LIVES_TEXT, _word,
//               setPosition( "LD", 0, scale ),
// 							scale, WHITE, false, "left" );
//   textLastElem++;

// 	_word = "score ";
// 	CreateText( UI_SCORE_TEXT, _word,
// 							setPosition( "LU", 0, scale ),
//               scale, WHITE, false, "left" );
//   textLastElem++;
	
//   TextUi_modNum( false ); textLastElem++;
//   console.log
// 	_word = "mod: ";
// 	CreateText( UI_MOD_TEXT, _word, 
//               setPosition( "RD", g_text[ UI_MOD_NUM ].dimentions[0], scale ),
// 							scale, WHITE, false, "right" );
//   textLastElem++;


// 	TextUi_stageScoreNum( );	textLastElem++;
//   TextUi_livesNum( ); 	    textLastElem++;
//   TextUi_totalScoreNum( );	textLastElem++;
  
//   	  _word = "Completed!" ;
// 	CreateText( STAGE_COMPLETION, _word, [ 0.0, 0.0, 0.0 ], 
// 												scale, WHITE, false, "center" );
//   textLastElem++;
	
//   _word = "Stage " + stageNum;
// 	CreateText( STAGE_NUM, _word, [ 0.0, 0.0, 0.0 ], 
// 												scale, WHITE, true, "center" );
//   textLastElem++;
  
// 	// Cash mod 0.1
//   scale = 0.2;
//    _word = "+0.1";
// 	CreateText( MOD_NUM1, _word, [ 0.0, 0.0, 0.0 ], scale, 
//                             WHITE, true, "center" );
//   textLastElem++;
  
// 	// Cash mod 1.0
// 	scale = 0.2;
//    _word = "+1.0";
// 	CreateText( MOD_NUM2, _word, [ 0.0, 0.0, 0.0 ], scale, 
//                             WHITE, true, "center" );
//   textLastElem++;
  
// }

function createStage( ) {
	
	stageNum++;

	
  TextUi_modNum( false ); 
	TextUi_stageScoreNum( );	
  TextUi_livesNum( ); 	    
	
  
	g_text[ UI_SCORE_NUM ].display = false;
	g_text[ UI_LIVES_NUM ].display = false;
  g_text[ UI_MOD_NUM ].display = false;
  
  
  TextUi_totalScoreNum( );	      

  
  let _word = "Stage " + stageNum;
  let scale = 1.0;
	CreateText( STAGE_NUM, _word, [ 0.0, 0.0, 0.0 ], 
                                scale, WHITE, true, "center" );
  //initTextBuffer( STAGE_NUM );
  _word = "Completed!" ;
	CreateText( STAGE_COMPLETION, _word, [ 0.0, -CHAR_HEIGHT, 0.0 ], 
                              scale, WHITE, false, "center" );
  //initTextBuffer( STAGE_COMPLETION );



  if( stageNum > 1 ) {
    
    //let unbreakable = [ 71 ];
		/* let sandStone   = [ 115,116,125,126,128,127,135,136,
                        139,140,145,146,148,149,151,152,
                        155,156,158,161,163,164,166,175 ]; */                         
    let stageBricks = [];
    let stageBricksLen = 15;
    
    
    for( let i = 0; i < stageBricksLen; ++i ) 
      stageBricks[i] = 
                Math.floor( Math.random( ) *grid.active.length );

    createBrick( stageBricks, 3 );

  }
    
  // Types of powerUps
  //[life, points, shield, powerBall, reduceBallSpeed]
	powUp.types[0] = "gun";
	
	//let powUp.types = [ "life", "scale", "points", "balls", "gun", "shield", "powerBall", ];
  
  // Set randomly which bricks will hold powUps
  // !! check for duplicates
	for( let i = 0; i < br.size ; ++i)
    powUp.name[i] = powUp.types[ Math.floor( 
                        Math.random( ) *powUp.types.length ) ];
  

  ball.nextPosX[0] = ball.xdir[0] * ball.amtx[0] *curv.x *
                     ballSpeed *time.delta;
  ball.nextPosY[0] = ball.ydir[0] * ball.amty[0] *curv.y *
                     ballSpeed *time.delta;

  
}

// function createPlayer( ) {

//   player.wPos 	= [ 0.0, BOTTOM +60, 0.0 ];
//   player.pos  	= [ plx, ply, plz ];
//   player.scale  = [ 1.0, 1.0, 1.0 ];
//   player.col  	= WHITE;
//   player.g_text 	= PL_STANDARD;
//   // player.g_text 	= BR_IRON_SILVER;
  
//   player.prevPos[0] = 0;
  
//   player.changed[WPOSBUF] = true;
//   player.changed[POSBUF]  = true;
//   player.changed[COLBUF]  = true;
//   player.changed[TEXTBUF] = true;
//   player.changed[0] = true;

// }

// function createBall( numBalls ) {

// 	for( let i = 0; i < numBalls; ++i ) {
		
// 		if( i === 0 ){
			
//       ball.col[i] = WHITE;
// 			ball.amtx[i] = 1;
// 			ball.amty[i] = 1;
// 			ball.xdir[i] = 1; 
// 			ball.ydir[i] = 1; 
// 			initPositions( "ball", i );
			
// 		}
// 		else {
      
//       ball.col[i] = COLOR_ARRAY[ Math.floor( Math.random( ) *COLOR_ARRAY.length ) ];
// 			ball.xdir[i] = -ball.xdir[ i-1 ];
// 			ball.ydir[i] = 1;
// 			initPositions( "ball", i );
// 			ball.active[i] = true;
// 			ball.amtx[i] = Math.random( ) *1.3 +0.3;
// 			ball.amty[i] = Math.random( ) *1.3 +0.3;
      
// 		}

//     //ball.wPos[i]  = [ Math.floor( Math.random( ) * -500.0 +200 ), Math.floor( Math.random( ) * -500.0 + 250 ) , 0.0 ];
//     ball.active[i]	= true;
//     ball.pos[i]			= [ blx, bly, blz ];
// 		ball.scale[i]		= [ 1.0, 1.0, 1.0 ];
//     ball.g_text[i]		= BALL_STANDARD;
    
//     ball.size++;

// 	}
  
//   ball.changed[0] = true;
//   ball.changed[POSBUF]  = true;
//   ball.changed[COLBUF]  = true;
//   ball.changed[TEXTBUF] = true;
  
// }

// function createBrick( batch, texture ) {
  
//   let type = null;
  
//   switch( texture ) {
//       case 0: type = "stone";     break;
//       case 1: type = "sandStone"; break;
//       case 2: type = "wood";      break;
//       case 3: type = "ironBlack"; break;
//       case 4: type = "ironSilver";break;
//       case 5: type = "ironRust";  break;
//       default:  type = "Default-Null"; break;
//     }
  
//   if( batch ) {
//     for( let i = 0; i < batch.length; i++ ) {
//       if( grid.active[batch[i]] === false ) {
        
//         grid.active[batch[i]] = true;

//         br.wPos[ br.lastElem ] = grid.pos[ batch[i] ];
//         br.pos[ br.lastElem ] = [ brx, bry, brz ]; 
//         br.scale[ br.lastElem ] = [ 1.0, 1.0, 1.0 ];
//         br.col[ br.lastElem ] = WHITE;
//         br.g_text[ br.lastElem ] = BRICK_UV_MAP[ texture ];
        
//         br.gridIndex[br.lastElem] = batch[i];
//         br.type[br.lastElem]   = type;
        
//         br.lastElem++;
//         br.size++;    
//       }
//     }
//   }
//   else{
//     for( let i = 0; i < grid.active.length; i++ ) {
      
//       if( grid.active[i] === false &&
//           mouseX > grid.pos[i][0] - brx &&
//           mouseX < grid.pos[i][0] + brx &&
//           mouseY > grid.pos[i][1] - bry &&
//           mouseY < grid.pos[i][1] + bry   ) {
          
//           grid.active[i] = true;
//           grid.lastElem++;

//           br.wPos[ br.lastElem ] = grid.pos[i];
//           br.pos[ br.lastElem ] = [ brx, bry, brz ];
// 					br.scale[ br.lastElem ] = [ 1.0, 1.0, 1.0 ];
//           br.col[ br.lastElem ] = WHITE;
//           br.g_text[ br.lastElem ] = BRICK_UV_MAP[ texture ];

          
//           br.gridIndex[br.lastElem] = i;
//           br.type[br.lastElem]   = type;

          
//           br.lastElem++;
//           br.size++;
          
//           break;
//       }
//     }
//   }
// }

function createGun( ) {

	gun.wPos = addArrays( player.wPos, gunPosOffset );
	//gun.wPos = player.wPos;
	//gun.pos = [ gunx, guny, gunz ];
	//gun.scale = [ 1.0, 1.0, 1.0 ];
	//gun.color = [ 1.0, 1.0, 1.0, 1.0 ];
	gun.text = PL_STANDARD;
	inGunMode = true;
	
}

function createBullet( ) {
  
  for( let i = 0; i < MAX_BULLETS; ++i ) {
    if( !bullet.active[i] ) {
      
      bullet.wPos [i]    = gun.wPos;
      bullet.pos  [i]    = [ bux, buy, buz ];
      bullet.scale[i]    = [ 1.0, 1.0, 1.0 ];
      bullet.col  [i]    = WHITE;
      bullet.text [i]    = BULLET_LASER;
      
      bullet.active[i] = true;
      
      bullet.changed[WPOSBUF] = true;
      bullet.changed[POSBUF]  = true;
      bullet.changed[COLBUF]  = true;
      bullet.changed[TEXTBUF] = true;
      bullet.changed[0] = true;
      
      bullet.size++;
			if( bullet.lastElem < i)
				bullet.lastElem = i;
      console.log("create:", i );
      break;
      
    }

  }
  
}

function createPowUp( index ) {
  
  powUp.size++;
  
  
  powUp.pos[powUp.lastElem]  	= vertexPos3( pwx, pwy, pwz );
  powUp.scale[powUp.lastElem]	= [ 1.0, 1.0, 1.0 ];
  powUp.col[powUp.lastElem]  	= WHITE;
  powUp.wPos[powUp.lastElem] 	= br.wPos[index]; 
  powUp.text[powUp.lastElem] 	= POW_UP;
  

  powUp.active[powUp.lastElem] = true;
  
  powUp.lastElem++;
  
}

function destroyBrickFree( ) {

  for( let i = 0; i < br.size; i++ ) {
    if( br.size > 0 &&
        mouseX > grid.pos[br.gridIndex[i]][0] - brx &&
        mouseX < grid.pos[br.gridIndex[i]][0] + brx &&
        mouseY > grid.pos[br.gridIndex[i]][1] - bry &&
        mouseY < grid.pos[br.gridIndex[i]][1] + bry   ) {


      grid.active[br.gridIndex[i]] = false;
      br.changed[0] = true;
      
      br.wPos.splice( i, 1 );
      br.text.splice( i, 1 );
      br.gridIndex.splice( i, 1 );

      br.changed[POSBUF]  = true;
      br.changed[WPOSBUF] = true;
      br.changed[COLBUF]  = true;
      br.changed[TEXTBUF] = true;
      
      br.lastElem--;
      br.size--;

    }

  }
}

