"use client";

import { useTheme } from "next-themes";
import { SidebarMenuButton } from "./sidebar";
import { Moon, Sun } from "lucide-react";

const ToggleButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <SidebarMenuButton
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      tooltip={theme === "dark" ? "Light Mode" : "Dark Mode"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </SidebarMenuButton>
  );
};

export default ToggleButton;
