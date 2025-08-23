import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Filter,
  GitBranch,
  Home,
  Kanban,
  Map,
  Plus,
  Search,
  Settings,
  Target,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const projectMenuItems = [
  { title: "Dashboards", icon: Home, href: "/", shortcut: "D" },
  { title: "Kanban Board", icon: Kanban, href: "/board", shortcut: "K" },
  { title: "Backlog", icon: FileText, href: "/backlog", shortcut: "B" },
  { title: "Issues", icon: Target, href: "/issues", shortcut: "I" },
  { title: "Roadmap", icon: Map, href: "/roadmap", shortcut: "R" },
  { title: "Reports", icon: BarChart3, href: "/reports", shortcut: "E" },
];

const addOns = [
  { title: "GCP Integration", icon: Zap },
  { title: "Firebase Console", icon: GitBranch },
  { title: "GitHub Actions", icon: Settings },
];

export function JiraSidebar() {
  const location = useLocation();
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isAddOnsOpen, setIsAddOnsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-jira-gray-50 border-r border-border h-full flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">M</span>
          </div>
          <span className="font-semibold text-sm">Meta Ad Studio</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            placeholder="Search..."
            className="pl-7 h-8 text-xs bg-card border-border"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Project Section */}
        <Collapsible open={isProjectOpen} onOpenChange={setIsProjectOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Project
            </span>
            {isProjectOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="space-y-1 px-2">
              {projectMenuItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={`jira-nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span className="flex-1">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                </NavLink>
              ))}
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Filters */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Quick Filters
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
              <Filter className="h-3 w-3 mr-2" />
              Assigned to me
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
              <Users className="h-3 w-3 mr-2" />
              My team's work
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
              <Calendar className="h-3 w-3 mr-2" />
              Due this week
            </Button>
          </div>
        </div>

        {/* Add-ons */}
        <Collapsible open={isAddOnsOpen} onOpenChange={setIsAddOnsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent border-t border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Add-ons
            </span>
            {isAddOnsOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1 px-2">
              {addOns.map((addon) => (
                <Button
                  key={addon.title}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  <addon.icon className="h-3 w-3 mr-2" />
                  {addon.title}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
          <Settings className="h-3 w-3 mr-2" />
          Project settings
        </Button>
      </div>
    </aside>
  );
}