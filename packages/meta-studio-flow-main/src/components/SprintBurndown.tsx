import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const SprintBurndown = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['sprintBurndown'],
    queryFn: () => api.get('/gcp/project-management').then(res => res.data)
  });

  useEffect(() => {
    if (!chartRef.current || isLoading) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
          label: 'Story Points Remaining',
          data: [40, 38, 35, 34, 32], // From API or static
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        plugins: { title: { display: true, text: 'Sprint Burndown (65% Complete)' } }
      }
    });
  }, [data, isLoading]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Sprint Burndown</h3>
      <canvas ref={chartRef} />
    </div>
  );
};

export default SprintBurndown;