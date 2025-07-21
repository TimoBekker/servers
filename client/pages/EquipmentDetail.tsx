import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Copy, Edit } from "lucide-react";
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

// Sample detailed equipment data
const equipmentData: { [key: string]: any } = {
  "SRV-001": {
    id: "SRV-001",
    name: "Сервер DB-01",
    vmwareName: "SMEV3-GIS-APP-03-T",
    hostname: "smev3-node1",
    status: "выключено / не в работе",
    type: "Виртуальный сервер",
    parentEquipment: "vc7cloud.guso.loc",
    description: "Узел 1 тестового СМЭВ 3.0 отключено 21.09.2023",
    ipAddresses: [
      {
        ip: "10.0.87.218",
        mask: "/23 (255.255.254.0)",
        vlan: "979 (Серверы РЦУП (Самара))",
        dns: "SMEV3-APP03T.tech.samregion.ru",
      },
      {
        ip: "10.100.10.250",
        mask: "/27 (255.255.255.224)",
        vlan: "2241vlan_SMEV3_10.100-TEST (/27)",
        dns: "",
      },
    ],
    responsible: [
      {
        organization: "Цифровой регион",
        name: "Кравченко Максим",
        company: "IT-Universe",
        role: "Ответственный за консультирование и ведение проекта",
        email: "kravchenko.m@it-universe.ru",
        phone: "+7 846 979 8080, +7 960 813 4440",
      },
      {
        organization: "Цифровой регион",
        name: "Белов Никита",
        company: "Цифровой регион",
        role: "Ответственный за администрирование ОС и ПО",
        email: "n.belov@rcu.samregion.ru",
        phone: "903",
      },
      {
        organization: "Цифровой регион",
        name: "Мальцев Андрей",
        company: "Цифровой регион",
        role: "Ответственный за администрирование ОС и ПО",
        email: "a.maltsev@digitalreg.ru",
        phone: "901",
      },
    ],
    characteristics: {
      vmwareLevel: "4 x 1",
      totalVirtualCpu: "4",
      ram: "16Gb (16384 Mb)",
      storage: [
        { name: "HDD1", size: "50 Gb" },
        { name: "HDD2", size: "10 Gb" },
      ],
    },
    software: ["Apache Tomcat 8"],
    informationSystems: ['Тестовый контур ГИС СО "СМЭВ"'],
    documentation: "не задано",
    equipmentStatus: {
      backup: "нет",
      lastBackupDate: "не задано",
      commissionedDate: "09.02.2016",
      decommissionedDate: "не задано",
    },
    relatedTickets: "не задано",
    securityParams: {
      kspdAccess: "есть",
      internetAccess: "есть",
      arcsightConnection: "нет",
      remoteAccess: "не задано",
      internetForwarding: "не задано",
      listeningPorts: "не задано",
    },
    passwords: [
      {
        username: "devel",
        password: "***hidden***",
        description: "Описание не задано",
      },
      {
        username: "root",
        password: "***hidden***",
        description: "m.iseckiy",
      },
    ],
  },
};

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

  if (!id || !equipmentData[id]) {
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
            Запрошенное оборудование не существует
          </p>
        </div>
      </div>
    );
  }

  const equipment = equipmentData[id];

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
              {equipment.vmwareName} • {equipment.hostname}
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
                <p className="font-medium">{equipment.vmwareName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Hostname
                </label>
                <p className="font-medium">{equipment.hostname}</p>
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
              <p className="font-medium">{equipment.parentEquipment}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Описание
              </label>
              <p className="font-medium">{equipment.description}</p>
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
                  {equipment.characteristics.vmwareLevel}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Виртуальных процессоров
                </label>
                <p className="font-medium">
                  {equipment.characteristics.totalVirtualCpu}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ОЗУ
              </label>
              <p className="font-medium">{equipment.characteristics.ram}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Хранилище
              </label>
              <div className="space-y-1">
                {equipment.characteristics.storage.map(
                  (storage: any, index: number) => (
                    <p key={index} className="font-medium">
                      {storage.name}: {storage.size}
                    </p>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IP Addresses */}
        <Card>
          <CardHeader>
            <CardTitle>IP-адреса, DNS-имена</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.ipAddresses.map((addr: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      IP
                    </label>
                    <p className="font-medium">{addr.ip}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Маска
                    </label>
                    <p className="font-medium">{addr.mask}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    VLAN
                  </label>
                  <p className="font-medium">{addr.vlan}</p>
                </div>
                {addr.dns && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      DNS
                    </label>
                    <p className="font-medium">{addr.dns}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Software & IS */}
        <Card>
          <CardHeader>
            <CardTitle>ПО и ИС</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Программное обеспечение
              </label>
              <div className="mt-2 space-y-1">
                {equipment.software.map((sw: string, index: number) => (
                  <p key={index} className="font-medium">
                    {sw}
                  </p>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Информационные системы
              </label>
              <div className="mt-2 space-y-1">
                {equipment.informationSystems.map(
                  (sys: string, index: number) => (
                    <p key={index} className="font-medium">
                      {sys}
                    </p>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsible People */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ответственные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {equipment.responsible.map((person: any, index: number) => (
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
                  {equipment.equipmentStatus.backup}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Последний бекап
                </label>
                <p className="font-medium">
                  {equipment.equipmentStatus.lastBackupDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Введено в эксплуатацию
                </label>
                <p className="font-medium">
                  {equipment.equipmentStatus.commissionedDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Выведено из эксплуатации
                </label>
                <p className="font-medium">
                  {equipment.equipmentStatus.decommissionedDate}
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
                  {equipment.securityParams.kspdAccess}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Доступ в Интернет
                </label>
                <p className="font-medium">
                  {equipment.securityParams.internetAccess}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Соединение с Arcsight
                </label>
                <p className="font-medium">
                  {equipment.securityParams.arcsightConnection}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Удаленный доступ
                </label>
                <p className="font-medium">
                  {equipment.securityParams.remoteAccess}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Проброс в интернет
                </label>
                <p className="font-medium">
                  {equipment.securityParams.internetForwarding}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Прослушиваемые порты
                </label>
                <p className="font-medium">
                  {equipment.securityParams.listeningPorts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passwords */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Пароли</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipment.passwords.map((pwd: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{pwd.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {pwd.description}
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
      </div>
    </div>
  );
}
