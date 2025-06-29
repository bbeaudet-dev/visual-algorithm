"use client"

interface ProcessedImageProps {
      imageUrl: string | null
}

export default function ProcessedImage({ imageUrl }: ProcessedImageProps) {
      if (!imageUrl) return null

      return (
            <div className="w-full max-w-[calc(0.8*20rem)] p-3 m-3 border rounded-lg bg-gray-50">
                  <h2 className="text-sm font-semibold mb-3">📷 Processed Image</h2>
                  <div className="relative">
                        <img 
                              src={`http://localhost:5001${imageUrl}`}
                              alt="Processed Image"
                              className="w-full rounded border"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                              Bounding Box
                        </div>
                  </div>
            </div>
      )
} 