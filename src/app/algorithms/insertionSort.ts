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