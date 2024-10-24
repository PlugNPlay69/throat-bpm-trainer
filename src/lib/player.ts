import { ref, computed } from "vue";
import * as Tone from "tone";

export function usePlayer() {
  const synth = new Tone.Synth().toDestination();
  // Set the default BPM
  Tone.getTransport().bpm.value = 1;

  // Define a loop to play a sound once every beat.
  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease("C4", "24n", time);
  }, "4n"); // '4n' means one loop per quarter note

  const running = ref(false);
  let stopSpeedChange: any = null;
  let stopClock: any = null;

  Tone.getTransport().bpm.rampTo(currentBpm.value, 3);

  let currentBlock: Block | null = null;

  const playBlock = (block: Block) => {
    switch (block.type) {
      case BlockType.BPM:
        if (currentBlock == null || currentBlock.type != BlockType.BPM) {
          loop.start();
          Tone.getTransport().start();
        }

        Tone.getTransport().bpm.value = block.bpm!;
        break;
      case BlockType.Pause:
        if (currentBlock == null) {

        }
      case BlockType.Hold:
        throw new Error("not implemented yet");
    }

    currentBlock = block;
  }

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
