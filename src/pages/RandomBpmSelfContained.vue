<script setup lang="ts">
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import LabeledSlider from "@/components/LabeledSlider.vue";

import { ref, computed } from "vue";

const currentBpm = ref(0);
const bpm = ref([12, 120]);
const minBpm = computed(() => bpm.value[0]);
const maxBpm = computed(() => bpm.value[1]);

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

function randomIntFromInterval(min: number, max: number) {
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
let stopSpeedChange: any = null;
let stopClock: any = null;

const goToRandomBpm = () => {
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
  <div class="grid gap-5">
    <div class="grid gap-3">
      <div class="flex items-center justify-between">
        <Label for="bpm">BPM Range</Label>
        <span class="text-sm text-muted-foreground">
          {{ bpm[0] }} - {{ bpm[1] }}
        </span>
      </div>
      <Slider
        id="bpm"
        v-model="bpm"
        :min="5"
        :max="300"
        :step="5"
        aria-label="BPM Range"
      />
    </div>

    <LabeledSlider
      text="Speed Change Interval (s)"
      v-model="speedChangeInterval"
      :min="5"
      :max="60"
      :step="5"
    />

    <LabeledSlider
      text="Duration (min)"
      v-model="durationMinutes"
      :min="0.5"
      :max="10"
      :step="0.5"
    />

    <h3>Time Remaining: {{ clockFace }}</h3>
    <h3>BPM: {{ currentBpm }}</h3>

    <Button @click="toggle()">{{ running ? "Stop" : "Start" }}</Button>
  </div>
</template>

<style scoped></style>
