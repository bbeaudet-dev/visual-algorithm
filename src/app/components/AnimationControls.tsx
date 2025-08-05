interface AnimationControlsProps {
      isAnimating: boolean
      isPaused: boolean
      isSorted: boolean
      onSort: () => void
      onPauseResume: () => void
      onReset: () => void
      buttonDisplay?: React.ReactNode // Algorithm name display
      stepCount?: number // For status display
}

export default function AnimationControls({
      isAnimating,
      isPaused,
      isSorted,
      onSort,
      onPauseResume,
      onReset,
      buttonDisplay,
      stepCount = 0
}: AnimationControlsProps) {
      return (
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
                  {/* Controls Row with integrated button */}
                  <div className="flex flex-row items-center gap-4 w-full justify-center">
                        <div className="flex items-center gap-4">
                              <div 
                                    className={`p-2 rounded-lg min-w-[120px] text-center ${
                                          isSorted ? 'bg-green-100' : isAnimating ? 'bg-yellow-100' : 'bg-blue-100'
                                    }`}
                              >
                                    <span className="font-semibold">Steps: {stepCount}</span>
                              </div>
                              
                              {/* Main Sort Button with integrated algorithm name */}
                              {!isAnimating ? (
                                    <button
                                          className={`px-5 py-2 text-white rounded-xl text-bold text-md border-1 hover:scale-105 transition-all duration-200 cursor-pointer ${
                                                isSorted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                          }`}
                                          onClick={onSort}
                                          disabled={isSorted}
                                    >
                                          Start Animation
                                          {buttonDisplay && (
                                                <div className="text-[12px]">
                                                      {buttonDisplay}
                                                </div>
                                          )}
                                    </button>
                              ) : (
                                    <button
                                          onClick={onPauseResume}
                                          className="px-3 py-2 text-white bg-orange-500 rounded-xl hover:bg-orange-600 hover:scale-105 transition-all duration-200"
                                    >
                                          {isPaused ? 'Resume' : 'Pause'}
                                    </button>
                              )}
                              
                              <button
                                    className="px-3 py-2 text-white bg-gray-500 rounded-xl hover:bg-gray-600 hover:scale-105 transition-all duration-200"
                                    onClick={onReset}
                              >
                                    Reset
                              </button>
                        </div>
                  </div>
            </div>
      )
} 