import { SortingStep } from '../algorithms/bubbleSort'
import { useAnimationControls } from '../hooks/useAnimationControls'
import AnimationControls from './AnimationControls'
import SpeedControl from './SpeedControl'
import AlgorithmLegend from './AlgorithmLegend'

interface AlgorithmUtils {
      getBarColor: (index: number, currentStep: SortingStep | null, isSorted: boolean) => string
      legend: { color: string; label: string }[]
}

interface BasicSortVisualizerProps {
      initialArray: number[]
      elementValueCeiling: number
      animatedGenerator: (arr: number[]) => Generator<SortingStep, void, unknown>
      fallbackSort: (arr: number[]) => { sortedArray: number[], stepCount: number }
      algorithmUtils: AlgorithmUtils
      buttonDisplay?: React.ReactNode // Algorithm name display
      children?: React.ReactNode // For presets and image analyzer
}

export default function BasicSortVisualizer({
      initialArray,
      elementValueCeiling,
      animatedGenerator,
      fallbackSort,
      algorithmUtils,
      buttonDisplay,
      children
}: BasicSortVisualizerProps) {
      const animation = useAnimationControls({
            initialArray,
            animatedGenerator,
            fallbackSort
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
                  <AlgorithmLegend legend={algorithmUtils.legend} />

                  {/* Bars container */}
                  <div className="w-full max-w-6xl mb-8">
                        <ul className='flex flex-row items-center justify-center gap-0.25'>
                              {elementArray.map((element, index) => {
                                    const barWidth = Math.max(4, Math.min(12, 1050 / elementArray.length))
                                    const barHeight = Math.max(10, Math.min(400, (element / elementValueCeiling) * 400))
                                    const barColor = algorithmUtils.getBarColor(index, currentStep, isSorted)

                                    return (
                                          <li
                                                key={index}
                                                className={`${barColor} transition-colors ease-in-out`}
                                                style={{
                                                      width: `${barWidth}px`,
                                                      height: `${barHeight}px`,
                                                      transitionDuration: getTransitionDuration()
                                                }}
                                          />
                                    )
                              })}
                        </ul>
                  </div>

                  {/* Children (presets and image analyzer) */}
                  {children}
            </div>
      )
} 