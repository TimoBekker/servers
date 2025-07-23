import { Link } from "react-router-dom";
import {
  Server,
  Monitor,
  Package,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { useDashboardStats, useSystemHealth, useRecentEvents } from "@/hooks/use-api";
import type { DashboardStats, SystemHealth, Event } from "@/lib/api";

const getQuickStats = (stats: DashboardStats | null) => [
  {
    title: "Оборудование",
    value: stats?.equipment_count?.toString() || "0",
    description: "единицы оборудования",
    icon: Server,
    href: "/equipment",
    color: "text-blue-600",
  },
  {
    title: "ИС",
    value: stats?.information_systems_count?.toString() || "0",
    description: "информационных систем",
    icon: Monitor,
    href: "/information-systems",
    color: "text-green-600",
  },
  {
    title: "Установленное ПО",
    value: stats?.software_count?.toString() || "0",
    description: "программных продуктов",
    icon: Package,
    href: "/software/installed",
    color: "text-purple-600",
  },
  {
    title: "Активные контракты",
    value: stats?.contracts_count?.toString() || "0",
    description: "действующих договоров",
    icon: FileText,
    href: "/contracts",
    color: "text-orange-600",
  },
];





const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "text-green-600";
    case "good":
      return "text-blue-600";
    case "warning":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "equipment":
      return Server;
    case "software":
      return Package;
    case "contract":
      return FileText;
    case "maintenance":
      return Activity;
    default:
      return Activity;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge className="bg-green-100 text-green-800">Успешно</Badge>;
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800">Внимание</Badge>;
    case "error":
      return <Badge className="bg-red-100 text-red-800">Ошибка</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Dashboard() {
  const { data: dashboardStats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: systemHealth, loading: healthLoading, error: healthError, refetch: refetchHealth } = useSystemHealth();
  const { data: recentEvents, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useRecentEvents();

  const quickStats = getQuickStats(dashboardStats);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в систему учета серверного оборудования и
          информационных систем
        </p>
      </div>

      {/* Quick Stats */}
      <LoadingState loading={statsLoading} error={statsError} onRetry={refetchStats}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Link key={stat.title} to={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </LoadingState>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Health */}
        <LoadingState loading={healthLoading} error={healthError} onRetry={refetchHealth}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Состояние системы</span>
              </CardTitle>
              <CardDescription>Статус оборудования по категориям</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth?.map((item: SystemHealth) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.online} из {item.total} активны
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item.online}</span>
                    </div>
                    {item.offline > 0 && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{item.offline}</span>
                      </div>
                    )}
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(item.status).replace("text-", "bg-")}`}
                    />
                  </div>
                </div>
              )) || []}
            </CardContent>
          </Card>
        </LoadingState>

        {/* Recent Events */}
        <LoadingState loading={eventsLoading} error={eventsError} onRetry={refetchEvents}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Последние события</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/events">Все события</Link>
                </Button>
              </CardTitle>
              <CardDescription>Недавние изменения в системе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEvents?.map((event: Event) => {
                const IconComponent = getEventIcon(event.type);
                return (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.title}</p>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.time}
                      </p>
                    </div>
                  </div>
                );
              }) || []}
            </CardContent>
          </Card>
        </LoadingState>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Ключевые показатели</span>
          </CardTitle>
          <CardDescription>Общая статистика системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">95.8%</div>
              <div className="text-sm text-muted-foreground">
                Время работы системы
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">
                Активных лицензий ПО
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-muted-foreground">
                Единиц оборудования
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
