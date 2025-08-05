import { useState, useEffect, useRef } from 'react'
import { SortingStep } from '../algorithms/bubbleSort'

export interface UseAnimationControlsProps {
      initialArray: number[]
      animatedGenerator: (arr: number[]) => Generator<SortingStep, void, unknown>
      fallbackSort?: (arr: number[]) => { sortedArray: number[], stepCount: number }
}

export function useAnimationControls({ 
      initialArray, 
      animatedGenerator,
      fallbackSort 
}: UseAnimationControlsProps) {
      const [elementArray, setElementArray] = useState<number[]>(initialArray)
      const [stepCount, setStepCount] = useState<number>(0)
      const [isSorted, setIsSorted] = useState<boolean>(false)
      const [isAnimating, setIsAnimating] = useState<boolean>(false)
      const [isPaused, setIsPaused] = useState<boolean>(false)
      const [animationSpeed, setAnimationSpeed] = useState<number>(50)
      const [currentStep, setCurrentStep] = useState<SortingStep | null>(null)

      const animationRef = useRef<NodeJS.Timeout | null>(null)
      const generatorRef = useRef<Generator<SortingStep, void, unknown> | null>(null)
      const prevInitialArrayRef = useRef<number[]>(initialArray)

      // Animation delay calculation (logarithmic)
      const getAnimationDelay = (speed: number): number => {
            const minDelay = 4  // 4ms - Browser limit
            const maxDelay = 1000
            const normalizedSpeed = (speed - 1) / 99 // 0 to 1
            const logMin = Math.log(minDelay)
            const logMax = Math.log(maxDelay)
            const poweredSpeed = Math.pow(normalizedSpeed, 0.8) // Slightly less aggressive
            const logDelay = logMax - poweredSpeed * (logMax - logMin)
            return Math.round(Math.exp(logDelay))
      }

      // Format delay for display
      const formatDelay = (delay: number): string => {
            return `${Math.round(delay)}ms`
      }

      // Get transition duration for smooth animations
      const getTransitionDuration = (): string => {
            const delay = getAnimationDelay(animationSpeed)
            const duration = Math.min(Math.max(delay * 0.3, 20), 150)
            return `${duration}ms`
      }

      // Animation loop
      useEffect(() => {
            if (isAnimating && !isPaused && generatorRef.current) {
                  const delay = getAnimationDelay(animationSpeed)
                  
                  animationRef.current = setTimeout(() => {
                        const result = generatorRef.current!.next()
                        
                        if (result.done) {
                              setIsAnimating(false)
                              setIsSorted(true)
                              // Keep the last step to maintain sorted visualization
                              generatorRef.current = null
                        } else {
                              const step = result.value
                              setCurrentStep(step)
                              setElementArray([...step.array])
                              setStepCount(step.stepCount)
                              
                              if (step.isComplete) {
                                    setIsAnimating(false)
                                    setIsSorted(true)
                                    // Keep the current step to maintain sorted visualization
                                    generatorRef.current = null
                              }
                        }
                  }, delay)
            }

            return () => {
                  if (animationRef.current) {
                        clearTimeout(animationRef.current)
                  }
            }
      }, [isAnimating, isPaused, animationSpeed, currentStep])

      // Start sorting animation
      const handleSort = () => {
            if (isAnimating) return
            
            setIsSorted(false)
            setCurrentStep(null)
            
            try {
                  generatorRef.current = animatedGenerator([...elementArray])
                  setIsAnimating(true)
                  setIsPaused(false)
            } catch (error) {
                  console.error('Animation failed, falling back to non-animated sort:', error)
                  if (fallbackSort) {
                        const result = fallbackSort([...elementArray])
                        setElementArray(result.sortedArray)
                        setStepCount(result.stepCount)
                        setIsSorted(true)
                  }
            }
      }

      // Pause/Resume animation
      const handlePauseResume = () => {
            if (!isAnimating) return
            setIsPaused(!isPaused)
      }

      // Reset to unsorted state
      const handleReset = () => {
            if (animationRef.current) {
                  clearTimeout(animationRef.current)
                  animationRef.current = null
            }
            
            generatorRef.current = null
            setIsAnimating(false)
            setIsPaused(false)
            setCurrentStep(null) // Clear step on explicit reset
            setElementArray([...initialArray])
            setStepCount(0)
            setIsSorted(false)
      }

      // Update array ONLY when initial array actually changes, not when animation state changes
      useEffect(() => {
            const arrayChanged = JSON.stringify(prevInitialArrayRef.current) !== JSON.stringify(initialArray)
            if (arrayChanged) {
                  setElementArray([...initialArray])
                  setIsSorted(false)
                  setStepCount(0)
                  setCurrentStep(null)
                  prevInitialArrayRef.current = initialArray
            }
      }, [initialArray])

      return {
            // State
            elementArray,
            stepCount,
            isSorted,
            isAnimating,
            isPaused,
            animationSpeed,
            currentStep,
            
            // Actions
            handleSort,
            handlePauseResume,
            handleReset,
            setAnimationSpeed,
            
            // Utilities
            getAnimationDelay,
            formatDelay,
            getTransitionDuration
      }
} 