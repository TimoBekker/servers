import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { useContracts } from "@/hooks/use-api";
import type { Contract } from "@/lib/api";
import { useState } from "react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
    case "активный":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Активный
        </Badge>
      );
    case "expired":
    case "истек":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Истек
        </Badge>
      );
    case "ending_soon":
    case "заканчивается":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Заканчивается
        </Badge>
      );
    case "draft":
    case "черновик":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Черновик
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("ru-RU");
  } catch {
    return dateString;
  }
};

const formatAmount = (amount: number | undefined) => {
  if (!amount) return "н/д";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(amount);
};

export default function Contracts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
  }>({});

  const {
    data: contractsResponse,
    loading,
    error,
    refetch,
  } = useContracts({
    ...filters,
    search: searchQuery,
  });

  const contracts = contractsResponse?.data || [];
  const stats = contractsResponse?.stats || {
    total: 0,
    active: 0,
    expired: 0,
    ending_soon: 0,
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Контракты</h1>
          <p className="text-muted-foreground">
            Управление контрактами и договорами
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить контракт
        </Button>
      </div>

      {/* Stats Cards */}
      <LoadingState loading={loading} error={error} onRetry={refetch}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего контрактов
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">всего договоров</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? ((stats.active / stats.total) * 100).toFixed(1)
                  : 0}
                % от общего
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Истекают</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ending_soon}</div>
              <p className="text-xs text-muted-foreground">
                в ближайшие 30 дней
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Истекшие</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expired}</div>
              <p className="text-xs text-muted-foreground">требуют продления</p>
            </CardContent>
          </Card>
        </div>
      </LoadingState>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Список контрактов</CardTitle>
          <CardDescription>
            Полный список контрактов и договоров
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск контрактов..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>

          <LoadingState loading={loading} error={error} onRetry={refetch}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Начало</TableHead>
                  <TableHead>Окончание</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Поставщик</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((item: Contract) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <Link
                        to={`/contracts/${item.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{formatDate(item.start_date)}</TableCell>
                    <TableCell>{formatDate(item.end_date)}</TableCell>
                    <TableCell>{formatAmount(item.amount)}</TableCell>
                    <TableCell>{item.supplier || "н/д"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/contracts/${item.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contracts.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Контракты не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  );
}
