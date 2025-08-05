export function insertionSort(arr: number[], onProgress?: (step: number) => void): { sortedArray: number[], stepCount: number } {
      const newArr: number[] = structuredClone(arr)
      let stepCounter = 0
      console.log('\n[ALGORITHM] Array of length', arr.length, 'received from React')

      for (let i = 1; i < newArr.length; i++) { // iterate through each element once
            stepCounter++
            
            // Report progress every step
            if (onProgress) {
                  onProgress(stepCounter)
            }
            
            console.log('\nstepCounter:',stepCounter)
            console.log('Current array:', [ ...newArr ])
            const currentValue = newArr[ i ]
            let j = i - 1
            console.log(`Inserting ${ currentValue } into sorted portion`)

            // TODO record state, selecting element(s)

            while (j >= 0 && newArr[ j ] > currentValue) { // iterate through elements next to current element
                  console.log(`Shifting ${ newArr[ j ] } to the right`)

                  // TODO record state, comparing values

                  newArr[ j + 1 ] = newArr[ j ]
                  j--
            }

            newArr[ j + 1 ] = currentValue
            console.log("New array:", newArr)

            // TODO record state, after swapping elements
      }

      // TODO record state, final state

      console.log("\n[ALGORITHM] Final sorted array:", newArr)
      
      // Report final step count
      if (onProgress) {
            onProgress(stepCounter)
      }
      
      return { sortedArray: newArr, stepCount: stepCounter }
}

import { SortingStep } from './bubbleSort'

// Animated version of insertion sort that yields each step
export function* insertionSortAnimated(arr: number[]): Generator<SortingStep, void, unknown> {
      const newArr: number[] = [...arr]
      const completed: Set<number> = new Set([0]) // First element is always "sorted"
      let stepCounter = 0

      for (let i = 1; i < newArr.length; i++) {
            stepCounter++
            
            // Step 1: Select the current element to insert
            yield {
                  array: [...newArr],
                  selecting: i,
                  completed: Array.from(completed),
                  stepCount: stepCounter,
                  isComplete: false
            }

            // Step 2: Bubble the element leftward by swapping until it finds its place
            let currentPos = i
            
            while (currentPos > 0 && newArr[currentPos - 1] > newArr[currentPos]) {
                  stepCounter++
                  
                  // Show comparison
                  yield {
                        array: [...newArr],
                        comparing: [currentPos - 1, currentPos],
                        selecting: currentPos,
                        completed: Array.from(completed),
                        stepCount: stepCounter,
                        isComplete: false
                  }

                  stepCounter++
                  
                  // Show swapping
                  yield {
                        array: [...newArr],
                        swapping: [currentPos - 1, currentPos],
                        completed: Array.from(completed),
                        stepCount: stepCounter,
                        isComplete: false
                  }

                  // Perform the swap
                  const temp = newArr[currentPos - 1]
                  newArr[currentPos - 1] = newArr[currentPos]
                  newArr[currentPos] = temp
                  currentPos--
                  
                  stepCounter++
                  
                  // Show post-swap state
                  yield {
                        array: [...newArr],
                        selecting: currentPos,
                        completed: Array.from(completed),
                        stepCount: stepCounter,
                        isComplete: false
                  }
            }

            // If we still need to compare with the leftmost element but don't need to swap
            if (currentPos > 0) {
                  stepCounter++
                  
                  // Show final comparison where we stop
                  yield {
                        array: [...newArr],
                        comparing: [currentPos - 1, currentPos],
                        selecting: currentPos,
                        completed: Array.from(completed),
                        stepCount: stepCounter,
                        isComplete: false
                  }
            }

            // Step 3: Element is now in its final position
            // Mark this element as completed (all elements 0 to i are now sorted)
            completed.add(i)
            
            stepCounter++

            // Show that we've finished processing this element
            yield {
                  array: [...newArr],
                  completed: Array.from(completed),
                  stepCount: stepCounter,
                  isComplete: false
            }
      }

      // Yield final completed state
      yield {
            array: [...newArr],
            completed: Array.from(completed),
            stepCount: stepCounter,
            isComplete: true
      }
}