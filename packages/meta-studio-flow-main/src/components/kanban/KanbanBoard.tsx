import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Paperclip,
  MessageSquare,
  MoreHorizontal
} from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columns = [
  { id: "backlog", title: "Backlog", limit: null },
  { id: "todo", title: "To Do", limit: 5 },
  { id: "progress", title: "In Progress", limit: 3 },
  { id: "review", title: "Review", limit: 4 },
  { id: "testing", title: "Testing", limit: 2 },
  { id: "deployed", title: "Deployed", limit: null },
  { id: "done", title: "Done", limit: null }
];

interface Issue {
  id: string;
  title: string;
  type: string;
  priority: string;
  assignee: { name: string; avatar: string };
  labels: string[];
  attachments: number;
  comments: number;
  status: string;
  storyPoints: number;
  epic: string;
}

const issuesData = [
  {
    id: "MAS-001",
    title: "Implement CloudBuild for Automated Deployments",
    type: "Story",
    priority: "High",
    assignee: { name: "John Doe", avatar: "JD" },
    labels: ["Cloud", "DevOps"],
    attachments: 3,
    comments: 2,
    status: "progress",
    storyPoints: 8,
    epic: "Cloud Architecture"
  },
  {
    id: "MAS-002",
    title: "Security Audit for Secrets Management",
    type: "Task",
    priority: "Highest",
    assignee: { name: "Jane Smith", avatar: "JS" },
    labels: ["Security", "Audit"],
    attachments: 1,
    comments: 5,
    status: "review",
    storyPoints: 5,
    epic: "Security & Compliance"
  },
  {
    id: "MAS-003",
    title: "AI Model Performance Optimization",
    type: "Story",
    priority: "Medium",
    assignee: { name: "Alex Johnson", avatar: "AJ" },
    labels: ["AI", "Performance"],
    attachments: 0,
    comments: 1,
    status: "todo",
    storyPoints: 13,
    epic: "AI Enhancement"
  },
  {
    id: "MAS-004",
    title: "Firebase Functions Deployment Pipeline",
    type: "Task",
    priority: "High",
    assignee: { name: "Maria Garcia", avatar: "MG" },
    labels: ["Firebase", "CI/CD"],
    attachments: 2,
    comments: 0,
    status: "testing",
    storyPoints: 3,
    epic: "Cloud Architecture"
  },
  {
    id: "MAS-005",
    title: "Multi-Cloud Load Balancer Configuration",
    type: "Story",
    priority: "Medium",
    assignee: { name: "David Chen", avatar: "DC" },
    labels: ["Cloud", "Infrastructure"],
    attachments: 1,
    comments: 3,
    status: "deployed",
    storyPoints: 8,
    epic: "Multi-Cloud Expansion"
  },
  {
    id: "MAS-006",
    title: "Dashboard Analytics Integration",
    type: "Story",
    priority: "Low",
    assignee: { name: "Sarah Wilson", avatar: "SW" },
    labels: ["Frontend", "Analytics"],
    attachments: 0,
    comments: 1,
    status: "done",
    storyPoints: 5,
    epic: "Data Analytics"
  },
  {
    id: "MAS-007",
    title: "API Rate Limiting Implementation",
    type: "Bug",
    priority: "High",
    assignee: { name: "John Doe", avatar: "JD" },
    labels: ["API", "Security"],
    attachments: 0,
    comments: 2,
    status: "backlog",
    storyPoints: 3,
    epic: "API Enhancement"
  },
  {
    id: "MAS-008",
    title: "Docker Container Optimization",
    type: "Task",
    priority: "Medium",
    assignee: { name: "Alex Johnson", avatar: "AJ" },
    labels: ["Docker", "Performance"],
    attachments: 1,
    comments: 0,
    status: "todo",
    storyPoints: 5,
    epic: "Infrastructure"
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
        default:
            return "bg-muted text-muted-foreground";
    }
};

function DraggableIssue({ issue }: { issue: Issue }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: issue.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={issue.id}
            className="jira-issue-card cursor-pointer"
        >
            <CardContent className="p-0">
                {/* Issue Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-muted-foreground">
                            {issue.id}
                        </span>
                        <Badge
                            variant="outline"
                            className={`text-xs ${getTypeColor(issue.type)}`}
                        >
                            {issue.type}
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                        {getPriorityIcon(issue.priority)}
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {/* Issue Title */}
                <h4 className="text-sm font-medium mb-2 line-clamp-2">
                    {issue.title}
                </h4>

                {/* Labels */}
                {issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {issue.labels.map((label) => (
                            <Badge
                                key={label}
                                variant="outline"
                                className="text-xs px-1 py-0"
                            >
                                {label}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Epic */}
                <div className="text-xs text-muted-foreground mb-2">
                    Epic: {issue.epic}
                </div>

                {/* Issue Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {issue.attachments > 0 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {issue.attachments}
                            </div>
                        )}
                        {issue.comments > 0 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {issue.comments}
                            </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                            {issue.storyPoints} SP
                        </div>
                    </div>
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                            {issue.assignee.avatar}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </Card>
    );
}

export function KanbanBoard() {
    const [issues, setIssues] = useState<Issue[]>(issuesData);
    const sensors = useSensors(useSensor(PointerSensor));

    const getIssuesForColumn = (columnId: string) => {
        return issues.filter(issue => issue.status === columnId);
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            setIssues((items) => {
                const activeIndex = items.findIndex((item) => item.id === active.id);
                const overIndex = items.findIndex((item) => item.id === over.id);

                if (items[activeIndex].status === items[overIndex].status) {
                    return arrayMove(items, activeIndex, overIndex);
                }

                const newItems = [...items];
                newItems[activeIndex] = { ...newItems[activeIndex], status: items[overIndex].status };
                return newItems;
            });
        }
    }, []);

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="h-full overflow-x-auto">
                <div className="flex space-x-4 h-full min-w-max p-4">
                    {columns.map((column) => {
                        const columnIssues = getIssuesForColumn(column.id);
                        const isOverLimit = column.limit && columnIssues.length > column.limit;

                        return (
                            <div key={column.id} className="flex-shrink-0 w-80">
                                <div className="bg-jira-gray-100 rounded-lg h-full flex flex-col">
                                    {/* Column Header */}
                                    <div className="p-3 border-b border-border">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium text-sm">{column.title}</h3>
                                                <Badge
                                                    variant={isOverLimit ? "destructive" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {columnIssues.length}
                                                    {column.limit && ` / ${column.limit}`}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        {isOverLimit && (
                                            <div className="flex items-center mt-2 text-xs text-destructive">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                WIP limit exceeded
                                            </div>
                                        )}
                                    </div>

                                    {/* Column Content */}
                                    <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                                        <SortableContext
                                            id={column.id}
                                            items={columnIssues.map((issue) => issue.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {columnIssues.map((issue) => (
                                                <DraggableIssue key={issue.id} issue={issue} />
                                            ))}
                                        </SortableContext>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DndContext>
    );
}