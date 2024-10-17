<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import PWABadge from "./components/PWABadge.vue";

import * as Tone from "tone";

import { ref, computed } from "vue";

const currentBpm = ref(0);
const minBpm = ref(12);
const maxBpm = ref(120);
const durationMinutes = ref(2);
const durationSeconds = computed(() => durationMinutes.value * 60);
const currentSecond = ref(0);
const clockFace = computed(() => {
  const minute = Math.floor((durationSeconds.value - currentSecond.value) / 60);
  const second = (durationSeconds.value - currentSecond.value) % 60;

  return (
    String(minute).padStart(2, "0") + ":" + String(second).padStart(2, "0")
  );
});
const speedChangeInterval = ref(20);

const synth = new Tone.Synth().toDestination();

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Set the default BPM
Tone.getTransport().bpm.value = 60;

// Define a loop to play a sound once every beat.
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "24n", time);
}, "4n"); // '4n' means one loop per quarter note

const running = ref(false);
let stopSpeedChange = null;
let stopClock = null;

const goToRandomBpm = () => {
  const old = currentBpm.value;
  currentBpm.value = randomIntFromInterval(minBpm.value, maxBpm.value);
  Tone.getTransport().bpm.rampTo(currentBpm.value, 3);
};

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
</script>

<template>
  <p>Min BPM</p>
  <input v-model="minBpm" type="number" min="6" max="300" />
  <p>Max BPM</p>
  <input v-model="maxBpm" type="number" min="6" max="300" />
  <p>Speed Change Interval (s)</p>
  <input v-model="speedChangeInterval" type="number" min="5" max="60" />
  <p>Duration (min)</p>
  <input v-model="durationMinutes" type="number" min="1" />

  <h3>Time Remaining: {{ clockFace }}</h3>
  <h3>BPM {{ currentBpm }}</h3>

  <button @click="toggle()">{{ running ? "Stop" : "Start" }}</button>
</template>

<style scoped></style>
