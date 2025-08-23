import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AppBarProps {
  username: string | null;
}

export function AppBar({ username }: AppBarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Meta Studio Flow</h1>
        <Input placeholder="Search issues, boards, projects..." className="w-64" />
      </div>
      
      <nav className="flex items-center space-x-4 mr-4">
        <Link to="/projects">
          <Button variant="ghost">Projects</Button>
        </Link>
        <Link to="/dashboards">
          <Button variant="ghost">Dashboards</Button>
        </Link>
        <Link to="/kanban">
          <Button variant="ghost">Kanban Board</Button>
        </Link>
        <Link to="/backlog">
          <Button variant="ghost">Backlog</Button>
        </Link>
        <Link to="/issues">
          <Button variant="ghost">Issues</Button>
        </Link>
        <Link to="/roadmap">
          <Button variant="ghost">Roadmap</Button>
        </Link>
        <Link to="/reports">
          <Button variant="ghost">Reports</Button>
        </Link>
      </nav>
      <div data-testid="username">{username}</div>
    </div>
  );
}
