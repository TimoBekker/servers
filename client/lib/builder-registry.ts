import { builder } from '@builder.io/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Инициализация Builder.io (если еще не инициализирован)
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

if (BUILDER_API_KEY) {
  builder.init(BUILDER_API_KEY);
}

// Регистрация кастомного компонента - Card
builder.registerComponent(Card, {
  name: 'Card',
  inputs: [
    {
      name: 'className',
      type: 'string',
      defaultValue: '',
    },
  ],
  canHaveChildren: true,
  defaultChildren: [
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'CardHeader',
      },
    },
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'CardContent',
      },
    },
  ],
});

// Регистрация компонента CardHeader
builder.registerComponent(CardHeader, {
  name: 'CardHeader',
  inputs: [
    {
      name: 'className',
      type: 'string',
      defaultValue: '',
    },
  ],
  canHaveChildren: true,
  defaultChildren: [
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'CardTitle',
        options: {
          text: 'Заголовок карточки',
        },
      },
    },
  ],
});

// Регистрация компонента CardTitle
builder.registerComponent(CardTitle, {
  name: 'CardTitle',
  inputs: [
    {
      name: 'text',
      type: 'string',
      defaultValue: 'Заголовок',
    },
    {
      name: 'className',
      type: 'string',
      defaultValue: '',
    },
  ],
  canHaveChildren: false,
});

// Регистрация компонента CardDescription
builder.registerComponent(CardDescription, {
  name: 'CardDescription',
  inputs: [
    {
      name: 'text',
      type: 'string',
      defaultValue: 'Описание карточки',
    },
    {
      name: 'className',
      type: 'string',
      defaultValue: '',
    },
  ],
  canHaveChildren: false,
});

// Регистрация компонента CardContent
builder.registerComponent(CardContent, {
  name: 'CardContent',
  inputs: [
    {
      name: 'className',
      type: 'string',
      defaultValue: '',
    },
  ],
  canHaveChildren: true,
});

// Регистрация компонента Button
builder.registerComponent(Button, {
  name: 'Button',
  inputs: [
    {
      name: 'text',
      type: 'string',
      defaultValue: 'Кнопка',
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      defaultValue: 'default',
    },
    {
      name: 'size',
      type: 'string',
      enum: ['default', 'sm', 'lg', 'icon'],
      defaultValue: 'default',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'onClick',
      type: 'string',
      defaultValue: '',
      helperText: 'JavaScript код для выполнения при клике',
    },
  ],
  canHaveChildren: false,
});

// Регистрация компонента Badge
builder.registerComponent(Badge, {
  name: 'Badge',
  inputs: [
    {
      name: 'text',
      type: 'string',
      defaultValue: 'Badge',
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['default', 'secondary', 'destructive', 'outline'],
      defaultValue: 'default',
    },
  ],
  canHaveChildren: false,
});

// Кастомный компонент для отображения статистики из Laravel API
const StatsDisplay = ({ title, apiEndpoint }: { title?: string; apiEndpoint?: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Статистика'}</CardTitle>
        <CardDescription>
          Данные из API: {apiEndpoint || 'не указан'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Этот компонент может отображать динамические данные из вашего Laravel API
        </p>
      </CardContent>
    </Card>
  );
};

builder.registerComponent(StatsDisplay, {
  name: 'StatsDisplay',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Статистика',
    },
    {
      name: 'apiEndpoint',
      type: 'string',
      defaultValue: '/api/dashboard/stats',
      helperText: 'URL эндпоинта для получения данных',
    },
  ],
  canHaveChildren: false,
});

export { builder };