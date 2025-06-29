"use client"

import { useState, useEffect } from 'react'
import { Algorithm, clientAlgorithms } from '../algorithms'
import ImageAnalyzer from './ImageAnalyzer'
import ProcessedImage from './ProcessedImage'

interface SortingVisualizerProps {
      algorithm: Algorithm
      buttonDisplay: React.ReactNode
      showImageAnalyzer?: boolean
      initialArray?: number[]
      presetsPanel?: React.ReactNode
}

export default function SortingVisualizer({ 
      algorithm, 
      buttonDisplay, 
      showImageAnalyzer = true,
      initialArray,
      presetsPanel
}: SortingVisualizerProps) {
      const [ elementArray, setElementArray ] = useState<number[]>(initialArray || [])
      const [ elementValueCeiling, setElementValueCeiling ] = useState<number>(initialArray ? Math.max(...initialArray) : 25)
      const [ stepCount, setStepCount ] = useState<number>(0)
      const [ isSorted, setIsSorted ] = useState<boolean>(false)
      const [ processedImageUrl, setProcessedImageUrl ] = useState<string | null>(null)

      // Generate initial random array only if no initialArray is provided
      useEffect(() => {
            if (!initialArray) {
                  const ceilingMin = 10; const ceilingMax = 50
                  const ceiling = Math.floor(Math.random() * (ceilingMax-ceilingMin)) + ceilingMin
                  const lengthMin = 5; const lengthMax = 25
                  const length = Math.floor(Math.random() * (lengthMax-lengthMin)) + lengthMin
                  const arr = Array.from({ length }, () => Math.floor(Math.random() * ceiling) + 1)
                  setElementArray(arr)
                  setElementValueCeiling(ceiling)
            }
      }, [initialArray])

      // Update array when initialArray prop changes
      useEffect(() => {
            if (initialArray) {
                  setElementArray(initialArray)
                  setElementValueCeiling(Math.max(...initialArray))
                  setIsSorted(false)
            }
      }, [initialArray])

      const handleSort = async () => {
            if (!algorithm) return

            setStepCount(0)
            setIsSorted(false)

            try {
                  // Use client-side algorithm with the algorithm name
                  const algorithmFunction = clientAlgorithms[algorithm.algorithmName as keyof typeof clientAlgorithms]
                  if (algorithmFunction) {
                        const result = await algorithmFunction([...elementArray], (step: number) => {
                              // Force immediate update
                              setStepCount(step)
                        })
                        
                        setElementArray(result.sortedArray)
                        setStepCount(result.stepCount)
                        setIsSorted(true)
                  }
            } catch (error) {
                  console.error('Sorting error:', error)
            }
      }

      // Handle image analysis results
      const handleImageAnalysis = (array: number[], length: number, maxValue: number) => {
            setElementArray(array)
            setElementValueCeiling(maxValue)
            setStepCount(0)
            setIsSorted(false)
      }

      // Handle processed image URL from analysis
      const handleProcessedImageUrl = (imageUrl: string | null) => {
            setProcessedImageUrl(imageUrl)
      }

      return (
            <div className="flex flex-col items-center justify-center m-5 w-full">
                  {/* Steps and Start Button Row - centered */}
                  <div className="flex flex-row items-center gap-4 mb-4 w-full max-w-8xl justify-center">
                        <div className="flex items-center gap-4">
                              <div 
                                    className={`p-2 rounded-lg min-w-[120px] text-center ${
                                          isSorted ? 'bg-green-100' : 'bg-blue-100'
                                    }`}
                              >
                                    <span className="font-semibold">Steps: {stepCount}</span>
                              </div>
                              <button
                                    className="px-5 py-2 text-white bg-blue-500 rounded-xl text-bold text-md border-1 hover:bg-blue-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                                    onClick={handleSort}
                              >
                                    Start Algorithm
                                    <div className="text-[12px]">
                                          {buttonDisplay}
                                    </div>
                              </button>
                        </div>
                  </div>

                  {/* Bars container - 10% shorter vertically, 5% wider horizontally */}
                  <div className="w-full max-w-[84rem] mb-8">
                        <ul className='flex flex-row items-center justify-center gap-0.25'>
                              { elementArray.map((element, index) => {
                                    // Calculate bar width based on array length - 5% wider
                                    const barWidth = Math.max(4, Math.min(12, 1050 / elementArray.length))
                                    // Calculate bar height - 10% shorter
                                    const maxHeight = Math.max(450, 1350 / Math.sqrt(elementArray.length))
                                    const barHeight = (element / elementValueCeiling) * maxHeight
                                    
                                    return (
                                          <li
                                                key={index}
                                                className="flex flex-col justify-center items-center rounded border text-white bg-black relative p-1.5"
                                                style={{
                                                      width: `${barWidth}px`,
                                                      height: `${barHeight}px`,
                                                      minHeight: '36px',
                                                      minWidth: '4px',
                                                      fontSize: Math.max(8, Math.min(12, barWidth * 0.6)),
                                                      fontWeight: 600,
                                                }}
                                          >
                                                <span className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                                                      {element}
                                                </span>
                                          </li>
                                    )
                              })}
                        </ul>
                  </div>

                  {/* Presets and Image Analyzer Row - moved below bars */}
                  <div className="flex flex-row items-center justify-center gap-4 w-full max-w-8xl">
                        {presetsPanel && (
                              <div className="w-full max-w-xs">{presetsPanel}</div>
                        )}
                        {showImageAnalyzer && (
                              <div className="w-full max-w-[calc(0.8*20rem)]">
                                    <ImageAnalyzer 
                                          onArrayGenerated={handleImageAnalysis}
                                          onProcessedImageUrl={handleProcessedImageUrl}
                                    />
                              </div>
                        )}
                        {/* Processed Image positioned to the right */}
                        <ProcessedImage imageUrl={processedImageUrl} />
                  </div>
            </div>
      )
} 