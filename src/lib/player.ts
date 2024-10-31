import { ref, computed } from "vue";
import * as Tone from "tone";
import { clamp, sleep } from "./utils";
import { Block, BlockType } from "../lib/block.ts";

export function usePlayer() {
  const ensureLoopRunning = (loop: Tone.Loop, running: boolean) => {
    if (running) {
      if (loop.state == "stopped")
        loop.start();
    } else {
      if (loop.state == "started")
        loop.stop();
    }
  }

  const playBlock = (block: Block, loop: Tone.Loop) => {
    console.log("Playing Block: " + JSON.stringify(block))
    switch (block.type) {
      case BlockType.BPM:
        ensureLoopRunning(loop, true);
        Tone.getTransport().start();
        Tone.getTransport().bpm.rampTo(block.bpm!, clamp(block.durationS / 5, 1, 5));
        break;
      case BlockType.Break:
        Tone.getTransport().pause();
        break;
      case BlockType.Hold:
        throw new Error("not implemented yet");
    }
  }

  const playBlocks = async (blocks: Block[]) => {
    const synth = new Tone.Synth().toDestination();
    // Set the default BPM
    Tone.getTransport().bpm.value = 60;

    // Define a loop to play a sound once every beat.
    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease("C4", "24n", time);
    }, "4n"); // '4n' means one loop per quarter note

    const running = ref(true);
    const currentBlock = ref(0);

    while (running.value) {
      console.log("we loopin boy")
      const block = blocks[currentBlock.value];
      playBlock(block, loop);
      await sleep(block.durationS * 1000);
      if (currentBlock.value == blocks.length - 1) { currentBlock.value = 0; }
      else { currentBlock.value++; }
    }

    const stop = () => running.value = false;

    return { stop, currentBlock };
  }

  return {
    playBlocks
  }

  let stopSpeedChange: any = null;
  let stopClock: any = null;

  const toggle = () => {
    if (running.value) {
      running.value = false;
      loop.stop();
      Tone.getTransport().stop();
      clearInterval(stopSpeedChange);
      clearInterval(stopClock);
      return;
    }

    loop.start(0);
    // Start the transport (this starts the whole timing system)
    Tone.getTransport().start();

    stopSpeedChange = setInterval(() => {
      goToRandomBpm();
    }, speedChangeInterval.value * 1000);
    goToRandomBpm();

    currentSecond.value = 0;
    stopClock = setInterval(() => {
      currentSecond.value++;
      if (currentSecond.value >= durationSeconds.value) {
        toggle();
      }
    }, 1000);

    running.value = true;
  };
}
