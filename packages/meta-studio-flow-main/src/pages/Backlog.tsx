import { useState } from "react";
import { JiraLayout } from "@/components/layout/JiraLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import {
  Search,
  Filter,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus,
  PlayCircle,
  MoreHorizontal,
  Users,
  Target
} from "lucide-react";

interface BacklogItem {
  id: string;
  title: string;
  type: "Story" | "Bug" | "Task" | "Epic";
  priority: "Highest" | "High" | "Medium" | "Low";
  storyPoints: number;
  assignee?: { name: string; avatar: string };
  epic: string;
  labels: string[];
  description: string;
  status: "backlog" | "sprint";
}

const backlogItems: BacklogItem[] = [
  {
    id: "MAS-010",
    title: "Implement Real-time Analytics Dashboard",
    type: "Story",
    priority: "High",
    storyPoints: 13,
    assignee: { name: "Sarah Wilson", avatar: "SW" },
    epic: "Data Analytics",
    labels: ["Frontend", "Analytics", "Real-time"],
    description: "Create a comprehensive real-time analytics dashboard for Meta ad performance monitoring.",
    status: "backlog"
  },
  {
    id: "MAS-011",
    title: "Multi-Region Deployment Setup",
    type: "Epic",
    priority: "Highest",
    storyPoints: 21,
    assignee: { name: "David Chen", avatar: "DC" },
    epic: "Multi-Cloud Expansion",
    labels: ["Infrastructure", "Multi-Cloud", "Deployment"],
    description: "Set up multi-region deployment infrastructure across different cloud providers.",
    status: "backlog"
  },
  {
    id: "MAS-012",
    title: "AI Model Bias Detection",
    type: "Story",
    priority: "Medium",
    storyPoints: 8,
    assignee: { name: "Alex Johnson", avatar: "AJ" },
    epic: "AI Enhancement",
    labels: ["AI", "Ethics", "Quality"],
    description: "Implement bias detection algorithms for AI-driven ad targeting models.",
    status: "backlog"
  },
  {
    id: "MAS-013",
    title: "OAuth 2.0 Integration Bug",
    type: "Bug",
    priority: "High",
    storyPoints: 5,
    assignee: { name: "Jane Smith", avatar: "JS" },
    epic: "Security & Compliance",
    labels: ["Security", "Authentication", "Bug"],
    description: "Fix OAuth 2.0 integration issues causing authentication failures.",
    status: "backlog"
  },
  {
    id: "MAS-014",
    title: "Performance Monitoring Dashboard",
    type: "Task",
    priority: "Medium",
    storyPoints: 3,
    epic: "Infrastructure",
    labels: ["Monitoring", "Performance"],
    description: "Set up comprehensive performance monitoring for all services.",
    status: "backlog"
  },
  {
    id: "MAS-015",
    title: "Advanced Filtering System",
    type: "Story",
    priority: "Low",
    storyPoints: 8,
    assignee: { name: "Maria Garcia", avatar: "MG" },
    epic: "Data Analytics",
    labels: ["Frontend", "Filtering", "UX"],
    description: "Implement advanced filtering capabilities for ad campaign management.",
    status: "backlog"
  }
];

const sprintItems: BacklogItem[] = [
  {
    id: "MAS-001",
    title: "Implement CloudBuild for Automated Deployments",
    type: "Story",
    priority: "High",
    storyPoints: 8,
    assignee: { name: "John Doe", avatar: "JD" },
    epic: "Cloud Architecture",
    labels: ["Cloud", "DevOps"],
    description: "Set up CloudBuild for automated CI/CD pipeline.",
    status: "sprint"
  },
  {
    id: "MAS-002",
    title: "Security Audit for Secrets Management",
    type: "Task",
    priority: "Highest",
    storyPoints: 5,
    assignee: { name: "Jane Smith", avatar: "JS" },
    epic: "Security & Compliance",
    labels: ["Security", "Audit"],
    description: "Conduct comprehensive security audit for secrets management.",
    status: "sprint"
  },
  {
    id: "MAS-003",
    title: "AI Model Performance Optimization",
    type: "Story",
    priority: "Medium",
    storyPoints: 13,
    assignee: { name: "Alex Johnson", avatar: "AJ" },
    epic: "AI Enhancement",
    labels: ["AI", "Performance"],
    description: "Optimize AI model performance for better ad targeting.",
    status: "sprint"
  }
];

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Highest":
      return <ArrowUp className="h-3 w-3 text-destructive" />;
    case "High":
      return <ArrowUp className="h-3 w-3 text-warning" />;
    case "Medium":
      return <Minus className="h-3 w-3 text-info" />;
    case "Low":
      return <ArrowDown className="h-3 w-3 text-success" />;
    default:
      return <Minus className="h-3 w-3" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Story":
      return "bg-success text-success-foreground";
    case "Bug":
      return "bg-destructive text-destructive-foreground";
    case "Task":
      return "bg-info text-info-foreground";
    case "Epic":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function BacklogPage() {
  const [items, setItems] = useState({ backlog: backlogItems, sprint: sprintItems });
  const [selectedSprint] = useState("Sprint 5 - Acceleration to Beta");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...items[source.droppableId as keyof typeof items]];
      const destItems = [...items[destination.droppableId as keyof typeof items]];
      const [removed] = sourceItems.splice(source.index, 1);
      
      removed.status = destination.droppableId as "backlog" | "sprint";
      destItems.splice(destination.index, 0, removed);
      
      setItems({
        ...items,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      });
    } else {
      const columnItems = [...items[source.droppableId as keyof typeof items]];
      const [removed] = columnItems.splice(source.index, 1);
      columnItems.splice(destination.index, 0, removed);
      
      setItems({
        ...items,
        [source.droppableId]: columnItems
      });
    }
  };

  const sprintPoints = items.sprint.reduce((sum, item) => sum + item.storyPoints, 0);
  const backlogPoints = items.backlog.reduce((sum, item) => sum + item.storyPoints, 0);

  return (
    <JiraLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">Backlog</h1>
                <p className="text-sm text-muted-foreground">Meta Ad Studio</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Sprint
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Backlog settings
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search backlog..." className="pl-10" />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All people</SelectItem>
                  <SelectItem value="me">Assigned to me</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-epics">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Epic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-epics">All epics</SelectItem>
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

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {/* Current Sprint */}
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-semibold">{selectedSprint}</h2>
                        <Badge variant="default" className="bg-primary">
                          Active
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {sprintPoints} story points • {items.sprint.length} issues
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-24 h-2" />
                        <span className="text-sm text-muted-foreground">65%</span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Droppable droppableId="sprint">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-2">
                        {items.sprint.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border border-border rounded-lg p-3 bg-card hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="text-xs font-mono text-muted-foreground">
                                        {item.id}
                                      </span>
                                      <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                                        {item.type}
                                      </Badge>
                                      {getPriorityIcon(item.priority)}
                                    </div>
                                    <h4 className="font-medium mb-1">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-muted-foreground">Epic: {item.epic}</span>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground">{item.storyPoints} SP</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {item.assignee && (
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">
                                          {item.assignee.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>

              {/* Backlog */}
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-semibold">Backlog</h2>
                        <span className="text-sm text-muted-foreground">
                          {backlogPoints} story points • {items.backlog.length} issues
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Target className="h-4 w-4 mr-2" />
                          Plan
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Estimate
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Droppable droppableId="backlog">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-2">
                        {items.backlog.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border border-border rounded-lg p-3 bg-card hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="text-xs font-mono text-muted-foreground">
                                        {item.id}
                                      </span>
                                      <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                                        {item.type}
                                      </Badge>
                                      {getPriorityIcon(item.priority)}
                                    </div>
                                    <h4 className="font-medium mb-1">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                                    <div className="flex items-center space-x-4">
                                      <span className="text-xs text-muted-foreground">Epic: {item.epic}</span>
                                      <span className="text-xs text-muted-foreground">{item.storyPoints} SP</span>
                                      <div className="flex flex-wrap gap-1">
                                        {item.labels.slice(0, 3).map((label) => (
                                          <Badge key={label} variant="outline" className="text-xs px-1 py-0">
                                            {label}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {item.assignee && (
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">
                                          {item.assignee.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          </DragDropContext>
        </div>
      </div>
    </JiraLayout>
  );
}
