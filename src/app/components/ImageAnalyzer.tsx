"use client"

import { useState } from 'react'
import AnalysisResultsModal from './AnalysisResultsModal'

interface ImageAnalyzerProps {
      onArrayGenerated: (array: number[], length: number, maxValue: number) => void
      onProcessedImageUrl?: (imageUrl: string | null) => void
}

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

export default function ImageAnalyzer({ onArrayGenerated, onProcessedImageUrl }: ImageAnalyzerProps) {
      const [ selectedFile, setSelectedFile ] = useState<File | null>(null)
      const [ analysisParams, setAnalysisParams ] = useState({
            num_bars: 100,
            max_width_value: 30,
            threshold_value: 127
      })
      const [ isAnalyzing, setIsAnalyzing ] = useState(false)
      const [ analysisError, setAnalysisError ] = useState<string | null>(null)
      const [ analysisResults, setAnalysisResults ] = useState<AnalysisResults | null>(null)
      const [ showResults, setShowResults ] = useState(false)
      const [ isReversed, setIsReversed ] = useState(false)

      // Image analysis functions
      const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                  setSelectedFile(file)
                  setAnalysisError(null)
            }
      }

      const handleParamChange = (param: string, value: number) => {
            setAnalysisParams(prev => ({
                  ...prev,
                  [param]: value
            }))
      }

      const handleReverseImage = () => {
            if (analysisResults) {
                  const newIsReversed = !isReversed
                  setIsReversed(newIsReversed)
                  
                  // Use the appropriate array based on current state
                  const arrayToUse = newIsReversed ? analysisResults.reversed : analysisResults.original
                  
                  // Call the parent component's callback with the selected array
                  onArrayGenerated(
                        arrayToUse,
                        arrayToUse.length,
                        Math.max(...arrayToUse)
                  )
            }
      }

      const analyzeImage = async () => {
            if (!selectedFile) {
                  setAnalysisError('Please select an image first')
                  return
            }

            setIsAnalyzing(true)
            setAnalysisError(null)

            try {
                  const formData = new FormData()
                  formData.append('image', selectedFile)
                  formData.append('num_measurements', analysisParams.num_bars.toString())
                  formData.append('max_width_value', analysisParams.max_width_value.toString())
                  formData.append('threshold_value', analysisParams.threshold_value.toString())

                  const response = await fetch('http://localhost:5001/analyze-image', {
                        method: 'POST',
                        body: formData
                  })

                  const data = await response.json()

                  if (data.success) {
                        // Store analysis results
                        setAnalysisResults(data)
                        
                        // Call the parent component's callback with the generated array
                        onArrayGenerated(
                              data.original,
                              data.original.length,
                              Math.max(...data.original)
                        )
                        
                        // Call the callback with the processed image URL
                        if (onProcessedImageUrl) {
                              onProcessedImageUrl(data.image_url)
                        }
                        
                        console.log('Analysis successful:', data)
                  } else {
                        setAnalysisError(data.error || 'Analysis failed')
                  }
            } catch (error) {
                  setAnalysisError('Failed to connect to analysis server. Make sure the Flask API is running.')
                  console.error('Analysis error:', error)
            } finally {
                  setIsAnalyzing(false)
            }
      }

      return (
            <div className="w-full max-w-[calc(0.8*20rem)] p-3 m-3 border rounded-lg bg-gray-50">
                  <h2 className="text-sm font-semibold mb-3">🎨 Image Analyzer</h2>
                  
                  {/* File Type Info */}
                  <div className="mb-2">
                        <p className="text-[10px] text-gray-500">
                              Accepted file types: PNG, JPG, JPEG, GIF, BMP, TIFF, TIF, WEBP
                        </p>
                  </div>
                  
                  {/* File Upload */}
                  <div className="mb-3">
                        <div className="relative">
                              <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                              />
                              <label
                                    htmlFor="file-upload"
                                    className="block w-full p-2 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 cursor-pointer text-sm font-medium"
                              >
                                    Upload New Image
                              </label>
                        </div>
                        {selectedFile && (
                              <p className="text-xs text-gray-600 mt-1">
                                    Selected: {selectedFile.name}
                              </p>
                        )}
                  </div>

                  {/* Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                              <label className="block text-xs font-medium mb-1"># of Bars</label>
                              <input
                                    type="number"
                                    value={analysisParams.num_bars}
                                    onChange={(e) => handleParamChange('num_bars', parseInt(e.target.value))}
                                    min="10"
                                    max="200"
                                    className="w-full p-1 text-sm border rounded"
                              />
                        </div>
                        <div>
                              <label className="block text-xs font-medium mb-1">Max Width</label>
                              <input
                                    type="number"
                                    value={analysisParams.max_width_value}
                                    onChange={(e) => handleParamChange('max_width_value', parseInt(e.target.value))}
                                    min="5"
                                    max="50"
                                    className="w-full p-1 text-sm border rounded"
                              />
                        </div>
                        <div>
                              <label className="block text-xs font-medium mb-1">Threshold</label>
                              <input
                                    type="number"
                                    value={analysisParams.threshold_value}
                                    onChange={(e) => handleParamChange('threshold_value', parseInt(e.target.value))}
                                    min="0"
                                    max="255"
                                    className="w-full p-1 text-sm border rounded"
                              />
                              <p className="text-[10px] text-gray-600 mt-1">Range: 0-255</p>
                              <p className="text-[10px] text-gray-400">Low=use lights</p>
                              <p className="text-[10px] text-gray-800">High=use darks</p>
                        </div>
                  </div>

                  {/* Analyze Button */}
                  <button
                        onClick={analyzeImage}
                        disabled={!selectedFile || isAnalyzing}
                        className={`w-full p-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                              !selectedFile || isAnalyzing
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 cursor-pointer'
                        }`}
                  >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </button>

                  {/* View Results Button */}
                  {analysisResults && (
                        <button
                              onClick={() => setShowResults(!showResults)}
                              className="w-full p-2 mt-2 rounded-lg font-medium text-sm bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                              {showResults ? 'Hide Analysis Results' : 'View Analysis Results'}
                        </button>
                  )}

                  {/* Reverse Image Button */}
                  {analysisResults && (
                        <button
                              onClick={handleReverseImage}
                              className="w-full p-2 mt-2 rounded-lg font-medium text-sm bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                              {isReversed ? 'Use Original Image' : 'Reverse Image'}
                        </button>
                  )}

                  {/* Error Display */}
                  {analysisError && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                              {analysisError}
                        </div>
                  )}

                  {/* Analysis Results Modal */}
                  {showResults && analysisResults && (
                        <AnalysisResultsModal
                              isOpen={showResults}
                              onClose={() => setShowResults(false)}
                              analysisResults={analysisResults}
                        />
                  )}
            </div>
      )
} 