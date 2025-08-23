import { Search, Bell, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function JiraHeader() {
  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between">
      {/* Left side - Logo and navigation */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <h1 className="font-semibold text-foreground">Meta Ad Studio</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-sm">Your work</Button>
          <Button variant="ghost" size="sm" className="text-sm">Projects</Button>
          <Button variant="ghost" size="sm" className="text-sm">Dashboards</Button>
          <Button variant="ghost" size="sm" className="text-sm">Apps</Button>
        </nav>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search issues, boards, projects..."
            className="pl-10 bg-muted border-0 focus:bg-card focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Right side - Actions and user */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}