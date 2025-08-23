import { JiraLayout } from "@/components/layout/JiraLayout";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  RefreshCw, 
  Settings, 
  Share, 
  Star,
  Calendar,
  BarChart3 
} from "lucide-react";

const Index = () => {
  return (
    <JiraLayout>
      <div className="p-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Meta Ad Studio Project Overview</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Star
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sprint</p>
                <p className="text-lg font-semibold">Sprint 5</p>
              </div>
              <Badge variant="default" className="bg-primary">
                Active
              </Badge>
            </div>
          </div>
          
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-lg font-semibold">51</p>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Velocity</p>
                <p className="text-lg font-semibold">42 SP</p>
              </div>
              <Badge variant="default" className="bg-success text-success-foreground">
                +15%
              </Badge>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Days to Release</p>
                <p className="text-lg font-semibold">8</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter dashboard
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex items-center text-sm text-muted-foreground">
            Last updated: 5 minutes ago
          </div>
        </div>

        {/* Dashboard Widgets */}
        <DashboardWidgets />
      </div>
    </JiraLayout>
  );
};

export default Index;
