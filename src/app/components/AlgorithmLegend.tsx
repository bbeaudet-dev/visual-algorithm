interface LegendItem {
      color: string
      label: string
}

interface AlgorithmLegendProps {
      legend: LegendItem[]
}

export default function AlgorithmLegend({ legend }: AlgorithmLegendProps) {
      return (
            <div className="flex items-center gap-6 mb-4 text-sm">
                  {legend.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                              <div className={`w-4 h-4 ${item.color} rounded`}></div>
                              <span>{item.label}</span>
                        </div>
                  ))}
            </div>
      )
} 