"use client"

import { useState, useEffect } from 'react'
import { quickSortAlgorithm } from '../algorithms'

export default function QuickSort() {
      const [ elementArray, setElementArray ] = useState<number[]>([])

      useEffect(() => {
            setElementArray([])
      }, [])

      return (
            <>
                  <h1 className="m-2">Quick Sort Algorithm</h1>
                  <div className="flex flex-row m-5">
                        <button
                              className="px-3 py-1 m-1 text-white bg-blue-700 rounded text-bold border-1"
                              onClick={ () => quickSortAlgorithm.algorithm(elementArray) }
                        >Use { quickSortAlgorithm.name }</button>
                  </div>
            </>
      )
}