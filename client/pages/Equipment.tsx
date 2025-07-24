import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
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
import { useEquipment, useEquipmentStatistics } from "@/hooks/useEquipment";
import { Equipment as EquipmentType } from "@/lib/api";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: equipmentData, isLoading, error } = useEquipment({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
  });
  
  const { data: statistics, isLoading: statsLoading } = useEquipmentStatistics();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Оборудование</h1>
            <p className="text-muted-foreground">
              Управление серверным и сетевым оборудованием
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Ошибка загрузки данных. Проверьте подключение к серверу.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Оборудование</h1>
          <p className="text-muted-foreground">
            Управление серверным и сетевым оборудованием
          </p>
        </div>
        <Button asChild>
          <Link to="/equipment/new">
            <Plus className="w-4 h-4 mr-2" />
            Добавить оборудование
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего оборудования
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Загрузка...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statistics?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  единиц оборудования
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Загрузка...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statistics?.by_status?.["в работе"] || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.total 
                    ? Math.round(((statistics.by_status?.["в работе"] || 0) / statistics.total) * 100)
                    : 0}% от общего
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выключено</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Загрузка...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statistics?.by_status?.["выключено / не в работе"] || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.total 
                    ? Math.round(((statistics.by_status?.["выключено / не в работе"] || 0) / statistics.total) * 100)
                    : 0}% от общего
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Выведено из эксплуатации
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Загрузка...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statistics?.by_status?.["выведено из эксплуатации"] || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.total 
                    ? Math.round(((statistics.by_status?.["выведено из эксплуатации"] || 0) / statistics.total) * 100)
                    : 0}% от общего
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Загрузка оборудования...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Расположение</TableHead>
                  <TableHead>Характеристики</TableHead>
                  <TableHead>Ответственные</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentData?.data?.map((item: EquipmentType) => (
                  <TableRow key={item.equipment_id}>
                    <TableCell className="font-medium">{item.equipment_id}</TableCell>
                    <TableCell>
                      <Link
                        to={`/equipment/${item.equipment_id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.location || 'Не указано'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.specifications || 'Не указано'}
                    </TableCell>
                    <TableCell>
                      {item.responsible_persons?.length > 0 
                        ? item.responsible_persons[0].name
                        : 'Не назначен'
                      }
                      {item.responsible_persons?.length > 1 && (
                        <span className="text-muted-foreground">
                          {' '}и еще {item.responsible_persons.length - 1}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/equipment/${item.equipment_id}`}>
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
                {equipmentData?.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Оборудование не найдено' : 'Нет оборудования'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {equipmentData && equipmentData.last_page > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Показано {equipmentData.from}-{equipmentData.to} из {equipmentData.total} записей
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Предыдущая
                </Button>
                <span className="text-sm">
                  Страница {currentPage} из {equipmentData.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === equipmentData.last_page}
                >
                  Следующая
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
