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

            while (j >= 0 && newArr[ j ] > currentValue) { // iterate through elements next to current element
                  console.log(`Shifting ${ newArr[ j ] } to the right`)

                  newArr[ j + 1 ] = newArr[ j ]
                  j--
            }

            newArr[ j + 1 ] = currentValue
            console.log("New array:", newArr)
      }

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

      // Mark all elements as completed for final state
      for (let i = 0; i < newArr.length; i++) {
            completed.add(i)
      }

      // Yield final completed state
      yield {
            array: [...newArr],
            completed: Array.from(completed),
            stepCount: stepCounter,
            isComplete: true
      }
}

// Insertion Sort specific utilities
export const insertionSortUtils = {
      getBarColor: (index: number, currentStep: SortingStep | null, isSorted: boolean): string => {
            if (!currentStep) {
                  return isSorted ? 'bg-green-500' : 'bg-black'
            }
            
            // Priority: swapping > comparing > selecting > completed > default
            // Active operations override completion status so sorted elements can change color
            
            if (currentStep.swapping && currentStep.swapping.includes(index)) {
                  return 'bg-red-500'
            }
            
            if (currentStep.comparing && currentStep.comparing.includes(index)) {
                  return 'bg-yellow-500'
            }
            
            if (currentStep.selecting !== undefined && currentStep.selecting === index) {
                  return 'bg-purple-500'
            }
            
            if (currentStep.completed && currentStep.completed.includes(index)) {
                  return 'bg-green-500'
            }
            
            return 'bg-blue-500'
      },
      
      legend: [
            { color: 'bg-blue-500', label: 'Unsorted' },
            { color: 'bg-green-500', label: 'Sorted' },
            { color: 'bg-purple-500', label: 'Current Element' },
            { color: 'bg-yellow-500', label: 'Comparing' },
            { color: 'bg-red-500', label: 'Swapping' },
      ]
}