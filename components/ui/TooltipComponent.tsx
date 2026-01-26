"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const TooltipComponent = ({
  name,
  trimedName,
}: {
  name: string;
  trimedName: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <h1 className="cursor-pointer">{trimedName}</h1>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="center"
          className="max-w-xs text-center wrap-break-word"
        >
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
