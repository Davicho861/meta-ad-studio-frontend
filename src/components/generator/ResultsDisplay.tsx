import React from 'react'
import useGeneratorStore from '../../store/generatorStore'

type AdConcept = { title: string; description: string }

const ResultsGrid: React.FC = () => {
  const placeholders = useGeneratorStore((s) => s.placeholders)
  const results = useGeneratorStore((s) => s.results)

  // Placeholder component con animación de pulso
  const PlaceholderCard = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded"></div>
      </div>
    </div>
  )

  // Result card component
  const ResultCard = ({ result }: { result: AdConcept }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
      <img
        src={`https://picsum.photos/seed/${encodeURIComponent(result.title)}/400/300`}
        alt={result.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-200 text-lg">{result.title}</h3>
        <p className="text-sm text-gray-400 mt-2">{result.description}</p>
      </div>
    </div>
  )

  return (
    <div className="h-full w-full p-4 pb-32 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Mostrar placeholders durante carga */}
        {placeholders && Array.from({ length: 4 }).map((_, idx) => (
          <PlaceholderCard key={`placeholder-${idx}`} />
        ))}

        {/* Mostrar resultados existentes */}
        {results.map((result: AdConcept, idx: number) => (
          <ResultCard key={`result-${idx}`} result={result} />
        ))}

        {/* Estado vacío */}
        {!placeholders && results.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">Comienza a crear</div>
              <div className="text-gray-500 text-sm">Usa la barra inferior para generar tus primeras ideas</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsGrid
