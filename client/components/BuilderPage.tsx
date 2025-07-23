import { builder, BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { registerBuilderComponents } from '@/components/builder';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-state';

// Инициализация Builder.io
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY;

if (BUILDER_API_KEY) {
  builder.init(BUILDER_API_KEY);
  // Регистрируем компоненты
  registerBuilderComponents();
} else {
  console.warn('Builder.io API key is missing. Please add VITE_BUILDER_API_KEY to your .env.local file');
}

interface BuilderPageProps {
  model?: string;
  path?: string;
  urlPath?: string;
}

export function BuilderPage({ 
  model = 'page', 
  path = '',
  urlPath 
}: BuilderPageProps) {
  const [builderContent, setBuilderContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPreviewing = useIsPreviewing();

  useEffect(() => {
    if (!BUILDER_API_KEY) {
      setError('Builder.io API key не настроен');
      setLoading(false);
      return;
    }

    const targetPath = urlPath || path || window.location.pathname;

    // Получаем контент из Builder.io
    builder
      .get(model, {
        userAttributes: {
          urlPath: targetPath,
        },
      })
      .promise()
      .then((content) => {
        setBuilderContent(content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки Builder.io контента:', err);
        setError('Не удалось загрузить контент');
        setLoading(false);
      });
  }, [model, path, urlPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Загрузка контента...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-destructive mb-2">Ошибка Builder.io</h2>
        <p className="text-muted-foreground">{error}</p>
        {!BUILDER_API_KEY && (
          <div className="mt-4 p-4 bg-muted rounded-md text-sm">
            <p>Для работы с Builder.io необходимо:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Зарегистрироваться н�� <a href="https://builder.io" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">builder.io</a></li>
              <li>Получить API ключ в настройках</li>
              <li>Добавить VITE_BUILDER_API_KEY в .env.local файл</li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (!builderContent && !isPreviewing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Страница не найдена</h2>
        <p className="text-muted-foreground">
          Контент для этой страницы не найден в Builder.io
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Путь: {urlPath || path || window.location.pathname}
        </p>
      </div>
    );
  }

  return (
    <BuilderComponent 
      model={model} 
      content={builderContent} 
      apiKey={BUILDER_API_KEY}
    />
  );
}

export default BuilderPage;
