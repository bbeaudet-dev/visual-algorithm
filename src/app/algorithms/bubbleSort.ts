export function bubbleSort(arr: number[], onProgress?: (step: number) => void): { sortedArray: number[], stepCount: number } {
      const newArr: number[] = structuredClone(arr)
      let sorting = true; let swapCounter = 0; let stepCounter = 0
      console.log('\n[ALGORITHM] Array of length', arr.length, 'received from React')

      // Speed control: max 1000 steps per second
      const maxStepsPerSecond = 1000
      const minDelayMs = 1000 / maxStepsPerSecond

      while (sorting) { // Iterate through for loop until a while loop iteration contains zero swaps
            swapCounter = 0
            for (let i = 0; i < arr.length - 1; i++) { // Iterate through each element pair in array
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
