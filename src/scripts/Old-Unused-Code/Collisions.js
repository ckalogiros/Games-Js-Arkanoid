// "use strict";

// // import {player} from './Drawables/Player.js'
// import {ball} from '../Drawables/Ball.js'

// export function BallBoundaries( i ) {
	
// 	// Bounds for x Direction
// 	if( ball.wPos[i][0] + blx*2 > ALIGN.RIGHT ) {
    
//     ball.wPos[i][0] = ALIGN.RIGHT - ( blx *2 );
// 		ball.xdir[i] = -1.0;
	
// 	}
// 	else if( ball.wPos[i][0] - blx *2 < ALIGN.LEFT ) {
	
// 		ball.wPos[i][0] = ALIGN.LEFT + ( blx *2 );
// 		ball.xdir[i] = 1.0;
		
// 	}
// 	// Bounds for y Direction
// 	else if( ball.wPos[i][1] + bly *2 > ( ALIGN.TOP -UI_UPPER_BAR ) ) {
	
// 		ball.wPos[i][1] = ( ALIGN.TOP -UI_UPPER_BAR ) -bly *2;
// 		ball.ydir[i] = -1.0;
	
// 	}		

// 	//Reset ball if yPos < Bottom
// 	else if( ball.wPos[i][1] < ALIGN.BOTTOM ) {
		
// 		scoreModifier.red 		= 1.0;
// 		scoreModifier.green 	= 0.0;
// 		scoreModifier.blue 	= 0.0;
// 		Text_modNum( ball.wPos[i][0],
//                  ALIGN.BOTTOM +30, 
//                  2.0, "-"   	);

// 		if( score.modifier >= 1.2 )
//         score.modifier -= 0.2;

// 		destroyObj( i, "ball" );

		
//     cycle = 0.01;
		
// 		if( ball.size <= 0  ) {

// 			createBall( 1 );
			
//       inBallsMode = false;
// 			startBall = false;
// 			lives--;

// 			score.modifier = 1.0;
			
// 			TextUi_livesNum( ); 
// 			TextUi_stageScoreNum( );
// 			TextUi_modNum( true );

// 		}	
		
// 		/* if( lives < 0 ) {
// 			gameOver( );
// 			console.log("gameOver");
// 			return ;
// 		} */
// 	}
// }


// export function PowUpPlayer( i ) {

// 	if( powUp.wPos[i][0] - pwx < player.wPos[0] + plx &&
//       powUp.wPos[i][0] + pwx > player.wPos[0] - plx 	) {
    
// 		if( powUp.name[i] !== "points" ) {
//      score.modifier += 1.0;
//      Text_modNum( powUp.wPos[i][0],
//                   powUp.wPos[i][1] +5.2, 
//                   1.0, "+" 	);
//      TextUi_stageScoreNum( );
//      TextUi_modNum( false );
//     }
    
//     powerUp( powUp.name[i], i );
    
// 		destroyObj( i, "powUp" );
		
// 	}
//   else if( powUp.wPos[i][1] < ALIGN.BOTTOM ) {
//     //console.log("below", i);
//     destroyObj( i, "powUp" );
//   }

// }


// export function PlayerBall( i ) {
	
// 	// Collision with Player
// 	if(	ball.wPos[i][0] + blx >= player.wPos[0] - plx &&
// 		  ball.wPos[i][0] - blx <= player.wPos[0] + plx &&
// 		  ball.wPos[i][1] - bly >= player.wPos[1] - ply &&
// 		  ball.wPos[i][1] - bly <= player.wPos[1] + ply  ) {

// 		// Bounce ball in y dir
// 		ball.ydir[i] = 1;

    
//     let temp = 0;
//     if( startBall ) {
//       temp = Math.abs( 
//              Max( player.wPos[1], player.prevPos[0] )
//            - Min( player.wPos[1], player.prevPos[0] )
//             );
//     } 
    
//     if( temp > 20 ) {
//       //inCurvMode = true;
//     }
    
//     curv.xMinus = false;
    
//     //&& playerPrevPos > mouseX
//     if( inCurvMode && !curv.xMinus ) {
//       curv.xMinus = true;
//       cycle = -1.0;
//       ball.amty[0] = 0.6;
//       //ball.amtx[0] = 2.9;
      
//       setTimeout( function( ) { 
//                     curv.xMinus = false; 
//                     curv.x = curv.y = 1.0; 
//                   }, 700 );
//     }
//     else {
      
//       ammount = ( ball.wPos[i][0] - player.wPos[0] ) /5;

//       // Clamp very high and very low values 
//        if( ammount < -7.2 ) ammount = -7.2;
//        else if( ammount >  7.2 ) ammount = 7.2;
      
//       // If ball is comming from the left and collides 
//       // to the left half of the player, then change x dir
//       if( ammount >  0  && ball.xdir[i] < 0 ) {
//         ball.xdir[i] *= -1;
//       }
//       // Same as above ( right side )
//       else if( ammount < 0  && ball.xdir[i] > 0 ) {
//         ball.xdir[i] *= -1;
//       }
//     }
		
	
// 		// Normalize ammount to have only positive values
// 		if(ammount < 0) ammount *= -1;

// 		// Change ballSpeed for x and y separately
// 		ball.amty[ i ] = ( ( 12 - ammount ) * 0.185 );
		
// 		// Clamp y ballSpeed
// 		if( ball.amty[i] > 2.5 ) ball.amty[i] = 2.5;
		

		
// 		if( ammount < (plx/3) * 2.62 ) {
// 			ball.amtx[ i ] = ( ammount *0.2 );
// 		}
//     else if( ammount < plx/2 ) {
// 			ball.amtx[ i ] = ( ammount *0.12 );
// 		}
// 		else {
// 			ball.amtx[ i ] = ( ammount *0.30 );
// 			ball.amty[ i ] = ( ( 12 - ammount )  * 0.07 );
// 		}
    
//     scoreModifier.plCollision = true;
// 		scoreModifier.red 		= 1.0;
// 		scoreModifier.green	= 1.0;
// 		scoreModifier.blue	 	= 1.0;
    
// 	}

//   player.prevPos[0] = player.wPos[0];
//   player.savePos = true;
//   inCurvMode = false;
  
// }


// export function BallBrick( i, j ) {
  
//   let intersects = false;
  
//   // Cashed Variables
//   const ballUp      = ball.wPos[j][1] + bly /1.2;
//   const ballBottom  = ball.wPos[j][1] - bly /1.2;
//   const ballRight   = ball.wPos[j][0] + blx /1.2;
//   const ballLeft    = ball.wPos[j][0] - blx /1.2;
  
//   const brUp      = br.wPos[i][1] + bry;
//   const brBottom  = br.wPos[i][1] - bry;
//   const brRight   = br.wPos[i][0] + brx;
//   const brLeft    = br.wPos[i][0] - brx;
  
//   const outLeft  = brLeft  - blx -1;
//   const outRight = brRight + blx +1;
//   const outUp    = brUp    + bly +1;
//   const outBottom  = brBottom - bly -1;

  
//   // Right Up
//   if( ball.xdir[j] > 0 && ball.ydir[j] > 0 ) {
//     if( ballRight >= brLeft &&
//         ballLeft  <= brRight ) {
//       if( ball.wPos[j][1] < brBottom ) {
//         if( ball.amtx[j] > 0.4 ) ball.wPos[j][1] = outBottom;
//         ball.ydir[j] = -1; //console.log(i,"Rtop"); 
//         intersects = true;
//       } 
//       else if( ball.wPos[j][0] < brLeft ) {
//         ball.xdir[j] = -1;
//         ball.wPos[j][0] = outLeft;
//         intersects = true;
//       }
//     }
//     else if( ballUp     >= brBottom &&
//              ballBottom <= brUp       ) {
//       if( ball.wPos[j][0] < brLeft ) {
//         ball.wPos[j][0] = outLeft;
//         ball.xdir[j] = -1; 
//         if( ball.amtx[j] < 1.3 ) ball.amtx[j] += 0.3;
//         intersects = true;
//       }       
//     }
//     else if( ball.wPos[j][0] < br.wPos[i][0] &&
//              ball.wPos[j][1] < br.wPos[i][1] ) { 

//       ball.xdir[j] = -1;
//       ball.ydir[j] = -1;
//       intersects = true;
//     }
//   }
//   // Right Down
//   else if( ball.xdir[j] > 0 && ball.ydir[j] < 0 ) {
//     if( ballRight >= brLeft &&
//         ballLeft  <= brRight ) {
//       if( ball.wPos[j][1] > brUp ) {
//         ball.wPos[j][1] = outUp;
//         ball.ydir[j] = 1; 
//         intersects = true;
//       }
//       else if( ball.wPos[j][0] < brLeft ) {
//         ball.xdir[j] = -1;
//         ball.wPos[j][0] = outLeft;
//       }
//     }
//     else if( ballUp     >= brBottom &&
//              ballBottom <= brUp ) {
//       if( ball.wPos[j][0] < brLeft ) {
//         if( ball.amtx[j] > 0.4 ) ball.wPos[j][0] = outLeft;
//         ball.xdir[j] = -1;
//         if( ball.amtx[j] < 1.3 ) ball.amtx[j] += 0.3;
//         intersects = true;
//       } 
//     } 
//     else if( ball.wPos[j][0] < br.wPos[i][0] &&
//              ball.wPos[j][1] > br.wPos[i][1]) { 

//       ball.xdir[j] = -1;
//       ball.ydir[j] = 1;
//       intersects = true;
//     }
//   }
//   // Left Up
//   else if( ball.xdir[j] < 0 && ball.ydir[j] > 0 ) {
//     if( ballRight >= brLeft &&
//         ballLeft <= brRight ) {
//       if( ball.wPos[j][1] < brBottom ) {
//         if( ball.amtx[j] > 0.4 ) ball.wPos[j][1] = outBottom;
//         ball.ydir[j] = -1; 
//         intersects = true;
//       }
//       else if( ball.wPos[j][0] > brRight ) {
//         ball.xdir[j] = 1;
//         ball.wPos[j][0] = outRight;
//         intersects = true;
//       }
//     }
//     else if( ballUp     >= brBottom &&
//              ballBottom <= brUp ) {
//       if( ball.wPos[j][0] > brRight ) {
//         ball.wPos[j][0] = outRight;
//         ball.xdir[j] = 1; 
//         if( ball.amtx[j] < 1.3 ) ball.amtx[j] += 0.3;
//         intersects = true;
//       }
//     }
//     else if( ball.wPos[j][0] > br.wPos[i][0] &&
//              ball.wPos[j][1] < br.wPos[i][1]) { 

//       ball.xdir[j] = 1;
//       ball.ydir[j] = -1;
//       intersects = true;
//     }
//   }
//   // Left Down
//   else if( ball.xdir[j] < 0 && ball.ydir[j] < 0 ) {
//     if( ballRight >= brLeft &&
//         ballLeft <= brRight ) {
//       if( ball.wPos[j][1] > brUp ) {
//         ball.wPos[j][1] = outUp;
//         ball.ydir[j] = 1; 
//         intersects = true;
//       }
//       else if( ball.wPos[j][0] > brRight ){
//         ball.xdir[j] = 1;
//         ball.wPos[j][0] = outRight;
//         intersects = true;
//       }
//     }
//     else if( ballUp     >= brBottom &&
//              ballBottom <= brUp ) {
//       if( ball.wPos[j][0] > brRight ) {
        
//         ball.wPos[j][0] = outRight;
//         ball.xdir[j] = 1; 
//         if( ball.amtx[j] < 1.3 ) ball.amtx[j] += 0.3;
//         intersects = true;
//       }         
//     }
//     else if( ball.wPos[j][0] > br.wPos[i][0] &&
//              ball.wPos[j][1] > br.wPos[i][1]) { 

//       ball.xdir[j] = 1;
//       ball.ydir[j] = 1;
//       intersects = true;
//     }
//   }
  
//   if( intersects ) {
    
//     curv.xMinus = false;
    
//     scoreModifier.prev = scoreModifier.curr;
//     scoreModifier.curr = Date.now() *0.001;

//     if( !scoreModifier.plCollision ) {
      
//       scoreModifier.red  -= 0.1;
//       scoreModifier.blue -= 0.1; 
      
//       score.comboMod += 0.1;
//     }
//     else {
      
//       scoreModifier.plCollision = false;
      
//       if( scoreModifier.curr - scoreModifier.prev < scoreModifier.time ) {

//         scoreModifier.red  -= 0.1;
//         scoreModifier.blue -= 0.1; 
        
//         score.comboMod += 0.1;
//       }
//       else {
        
//         scoreModifier.red = 1.0;
//         scoreModifier.blue = 1.0;
        
//         score.comboMod = 0.1;
//       }
//     }
    
    
//     score.modifier += score.comboMod + score.breakBrick;
//     score.curr += 10 * score.modifier;
    
    
//     if( br.type[i] === "ironBlack" ) 
//       ;
//     else {

//       Text_modNum( br.wPos[i][0],
//                    br.wPos[i][1], 
//                    score.comboMod, "+" );		

//       TextUi_stageScoreNum( );
//       TextUi_modNum( false );
      
//       if( br.powUp[i] !== null )
//         createPowUp( i );

      
//       destroyObj( i, "brick" );
//     }
//   }

// }


// export function BulletBrick( index ) {
	
// 	for( let i = 0; i < br.size; i++ ) {
		
// 		if( bullet.wPos[index][1] > ALIGN.TOP ) {
// 			destroyObj( index, "bullet" );
// 			return;

// 		}

// 		else if( br.wPos[i] !== null &&
// 				bullet.wPos[ index ][0] - bux < 
// 				br.wPos[i][0] + brx &&
// 				bullet.wPos[ index ][0] + bux > 
// 				br.wPos[i][0]  - brx		) {
			
// 			if( bullet.wPos[ index ][1] + buy > 
// 					br.wPos[i][1] - bry ) {
				
// 				score.comboMod += 0.05
// 				score.modifier += score.comboMod + score.breakBrick;
// 				score.curr += 5 * score.modifier;
	
// 				Text_modNum( br.wPos[i][0], 
// 										br.wPos[i][1], 
// 										score.comboMod, "+" );
				
// 				TextUi_stageScoreNum( );
// 				TextUi_modNum( false );
				
// 				if( br.powUp[i] !== null )
// 					createPowUp( i );
				
// 				destroyObj( index, "bullet" );
// 				destroyObj( i, "brick" );
	
// 				return;
// 			}
// 		}
// 	}	
// }

