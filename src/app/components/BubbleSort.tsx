"use client"

import { useState, useEffect } from 'react'
import { bubbleSortAlgorithm } from '../algorithms'

export default function BubbleSort() {
      const [ elementArray, setElementArray ] = useState<number[]>([])

      useEffect(() => {
            setElementArray([])
      }, [ ])

      return (
            <>
                  <h1 className="m-2">Bubble Sort Algorithm</h1>
                  <div className="flex flex-row m-5">
                        <button
                              className="px-3 py-1 m-1 text-white bg-blue-500 rounded text-bold border-1"
                              onClick={ () => bubbleSortAlgorithm.algorithm(elementArray) }
                        >Use {bubbleSortAlgorithm.name}</button>
                  </div>
            </>
      )
}