import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  subtitle?: string;
}

const KpiCard = ({ title, value, change, changeType = "neutral", icon: Icon, subtitle }: KpiCardProps) => {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary/70" />
          </div>
        )}
      </div>

      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">
        {value}
      </div>

      {(change || subtitle) && (
        <div className="flex items-center gap-2">
          {change && (
            <span
              className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-sm text-muted-foreground/70">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
