import React from 'react';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card border border-border rounded-lg p-4 shadow-md backdrop-blur-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold text-foreground mb-3">{children}</h2>
);

const Planning = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-1">Planeación</h1>
          <p className="text-muted-foreground">Análisis de mercado y definición de requisitos.</p>
        </div>
      </div>

      <Card>
        <SectionTitle>Feature Roadmap</SectionTitle>
        <p className="text-muted-foreground">
          Gantt Chart placeholder for Dynamic Content, Shop Ads with Midjourney, etc.
        </p>
      </Card>

      <Card>
        <SectionTitle>Métricas Predictivas</SectionTitle>
        <p className="text-muted-foreground">
          AI analysis shows +35% alignment.
        </p>
      </Card>
    </div>
  );
};

export default Planning;
