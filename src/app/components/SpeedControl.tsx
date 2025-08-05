interface SpeedControlProps {
      animationSpeed: number
      onSpeedChange: (speed: number) => void
      getAnimationDelay: (speed: number) => number
      formatDelay: (delay: number) => string
}

export default function SpeedControl({
      animationSpeed,
      onSpeedChange,
      getAnimationDelay,
      formatDelay
}: SpeedControlProps) {
      const currentDelay = getAnimationDelay(animationSpeed)
      
      return (
            <div className="flex flex-col items-center mb-4">
                  <div className="flex items-center gap-4">
                        <label htmlFor="speed-slider" className="text-sm font-medium">
                              Animation Speed:
                        </label>
                        <input
                              id="speed-slider"
                              type="range"
                              min="1"
                              max="100"
                              value={animationSpeed}
                              onChange={(e) => onSpeedChange(Number(e.target.value))}
                              className="w-48"
                        />
                        <span className="text-sm font-mono min-w-[50px]">
                              {formatDelay(currentDelay)}
                        </span>
                  </div>
                  
                  {currentDelay <= 4 && (
                        <div className="text-red-500 text-xs mt-1">
                              ⚠️ Browser limit reached
                        </div>
                  )}
            </div>
      )
} 