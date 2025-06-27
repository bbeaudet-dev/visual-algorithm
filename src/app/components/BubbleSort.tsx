"use client"

import { useState, useEffect } from 'react'
import { bubbleSortAlgorithm } from '../algorithms'
import clsx from 'clsx'

export default function BubbleSort() {
      const [ elementArray, setElementArray ] = useState<number[]>([])
      const [ elementCount, setElementCount ] = useState<number>(5)
      const [ elementValueCeiling, setElementValueCeiling ] = useState<number>(25)
      const [ currentState, setCurrentState ] = useState(null)
      const [ allStates, setAllStates ] = useState([])

      // Generate initial random array
       useEffect(() => {
            const ceilingMin = 10; const ceilingMax = 50
            const ceiling = Math.floor(Math.random() * (ceilingMax-ceilingMin)) + ceilingMin
            const lengthMin = 5; const lengthMax = 25
            const length = Math.floor(Math.random() * (lengthMax-lengthMin)) + lengthMin
            const arr = Array.from({ length }, () => Math.floor(Math.random() * ceiling) + 1)
            console.log(`\n[REACT] Generated array of length ${ length } and maximum value ${ ceiling }: ${ arr }`)
            setElementArray(arr)
      }, [])

      // Generate new user-specified array
      const generateNewArray = (length: number, ceiling: number): number[] => {
            const arr = Array.from({ length }, () => Math.floor(Math.random() * ceiling) + 1)
            console.log(`[REACT] Generated user-specified array of length ${ length } and maximum value ${ ceiling }: ${ arr }`)
            return arr
      }

      function getSortedArray() {
            const sortedArray = bubbleSortAlgorithm.algorithm(elementArray)
            setElementArray(sortedArray)
      }

      return (
            <div className="flex flex-col items-center justify-center m-5">
                  <h1 className="m-2 text-lg">Bubble Sort Algorithm</h1>
                  <ul className='flex flex-row items-baseline'>
                        { elementArray.map((element, index) => (
                              <li
                                    key={index}
                                    className={ clsx("px-1.5 my-3 mx-1 rounded-lg border text-xs") }
                                    style={ { paddingTop: `${ element / 4 }rem`, paddingBottom: `${ element / 4 }rem` } }
                                    >{ element }</li>)
                              ) 
                        }
                  </ul>
                  <button
                        className="px-5 py-2 m-1 text-white bg-blue-500 rounded-xl text-bold text-md border-1"
                        onClick={ getSortedArray }
                  >Start Algorithm 
                        <div className="text-[12px]">
                              🫧 { bubbleSortAlgorithm.name } 🫧
                        </div>     
                  </button>
                  <form className="flex flex-row p-3 gap-6 m-2 border " onSubmit={ e => e.preventDefault }>
                       <div className="flex flex-col items-center">
                              <label className="text-sm font-medium mb-1"># of Elements</label>
                              <input
                                    value={ elementCount }
                                    onChange={ (e) => setElementCount(Number(e.target.value)) }
                                    className="w-20 px-2 py-1 rounded border"
                                    type="number"
                              />
                        </div>
                        <div className="flex flex-col items-center">
                              <label className="text-sm font-medium mb-1">Max. Value</label>
                              <input
                                    value={ elementValueCeiling }
                                    onChange={ (e) => setElementValueCeiling(Number(e.target.value)) }
                                    className="w-20 px-2 py-1 rounded border-1"
                                    type="number"
                              />
                        </div>      
                        <button
                              type="button"
                              className="px-3 py-1 m-2 text-white bg-gray-400 rounded-xl hover:bg-gray-600"
                              onClick={ () => generateNewArray(elementCount, elementValueCeiling) }
                        >Generate New Array</button>
                  </form>
            </div>
      )
}