import { JiraLayout } from "@/components/layout/JiraLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Clock,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  BarChart3
} from "lucide-react";

// Sample data for charts
const burndownData = [
  { day: "Day 1", planned: 50, actual: 50 },
  { day: "Day 2", planned: 45, actual: 48 },
  { day: "Day 3", planned: 40, actual: 42 },
  { day: "Day 4", planned: 35, actual: 38 },
  { day: "Day 5", planned: 30, actual: 32 },
  { day: "Day 6", planned: 25, actual: 28 },
  { day: "Day 7", planned: 20, actual: 22 },
  { day: "Day 8", planned: 15, actual: 18 },
  { day: "Day 9", planned: 10, actual: 12 },
  { day: "Day 10", planned: 5, actual: 8 },
  { day: "Day 11", planned: 0, actual: 3 }
];

const velocityData = [
  { sprint: "Sprint 1", planned: 25, completed: 23 },
  { sprint: "Sprint 2", planned: 30, completed: 28 },
  { sprint: "Sprint 3", planned: 35, completed: 32 },
  { sprint: "Sprint 4", planned: 40, completed: 38 },
  { sprint: "Sprint 5", planned: 42, completed: 40 }
];

const issueTypeData = [
  { name: "Story", value: 45, color: "#22c55e" },
  { name: "Bug", value: 15, color: "#ef4444" },
  { name: "Task", value: 30, color: "#3b82f6" },
  { name: "Epic", value: 10, color: "#f59e0b" }
];

const resolutionData = [
  { month: "Aug", resolved: 12, created: 15 },
  { month: "Sep", resolved: 18, created: 20 },
  { month: "Oct", resolved: 22, created: 18 },
  { month: "Nov", resolved: 28, created: 25 },
  { month: "Dec", resolved: 32, created: 30 }
];

const teamPerformanceData = [
  { member: "John Doe", completed: 8, assigned: 10, velocity: 80 },
  { member: "Jane Smith", completed: 12, assigned: 12, velocity: 100 },
  { member: "Alex Johnson", completed: 9, assigned: 11, velocity: 82 },
  { member: "Maria Garcia", completed: 7, assigned: 8, velocity: 88 },
  { member: "David Chen", completed: 10, assigned: 12, velocity: 83 },
  { member: "Sarah Wilson", completed: 11, assigned: 13, velocity: 85 }
];

const cumulativeFlowData = [
  { week: "Week 1", todo: 20, progress: 5, review: 2, done: 3 },
  { week: "Week 2", todo: 18, progress: 8, review: 4, done: 7 },
  { week: "Week 3", todo: 15, progress: 10, review: 6, done: 12 },
  { week: "Week 4", todo: 12, progress: 8, review: 5, done: 18 },
  { week: "Week 5", todo: 10, progress: 6, review: 3, done: 23 }
];

export default function Reports() {
  return (
    <JiraLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">Reports</h1>
                <p className="text-sm text-muted-foreground">Meta Ad Studio • Project Analytics & Insights</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select defaultValue="sprint-5">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sprints">All Sprints</SelectItem>
                  <SelectItem value="sprint-5">Sprint 5</SelectItem>
                  <SelectItem value="sprint-4">Sprint 4</SelectItem>
                  <SelectItem value="sprint-3">Sprint 3</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="last-month">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More filters
              </Button>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sprint Velocity</p>
                      <p className="text-2xl font-bold">42 SP</p>
                      <div className="flex items-center text-xs text-success">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5% from last sprint
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Team Efficiency</p>
                      <p className="text-2xl font-bold">87%</p>
                      <div className="flex items-center text-xs text-success">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +3% from last sprint
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Resolution Time</p>
                      <p className="text-2xl font-bold">2.3 days</p>
                      <div className="flex items-center text-xs text-destructive">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        +0.2 days from last sprint
                      </div>
                    </div>
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Issues Resolved</p>
                      <p className="text-2xl font-bold">32</p>
                      <div className="flex items-center text-xs text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        +8 from last sprint
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-info" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Burndown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sprint Burndown Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={burndownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="planned" 
                        stroke="#94a3b8" 
                        strokeDasharray="5 5"
                        name="Planned"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Actual"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Velocity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={velocityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sprint" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="planned" fill="#e2e8f0" name="Planned" />
                      <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issue Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Issue Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={issueTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {issueTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Resolution Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Issue Resolution Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={resolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="created" 
                        stackId="1" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.6}
                        name="Created"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="resolved" 
                        stackId="2" 
                        stroke="#22c55e" 
                        fill="#22c55e" 
                        fillOpacity={0.6}
                        name="Resolved"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Team Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformanceData.map((member) => (
                    <div key={member.member} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {member.member.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{member.member}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.completed}/{member.assigned} issues completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{member.velocity}%</p>
                          <p className="text-xs text-muted-foreground">Efficiency</p>
                        </div>
                        <Badge 
                          variant={member.velocity >= 90 ? "default" : member.velocity >= 80 ? "secondary" : "destructive"}
                          className={
                            member.velocity >= 90 ? "bg-success text-success-foreground" :
                            member.velocity >= 80 ? "bg-warning text-warning-foreground" :
                            "bg-destructive text-destructive-foreground"
                          }
                        >
                          {member.velocity >= 90 ? "Excellent" : member.velocity >= 80 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cumulative Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Flow Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cumulativeFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="done" stackId="1" stroke="#22c55e" fill="#22c55e" />
                    <Area type="monotone" dataKey="review" stackId="1" stroke="#e2e8f0" fill="#e2e8f0" />
                    <Area type="monotone" dataKey="progress" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="todo" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </JiraLayout>
  );
}