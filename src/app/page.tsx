'use client'

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-between">
        <h1 className="mt-8 mb-2 text-xl font-bold">Sorting Algorithms</h1>
        <nav className="p-3 bg-gray-100 rounded-lg">
          <a href="/bubble-sort">
            <button className="px-4 py-1 m-1 text-white bg-blue-500 rounded-lg border-1 hover:bg-blue-600 hover:scale-105 transition-all duration-200 cursor-pointer">Bubble Sort</button>
          </a>
          <a href="/insertion-sort">
            <button className="px-4 py-1 m-1 text-white bg-blue-600 rounded-lg border-1 hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer">Insertion Sort</button>
          </a>
          <a href="/quick-sort">
            <button className="px-4 py-1 m-1 text-white bg-blue-700 rounded-lg border-1 hover:bg-blue-800 hover:scale-105 transition-all duration-200 cursor-pointer">Quick Sort</button>
          </a>
        </nav>
      </div>
      <div className="flex flex-col items-center justify-between">
        <h1 className="mt-8 mb-2 text-xl font-bold">Search Algorithms</h1>
        <nav className="p-3 bg-gray-100 rounded-lg">
          <a href="/___-search">
            <button className="px-4 py-1 m-1 text-white rounded-lg bg-amber-600 border-1 hover:bg-amber-700 hover:scale-105 transition-all duration-200 cursor-pointer">Coming Soon</button>
          </a>
        </nav>
      </div>
    </div>
  )
}