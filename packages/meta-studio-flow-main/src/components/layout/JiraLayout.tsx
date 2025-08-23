import { ReactNode } from "react";
import { JiraHeader } from "./JiraHeader";
import { JiraSidebar } from "./JiraSidebar";

interface JiraLayoutProps {
  children: ReactNode;
}

export function JiraLayout({ children }: JiraLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <JiraHeader />
      <div className="flex flex-1 overflow-hidden">
        <JiraSidebar />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}