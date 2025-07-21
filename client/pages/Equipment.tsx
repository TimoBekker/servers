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

// Sample equipment data
const equipment = [
  {
    id: "SRV-001",
    name: "Сервер DB-01",
    type: "Сервер",
    status: "в работе",
    location: "Стойка A1",
    specs: "Intel Xeon, 64GB RAM, 2TB SSD",
    responsible: "Иванов И.И.",
  },
  {
    id: "SW-001",
    name: "Коммутатор Core-01",
    type: "Сетевое оборудование",
    status: "в работе",
    location: "Стойка A2",
    specs: "48 портов Gigabit, 4x 10GB SFP+",
    responsible: "Петров П.П.",
  },
  {
    id: "UPS-001",
    name: "ИБП Rack-01",
    type: "Электропитание",
    status: "выключено / не в работе",
    location: "Стойка A1",
    specs: "3000VA, Online, 8 розеток",
    responsible: "Сидоров С.С.",
  },
  {
    id: "SRV-002",
    name: "Сервер Legacy-01",
    type: "Сервер",
    status: "выведено из эксплуатации",
    location: "Склад",
    specs: "Intel Pentium 4, 4GB RAM, 500GB HDD",
    responsible: "Архивариус А.А.",
  },
];

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
          выклю��ено / не в работе
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить оборудование
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего обор��дования
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 за последний месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">91.7% от общего</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выключено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">4.2% от общего</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Выведено из эксплуатации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">4.2% от общего</p>
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
              <Input placeholder="Поиск оборудования..." className="pl-8" />
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
              {equipment.map((item) => (
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
