import { useIssues } from '../../hooks/useIssues';
import { useSprints } from '../../hooks/useSprints';
import { useGCPProjects } from '../../hooks/useGCPProjects';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function DashboardOverview() {
  const { data: issues = [], isLoading: isIssuesLoading } = useIssues({});
  const { data: sprints = [], isLoading: isSprintsLoading } = useSprints();
  const { data: gcpProjects = [], isLoading: isGCPLoading } = useGCPProjects();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Project Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Issues Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isIssuesLoading ? (
            <p>Loading issues...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>{issue.status}</TableCell>
                    <TableCell>{issue.priority}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          {isSprintsLoading ? (
            <p>Loading sprints...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sprints.map((sprint) => (
                  <TableRow key={sprint.id}>
                    <TableCell>{sprint.name}</TableCell>
                    <TableCell>{sprint.startDate || 'N/A'}</TableCell>
                    <TableCell>{sprint.endDate || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cloud Infrastructure Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isGCPLoading ? (
            <p>Loading GCP projects...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gcpProjects.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell>{project.projectId}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.lifecycleState}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
