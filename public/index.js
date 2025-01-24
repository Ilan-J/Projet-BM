// import { WebMidi } from "./iife/webmidi.iife.js";
import {
  LAUNCHPAD_COLOR,
  launchPadClear,
  launchPadDraw,
  launchPadInit,
  launchPadSetTile,
  launchPadStartAnimation,
} from "./launchpad/launchPad.js";
import { randomInt } from "./util/random.js";
import { fish } from "./launchpad/animations/fish.js";
import { digits } from "./launchpad/digits.js";
import { explosion } from "./launchpad/animations/explosion.js";
import { LAUNCHPAD_LOCK } from "./launchpad/images/lock.js";

// Variables

let midiInput;
let midiOutput;

// Program start

// Enable WEBMIDI.js and trigger the onEnabled() function when ready
document.addEventListener("DOMContentLoaded", (evt) => {
  WebMidi.enable({ sysex: true })
    .then(onEnabled)
    .catch((err) => onError(err));
});

// Functions

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
  startGame();
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

function startGame() {
  console.log("START GAME");

  launchPadInit(midiInput, midiOutput);
  launchPadClear();

  midiInput.channels[1].addListener("noteon", (evt) => {
    // midiOutput.channels[1].sendNoteOn(e.note.number, { rawAttack: 87});
    midiOutput.channels[1].sendNoteOn(evt.note.number, {
      rawAttack: randomInt(0, 127),
    });
  });
  midiInput.channels[1].addListener("noteoff", (evt) => {
    midiOutput.channels[1].sendNoteOff(evt.note.number);
  });

  document.querySelector("#touch").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();

    midiInput.channels[1].addListener("noteon", (evt) => {
      // midiOutput.channels[1].sendNoteOn(e.note.number, { rawAttack: 87});
      midiOutput.channels[1].sendNoteOn(evt.note.number, {
        rawAttack: randomInt(0, 127),
      });
    });
    midiInput.channels[1].addListener("noteoff", (evt) => {
      midiOutput.channels[1].sendNoteOff(evt.note.number);
    });
  });

  document.querySelector("#test").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(LAUNCHPAD_LOCK[1]);
  });

  document.querySelector("#digit-0").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[0]);
  });
  document.querySelector("#digit-1").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[1]);
  });
  document.querySelector("#digit-2").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[2]);
  });
  document.querySelector("#digit-3").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[3]);
  });
  document.querySelector("#digit-4").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[4]);
  });
  document.querySelector("#digit-5").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[5]);
  });
  document.querySelector("#digit-6").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[6]);
  });
  document.querySelector("#digit-7").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[7]);
  });
  document.querySelector("#digit-8").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[8]);
  });
  document.querySelector("#digit-9").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadDraw(digits[9]);
  });

  document.querySelector("#fish").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadStartAnimation(fish, 150);
  });

  document.querySelector("#explosion").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadStartAnimation(explosion, 100);
  });

  document.querySelector("#chaser").addEventListener("click", (evt) => {
    midiInput.channels[1].removeListener();
    launchPadClear();
    launchPadStartAnimation(chaser, 100);
  });

  // midiOutput.channels[1].sendNoteOn(10, { rawAttack: 7})

  // launchPadDraw(PAD_ONE);
}

function chaser(button) {
  const buttons = [
     1,  2,  3,  4,  5, 6,  7,  8,
    19, 29, 39, 49, 59, 69, 79, 89,
    98, 97, 96, 95, 94, 93, 92, 91,
    80, 70, 60, 50, 40, 30, 20, 10,
  ];

  launchPadSetTile(buttons[button], LAUNCHPAD_COLOR.red);
  launchPadSetTile(buttons[button], LAUNCHPAD_COLOR.dark_red,   "+100");
  launchPadSetTile(buttons[button], LAUNCHPAD_COLOR.darker_red, "+200");
  launchPadSetTile(buttons[button], LAUNCHPAD_COLOR.black,      "+300");

  button++;
  if (button < 0) button = buttons.length - 1;
  else if (button >= buttons.length) button = 0;
  return button;
}
