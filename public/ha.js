import {
  LAUNCHPAD_COLOR,
  launchPadClear,
  launchPadInit,
  launchPadSetTile,
  launchPadStartAnimation,
  launchPadStopAnimation,
} from "./launchpad/launchPad.js";

// Constants

const ws = new WebSocket("ws://homeassistant-ilan:8123/api/websocket");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2YTVhMDA1MDkwZjg0YjI4OTRhZDBhNDJjZjIxODVmNSIsImlhdCI6MTczNzY0NDczMCwiZXhwIjoyMDUzMDA0NzMwfQ.R9Exwhr5Uh0WawUXQ65rmW7YWUr6iR5R5FuspRFAgG4";

// Variables

let midiInput;
let midiOutput;

let wsState = "connecting";
let wsId = 0;

// Startup

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
  ws.close();
  alert(err);
}

function displayIOSelection() {
  console.log("IO SELECTION");

  selectIO();
  startHa();
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

function startHa() {
  console.log("Starting Home Assistant");
  launchPadInit(midiInput, midiOutput);
  launchPadClear();

  startPadEvents();
}

function startPadEvents() {
  midiInput.channels[1].addListener("noteon", (evt) => {
    console.log(evt);
    ws.send(
      JSON.stringify({
        id: wsId++,
        type: "fire_event",
        event_type: "launchpad_note_on",
        event_data: {
          note: evt.note.number,
          velocity: evt.velocity,
        },
      })
    );
  });
  midiInput.channels[1].addListener("noteoff", (evt) => {
    console.log(evt);
    ws.send(
      JSON.stringify({
        id: wsId++,
        type: "fire_event",
        event_type: "launchpad_note_off",
        event_data: {
          note: evt.note.number,
          velocity: evt.velocity,
        },
      })
    );
  });
}

function subscibeToWSEvents() {
  console.log("Subscribing to WS events");

  console.debug("Subscribing to trigger");
  console.debug(wsId);
  ws.send(
    JSON.stringify({
      id: wsId++,
      type: "subscribe_trigger",
      trigger: {
        platform: "state",
        entity_id: "input_boolean.alarm_maison",
        from: "off",
        to: "on",
      },
    })
  );
  console.debug("Subscribing to events");
  console.debug(wsId);
  ws.send(
    JSON.stringify({
      id: wsId++,
      type: "subscribe_events",
    })
  );
}

function handleWSEvent(event) {
  console.log("WS Event", event);
  switch (event.event_type) {
    case "launchpad_tile_on":
      launchPadSetTile(event.data.tile, event.data.color, `+${event.data.time}`);
      break;
    case "launchpad_tile_off":
      launchPadSetTile(event.data.tile, LAUNCHPAD_COLOR.black, `+${event.data.time}`);
      break;
    case "launchpad_clear":
      launchPadClear();
      break;
    case "launchpad_animation":
      handleAnimaionRequest(event.data.animation, event.data.interval, event.data.repeat);
      break;
    case "launchpad_start_animation":
      launchPadStartAnimation(event.data.animation, event.data.interval, event.data.repeat);
      break;
    case "launchpad_stop_animation":
      launchPadStopAnimation();
      break;
    case "state_changed":
      console.log("State changed", event.data.entity_id, event.data.new_state.state);
      break;
    default:
      break;
  }
}

function handleAnimaionRequest(animation, interval, repeat) {
  if (typeof animation === "object") {
    console.log("Start animation", animation, interval, repeat);
    launchPadStartAnimation(animation, interval, repeat);
  } else if (typeof animation === "string") {
    console.log("Start animation", animation, interval, repeat);
    switch (animation) {
      case "clear":
        launchPadClear();
        break;
      default:
        console.error("Invalid animation request");
        break;
    }
  } else console.error("Invalid animation request");
}

// WebSocket Events

ws.addEventListener("open", function open() {
  console.log("Connected to the WebSocket server");
  wsState = "connected";
});

ws.addEventListener("message", function incoming(msg) {
  console.log("Received:", msg);
  const data = JSON.parse(msg.data);

  switch (wsState) {
    case "connecting":
    case "connected":
      if (data.type === "auth_required") {
        console.log("Authenticating with the WebSocket server");

        wsState = "authenticating";
        ws.send(
          JSON.stringify({
            type: "auth",
            access_token: token,
          })
        );
      }
      break;
    case "authenticating":
      if (data.type === "auth_ok") {
        console.log("Authenticated with the WebSocket server");
        wsState = "authenticated";

        subscibeToWSEvents();
      }
      if (data.type === "auth_invalid") {
        console.error("Authentication failed:", data.message);
        wsState = "error";
        ws.removeEventListener();
      }
      break;
    case "authenticated":
      if (data.type === "event") handleWSEvent(data.event);
      break;
    default:
      break;
  }
});

ws.addEventListener("close", function close() {
  console.log("Disconnected from the WebSocket server");
  midiInput.channels[1].removeListener();
});

ws.addEventListener("error", function error(err) {
  console.error("WebSocket error:", err);
  midiInput.channels[1].removeListener();
});
