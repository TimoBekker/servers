import { Builder } from '@builder.io/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Обертки для компонентов с текстом
export const CardTitleWrapper = ({
  text,
  className,
  ...props
}: {
  text?: string;
  className?: string;
}) => (
  <CardTitle className={className} {...props}>
    {text}
  </CardTitle>
);

export const CardDescriptionWrapper = ({
  text,
  className,
  ...props
}: {
  text?: string;
  className?: string;
}) => (
  <CardDescription className={className} {...props}>
    {text}
  </CardDescription>
);

export const ButtonWrapper = ({
  text,
  onClick,
  variant = "default",
  size = "default",
  disabled = false,
  ...props
}: {
  text?: string;
  onClick?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  [key: string]: any;
}) => (
  <Button
    variant={variant}
    size={size}
    disabled={disabled}
    onClick={
      onClick
        ? () => {
            try {
              eval(onClick);
            } catch (e) {
              console.error("Button onClick error:", e);
            }
          }
        : undefined
    }
    {...props}
  >
    {text}
  </Button>
);

export const BadgeWrapper = ({
  text,
  variant = "default",
  ...props
}: {
  text?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  [key: string]: any;
}) => (
  <Badge variant={variant} {...props}>
    {text}
  </Badge>
);

// Кастомный компонент для отображения статистики
export const StatsDisplay = ({
  title = "Статистика",
  apiEndpoint = "/api/dashboard/stats",
}: {
  title?: string;
  apiEndpoint?: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Данные из API: {apiEndpoint}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Этот компонент может отображать динамические данные из вашего Laravel
          API
        </p>
      </CardContent>
    </Card>
  );
};

// Функция для регистрации всех компонентов
export function registerBuilderComponents() {
  const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

  if (!BUILDER_API_KEY) {
    console.warn("Builder.io API key is missing");
    return;
  }

  Builder.init(BUILDER_API_KEY);

  // Регистрация Card
  Builder.registerComponent(Card, {
    name: "Card",
    inputs: [
      {
        name: "className",
        type: "string",
        defaultValue: "",
      },
    ],
    canHaveChildren: true,
  });

  // Регистрация CardHeader
  Builder.registerComponent(CardHeader, {
    name: "CardHeader",
    inputs: [
      {
        name: "className",
        type: "string",
        defaultValue: "",
      },
    ],
    canHaveChildren: true,
  });

  // Регистрация CardTitle с текстом
  Builder.registerComponent(CardTitleWrapper, {
    name: "CardTitle",
    inputs: [
      {
        name: "text",
        type: "string",
        defaultValue: "Заголовок",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "",
      },
    ],
    canHaveChildren: false,
  });

  // Регистрация CardDescription с текстом
  Builder.registerComponent(CardDescriptionWrapper, {
    name: "CardDescription",
    inputs: [
      {
        name: "text",
        type: "string",
        defaultValue: "Описание",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "",
      },
    ],
    canHaveChildren: false,
  });

  // Регистрация CardContent
  Builder.registerComponent(CardContent, {
    name: "CardContent",
    inputs: [
      {
        name: "className",
        type: "string",
        defaultValue: "",
      },
    ],
    canHaveChildren: true,
  });

  // Регистрация Button
  Builder.registerComponent(ButtonWrapper, {
    name: "Button",
    inputs: [
      {
        name: "text",
        type: "string",
        defaultValue: "Кнопка",
      },
      {
        name: "variant",
        type: "string",
        enum: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ],
        defaultValue: "default",
      },
      {
        name: "size",
        type: "string",
        enum: ["default", "sm", "lg", "icon"],
        defaultValue: "default",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
      },
      {
        name: "onClick",
        type: "string",
        defaultValue: "",
        helperText: "JavaScript код для выполнения при клике",
      },
    ],
    canHaveChildren: false,
  });

  // Регистрация Badge
  Builder.registerComponent(BadgeWrapper, {
    name: "Badge",
    inputs: [
      {
        name: "text",
        type: "string",
        defaultValue: "Badge",
      },
      {
        name: "variant",
        type: "string",
        enum: ["default", "secondary", "destructive", "outline"],
        defaultValue: "default",
      },
    ],
    canHaveChildren: false,
  });

  // Регистрация StatsDisplay
  Builder.registerComponent(StatsDisplay, {
    name: "StatsDisplay",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Статистика",
      },
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/dashboard/stats",
        helperText: "URL эндпоинта для получения данных",
      },
    ],
    canHaveChildren: false,
  });

  console.log("Builder.io components registered successfully");
}
