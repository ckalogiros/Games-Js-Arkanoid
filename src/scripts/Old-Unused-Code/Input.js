"use strict";
import { ScenesLoadScene } from '../App/Scenes.js'
import { CreateBrick } from '../Drawables/Brick.js'



// export function OnMouseMove(event) {

//   mouseX = ((event.clientX - window.innerWidth / 2));
//   mouseY = -(((event.clientY - window.innerHeight / 2)));
//   // console.log(mouseX);
//   //console.log(mouseY);

//   // if (GAME_STATE === MENU_MAIN) { // Enlarge text on hover
//   //   for (let i = PLAY_TEXT; i < buttonsLastElem; ++i) {
//   //     if (mouseX > buttonsData[i].pos[0] - buttonsData[i].width &&
//   //       mouseX < buttonsData[i].pos[0] + buttonsData[i].width &&
//   //       mouseY > buttonsData[i].pos[1] - buttonsData[i].height &&
//   //       mouseY < buttonsData[i].pos[1] + buttonsData[i].height) {

//   //       g_text[i].isUpScalable = true;
//   //       g_text[i].isDownScalable = false;

//   //     }
//   //     else {
//   //       g_text[i].isUpScalable = false;
//   //       g_text[i].isDownScalable = true;
//   //     }

//   //   }
//   // }
//   // else if (GAME_STATE & MODE_CREATIVE) {

//   //   for (let i = 0; i < buttonsData.length; i++) {

//   //     if (mouseX > buttonsData[i].pos[0] - buttonsData[i].width &&
//   //       mouseX < buttonsData[i].pos[0] + buttonsData[i].width &&
//   //       mouseY > buttonsData[i].pos[1] - buttonsData[i].height &&
//   //       mouseY < buttonsData[i].pos[1] + buttonsData[i].height) {

//   //       g_text[i].isUpScalable = true;
//   //       g_text[i].isDownScalable = false;
//   //     }
//   //     else {
//   //       g_text[i].isUpScalable = false;
//   //       g_text[i].isDownScalable = true;
//   //     }


//   //     if (mouseX > RIGHT - 30) {
//   //       showMenu = true;
//   //       g_text[i].display = true;
//   //     }
//   //     else if (mouseX < RIGHT - g_text[0].dimentions[0] * 1.3) {
//   //       showMenu = false;
//   //       g_text[i].display = false
//   //     }
//   //   }
//   // }

// }

export function OnMouseClick(event) {

  if (GAME_STATE & MENU_MAIN) { // Main Menu Selection

    g_text[PLAY_TEXT].display = true;
    g_text[OPTIONS_TEXT].display = true;
    g_text[UPGRADE_TEXT].display = true;

    for (let i = PLAY_TEXT; i <= OPTIONS_TEXT; ++i) {

      if (mouseX > buttonsData[i].pos[0] - buttonsData[i].width &&
        mouseX < buttonsData[i].pos[0] + buttonsData[i].width &&
        mouseY > buttonsData[i].pos[1] - buttonsData[i].height &&
        mouseY < buttonsData[i].pos[1] + buttonsData[i].height) {

        switch (i) {

          case PLAY_TEXT: // 0
            g_text[OPTIONS_TEXT].display = false;
            ScenesLoadScene(case_startGame);
            break;

          case UPGRADE_TEXT: // 1
            //console.log("UPGRADE MENU");
            break;

          case OPTIONS_TEXT: // 2
            //console.log("OPTIONS MENU");
            break;

        }

        // Undisplay Main Menu text
        for (let j = PLAY_TEXT; j <= OPTIONS_TEXT; ++j)
          g_text[j].display = false;
      }
    }
  }
  else if (GAME_STATE & SHOW_STAGENUM) {

    GAME_STATE = (MODE_GAME | GAME_UNPAUSED);
    //console.log("MODE_GAME | GAME_UNPAUSED");

    // Show all the already created ui's (score.curr,lives etc)...
    for (let i = 0; i < g_text.length; i++) {
      if (i >= UI_LIVES_TEXT && i <= UI_TOTAL_SCORE_NUM)
        g_text[i].display = true;
      else
        g_text[i].display = false;

    }
  }
  else if (GAME_STATE === (MODE_GAME | GAME_UNPAUSED)) {

    if (startBall === false) {
      startBall = true;
      return;
    }
    else if (startBall === true && inGunMode === true) {
      createBullet();
      return;
    }
  }
  else if (GAME_STATE & SHOW_STAGECOMPLETED) {

    GAME_STATE = SCREEN_SHOWSCORE; console.log("SCREEN_SHOWSCORE");

    g_text[STAGE_NUM].display = false;
    g_text[STAGE_COMPLETION].display = false;
    g_text[UI_SCORE_NUM].display = true;
    g_text[UI_SCORE_TEXT].display = true;
    g_text[UI_TOTAL_SCORE_NUM].display = true;

  }
  else if (GAME_STATE & SCREEN_SHOWSCORE) {

    if (score.curr > 0) {
      score.total += score.curr;
      score.curr = 0;
    }
    else {

      GAME_STATE = MENU_MAIN; console.log("MENU_MAIN");

      for (let i = 0; i < g_text.length; i++) {
        if (i <= OPTIONS_TEXT)
          g_text[i].display = true;
        else
          g_text[i].display = false;
      }
      ScenesLoadScene(case_mainMenu);

    }
  }
  else if (GAME_STATE & MODE_CREATIVE) {

    let textureIndexOffset = 1;

    for (let i = 0; i < buttonsData.length; i++) {
      // Only if menu is showing pick a new textures
      if (showMenu &&
        mouseX > buttonsData[i].pos[0] - buttonsData[i].width &&
        mouseX < buttonsData[i].pos[0] + buttonsData[i].width &&
        mouseY > buttonsData[i].pos[1] - buttonsData[i].height &&
        mouseY < buttonsData[i].pos[1] + buttonsData[i].height) {

        if (i >= textureIndexOffset)
          activeTexture = i - textureIndexOffset;
        else {
          if (i === 0) {
            GAME_STATE = MENU_MAIN; console.log("MENU_MAIN");
            clearText();
            clearButtons();
            // CreateStartMenu( );
            ScenesLoadScene(case_mainMenu);
            return;
          }
          else if (i === 1) {
            //ToDo
          }
        }
        break;
      }
    }

    if (!showMenu) // Place new brick when creative menu is not showing
      CreateBrick(null, activeTexture);
  }

}

export function keyReleased(event) {

  /// 32 = 'SPACE', 80 = 'P';
  if (event.keyCode === 80 || event.keyCode === 32) {

    if (GAME_STATE === (MODE_GAME | GAME_UNPAUSED)) {
      GAME_STATE = MODE_GAME | GAME_PAUSED;		//console.log("PAUSED");
    }
    else if (GAME_STATE === (MODE_GAME | GAME_PAUSED)) {
      GAME_STATE = MODE_GAME | GAME_UNPAUSED; //console.log("UNPAUSED");
    }
  }
}

export function keyPressed(event) {

  // Zz = 90 122
  if (event.keyCode === 90 || event.keyCode === 122) {
    console.log("***************");
    for (let i = 0; i < br.size; ++i)
      console.log(br.gridIndex[i], br.type[i]);
  }
  /*
    if( event.keyCode === 88 || event.keyCode === 120  ) {
      curv.xPlus = true;
    }  */

  if (GAME_STATE === MODE_CREATIVE) {
    // Xx = 88 120
    if (event.keyCode === 88 || event.keyCode === 120) {
      if (br.size > 0)
        destroyBrickFree();
    }
    // 1 = 49
    if (event.keyCode === 49) {
      let unbreakable = [37, 38, 47, 50, 57, 62];
      let sandStone = [15, 16, 25, 26, 28, 27, 35, 36,
        39, 40, 45, 46, 48, 49, 51, 52,
        55, 56, 58, 61, 63, 64, 66, 75];
      CreateBrick(unbreakable, 3);
      CreateBrick(sandStone, 1);
    }
    // 2 = 50
    if (event.keyCode === 50) {
      let bricks = [];

      for (let i = 0; i < grid.active.length; ++i) {
        bricks[i] = i;
      }

      CreateBrick(bricks, 1);

    }

  }

}
