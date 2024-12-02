import { ref, watch } from "vue";
import * as Tone from "tone";
import { clamp, sleep, sleepUntilValue } from "./utils";
import { Block, BlockType } from "../lib/block.ts";

export function usePlayer() {
  const isRunning = ref(false);
  const blocks = ref([] as Block[]);
  const currentBlock = ref(null as (null | number));
  const currentCount = ref(0);

  // ensure currentBlock is always in range or null
  watch(blocks, (blocks, _prev) => {
    if (currentBlock.value == null) {
      return;
    }
    if (!blocks) {
      currentBlock.value = null;
    }

    currentBlock.value = clamp(currentBlock.value!, 0, blocks.length);
  });

  const ensureLoopRunning = (loop: Tone.Loop, running: boolean) => {
    if (running) {
      if (loop.state == "stopped")
        loop.start();
    } else {
      if (loop.state == "started")
        loop.stop();
    }
  }

  const resetTone = () => {
    Tone.getTransport().stop();
    Tone.getTransport().bpm.value = 60;
  };

  const playBlock = (block: Block, loop: Tone.Loop) => {
    // TODO maybe don't switch on type but do polymorphism
    console.log("Playing Block: " + JSON.stringify(block))
    const transport = Tone.getTransport();
    switch (block.type) {
      case BlockType.BPM:
        ensureLoopRunning(loop, true);
        transport.start();
        const bpm = block.bpm!;
        if (bpm > transport.bpm.value) {
          transport.bpm.rampTo(bpm, clamp(block.durationS ?? 5 / 5, 1, 5));
        } else {
          transport.bpm.value = bpm;
        }

        break;
      case BlockType.Break:
        transport.pause();
        break;
      case BlockType.Hold:
        throw new Error("not implemented yet");
    }
  }

  const start = async () => {
    if (isRunning.value) {
      return;
    }

    resetTone();
    isRunning.value = true;

    const synth = new Tone.Synth().toDestination();

    if (currentBlock.value == null) {
      currentBlock.value = 0;
    }

    // Define a loop to play a sound once every beat.
    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease("C4", "24n", time);
      currentCount.value++;
    }, "4n"); // '4n' means one loop per quarter note

    while (isRunning.value) {
      currentCount.value = 0;
      const block = blocks.value[currentBlock.value];
      playBlock(block, loop);

      try {
        if (block.nTotal) {
          await sleepUntilValue(currentCount, block.nTotal, isRunning);
        } else if (block.durationS) {
          await sleep(block.durationS * 1000, isRunning);
        }
      }
      catch (e) {
        console.log((e as Error)?.message);
        break;
      }

      if (currentBlock.value == blocks.value.length - 1) { currentBlock.value = 0; }
      else { currentBlock.value++; }
    }

    // cleanup
    ensureLoopRunning(loop, false);
    resetTone();
  };

  const stop = () => {
    isRunning.value = false;
  };

  return { start, stop, isRunning, currentBlock, blocks };
}

