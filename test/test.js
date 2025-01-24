let midiOutput;
let midiInput;

let tableau = [ 11 ];

function bonk(index) {
    if (index >= tableau.length)
        setTimeout(youWinBitch, 500);

    midiInput.channels[1].addOneTimeListener('noteon', evt => {
        const key = evt.note.number;
        midiOutput.channels[1].sendNoteOn(key, {rawAttack:3});//rawr~
    });

    midiInput.channels[1].addOneTimeListener('noteoff', evt => {
        console.log("test dummy");
        const key = evt.note.number;

        if (key === tableau[index]) {
            midiOutput.channels[1].sendNoteOn(key, {rawAttack:21});
            midiOutput.channels[1].sendNoteOff(key, {time:'+500'});

            index++;
            bonk(index);// YOUR ON TIME OUT GO TO THE CORNER-evil kitty
        } else {
            midiOutput.channels[1].sendNoteOn(key, {rawAttack:5});
            midiOutput.channels[1].sendNoteOff(key, {time:'+300'});
            midiOutput.channels[1].sendNoteOn(key, {rawAttack:5,time:"+600"});
            midiOutput.channels[1].sendNoteOff(key, {time:'+900'});

            setTimeout(andYouFailed, 900);
        }
    });
} //this is fucking witchcraft
