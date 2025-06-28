"use client"

import { useState, useEffect } from 'react'
import { bubbleSortAlgorithm } from '../algorithms'
import clsx from 'clsx'

type ChessPiece = {
      name: string
      array: number[]
}
const chessPieces: ChessPiece[] = [
      {
            name: 'King', 
            array: [29, 29, 30, 30, 30, 29, 29, 27, 26, 27, 28, 28, 28, 27, 27, 25, 24, 22, 22, 21, 18, 16, 15, 14, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 12, 19, 20, 20, 19, 18, 16, 16, 15, 12, 12, 14, 14, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 21, 21, 20, 18, 15, 9, 9, 9, 5, 5, 5, 5, 13, 13, 13, 13, 13, 13, 13, 13, 5, 5, 5, 5, 6, 2]
      },
      {
            name: 'Queen',
            array: [29, 30, 30, 30, 30, 30, 29, 28, 25, 26, 27, 28, 28, 28, 27, 27, 26, 24, 23, 22, 22, 21, 18, 17, 16, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 18, 19, 20, 20, 20, 18, 16, 16, 16, 12, 12, 12, 14, 14, 12, 12, 12, 13, 13, 13, 13, 14, 14, 15, 16, 17, 18, 19, 19, 19, 18, 12, 12, 11, 10, 8, 6, 3, 4, 5, 5, 5, 4, 3, 1]
      },
      {
            name: 'Rook',
            array: [29, 30, 30, 30, 30, 30, 30, 30, 29, 29, 28, 25, 26, 27, 27, 28, 28, 28, 28, 27, 27, 27, 26, 25, 24, 23, 22, 22, 22, 21, 20, 19, 18, 18, 18, 17, 17, 17, 16, 16, 16, 16, 15, 15, 15, 15, 14, 14, 14, 14, 14, 14, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 15, 15, 15, 15, 15, 15, 19, 20, 20, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
      },
      {
            name: 'Knight',
            array: [29, 30, 30, 30, 30, 30, 30, 29, 28, 25, 26, 27, 28, 28, 28, 28, 27, 27, 26, 25, 24, 23, 22, 21, 21, 17, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 21, 21, 21, 21, 21, 20, 20, 20, 19, 19, 19, 18, 18, 17, 17, 17, 26, 27, 27, 28, 29, 29, 29, 29, 29, 29, 29, 28, 27, 26, 26, 25, 24, 24, 23, 22, 22, 21, 20, 20, 19, 19, 18, 17, 17, 16, 15, 10, 9, 8, 8, 7, 6, 5, 4, 3, 1]
      },
      {
            name: 'Bishop',
            array: [29, 30, 30, 30, 30, 30, 29, 29, 26, 26, 27, 28, 28, 28, 28, 27, 26, 25, 24, 23, 22, 22, 21, 18, 17, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 19, 20, 20, 20, 19, 16, 16, 15, 15, 14, 10, 10, 10, 12, 12, 12, 13, 15, 16, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 18, 18, 17, 17, 16, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 6, 7, 8, 7, 6]
      },
      {
            name: 'Pawn',
            array: [29, 30, 29, 30, 30, 30, 29, 29, 29, 25, 26, 27, 27, 28, 28, 28, 27, 27, 26, 25, 24, 23, 22, 21, 21, 19, 18, 17, 16, 16, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 10, 10, 9, 9, 20, 22, 23, 23, 23, 22, 21, 20, 18, 16, 14, 11, 10, 9, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 19, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 20, 20, 20, 19, 19, 18, 17, 17, 16, 14, 13, 12, 10, 8, 4]
      }
]

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

      const handleChessPieceSelect = (e: any) => {
            const selectedPiece = chessPieces.find(piece => piece.name === e.target.value)
            if (selectedPiece) {
                  setElementArray([...selectedPiece.array])
                  setElementCount(selectedPiece.array.length)
                  setElementValueCeiling(Math.max(...selectedPiece.array))
                  setCurrentState(null)
                  setAllStates([])
            }
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
                                    className={ clsx("px-0 my-3 mx-0 rounded-lg border text-[12px] text-white bg-black") }
                                    style={ { paddingTop: `${ element / 2 }rem`, paddingBottom: `${ element / 2 }rem` } }
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
                  
                  <div className="flex flex-col items-center m-2">
                        <label className="text-sm font-medium mb-1">Presets:</label>
                        <select 
                              onChange={ handleChessPieceSelect }
                              className="w-48 px-3 py-1 rounded border"
                              defaultValue=""
                        >
                              <option value="" disabled>Select a chess piece</option>
                              {chessPieces.map(piece => (
                                    <option key={piece.name} value={piece.name}>
                                          {piece.name}
                                    </option>
                              ))}
                        </select>
                  </div>
                  
            </div>
      )
}