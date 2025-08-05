export function bubbleSort(arr: number[], onProgress?: (step: number) => void): { sortedArray: number[], stepCount: number } {
      const newArr: number[] = structuredClone(arr)
      let sorting = true; let swapCounter = 0; let stepCounter = 0
      console.log('\n[ALGORITHM] Array of length', arr.length, 'received from React')

      while (sorting) { // Iterate through for loop until a while loop iteration contains zero swaps
            swapCounter = 0
            for (let i = 0; i < arr.length - 1; i++) { // Iterate through each element pair in array
                  stepCounter++
                  
                  // Report progress every step
                  if (onProgress) {
                        onProgress(stepCounter)
                  }
                  
                  console.log('\nstepCounter:',stepCounter)
                  console.log('Current array:', [ ...newArr ])
                  const j = i + 1
                  const leftElement = newArr[ i ]
                  const rightElement = newArr[ j ]
                  console.log(`Comparing ${ leftElement } and ${ rightElement } (positions ${ i } and ${ j })`)

                  // Compare right and left elements
                  if (newArr[ i ] > newArr[ j ]) {
                        console.log(`Result: ${ newArr[ i ] } > ${ newArr[ j ] }, so positions will be swapped by shifting ${ newArr[ i ] } to the right`)
                        newArr[ j ] = leftElement
                        newArr[ i ] = rightElement
                        console.log("New array:", newArr)
                        swapCounter++
                        console.log('Swap made, adding to counter:', swapCounter)
                  } else {
                        console.log(`Result: ${ newArr[ i ] } ≤ ${ newArr[ j ] }, so positions and swapCounter will be maintained`)
                        continue
                  }
            }
            // Check if while loop iteration contained any swaps
            if (swapCounter === 0) {
                  console.log('\nswapCounter = 0, so exiting while loop\nFinal sorted array:', newArr)
                  sorting = false
                  
                  // Report final step count
                  if (onProgress) {
                        onProgress(stepCounter)
                  }
                  
                  return { sortedArray: newArr, stepCount: stepCounter }
            } else console.log('\nswapCounter =', swapCounter, 'which is > 0\nStarting new iteration of while loop')
      }
      console.log('[ALGORITHM] Error using Bubble Sort, returning original array:', arr)
      
      // Report final step count
      if (onProgress) {
            onProgress(stepCounter)
      }
      
      return { sortedArray: arr, stepCount: stepCounter }
}

// Types for animation steps (shared across sorting algorithms)
export interface SortingStep {
      array: number[]
      comparing?: [number, number]
      swapping?: [number, number]
      selecting?: number
      shifting?: number       // For bubble sort shifting
      insertingAt?: number    // For insertion sort final insertion
      
      // Quick Sort specific
      pivotIndex?: number           // Current pivot
      activeRange?: [number, number] // Current subarray being processed [start, end]
      partitionBoundary?: number    // Where partition split happens
      partitioning?: boolean        // Currently in partitioning phase
      
      completed?: number[]
      stepCount: number
      isComplete?: boolean
}

// Animated version of bubble sort that yields each step
export function* bubbleSortAnimated(arr: number[]): Generator<SortingStep, void, unknown> {
      const newArr: number[] = [...arr]
      const completed: Set<number> = new Set()
      let sorting = true
      let stepCounter = 0
      let passCount = 0

      while (sorting) {
            let swapCounter = 0
            
            for (let i = 0; i < newArr.length - 1 - passCount; i++) {
                  stepCounter++
                  const j = i + 1
                  
                  // Yield comparison step
                  yield {
                        array: [...newArr],
                        comparing: [i, j] as [number, number],
                        completed: Array.from(completed),
                        stepCount: stepCounter,
                        isComplete: false
                  }

                  // Compare and swap if needed
                  if (newArr[i] > newArr[j]) {
                        // Yield swapping step
                        yield {
                              array: [...newArr],
                              swapping: [i, j] as [number, number],
                              completed: Array.from(completed),
                              stepCount: stepCounter,
                              isComplete: false
                        }
                        
                        // Perform the swap
                        const temp = newArr[i]
                        newArr[i] = newArr[j]
                        newArr[j] = temp
                        swapCounter++
                        
                        // Yield post-swap state
                        yield {
                              array: [...newArr],
                              completed: Array.from(completed),
                              stepCount: stepCounter,
                              isComplete: false
                        }
                  }
            }
            
            // Mark the last element of this pass as completed
            const lastElementIndex = newArr.length - 1 - passCount
            if (lastElementIndex >= 0) {
                  completed.add(lastElementIndex)
            }
            passCount++
            
            // Check if sorting is complete
            if (swapCounter === 0) {
                  sorting = false
                  // Mark all remaining elements as completed
                  for (let i = 0; i < newArr.length; i++) {
                        completed.add(i)
                  }
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

// Bubble Sort specific utilities
export const bubbleSortUtils = {
      getBarColor: (index: number, currentStep: SortingStep | null, isSorted: boolean): string => {
            if (!currentStep) {
                  return isSorted ? 'bg-green-500' : 'bg-black'
            }
            
            // Priority: swapping > comparing > completed > default
            if (currentStep.swapping && currentStep.swapping.includes(index)) {
                  return 'bg-red-500'
            }
            
            if (currentStep.comparing && currentStep.comparing.includes(index)) {
                  return 'bg-yellow-500'
            }
            
            if (currentStep.completed && currentStep.completed.includes(index)) {
                  return 'bg-green-500'
            }
            
            return 'bg-blue-500'
      },
      
      legend: [
            { color: 'bg-blue-500', label: 'Unsorted' },
            { color: 'bg-green-500', label: 'Sorted' },
            { color: 'bg-yellow-500', label: 'Comparing' },
            { color: 'bg-red-500', label: 'Swapping' },
      ]
}
