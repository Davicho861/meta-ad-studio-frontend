import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Issue {
  id: string;
  title: string;
  status: string;
}

const fetchIssues = async (filter: string, searchTerm: string) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues`, { params: { filter, search: searchTerm } });
  return res.data;
};

const Issues = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: issues } = useQuery<Issue[]>(
    {
      queryKey: ['issues', filter, searchTerm],
      queryFn: () => fetchIssues(filter, searchTerm),
    }
  );

  return (
    <div>
      <h1>Issues</h1>
      <input
        type="text"
        placeholder="Search issues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="assigned-to-me">Assigned to me</option>
        <option value="team-work">My team's work</option>
        <option value="due-this-week">Due this week</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {issues?.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.id}</td>
              <td>{issue.title}</td>
              <td>{issue.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Issues;
