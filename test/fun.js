
function chaser(button) {
    const buttons = [1,2,3,4,5,6,7,8,19,29,39,49,59,69,79,89,98,97,96,95,94,93,92,91,80,70,60,50,40,30,20,10];
    
    if (button < 0) {
        button = buttons.length -1;
    } else if (button >= buttons.length) {
        button = 0;
    }

    midiOutput.channels[1].sendNoteOn(buttons[button], { rawAttack: 5 });
    midiOutput.channels[1].sendNoteOn(buttons[button], { rawAttack: 6, time: "+100" });
    midiOutput.channels[1].sendNoteOn(buttons[button], { rawAttack: 7, time: "+200" });
    midiOutput.channels[1].sendNoteOff(buttons[button], { time: "+300" });

    button += 1;
    setTimeout(chaser, 100, button);
}
