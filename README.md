# Creating a macropad for triggering build commands with a midi controller

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Intro & Why

## Setup & Configure

The configuration for binding to midi inputs is very simple. We simply need to setup a top level `"midi"` property in our projects `package.json`. You'll also want to include the `midi.js` file from this project.

Example `package.json` configuration:

```json
{
  "name": "midi-automation-example",
  "devDependencies": { // Required dependencies for `midi.mjs`
    "@lachenmayer/midi-messages": "^1.0.1",
    "is-running": "^2.1.0",
    "midi": "^2.0.0",
    "process-exists": "^5.0.0",
    "tree-kill": "^1.2.2",
    "zx": "^6.2.3"
  },
  "midi": {
    "NoteOff": { // This could also be `NoteOff`. Other midi message types are not currently supported
      "48": "echo 'test'",  // First C on my controller
      "49": "npm run start",// First C# on my controller
      "50": "npm run build" // First D on my controller
    }
  }
}
```

By running `./midi.mjs` without setting up configuration, the script will still provide logging with decoded midi messages to aid in figuring out the right message types and notes you need to use for your own keyboard.  You can then use the values to set up your own configuration

## How it works

Simply put, Midi is IO.  IO is streams.  Streams have events.  Get where I'm going?
In less vague terms, we setup a stream for listening to midi inputs with [node-midi](https://github.com/justinlatimer/node-midi) and we write incoming message to a stream for decoding midi data to something more human readble via the [@lachenmayer/midi-messages](https://github.com/lachenmayer/midi-messages) package.

From there is is as simple as just reading the matching data from package.json and spawning a process from the provided command.  







