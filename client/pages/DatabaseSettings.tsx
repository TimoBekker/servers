import { useState, useEffect } from "react";
import { Database, CheckCircle, XCircle, Loader2, Save, TestTube } from "lucide-react";
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
}

export default function DatabaseSettings() {
  const [config, setConfig] = useState<DatabaseConfig>({
    host: "localhost",
    port: "8000",
    database: "servers_db",
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
    
    try {
      // Проверяем health endpoint
      const healthResponse = await fetch(`http://${testConfig.host}:${testConfig.port}/api/health`);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        
        // Получаем статистику для проверки подключения к БД
        const statsResponse = await fetch(`http://${testConfig.host}:${testConfig.port}/api/equipment-statistics`);
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          
          setStatus({
            connected: true,
            message: "Подключение успешно",
            lastChecked: new Date().toLocaleString("ru-RU"),
            version: healthData.service || "Laravel API",
            tables: ["equipment", "software", "information_systems", "responsible_persons"],
          });
          
          toast({
            title: "Успешно",
            description: "Подключение к базе данных установлено",
          });
        } else {
          throw new Error("Ошибка доступа к данным");
        }
      } else {
        throw new Error(`HTTP ${healthResponse.status}`);
      }
    } catch (error) {
      setStatus({
        connected: false,
        message: error instanceof Error ? error.message : "Ошибка подключения",
        lastChecked: new Date().toLocaleString("ru-RU"),
      });
      
      toast({
        title: "Ошибка",
        description: "Не удалось подключиться к базе данных",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Сохраняем в localStorage
      localStorage.setItem("database-config", JSON.stringify(config));
      
      // Обновляем базовый URL в API клиенте
      const apiBaseUrl = `http://${config.host}:${config.port}/api`;
      localStorage.setItem("api-base-url", apiBaseUrl);
      
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
    setConfig(prev => ({
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
          Настройка подключения к PostgreSQL и Laravel API
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
              Настройки для подключения к Laravel API и PostgreSQL
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
                  placeholder="localhost"
                />
              </div>
              <div>
                <Label htmlFor="port">Порт API</Label>
                <Input
                  id="port"
                  value={config.port}
                  onChange={(e) => handleInputChange("port", e.target.value)}
                  placeholder="8000"
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
              <Label htmlFor="username">Пользователь (опционально)</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="postgres"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Пароль (опционально)</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="flex space-x-2 pt-4">
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
                  Убедитесь, что Laravel API запущен на указанном хосте и порту.
                  Проверьте настройки CORS в Laravel.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle>Доступные API endpoints</CardTitle>
          <CardDescription>
            Список основных API маршрутов для работы с данными
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Оборудование</h4>
              <div className="space-y-1 text-sm font-mono">
                <p>GET /api/equipment</p>
                <p>POST /api/equipment</p>
                <p>GET /api/equipment/{id}</p>
                <p>PUT /api/equipment/{id}</p>
                <p>DELETE /api/equipment/{id}</p>
                <p>GET /api/equipment-statistics</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Программное обеспечение</h4>
              <div className="space-y-1 text-sm font-mono">
                <p>GET /api/software</p>
                <p>POST /api/software</p>
                <p>GET /api/software/{id}</p>
                <p>PUT /api/software/{id}</p>
                <p>DELETE /api/software/{id}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Информационные системы</h4>
              <div className="space-y-1 text-sm font-mono">
                <p>GET /api/information-systems</p>
                <p>POST /api/information-systems</p>
                <p>GET /api/information-systems/{id}</p>
                <p>PUT /api/information-systems/{id}</p>
                <p>DELETE /api/information-systems/{id}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Системные</h4>
              <div className="space-y-1 text-sm font-mono">
                <p>GET /api/health</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}