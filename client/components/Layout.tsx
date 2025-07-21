import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Server,
  Monitor,
  Package,
  FileText,
  Calendar,
  BookOpen,
  BarChart3,
  Home,
  HardDrive,
  Download,
  Settings,
  Users,
  Activity,
  Shield,
  User,
  UserCog,
  FileSearch,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Главная",
    href: "/",
    icon: Home,
  },
  {
    name: "Оборудование",
    href: "/equipment",
    icon: Server,
  },
  {
    name: "ИС",
    href: "/information-systems",
    icon: Monitor,
  },
  {
    name: "ПО",
    href: "/software",
    icon: Package,
    children: [
      {
        name: "Дистрибутивы ПО",
        href: "/software/distributions",
        icon: Download,
      },
      {
        name: "Установленное ПО",
        href: "/software/installed",
        icon: HardDrive,
      },
    ],
  },
  {
    name: "Контракты",
    href: "/contracts",
    icon: FileText,
  },
  {
    name: "События",
    href: "/events",
    icon: Calendar,
  },
  {
    name: "Справочники",
    href: "/directories",
    icon: BookOpen,
  },
  {
    name: "Отчеты",
    href: "/reports",
    icon: BarChart3,
    children: [
      {
        name: "Ответственные за ИС",
        href: "/reports/responsible",
        icon: Users,
      },
      {
        name: "Используемые ресурсы",
        href: "/reports/resources",
        icon: Activity,
      },
      {
        name: "Используемые лицензии",
        href: "/reports/licenses",
        icon: Shield,
      },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand parent menus if we're on a child page
    const initialExpanded: string[] = [];
    navigation.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          location.pathname.startsWith(child.href)
        );
        if (hasActiveChild) {
          initialExpanded.push(item.name);
        }
      }
    });
    return initialExpanded;
  });

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isCurrentPath = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-sidebar">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-sidebar-primary rounded-md">
              <Server className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              Servers 2.0
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <div>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isCurrentPath(item.href)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedItems.includes(item.name) ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      {expandedItems.includes(item.name) && (
                        <ul className="mt-2 ml-6 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                to={child.href}
                                className={cn(
                                  "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                  isCurrentPath(child.href)
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                              >
                                <child.icon className="w-4 h-4" />
                                <span>{child.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isCurrentPath(item.href)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-background border-b border-border">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              Система учета серверного оборудования и ИС
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-md bg-muted hover:bg-accent transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
