const LAUNCHPAD_GRID = [
  [11, 12, 13, 14, 15, 16, 17, 18], // Line 1
  [21, 22, 23, 24, 25, 26, 27, 28],
  [31, 32, 33, 34, 35, 36, 37, 38],
  [41, 42, 43, 44, 45, 46, 47, 48],
  [51, 52, 53, 54, 55, 56, 57, 58],
  [61, 62, 63, 64, 65, 66, 67, 68],
  [71, 72, 73, 74, 75, 76, 77, 78],
  [81, 82, 83, 84, 85, 86, 87, 88], // Line 8

  [1, 2, 3, 4, 5, 6, 7, 8], // Control bottom
  [91, 92, 93, 94, 95, 96, 97, 98], // Control top
  [10, 20, 30, 40, 50, 60, 70, 80], // Control left
  [19, 29, 39, 49, 59, 69, 79, 89], // Control right
];

export const LAUNCHPAD_COLOR = {
  black: 0,
  grey: 1,
  light_grey: 2,
  white: 3,
  bright_red: 4,
  red: 5,
  dark_red: 6,
  darker_red: 7,
  bright_orange: 8,
  orange: 9,
  dark_orange: 10,
  darker_orange: 11,
  light_brown: 10,
  brown: 11,
  bright_yellow: 12,
  yellow: 13,
  dark_yellow: 14,
  darker_yellow: 15,
  lime: 17,
  green: 21,
  turquoise: 25,
  cyan: 33,
  light_blue: 37,
  blue: 41,
  deep_blue: 45,
  violet: 49,
  magenta: 53,
  pink: 57,
};

// Variables

let midiInput;
let midiOutput;

let currentAnimationLoops = [];

// Functions

export function launchPadInit(input, output) {
  console.debug("Init LaunchPad");

  midiInput = input;
  midiOutput = output;
}

export function launchPadGetTile(tile) {
  console.debug("Get Tile", tile);

  // Check if the tile is valid
  if (tile < 0 || tile > 127) throw new Error("Invalid tile");

  for (let x = 0; x < LAUNCHPAD_GRID.length; x++) {
    for (let y = 0; y < LAUNCHPAD_GRID[x].length; y++) {
      const xtile = LAUNCHPAD_GRID[x][y];

      if (tile === xtile) return { x: x, y: y };
    }
  }
  return null;
}

export function launchPadSetTile(tile, color, time) {
  console.debug("Set Tile", tile, color, time);

  midiOutput.channels[1].sendNoteOn(tile, { rawAttack: color, time: time });
}

export function launchPadSetTileAt(x, y, color, time) {
  console.debug("Set Tile At", x, y, color, time);

  if (x < 0 || y < 0 || !(x < LAUNCHPAD_GRID.length && y < 8)) throw new Error("Invalid position");
  if (color > 127) throw new Error("Invalid color");
  launchPadSetTile(LAUNCHPAD_GRID[x][y], color, time);
}

export function launchPadDraw(grid) {
  console.debug(grid);

  // for (const key in object) {
  //     if (Object.prototype.hasOwnProperty.call(object, key)) {
  //         const element = object[key];

  //     }
  // }

  // grid.forEach((row, x) => {
  //     if (typeof x !== "number") return;
  //     row.forEach((tile_color, y) => {
  //         if (typeof tile_color !== "number") return;
  //         launchPadSetTile(x, y, tile_color, null);
  //     });
  // });

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const color = grid[x][y];
      if (typeof color !== "number") return;
      launchPadSetTileAt(x, y, color, null);
    }
  }
}

export function launchPadClear() {
  console.debug("Clear LaunchPad");

  if (currentAnimationLoops.length !== 0) launchPadStopAnimation();

  for (const row of LAUNCHPAD_GRID) for (const tile of row) midiOutput.channels[1].sendNoteOff(tile);
}

export function launchPadStartAnimation(animation, interval, repeat) {
  console.debug("Start Animation");

  const loop = {
    animation: animation,
    interval: interval,
    repeat: repeat,

    usedFunction: animation,
    loop: null,
    iteration: 0,
    frame: 0,
  };

  // Start a frame driven animation
  if (typeof animation === "object")
    loop.usedFunction = (frame) => {
      launchPadDraw(loop.animation[frame]);
      frame++;
      if (frame >= animation.length) frame = 0;
      return frame;
    };

  loop.frame = loop.usedFunction(loop.frame);

  loop.loop = setInterval(() => {
    if (loop.frame === null) {
      clearInterval(loop.loop);
      currentAnimationLoops.splice(currentAnimationLoops.indexOf(loop), 1);
      return;
    }
    if (loop.frame === 0) loop.iteration++;
    if (loop.iteration >= loop.repeat) {
      clearInterval(loop.loop);
      currentAnimationLoops.splice(currentAnimationLoops.indexOf(loop), 1);
      launchPadClear();
      return;
    }

    loop.frame = loop.usedFunction(loop.frame);
  }, loop.interval);
  currentAnimationLoops.push(loop);
}

export function launchPadStopAnimation(animation) {
  console.debug("Stop Animation");

  // Stop a specific animation
  if (typeof animation !== "undefined") {
    for (const loop of currentAnimationLoops)
      if (loop.animation === animation) {
        clearInterval(loop.loop);
        currentAnimationLoops.splice(currentAnimationLoops.indexOf(loop), 1);

        launchPadClear();
        return true;
      }
    // Animation not found
    return false;
  }
  // Stop all animations
  for (const loop of currentAnimationLoops) clearInterval(loop.loop);
  currentAnimationLoops = [];

  launchPadClear();
  return true;
}

export const PAD_CONTROLS = {
  bottom: [1, 2, 3, 4, 5, 6, 7, 8],
  top: [91, 92, 93, 94, 95, 96, 97, 98],
  left: [10, 20, 30, 40, 50, 60, 70, 80],
  right: [19, 29, 39, 49, 59, 69, 79, 89],

  padRecordArm: 1,
  padTrackSelect: 2,
  padMute: 3,
  apdSolo: 4,
  padVolume: 5,
  padPan: 6,
  padSends: 7,
  padStopClip: 8,

  padRecord: 10,
  padDouble: 20,
  padDuplicate: 30,
  padQuantise: 40,
  padDelete: 50,
  padUndo: 60,
  padClick: 70,
  padShift: 80,

  padScene1: 19,
  padScene2: 29,
  padScene3: 39,
  padScene4: 49,
  padScene5: 59,
  padScene6: 69,
  padScene7: 79,
  padScene8: 89,

  padUp: 91,
  padDown: 92,
  padLeft: 93,
  padRight: 94,
  padSession: 95,
  padNote: 96,
  padDevice: 97,
  padUser: 98,
};

export const PAD_TILES = {
  fullGrid: [
    11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45,
    46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82,
    83, 84, 85, 86, 87, 88,
  ],
  halfBottom: [
    11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45,
    46, 47, 48,
  ],
  halfTop: [
    51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85,
    86, 87, 88,
  ],
  halfLeft: [
    11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81,
    82, 83, 84,
  ],
  halfRight: [
    15, 16, 17, 18, 25, 26, 27, 28, 35, 36, 37, 38, 45, 46, 47, 48, 55, 56, 57, 58, 65, 66, 67, 68, 75, 76, 77, 78, 85,
    86, 87, 88,
  ],
  bottomLeft: [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44],
  topLeft: [51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84],
  bottomRight: [15, 16, 17, 18, 25, 26, 27, 28, 35, 36, 37, 38, 45, 46, 47, 48],
  topRight: [55, 56, 57, 58, 65, 66, 67, 68, 75, 76, 77, 78, 85, 86, 87, 88],
};
