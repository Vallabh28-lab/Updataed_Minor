import { Card } from "@/components/ui/card";

export function CaseCard({ legalCase }) {
  return (
    <Card className="rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-professional-lg hover:border-primary/20 cursor-pointer overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
              {legalCase.case_title || legalCase.title}
            </h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-md text-xs font-medium border">
              {legalCase.year}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {legalCase.description || "Case details and legal precedent information."}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4 text-muted-foreground">
            <span className="font-mono tracking-wide">
              {legalCase._id ? `ID: ${legalCase._id.slice(-8)}` : `ID: ${legalCase.id}`}
            </span>
          </div>
          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium uppercase tracking-wide">
            {legalCase.court_level || legalCase.court}
          </span>
        </div>
      </div>
    </Card>
  );
}