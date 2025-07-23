import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

interface BuilderSafeProps {
  model?: string;
  path?: string;
  urlPath?: string;
}

export function BuilderSafe({
  model = "page",
  path = "",
  urlPath,
}: BuilderSafeProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [builderAvailable, setBuilderAvailable] = useState(false);

  useEffect(() => {
    // Проверяем доступность Builder.io
    const checkBuilder = async () => {
      try {
        if (!BUILDER_API_KEY) {
          throw new Error("API ключ не настроен");
        }

        // Динамически импортируем Builder.io только когда нужно
        const { Builder, BuilderComponent } = await import("@builder.io/react");
        
        Builder.init(BUILDER_API_KEY);
        setBuilderAvailable(true);
        setLoading(false);
      } catch (err) {
        console.error("Builder.io недоступен:", err);
        setError(err instanceof Error ? err.message : "Ошибка инициализации");
        setLoading(false);
      }
    };

    checkBuilder();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Инициализация Builder.io...</span>
      </div>
    );
  }

  if (error || !builderAvailable) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Builder.io недоступен</span>
          </CardTitle>
          <CardDescription>
            Визуальный редактор контента временно недоступен
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Причина: {error || "Неизвестная ошибка"}
          </p>
          
          {!BUILDER_API_KEY && (
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Для настройки Builder.io:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Получите API ключ на <a href="https://builder.io" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">builder.io</a></li>
                <li>Добавьте его в фа��л .env.local</li>
                <li>Перезапустите сервер</li>
              </ol>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </Button>
            {BUILDER_API_KEY && (
              <Button 
                variant="outline"
                onClick={() => window.open('https://builder.io/content', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Открыть Builder.io
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Если Builder.io доступен, показываем placeholder для контента
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold mb-2">Builder.io готов</h2>
      <p className="text-muted-foreground mb-4">
        Создайте контент в Builder.io для отображения на этой странице
      </p>
      <p className="text-sm text-muted-foreground">
        Путь: {urlPath || path || window.location.pathname}
      </p>
      <Button 
        className="mt-4"
        onClick={() => window.open(`https://builder.io/content/${BUILDER_API_KEY}`, '_blank')}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Редактировать в Builder.io
      </Button>
    </div>
  );
}

export default BuilderSafe;
