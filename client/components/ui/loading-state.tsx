import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function LoadingState({ loading, error, onRetry, children }: LoadingStateProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Загрузка...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Ошибка загрузки данных</span>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {error}
          </p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Попробовать снова
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

// Smaller loading spinner for inline use
export function LoadingSpinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }[size];

  return <Loader2 className={`${sizeClass} animate-spin`} />;
}

// Error message component
export function ErrorMessage({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center space-x-2 text-destructive py-4">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm">{error}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}
