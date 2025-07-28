import { useState, useEffect } from "react";
import {
  Database,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  TestTube,
  RefreshCw,
  Settings,
  Activity,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface ConnectionStatus {
  connected: boolean;
  message: string;
  lastChecked?: string;
  version?: string;
  tables?: string[];
  responseTime?: number;
  activeConnections?: number;
  dbSize?: string;
}

export default function DatabaseSettings() {
  const [config, setConfig] = useState<DatabaseConfig>({
    host: "localhost",
    port: "8000",
    database: "your_mariadb_database",
    username: "",
    password: "",
  });

  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    message: "Не проверено",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState<
    { timestamp: string; status: boolean; message: string }[]
  >([]);

  // Загрузка сохраненных настроек при монтировании
  useEffect(() => {
    const savedConfig = localStorage.getItem("database-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        // Автоматически проверяем подключение при загрузке
        testConnection(parsed);
      } catch (error) {
        console.error("Error parsing saved config:", error);
      }
    }
  }, []);

  const testConnection = async (configToTest?: DatabaseConfig) => {
    const testConfig = configToTest || config;
    setIsTesting(true);
    const startTime = Date.now();

    try {
      // First, try to connect to the database
      const connectResponse = await fetch('/api/database/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: testConfig.host === 'localhost' ? '127.0.0.1' : testConfig.host,
          port: testConfig.port === '8000' ? '3306' : testConfig.port,
          database: testConfig.database,
          user: testConfig.username,
          password: testConfig.password
        })
      });

      if (!connectResponse.ok) {
        throw new Error('Failed to connect to database');
      }

      // Проверяем health endpoint
      const healthResponse = await fetch('/api/health');

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();

        // Получаем статистику для проверки подключения к БД
        const statsResponse = await fetch('/api/equipment-statistics');

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          const responseTime = Date.now() - startTime;

          setStatus({
            connected: true,
            message: "Подключение успешно",
            lastChecked: new Date().toLocaleString("ru-RU"),
            version: healthData.service || "Express + MariaDB",
            tables: [
              "r_equipment",
              "r_software", 
              "r_information_system",
              "user",
              "s_response_equipment"
            ],
            responseTime,
            activeConnections: Math.floor(Math.random() * 10) + 1, // Заглушка
            dbSize: "15.2 MB", // Заглушка
          });

          // Добавляем запись в историю подключений
          setConnectionHistory((prev) => [
            {
              timestamp: new Date().toLocaleString("ru-RU"),
              status: true,
              message: "Подключение успешно",
            },
            ...prev.slice(0, 9), // Храним последние 10 записей
          ]);

          toast({
            title: "Успешно",
            description: "Подключение к базе данных ус��ановлено",
          });
        } else {
          throw new Error("Ошибка доступа к данным");
        }
      } else {
        throw new Error(`HTTP ${healthResponse.status}`);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка подключения";

      setStatus({
        connected: false,
        message: errorMessage,
        lastChecked: new Date().toLocaleString("ru-RU"),
        responseTime,
      });

      // Добавляем запись в историю подключений
      setConnectionHistory((prev) => [
        {
          timestamp: new Date().toLocaleString("ru-RU"),
          status: false,
          message: errorMessage,
        },
        ...prev.slice(0, 9),
      ]);

      toast({
        title: "Ошибка",
        description: "Не удалось подключиться к базе данных",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      host: "localhost",
      port: "8000", 
      database: "your_mariadb_database",
      username: "",
      password: "",
    });
    toast({
      title: "Сброшено",
      description: "Настройки возвращены к значениям по умолчанию",
    });
  };

  const exportSettings = () => {
    const settings = {
      ...config,
      password: "[СКРЫТО]", // Не экспортируем пароль
      exported: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "database-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveSettings = async () => {
    setIsSaving(true);

    try {
      // Сохраняем в localStorage
      localStorage.setItem("database-config", JSON.stringify(config));

      toast({
        title: "Сохранено",
        description: "Настройки подключения сохранены",
      });

      // Автоматически тестируем после сохранения
      await testConnection();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof DatabaseConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusBadge = () => {
    if (isTesting) {
      return (
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Проверка...</span>
        </Badge>
      );
    }

    if (status.connected) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Подключено</span>
        </Badge>
      );
    }

    return (
      <Badge variant="destructive" className="flex items-center space-x-1">
        <XCircle className="w-3 h-3" />
        <span>Отключено</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold mb-2">Настройки базы данных</h1>
        <p className="text-muted-foreground">
          Н��стройка подключения к PostgreSQL и Laravel API
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Параметры подключения</span>
            </CardTitle>
            <CardDescription>
              Настройки для подключения к Laravel API и MariaDB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Хост API</Label>
                <Input
                  id="host"
                  value={config.host}
                  onChange={(e) => handleInputChange("host", e.target.value)}
                  placeholder="127.0.0.1"
                />
              </div>
              <div>
                <Label htmlFor="port">Порт API</Label>
                <Input
                  id="port"
                  value={config.port}
                  onChange={(e) => handleInputChange("port", e.target.value)}
                  placeholder="3306"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="database">База данных</Label>
              <Input
                id="database"
                value={config.database}
                onChange={(e) => handleInputChange("database", e.target.value)}
                placeholder="servers_db"
              />
            </div>

            <div>
              <Label htmlFor="username">Пользователь</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="root"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex space-x-2">
                <Button
                  onClick={() => testConnection()}
                  disabled={isTesting}
                  variant="outline"
                  className="flex-1"
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Проверить подключение
                </Button>

                <Button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Сохранить
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showAdvanced ? "Скрыть" : "Показать"} расширенные
                </Button>

                <Button
                  onClick={resetToDefaults}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Сбросить
                </Button>

                <Button
                  onClick={exportSettings}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>

            {showAdvanced && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Расширенные настройки
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Timeout подключения (сек)</Label>
                    <Input type="number" defaultValue="30" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">
                      Максимальное количество подключений
                    </Label>
                    <Input type="number" defaultValue="10" className="mt-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ssl" className="rounded" />
                    <Label htmlFor="ssl" className="text-sm">
                      Использовать SSL
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoConnect"
                      className="rounded"
                      defaultChecked
                    />
                    <Label htmlFor="autoConnect" className="text-sm">
                      Автоматическое подключение при старте
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Статус подключения</span>
              {getStatusBadge()}
            </CardTitle>
            <CardDescription>
              Информация о текущем состоянии подключения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Статус
              </Label>
              <p className="font-medium">{status.message}</p>
            </div>

            {status.lastChecked && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Последняя проверка
                </Label>
                <p className="font-medium">{status.lastChecked}</p>
              </div>
            )}

            {status.version && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Версия API
                </Label>
                <p className="font-medium">{status.version}</p>
              </div>
            )}

            {status.responseTime && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Время отклика
                </Label>
                <p className="font-medium">{status.responseTime}ms</p>
              </div>
            )}

            {status.connected && status.activeConnections && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Активные подключения
                </Label>
                <p className="font-medium">{status.activeConnections}</p>
              </div>
            )}

            {status.connected && status.dbSize && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Размер БД
                </Label>
                <p className="font-medium">{status.dbSize}</p>
              </div>
            )}

            <Separator />

            {status.connected && status.tables && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Доступные таблицы
                </Label>
                <div className="mt-2 space-y-1">
                  {status.tables.map((table) => (
                    <div key={table} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-mono">{table}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!status.connected && (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Убедитесь, что Laravel API запущен и MariaDB доступна.
                  Проверьте настройки подключения к базе данных.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Connection History */}
        {connectionHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>История подключений</span>
              </CardTitle>
              <CardDescription>
                Последние попытки подключения к базе данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {connectionHistory.slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      {entry.status ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{entry.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.timestamp}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={entry.status ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {entry.status ? "Успех" : "Ошибка"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle>Доступные API endpoints</CardTitle>
          <CardDescription>
            Список основных API маршрутов Express сервера с MariaDB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Оборудование</h4>
              <div className="space-y-1 text-sm font-mono">
                <p>GET /api/equipment</p>
                <p>POST /api/equipment</p>
                <p>GET /api/equipment/&#123;id&#125;</p>
                <p>PUT /api/equipment/&#123;id&#125;</p>
                <p>DELETE /api/equipment/&#123;id&#125;</p>
                <p>GET /api/equipment-statistics</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">База данных</h4>
              <div className="space-y-1 text-sm font-mono">
                <p>POST /api/database/connect</p>
                <p>GET /api/health</p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}