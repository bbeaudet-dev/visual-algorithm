export function insertionSort(
      arr: number[],
      onStateChange?: (arr: number[]) => void
): number[] {
      let newArray: number[] = structuredClone(arr)

      for (let i = 1; i < arr.length; i++) { // iterate through each element once
            let currentValue = newArray[ i ]
            let j = i - 1

            console.log(`\nInserting ${ currentValue } into sorted portion`)
            console.log("Current array:", [ ...newArray ])

            // TODO record state, selecting element(s)

            while (j >= 0 && newArray[ j ] > currentValue) { // iterate through elements next to current element
                  console.log(`Shifting ${ newArray[ j ] } to the right`)

                  // TODO record state, comparing values
                  
                  newArray[ j + 1 ] = newArray[ j ]
                  j--
            }

            newArray[ j + 1 ] = currentValue
            console.log("Final array:", newArray)

            // TODO record state, after swapping elements
      }

      // TODO record state, final state

      return newArray
}

// include in commit/PR