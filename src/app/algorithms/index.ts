import { bubbleSort } from './bubbleSort'
import { insertionSort } from './insertionSort'
import { quickSort } from './quickSort'

export type Algorithm = {
      name: string
      algorithmName: string
      timeComplexity: string
      spaceComplexity: string
      path: string
}

// New interface for algorithms with progress reporting
export type AlgorithmWithProgress = {
      name: string
      algorithmName: string
      timeComplexity: string
      spaceComplexity: string
      path: string
      algorithm: (arr: number[], onProgress?: (step: number) => void) => { sortedArray: number[], stepCount: number }
}

export const bubbleSortAlgorithm: Algorithm = {
      name: 'Bubble Sort',
      algorithmName: 'bubbleSort',
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      path: '/bubble-sort'
}

export const insertionSortAlgorithm: Algorithm = {
      name: 'Insertion Sort',
      algorithmName: 'insertionSort',
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      path: '/insertion-sort'
}

export const quickSortAlgorithm: Algorithm = {
      name: 'Quick Sort',
      algorithmName: 'quickSort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      path: '/quick-sort'
}

export const sortAlgorithms: Algorithm[] = [
      bubbleSortAlgorithm,
      insertionSortAlgorithm,
      quickSortAlgorithm
]
// Client-side algorithm functions with progress reporting
export const clientAlgorithms = {
      bubbleSort: (arr: number[], onProgress?: (step: number) => void) => bubbleSort(arr, onProgress),
      insertionSort: (arr: number[], onProgress?: (step: number) => void) => insertionSort(arr, onProgress),
      quickSort: (arr: number[], onProgress?: (step: number) => void) => quickSort(arr, onProgress)
}


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
