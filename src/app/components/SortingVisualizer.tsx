"use client"

import { useState, useMemo } from 'react'
import { Algorithm } from '../algorithms'
import { bubbleSort, bubbleSortAnimated, bubbleSortUtils } from '../algorithms/bubbleSort'
import { insertionSort, insertionSortAnimated, insertionSortUtils } from '../algorithms/insertionSort'
import ImageAnalyzer from './ImageAnalyzer'
import ProcessedImage from './ProcessedImage'
import QuickSortVisualizer from './QuickSortVisualizer'
import BasicSortVisualizer from './BasicSortVisualizer'

interface SortingVisualizerProps {
      algorithm: Algorithm
      buttonDisplay: React.ReactNode
      showImageAnalyzer: boolean
      initialArray: number[]
      presetsPanel?: React.ReactNode
}

export default function SortingVisualizer({
      algorithm,
      buttonDisplay,
      showImageAnalyzer,
      initialArray,
      presetsPanel
}: SortingVisualizerProps) {
      const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)

      // Calculate element value ceiling for bar height calculations
      const elementValueCeiling = useMemo(() => Math.max(...initialArray), [initialArray])

      // Handle processed image URL from analysis
      const handleProcessedImageUrl = (imageUrl: string | null) => {
            setProcessedImageUrl(imageUrl)
      }

      // Handle array generation from image analysis
      const handleArrayGenerated = (array: number[], length: number, maxValue: number) => {
            // This will be handled by the individual visualizer components
            // The ImageAnalyzer calls this after processing the image
            console.log('Array generated from image:', { array, length, maxValue })
      }

      // Render the appropriate visualizer based on algorithm
      const renderAlgorithmVisualizer = () => {
            const commonChildren = (
                  <div className="flex flex-row items-center justify-center gap-4 w-full max-w-8xl">
                        {presetsPanel}
                        {showImageAnalyzer && (
                              <ImageAnalyzer
                                    onArrayGenerated={handleArrayGenerated}
                                    onProcessedImageUrl={handleProcessedImageUrl}
                              />
                        )}
                  </div>
            )

            switch (algorithm.algorithmName) {
                  case 'quickSort':
                        return (
                              <QuickSortVisualizer
                                    initialArray={initialArray}
                                    elementValueCeiling={elementValueCeiling}
                                    buttonDisplay={buttonDisplay}
                              >
                                    {commonChildren}
                              </QuickSortVisualizer>
                        )

                  case 'bubbleSort':
                        return (
                              <BasicSortVisualizer
                                    initialArray={initialArray}
                                    elementValueCeiling={elementValueCeiling}
                                    animatedGenerator={bubbleSortAnimated}
                                    fallbackSort={bubbleSort}
                                    algorithmUtils={bubbleSortUtils}
                                    buttonDisplay={buttonDisplay}
                              >
                                    {commonChildren}
                              </BasicSortVisualizer>
                        )

                  case 'insertionSort':
                        return (
                              <BasicSortVisualizer
                                    initialArray={initialArray}
                                    elementValueCeiling={elementValueCeiling}
                                    animatedGenerator={insertionSortAnimated}
                                    fallbackSort={insertionSort}
                                    algorithmUtils={insertionSortUtils}
                                    buttonDisplay={buttonDisplay}
                              >
                                    {commonChildren}
                              </BasicSortVisualizer>
                        )

                  default:
                        return (
                              <div className="flex flex-col items-center justify-center w-full">
                                    <div className="mb-4 text-center">
                                          {buttonDisplay && (
                                                <div className="mb-4">
                                                      {buttonDisplay}
                                                </div>
                                          )}
                                          <div className="text-lg font-semibold text-red-500">
                                                Animation not yet implemented for {algorithm.name}
                                          </div>
                                    </div>
                                    {commonChildren}
                              </div>
                        )
            }
      }

      return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
                  {/* Main Visualizer */}
                  {renderAlgorithmVisualizer()}

                  {/* Processed Image Display */}
                  {processedImageUrl && (
                        <div className="mt-8">
                              <ProcessedImage imageUrl={processedImageUrl} />
                        </div>
                  )}
            </div>
      )
} 