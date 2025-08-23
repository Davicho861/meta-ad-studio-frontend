import React from 'react';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card border border-border rounded-lg p-4 shadow-md backdrop-blur-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold text-foreground mb-3">{children}</h2>
);

const Development = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-1">Desarrollo</h1>
          <p className="text-muted-foreground">Codificación frontend y backend.</p>
        </div>
      </div>

      <Card>
        <SectionTitle>Code Quality Dashboard</SectionTitle>
        <p className="text-muted-foreground">
          SonarQube simulation shows 18% fewer bugs.
        </p>
      </Card>

      <Card>
        <SectionTitle>Git Logs</SectionTitle>
        <p className="text-muted-foreground">
          Sortable table of recent commits.
        </p>
      </Card>
    </div>
  );
};

export default Development;
