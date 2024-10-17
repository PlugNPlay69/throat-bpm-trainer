<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import PWABadge from "./components/PWABadge.vue";

import * as Tone from "tone";

import { ref } from "vue";

const currentBpm = ref(0);
const minBpm = ref(0);
const maxBpm = ref(200);

const synth = new Tone.Synth().toDestination();

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Set the default BPM
Tone.getTransport().bpm.value = 60;

// Define a loop to play the sound at each beat (e.g., every quarter note '4n')
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "24n", time);
}, "4n"); // '4n' means one loop per quarter note

const running = ref(false);
const toggle = () => {
  if (running.value) {
    running.value = false;
    loop.stop();
    return;
  }

  currentBpm.value = randomIntFromInterval(minBpm.value, maxBpm.value);

  // Start the loop
  loop.start(0);

  // Start the transport (this starts the whole timing system)
  Tone.getTransport().start();

  setTimeout(() => {
    Tone.getTransport().bpm.rampTo(120, 5);
  }, 5000);

  setTimeout(() => {
    loop.stop();
    // Tone.getTransport().stop()
  }, 15000);

  setTimeout(() => {
    loop.start();
    // Tone.getTransport().stop()
  }, 20000);

  // setInterval(() => {
  //   synth.triggerAttackRelease("C4", "4n");
  // }, currentBpm.value);

  running.value = true;
};
</script>

<template>
  <input v-model="minBpm" type="number" />
  <input v-model="maxBpm" type="number" />

  <button @click="toggle()">{{ running ? "Stop" : "Start" }}</button>
</template>

<style scoped></style>
