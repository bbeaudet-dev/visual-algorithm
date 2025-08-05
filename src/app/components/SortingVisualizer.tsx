"use client"

import { useState, useEffect, useRef } from 'react'
import { Algorithm, clientAlgorithms } from '../algorithms'
import { bubbleSortAnimated, SortingStep } from '../algorithms/bubbleSort'
import { insertionSortAnimated } from '../algorithms/insertionSort'
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
      
      // Animation states
      const [ isAnimating, setIsAnimating ] = useState<boolean>(false)
      const [ animationSpeed, setAnimationSpeed ] = useState<number>(50) // speed level (1-100)
      const [ currentStep, setCurrentStep ] = useState<SortingStep | null>(null)
      const [ isPaused, setIsPaused ] = useState<boolean>(false)
      
      const animationRef = useRef<NodeJS.Timeout | null>(null)
      const generatorRef = useRef<Generator<SortingStep, void, unknown> | null>(null)

      // Convert speed level to delay using semi-logarithmic scale
      const getAnimationDelay = (speed: number): number => {
            // Speed range: 1-100, Delay range: 1000ms-4ms
            // Higher speed = lower delay, semi-logarithmic for better control
            const minDelay = 4  // 4ms - Browser limit
            const maxDelay = 1000
            const normalizedSpeed = (speed - 1) / 99 // 0 to 1
            
            // Semi-logarithmic: mix of logarithmic and power curve for better control
            const logMin = Math.log(minDelay)
            const logMax = Math.log(maxDelay)
            
            // Use power curve to make it less aggressive than pure log
            const poweredSpeed = Math.pow(normalizedSpeed, 0.8) // Slightly less aggressive
            const logDelay = logMax - poweredSpeed * (logMax - logMin)
            
            return Math.exp(logDelay)
      }

      // Get transition duration based on animation speed
      const getTransitionDuration = (speed: number): number => {
            const delay = getAnimationDelay(speed)
            // Transition should be fast enough to complete before next step, but visible
            return Math.min(Math.max(delay * 0.3, 10), 150)
      }

      // Format delay for display with appropriate units
      const formatDelay = (delay: number): string => {
            return `${Math.round(delay)}ms`
      }

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
                  setCurrentStep(null)
            }
      }, [initialArray])

      // Animation loop
      useEffect(() => {
            if (isAnimating && !isPaused && generatorRef.current) {
                  const delay = getAnimationDelay(animationSpeed)
                  const animate = () => {
                        const result = generatorRef.current?.next()
                        if (result && !result.done) {
                              setCurrentStep(result.value)
                              setElementArray(result.value.array)
                              setStepCount(result.value.stepCount)
                              
                              if (result.value.isComplete) {
                                    setIsAnimating(false)
                                    setIsSorted(true)
                                    setCurrentStep(null)
                                    generatorRef.current = null
                              } else {
                                    animationRef.current = setTimeout(animate, delay)
                              }
                        } else {
                              setIsAnimating(false)
                              setIsSorted(true)
                              setCurrentStep(null)
                              generatorRef.current = null
                        }
                  }
                  
                  animationRef.current = setTimeout(animate, delay)
            }
            
            return () => {
                  if (animationRef.current) {
                        clearTimeout(animationRef.current)
                        animationRef.current = null
                  }
            }
      }, [isAnimating, isPaused, animationSpeed])

      const handleSort = async () => {
            if (isAnimating) return
            
            setStepCount(0)
            setIsSorted(false)
            setCurrentStep(null)
            
            // For bubble sort and insertion sort, use animated versions
            if (algorithm.algorithmName === 'bubbleSort') {
                  generatorRef.current = bubbleSortAnimated([...elementArray])
                  setIsAnimating(true)
                  setIsPaused(false)
            } else if (algorithm.algorithmName === 'insertionSort') {
                  generatorRef.current = insertionSortAnimated([...elementArray])
                  setIsAnimating(true)
                  setIsPaused(false)
            } else {
                  // Fallback to original non-animated algorithm
                  try {
                        const algorithmFunction = clientAlgorithms[algorithm.algorithmName as keyof typeof clientAlgorithms]
                        if (algorithmFunction) {
                              const result = await algorithmFunction([...elementArray], (step: number) => {
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
      }

      const handlePauseResume = () => {
            setIsPaused(!isPaused)
      }

      const handleReset = () => {
            // Stop animation
            setIsAnimating(false)
            setIsPaused(false)
            if (animationRef.current) {
                  clearTimeout(animationRef.current)
                  animationRef.current = null
            }
            generatorRef.current = null
            setCurrentStep(null)
            
            // Reset array
            if (initialArray) {
                  setElementArray([...initialArray])
            } else {
                  // Generate new random array
                  const ceilingMin = 10; const ceilingMax = 50
                  const ceiling = Math.floor(Math.random() * (ceilingMax-ceilingMin)) + ceilingMin
                  const lengthMin = 5; const lengthMax = 25
                  const length = Math.floor(Math.random() * (lengthMax-lengthMin)) + lengthMin
                  const arr = Array.from({ length }, () => Math.floor(Math.random() * ceiling) + 1)
                  setElementArray(arr)
                  setElementValueCeiling(ceiling)
            }
            setStepCount(0)
            setIsSorted(false)
            setCurrentStep(null)
      }

      // Handle image analysis results
      const handleImageAnalysis = (array: number[], length: number, maxValue: number) => {
            // Stop any current animation
            setIsAnimating(false)
            setIsPaused(false)
            if (animationRef.current) {
                  clearTimeout(animationRef.current)
                  animationRef.current = null
            }
            generatorRef.current = null
            setCurrentStep(null)
            
            // Set new array from image
            setElementArray(array)
            setElementValueCeiling(maxValue)
            setStepCount(0)
            setIsSorted(false)
      }

      // Handle processed image URL from analysis
      const handleProcessedImageUrl = (imageUrl: string | null) => {
            setProcessedImageUrl(imageUrl)
      }

      // Get bar color based on current state
      const getBarColor = (index: number): string => {
            if (!currentStep) {
                  return isSorted ? 'bg-green-500' : 'bg-black'
            }
            
            // Priority order: swapping > comparing > selecting > completed > default
            
            if (currentStep.swapping && currentStep.swapping.includes(index)) {
                  return 'bg-red-500'
            }
            
            if (currentStep.comparing && currentStep.comparing.includes(index)) {
                  return 'bg-yellow-500'
            }
            
            if (currentStep.selecting !== undefined && currentStep.selecting === index) {
                  return 'bg-purple-500'
            }
            
            if (currentStep.completed && currentStep.completed.includes(index)) {
                  return 'bg-green-500'
            }
            
            return 'bg-blue-500'
      }

      return (
            <div className="flex flex-col items-center justify-center m-5 w-full">
                  {/* Controls Row */}
                  <div className="flex flex-row items-center gap-4 mb-4 w-full max-w-8xl justify-center">
                        <div className="flex items-center gap-4">
                              <div 
                                    className={`p-2 rounded-lg min-w-[120px] text-center ${
                                          isSorted ? 'bg-green-100' : isAnimating ? 'bg-yellow-100' : 'bg-blue-100'
                                    }`}
                              >
                                    <span className="font-semibold">Steps: {stepCount}</span>
                              </div>
                              
                              {/* Main Sort Button */}
                              <button
                                    className={`px-5 py-2 text-white rounded-xl text-bold text-md border-1 hover:scale-105 transition-all duration-200 cursor-pointer ${
                                          isAnimating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                    onClick={handleSort}
                                    disabled={isAnimating}
                              >
                                    Start Animation
                                    <div className="text-[12px]">
                                          {buttonDisplay}
                                    </div>
                              </button>
                              
                              {/* Animation Controls */}
                              {(algorithm.algorithmName === 'bubbleSort' || algorithm.algorithmName === 'insertionSort') && (
                                    <>
                                          {isAnimating && (
                                                <button
                                                      className="px-3 py-2 text-white bg-orange-500 rounded-xl hover:bg-orange-600 hover:scale-105 transition-all duration-200"
                                                      onClick={handlePauseResume}
                                                >
                                                      {isPaused ? 'Resume' : 'Pause'}
                                                </button>
                                          )}
                                          
                                          <button
                                                className="px-3 py-2 text-white bg-gray-500 rounded-xl hover:bg-gray-600 hover:scale-105 transition-all duration-200"
                                                onClick={handleReset}
                                          >
                                                Reset
                                          </button>
                                    </>
                              )}
                        </div>
                  </div>

                  {/* Speed Control */}
                  {(algorithm.algorithmName === 'bubbleSort' || algorithm.algorithmName === 'insertionSort') && (
                        <div className="flex flex-col items-center mb-4">
                              <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium">Speed:</label>
                                    <span className="text-sm text-gray-600 min-w-[40px]">Slow</span>
                                    <input
                                          type="range"
                                          min="1"
                                          max="100"
                                          step="1"
                                          value={animationSpeed}
                                          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                          className="w-48"
                                    />
                                    <span className="text-sm text-gray-600 min-w-[40px]">Fast</span>
                                    <span className="text-sm text-gray-600 min-w-[80px]">
                                          {formatDelay(getAnimationDelay(animationSpeed))}
                                    </span>
                              </div>
                              {Math.round(getAnimationDelay(animationSpeed)) <= 4 && (
                                    <div className="text-red-500 text-xs mt-2">
                                          ⚠️ WARNING: Browser limit reached (4ms minimum)
                                    </div>
                              )}
                        </div>
                  )}

                  {/* Bars container */}
                  <div className="w-full max-w-[84rem] mb-8">
                        <ul className='flex flex-row items-center justify-center gap-0.25'>
                              { elementArray.map((element, index) => {
                                    // Calculate bar width based on array length
                                    const barWidth = Math.max(4, Math.min(12, 1050 / elementArray.length))
                                    // Calculate bar height
                                    const maxHeight = Math.max(450, 1350 / Math.sqrt(elementArray.length))
                                    const barHeight = (element / elementValueCeiling) * maxHeight
                                    
                                    return (
                                          <li
                                                key={index}
                                                className={`flex flex-col justify-center items-center rounded border text-white relative p-1.5 transition-colors ${getBarColor(index)}`}
                                                style={{
                                                      width: `${barWidth}px`,
                                                      height: `${barHeight}px`,
                                                      minHeight: '36px',
                                                      minWidth: '4px',
                                                      fontSize: Math.max(8, Math.min(12, barWidth * 0.6)),
                                                      fontWeight: 600,
                                                      transitionDuration: `${getTransitionDuration(animationSpeed)}ms`,
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

                  {/* Legend for animated algorithms */}
                  {algorithm.algorithmName === 'bubbleSort' && (
                        <div className="flex items-center gap-6 mb-4 text-sm">
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span>Unsorted</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span>Comparing</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span>Swapping</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span>Sorted</span>
                              </div>
                        </div>
                  )}
                  
                  {algorithm.algorithmName === 'insertionSort' && (
                        <div className="flex items-center gap-6 mb-4 text-sm">
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span>Unsorted</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                    <span>Current Element</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span>Comparing</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span>Swapping</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span>Sorted</span>
                              </div>
                        </div>
                  )}

                  {/* Presets and Image Analyzer Row */}
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