#!/usr/bin/env zx
import midi from "midi";
import { DecodeStream } from "@lachenmayer/midi-messages";
import { spawn } from "child_process";
import isRunning from 'is-running'
import treeKill from 'tree-kill'

const formatJSONOutput = (jsonData) => {
  const keysAndValues = Object.keys(jsonData).map((key) => {
    let value = jsonData[key];

    if (typeof value === "object") {
      // Recurse on Objects
      value = `${formatJSONOutput(value)}\n`;
    }

    return `${chalk.blue(key)}: ${chalk.yellowBright(value)}`;
  });

  return `{ ${keysAndValues.join(", ")} }`;
};

const packageJson = JSON.parse(await fs.readFile(`${__dirname}/package.json`));
const midiConfigs = packageJson["midi"];

const MIDI_PORT = process.env.MIDI_PORT || 1;

const input = new midi.Input();
const decode = new DecodeStream();

input.on("message", async (deltaTime, message) => decode.write(message));

let currentProcess = null;
// Handle responding to the Data
decode.on("data", async (data) => {
  console.log(formatJSONOutput(data));

  /** @todo add logic for handling controls maybe? */
  if (
    midiConfigs[data.type] == undefined ||
    midiConfigs[data.type][data.note] == undefined
  ) {
    return false;
  }

  if (currentProcess) {
    console.log(`\nA current process already is assigned.  Checking if it is running...\n`)

    if(isRunning(currentProcess.pid)) {
      console.log("Process is running with PID of " + currentProcess.pid + '\n');
      console.log(`Killing process PID ${currentProcess.pid}\n`);

      treeKill(currentProcess.pid, console.log)
    } 
    
    console.log('The process is no longer running.  Running new process for ' + chalk.blue(midiConfigs[data.type][data.note]) + '\n')
  }

  const [command, ...args] = midiConfigs[data.type][data.note].split(' ')
  currentProcess = spawn(command, args)
  currentProcess.stdout.pipe(process.stdout)
});

input.openPort(MIDI_PORT);

process.on("SIGINT", () => {
  console.log(
    chalk.red(`Exiting the appliction & closing MIDI port ${MIDI_PORT}...`)
  );
  input.closePort(MIDI_PORT);
});
