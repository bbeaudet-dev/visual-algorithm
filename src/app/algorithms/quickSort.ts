export function quickSort(
      arr: number[],
      onStateChange?: (arr: number[]) => void
): number[] {
      let newArr: number[] = structuredClone(arr)

      for (let i = 1; i < arr.length; i++) { // iterate through each element once
            let currentValue = newArr[ i ]
            let j = i - 1

            console.log(`\nInserting ${ currentValue } into sorted portion`)
            console.log("Current array:", [ ...newArr ])

            // TODO record state, selecting element(s)

            while (j >= 0 && newArr[ j ] > currentValue) { // iterate through elements next to current element
                  console.log(`Shifting ${ newArr[ j ] } to the right`)

                  // TODO record state, comparing values

                  newArr[ j + 1 ] = newArr[ j ]
                  j--
            }

            newArr[ j + 1 ] = currentValue
            console.log("Final array:", newArr)

            // TODO record state, after swapping elements
      }

      // TODO record state, final state

      return newArr
}