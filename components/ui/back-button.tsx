"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const BackButton = ({ 
  label = "Back", 
  className, 
  variant = "outline",
  size = "default"
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      {label && <span>{label}</span>}
    </Button>
  );
};

export default BackButton;
