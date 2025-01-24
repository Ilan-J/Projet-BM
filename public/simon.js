import {
  PAD_TILES,
  PAD_CONTROLS,
  launchPadGetTile,
  launchPadSetTileAt,
  launchPadSetTile,
  LAUNCHPAD_COLOR,
  launchPadInit,
  launchPadClear,
  launchPadDraw,
} from "./launchpad/launchPad.js";
//import {notes,sound} from "./public/rosy/music.js"
import { ONE_P, TWO_P, FOUR_P, CLEAR } from "./simon/playerSelection.js";
// Variables

const noteA = new Audio('./rosy/mp3Notes/a5.mp3');
const noteA2 = new Audio('./rosy/mp3Notes/a-5.mp3');
const noteG = new Audio('./rosy/mp3Notes/g5.mp3');
const noteG2 = new Audio('./rosy/mp3Notes/g-5.mp3');
const noteC = new Audio('./rosy/mp3Notes/c5.mp3');
const noteC2 = new Audio('./rosy/mp3Notes/c-5.mp3');
const noteD = new Audio('./rosy/mp3Notes/d5.mp3');
const noteF = new Audio('./rosy/mp3Notes/f5.mp3');
const noteB = new Audio('./rosy/mp3Notes/b5.mp3');

let midiOutput;
let midiInput;
let start = 0;
let page = 0;
let xMax;
let yMax;
let nbnote = 249;
let level = nbnote - 2;
let tableau = [1, 2, 3];
let rep = [1, 2, 3];
let mistake = 0;
let cube = 15;
let end = 10000;

const greensqr = [46, 47, 56, 57];
const redsqr = [42, 43, 52, 53];
const whitesqrL = [41, 51];
const whitesqrR = [48, 58];
const confirmqsr = [14, 15];

// Startup

// Enable WEBMIDI.js and trigger the onEnabled() function when ready
document.addEventListener("DOMContentLoaded", (evt) => {
  WebMidi.enable({ sysex: true })
    .then(onEnabled)
    .catch((err) => onError(err));
});

function onEnabled() {
  console.log("WebMidi enabled!");

  if (WebMidi.inputs.length < 1) {
    console.log("No device detected.");
  } else {
    WebMidi.inputs.forEach((device, index) => {
      console.log(`Device ${index}: ${device.name}`);
    });
    displayIOSelection();
  }
}

function onError(err) {
  console.error(err);
  alert(err);
}

function displayIOSelection() {
  console.log("IO SELECTION");

  selectIO();
  gameStart();
}

function selectIO(evt) {
  console.log("SELECT IO");

  const io = 1;

  if (io < 0 || io >= WebMidi.inputs.length) {
    console.error("Selection out of range");
    return;
  }

  midiInput = WebMidi.inputs[io];
  midiOutput = WebMidi.outputs[io];

  console.log(`Select input: ${midiInput.name}`);
  console.log(`Select output: ${midiOutput.name}`);
}

function gameStart() {
  console.log("starting :3");

  midiOutput.sendClock();
  midiOutput.sendReset();
  launchPadInit(midiInput, midiOutput);
  launchPadClear();
  level = nbnote - 2;

  if (start === 0) {
    cube = playerselect();
    start = 1;
  }

  if (cube === null) return;
}

function andYouFailed() {
  console.log("fail");
  midiOutput.channels[1].sendNoteOn(42, { rawAttack: 5 });
  midiOutput.channels[1].sendNoteOn(43, { rawAttack: 5 });
  midiOutput.channels[1].sendNoteOn(52, { rawAttack: 5 });
  midiOutput.channels[1].sendNoteOn(53, { rawAttack: 5 });
  midiOutput.channels[1].sendNoteOn(46, { rawAttack: 21 });
  midiOutput.channels[1].sendNoteOn(47, { rawAttack: 21 });
  midiOutput.channels[1].sendNoteOn(56, { rawAttack: 21 });
  midiOutput.channels[1].sendNoteOn(57, { rawAttack: 21 });

  for (let i = 0; i < 8; i++) {
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.bottom[i], { rawAttack: 5 });
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.top[i], { rawAttack: 5 });
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.left[i], { rawAttack: 5 });
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.right[i], { rawAttack: 5 });
  }

  for (let i = 0; i < 8; i++) {
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.bottom[i], {
      rawAttack: 0,
      time: "+600",
    });
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.top[i], {
      rawAttack: 0,
      time: "+600",
    });
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.left[i], {
      rawAttack: 0,
      time: "+600",
    });
    midiOutput.channels[1].sendNoteOn(PAD_CONTROLS.right[i], {
      rawAttack: 0,
      time: "+600",
    });
  }
  midiInput.channels[1].addListener("noteoff", (evt) => {
    const key = evt.note.number;
    for (const green of greensqr)
      if (key === green) {
        simonstart();
        midiInput.channels[1].removeListener();
        return;
      }
    for (const red of redsqr)
      if (key === red) {
        console.log("gamestopped");
        launchPadClear();
        window.location = "/";
        midiInput.channels[1].removeListener();
        return;
      }
  });
}

function youWinBitch() {
  level--;
  levelstarter();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function levelstarter() {
  launchPadDraw(CLEAR);
  for (let index = 0; index < nbnote - level; index++) {
    setTimeout(() => {
      if (cube === 63) {
        launchPadSetTileAt(tableau[index].x, tableau[index].y, 41, null);
        //notes[index].play();    
        launchPadSetTileAt(tableau[index].x, tableau[index].y, 0, "+500");
      } else if (cube === 31) {
        launchPadSetTileAt(tableau[index].x, tableau[index].y, 5, null);
        //notes[index].play();
        launchPadSetTileAt(tableau[index].x, tableau[index].y, 0, "+500");
        launchPadSetTileAt(tableau[index].x + 4, tableau[index].y, 41, null);
        launchPadSetTileAt(tableau[index].x + 4, tableau[index].y, 0, "+500");
      } else if (cube === 15) {
        launchPadSetTileAt(tableau[index].x, tableau[index].y, 5, null);
        //notes[index].play();
        launchPadSetTileAt(tableau[index].x, tableau[index].y, 0, "+500");
        launchPadSetTileAt(tableau[index].x + 4, tableau[index].y, 41, null);
        launchPadSetTileAt(tableau[index].x + 4, tableau[index].y, 0, "+500");
        launchPadSetTileAt(tableau[index].x + 4,tableau[index].y + 4,13,null);
        launchPadSetTileAt(tableau[index].x + 4,tableau[index].y + 4,0,"+500");
        launchPadSetTileAt(tableau[index].x, tableau[index].y + 4, 21, null);
        launchPadSetTileAt(tableau[index].x, tableau[index].y + 4, 0, "+500");
      }
    }, index * 1000);
  }
  setTimeout(checkin, (nbnote - level) * 1000);
}
function checkin(index) {
  if (typeof index !== "number") index = 0;

  if (index >= nbnote - level) {
    setTimeout(youWinBitch, 1000);
    return;
  }

  let firstKeyPos;

  midiInput.channels[1].addOneTimeListener("noteon", (evt) => {
    console.log(evt);
    //notes[index].play();
    const key = evt.note.number;
    firstKeyPos = launchPadGetTile(key);
    launchPadSetTile(key, LAUNCHPAD_COLOR.white); 
  });

  midiInput.channels[1].addListener("noteoff", (evt) => {
    console.log("test dummy");
    const key = evt.note.number;
    const keyPos = launchPadGetTile(key);

    if (firstKeyPos === undefined) return;
    if (keyPos.x !== firstKeyPos.x || keyPos.y !== firstKeyPos.y) return;
    midiInput.channels[1].removeListener();

    if (keyPos.x === tableau[index].x && keyPos.y === tableau[index].y) {
      launchPadSetTile(key, LAUNCHPAD_COLOR.green);
      launchPadSetTile(key, LAUNCHPAD_COLOR.black, "+500");

      index++;
      checkin(index);
    } else {
      launchPadSetTile(key, LAUNCHPAD_COLOR.red);
      launchPadSetTile(key, LAUNCHPAD_COLOR.black, "+300");
      launchPadSetTile(key, LAUNCHPAD_COLOR.red, "+600");
      launchPadSetTile(key, LAUNCHPAD_COLOR.black, "+900");

      setTimeout(andYouFailed, 1000);
    }
  });
}
function playerselect() {
  switch (page) {
    case 0:
      launchPadDraw(ONE_P);
      break;
    case 1:
      launchPadDraw(TWO_P);
      break;
    case 2:
      launchPadDraw(FOUR_P);
      break;
    default:
      throw new Error("Invalid page");
  }
  midiInput.channels[1].addOneTimeListener("noteoff", (evt) => {
    const key = evt.note.number;
    for (const greener of confirmqsr)
      if (key === greener) {
        switch (page) {
          case 0:
          xMax = 7;
          yMax = 7;
          cube = 63;
          break;
          
          case 1:
            xMax = 4;
            yMax = 7;
            cube = 31;
          break;
          
          case 2:
            xMax = 4;
            yMax = 4;
            cube = 15;
          break;
          default:
            throw new Error("Invalid page");
        }
        simonstart();
        return;
      }
    for (const whiter of whitesqrR)
      if (key === whiter) {
        page++;
        if (page > 2) page = 0;
      }
    for (const whitel of whitesqrL)
      if (key === whitel) {
        page--;
        if (page < 0) page = 2;
      }
    playerselect();
  });
}
function nbp() {
  let nbpl = prompt(
    "how many player 1, 2 or 4 ? if you put anything else i will ask again~ >:3"
  );
  switch (Number.parseInt(nbpl)) {
    case 1:
      xMax = 7;
      yMax = 7;
      return 63;
    case 2:
      xMax = 3;
      yMax = 7;
      return 31;
    case 4:
      xMax = 3;
      yMax = 3;
      return 15;
    case null:
      return null;
    default:
      console.log(nbpl);
      return nbp();
  }
}

export function simonstart() {
  launchPadClear();
  level = nbnote - 2;

  for (let j = 0; j < nbnote; j++) {
    tableau[j] = {
      x: getRandomInt(xMax),
      y: getRandomInt(yMax),
    };
  }

  console.log(tableau);

  setTimeout(levelstarter, 1000);
}

//midiInput.channels[1].addListener("noteon", e => {
//midiOutput.channels[1].sendNoteOn(e.note.number, { rawAttack: 5})
//});
//midiInput.channels[1].addListener("noteoff", e => {
//midiOutput.channels[1].sendNoteOff(e.note.number)
//});

// DO NOT USE WIP
function waitForKeys(keys, callback, illuminate) {
  if (typeof keys === "number") keys = [keys];
  else if (typeof keys !== "object") throw new Error("Invalid argument");

  let firstKey;

  if (illuminate)
    midiInput.channels[1].addOneTimeListener("noteon", (evt) => {
      console.log(evt);

      const key = evt.note.number;
      firstKey = key;
      midiOutput.channels[1].sendNoteOn(key, { rawAttack: 3 });
    });

  midiInput.channels[1].addListener("noteoff", (evt) => {
    console.log("test dummy");
    const key = evt.note.number;

    if (key !== firstKey) return;

    midiInput.channels[1].removeListener();
    callback(key);
  });
}
