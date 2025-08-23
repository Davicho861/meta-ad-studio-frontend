import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Sprint 1', completed: 12, remaining: 5 },
  { name: 'Sprint 2', completed: 15, remaining: 3 },
  { name: 'Sprint 3', completed: 10, remaining: 8 },
];

const Reports = () => {
  return (
    <div>
      <h1>Reports</h1>
      <h2>Sprint Progress</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#8884d8" />
        <Bar dataKey="remaining" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default Reports;
