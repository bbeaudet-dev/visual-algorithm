"use client"

import { useState, useEffect } from 'react'
import { insertionSortAlgorithm } from '../algorithms'

const generateRandomArray = (length: number = Math.floor(Math.random() * 10) + 5): number[] => {
      return Array.from({ length }, () => Math.floor(Math.random() * 25) + 1)
}

export default function InsertionSort() {
      const [ elementArray, setElementArray ] = useState<number[]>([])
      const [ elementCount, setElementCount ] = useState(5)
      const [ currentState, setCurrentState ] = useState(null)
      const [ allStates, setAllStates ] = useState([])

      useEffect(() => {
            console.log(`Creating ${ elementCount } new elements`)
            setElementArray(generateRandomArray(elementCount))
            setCurrentState(null)
            setAllStates([])
      }, [ elementCount ])

      const handleElementCountChange = (e: any) => {
            setElementCount(e.target.valueAsNumber)
      }

      const generateNewArr = () => {
            const newArr = generateRandomArray(elementCount)
            setElementArray(newArr)
            setCurrentState(null)
            setAllStates([])
      }

      // TODO animation function

      // TODO state variables

      return (
            <>
                  <h1 className="m-2"> Algorithm</h1>
                  <div className="flex flex-row m-5">
                        <form className="p-1 m-2" onSubmit={ e => e.preventDefault }>
                              <input
                                    value={ elementCount }
                                    onChange={ handleElementCountChange }
                                    className="w-20 px-2 py-1 rounded border-1"
                                    type="number"
                              />
                              <button
                                    type="button"
                                    className="px-3 py-1 m-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                                    onClick={ generateNewArr }
                              >
                                    New Elements
                              </button>
                        </form>

                        <button
                              className="px-3 py-1 m-1 text-white bg-blue-600 rounded text-bold border-1"
                              onClick={ () => insertionSortAlgorithm.algorithm(elementArray) }
                        >Use { insertionSortAlgorithm.name }</button>
                  </div>
            </>
      )
}