import { useThemeStore } from "@/application/store/theme-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
          }
        >
          {theme === "dark" ? (
            <SunIcon className="size-5" />
          ) : (
            <MoonIcon className="size-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {theme === "dark" ? "Tema claro" : "Tema escuro"}
      </TooltipContent>
    </Tooltip>
  );
}
