import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuestionIcon } from "@phosphor-icons/react";

interface HelpPopoverProps {
  children: ReactNode;
}

export function HelpPopover({ children }: HelpPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-10 shrink-0 rounded-md bg-primary/10 hover:bg-primary/20 text-primary cursor-pointer data-[state=open]:bg-primary/20 data-[state=open]:text-primary"
          aria-label="Ajuda"
        >
          <QuestionIcon className="size-6" weight="bold" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-xs text-sm leading-relaxed">
        {children}
      </PopoverContent>
    </Popover>
  );
}
