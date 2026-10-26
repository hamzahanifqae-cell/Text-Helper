import * as Icons from "lucide-react";
import { FileQuestion, type LucideProps } from "lucide-react";

type IconComponent = React.ComponentType<LucideProps>;

export function ToolIcon({ name, ...props }: { name: string } & LucideProps) {
  const IconsMap = Icons as unknown as Record<string, IconComponent>;
  const Icon = IconsMap[name] ?? FileQuestion;
  return <Icon {...props} />;
}
