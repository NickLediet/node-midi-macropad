# Creating a macropad for triggering build commands with a midi controller

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Intro & Why

This project is a proof-of-concept that you can easily create a macro pad in node.js using a midi controller (in my case a [KOMPLETE KONTROL M32](https://www.native-instruments.com/en/products/komplete/keyboards/komplete-kontrol-m32/)).  Specifically I wanted to explore how well a high-level runtime like node.js handles midi and hopefully one day, sound. My goal is to try to turn it into an article (hense the verbosity of this README) or a YouTube tutorial. I also hope to explore the scanner/logger feature in more depth and offer it as a cli for scanning midi input. 

So why did I make this generally useless script? Chaos mostly.  I have been playing with streams in node.js while also trying to learn about analog and digital synthesizers.  At some point the fact that audio waves and streams really aren't any different, and midi worked as a really easy way to get my feet wet with the hardware side before trying to learn to actually encode audio data.  Who knows, maybe the logical conclusion for this POC is to become a DAW written in Node. 


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

From there it is as simple as just reading the matching data from package.json and spawning a process from the provided command.  We also maintain a reference to the last spawned process to kill it should it still exist when we try to spawn another process.  **This means that macros/scripts triggered are not parallel**. 







