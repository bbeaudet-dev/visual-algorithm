'use client'

import { useState } from 'react'
import { bubbleSortAlgorithm } from '../algorithms'
import SortingVisualizer from '../components/SortingVisualizer'
import Presets from '../components/Presets'
import Link from 'next/link'

export default function BubbleSortPage() {
      const [currentArray, setCurrentArray] = useState<number[]>([29, 29, 30, 30, 30, 29, 29, 27, 26, 27, 28, 28, 28, 27, 27, 25, 24, 22, 22, 21, 18, 16, 15, 14, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 12, 19, 20, 20, 19, 18, 16, 16, 15, 12, 12, 14, 14, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 21, 21, 20, 18, 15, 9, 9, 9, 5, 5, 5, 5, 13, 13, 13, 13, 13, 13, 13, 13, 5, 5, 5, 5, 6, 2])

      const handlePresetSelect = (array: number[]) => {
            setCurrentArray(array)
      }

      return (
            <div className="mx-2 my-3">
                  <Link className="p-2 border text-white text-sm bg-gray-400 rounded-lg hover:bg-gray-500 hover:scale-105 transition-all duration-200 cursor-pointer" href="/">&lt;&lt;&lt; Back to Selection</Link>
                  <SortingVisualizer
                        algorithm={bubbleSortAlgorithm}
                        buttonDisplay={
                              <div className="text-[12px]">
                                    🫧 { bubbleSortAlgorithm.name } 🫧
                              </div>
                        }
                        showImageAnalyzer={true}
                        initialArray={currentArray}
                        presetsPanel={<Presets onPresetSelect={handlePresetSelect} />}
                  />
            </div>
      )
}