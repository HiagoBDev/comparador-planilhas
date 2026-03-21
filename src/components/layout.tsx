import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ArrowLeftIcon, TableIcon } from "@phosphor-icons/react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
            {!isHome && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => navigate("/")}
                aria-label="Voltar"
              >
                <ArrowLeftIcon className="size-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TableIcon className="size-4" weight="bold" />
              </div>
              <h1 className="text-base font-semibold tracking-tight">
                Comparador da <strong className="text-primary">Bonitinha</strong>
              </h1>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
