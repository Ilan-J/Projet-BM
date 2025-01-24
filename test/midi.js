// import { WebMidi } from "./iife/webmidi.iife";

// Enable WEBMIDI.js and trigger the onEnabled() function when ready
WebMidi
    .enable({sysex: true})
    .then(onEnabled)
    .catch(err => alert(err));

// Function triggered when WEBMIDI.js is ready
function onEnabled() {
    console.log("WebMidi enabled!")

    const idiv = document.querySelector('#midi-input');

    if (WebMidi.inputs.length < 1) {
        idiv.innerHTML+= "No device detected.";
    } else {
        WebMidi.inputs.forEach((device, index) => {
            idiv.innerHTML+= `${index}: ${device.name} <br>`;
        });
    }

    const mySynth = WebMidi.inputs[1];
    // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")
    
    mySynth.channels[1].addListener("noteon", e => {
        idiv.innerHTML+= `${e.note.number} <br>`;
    });

    outputTest();
}

function outputTest() {
    const odiv = document.querySelector('#midi-output');
    
    if (WebMidi.outputs.length < 1) {
        odiv.innerHTML += "No device detected.";
    } else {
        WebMidi.outputs.forEach((device, index) => {
            odiv.innerHTML += `${index}: ${device.name} <br>`;
        });
    }

    const mySynth = WebMidi.outputs[1];

    mySynth.channels[1].sendNoteOn(0, { rawAttack: 5 })


    // randomTile();











    // mySynth.sendNrpnValue([2, 63], [0, 10], { channels: 1 });




    // console.log(mySynth.state);
    // mySynth.send()
    
    mySynth.sendNoteOn(91, { channels: 1, rawAttack: 5 });


    // const msg = new Message();

    // mySynth.send();

    mySynth.sendNoteOn(11, { channels: 2, rawAttack: 0, time: '+500' });
}

function randomTile() {
    const mySynth = WebMidi.outputs[1];


    const note = PAD_NOTES[randomInt(0, PAD_NOTES.length)];
    const color = randomInt(0, 127);

    mySynth.playNote(note, { channels: 1, rawAttack: color});

    setTimeout(randomTile, randomInt(100, 800));
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}
