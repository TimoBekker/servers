import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Copy, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useEquipmentDetail } from "@/hooks/useEquipment";
import { toast } from "@/hooks/use-toast";

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

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: string]: boolean;
  }>({});

  const { data: equipment, isLoading, error } = useEquipmentDetail(id || '');

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Скопировано",
        description: "Пароль скопирован в буфер обмена",
      });
    });
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/equipment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">ID оборудования не указан</h2>
          <p className="text-muted-foreground">
            Необходимо указать ID оборудования
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/equipment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Загрузка данных оборудования...</span>
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/equipment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Оборудование не найдено</h2>
          <p className="text-muted-foreground">
            Запрошенное оборудование не существует или произошла ошибка загрузки
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'не задано';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/equipment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{equipment.name}</h1>
            <p className="text-muted-foreground">
              {equipment.vmware_name || 'VMware имя не указано'} • {equipment.hostname || 'Hostname не указан'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(equipment.status)}
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  VMware-имя
                </label>
                <p className="font-medium">{equipment.vmware_name || 'не указано'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Hostname
                </label>
                <p className="font-medium">{equipment.hostname || 'не указано'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Тип
                </label>
                <p className="font-medium">{equipment.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Статус
                </label>
                <div className="mt-1">{getStatusBadge(equipment.status)}</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Родительское оборудование
              </label>
              <p className="font-medium">{equipment.parent_equipment || 'не указано'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Описание
              </label>
              <p className="font-medium">{equipment.description || 'не указано'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Characteristics */}
        <Card>
          <CardHeader>
            <CardTitle>Характеристики</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Уровень VMware
                </label>
                <p className="font-medium">
                  {equipment.vmware_level || 'не указано'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Виртуальных процессоров
                </label>
                <p className="font-medium">
                  {equipment.virtual_cpu || 'не указано'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ОЗУ
              </label>
              <p className="font-medium">{equipment.ram || 'не указано'}</p>
            </div>
            {equipment.storage && equipment.storage.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Хранилище
                </label>
                <div className="space-y-1">
                  {equipment.storage.map((storage, index) => (
                    <p key={index} className="font-medium">
                      {storage.name}: {storage.size}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IP Addresses */}
        {equipment.ip_addresses && equipment.ip_addresses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>IP-адреса, DNS-имена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.ip_addresses.map((addr, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        IP
                      </label>
                      <p className="font-medium">{addr.ip_address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Маска
                      </label>
                      <p className="font-medium">{addr.subnet_mask}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      VLAN
                    </label>
                    <p className="font-medium">{addr.vlan}</p>
                  </div>
                  {addr.dns_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        DNS
                      </label>
                      <p className="font-medium">{addr.dns_name}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Software & IS */}
        <Card>
          <CardHeader>
            <CardTitle>ПО и ИС</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.software && equipment.software.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Программное обеспечение
                </label>
                <div className="mt-2 space-y-1">
                  {equipment.software.map((sw, index) => (
                    <p key={index} className="font-medium">
                      {sw.name} {sw.version && `v${sw.version}`}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <Separator />
            {equipment.information_systems && equipment.information_systems.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Информационные системы
                </label>
                <div className="mt-2 space-y-1">
                  {equipment.information_systems.map((sys, index) => (
                    <p key={index} className="font-medium">
                      {sys.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responsible People */}
        {equipment.responsible_persons && equipment.responsible_persons.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ответственные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {equipment.responsible_persons.map((person, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div>
                      <p className="font-semibold">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ({person.company})
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Роль
                      </label>
                      <p className="text-sm">{person.role}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-sm font-mono">{person.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Телефон
                      </label>
                      <p className="text-sm">{person.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Статус оборудования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Резервное копирование
                </label>
                <p className="font-medium">
                  {equipment.has_backup ? 'есть' : 'нет'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Последний бекап
                </label>
                <p className="font-medium">
                  {formatDate(equipment.last_backup_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Введено в эксплуатацию
                </label>
                <p className="font-medium">
                  {formatDate(equipment.commissioned_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Выведено из эксплуатации
                </label>
                <p className="font-medium">
                  {formatDate(equipment.decommissioned_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Параметры информационной безопасности</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Доступ в КСПД
                </label>
                <p className="font-medium">
                  {equipment.kspd_access ? 'есть' : 'нет'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Доступ в Интернет
                </label>
                <p className="font-medium">
                  {equipment.internet_access ? 'есть' : 'нет'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Соединение с Arcsight
                </label>
                <p className="font-medium">
                  {equipment.arcsight_connection ? 'есть' : 'нет'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Удаленный доступ
                </label>
                <p className="font-medium">
                  {equipment.remote_access || 'не задано'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Проброс в интернет
                </label>
                <p className="font-medium">
                  {equipment.internet_forwarding || 'не задано'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Прослушиваемые порты
                </label>
                <p className="font-medium">
                  {equipment.listening_ports || 'не задано'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passwords */}
        {equipment.passwords && equipment.passwords.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Пароли</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.passwords.map((pwd, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{pwd.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {pwd.description || 'Описание не задано'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm">
                        {visiblePasswords[index] ? pwd.password : "••••••••"}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePasswordVisibility(index)}
                      >
                        {visiblePasswords[index] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(pwd.password)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
