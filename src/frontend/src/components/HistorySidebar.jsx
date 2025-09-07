import React, { useEffect } from 'react'
import useAdStore from '../store/adStore'

const HistorySidebar = () => {
  const history = useAdStore((s) => s.history)
  const loadHistory = useAdStore((s) => s.loadHistory)
  const loadGenerationById = useAdStore((s) => s.loadGenerationById)

  // loadHistory is intentionally stable (comes from a ref/parent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (!history || history.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-2">History</h3>
        <p className="text-sm text-gray-500">No generations yet.</p>
      </div>
    )
  }

  // Group by date (YYYY-MM-DD)
  const groups = history.reduce((acc, item) => {
    const day = (item.createdAt || item.id).slice(0, 10)
    acc[day] = acc[day] || []
    acc[day].push(item)
    return acc
  }, {})

  return (
    <div>
      <h3 className="font-semibold mb-2">History</h3>
      <div className="space-y-3 text-sm">
        {Object.keys(groups)
          .sort((a, b) => (a < b ? 1 : -1))
          .map((day) => (
            <div key={day}>
              <div className="text-xs text-gray-400 mb-1">{day}</div>
              <ul className="space-y-1">
                {groups[day].map((g) => (
                  <li key={g.id} className="flex items-center justify-between">
                    <button
                      className="text-left truncate text-blue-600 hover:underline"
                      onClick={() => loadGenerationById(g.id)}
                      title={g.prompt}
                    >
                      {g.parsed?.prompt || g.prompt}
                    </button>
                    <div className="text-gray-500 text-xs">{g.results?.length || 0}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  )
}

export default HistorySidebar
