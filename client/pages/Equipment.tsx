import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
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
import { useEquipment } from "@/hooks/use-api";
import type { Equipment } from "@/lib/api";
import { useState } from "react";



const getStatusBadge = (status: string) => {
  switch (status) {
    case "в работе":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          в работе
        </Badge>
      );
    case "выключено / не в работе":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          выключено / не в работе
        </Badge>
      );
    case "выведено из эксплуатации":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          выведено из эксплуатации
        </Badge>
      );
    case "удалено":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          удалено
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
    type?: string;
  }>({});

  const { data: equipmentResponse, loading, error, refetch } = useEquipment({
    ...filters,
    search: searchQuery,
  });

  const equipment = equipmentResponse?.data || [];
  const stats = equipmentResponse?.stats || {
    total: 0,
    active: 0,
    inactive: 0,
    decommissioned: 0,
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Оборудование</h1>
          <p className="text-muted-foreground">
            Управление серверным и се��евым оборудованием
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить оборудование
        </Button>
      </div>

      {/* Stats Cards */}
      <LoadingState loading={loading} error={error} onRetry={refetch}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего оборудования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                всего единиц
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В работе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% от общего
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выключено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.inactive / stats.total) * 100).toFixed(1) : 0}% от общего
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Выведено из эксплуатации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.decommissioned}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.decommissioned / stats.total) * 100).toFixed(1) : 0}% от общего
              </p>
            </CardContent>
          </Card>
        </div>
      </LoadingState>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Список оборудования</CardTitle>
          <CardDescription>
            Полный список серверного и сетевого оборудования
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск оборудования..."
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Расположение</TableHead>
                <TableHead>Характеристики</TableHead>
                <TableHead>Ответственный</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item: Equipment) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <Link
                      to={`/equipment/${item.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.specs}
                  </TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/equipment/${item.id}`}>
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
              {equipment.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Оборудование не найдено
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
