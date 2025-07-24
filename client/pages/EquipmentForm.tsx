import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Server,
  Network,
  HardDrive,
  Zap,
  Database,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import {
  useEquipmentDetail,
  useCreateEquipment,
  useUpdateEquipment,
} from "@/hooks/useEquipment";
import { Equipment } from "@/lib/api";

// Validation schema
const equipmentSchema = z.object({
  equipment_id: z.string().min(1, "ID оборудования обязателен"),
  name: z.string().min(1, "Название обязательно"),
  vmware_name: z.string().optional(),
  hostname: z.string().optional(),
  status: z.enum(["в работе", "выключено / не в работе", "выведено из эксплуатации", "удалено"]),
  type: z.enum(["Сервер", "Виртуальный сервер", "Сетевое оборудование", "Электропитание", "Система хранения"]),
  parent_equipment: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  specifications: z.string().optional(),
  vmware_level: z.string().optional(),
  virtual_cpu: z.number().optional(),
  ram: z.string().optional(),
  has_backup: z.boolean().default(false),
  last_backup_date: z.string().optional(),
  commissioned_date: z.string().optional(),
  decommissioned_date: z.string().optional(),
  kspd_access: z.boolean().default(false),
  internet_access: z.boolean().default(false),
  arcsight_connection: z.boolean().default(false),
  remote_access: z.string().optional(),
  internet_forwarding: z.string().optional(),
  listening_ports: z.string().optional(),
  documentation: z.string().optional(),
  related_tickets: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

const statusOptions = [
  { value: "в работе", label: "В работе", icon: CheckCircle, color: "text-green-600" },
  { value: "выключено / не в работе", label: "Выключено / не в работе", icon: XCircle, color: "text-yellow-600" },
  { value: "выведено из эксплуатации", label: "Выведено из эксплуатации", icon: XCircle, color: "text-orange-600" },
  { value: "удалено", label: "Удалено", icon: Trash2, color: "text-red-600" },
];

const typeOptions = [
  { value: "Сервер", label: "Сервер", icon: Server },
  { value: "Виртуальный сервер", label: "Вир��уальный сервер", icon: Server },
  { value: "Сетевое оборудование", label: "Сетевое оборудование", icon: Network },
  { value: "Электропитание", label: "Электропитание", icon: Zap },
  { value: "Система хранения", label: "Система хранения", icon: Database },
];

interface StorageEntry {
  id?: number;
  name: string;
  size: string;
}

interface IpAddressEntry {
  id?: number;
  ip_address: string;
  subnet_mask: string;
  vlan: string;
  dns_name?: string;
}

interface PasswordEntry {
  id?: number;
  username: string;
  password: string;
  description?: string;
}

export default function EquipmentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Data fetching
  const { data: equipment, isLoading: isLoadingEquipment } = useEquipmentDetail(id || "");
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();

  // Form state
  const [storage, setStorage] = useState<StorageEntry[]>([]);
  const [ipAddresses, setIpAddresses] = useState<IpAddressEntry[]>([]);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      has_backup: false,
      kspd_access: false,
      internet_access: false,
      arcsight_connection: false,
    },
  });

  // Watch form values for conditional rendering
  const equipmentType = watch("type");
  const hasBackup = watch("has_backup");

  // Load equipment data when editing
  useEffect(() => {
    if (isEditing && equipment) {
      reset({
        equipment_id: equipment.equipment_id,
        name: equipment.name,
        vmware_name: equipment.vmware_name || "",
        hostname: equipment.hostname || "",
        status: equipment.status,
        type: equipment.type,
        parent_equipment: equipment.parent_equipment || "",
        description: equipment.description || "",
        location: equipment.location || "",
        specifications: equipment.specifications || "",
        vmware_level: equipment.vmware_level || "",
        virtual_cpu: equipment.virtual_cpu,
        ram: equipment.ram || "",
        has_backup: equipment.has_backup,
        last_backup_date: equipment.last_backup_date || "",
        commissioned_date: equipment.commissioned_date || "",
        decommissioned_date: equipment.decommissioned_date || "",
        kspd_access: equipment.kspd_access,
        internet_access: equipment.internet_access,
        arcsight_connection: equipment.arcsight_connection,
        remote_access: equipment.remote_access || "",
        internet_forwarding: equipment.internet_forwarding || "",
        listening_ports: equipment.listening_ports || "",
        documentation: equipment.documentation || "",
        related_tickets: equipment.related_tickets || "",
      });

      setStorage(equipment.storage || []);
      setIpAddresses(equipment.ip_addresses?.map(ip => ({
        id: ip.id,
        ip_address: ip.ip_address,
        subnet_mask: ip.subnet_mask,
        vlan: ip.vlan,
        dns_name: ip.dns_name
      })) || []);
      setPasswords(equipment.passwords?.map(pass => ({
        id: pass.id,
        username: pass.username,
        password: pass.password,
        description: pass.description
      })) || []);
    }
  }, [equipment, isEditing, reset]);

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      const equipmentData: any = {
        ...data,
        storage: storage.filter(s => s.name && s.size),
        ip_addresses: ipAddresses.filter(ip => ip.ip_address),
        passwords: passwords.filter(p => p.username && p.password),
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ equipmentId: id, data: equipmentData });
      } else {
        await createMutation.mutateAsync(equipmentData);
      }

      navigate("/equipment");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Storage management
  const addStorage = () => {
    setStorage([...storage, { name: "", size: "" }]);
  };

  const updateStorage = (index: number, field: keyof StorageEntry, value: string) => {
    const updated = [...storage];
    updated[index] = { ...updated[index], [field]: value };
    setStorage(updated);
  };

  const removeStorage = (index: number) => {
    setStorage(storage.filter((_, i) => i !== index));
  };

  // IP Address management
  const addIpAddress = () => {
    setIpAddresses([...ipAddresses, { ip_address: "", subnet_mask: "", vlan: "", dns_name: "" }]);
  };

  const updateIpAddress = (index: number, field: keyof IpAddressEntry, value: string) => {
    const updated = [...ipAddresses];
    updated[index] = { ...updated[index], [field]: value };
    setIpAddresses(updated);
  };

  const removeIpAddress = (index: number) => {
    setIpAddresses(ipAddresses.filter((_, i) => i !== index));
  };

  // Password management
  const addPassword = () => {
    setPasswords([...passwords, { username: "", password: "", description: "" }]);
  };

  const updatePassword = (index: number, field: keyof PasswordEntry, value: string) => {
    const updated = [...passwords];
    updated[index] = { ...updated[index], [field]: value };
    setPasswords(updated);
  };

  const removePassword = (index: number) => {
    setPasswords(passwords.filter((_, i) => i !== index));
  };

  const togglePasswordVisibility = (index: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (isLoadingEquipment && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/equipment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Редактирование оборудования" : "Добавление оборудования"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Изменение параметров существующего оборудования" : "Создание нового оборудования в системе"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Основное</TabsTrigger>
            <TabsTrigger value="technical">Технические</TabsTrigger>
            <TabsTrigger value="network">Сеть</TabsTrigger>
            <TabsTrigger value="additional">Дополнительно</TabsTrigger>
          </TabsList>

          {/* General Information Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>
                  Базовые параметры оборудования
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipment_id">ID оборудования *</Label>
                    <Input
                      id="equipment_id"
                      {...register("equipment_id")}
                      placeholder="SRV-001"
                    />
                    {errors.equipment_id && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.equipment_id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Сервер приложений"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="type">Тип оборудования *</Label>
                    <Select
                      value={watch("type")}
                      onValueChange={(value) => setValue("type", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className="w-4 h-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Статус *</Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(value) => setValue("status", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`w-4 h-4 ${option.color}`} />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                  {equipmentType === "Виртуальный сервер" && (
                    <>
                      <div>
                        <Label htmlFor="vmware_name">VMware имя</Label>
                        <Input
                          id="vmware_name"
                          {...register("vmware_name")}
                          placeholder="vm-app-server-01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parent_equipment">Родительское оборудование</Label>
                        <Input
                          id="parent_equipment"
                          {...register("parent_equipment")}
                          placeholder="SRV-HOST-001"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="hostname">Hostname</Label>
                    <Input
                      id="hostname"
                      {...register("hostname")}
                      placeholder="app-server-01.domain.local"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Расположение</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="Стойка A1, позиция 10-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Подробное описание назначения и функций оборудования"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Information Tab */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Технические характеристики</CardTitle>
                <CardDescription>
                  Параметры производительности и конфигурации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipmentType === "Виртуальный сервер" && (
                    <>
                      <div>
                        <Label htmlFor="virtual_cpu">Количество виртуальных CPU</Label>
                        <Input
                          id="virtual_cpu"
                          type="number"
                          {...register("virtual_cpu", { valueAsNumber: true })}
                          placeholder="4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vmware_level">Уровень VMware</Label>
                        <Input
                          id="vmware_level"
                          {...register("vmware_level")}
                          placeholder="ESXi 7.0"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="ram">Оперативная память</Label>
                    <Input
                      id="ram"
                      {...register("ram")}
                      placeholder="16 GB DDR4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="specifications">Технические характеристики</Label>
                    <Textarea
                      id="specifications"
                      {...register("specifications")}
                      placeholder="CPU: Intel Xeon E5-2620, RAM: 32GB, Storage: 2x 1TB SSD"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Storage Configuration */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Хранилища</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addStorage}>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить хранилище
                    </Button>
                  </div>
                  
                  {storage.length === 0 ? (
                    <Alert>
                      <HardDrive className="h-4 w-4" />
                      <AlertDescription>
                        Хранилища не добавлены. Нажмите кнопку выше для добавления.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {storage.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Input
                              placeholder="Название хранилища"
                              value={item.name}
                              onChange={(e) => updateStorage(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Размер (например, 1TB SSD)"
                              value={item.size}
                              onChange={(e) => updateStorage(index, "size", e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStorage(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Backup Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={hasBackup}
                      onCheckedChange={(checked) => setValue("has_backup", checked)}
                    />
                    <Label>Резервное копирование настроено</Label>
                  </div>

                  {hasBackup && (
                    <div>
                      <Label htmlFor="last_backup_date">Дата последнего резервного копирования</Label>
                      <Input
                        id="last_backup_date"
                        type="date"
                        {...register("last_backup_date")}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commissioned_date">Дата ввода в эксплуатацию</Label>
                    <Input
                      id="commissioned_date"
                      type="date"
                      {...register("commissioned_date")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="decommissioned_date">Дата вывода из эксплуатации</Label>
                    <Input
                      id="decommissioned_date"
                      type="date"
                      {...register("decommissioned_date")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Information Tab */}
          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Сетевая конфигурация</CardTitle>
                <CardDescription>
                  IP-адреса, сетевые настройки и доступы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* IP Addresses */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">IP-адреса</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addIpAddress}>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить IP-адрес
                    </Button>
                  </div>
                  
                  {ipAddresses.length === 0 ? (
                    <Alert>
                      <Network className="h-4 w-4" />
                      <AlertDescription>
                        IP-адреса не добавлены. Нажмите кнопку выше для добавления.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {ipAddresses.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Input
                              placeholder="IP-адрес"
                              value={item.ip_address}
                              onChange={(e) => updateIpAddress(index, "ip_address", e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Маска подсети"
                              value={item.subnet_mask}
                              onChange={(e) => updateIpAddress(index, "subnet_mask", e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="VLAN"
                              value={item.vlan}
                              onChange={(e) => updateIpAddress(index, "vlan", e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="DNS имя"
                              value={item.dns_name || ""}
                              onChange={(e) => updateIpAddress(index, "dns_name", e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIpAddress(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Access Settings */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Сетевые доступы</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={watch("kspd_access")}
                        onCheckedChange={(checked) => setValue("kspd_access", checked)}
                      />
                      <Label>Доступ к КСПД</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={watch("internet_access")}
                        onCheckedChange={(checked) => setValue("internet_access", checked)}
                      />
                      <Label>Доступ в интернет</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={watch("arcsight_connection")}
                        onCheckedChange={(checked) => setValue("arcsight_connection", checked)}
                      />
                      <Label>Подключение к ArcSight</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remote_access">Удаленный доступ</Label>
                    <Textarea
                      id="remote_access"
                      {...register("remote_access")}
                      placeholder="RDP: 3389, SSH: 22"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="internet_forwarding">Проброс в интернет</Label>
                    <Textarea
                      id="internet_forwarding"
                      {...register("internet_forwarding")}
                      placeholder="HTTP: 80 -> 8080, HTTPS: 443 -> 8443"
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="listening_ports">Прослушиваемые порты</Label>
                    <Textarea
                      id="listening_ports"
                      {...register("listening_ports")}
                      placeholder="TCP: 80, 443, 3306; UDP: 53, 161"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Учетные записи</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPassword}>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить учетную запись
                    </Button>
                  </div>
                  
                  {passwords.length === 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Учетные записи не добавлены. Нажмите кнопку выше для добавления.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {passwords.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Input
                              placeholder="Логин"
                              value={item.username}
                              onChange={(e) => updatePassword(index, "username", e.target.value)}
                            />
                          </div>
                          <div className="flex-1 relative">
                            <Input
                              type={showPasswords[index] ? "text" : "password"}
                              placeholder="Пароль"
                              value={item.password}
                              onChange={(e) => updatePassword(index, "password", e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                              onClick={() => togglePasswordVisibility(index)}
                            >
                              {showPasswords[index] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Описание"
                              value={item.description || ""}
                              onChange={(e) => updatePassword(index, "description", e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePassword(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Дополн��тельная информация</CardTitle>
                <CardDescription>
                  Документация, связанные задачи и прочие заметки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documentation">Документация</Label>
                  <Textarea
                    id="documentation"
                    {...register("documentation")}
                    placeholder="Ссылки на документацию, инструкции по настройке и использованию"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="related_tickets">Связанные задачи</Label>
                  <Textarea
                    id="related_tickets"
                    {...register("related_tickets")}
                    placeholder="Номера задач, заявок или проектов связанных с этим оборудованием"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/equipment")}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Сохранить изменения" : "Создать оборудование"}
          </Button>
        </div>
      </form>
    </div>
  );
}
