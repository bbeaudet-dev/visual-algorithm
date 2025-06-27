import { bubbleSort } from './bubbleSort'
import { insertionSort } from './insertionSort'
import { quickSort } from './quickSort'

export type Algorithm = {
      name: string
      algorithm: (arr: number[]) => number[]
      timeComplexity: string
      spaceComplexity: string
      path: string
}

export const bubbleSortAlgorithm: Algorithm = {
      name: 'Bubble Sort',
      algorithm: bubbleSort,
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      path: '/bubble-sort'
}

export const insertionSortAlgorithm: Algorithm = {
      name: 'Insertion Sort',
      algorithm: insertionSort,
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      path: '/insertion-sort'
}

export const quickSortAlgorithm: Algorithm = {
      name: 'Quick Sort',
      algorithm: quickSort,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      path: '/quick-sort'
}

export const sortAlgorithms: Algorithm[] = [
      bubbleSortAlgorithm,
      insertionSortAlgorithm,
      quickSortAlgorithm
]


// export const sortAlgorithms = {
//       quickSort: {
//             name: 'Quick Sort',
//             algorithm: quickSort,
//             timeComplexity: 'O(n log n)',
//             spaceComplexity: 'O(log n)',
//             path: '/quick-sort'
//       },
//       insertionSort: {
//             name: 'Insertion Sort',
//             algorithm: insertionSort,
//             timeComplexity: 'O(n^2)',
//             spaceComplexity: 'O(1)',
//             path: '/insertion-sort'
//       },
//       bubbleSort: {
//             name: 'Bubble Sort',
//             algorithm: bubbleSort,
//             timeComplexity: 'O(n^2)',
//             spaceComplexity: 'O(1)',
//             path: '/bubble-sort'
//       }
// }