import { useState } from "react";
import { JiraLayout } from "@/components/layout/JiraLayout";
import { IssueModal } from "@/components/shared/IssueModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  SortAsc,
  SortDesc
} from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  type: "Story" | "Bug" | "Task" | "Epic";
  priority: "Highest" | "High" | "Medium" | "Low";
  status: string;
  assignee: { name: string; avatar: string };
  reporter: { name: string; avatar: string };
  labels: string[];
  storyPoints: number;
  epic: string;
  created: string;
  updated: string;
  attachments: number;
  comments: number;
  dueDate?: string;
}

const issues: Issue[] = [
  {
    id: "MAS-001",
    title: "Implement CloudBuild for Automated Deployments",
    description: "Set up CloudBuild pipeline for automated deployment to GCP environments",
    type: "Story",
    priority: "High",
    status: "In Progress",
    assignee: { name: "John Doe", avatar: "JD" },
    reporter: { name: "Sarah Wilson", avatar: "SW" },
    labels: ["Cloud", "DevOps", "Critical"],
    storyPoints: 8,
    epic: "Cloud Architecture",
    created: "2024-12-10T10:00:00Z",
    updated: "2024-12-18T15:30:00Z",
    attachments: 3,
    comments: 5,
    dueDate: "2024-12-22"
  },
  {
    id: "MAS-002",
    title: "Security Audit for Secrets Management",
    description: "Comprehensive security audit for all secrets and credentials management",
    type: "Task",
    priority: "Highest",
    status: "In Review",
    assignee: { name: "Jane Smith", avatar: "JS" },
    reporter: { name: "David Chen", avatar: "DC" },
    labels: ["Security", "Audit", "Compliance"],
    storyPoints: 5,
    epic: "Security & Compliance",
    created: "2024-12-08T09:15:00Z",
    updated: "2024-12-18T14:45:00Z",
    attachments: 1,
    comments: 8,
    dueDate: "2024-12-20"
  },
  {
    id: "MAS-003",
    title: "AI Model Performance Optimization",
    description: "Optimize machine learning models for better ad targeting performance",
    type: "Story",
    priority: "Medium",
    status: "To Do",
    assignee: { name: "Alex Johnson", avatar: "AJ" },
    reporter: { name: "Maria Garcia", avatar: "MG" },
    labels: ["AI", "Performance", "ML"],
    storyPoints: 13,
    epic: "AI Enhancement",
    created: "2024-12-05T14:20:00Z",
    updated: "2024-12-17T11:15:00Z",
    attachments: 0,
    comments: 3,
    dueDate: "2024-12-25"
  },
  {
    id: "MAS-004",
    title: "Firebase Functions Deployment Pipeline",
    description: "Create automated deployment pipeline for Firebase Cloud Functions",
    type: "Task",
    priority: "High",
    status: "Testing",
    assignee: { name: "Maria Garcia", avatar: "MG" },
    reporter: { name: "Alex Johnson", avatar: "AJ" },
    labels: ["Firebase", "CI/CD", "Cloud"],
    storyPoints: 3,
    epic: "Cloud Architecture",
    created: "2024-12-12T08:30:00Z",
    updated: "2024-12-18T16:20:00Z",
    attachments: 2,
    comments: 2,
    dueDate: "2024-12-23"
  },
  {
    id: "MAS-005",
    title: "OAuth Integration Bug Fix",
    description: "Fix critical OAuth 2.0 authentication bug causing login failures",
    type: "Bug",
    priority: "Highest",
    status: "In Progress",
    assignee: { name: "David Chen", avatar: "DC" },
    reporter: { name: "John Doe", avatar: "JD" },
    labels: ["Security", "Authentication", "Critical"],
    storyPoints: 2,
    epic: "Security & Compliance",
    created: "2024-12-16T11:45:00Z",
    updated: "2024-12-18T17:00:00Z",
    attachments: 0,
    comments: 12,
    dueDate: "2024-12-19"
  },
  {
    id: "MAS-006",
    title: "Multi-Cloud Load Balancer Setup",
    description: "Configure load balancer across multiple cloud providers",
    type: "Epic",
    priority: "Medium",
    status: "Done",
    assignee: { name: "Sarah Wilson", avatar: "SW" },
    reporter: { name: "Jane Smith", avatar: "JS" },
    labels: ["Infrastructure", "Multi-Cloud", "Load-Balancing"],
    storyPoints: 21,
    epic: "Multi-Cloud Expansion",
    created: "2024-11-28T13:10:00Z",
    updated: "2024-12-15T10:30:00Z",
    attachments: 4,
    comments: 15,
    dueDate: "2024-12-15"
  }
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    "To Do": "bg-info-light text-info border-info",
    "In Progress": "bg-warning-light text-warning border-warning",
    "In Review": "bg-accent text-accent-foreground border-border",
    "Testing": "bg-info-light text-info border-info",
    "Done": "bg-success-light text-success border-success"
  };
  
  return variants[status] || "bg-muted text-muted-foreground";
};

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

export default function Issues() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Issue | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Issue) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    const sorted = [...filteredIssues].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredIssues(sorted);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = issues.filter(issue => 
      issue.title.toLowerCase().includes(term.toLowerCase()) ||
      issue.id.toLowerCase().includes(term.toLowerCase()) ||
      issue.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredIssues(filtered);
  };

  const openIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const createNewIssue = () => {
    setSelectedIssue(null);
    setIsModalOpen(true);
  };

  const handleSaveIssue = (issue: Issue) => {
    console.log("Saving issue:", issue);
    // Here you would typically save to your backend
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const SortIcon = ({ field }: { field: keyof Issue }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <SortAsc className="h-3 w-3 ml-1" /> : 
      <SortDesc className="h-3 w-3 ml-1" />;
  };

  return (
    <JiraLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">Issues</h1>
                <p className="text-sm text-muted-foreground">Meta Ad Studio • {filteredIssues.length} issues</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={createNewIssue}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Issue
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all-status">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-assignee">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-assignee">All assignees</SelectItem>
                  <SelectItem value="me">Assigned to me</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More filters
              </Button>
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("type")}
                    className="font-medium"
                  >
                    Type
                    <SortIcon field="type" />
                  </Button>
                </TableHead>
                <TableHead className="w-24">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("id")}
                    className="font-medium"
                  >
                    Key
                    <SortIcon field="id" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("title")}
                    className="font-medium"
                  >
                    Summary
                    <SortIcon field="title" />
                  </Button>
                </TableHead>
                <TableHead className="w-20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("priority")}
                    className="font-medium"
                  >
                    Priority
                    <SortIcon field="priority" />
                  </Button>
                </TableHead>
                <TableHead className="w-28">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("status")}
                    className="font-medium"
                  >
                    Status
                    <SortIcon field="status" />
                  </Button>
                </TableHead>
                <TableHead className="w-24">Assignee</TableHead>
                <TableHead className="w-20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("storyPoints")}
                    className="font-medium"
                  >
                    SP
                    <SortIcon field="storyPoints" />
                  </Button>
                </TableHead>
                <TableHead className="w-28">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("updated")}
                    className="font-medium"
                  >
                    Updated
                    <SortIcon field="updated" />
                  </Button>
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow 
                  key={issue.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openIssue(issue)}
                >
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(issue.type)}`}>
                      {issue.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{issue.id}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium mb-1">{issue.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Epic: {issue.epic}
                      </div>
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
                        {issue.dueDate && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(issue.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getPriorityIcon(issue.priority)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getStatusBadge(issue.status)}`}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {issue.assignee.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{issue.storyPoints}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(issue.updated)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <IssueModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIssue}
      />
    </JiraLayout>
  );
}