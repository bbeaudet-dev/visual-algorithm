import { useRef } from 'react'
import { quickSort, quickSortAnimated, quickSortUtils } from '../algorithms/quickSort'
import { useAnimationControls } from '../hooks/useAnimationControls'
import AnimationControls from './AnimationControls'
import SpeedControl from './SpeedControl'
import AlgorithmLegend from './AlgorithmLegend'

interface QuickSortVisualizerProps {
      initialArray: number[]
      elementValueCeiling: number
      buttonDisplay?: React.ReactNode // Algorithm name display
      children?: React.ReactNode // For presets and image analyzer
}

export default function QuickSortVisualizer({
      initialArray,
      elementValueCeiling,
      buttonDisplay,
      children
}: QuickSortVisualizerProps) {
      const animation = useAnimationControls({
            initialArray,
            animatedGenerator: quickSortAnimated,
            fallbackSort: quickSort
      })

      const {
            elementArray,
            stepCount,
            isSorted,
            isAnimating,
            isPaused,
            animationSpeed,
            currentStep,
            handleSort,
            handlePauseResume,
            handleReset,
            setAnimationSpeed,
            getAnimationDelay,
            formatDelay,
            getTransitionDuration
      } = animation

      const containerRef = useRef<HTMLDivElement>(null)

      return (
            <div className="flex flex-col items-center justify-center w-full">
                  {/* Animation Controls with integrated status and button display */}
                  <AnimationControls
                        isAnimating={isAnimating}
                        isPaused={isPaused}
                        isSorted={isSorted}
                        onSort={handleSort}
                        onPauseResume={handlePauseResume}
                        onReset={handleReset}
                        buttonDisplay={buttonDisplay}
                        stepCount={stepCount}
                  />

                  {/* Speed Control */}
                  <SpeedControl
                        animationSpeed={animationSpeed}
                        onSpeedChange={setAnimationSpeed}
                        getAnimationDelay={getAnimationDelay}
                        formatDelay={formatDelay}
                  />

                  {/* Algorithm Legend */}
                  <AlgorithmLegend legend={quickSortUtils.legend} />

                  {/* Bars container with visual separators */}
                  <div ref={containerRef} className="w-full max-w-[84rem] mb-8">
                        <ul className='flex flex-row items-center justify-center gap-0.25 relative'>
                              {elementArray.map((element, index) => {
                                    const barWidth = Math.max(4, Math.min(12, 1050 / elementArray.length))
                                    const barHeight = Math.max(10, Math.min(400, (element / elementValueCeiling) * 400))
                                    const barColor = quickSortUtils.getBarColor(index, currentStep, isSorted)
                                    
                                    // Show range boundaries
                                    const showLeftBoundary = currentStep?.activeRange && index === currentStep.activeRange[0]
                                    const showRightBoundary = currentStep?.activeRange && index === currentStep.activeRange[1]

                                    return (
                                          <li
                                                key={index}
                                                className={`${barColor} transition-colors ease-in-out relative`}
                                                style={{
                                                      width: `${barWidth}px`,
                                                      height: `${barHeight}px`,
                                                      transitionDuration: getTransitionDuration()
                                                }}
                                          >
                                                {/* Left boundary line */}
                                                {showLeftBoundary && (
                                                      <div className="absolute left-0 top-0 h-full w-0.5 bg-yellow-400 z-10" />
                                                )}
                                                
                                                {/* Right boundary line */}
                                                {showRightBoundary && (
                                                      <div className="absolute right-0 top-0 h-full w-0.5 bg-yellow-400 z-10" />
                                                )}
                                                

                                          </li>
                                    )
                              })}
                        </ul>
                  </div>

                  {/* Children (presets and image analyzer) */}
                  {children}
            </div>
      )
} 