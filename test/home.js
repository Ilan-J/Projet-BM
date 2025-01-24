import { WebMidi } from "./iife/webmidi.iife.js";
import { launchPadClear, launchPadDraw, launchPadInit, launchPadStartAnimation } from './launchPad.js';
import { randomInt } from "./util.js";
import { fish } from "./animations/fish.js";
import { victory } from "./animations/victory.js";
import { countdown } from "./animations/countdouwn.js";
import { digits } from './animations/digits.js';
import { explosion } from './animations/explosion.js';
import { simonstart } from "./simon.js";

// Variables

let midiInput = WebMidi.inputs[1];
let midiOutput = WebMidi.outputs[1];

// Program start

// Enable WEBMIDI.js and trigger the onEnabled() function when ready
document.addEventListener('DOMContentLoaded', evt => {
    WebMidi
    .enable({sysex: true})
    .then(onEnabled)
    .catch(err => alert(err));
});

// Functions

function onEnabled() {
    console.log("WebMidi enabled!");
    
    if (WebMidi.inputs.length < 1) {
        console.log("No device detected.");
    } else {
        WebMidi.inputs.forEach((device, index) => {
            console.log(`Device ${index}: ${device.name}`)
        });
        displayIOSelection();
    }
}

function onError(err) {
    console.error(err)
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
        return
    }

    midiInput = WebMidi.inputs[io];
    midiOutput = WebMidi.outputs[io];

    console.log(`Select input: ${midiInput.name}`);
    console.log(`Select output: ${midiOutput.name}`);
}

function startGame() {
    console.log("START GAME");

    launchPadInit(midiInput, midiOutput);
    
    midiInput.channels[1].addListener("noteon", evt => {
        // midiOutput.channels[1].sendNoteOn(e.note.number, { rawAttack: 87});
        midiOutput.channels[1].sendNoteOn(evt.note.number, { rawAttack: randomInt(0, 127)});
    });
    midiInput.channels[1].addListener("noteoff", evt => {
        midiOutput.channels[1].sendNoteOff(evt.note.number);
    });

    document.querySelector('#touch').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();

        midiInput.channels[1].addListener("noteon", evt => {
            // midiOutput.channels[1].sendNoteOn(e.note.number, { rawAttack: 87});
            midiOutput.channels[1].sendNoteOn(evt.note.number, { rawAttack: randomInt(0, 127)});
        });
        midiInput.channels[1].addListener("noteoff", evt => {
            midiOutput.channels[1].sendNoteOff(evt.note.number);
        });    
    });

    document.querySelector('#digit-0').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[0]);
    });
    document.querySelector('#digit-1').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[1]);
    });
    document.querySelector('#digit-2').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[2]);
    });
    document.querySelector('#digit-3').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[3]);
    });
    document.querySelector('#digit-4').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[4]);
    });
    document.querySelector('#digit-5').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[5]);
    });
    document.querySelector('#digit-6').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[6]);
    });
    document.querySelector('#digit-7').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[7]);
    });
    document.querySelector('#digit-8').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[8]);
    });
    document.querySelector('#digit-9').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadDraw(digits[9]);
    });

    document.querySelector('#simon').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        simonstart(midiInput, midiOutput);
    });

    document.querySelector('#explosion').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadStartAnimation(explosion, 100);
    });

    document.querySelector('#fish').addEventListener('click', evt => {
        midiInput.channels[1].removeListener();
        launchPadClear();
        launchPadStartAnimation(fish, 200);
    });






    // midiOutput.channels[1].sendNoteOn(10, { rawAttack: 7})

    const PAD_ONE = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,3,3,0,0,0],
        [0,0,0,3,3,0,0,0],
        [3,0,0,3,3,0,0,3],
        [3,0,0,3,3,0,0,3],
        [0,0,3,3,3,0,0,0],
        [0,0,0,3,3,0,0,0],     
        [0,0,0,0,0,0,0,0],
    ];

    launchPadDraw(PAD_ONE);









    

    // setTimeout(() => launchPadDraw(midiOutput, five), 0);
    // setTimeout(() => launchPadDraw(midiOutput, four), 1000);
    // setTimeout(() => launchPadDraw(midiOutput, three), 2000);
    // setTimeout(() => launchPadDraw(midiOutput, two), 3000);
    // setTimeout(() => launchPadDraw(midiOutput, one), 4000);

    // setTimeout(() => launchPadClear(), 2000);

    // drawAnimation(midiOutput, countdown, 1000);

    // launchPadDraw(midiOutput, digits[9]);

    // setTimeout(() => drawAnimation(midiOutput, digits, 100), 1000);


    // setTimeout(() => drawAnimation(midiOutput, explosion, 100), 1000);


    // setTimeout(() => drawAnimation(midiOutput, fish, 200), 50000);



    // setTimeout(() => drawAnimation(midiOutput, victory, 200), 7000);


    // while (true) {
    //     for (let index = 0; index < PAD_CONTROLS.bottom.length; index++) {
    //         const control = PAD_CONTROLS.bottom[index];
    //         midiOutput.playNote(control, { duration: 100, rawAttack: 5 })
    //     }
    // }
}
