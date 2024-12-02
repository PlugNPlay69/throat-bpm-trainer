import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Ref, watchEffect } from "vue";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function sleep(ms: number, shouldSleep?: Ref<boolean>) {
  /** Sleeps for a certain duration asynchronously. Can be cancelled
   * anytime by passing a boolean Vue ref and then setting that to false.
   * If the ref is already false, the sleep is canceled immediately.
   *
   * THROWS AN ERROR WHEN CANCELLED! Returns without value if not.
   */
  return new Promise((resolve, reject) => {
    if (shouldSleep?.value === false) {
      // if we're already canceled, reject immediately
      reject(new Error("Canceled; shouldSleep was already false"));
    }

    // resolve after specified duration
    const timeoutObj = setTimeout(resolve, ms);

    if (shouldSleep != null) {
      const handle = watchEffect(() => {
        // if shouldSleep changes to false, cancel
        if (!shouldSleep.value) {
          clearTimeout(timeoutObj);
          reject(new Error("Canceled; shouldSleep switched to false"));
          handle.stop();
        }
      })
    }
  });
}

export function sleepUntilValue<T>(value: Ref<T>, target: T, shouldSleep?: Ref<boolean>): Promise<void> {
  /** Sleeps until the passed value is changed to a specific target. Resolves immediately if value==target.
   * Can be cancelled anytime by passing a boolean Vue ref and then setting that to false.
   * If the ref is already false, the sleep is canceled immediately.
   *
   * THROWS AN ERROR WHEN CANCELLED! Returns without value if not.
   */

  return new Promise((resolve, reject) => {
    if (shouldSleep?.value === false) {
      // if we're already canceled, reject immediately
      reject(new Error("Canceled; shouldSleep was already false"));
    }

    // resolve immediately when already matching
    if (value.value == target) {
      resolve();
    }

    const untilHandle = watchEffect(() => {
      if (value.value == target) {
        console.log("Changed to " + value.value)
        resolve();
        untilHandle.stop();
      }
    })

    if (shouldSleep != null) {
      const stopHandle = watchEffect(() => {
        // if shouldSleep changes to false, cancel
        if (!shouldSleep.value) {
          untilHandle.stop();
          reject(new Error("Canceled; shouldSleep switched to false"));
          stopHandle.stop();
        }
      })
    }
  })
}
