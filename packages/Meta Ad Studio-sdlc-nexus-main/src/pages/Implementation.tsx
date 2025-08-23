import React from 'react';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card border border-border rounded-lg p-4 shadow-md backdrop-blur-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold text-foreground mb-3">{children}</h2>
);

const Implementation = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-1">Implementación</h1>
          <p className="text-muted-foreground">Pruebas, evaluación y ajustes finales.</p>
        </div>
      </div>

      <Card>
        <SectionTitle>Testing Coverage Heatmap</SectionTitle>
        <p className="text-muted-foreground">
          Heatmap shows 90%+ coverage.
        </p>
      </Card>

      <Card>
        <SectionTitle>Failed Builds</SectionTitle>
        <p className="text-muted-foreground">
          Alerts for failed builds with auto-fix suggestions.
        </p>
      </Card>
    </div>
  );
};

export default Implementation;
