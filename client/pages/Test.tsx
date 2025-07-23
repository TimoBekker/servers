export default function Test() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Тестовая страница</h1>
      <p>Если вы видите эту страницу, то базовое приложение работает.</p>
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p>Текущее время: {new Date().toLocaleString()}</p>
        <p>
          Builder API Key:{" "}
          {import.meta.env.VITE_BUILDER_API_KEY ? "Настроен" : "Отсутствует"}
        </p>
      </div>
    </div>
  );
}
