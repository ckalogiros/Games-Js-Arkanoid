"use strict";
// import { CreateText, CalculateTextDimentions } from '../Drawables/Text.js'



// function RegisterFps() {

//   fps.sum += fps.cur;
//   fps.clock++;

//   if (time1s.is) {
//     fps.avg = fps.sum / fps.clock;
//     fps.sum = 0;
//     fps.clock = 0;
//   }
//   newFps.innerHTML = "TimeMesure: " + 1 / fps.avg;
// }

// function Ui() {

//   // Frame ui
//   if (timePerFrame > 0.0 && timePerFrame < fpsMin &&
//     GAME_STATE & (MODE_GAME | GAME_UNPAUSED)) {
//     fpsMin = timePerFrame;
//   }
//   if (1 / time.delta < 300 &&
//     GAME_STATE & (MODE_GAME | GAME_UNPAUSED)) {
//     deltaMin = time.delta;
//   }

//   // fpsSum += timePerFrame;
//   fpsSum += time.delta;
//   deltaSum += time.delta;
//   deltaMinSum += deltaMin;


//   fpsCounter++;

//   if (time1s.is) {
//     // avg1Sec = fpsSum / time.cnt;
//     avg1Sec = time.accum / time.cnt;
//     // console.log('cnt:', time.cnt, ' FpsNode:', 1/avg1Sec)
//     console.log('cnt:', time.cnt, ' FpsNode:', 1/avg1Sec)
//     // avg1Sec = fpsSum / fpsCounter;

//     // Reset
//     // time.delta = 0;
//     // time.cnt   = 0;

//     avg2_1Sec = deltaSum / fpsCounter;
//     //avg2deltaMin_1Sec = deltaMinSum / fpsCounter;
//     fpsSum = 0;
//     deltaSum = 0;
//     //deltaMinSum = 0;
//     //deltaMin = 0;
//     fpsCounter = 0;

//   }

//   FpsNode.innerHTML = "FpsNode: " +
//     Math.floor(1 / avg1Sec) + " | " +
//     "Delta: " + Math.floor(1 / avg2_1Sec);

//   oddFr = !oddFr;
//   evenFr = !evenFr;

// }

// export function DisplayFps(fps) {

//   // Frame ui
//   if (timePerFrame > 0.0 && timePerFrame < fpsMin &&
//     GAME_STATE & (MODE_GAME | GAME_UNPAUSED)) {
//     fpsMin = timePerFrame;
//   }
//   if (1 / time.delta < 300 &&
//     GAME_STATE & (MODE_GAME | GAME_UNPAUSED)) {
//     deltaMin = time.delta;
//   }


//   if (time1s.is) {
//     // avg1Sec = fpsSum / time.cnt;
//     avg1Sec = fps.accum / fps.cnt;
//     // console.log('cnt:', time.cnt, ' FpsNode:', 1/avg1Sec)
//     // console.log('cnt:', fps.cnt, 'fps.accum:', fps.accum, ' FpsNode:', 1/avg1Sec)
//     // avg1Sec = fpsSum / fpsCounter;

//     // Reset
//     // time.delta = 0;
//     // time.cnt   = 0;

//     // avg2_1Sec = deltaSum / fpsCounter;
//     // //avg2deltaMin_1Sec = deltaMinSum / fpsCounter;
//     // fpsSum = 0;
//     // deltaSum = 0;
//     // //deltaMinSum = 0;
//     // //deltaMin = 0;
//     // fpsCounter = 0;

//   }

//   // FpsNode.innerHTML = "FpsNode: " +
//   //   Math.floor(1 / avg1Sec) + " | " +
//   //   "Delta: " + Math.floor(1 / avg1_1Sec);
//   FpsNode.innerHTML = "Fps: " + Math.floor(1 / avg1Sec);

//   oddFr = !oddFr;
//   evenFr = !evenFr;

// }


function TextUi_livesNum() {

  let _word = String(lives);
  let scale = 0.4;

  CreateText(UI_LIVES_NUM, _word,
    setPosition("LD", text[UI_LIVES_TEXT].dimentions[0], scale),
    scale, WHITE, true, "left");

}


function TextUi_stageScoreNum() {

  let _word = String(Math.floor(score.curr));
  let scale = 0.4;
  let offset = 5;

  CreateText(UI_SCORE_NUM, _word,
    setPosition("LU", text[UI_SCORE_TEXT].dimentions[0], scale),
    scale, WHITE, true, "left");

}


function TextUi_totalScoreNum() {

  let _word = "Total Score " + String(Math.floor(score.total));
  let position = [0.0, 0.0, 0.0];
  let scale = 0.8;
  let offset = 5;

  if (GAME_STATE === MENU_MAIN) {

    _word = "Total " + String(Math.floor(score.total));
    scale = 0.4;
    position = [RIGHT - offset, TOP - (CHAR_HEIGHT * scale) - offset, 0.0]

    CreateText(UI_TOTAL_SCORE_NUM, _word,
      setPosition("RU", 0, scale),
      scale, WHITE, true, "right");
  }
  else {

    CreateText(UI_TOTAL_SCORE_NUM, _word,
      [0.0, 0.0, 0.0],
      scale, WHITE, true, "center");
  }

  if (GAME_STATE & SCREEN_SHOWSCORE && score.curr > 0) {
    score.total += 1;
    score.curr -= 1;
  }

}


function TextUi_modNum(reset) {

  let _word = "x" + String(score.modifier.toFixed(1));
  let scale = 0.4;

  CreateText(UI_MOD_NUM, _word,
    setPosition("RD", 0, scale),
    scale, YELOW, true, "right");


  // Redraw UI_MOD_TEXT if UI_MOD_NUM > 10 || 100 || 1000
  // or if UI_MOD_NUM resets back to 1.0
  if (reset || score.modifier >= score.storedModifier * 10) {
    CreateText(UI_MOD_TEXT, "mod: ",
      setPosition("RD", text[UI_MOD_NUM].dimentions[0], scale),
      scale, WHITE, true, "right");
    score.storedModifier = score.modifier;
  }
}

// ToDo
// Create new score.total Mod to update only every 60 FpsNode
// if FpsNode > 60 set a global let hasChanged been checked in render
// so we don't miss a changed score.curr etc.

function Text_modNum(x, y, val, op) {

  let _word = op + val.toFixed(1);
  let color = [scoreModifier.red, scoreModifier.green, scoreModifier.blue, 1.0];
  let scale = 0.25;
  let found = inArr(_word, text, MOD_NUM1, text.length);

  if (!found) { // If found is false dont run 
    CreateText(textLastElem, _word, [x, y, 0.0], scale,
      color, true, "center");
    textLastElem++;
  }
  else { // Else create at the same index
    CreateText(found, _word, [x, y, 0.0], scale,
      color, true, "center");
  }

}


function inArr(val, arr, start, end) {

  if (arr[start].name === val) { // Check for MOD_NUM1 (0.1)
    return start;
  }
  else if (arr[start + 1].name === val) { // Check for MOD_NUM2 (1.0)
    return start + 1;
  }
  else {
    for (let i = start; i < end; ++i) {
      if (val === arr[i].name) {
        return (text[i].display ? false : i);
      }
    }
  }


  return false;
}



export function CreateMainMenuUi() {

  let pos = [0.0, CHAR_HEIGHT * 2 + 20, 0.0];
  let scale = 0.8;

  // Play button
  let _word = "Play";
  CreateText(PLAY_TEXT, _word, pos, scale, WHITE, true, "center");
  textLastElem++;
  buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
  BUTTON_STATE |= BUTTON_PLAY;


  // Upgrade button  
  _word = "Upgrade";
  pos = [0.0, CHAR_HEIGHT, 0.0];
  CreateText(UPGRADE_TEXT, _word, pos, scale, WHITE, true, "center");
  textLastElem++;
  buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
  BUTTON_STATE |= BUTTON_UPGRADE;


  // Options button  
  _word = "Options";
  pos = [0.0, -30.0, 0.0];
  CreateText(OPTIONS_TEXT, _word, pos, scale, WHITE, true, "center");
  textLastElem++;
  buttonsData[buttonsLastElem] = createButtons(_word, scale, pos);
  BUTTON_STATE |= BUTTON_OPTIONS;


  scale = 0.4;
  _word = "Lives ";
  CreateText(UI_LIVES_TEXT, _word,
    setPosition("LD", 0, scale),
    scale, WHITE, false, "left");
  textLastElem++;

  _word = "score ";
  CreateText(UI_SCORE_TEXT, _word,
    setPosition("LU", 0, scale),
    scale, WHITE, false, "left");
  textLastElem++;

  TextUi_modNum(false); textLastElem++;
  console.log
  _word = "mod: ";
  CreateText(UI_MOD_TEXT, _word,
    setPosition("RD", text[UI_MOD_NUM].dimentions[0], scale),
    scale, WHITE, false, "right");
  textLastElem++;


  TextUi_stageScoreNum(); textLastElem++;
  TextUi_livesNum(); textLastElem++;
  TextUi_totalScoreNum(); textLastElem++;

  _word = "Completed!";
  CreateText(STAGE_COMPLETION, _word, [0.0, 0.0, 0.0],
    scale, WHITE, false, "center");
  textLastElem++;

  _word = "Stage " + stageNum;
  CreateText(STAGE_NUM, _word, [0.0, 0.0, 0.0],
    scale, WHITE, true, "center");
  textLastElem++;

  // Cash mod 0.1
  scale = 0.2;
  _word = "+0.1";
  CreateText(MOD_NUM1, _word, [0.0, 0.0, 0.0], scale,
    WHITE, true, "center");
  textLastElem++;

  // Cash mod 1.0
  scale = 0.2;
  _word = "+1.0";
  CreateText(MOD_NUM2, _word, [0.0, 0.0, 0.0], scale,
    WHITE, true, "center");
  textLastElem++;

}