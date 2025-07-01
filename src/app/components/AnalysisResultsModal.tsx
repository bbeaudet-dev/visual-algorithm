"use client"

interface AnalysisResults {
      success: boolean
      filename: string
      original: number[]
      reversed: number[]
      graph_urls: {
            scaled: string
            raw: string
            histogram: string
      }
      image_url: string
      statistics: {
            array_length: number
            min_width: number
            max_width: number
            base_width: number
            top_width: number
            bounding_box: {
                  x: number
                  y: number
                  width: number
                  height: number
            }
      }
}

interface AnalysisResultsModalProps {
      isOpen: boolean
      onClose: () => void
      analysisResults: AnalysisResults | null
}

export default function AnalysisResultsModal({ isOpen, onClose, analysisResults }: AnalysisResultsModalProps) {
      if (!isOpen || !analysisResults) return null

      return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-7xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold">Analysis Results</h3>
                              <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200 text-2xl font-bold cursor-pointer"
                              >
                                    ×
                              </button>
                        </div>

                        {/* Arrays and Image in one row */}
                        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                    <div className="space-y-3 mb-3">
                                          <div>
                                                <h5 className="text-sm font-medium mb-2">Statistics</h5>
                                                <div className="bg-blue-50 p-3 rounded border h-full flex flex-row gap-5 items-center justify-around">
                                                      <div className="text-xs space-y-1">
                                                            <div><strong>Min Width:</strong> {analysisResults.statistics.min_width}</div>
                                                            <div><strong>Max Width:</strong> {analysisResults.statistics.max_width}</div>
                                                            <div><strong>Top Width:</strong> {analysisResults.statistics.base_width}</div>
                                                            <div><strong>Base Width:</strong> {analysisResults.statistics.top_width}</div>
                                                      </div>
                                                      <div className="text-xs space-y-1">
                                                            <div><strong>Bounding Box:</strong></div>
                                                            <div className="ml-2"><strong>Coordinates:</strong> X: {analysisResults.statistics.bounding_box.x}, Y: {analysisResults.statistics.bounding_box.y}</div>
                                                            <div className="ml-2"><strong>Dimensions:</strong> Width: {analysisResults.statistics.bounding_box.width}, Height: {analysisResults.statistics.bounding_box.height}</div>
                                                            <div className="ml-2"><strong>Area:</strong> {analysisResults.statistics.bounding_box.width * analysisResults.statistics.bounding_box.height} pixels</div>
                                                      </div>
                                                </div>
                                          </div>
                                          <div className="space-y-3">
                                                <h5 className="text-sm font-medium mb-1">Arrays (Length: {analysisResults.original.length})</h5>
                                                <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-y-auto border">
                                                      {analysisResults.original.join(', ')}
                                                </div>
                                          </div>
                                          <div>
                                                <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-y-auto border">
                                                      {analysisResults.reversed.join(', ')}
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              <div>
                                    <h5 className="text-sm font-medium mb-2">Processed Image</h5>
                                    <img 
                                          src={`http://localhost:5001${analysisResults.image_url}`}
                                          alt="Processed Image"
                                          className="w-full rounded border max-h-96 object-contain"
                                    />
                              </div>
                        </div>
                        
                        {/* Graphs in one row */}
                        <div className="mb-6">
                              <h5 className="text-sm font-medium mb-2">Graphs</h5>
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <img 
                                          src={`http://localhost:5001/generated-images/${analysisResults.graph_urls.raw}`}
                                          alt="Raw Width Profile"
                                          className="w-full rounded border"
                                    />
                                    <img 
                                          src={`http://localhost:5001/generated-images/${analysisResults.graph_urls.scaled}`}
                                          alt="Scaled Width Profile"
                                          className="w-full rounded border"
                                    />
                                    <img 
                                          src={`http://localhost:5001/generated-images/${analysisResults.graph_urls.histogram}`}
                                          alt="Width Distribution"
                                          className="w-full rounded border"
                                    />
                              </div>
                        </div>

                  </div>
            </div>
      )
} 