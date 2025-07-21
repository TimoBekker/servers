import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
        <Construction className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        {description ||
          "Эта страница находится в разработке"}
      </p>
    </div>
  );
}
