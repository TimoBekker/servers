import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Settings,
  Eye,
  Edit3,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";

const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

export default function BuilderAdminSafe() {
  const [builderStatus, setBuilderStatus] = useState<
    "checking" | "available" | "error"
  >("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBuilderStatus = async () => {
      try {
        if (!BUILDER_API_KEY) {
          throw new Error("API ключ не настроен");
        }

        // Попробуем импортировать Builder.io
        await import("@builder.io/react");
        setBuilderStatus("available");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        setBuilderStatus("error");
      }
    };

    checkBuilderStatus();
  }, []);

  const builderEditorUrl = BUILDER_API_KEY
    ? `https://builder.io/content/${BUILDER_API_KEY}`
    : "https://builder.io/content";

  const openBuilder = () => {
    window.open(builderEditorUrl, "_blank");
  };

  const openPreview = () => {
    window.open("/builder-preview/test", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Builder.io Управление</h1>
          <p className="text-muted-foreground">
            Управление контентом через Builder.io
          </p>
        </div>
        {builderStatus === "available" && BUILDER_API_KEY && (
          <Button onClick={openBuilder}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Открыт�� Builder.io
          </Button>
        )}
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Статус конфигурации</span>
          </CardTitle>
          <CardDescription>
            Текущее состояние интеграции Builder.io
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>API ключ Builder.io</span>
            {BUILDER_API_KEY ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Настроен
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Не настроен
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>SDK Builder.io</span>
            {builderStatus === "checking" && (
              <Badge variant="secondary">Проверка...</Badge>
            )}
            {builderStatus === "available" && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Доступен
              </Badge>
            )}
            {builderStatus === "error" && (
              <Badge className="bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Ошибка
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span>Статус интеграции</span>
            {builderStatus === "available" && BUILDER_API_KEY ? (
              <Badge className="bg-green-100 text-green-800">
                Готов к работе
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">
                Требует настройки
              </Badge>
            )}
          </div>

          {BUILDER_API_KEY && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                API Key: {BUILDER_API_KEY.substring(0, 8)}...
              </p>
            </div>
          )}

          {error && (
            <div className="pt-4 border-t">
              <p className="text-sm text-destructive">Ошибка: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5" />
              <span>Редактирование контента</span>
            </CardTitle>
            <CardDescription>
              Создавайте и редактируйте страницы в Builder.io
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Используйте визуальный редактор Builder.io для создания страниц
            </p>
            <div className="space-y-2">
              <Button
                onClick={openBuilder}
                disabled={builderStatus !== "available" || !BUILDER_API_KEY}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Открыть редактор
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Предварительный просмотр</span>
            </CardTitle>
            <CardDescription>Просматривайте созданные страницы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Просмотр страниц Builder.io на вашем сайте
            </p>
            <div className="space-y-2">
              <Button
                onClick={openPreview}
                variant="outline"
                className="w-full"
                disabled={builderStatus !== "available"}
              >
                <Eye className="w-4 h-4 mr-2" />
                Предварительный просмотр
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      {(!BUILDER_API_KEY || builderStatus === "error") && (
        <Card>
          <CardHeader>
            <CardTitle>Настройка Builder.io</CardTitle>
            <CardDescription>
              Следуйте этим шагам для настройки Builder.io
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Зарегистрируйтесь на{" "}
                <a
                  href="https://builder.io"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  builder.io
                </a>
              </li>
              <li>Создайте новый проект или используйте существующий</li>
              <li>Скопируйте API ключ из настроек проекта</li>
              <li>Добавьте API ключ в файл .env.local:</li>
            </ol>
            <div className="mt-4 p-3 bg-muted rounded-md font-mono text-sm">
              VITE_BUILDER_API_KEY=your-api-key-here
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              После добавления API ключа перезапустите dev сервер
            </p>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Документация</CardTitle>
          <CardDescription>Полезные ссылки и ресурсы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Builder.io</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <a
                    href="https://builder.io/c/docs"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Документация
                  </a>
                </li>
                <li>
                  <a
                    href="https://builder.io/content"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Панель управления
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Интеграция</h4>
              <ul className="text-sm space-y-1">
                <li>Маршрут: /builder-preview/*</li>
                <li>Модель: page</li>
                <li>API: React SDK</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
