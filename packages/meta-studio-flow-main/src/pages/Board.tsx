import { JiraLayout } from "@/components/layout/JiraLayout";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Settings, Users, Calendar } from "lucide-react";

export default function Board() {
  return (
    <JiraLayout>
      <div className="h-full flex flex-col">
        {/* Board Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">Kanban Board</h1>
                <p className="text-sm text-muted-foreground">Meta Ad Studio</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Board settings
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10"
                />
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

              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Group by
              </Button>
            </div>
          </div>
        </div>

        {/* Board Content */}
        <div className="flex-1">
          <KanbanBoard />
        </div>
      </div>
    </JiraLayout>
  );
}