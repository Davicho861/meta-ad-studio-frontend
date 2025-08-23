import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Paperclip, 
  MessageSquare,
  Calendar,
  User,
  Tag,
  Flag
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
}

interface IssueModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: Issue) => void;
}

const priorities = [
  { value: "Highest", icon: ArrowUp, color: "text-destructive" },
  { value: "High", icon: ArrowUp, color: "text-warning" },
  { value: "Medium", icon: Minus, color: "text-info" },
  { value: "Low", icon: ArrowDown, color: "text-success" }
];

const issueTypes = [
  { value: "Story", color: "bg-success" },
  { value: "Bug", color: "bg-destructive" },
  { value: "Task", color: "bg-info" },
  { value: "Epic", color: "bg-warning" }
];

export function IssueModal({ issue, isOpen, onClose, onSave }: IssueModalProps) {
  const [formData, setFormData] = useState<Issue>(
    issue || {
      id: "",
      title: "",
      description: "",
      type: "Story",
      priority: "Medium",
      status: "todo",
      assignee: { name: "", avatar: "" },
      reporter: { name: "Current User", avatar: "CU" },
      labels: [],
      storyPoints: 1,
      epic: "",
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      attachments: 0,
      comments: 0
    }
  );

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof Issue, value: string | number | string[] | { name: string; avatar: string }) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityIcon = (priority: string) => {
    const priorityData = priorities.find(p => p.value === priority);
    if (!priorityData) return null;
    const Icon = priorityData.icon;
    return <Icon className={`h-4 w-4 ${priorityData.color}`} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {issue ? `Edit Issue ${issue.id}` : "Create New Issue"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Summary *</label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter issue summary..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Add a description..."
                rows={6}
              />
            </div>

            {/* Attachments and Activity */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-4 mb-4">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach files
                </Button>
                <span className="text-sm text-muted-foreground">
                  {formData.attachments} attachments
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments ({formData.comments})
                </h4>
                <Textarea placeholder="Add a comment..." rows={3} />
                <Button size="sm">Add Comment</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Issue Type</label>
                  <Select value={formData.type} onValueChange={(value: "Story" | "Bug" | "Task" | "Epic") => updateField("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded ${type.color} mr-2`} />
                            {type.value}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={formData.priority} onValueChange={(value: "Highest" | "High" | "Medium" | "Low") => updateField("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center">
                            {getPriorityIcon(priority.value)}
                            <span className="ml-2">{priority.value}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Story Points</label>
                  <Select value={formData.storyPoints.toString()} onValueChange={(value) => updateField("storyPoints", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                        <SelectItem key={points} value={points.toString()}>
                          {points}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Epic</label>
                  <Select value={formData.epic} onValueChange={(value) => updateField("epic", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select epic..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cloud Architecture">Cloud Architecture</SelectItem>
                      <SelectItem value="AI Enhancement">AI Enhancement</SelectItem>
                      <SelectItem value="Security & Compliance">Security & Compliance</SelectItem>
                      <SelectItem value="Multi-Cloud Expansion">Multi-Cloud Expansion</SelectItem>
                      <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Assignee</label>
                  <Select value={formData.assignee.name} onValueChange={(value) => {
                    const names = value.split(' ');
                    updateField("assignee", { 
                      name: value, 
                      avatar: names.map(n => n[0]).join('')
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                      <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
                      <SelectItem value="David Chen">David Chen</SelectItem>
                      <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Labels</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.labels.map((label) => (
                      <Badge key={label} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                  <Input placeholder="Add label..." />
                </div>
              </CardContent>
            </Card>

            {/* Issue Details */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(formData.created).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{new Date(formData.updated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reporter:</span>
                    <div className="flex items-center">
                      <Avatar className="h-4 w-4 mr-1">
                        <AvatarFallback className="text-xs">
                          {formData.reporter.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span>{formData.reporter.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {issue ? "Update Issue" : "Create Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}