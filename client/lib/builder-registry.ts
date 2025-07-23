import { builder } from '@builder.io/react';

// Инициализация Builder.io (если еще не инициализирован)
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

if (BUILDER_API_KEY) {
  builder.init(BUILDER_API_KEY);
}

// Экспортируем builder для использования в других файлах
export { builder };

// Функция для инициализации компонентов
export function initBuilderComponents() {
  console.log('Builder.io components initialized');
}
