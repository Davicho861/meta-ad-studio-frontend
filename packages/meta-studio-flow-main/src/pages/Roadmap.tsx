import { JiraLayout } from "@/components/layout/JiraLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Download,
  Share
} from "lucide-react";

const roadmapItems = [
  {
    id: "Q1-2025",
    title: "Strategic Planning & Architecture",
    description: "Foundation setup and strategic planning for Meta Ad Studio cloud infrastructure",
    status: "In Progress",
    progress: 75,
    startDate: "2024-12-01",
    endDate: "2025-03-31",
    milestones: [
      { name: "Cloud Architecture Design", date: "2024-12-15", status: "completed" },
      { name: "Security Framework", date: "2025-01-15", status: "in-progress" },
      { name: "Multi-Cloud Strategy", date: "2025-02-28", status: "planned" },
      { name: "Performance Baseline", date: "2025-03-15", status: "planned" }
    ],
    epics: [
      { name: "Cloud Architecture", progress: 85 },
      { name: "Security & Compliance", progress: 65 },
      { name: "Infrastructure Setup", progress: 75 }
    ]
  },
  {
    id: "Q2-2025",
    title: "AI Enhancement & Core Development",
    description: "AI model optimization and core platform development for advertising algorithms",
    status: "Planned",
    progress: 25,
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    milestones: [
      { name: "AI Model Architecture", date: "2025-04-15", status: "planned" },
      { name: "Performance Optimization", date: "2025-05-15", status: "planned" },
      { name: "Bias Detection System", date: "2025-06-01", status: "planned" },
      { name: "A/B Testing Framework", date: "2025-06-25", status: "planned" }
    ],
    epics: [
      { name: "AI Enhancement", progress: 30 },
      { name: "Data Analytics", progress: 20 },
      { name: "API Enhancement", progress: 25 }
    ]
  },
  {
    id: "Q3-2025",
    title: "Testing & Quality Assurance",
    description: "Comprehensive testing, quality assurance, and performance validation",
    status: "Planned",
    progress: 10,
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    milestones: [
      { name: "End-to-End Testing", date: "2025-07-15", status: "planned" },
      { name: "Performance Testing", date: "2025-08-15", status: "planned" },
      { name: "Security Penetration Testing", date: "2025-09-01", status: "planned" },
      { name: "Beta Release", date: "2025-09-25", status: "planned" }
    ],
    epics: [
      { name: "Quality Assurance", progress: 15 },
      { name: "Performance Testing", progress: 5 },
      { name: "Security Testing", progress: 10 }
    ]
  },
  {
    id: "Q4-2025",
    title: "Production Deployment & Launch",
    description: "Production deployment, monitoring setup, and global platform launch",
    status: "Planned",
    progress: 0,
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    milestones: [
      { name: "Production Deployment", date: "2025-10-15", status: "planned" },
      { name: "Monitoring & Alerting", date: "2025-11-01", status: "planned" },
      { name: "Global Rollout", date: "2025-11-30", status: "planned" },
      { name: "Post-Launch Optimization", date: "2025-12-20", status: "planned" }
    ],
    epics: [
      { name: "Production Deployment", progress: 0 },
      { name: "Monitoring & Observability", progress: 0 },
      { name: "Global Launch", progress: 0 }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-warning text-warning-foreground";
    case "Completed":
      return "bg-success text-success-foreground";
    case "Planned":
      return "bg-info text-info-foreground";
    case "At Risk":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getMilestoneIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-warning" />;
    case "at-risk":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <Target className="h-4 w-4 text-muted-foreground" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

export default function Roadmap() {
  return (
    <JiraLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">Roadmap</h1>
                <p className="text-sm text-muted-foreground">Meta Ad Studio • 2025 Development Timeline</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select defaultValue="all-quarters">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-quarters">All Quarters</SelectItem>
                  <SelectItem value="q1-2025">Q1 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="q3-2025">Q3 2025</SelectItem>
                  <SelectItem value="q4-2025">Q4 2025</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-epics">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Epic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-epics">All Epics</SelectItem>
                  <SelectItem value="cloud-arch">Cloud Architecture</SelectItem>
                  <SelectItem value="ai-enhancement">AI Enhancement</SelectItem>
                  <SelectItem value="security">Security & Compliance</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More filters
              </Button>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Overall Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">75%</div>
                    <div className="text-sm text-muted-foreground">Q1 2025</div>
                    <Progress value={75} className="mt-2 h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">25%</div>
                    <div className="text-sm text-muted-foreground">Q2 2025</div>
                    <Progress value={25} className="mt-2 h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">10%</div>
                    <div className="text-sm text-muted-foreground">Q3 2025</div>
                    <Progress value={10} className="mt-2 h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">0%</div>
                    <div className="text-sm text-muted-foreground">Q4 2025</div>
                    <Progress value={0} className="mt-2 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Items */}
            {roadmapItems.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">{item.progress}%</div>
                      <Progress value={item.progress} className="w-24 h-2" />
                    </div>
                  </div>

                  {/* Epics Progress */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-3">Epic Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {item.epics.map((epic) => (
                        <div key={epic.name} className="bg-muted rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{epic.name}</span>
                            <span className="text-sm text-muted-foreground">{epic.progress}%</span>
                          </div>
                          <Progress value={epic.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="font-medium mb-3">Key Milestones</h4>
                    <div className="space-y-2">
                      {item.milestones.map((milestone, milestoneIndex) => (
                        <div key={milestoneIndex} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                          {getMilestoneIcon(milestone.status)}
                          <div className="flex-1">
                            <span className="font-medium">{milestone.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(milestone.date)}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              milestone.status === "completed" ? "bg-success-light text-success" :
                              milestone.status === "in-progress" ? "bg-warning-light text-warning" :
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Connection */}
                  {index < roadmapItems.length - 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="w-px h-8 bg-border"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </JiraLayout>
  );
}