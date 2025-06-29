export function quickSort(arr: number[], onProgress?: (step: number) => void): { sortedArray: number[], stepCount: number } {
      const newArr: number[] = structuredClone(arr)
      let stepCounter = 0
      console.log('\n[ALGORITHM] Array of length', arr.length, 'received from React')

      // Speed control: max 1000 steps per second
      const maxStepsPerSecond = 1000
      const minDelayMs = 1000 / maxStepsPerSecond

      function quickSortHelper(array: number[]): number[] {
            if (array.length <= 1) {
                  return array
            }

            stepCounter++
            
            // Report progress every step with speed control
            if (onProgress) {
                  onProgress(stepCounter)
                  // Add delay to control speed
                  const start = Date.now()
                  while (Date.now() - start < minDelayMs) {
                        // Busy wait to control speed
                  }
            }
            
            const pivot = array[Math.floor(array.length / 2)]
            const left = array.filter(x => x < pivot)
            const middle = array.filter(x => x === pivot)
            const right = array.filter(x => x > pivot)

            return [...quickSortHelper(left), ...middle, ...quickSortHelper(right)]
      }

      const result = quickSortHelper(newArr)
      console.log('[ALGORITHM] Final sorted array:', result)
      
      // Report final step count
      if (onProgress) {
            onProgress(stepCounter)
      }
      
      return { sortedArray: result, stepCount: stepCounter }
}