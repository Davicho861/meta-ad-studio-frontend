import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Target,
  Users,
  GitCommit,
  Cloud
} from "lucide-react";

const issuesByStatus = [
  { status: "To Do", count: 15, color: "bg-info" },
  { status: "In Progress", count: 8, color: "bg-warning" },
  { status: "In Review", count: 5, color: "bg-accent" },
  { status: "Done", count: 23, color: "bg-success" }
];

const assignedTasks = [
  {
    id: "MAS-123",
    title: "Implement CloudBuild for Automated Deployments",
    priority: "High",
    assignee: "John Doe",
    dueDate: "2024-12-22"
  },
  {
    id: "MAS-124",
    title: "Security Audit for Secrets Management",
    priority: "Highest",
    assignee: "Jane Smith",
    dueDate: "2024-12-20"
  },
  {
    id: "MAS-125",
    title: "AI Model Performance Optimization",
    priority: "Medium",
    assignee: "Alex Johnson",
    dueDate: "2024-12-25"
  }
];

const recentActivity = [
  {
    action: "Issue MAS-123 updated",
    user: "John Doe",
    time: "2h ago",
    type: "update"
  },
  {
    action: "Sprint 5 started",
    user: "System",
    time: "4h ago",
    type: "sprint"
  },
  {
    action: "MAS-124 moved to Review",
    user: "Jane Smith",
    time: "6h ago",
    type: "transition"
  }
];

const projectHealth = {
  planning: 25,
  design: 15,
  development: 35,
  testing: 20,
  deployment: 5
};

export function DashboardWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Issues by Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues by Status</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {issuesByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm">{item.status}</span>
                </div>
                <span className="text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Health</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Planning</span>
                <span>{projectHealth.planning}%</span>
              </div>
              <Progress value={projectHealth.planning} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Development</span>
                <span>{projectHealth.development}%</span>
              </div>
              <Progress value={projectHealth.development} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Testing</span>
                <span>{projectHealth.testing}%</span>
              </div>
              <Progress value={projectHealth.testing} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Burndown Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sprint Burndown</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sprint 5 - Acceleration to Beta</span>
              <Badge variant="outline">2 weeks</Badge>
            </div>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              Story points remaining
            </p>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground">
              65% complete - On track
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Assigned to Me */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned to Me</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assignedTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                    <Badge 
                      variant={task.priority === "Highest" ? "destructive" : 
                              task.priority === "High" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Due {task.dueDate}</span>
                  </div>
                </div>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cloud Infrastructure Status */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cloud Infrastructure</CardTitle>
          <Cloud className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">GCP Deployment</span>
              <Badge variant="default" className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Firebase Functions</span>
              <Badge variant="default" className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CI/CD Pipeline</span>
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Attention
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Milestones</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <div>
                <p className="text-sm font-medium">Beta Launch</p>
                <p className="text-xs text-muted-foreground">Dec 30, 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-info rounded-full" />
              <div>
                <p className="text-sm font-medium">Production Deployment</p>
                <p className="text-xs text-muted-foreground">Q1 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <div>
                <p className="text-sm font-medium">Global Launch</p>
                <p className="text-xs text-muted-foreground">Q2 2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}