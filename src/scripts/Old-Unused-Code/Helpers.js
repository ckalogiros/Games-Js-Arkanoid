"use strict";

function clear( ) {

	let i = 0;

	if( ball.size > 2 )
		for( i = ball.size; i > 0; --i )
			destroyObj( i, "ball" );
	
	else initPositions( "ball", 0 );
	
	if( powUp.size >= 0 ){
		for( i = powUp.size-1; i >= 0; --i ) {
			destroyObj( i, "powUp" );
		}
	}
	for( i = g_text.length-1; i >= MOD_NUM1; --i )
	g_text[i].display = false;
	if( inGunMode ){
		inGunMode = false;
	}
	if( inScaleMode ) {
		inScaleMode = false;
	}
	if( bullet.size > 0 ) {
		for( i = bullet.lastElem; i >= 0; --i )
			if( bullet.active[i] ) 
				destroyObj( i, "bullet" );

					
		
	}	


	GAME_STATE = SHOW_STAGECOMPLETED; console.log("SHOW_STAGECOMPLETED");

	g_text[UI_MOD_NUM].display       = false;
	g_text[UI_MOD_TEXT].display      = false;
	g_text[UI_LIVES_NUM].display     = false;
	g_text[UI_LIVES_TEXT].display    = false;

	g_text[STAGE_NUM].display        = true;
	g_text[STAGE_COMPLETION].display = true;

}


function destroyObj( index, type ) {

	if( type === "brick" ) {
    
    grid.active[br.gridIndex[index]] = false;


    br.wPos.splice( index, 1 );
    br.pos.splice( index, 1 );
    br.text.splice( index, 1 );
    br.gridIndex.splice( index, 1 );
    br.type.splice( index, 1 );


    br.lastElem--;
    br.size--;

	}
	
	else if( type === "ball"){
    
    ball.col.splice( index, 1 );
    ball.pos.splice( index, 1 );
    ball.wPos.splice( index, 1 );
    ball.text.splice( index, 1 );
    
    ball.amtx.splice( index, 1 );
    ball.amty.splice( index, 1 );
    ball.xdir.splice( index, 1 );
    ball.ydir.splice( index, 1 );
    
    ball.nextPosX.splice( index, 1 );
    ball.nextPosY.splice( index, 1 );
    
    ball.active.splice( index, 1 );
    

		ball.size--;
    
	}
		
	else if( type === "powUp" ){

    powUp.pos.splice    ( index, 1 ); 
    powUp.wPos.splice   ( index, 1 ); 
    powUp.text.splice   ( index, 1 ); 
    powUp.active.splice ( index, 1 ); 

    
    powUp.prevSize = powUp.size;
    powUp.size--;
    powUp.lastElem--;
    
	}
	
	else if( type === "bullet" ) {
	
    // bullet.wPos.splice( index, num );
    // bullet.pos.splice	( index, num );
    // bullet.col.splice	( index, num );
    // bullet.text.splice( index, num );
    // bullet.active.splice( index, num );

		console.log("destroy:", index );
		bullet.active[index] = false;
		if( bullet.lastElem === index)
			for( let i = index-1; i >= 0; --i )
				if( g_text[i].active )
					bullet.lastElem = i;
    bullet.size--;
	
  }
	
	else if( type === "gun" ) {
		console.log("TODO helpers/destroyObj");
	}
	
	else if( type === "text" ) {
		g_text[ index ] = null;
		textLastElem--;
	}

}


function clearText( ) {
	
	g_text.splice( 0, g_text.length );
	textLastElem = 0;
	
}


function clearButtons( ) {
	
	buttonsData.splice( 0, buttonsData.length );
	buttonsLastElem = 0;
	
}


function CalculateTextDimentions( character, scale ) {
	
	let x, y, z;
	let start, end;

	for( let i = 0; i < charArr.length; i++ ) {

		if( charArr[i] === character ) {
			return{
				x: ( charEnd[i] - charStart[i] ) * scale,
				y: CHAR_HEIGHT  * scale /2 ,
				z: CHAR_DEPTH  * scale /2 ,
			};
		}
	}
}


function powerUp( type, index ) {

	if( type === "balls" ) {
		
    let numBalls = 1;
    
		for( let i = 0; i < numBalls; i++ ) {
			for( let j = 0; j < MAX_BALLS; j++ ) {
				if( !ball.active[j] ) {
          
					ball.xdir[j] = -ball.xdir[ j-1 ];
					ball.ydir[j] = 1;
					
					ball.amtx[j] = Math.random( ) *1.3 +0.3;
					ball.amty[j] = Math.random( ) *1.3 +0.3;
					
					ball.col[j] = COLOR_ARRAY[ Math.floor( Math.random( ) *COLOR_ARRAY.length ) ];
					ball.pos[j]   = [ blx, bly, blz ];
					ball.scale[j]		= [ 1.0, 1.0, 1.0 ];
					ball.text[j]  = BALL_STANDARD;
					
					initPositions( "ball", j );
					ball.active[j] = true;
					
					ball.changed[0] = true;
					ball.changed[POSBUF]  = true;
					ball.changed[COLBUF]  = true;
					ball.changed[TEXTBUF] = true;
					
					ball.size++;
					
					inBallsMode = true;
          
					break;
				}
			}	
		}
    return;
	} 
	if(  type === "scale" ) {
		if( !inScaleMode )
			scalePlayer( );
		return;
	}
	else if(  type === "gun" && !inGunMode ) {
    createGun( ); 
    return;                              
  }	
  else if(  powUp.name[ index ] === "powerBall" && 
            !inPowerBallMode && !inBallsMode ) {
		setTimeout( function( ) { 
                  inPowerBallMode = false; 
                }, 3000 );
    inPowerBallMode = true;
    return;
  }
  else if(  type === "life" ) {
		lives += 1;
    TextUi_livesNum( );
		return;
	}
  else if(  type === "points" ) {
		score.modifier *= 1.1;console.log("!!!")
    score.modifier += 1.0;
    Text_modNum( powUp.wPos[ index ][0],
                 powUp.wPos[ index ][1] +1.2, 
                 1.0, "x" 	)
     TextUi_stageScoreNum( );
     TextUi_modNum( false );
		return;
	}
  else if(  type === "shield" ) {
		createShield( );
		return;
	}
  
}


function scalePlayer( id ) {
	
	let xScale = 1;
	inScaleMode = true;
	
	plScale = [ 1.5, 1.0, 1.0 ];
	plx *= 1.5;
	setTimeout( function( ) { plScale = [ 1.0, 1.0, 1.0 ]; plx /= 1.5; }, 10000 );
	setTimeout( function( ) { inScaleMode = false }, 10003 );
	//let id = setInterval( function( ) { plScale = [ xScale += 0.03, 1.0, 1.0 ] }, 50 );
	//setTimeout( clearInterval( id ), 30000 );
	//setTimeout( function( ) { plScale = [ 1.0, 1.0, 1.0 ] }, 9000 );
	
}


/* function gameOver( ) {
	
	clear( );
	GAME_STATE = SHOW_GAMEOVER; console.log("SHOW_GAMEOVER");
	
	let _word = "GAME OVER";
	text[0] = {
		size: _word.length,
		color: WHITE,
		alpha: new Float32Array( [ 1.0, 1.0, 1.0, 1.0 ] ),
		display: true
	};
	text[0].word = CreateText( _word, [ 0.0, 0.0, 0.0 ], 10.0, text[0].color );
	textLastElem++;
	//console.log(text.length);
	
} */


function culcDeltaTime( ) {
  
	// time.curr = Date.now() * 0.001;  
	time.delta = time.curr - time.prev;
	time.accum += time.delta;
	time.prev = time.curr;
	time.cnt++;
}


function addArrays( arr1, arr2) {

	let out = [ ];

		out[0] = arr1[0] + arr2[0];
		out[1] = arr1[1] + arr2[1];
		out[2] = arr1[2] + arr2[2];

	
	return out;
	
}


function multVec3ByFactor( arr, factor ) {
	
	let out = new Array(3);
	
	 out[0] = arr[0] *factor;
	 out[1] = arr[1] *factor;
	 out[2] = arr[2] *factor;
	
	return out;
	
}


function delay( timeInSec ) { 
	
	let i = Date.now() * 0.001;
	let j = i;

	while(  i < j + timeInSec ){
		i = Date.now() * 0.001;
	}
}


function timer(  ) {
  
  if( currTime >= time1s.set + time1s.val ) {
    time1s.set = currTime;
    time1s.is = true;
    
    if( currTime >= time150Ms.set + time150Ms.val ) {
      time150Ms.set = currTime;
      time150Ms.is = true;
      
      if( currTime >= time50Ms.set + time50Ms.val ) {
        time50Ms.set = currTime;
        time50Ms.is = true;
      
      }
      else time50Ms.is = false;
    }
    else time150Ms.is = false;
  }
  else time1s.is = false;

}


function quickSort( arr, low, high ) {
  
  if( low < high ){
    let p = partition( arr, low, high );
    quickSort( arr, low, p );
    quickSort( arr, p+1, high );
  }
  return arr;
}


function partition( arr, low, high ) {
  
    let pivot = arr[low];
    let i = low-1;
    let j = high+1;
    
    while( true ) {
      do {
        i++;
      }
      while( arr[i] < pivot);
      
      do {
        j--;
      }
      while( arr[j] > pivot);
  
      if( i >= j )
        return j;
  
      //swap A[i] with A[j]
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
}


function setPosition( orientation, width, scale ) {
  
  let x = 0;
  let y = 0;
  let z = 0;
  let offset = 10;
  
  if( orientation === "LU" ) {
    x = ALIGN.LEFT + offset + width;
    y = ALIGN.TOP - offset - ( CHAR_HEIGHT * scale );
  }
  else if( orientation === "LD" ) {
    x = ALIGN.LEFT + offset + width;
    y = ALIGN.BOTTOM + offset + ( CHAR_HEIGHT * scale );
  }
  else if( orientation === "RU" ) {
    x = ALIGN.RIGHT - offset - width;
    y = ALIGN.TOP - offset - ( CHAR_HEIGHT * scale );
  }
  else if( orientation === "RD" ) {
    x = ALIGN.RIGHT - offset - width;
    y = ALIGN.BOTTOM + offset + ( CHAR_HEIGHT * scale );
  }
  else  console.log( "Error Seting String Position. Invalid Orientation" );

  return [ x, y, z ];
  
}