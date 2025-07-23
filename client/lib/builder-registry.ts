import { Builder } from "@builder.io/react";

// Инициализация Builder.io (если еще не инициализирован)
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

if (BUILDER_API_KEY) {
  Builder.init(BUILDER_API_KEY);
}

// Экспортируем Builder для использования в других файлах
export { Builder };

// Функция для инициализации компонентов
export function initBuilderComponents() {
  console.log("Builder.io components initialized");
}
