<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import LabeledSlider from "./components/LabeledSlider.vue";

import { ref, computed } from "vue";

const currentBpm = ref(0);
const bpm = ref([12, 120]);
const minBpm = computed(() => bpm.value[0]);
const maxBpm = computed(() => bpm.value[1]);

const breakDurationS = ref(10);
const breakEvery = ref(2);

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

const goToRandomBpm = () => {
  currentBpm.value = randomIntFromInterval(minBpm.value, maxBpm.value);
};

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
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
      text="Break Duration (s)"
      v-model="breakDurationS"
      :min="5"
      :max="60"
      :step="5"
    />

    <LabeledSlider
      text="Break every"
      v-model="breakInterval"
      :min="0"
      :max="30"
      :step="1"
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

  <PWABadge />
</template>

<style scoped></style>
