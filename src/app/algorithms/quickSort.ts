export function quickSort(arr: number[], onProgress?: (step: number) => void): { sortedArray: number[], stepCount: number } {
      const newArr: number[] = structuredClone(arr)
      let stepCounter = 0
      console.log('\n[ALGORITHM] Array of length', arr.length, 'received from React')

      function quickSortHelper(array: number[]): number[] {
            if (array.length <= 1) {
                  return array
            }

            stepCounter++
            
            // Report progress every step
            if (onProgress) {
                  onProgress(stepCounter)
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

import { SortingStep } from './bubbleSort'

// Animated version of quick sort that yields each step
export function* quickSortAnimated(arr: number[]): Generator<SortingStep, void, unknown> {
      let stepCounter = 0
      const workingArray = [...arr]
      const completed: Set<number> = new Set()

      // Helper function for recursive quick sort
      function* quickSortHelper(
            start: number, 
            end: number
      ): Generator<SortingStep, void, unknown> {
            if (start >= end) return

            stepCounter++
            
            // Step 1: Select pivot (rightmost element for easier implementation)
            const pivotIndex = end
            yield {
                  array: [...workingArray],
                  pivotIndex,
                  activeRange: [start, end],
                  stepCount: stepCounter,
                  isComplete: false
            }

            // Step 2: Partition the array (Lomuto partition scheme)
            let partitionIndex = start

            for (let i = start; i < end; i++) {
                  stepCounter++
                  
                  // Show comparison with pivot
                  yield {
                        array: [...workingArray],
                        comparing: [i, pivotIndex],
                        pivotIndex,
                        activeRange: [start, end],
                        partitioning: true,
                        stepCount: stepCounter,
                        isComplete: false
                  }

                  // If current element is smaller than pivot, swap it to the left section
                  if (workingArray[i] < workingArray[pivotIndex]) {
                        if (i !== partitionIndex) {
                              stepCounter++
                              
                              // Show swapping
                              yield {
                                    array: [...workingArray],
                                    swapping: [i, partitionIndex],
                                    pivotIndex,
                                    activeRange: [start, end],
                                    partitioning: true,
                                    stepCount: stepCounter,
                                    isComplete: false
                              }

                              // Perform the swap
                              const temp = workingArray[i]
                              workingArray[i] = workingArray[partitionIndex]
                              workingArray[partitionIndex] = temp
                              
                              stepCounter++
                              
                              // Show post-swap state
                              yield {
                                    array: [...workingArray],
                                    pivotIndex,
                                    activeRange: [start, end],
                                    partitioning: true,
                                    stepCount: stepCounter,
                                    isComplete: false
                              }
                        }
                        partitionIndex++
                  }
            }

            // Step 3: Place pivot in its correct position
            if (pivotIndex !== partitionIndex) {
                  stepCounter++
                  
                  // Show final pivot swap
                  yield {
                        array: [...workingArray],
                        swapping: [pivotIndex, partitionIndex],
                        pivotIndex,
                        activeRange: [start, end],
                        stepCount: stepCounter,
                        isComplete: false
                  }

                  // Perform final pivot swap
                  const temp = workingArray[pivotIndex]
                  workingArray[pivotIndex] = workingArray[partitionIndex]
                  workingArray[partitionIndex] = temp
            }

            stepCounter++
            
            // Show partition complete - pivot is now in correct position
            yield {
                  array: [...workingArray],
                  partitionBoundary: partitionIndex,
                  activeRange: [start, end],
                  stepCount: stepCounter,
                  isComplete: false
            }

            // Mark pivot as completed
            completed.add(partitionIndex)

            // Step 4: Recursively sort left and right partitions
            yield* quickSortHelper(start, partitionIndex - 1)
            yield* quickSortHelper(partitionIndex + 1, end)
      }

      // Start the recursive sorting
      yield* quickSortHelper(0, arr.length - 1)

      // Mark all elements as completed
      for (let i = 0; i < arr.length; i++) {
            completed.add(i)
      }

      // Yield final completed state
      yield {
            array: [...workingArray],
            completed: Array.from(completed),
            stepCount: stepCounter,
            isComplete: true
      }
}

// Quick Sort specific utilities
export const quickSortUtils = {
      getBarColor: (index: number, currentStep: SortingStep | null, isSorted: boolean): string => {
            if (!currentStep) {
                  return isSorted ? 'bg-green-500' : 'bg-black'
            }
            
            // Outside active range - dimmed
            if (currentStep.activeRange && 
                (index < currentStep.activeRange[0] || index > currentStep.activeRange[1])) {
                  return 'bg-gray-300 opacity-50'
            }
            
            // Priority: swapping > comparing > pivot > partition sections > completed > default
            
            if (currentStep.swapping && currentStep.swapping.includes(index)) {
                  return 'bg-red-500'
            }
            
            if (currentStep.comparing && currentStep.comparing.includes(index)) {
                  return 'bg-purple-700'
            }
            
            if (currentStep.pivotIndex === index) {
                  return 'bg-yellow-500'
            }
            
            // Partition boundary visualization
            if (currentStep.partitionBoundary !== undefined && currentStep.activeRange) {
                  if (index >= currentStep.activeRange[0] && index < currentStep.partitionBoundary) {
                        return 'bg-orange-400' // Left partition (smaller than pivot)
                  } else if (index > currentStep.partitionBoundary && index <= currentStep.activeRange[1]) {
                        return 'bg-rose-400' // Right partition (larger than pivot)
                  } else if (index === currentStep.partitionBoundary) {
                        return 'bg-yellow-500' // Pivot in final position
                  }
            }
            
            if (currentStep.completed && currentStep.completed.includes(index)) {
                  return 'bg-green-500'
            }
            
            return 'bg-blue-500' // Default active
      },
      
      legend: [
            { color: 'bg-blue-500', label: 'Unsorted' },
            { color: 'bg-green-500', label: 'Sorted' },
            { color: 'bg-purple-700', label: 'Comparing' },
            { color: 'bg-red-500', label: 'Swapping' },
            { color: 'bg-gray-300', label: 'Inactive' },
            { color: 'bg-yellow-500', label: 'Pivot' },
            { color: 'bg-orange-400', label: 'Left Partition' },
            { color: 'bg-rose-400', label: 'Right Partition' },
      ],
      

}