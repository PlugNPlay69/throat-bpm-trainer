<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { ref, computed } from "vue";

const model = defineModel<number>();
const sliderValue = computed<number[]>({
  get() {
    return [model.value];
  },
  set(newVal) {
    model.value = newVal[0];
  },
});

const props = defineProps<{
  text: string;
  min: number;
  max: number;
  step: number;
}>();
</script>

<template>
  <div class="grid gap-3">
    <div class="flex items-center justify-between">
      <Label for="val">{{ text }}</Label>
      <span class="text-sm text-muted-foreground">
        {{ model }}
      </span>
    </div>
    <Slider
      id="val"
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :aria-label="text"
    />
  </div>
</template>
